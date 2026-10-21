// Copia build/release-notes.md como descripcion de la release en GitHub (la que
// lee la pagina web) y le pone titulo. electron-builder solo las mete en latest.yml.
// Uso: node tools/notas-release.js ["Titulo de la version"]
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkg = require('../package.json');
const { owner, repo } = pkg.build.publish[0];
const token = process.env.GH_TOKEN || execSync('node tools/leer-token.js', { cwd: path.join(__dirname, '..') }).toString().trim();
const body = fs.readFileSync(path.join(__dirname, '..', 'build', 'release-notes.md'), 'utf8').trim();
const titulo = process.argv[2];
const api = `https://api.github.com/repos/${owner}/${repo}/releases`;
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };

(async () => {
  const r = await fetch(`${api}/tags/v${pkg.version}`, { headers });
  if (!r.ok) throw new Error(`No encontre la release v${pkg.version} (${r.status})`);
  const rel = await r.json();
  const patch = await fetch(`${api}/${rel.id}`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ body, ...(titulo ? { name: titulo } : {}) }),
  });
  if (!patch.ok) throw new Error(`GitHub respondio ${patch.status}: ${await patch.text()}`);
  console.log(`Notas de v${pkg.version} actualizadas en GitHub.`);
})().catch((e) => { console.error(e.message); process.exit(1); });
