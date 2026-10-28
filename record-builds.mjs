// Preserve source snapshots and a separate consecutive public-build ledger.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('./',import.meta.url));
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
const milestones={
  '764c848':'Hide fullscreen controls in standalone app windows',
  '2563c3b':'Illustrate Safari installation steps with vector icons',
  'bc51f0c':'Add offline PWA installation and safe update controls',
  '1f3072e':'Add standalone visual field guide and illustrated About',
  '8c30ebc':'Polish mobile landing layout, guide access and cue preview',
  '2f41a16':'Replace emoji-prone landing glyphs with SVG',
  '849399d':'Add bilingual landing page and interactive cue preview',
  'c7c29df':'Add a clear drill-guide entry and remove footer tagline',
  '5d3b616':'Remove footer tagline',
};
const publicCommits={
  '764c848':'0ae9864cf5b8516089b9dfa02b47b5ea819ba4cf',
  '2563c3b':'a3c5fdfd28c13a081a1a30947c75a83dc77202c6',
  'bc51f0c':'4217a1677f4a6f6985ef5f70955879c5e6225cc8',
  '1f3072e':'6c61b453f64c4e7b199ac5111a98fc2d0add777a',
  '8c30ebc':'bd8d24a0fed885114c2178cea97823b936898e07',
  '849399d':'98933c0d6209737e415414ceba8b4f39af2d48ba',
  'c7c29df':'647c714a25e422c9fcd2a1db57f6a88879e8e031'
};
const priorPath=resolve(root,'build-history.json');
const prior=existsSync(priorPath)?JSON.parse(readFileSync(priorPath,'utf8')):{};
let rows=null;
try{rows=git('log','--reverse','--format=%H%x00%aI%x00%s','HEAD').split('\n').filter(Boolean);}catch{}
let snapshots=rows?rows.map((row,index)=>{
  const [commit,date,subject]=row.split('\0');
  let files=[],cache=null;
  try{files=git('diff-tree','--root','--no-commit-id','--name-only','-r',commit).split('\n').filter(Boolean);}catch{}
  try{cache=git('show',commit+':dist/sw.js').match(/const VERSION='([^']+)'/)?.[1]||null;}catch{}
  return {build:`build-${String(index+1).padStart(3,'0')}`,commit,date,summary:milestones[commit.slice(0,7)]||subject,files,cache_version:cache,public_commit:publicCommits[commit.slice(0,7)]||null};
}):[];
if(rows===null){snapshots=prior.snapshots||[];}
else{
  const seen=new Set(snapshots.map(item=>item.commit));
  const retained=(prior.snapshots||[]).filter(item=>!seen.has(item.commit));
  snapshots=[...retained,...snapshots].map((item,index)=>({...item,build:`build-${String(index+1).padStart(3,'0')}`}));
}
const release=JSON.parse(readFileSync(resolve(root,'release.json'),'utf8'));
const stages=[
  {version:'1.6.0',name:'Training foundation',summary:'Earlier training-tool development consolidated as a historical baseline.'},
  {version:'1.7.0',name:'Field guide',summary:'Landing page, bilingual visual guide and illustrated About.'},
  {version:'1.8.0',name:'Offline PWA',summary:'Home Screen installation, verified offline files and explicit updates.'},
  {version:'1.8.1',name:'Safari steps',summary:'Illustrated Safari installation instructions.'},
  {version:'1.8.2',name:'Standalone layout',summary:'Hide redundant fullscreen controls in standalone windows.'}
];
const boundaries=[
  ['849399d','1.7.0'],['bc51f0c','1.8.0'],['2563c3b','1.8.1'],['764c848','1.8.2']
];
const normalizeVersion=value=>typeof value==='string'&&/^0\.[678]\./.test(value)?'1.'+value.slice(2):value;
const oldSnapshots=new Map((prior.snapshots||[]).map(item=>[item.commit,item]));
const semver=/^\d+\.\d+\.\d+$/;
let stage='1.6.0',pastBaseline=false;
snapshots=snapshots.map(item=>{
  const boundary=boundaries.find(([prefix])=>item.commit.startsWith(prefix));
  if(boundary)stage=boundary[1];
  const previous=normalizeVersion(oldSnapshots.get(item.commit)?.stage_version);
  let stageVersion=stage;
  if(pastBaseline)stageVersion=semver.test(previous||'')?previous:semver.test(prior.current_release?.version||'')?normalizeVersion(prior.current_release.version):release.version;
  const result={...item,stage_version:stageVersion};
  if(item.commit===release.historical_baseline_commit)pastBaseline=true;
  return result;
});
const known=new Map(stages.map(item=>[item.version,{...item,retrospective:true}]));
for(const item of prior.versions||[]){const version=normalizeVersion(item.version);if(semver.test(version)&&!known.has(version))known.set(version,{...item,version});}
known.set(release.version,{version:release.version,name:release.name,name_zh:release.name_zh,date:release.date,tag:release.tag,summary:release.summary,retrospective:false});
const versions=[...known.values()].map(item=>({...item,source_commits:snapshots.filter(snapshot=>snapshot.stage_version===item.version).map(snapshot=>snapshot.commit)}));
const history={schema:3,description:'Feature-stage and patch versions, separate from raw source snapshots. Historical stages are retrospective groupings, not claims of previously published tags. Every source snapshot is retained; small internal saves do not each create a public release. Source IDs and public GitHub IDs differ.',current_release:release,versions,snapshots};
writeFileSync(resolve(root,'build-history.json'),JSON.stringify(history,null,2)+'\n');
console.log(`Recorded ${snapshots.length} source snapshots; current version v${release.version} ${release.name}.`);
