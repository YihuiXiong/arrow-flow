import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('./',import.meta.url));
const site=existsSync(resolve(root,'dist/index.html'))?resolve(root,'dist'):root;
const files=new Set(['index.html','landing.html','manifest.webmanifest','favicon.svg','apple-touch-icon.png','icon-192.png','icon-512.png']);
for(const page of ['index.html','landing.html']){
  const html=readFileSync(resolve(site,page),'utf8');
  for(const match of html.matchAll(/(?:src|href)=["']\.\/([^"'#]+)["']/g)){
    const [name]=match[1].split('?');
    if(existsSync(resolve(site,name)))files.add(match[1]);
  }
}
const resources=[...files].sort();
const digest=createHash('sha256');
for(const name of resources)digest.update(name).update(readFileSync(resolve(site,name.split('?')[0])));
const version=digest.update(readFileSync(resolve(root,'service-worker.template.js'))).digest('hex').slice(0,16);
const integrity=Object.fromEntries(resources.map(name=>[name,'sha256-'+createHash('sha256').update(readFileSync(resolve(site,name.split('?')[0]))).digest('base64')]));
let worker=readFileSync(resolve(root,'service-worker.template.js'),'utf8');
worker=worker.replace('__CACHE_VERSION__',version).replace('__PRECACHE_URLS__',JSON.stringify(resources)).replace('__PRECACHE_INTEGRITY__',JSON.stringify(integrity));
writeFileSync(resolve(site,'sw.js'),worker);
console.log(`PWA cache ${version}: ${resources.length} resources.`);
