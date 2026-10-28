import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));
const site = existsSync(resolve(root, 'dist/index.html')) ? resolve(root, 'dist') : root;
const file = resolve(site, 'index.html');
let html = readFileSync(file, 'utf8');
for (const name of ['styles.css', 'theme.js', 'i18n.js', 'app.js', 'info.js']) {
  const hash = createHash('sha256').update(readFileSync(resolve(site, name))).digest('hex').slice(0,12);
  const pattern = new RegExp(`(["'])\\./${name.replace('.', '\\.')}(?:\\?[^"']*)?\\1`, 'g');
  html = html.replace(pattern, `"./${name}?v=${hash}"`);
}
writeFileSync(file, html);
console.log('Updated asset versions.');
