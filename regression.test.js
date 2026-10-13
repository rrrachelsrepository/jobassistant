import test from 'node:test';
import assert from 'node:assert/strict';
import {profileFor,upsertRecord} from '../extension/tracker.js';
test('unused direction never inherits another profile',()=>{
 const sets={marketing:{name:'A',facts:'KOL'}};
 assert.deepEqual(profileFor(sets,'sales',{name:'',facts:''}),{name:'',facts:''});
 const value=profileFor(sets,'marketing');value.name='B';assert.equal(sets.marketing.name,'A');
});
const base={id:'one',company:'公司',role:'岗位',direction:'营销',mode:'校招',date:'首次记录',state:'草稿已准备'};
test('repeated save updates the existing record without duplicate IDs',()=>{
 const rows=upsertRecord([base],{...base,id:'two',state:'已手动发送'});
 assert.equal(rows.length,1);assert.equal(rows[0].id,'one');assert.equal(rows[0].state,'已手动发送');assert.equal(rows[0].date,'首次记录');assert.equal(base.state,'草稿已准备');
});
test('editing an existing row changes company and state, different roles remain separate',()=>{
 const rows=upsertRecord([base],{...base,company:'新公司',state:'已手动发送'},'one');assert.equal(rows[0].company,'新公司');
 assert.equal(upsertRecord([base],{...base,id:'two',role:'新岗位'}).length,2);
 assert.throws(()=>upsertRecord([],{...base},'one'),/不存在/);
});
