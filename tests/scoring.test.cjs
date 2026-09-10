const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ctx = vm.createContext({console, window:{setTimeout(){}}, setTimeout});
for (const f of ['data','scoring','chat-engine']) vm.runInContext(readFileSync(`js/${f}.js`,'utf8'),ctx);
vm.runInContext('appendMessage = () => {}; scrollChatToBottom = () => {};',ctx);
const scenarios = vm.runInContext('scenarios',ctx);
let checks = 0;
function check(value) { assert.ok(value); checks++; }
for (const s of scenarios) {
 const el = s.requiredElements.find(e=>e.key==='환자성명확인');
 check(ctx.gradeNotifyText(s.patient.name+'님',[el]).includedCount===1);
 check(ctx.gradeNotifyText(s.patient.name[0],[el]).includedCount===0);
 check(ctx.gradeNotifyText('성함 확인',[el]).includedCount===0);
 for(const el of s.requiredElements.filter(e=>!e.allowAffirmativeConfirmation))
  check(!ctx.gradeNotifyText('네',[el],{forceIncludedKeys:[el.key]}).checklist[0].included);
}
const s3 = scenarios.find(s=>s.id==='scn_03');
const session = {scenario:s3}; ctx.initNotifyConversation(session);
// Isolate grouped vital reporting to exercise consecutive partial answers.
session.scenario = s3;
ctx.handleNotifySubmit(session,'903호 배영숙님 호흡곤란 22:15 혈압 130/80',null,null,'의사');
check(!session.askedKeys.includes('활력징후'));
ctx.handleNotifySubmit(session,'맥박 118',null,null,'의사');
check(!session.lastGrade.checklist.find(e=>e.key==='활력징후').included);
check(session.pendingFollowUpKey==='활력징후');
ctx.handleNotifySubmit(session,'네',null,null,'의사');
check(!session.lastGrade.checklist.find(e=>e.key==='활력징후').included);
const s6=scenarios.find(s=>s.id==='scn_06');
const stop=s6.requiredElements.find(e=>e.key==='수혈중단');
check(ctx.gradeNotifyText('네',[stop],{forceIncludedKeys:[stop.key]}).includedCount===1);
for(const s of scenarios.filter(s=>s.id!=='scn_03')) {
 const el=s.requiredElements.find(e=>e.key==='활력징후'); if(!el) continue;
 const g=ctx.gradeNotifyText('',[el]);
 const q=ctx.buildNotifyFollowUp(g,g.checklist,[el],[]);
 check(q.question===ctx.buildFollowUpQuestion(el));
}
check(ctx.buildScn03VitalFollowUp([true,true,false,false,false]).includes('체온'));
console.log(`${checks} regression checks passed`);
