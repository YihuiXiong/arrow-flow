import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=import.meta.dirname;
const dist=existsSync(resolve(root,'dist/index.html'))?resolve(root,'dist'):root;
const worker=readFileSync(resolve(dist,'sw.js'),'utf8');
function harness(scope){
  const handlers={},stores=new Map(),calls={network:0,skip:0,claim:0};
  let offline=false,corrupt=false;
  const key=v=>typeof v==='string'?v:v.url;
  const fetcher=async request=>{
    calls.network++;
    if(offline)throw new TypeError('Simulated network unavailable');
    const url=new URL(key(request)),name=url.pathname.slice(new URL(scope).pathname.length)||'index.html';
    let body=readFileSync(resolve(dist,name));
    if(corrupt&&name==='styles.css')body=Buffer.from('changed during deployment');
    if(request.integrity)assert.equal('sha256-'+createHash('sha256').update(body).digest('base64'),request.integrity,'Integrity mismatch');
    return new Response(body,{status:200});
  };
  const cacheAPI={
    keys:async()=>[...stores.keys()],
    delete:async name=>stores.delete(name),
    open:async name=>{
      if(!stores.has(name))stores.set(name,new Map());
      const entries=stores.get(name);
      return {match:async req=>entries.get(key(req))?.clone(),addAll:async reqs=>{
        const responses=await Promise.all(reqs.map(fetcher));
        reqs.forEach((req,i)=>entries.set(key(req),responses[i]));
      }};
    }
  };
  const context={self:{registration:{scope},clients:{claim:async()=>calls.claim++},skipWaiting:async()=>calls.skip++,addEventListener:(name,cb)=>handlers[name]=cb},caches:cacheAPI,Request,Response,URL,fetch:fetcher};
  vm.runInNewContext(worker,context);
  const lifecycle=async name=>{let pending;handlers[name]({waitUntil:p=>pending=p});await pending;};
  const request=async(path,{mode='navigate',method='GET'}={})=>{
    let response;handlers.fetch({request:{url:new URL(path,scope).href,method,mode},respondWith:p=>response=p});return response?await response:null;
  };
  const message=async type=>{let pending,value;handlers.message({data:{type},ports:[{postMessage:v=>value=v}],waitUntil:p=>pending=p});await pending;return value;};
  return {stores,calls,lifecycle,request,message,setOffline:v=>offline=v,setCorrupt:v=>corrupt=v,cacheAPI};
}
for(const scope of ['https://example.test/arrow-flow/','https://example.test/']){
  const h=harness(scope);
  await h.lifecycle('install');assert.equal(h.calls.skip,0,'Installing must not force an update');
  await h.lifecycle('activate');assert.equal(h.calls.claim,1);
  assert.equal((await h.message('OFFLINE_STATUS')).ready,true);
  h.setOffline(true);const previousCalls=h.calls.network;
  for(const page of ['./','./?source=pwa','index.html','landing.html?view=guide']){
    const response=await h.request(page);assert.equal(response.status,200);assert.match(await response.text(),/<!doctype html>/i);
  }
  const html=await(await h.request('index.html')).text();
  const assets=[...html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)].map(m=>m[1]);
  for(const asset of assets){const response=await h.request(asset,{mode:'cors'});assert.equal(response.status,200,asset);}
  for(const asset of ['icon-192.png','icon-512.png','manifest.webmanifest'])assert.equal((await h.request(asset,{mode:'cors'})).status,200);
  assert.equal(h.calls.network,previousCalls,'Cached training pages and assets must not need a network');
  assert.equal(await h.request('https://other.test/article'),null,'Do not intercept external articles');
  if(scope.endsWith('/arrow-flow/'))assert.equal(await h.request('../unrelated/'),null,'Scope must not capture other projects');
  assert.equal(await h.request('index.html',{method:'POST'}),null);
  assert.equal((await h.request('unknown.html')).status,503);
  await h.message('ACTIVATE_UPDATE');assert.equal(h.calls.skip,1);
  const prefix='arrow-flow:'+new URL(scope).pathname+':';
  const unrelated='different-project:cache';h.stores.set(unrelated,new Map());
  for(const v of ['old1','old2','old3'])h.stores.set(prefix+v,new Map());
  const oldURL=new URL('styles.css?v=old3',scope).href;h.stores.get(prefix+'old3').set(oldURL,new Response('old-css'));
  await h.lifecycle('activate');assert.ok(h.stores.has(unrelated));assert.ok(!h.stores.has(prefix+'old1'));assert.ok(h.stores.has(prefix+'old3'));
  assert.equal(await(await h.request('styles.css?v=old3',{mode:'cors'})).text(),'old-css');
  const current=[...h.stores.keys()].find(n=>n.startsWith(prefix)&&!n.includes('old'));
  const currentEntries=h.stores.get(current),iconURL=new URL('icon-192.png',scope).href;
  currentEntries.delete(iconURL);assert.equal((await h.message('OFFLINE_STATUS')).ready,false);
  assert.equal((await h.message('REPAIR_OFFLINE')).ready,false,'Offline repair cannot falsely report success');
  h.setOffline(false);assert.equal((await h.message('REPAIR_OFFLINE')).ready,true);assert.equal((await h.message('OFFLINE_STATUS')).ready,true);
  console.log('PASS offline navigation, cached assets, status, recovery and lifecycle:',scope);
}
const bad=harness('https://example.test/arrow-flow/');bad.stores.set('existing-working-cache',new Map());bad.setCorrupt(true);
await assert.rejects(()=>bad.lifecycle('install'),/Integrity mismatch/);
assert.deepEqual([...bad.stores.keys()],['existing-working-cache'],'A partial deployment must not replace a working cache');
console.log('PASS integrity mismatch rejects an incomplete deployment without deleting existing caches.');
