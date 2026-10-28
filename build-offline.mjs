import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Works in the Sites checkout (dist/) and the GitHub Pages repository root.
const root = fileURLToPath(new URL('./', import.meta.url));
const site = existsSync(resolve(root, 'dist/index.html')) ? resolve(root, 'dist') : root;
const read = name => readFileSync(resolve(site, name), 'utf8');
let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="\.\/styles\.css(?:\?[^"]*)?">/, () => `<style>\n${read('styles.css')}</style>`);
for (const name of ['theme.js', 'i18n.js', 'app.js']) {
  html = html.replace(new RegExp(`<script src="\\./${name.replace('.', '\\.')}(?:\\?[^"]*)?"></script>`), () => `<script>\n${read(name)}</script>`);
}
html = html.replace('href="./favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(read('favicon.svg'))}"`);
html = html.replace('href="./apple-touch-icon.png"', () => `href="data:image/png;base64,${readFileSync(resolve(site, 'apple-touch-icon.png')).toString('base64')}"`);
const output = resolve(process.argv[2] || resolve(root, 'Arrow-Flow-Offline.html'));
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html);
console.log(output);
