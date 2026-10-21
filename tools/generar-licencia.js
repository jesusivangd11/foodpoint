// Genera una licencia de Mesana para un cliente. Solo funciona en la PC que tiene
// la clave privada (por defecto en %USERPROFILE%\.mesana-licencias\clave-privada.pem).
// Esa clave NUNCA se sube a GitHub ni se copia al instalador.
//
// Uso:
//   node tools/generar-licencia.js --cliente "Loncheria La Esquina" --plan Pro
//   node tools/generar-licencia.js --cliente "Tacos Lupita" --plan Mensual --vence 2026-12-31
//   node tools/generar-licencia.js --cliente "Cafe Norte" --plan Pro --equipo 1A2B-3C4D-5E6F
//
// --vence   fecha AAAA-MM-DD en que deja de funcionar (sin ella es permanente)
// --equipo  ID del equipo que aparece en Ajustes > Licencia (sin el sirve en cualquier equipo)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { signLicense, verifyLicense } = require('../license');

const args = {};
process.argv.slice(2).forEach((arg, i, all) => {
  if (arg.startsWith('--')) args[arg.slice(2)] = all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true;
});

if (!args.cliente) {
  console.log('Falta --cliente "Nombre del negocio". Ejemplo:\n  node tools/generar-licencia.js --cliente "Loncheria La Esquina" --plan Pro');
  process.exit(1);
}
if (args.vence && !/^\d{4}-\d{2}-\d{2}$/.test(args.vence)) {
  console.log('--vence debe ir como AAAA-MM-DD, por ejemplo 2027-01-31');
  process.exit(1);
}

const keyPath = process.env.MESANA_LICENSE_KEY || path.join(os.homedir(), '.mesana-licencias', 'clave-privada.pem');
if (!fs.existsSync(keyPath)) {
  console.log(`No se encontro la clave privada en ${keyPath}`);
  process.exit(1);
}

const registro = path.join(path.dirname(keyPath), 'licencias-emitidas.csv');
const previas = fs.existsSync(registro) ? fs.readFileSync(registro, 'utf8').trim().split('\n').length - 1 : 0;
const id = `L-${String(previas + 1).padStart(4, '0')}`;

const payload = {
  v: 1,
  id,
  n: String(args.cliente),
  p: String(args.plan || 'Pro'),
  e: args.vence || null,
  m: args.equipo ? String(args.equipo).toUpperCase() : null,
  t: new Date().toISOString().slice(0, 10),
};
const licencia = signLicense(payload, fs.readFileSync(keyPath, 'utf8'));
const check = verifyLicense(licencia, { machine: payload.m || undefined, now: new Date(0) });
if (!check.ok) {
  console.error('La licencia generada no pasa la verificacion:', check.error);
  process.exit(1);
}

if (!fs.existsSync(registro)) fs.writeFileSync(registro, 'id,fecha,cliente,plan,vence,equipo,licencia\n');
fs.appendFileSync(registro, [id, payload.t, `"${payload.n.replace(/"/g, '""')}"`, payload.p, payload.e || '', payload.m || '', licencia].join(',') + '\n');

console.log(`\nLicencia ${id} para ${payload.n} (plan ${payload.p}${payload.e ? `, vence ${payload.e}` : ', permanente'}${payload.m ? `, solo equipo ${payload.m}` : ''}):\n`);
console.log(licencia + '\n');
console.log(`Guardada en el registro: ${registro}`);
