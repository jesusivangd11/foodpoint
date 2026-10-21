// Imprime el token de GitHub guardado fuera del repo, sin BOM ni espacios.
// Lo usa "Publicar actualizacion.cmd".
const fs = require('fs');
const path = require('path');
const file = path.join(process.env.USERPROFILE || '', '.mesana-licencias', 'github-token.txt');
try {
  process.stdout.write(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').trim());
} catch (e) { /* sin archivo: el .cmd avisa */ }
