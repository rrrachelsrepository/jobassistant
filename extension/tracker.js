export const NEXT_STEPS=['待投递','待笔试','待面试','待反馈','待跟进','已获Offer','已结束'];
export function csv(rows){
 const fields=[['company','公司'],['next','下一步'],['role','岗位'],['mode','类型'],['direction','方向'],['to','投递邮箱'],['state','状态'],['date','记录时间'],['source','来源'],['note','备注']];
 const cell=v=>'"'+String(v??'').replace(/^[\s]*[=+@-]/,s=>"'"+s).replace(/"/g,'""')+'"';
 return '\ufeff'+[fields.map(x=>cell(x[1])).join(','),...rows.map(r=>fields.map(x=>cell(r[x[0]])).join(','))].join('\r\n');
}
export function tailoredDraft(text,p,mode='intern',role=''){
 const name=p.name||'【待补充】',school=p.school||'【待补充】',major=p.major||'【待补充】';
 const arrival=p.startDate||'【到岗日期待填写】';
 const schedule=mode==='campus'?`我是${school}${major}专业${p.graduation||'【待补充】'}毕业生${name}，希望应聘${role||'【岗位待补充】'}。`:`我是${school}${major}专业学生${name}，希望应聘${role||'【岗位待补充】'}。我可于${arrival}到岗，每周出勤${p.days||'【待补充】'}天，可持续实习${p.months||'【待补充】'}个月。`;
 return {subject:`应聘${role||'【岗位待补充】'}-${name}-${school}`,body:`尊敬的招聘负责人：\n\n您好！\n\n${schedule}\n\n${p.facts||'【待补充相关经历】'}\n\n随信附上个人简历。${p.website?'作品集：'+p.website:''}\n\n感谢您拨冗阅读，期待进一步沟通！\n\n${name}${p.phone?'\n电话：'+p.phone:''}${p.email?'\n邮箱：'+p.email:''}`,mode:mode==='campus'?'校招基础草稿':'实习基础草稿'};
}
