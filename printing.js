// Impresion en impresoras termicas de RED (ESC/POS por TCP, puerto 9100).
// Las impresoras USB instaladas en Windows se imprimen desde Electron (main.js);
// las dos rutas reciben el mismo "documento": una lista de renglones.
//
//   { ancho: 80 | 58, lineas: [
//       { tipo: 'texto', texto, alinear: 'izq'|'centro'|'der', tam: 'normal'|'alto'|'grande', negrita },
//       { tipo: 'fila', izq, der, tam, negrita },
//       { tipo: 'linea' },          // separador punteado
//       { tipo: 'espacio' },        // renglon en blanco
//   ] }
const net = require('net');

const ESC = 0x1b;
const GS = 0x1d;

// Las termicas traen la tabla PC850 (Latin-1 de DOS); con ella salen bien
// acentos, ñ y signos de apertura. Lo que no este aqui se manda sin acento.
const CP850 = {
  'á': 0xa0, 'é': 0x82, 'í': 0xa1, 'ó': 0xa2, 'ú': 0xa3, 'ñ': 0xa4, 'Ñ': 0xa5, 'ü': 0x81, 'Ü': 0x9a,
  'Á': 0xb5, 'É': 0x90, 'Í': 0xd6, 'Ó': 0xe0, 'Ú': 0xe9, '¿': 0xa8, '¡': 0xad, '°': 0xf8, '·': 0xfa,
};

function encode(text) {
  const out = [];
  for (const ch of String(text ?? '')) {
    const code = ch.charCodeAt(0);
    if (code < 0x80) out.push(code);
    else if (CP850[ch] !== undefined) out.push(CP850[ch]);
    else {
      const plain = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
      out.push(plain && plain.charCodeAt(0) < 0x80 ? plain.charCodeAt(0) : 0x3f);
    }
  }
  return out;
}

function columnas(ancho, tam) {
  const base = Number(ancho) === 58 ? 32 : 48;
  return tam === 'grande' ? Math.floor(base / 2) : base;
}

// Parte un texto en renglones que quepan en el ancho del papel.
function envolver(texto, cols) {
  const out = [];
  String(texto ?? '').split('\n').forEach((parrafo) => {
    // La sangria inicial (variantes, piezas del combo) se respeta en cada renglon.
    const sangria = (parrafo.match(/^ */)[0] || '').slice(0, Math.floor(cols / 3));
    cols -= sangria.length;
    const inicio = out.length;
    let linea = '';
    parrafo.split(/\s+/).filter(Boolean).forEach((palabra) => {
      while (palabra.length > cols) {
        if (linea) { out.push(linea); linea = ''; }
        out.push(palabra.slice(0, cols));
        palabra = palabra.slice(cols);
      }
      if (!linea) linea = palabra;
      else if ((linea + ' ' + palabra).length <= cols) linea += ' ' + palabra;
      else { out.push(linea); linea = palabra; }
    });
    out.push(linea);
    for (let i = inicio; i < out.length; i++) out[i] = sangria + out[i];
    cols += sangria.length;
  });
  return out;
}

function escposDesdeDocumento(doc) {
  const ancho = doc.ancho || 80;
  const b = [];
  const push = (...xs) => xs.forEach((x) => (Array.isArray(x) ? b.push(...x) : b.push(x)));
  const tamano = (tam) => push(GS, 0x21, tam === 'grande' ? 0x11 : tam === 'alto' ? 0x01 : 0x00);
  const alinear = (a) => push(ESC, 0x61, a === 'centro' ? 1 : a === 'der' ? 2 : 0);
  const negrita = (on) => push(ESC, 0x45, on ? 1 : 0);

  push(ESC, 0x40);        // reiniciar
  push(ESC, 0x74, 2);     // tabla de caracteres PC850
  (doc.lineas || []).forEach((l) => {
    if (l.tipo === 'linea') {
      tamano('normal'); alinear('izq'); negrita(false);
      push(encode('-'.repeat(columnas(ancho, 'normal'))), 0x0a);
      return;
    }
    if (l.tipo === 'espacio') { push(0x0a); return; }
    tamano(l.tam); negrita(!!l.negrita);
    const cols = columnas(ancho, l.tam);
    if (l.tipo === 'fila') {
      alinear('izq');
      const der = String(l.der ?? '');
      const izqLineas = envolver(l.izq, Math.max(4, cols - der.length - 1));
      izqLineas.forEach((txt, i) => {
        const fin = i === izqLineas.length - 1 ? der : '';
        push(encode(txt + ' '.repeat(Math.max(1, cols - txt.length - fin.length)) + fin), 0x0a);
      });
      return;
    }
    alinear(l.alinear);
    envolver(l.texto, cols).forEach((txt) => push(encode(txt), 0x0a));
  });
  tamano('normal'); negrita(false); alinear('izq');
  push(0x0a, 0x0a, 0x0a, 0x0a);
  push(GS, 0x56, 0x42, 0x00); // avanzar y cortar el papel
  return Buffer.from(b);
}

function enviarARed({ host, port = 9100, datos, timeoutMs = 5000 }) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let listo = false;
    const fin = (err) => {
      if (listo) return;
      listo = true;
      socket.destroy();
      err ? reject(err) : resolve();
    };
    socket.setTimeout(timeoutMs, () => fin(new Error(`La impresora ${host}:${port} no respondió. Revisa que esté encendida y conectada a la red.`)));
    socket.on('error', (e) => fin(new Error(`No se pudo conectar con la impresora ${host}:${port} (${e.code || e.message}).`)));
    socket.connect(Number(port), host, () => {
      socket.write(datos, () => socket.end());
    });
    socket.on('close', () => fin());
  });
}

async function imprimirEnRed({ host, port, documento, copias = 1 }) {
  if (!host) throw new Error('Falta la IP de la impresora.');
  const datos = escposDesdeDocumento(documento);
  for (let i = 0; i < Math.max(1, Math.min(5, Number(copias) || 1)); i++) {
    await enviarARed({ host, port, datos });
  }
}

module.exports = { escposDesdeDocumento, imprimirEnRed, envolver, columnas };
