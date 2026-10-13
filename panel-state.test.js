import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
function setup(local={}){
 const nodes=new Map();class Element{constructor(){this.value='';this.textContent='';this.options=[];this.handlers={};this.disabled=false;this.checked=false;this.hidden=false}add(o){this.options.push(o);if(!this.value)this.value=o.value}append(...xs){for(const x of xs)if(x?.id)nodes.set(x.id,x)}replaceChildren(...xs){this.options=[];this.append(...xs)}addEventListener(type,fn){(this.handlers[type]??=[]).push(fn)}scrollIntoView(){}focus(){}async emit(type){for(const fn of this.handlers[type]||[])await fn({});if(this['on'+type])await this['on'+type]({})}}
 const html=fs.readFileSync(new URL('../extension/panel.html',import.meta.url),'utf8');for(const id of html.matchAll(/id="([^"]+)"/g))nodes.set(id[1],new Element());
 for(const [id,values] of Object.entries({direction:['海外营销 / KOL','品牌 / 整合营销','外贸 / 海外销售'],jobMode:['campus','intern'],mailService:['qq','163'],recordState:['草稿已准备','已手动发送'],provider:['openai','deepseek'],ocrMode:['openai']}))for(const v of values)nodes.get(id).add({value:v});
 globalThis.Option=class{constructor(text,value){this.text=text;this.value=value}};
 globalThis.document={querySelector:s=>nodes.get(s.slice(1)),createElement:()=>new Element(),querySelectorAll:()=>[],addEventListener(){}};
 const area=data=>({get:async keys=>Object.fromEntries([].concat(keys).map(k=>[k,data[k]])),set:async values=>Object.assign(data,structuredClone(values)),remove:async keys=>[].concat(keys).forEach(k=>delete data[k])});
 globalThis.chrome={storage:{local:area(local),session:area({}),onChanged:{addListener(){}}},runtime:{getURL:s=>s},permissions:{},downloads:{}};globalThis.confirm=()=>true;
 return {nodes,local};
}
test('profile switching and reopening retain isolation; repeated record save updates status',async()=>{
 let env=setup({profileSets:{'海外营销 / KOL':{name:'营销资料'}},lastDirection:'外贸 / 海外销售'});
 await import('../extension/panel.js?regression=first');assert.equal(env.nodes.get('p-name').value,'');
 env.nodes.get('p-name').value='销售新资料';await env.nodes.get('p-name').emit('input');
 env.nodes.get('direction').value='海外营销 / KOL';await env.nodes.get('direction').emit('change');assert.equal(env.nodes.get('p-name').value,'营销资料');assert.equal(env.local.profileSets['外贸 / 海外销售'].name,'销售新资料');
 const data=structuredClone(env.local);data.lastDirection='外贸 / 海外销售';env=setup(data);await import('../extension/panel.js?regression=second');assert.equal(env.nodes.get('p-name').value,'销售新资料');
 env.nodes.get('company').value='公司';env.nodes.get('role').value='外贸';await env.nodes.get('saveRecord').emit('click');env.nodes.get('recordState').value='已手动发送';await env.nodes.get('saveRecord').emit('click');assert.equal(env.local.records.length,1);assert.equal(env.local.records[0].state,'已手动发送');
});
