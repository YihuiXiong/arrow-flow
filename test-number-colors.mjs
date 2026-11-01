import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('./dist/app.js',import.meta.url),'utf8');
const extract=name=>{const start=source.indexOf(`function ${name}(`);const end=source.indexOf('\n}',start)+2;assert(start>=0&&end>start);return source.slice(start,end);};
const elements=new Map();
const $=id=>{if(!elements.has(id))elements.set(id,{value:'',style:{setProperty(k,v){this[k]=v;}},classList:{add(){},toggle(){}},setAttribute(){}});return elements.get(id);};
const context=vm.createContext({$,Math:Object.create(Math),state:'idle',round:0,lastNumberColor:-1,config:{mode:'numbers',numberMin:1,numberMax:5,numberColors:['#d83842','#245fbd'],numberInkMode:'custom',numberInk:'#f3cf46',numberInkColors:['#ffffff','#17221b'],duration:1000,rounds:0},randomNumber:()=>3,show(){},cue(){},updatePhase(){},updateCounter(){},schedule(){},blank(){},t:s=>s});
vm.runInContext([extract('lightNumberBackground'),extract('complementaryNumberColor'),extract('numberInkColor'),extract('showArrow')].join('\n'),context);
vm.runInContext('showArrow()',context);
assert.equal($('number-cue').style.color,'#f3cf46');
assert.equal($('number-cue').textContent,3);
context.config.numberInkMode='auto';vm.runInContext('showArrow()',context);
assert.equal($('number-cue').style.color,'','Auto must clear a previously customized inline color');
context.config.numberInkMode='random';
context.Math.random=()=>0;vm.runInContext('showArrow()',context);assert.equal($('number-cue').style.color,'#ffffff');
context.Math.random=()=>.99999;vm.runInContext('showArrow()',context);assert.equal($('number-cue').style.color,'#17221b');
assert.notEqual($('stage').style['--number-bg'],undefined);
console.log('PASS actual cue rendering: custom ink, automatic reset, random palette endpoints, independent background and number.');

for(const [background,expected] of [['#245fbd','#bd8224'],['#ff0000','#00ffff'],['#00ff00','#ff00ff'],['#0000ff','#ffff00'],['#ffffff','#252925'],['#000000','#ffffff']]){
 assert.equal(vm.runInContext(`complementaryNumberColor('${background}')`,context),expected);
}
context.config.numberInkMode='complementary';
vm.runInContext('showArrow()',context);
const background=$('stage').style['--number-bg'];
assert.equal($('number-cue').style.color,vm.runInContext(`complementaryNumberColor('${background}')`,context));
context.Math.random=()=>0;vm.runInContext('showArrow()',context);
assert.notEqual($('stage').style['--number-bg'],background);
assert.equal($('number-cue').style.color,vm.runInContext(`complementaryNumberColor('${$('stage').style['--number-bg']}')`,context));
console.log('PASS complementary hues, gray fallback and cue text following each new background.');
