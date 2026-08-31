const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const copies = [
  [path.join(root, '.next', 'static'), path.join(root, '.next', 'standalone', '.next', 'static')],
  [path.join(root, 'public'), path.join(root, '.next', 'standalone', 'public')],
];

for (const [source, destination] of copies) {
  if (!fs.existsSync(source)) continue;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

console.log('Copied static assets into the Azure standalone package.');
