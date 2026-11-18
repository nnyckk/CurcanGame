'use strict';
// ===== ACHIEVEMENTS =====
// 13 lucruri de făcut în joc, doar de colecționat
const ACH=[
  {id:'pofta',name:'POFTĂ BUNĂ!',desc:'AJUNGI LA RESTAURANTUL MESOPOTAMIA.'},
  {id:'pene',name:'PANĂ PESTE PANĂ',desc:'STRÂNGI TOATE CELE 15 PENE DE AUR.'},
  {id:'bogatas',name:'BOGĂTAȘ',desc:'IEI TOȚI CEI 50 DE BĂNUȚI DIN NIVELUL BONUS.'},
  {id:'zgarietura',name:'FĂRĂ ZGÂRIETURĂ',desc:'TERMINI UN NIVEL FĂRĂ SĂ FII LOVIT.'},
  {id:'ziua',name:'ZIUA CURCANULUI',desc:'ÎL ÎNVINGI PE FERMIERUL-ȘEF FĂRĂ SĂ FII LOVIT.'},
  {id:'combo',name:'COMBO DE CURCAN',desc:'SARI ÎN CAP LA 4 DUȘMANI LA RÂND, FĂRĂ SĂ ATINGI SOLUL.'},
  {id:'fulger',name:'FULGER',desc:'TERMINI UN NIVEL CU CEL PUȚIN 200 DE SECUNDE RĂMASE.'},
  {id:'nemuritor',name:'NEMURITOR',desc:'TERMINI TOT JOCUL FĂRĂ SĂ PIERZI NICIO VIAȚĂ.'},
  {id:'umbra',name:'UMBRĂ ÎN NOAPTE',desc:'TERMINI ORA DE CULCARE FĂRĂ SĂ TE VADĂ VREUN FERMIER.'},
  {id:'vultur',name:'OCHI DE VULTUR',desc:'NIMEREȘTI 2UP LA BLOCUL DIN CAFENEA.'},
  {id:'cap',name:'CAP TARE',desc:'AI DAT DE 30 DE ORI CU CAPUL ÎN BLOCUL GOL.',secret:true},
  {id:'inot',name:'CURCANII NU ÎNOATĂ',desc:'AI CĂZUT ÎN APĂ DE 10 ORI.',secret:true},
  {id:'autogol',name:'AUTOGOL',desc:'TE-AI ARUNCAT ÎN AER CU PROPRIA BOMBĂ.',secret:true},
];
const ACH_KEY=TEST?'curcan_ach_test':'curcan_ach';
let ACH_SAVE={},achToasts=[];   // achToasts = casetele de „deblocat”
try{ACH_SAVE=JSON.parse(localStorage.getItem(ACH_KEY)||'{}')||{};}catch(e){}
const achGot=id=>!!ACH_SAVE[id];
const achCount=()=>ACH.filter(a=>achGot(a.id)).length;
// quiet = fără casetă
function achUnlock(id,quiet){
  if(achGot(id)||!ACH.some(a=>a.id===id))return;
  ACH_SAVE[id]=Date.now();try{localStorage.setItem(ACH_KEY,JSON.stringify(ACH_SAVE));}catch(e){}
  if(!quiet)achToasts.push({id,t:0});
}
// La pornire: ce ai făcut deja în jocurile trecute
function achRetro(){if(goldOK())achUnlock('pene',true);if(MOS.wins>0)achUnlock('pofta',true);}
// La finalul unui nivel
function achLevelClear(){
  const def=LEVELS[G.level];if(!def||def.arena)return;
  if(goldOK())achUnlock('pene');
  if(def.bonus){if((G.lvlCoins||0)>=50)achUnlock('bogatas');return;}
  if(!G.lvlHurt)achUnlock('zgarietura');
  if(G.time>=200)achUnlock('fulger');
  if(def.id==='noapte'&&!G.lvlSeen)achUnlock('umbra');
}
// Caseta: coboară de sus, stă cam 2,7 secunde
const ACH_IN=12,ACH_STAY=160;
function updateAch(){const a=achToasts[0];if(!a)return;if(a.t===0)sfx.ach();if(++a.t>ACH_IN*2+ACH_STAY)achToasts.shift();}
function drawAchToast(){
  const a=achToasts[0];if(!a)return;const d=ACH.find(x=>x.id===a.id);
  const k=a.t<ACH_IN?a.t/ACH_IN:a.t>ACH_IN+ACH_STAY?Math.max(0,1-(a.t-ACH_IN-ACH_STAY)/ACH_IN):1,e=1-(1-k)**3;
  const w=Math.max(150,[...d.name].length*6+34),h=30,x=Math.round(W/2-w/2),y=Math.round(-h-4+(h+22)*e);
  uiBox(x,y,w,h,'#2a1f08','#ffd23f','#3a2c0c','#140e04');
  icon(CUP_ICON,x+8,y+12,'#ffd23f');
  txt('ACHIEVEMENT!',x+22,y+5,'#ffd23f',1,'l',null);txt(d.name,x+22,y+17,'#ffffff',1,'l',null);
  // O steluță care sclipește pe marginea casetei
  const t=a.t%40;if(t<12){const sx=x+w-8,sy=y+6;ctx.fillStyle='#fff3b0';ctx.fillRect(sx-1,sy,3,1);ctx.fillRect(sx,sy-1,1,3);}
}
// ---- Pagina din meniu ----
// Insigna din meniul principal, în dreapta celei cu penele
function achBadgeRect(){const g=goldBadgeRect(),s=achCount()+'/'+ACH.length;return {x:g.x+g.w+4,y:H-19,w:99+[...s].length*6,h:15,s};}
function drawAchBadge(b,on){
  const {x,y,w,h,s}=b,ty=y+4;
  if(on)uiBox(x,y,w,h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(x,y,w,h);
  icon(CUP_ICON,x+5,ty,on?'#ffffff':'#ffd23f');
  txt('ACHIEVEMENTS',x+15,ty,on?'#ffffff':'#ffd23f',1,'l',on?'#7a0a10':null);txt(s,x+w-6,ty,'#ffffff',1,'r',on?'#7a0a10':null);
}
// Căsuțele din pagină: cupa aurie și numele
const achRects=items=>items.map((it,i)=>it.ach?{it,x:i%2?W/2+2:W/2-182,y:38+(i>>1)*15,w:180,h:13}:{it,x:W/2-48,y:194,w:96,h:15});
function drawAchCell(b,on){
  const a=ACH.find(x=>x.id===b.it.ach),got=achGot(a.id),hid=a.secret&&!got;
  if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');
  else if(got)uiBox(b.x,b.y,b.w,b.h,'#3a2c0c','rgba(255,210,63,0.75)','#4a3a12','#1a1206');
  else uiBox(b.x,b.y,b.w,b.h);
  icon(CUP_ICON,b.x+4,b.y+3,on?'#ffffff':got?'#ffd23f':'#4a4466');
  txt(hid?'???':a.name,b.x+15,b.y+3,on?'#ffffff':got?'#ffe9a0':'#8a84a8',1,'l',on?'#7a0a10':null);
}
// Sub căsuțe: ce înseamnă cel ales
function drawAchInfo(){
  const it=MENU.ach[G.sel]||{},x=18,y=148,w=W-36,h=32;
  uiBox(x,y,w,h);
  if(it.ach){const a=ACH.find(q=>q.id===it.ach),got=achGot(a.id),hid=a.secret&&!got;
    txt(hid?'???':a.name,x+8,y+5,got?'#ffd23f':'#ffffff',1,'l',null);
    txt(got?'DEBLOCAT':a.secret?'SECRET':'BLOCAT',x+w-8,y+5,got?'#7fff7f':'#8a84a8',1,'r',null);
    txt(hid?'UN ACHIEVEMENT SECRET. ÎL VEI DESCOPERI SINGUR...':a.desc,x+8,y+18,'#d8e4f0',1,'l',null);}
  else{txt('ACHIEVEMENTS',x+8,y+5,'#ffd23f',1,'l',null);txt(achCount()+'/'+ACH.length,x+w-8,y+5,'#ffffff',1,'r',null);
    txt(`AI DEBLOCAT ${achCount()} DIN ${ACH.length}.`,x+8,y+18,'#d8e4f0',1,'l',null);}
}
// Săgețile în pagină: stânga / dreapta între coloane
function achMenuKey(code){
  const back=MENU.ach.length-1;let s=G.sel;
  if(s===back){if(code==='ArrowUp')s=back-1;else if(code==='ArrowDown')s=0;}
  else if(code==='ArrowLeft')s=s%2?s-1:s;
  else if(code==='ArrowRight')s=s%2?s:Math.min(s+1,back-1);
  else if(code==='ArrowUp')s=s>=2?s-2:back;
  else if(code==='ArrowDown')s=s+2<back?s+2:back;
  if(s!==G.sel){G.sel=s;sfx.blip();}
}
