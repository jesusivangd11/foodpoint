// Licencias de Mesana.
//
// Una licencia es un texto "MSN1.<datos>.<firma>": los datos (cliente, plan,
// vencimiento y, opcionalmente, el equipo) van firmados con la clave PRIVADA de
// Mesana, que solo existe en la PC de desarrollo (tools/generar-licencia.js).
// Aqui solo vive la clave PUBLICA: sirve para comprobar que la licencia es
// autentica, pero no para fabricar licencias nuevas. Todo funciona sin internet.
//
// Estados posibles:
//   activa   -> licencia valida
//   fundador -> instalaciones que ya vendian antes de existir las licencias
//   prueba   -> sin licencia, dentro de los dias de prueba
//   vencida  -> se acabo la prueba o la licencia expiro (hay que activar)
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAYWqLd8Nw2e3ge3jcr4nq1btEUf3sZZZ8ufUuwANOqB8=
-----END PUBLIC KEY-----`;

const TRIAL_DAYS = 30;
// Quien ya tenia ventas antes de esta fecha usaba Mesana antes de las licencias:
// se le respeta como "fundador" sin pedirle nada.
const FOUNDER_CUTOFF = '2026-10-22';

const b64url = {
  encode: (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  decode: (str) => Buffer.from(String(str).replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
};

// Identificador estable del equipo (MachineGuid de Windows). Se muestra en
// Ajustes para que el cliente lo mande si su licencia va amarrada al equipo.
let cachedMachineId = null;
function machineId() {
  if (cachedMachineId) return cachedMachineId;
  let raw = '';
  try {
    if (process.platform === 'win32') {
      const out = execSync('reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid', { encoding: 'utf8', windowsHide: true });
      raw = (out.match(/MachineGuid\s+REG_SZ\s+(\S+)/) || [])[1] || '';
    }
  } catch (e) { /* sin acceso al registro: se usa el nombre del equipo */ }
  if (!raw) raw = os.hostname();
  const hex = crypto.createHash('sha256').update('mesana:' + raw).digest('hex').toUpperCase();
  cachedMachineId = `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
  return cachedMachineId;
}

function signLicense(payload, privateKeyPem) {
  const data = b64url.encode(JSON.stringify(payload));
  const sig = crypto.sign(null, Buffer.from(data), privateKeyPem);
  return `MSN1.${data}.${b64url.encode(sig)}`;
}

// Devuelve { ok, payload } o { ok:false, error } con un mensaje entendible.
function verifyLicense(key, { now = new Date(), machine = machineId() } = {}) {
  const parts = String(key || '').trim().replace(/\s+/g, '').split('.');
  if (parts.length !== 3 || parts[0] !== 'MSN1') return { ok: false, error: 'La clave no tiene el formato de una licencia de Mesana.' };
  let payload;
  try {
    const valid = crypto.verify(null, Buffer.from(parts[1]), PUBLIC_KEY_PEM, b64url.decode(parts[2]));
    if (!valid) return { ok: false, error: 'La licencia no es válida (firma incorrecta).' };
    payload = JSON.parse(b64url.decode(parts[1]).toString('utf8'));
  } catch (e) {
    return { ok: false, error: 'La licencia está dañada. Cópiala completa, sin espacios.' };
  }
  if (payload.m && payload.m !== machine) {
    return { ok: false, error: `Esta licencia es para otro equipo (${payload.m}). El ID de este equipo es ${machine}.` };
  }
  if (payload.e && new Date(payload.e + 'T23:59:59') < now) {
    return { ok: false, expired: true, payload, error: `La licencia venció el ${payload.e}.` };
  }
  return { ok: true, payload };
}

function createLicenseStore(dataDir) {
  const file = path.join(dataDir, 'licencia.json');
  const read = () => {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return {}; }
  };
  const write = (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

  // La prueba empieza la primera vez que arranca una version con licencias.
  const stored = read();
  if (!stored.trialStart) write({ ...stored, trialStart: new Date().toISOString() });

  return {
    // firstSaleAt: fecha de la venta mas antigua (para reconocer a los fundadores).
    status(firstSaleAt) {
      const data = read();
      const base = { machineId: machineId(), trialDays: TRIAL_DAYS };
      if (data.key) {
        const check = verifyLicense(data.key);
        if (check.ok) {
          const p = check.payload;
          return { ...base, status: 'activa', holder: p.n, plan: p.p, licenseId: p.id, expires: p.e || null, boundToMachine: !!p.m };
        }
        if (check.expired) return { ...base, status: 'vencida', reason: check.error, holder: check.payload.n, plan: check.payload.p };
      }
      if (firstSaleAt && String(firstSaleAt) < FOUNDER_CUTOFF) {
        return { ...base, status: 'fundador', plan: 'Fundador', holder: null, expires: null };
      }
      const start = new Date(data.trialStart || Date.now());
      const left = Math.ceil(TRIAL_DAYS - (Date.now() - start.getTime()) / 864e5);
      if (left > 0) return { ...base, status: 'prueba', trialDaysLeft: left };
      return { ...base, status: 'vencida', reason: `Terminaron los ${TRIAL_DAYS} días de prueba.` };
    },
    activate(key) {
      const check = verifyLicense(key);
      if (!check.ok) return check;
      write({ ...read(), key: String(key).trim().replace(/\s+/g, ''), activatedAt: new Date().toISOString() });
      return check;
    },
  };
}

module.exports = { signLicense, verifyLicense, machineId, createLicenseStore, TRIAL_DAYS };
