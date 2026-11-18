'use strict';
// ===== ACHIEVEMENTS =====
// 16 lucruri de făcut în joc, doar de colecționat
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
  {id:'piroman',name:'PIROMAN',desc:'DOBORI 100 DE DUȘMANI CU PENELE DE FOC.'},
  {id:'glaciara',name:'ERA GLACIARĂ',desc:'L-AI ÎNGHEȚAT PE FERMIERUL-ȘEF CU PENELE DE GHEAȚĂ.',secret:true},
  {id:'nepot',name:'NEPOT ASCULTĂTOR',desc:'AI AJUNS DE 10 ORI LA CAFENEAUA LUI MOȘ CURCAN.',secret:true},
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
function achRetro(){if(goldOK())achUnlock('pene',true);if(MOS.wins>0)achUnlock('pofta',true);if(MOS.cafe>=10)achUnlock('nepot',true);}
// Dușmanii doborâți cu foc, adunați de la un joc la altul
function achBurn(){MOS.burns=(MOS.burns||0)+1;mosSave();if(MOS.burns>=100)achUnlock('piroman');}
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
  const w=46+Math.max(72,[...d.name].length*6),h=34,x=Math.round(W/2-w/2),y=Math.round(-h-4+(h+20)*e);
  uiBox(x,y,w,h,'#2a1f08','#ffd23f','#3a2c0c','#140e04');
  const art=achArt(d.id,'on');ctx.drawImage(art,x+3+art.ox,y+3+art.oy);
  txt('ACHIEVEMENT!',x+38,y+7,'#ffd23f',1,'l',null);txt(d.name,x+38,y+20,'#ffffff',1,'l',null);
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
// Cartonașele: câte 8 pe pagină, 4 pe rând
const ACH_PER=8,ACH_ROW=4,CARD_W=50,CARD_H=54,CARD_GAP=30,CARD_VGAP=8,CARD_PIC=31;   // CARD_PIC = înălțimea părții cu iconița
const LOCK_ICON=[".###.","#...#","#####","##.##","#####"];
const ARROW_L=["...#","..##",".###","####",".###","..##","...#"];
const achPages=()=>Math.ceil(ACH.length/ACH_PER);
// Indicii cartonașelor de pe pagina p, pe rânduri
function achPageRows(p){
  const rows=[];
  for(let i=p*ACH_PER;i<Math.min(ACH.length,(p+1)*ACH_PER);i++){const r=Math.floor((i-p*ACH_PER)/ACH_ROW);(rows[r]=rows[r]||[]).push(i);}
  return rows;
}
// Ce nu e pe pagina asta are w=0
function achRects(items){
  const p=G.achPage||0,out=items.map(it=>({it,x:0,y:0,w:0,h:0}));
  achPageRows(p).forEach((row,r)=>row.forEach((i,c)=>{const n=row.length;
    Object.assign(out[i],{x:Math.round(W/2-(n*CARD_W+(n-1)*CARD_GAP)/2)+c*(CARD_W+CARD_GAP),y:35+r*(CARD_H+CARD_VGAP),w:CARD_W,h:CARD_H});}));
  items.forEach((it,i)=>{
    if(it.label==='ÎNAPOI')Object.assign(out[i],{x:W/2-48,y:200,w:96,h:15});
    else if(it.pg&&(it.pg<0?p>0:p<achPages()-1))Object.assign(out[i],{x:it.pg<0?18:W-36,y:81,w:18,h:24});});
  return out;
}
// Trece la pagina vecină; r = rândul, last = ultimul cartonaș din el
function achFlip(d,r,last){
  const p=(G.achPage||0)+d;if(p<0||p>=achPages())return;
  G.achPage=p;
  if(G.sel!==ACH.length){const rows=achPageRows(p),row=rows[Math.min(r,rows.length-1)];G.sel=last?row[row.length-1]:row[0];}
  sfx.blip();
}
function drawAchCell(b,on){
  if(!b.w)return;
  const a=ACH.find(q=>q.id===b.it.ach),got=achGot(a.id),hid=a.secret&&!got,x=b.x,y=b.y-(on?2:0),ax=x+Math.round((b.w-ART_W)/2);   // cel ales se ridică puțin
  // Culorile: cartonaș, linia și fâșia cu numele
  const C=on?['#e8323e','#ffffff','#ff6a72','#a01822','#b81c28']:got?['#3a2c0c','rgba(255,210,63,0.9)','#4a3a12','#1a1206','#241a06']:['#1c1730','rgba(255,255,255,0.45)','#2c2645','#120e20','#120e20'];
  uiBox(x,y,b.w,b.h,C[0],C[1],C[2],C[3]);
  ctx.fillStyle=C[1];ctx.fillRect(x+1,y+CARD_PIC,b.w-2,1);ctx.fillStyle=C[4];ctx.fillRect(x+1,y+CARD_PIC+1,b.w-2,b.h-CARD_PIC-2);
  const art=achArt(a.id,got?'on':hid?'secret':'off'),ay=y+1+Math.round((CARD_PIC-1-ART_H)/2);   // iconița, la mijlocul părții de sus
  ctx.drawImage(art,ax+art.ox,ay+art.oy);
  if(!got&&!hid){const lx=x+b.w-9,ly=y+CARD_PIC-8;   // lacătul, cu contur
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])icon(LOCK_ICON,lx+dx,ly+dy,'#0c0a18');icon(LOCK_ICON,lx,ly,'#8a84a8');}
  if(got){const t=(G.t+ACH.indexOf(a)*37)%150;if(t<10){ctx.fillStyle='#ffffff';ctx.fillRect(x+b.w-8,y+5,3,1);ctx.fillRect(x+b.w-7,y+4,1,3);}}
  // Numele, cu litere mici
  const lines=hid?['???']:tinyWrap(a.name,b.w-6),col=on?'#ffffff':got?'#ffe9a0':'#8a84a8',ty=y+(lines.length>1?36:40);
  lines.forEach((l,i)=>{const lx=Math.round(x+b.w/2-tinyW(l)/2);if(on)tinyTxt(l,lx+1,ty+i*9+1,'#7a0a10');tinyTxt(l,lx,ty+i*9,col);});
}
// Săgețile de pe margini
function drawAchArrow(b,on){
  if(!b.w)return;
  if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(b.x,b.y,b.w,b.h);
  const rows=b.it.pg<0?ARROW_L:ARROW_L.map(r=>[...r].reverse().join('')),nudge=(G.t>>4)%2*b.it.pg;
  icon(rows,b.x+7+nudge,b.y+9,on?'#ffffff':'#d8e4f0');
}
// Sub cartonașe: bulinele paginilor și ce înseamnă cel ales
function drawAchInfo(){
  const n=achPages(),dx=Math.round(W/2-(n*9-4)/2);
  for(let i=0;i<n;i++)icon(DOT_ICON,dx+i*9,154,i===(G.achPage||0)?'#ffffff':'rgba(255,255,255,0.3)');
  const it=MENU.ach[G.sel]||{},x=18,y=162,w=W-36,h=32;
  uiBox(x,y,w,h);
  ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,y+15,w-16,1);   // linia dintre nume și descriere
  if(it.ach){const a=ACH.find(q=>q.id===it.ach),got=achGot(a.id),hid=a.secret&&!got;
    txt(hid?'???':a.name,x+8,y+5,got?'#ffd23f':'#ffffff',1,'l',null);
    txt(got?'DEBLOCAT':a.secret?'SECRET':'BLOCAT',x+w-8,y+5,got?'#7fff7f':'#8a84a8',1,'r',null);
    txt(hid?'UN ACHIEVEMENT SECRET. ÎL VEI DESCOPERI SINGUR...':a.desc,x+8,y+20,'#b8c4d8',1,'l',null);}
  else{txt('ACHIEVEMENTS',x+8,y+5,'#ffd23f',1,'l',null);txt(achCount()+'/'+ACH.length,x+w-8,y+5,'#ffffff',1,'r',null);
    txt(`AI DEBLOCAT ${achCount()} DIN ${ACH.length}.`,x+8,y+20,'#b8c4d8',1,'l',null);}
}
// Săgețile: la margine trec pagina; G.achX = de unde ai plecat spre ÎNAPOI
function achMenuKey(code){
  const back=ACH.length,rows=achPageRows(G.achPage||0),R=achRects(MENU.ach),s=G.sel;
  const cx=i=>R[i].x+R[i].w/2,near=(row,x)=>row.reduce((m,i)=>Math.abs(cx(i)-x)<Math.abs(cx(m)-x)?i:m);
  const go=i=>{if(i!==G.sel){G.sel=i;sfx.blip();}};
  if(s===back){
    if(code==='ArrowUp')go(near(rows[rows.length-1],G.achX||W/2));
    else if(code==='ArrowDown')go(near(rows[0],G.achX||W/2));
    else achFlip(code==='ArrowLeft'?-1:1,0,false);
    return;}
  const r=Math.max(0,rows.findIndex(row=>row.includes(s))),row=rows[r],c=row.indexOf(s);
  if(c<0){go(rows[0][0]);return;}
  if(code==='ArrowLeft'){if(c>0)go(row[c-1]);else achFlip(-1,r,true);}
  else if(code==='ArrowRight'){if(c<row.length-1)go(row[c+1]);else achFlip(1,r,false);}
  else if(code==='ArrowUp'){if(r>0)go(near(rows[r-1],cx(s)));else{G.achX=cx(s);go(back);}}
  else if(code==='ArrowDown'){if(r<rows.length-1)go(near(rows[r+1],cx(s)));else{G.achX=cx(s);go(back);}}
}
