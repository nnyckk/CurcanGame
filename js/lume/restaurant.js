'use strict';
// ===== RESTAURANTUL MESOPOTAMIA =====
// Ca MesoCafé, dar mai mare: cărămidă roșie, lemn, acoperiș în două ape
const RW=192,RH=136;
function doorRect(){return {x:goal.x*TS+83,y:192-RH+93,w:26,h:43};}
const restP=x0=>(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x0+px,py,w,h);};
// Döner: pită, carne, salată, roșii, ceapă, sos
const DONER_ROWS=[
"......kkkkkkkkkkkkkkkk........",
"....kkbbbbbbbbbbbbbbbbkk......",
"...kbbbBBBBbbbbbbbbbbbbbk.....",
"..kbbBBbbbbbbbbbbbbbbbbbbk....",
".kbbbbbbbbbbbbbbbbbbbbbbbbkg..",
".kbbmmmmmmmmmmmmmmmmmmmmmmgg..",
"kbbmMmmMmmmMmmMmmmMmmmMmmrggg.",
"kbbrrwwppwwrrwwppwwrrwwppgg...",
"kbgggggggggggggggggggggggk....",
".kbbbbbbbbbbbbbbbbbbbbbbk.....",
"..kkkkkkkkkkkkkkkkkkkkkk......"],DONER_PAL={k:'#3a2414',b:'#e8c890',B:'#f6e0b0',m:'#c8682a',M:'#8a3a18',r:'#d8282f',w:'#ffffff',p:'#9a3a9a',g:'#5ab83a'};
// Rotit și mărit, pixel cu pixel (ang în grade, spre dreapta-sus)
function rotPix(rows,pal,ang,sc){
  const h=rows.length,w=Math.max(...rows.map(r=>r.length)),a=-ang*Math.PI/180,c=Math.cos(a),n=Math.sin(a);
  const W2=Math.ceil((w*Math.abs(c)+h*Math.abs(n))*sc),H2=Math.ceil((w*Math.abs(n)+h*Math.abs(c))*sc);
  const [cv,g]=mkCanvas(W2,H2);
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){
    const dx=(x+0.5-W2/2)/sc,dy=(y+0.5-H2/2)/sc,sx=Math.floor(dx*c+dy*n+w/2),sy=Math.floor(-dx*n+dy*c+h/2);
    const col=sy>=0&&sy<h&&pal[rows[sy][sx]];if(col){g.fillStyle=col;g.fillRect(x,y,1,1);}}
  return cv;
}
const DONER=rotPix(DONER_ROWS,DONER_PAL,25,1.6);
// Semnul vertical, prins de peretele din dreapta, sub acoperiș
function restBoard(x0){
  const P=restP(x0),bx=RW+4,top=121,bw=34,bh=64;
  for(const sy of [top+11,top+bh-8]){P(RW-2,sy,6,3,'#4a4a58');P(RW-2,sy,6,1,'#9a9aaa');}   // suporturile, de fier
  P(bx,top,bw,bh,'#5a3a22');P(bx+2,top+2,bw-4,bh-4,'#f2e4c8');P(bx,top,bw,1,'#7a5232');
  if(theme.snow)P(bx-1,top-2,bw+2,2,'#f4f8fc');
  ['GUSTUL','CARE','NU SE','UITĂ'].forEach((l,k)=>tinyTxt(l,x0+bx+(bw>>1)-Math.floor(tinyW(l)/2),top+5+k*8+(k===3?2:0),'#a8442a'));
  // Dönerul, mare, tăiat de marginea semnului
  ctx.save();ctx.beginPath();ctx.rect(x0+bx+2,top+38,bw-4,bh-40);ctx.clip();
  ctx.drawImage(DONER,x0+bx+bw-DONER.width+2,top+34);ctx.restore();
}
// Ferestrele luminate: ramă, geam, cruce
const REST_WIN=[18,130];
function restWindows(x0){
  const P=restP(x0);
  for(const wx of REST_WIN){P(wx-2,138,48,34,'#3a2414');P(wx,140,44,30,'#ffd23f');P(wx+1,141,42,28,'#ffe9a0');P(wx+1,141,42,8,'#fff6c8');
    P(wx+21,141,2,28,'#fffaf0');P(wx+1,154,42,2,'#fffaf0');}
}
function restSills(x0){
  const P=restP(x0);
  for(const wx of REST_WIN){P(wx-4,170,52,3,'#a8743c');P(wx-4,170,52,1,'#c8945a');if(theme.snow)P(wx-4,169,52,1,'#f4f8fc');}
}
const restSignText=x0=>txt('MESOPOTAMIA',x0+96,115,'#ffd23f',1,'c','#7a2a0a');
const restArrived=()=>G.state==='clear'&&G.final||G.state==='win';
// Noaptea: ferestrele (și ușa) rămân găuri în stratul umbrit; lumina e desenată dedesubt
const restNight=()=>!!theme.night;
function drawRestaurant(cx){
  const x0=Math.round(goal.x*TS-cx);if(x0>W+60||x0<-RW-160)return;
  const P=restP(x0),snow=theme.snow;
  if(snow){fir(ctx,x0-16,193,48,'#2b5a4a','#f4f8fc','#c4d4e2','#4a3a30');fir(ctx,x0+RW+62,193,40,'#24503f','#f4f8fc','#c4d4e2','#4a3a30');}
  restBoard(x0);   // în spatele benzii
  // Hornul de cărămidă
  P(150,66,14,40,'#a8442a');for(let y=70;y<106;y+=4){P(150,y,14,1,'#7a2a18');P(150+((y>>2)%2?3:9),y+1,1,3,'#7a2a18');}
  P(148,63,18,4,'#5a2a1a');if(snow){P(148,61,18,3,'#f4f8fc');P(150,60,13,1,'#f4f8fc');}
  // Acoperișul în două ape
  for(let y=84;y<112;y++){const t=(y-84)/28,l=Math.round(44-56*t),r=Math.round(148+56*t);
    P(l,y,r-l,1,(y-84)%5===4?'#2a2026':'#3e3238');P(l,y,2,1,'#54464e');}
  if(snow)for(let y=80;y<90;y++){const t=Math.max(0,(y-84)/28),l=Math.round(44-56*t)-1,r=Math.round(148+56*t)+1;P(l,y,r-l,1,y<88?'#f4f8fc':'#c8d8e8');}
  // Banda neagră cu numele și dunga galbenă
  P(-8,110,208,20,'#16121a');P(-8,110,208,1,'#2e2834');P(-8,128,208,2,'#ffd23f');
  // Pereții de cărămidă roșie
  P(0,130,192,52,'#a8442a');
  for(let y=130,row=0;y<182;y+=6,row++){P(0,y+5,192,1,'#7a2a18');
    for(let x=(row%2)*6;x<192;x+=12){P(x,y,1,5,'#7a2a18');if(vhash(x,row)%5===0)P(x+1,y,Math.min(11,191-x),5,'#b85434');}}
  // Grinzile de lemn: sus, la colțuri, lângă ușă
  P(0,130,192,3,'#5a3a22');P(0,130,192,1,'#7a5232');
  for(const bx of [0,188,72,116]){P(bx,130,4,52,'#5a3a22');P(bx,130,1,52,'#7a5232');}
  // Soclul din scânduri
  P(0,182,192,10,'#8a5a30');P(0,182,192,1,'#a8743c');for(let x=0;x<192;x+=12)P(x,183,1,9,'#6a4020');
  if(!restNight())restWindows(x0);
  restSills(x0);restSignText(x0);
  // Ușa de stejar, cu geam sus
  P(80,146,32,46,'#3a2414');P(83,149,26,43,'#a8743c');P(86,152,20,10,'#ffe9a0');P(95,152,2,10,'#a8743c');
  for(const [dx,dy] of [[86,166],[97,166],[86,179],[97,179]])P(dx,dy,9,10,'#946232');
  P(104,174,2,3,'#ffd23f');P(78,143,36,3,'#3a2414');P(78,143,36,1,'#5a3a24');if(snow)P(78,142,36,1,'#f4f8fc');
  P(76,190,40,2,'#5a3a2a');
  // Felinarele de lângă ușă
  for(const lx of [66,122]){P(lx+1,148,2,2,'#2a2026');P(lx,150,4,6,'#2a2026');P(lx+1,151,2,4,'#ffd23f');}
  if(snow){pcirc(ctx,x0+6,193,6,'#f4f8fc');pcirc(ctx,x0+RW-6,193,5,'#f4f8fc');}
  glow(x0+40,155,28,'255,214,130',0.22);glow(x0+152,155,28,'255,214,130',0.22);glow(x0+96,170,12,'255,214,130',0.18);
  // Fumul din horn
  for(let k=0;k<5;k++){const ph=(G.t*0.5+k*22)%110;ctx.globalAlpha=(1-ph/110)*0.75;
    pcirc(ctx,x0+157+Math.sin(G.t*0.03+k)*2+ph*0.2,58-ph*0.6,2+ph*0.045,'#eef2f6');}
  ctx.globalAlpha=1;
  if(restNight())for(const wx of REST_WIN)ctx.clearRect(x0+wx-2,138,48,32);   // găuri pentru lumina de dedesubt
  restDoor(cx);
  drawEndBirds(cx);   // curcanii salvați
}
// Ușa luminată, când ai ajuns
function restDoor(cx){
  if(!restArrived())return;
  const d=doorRect();
  if(restNight()){ctx.clearRect(d.x-cx,d.y,d.w,d.h);return;}
  ctx.fillStyle='#ffe9a0';ctx.fillRect(d.x-cx,d.y,d.w,d.h);ctx.fillStyle='#ffd060';ctx.fillRect(d.x-cx,d.y+d.h-6,d.w,6);
}
// Noaptea, sub stratul umbrit: ferestrele și ușa luminate
function drawRestaurantBehind(cx){
  if(!goal||goal.type!=='restaurant')return;
  const x0=Math.round(goal.x*TS-cx);if(x0>W+90||x0<-RW-90)return;
  restWindows(x0);
  if(restArrived()){const d=doorRect();ctx.fillStyle='#ffe9a0';ctx.fillRect(d.x-cx,d.y,d.w,d.h);ctx.fillStyle='#ffd060';ctx.fillRect(d.x-cx,d.y+d.h-6,d.w,6);}
}
// Noaptea, peste umbră: firma și strălucirea
function drawRestaurantLights(cx){
  if(!goal||goal.type!=='restaurant')return;
  const x0=Math.round(goal.x*TS-cx);if(x0>W+90||x0<-RW-90)return;
  restSignText(x0);
  glow(x0+40,155,40,'255,200,110',0.35);glow(x0+152,155,40,'255,200,110',0.35);glow(x0+96,118,60,'255,190,80',0.14);
  glow(x0+68,153,10,'255,210,120',0.5);glow(x0+124,153,10,'255,210,120',0.5);
}
// La ușă: intri apăsând sus
const restAtDoor=()=>!!goal&&goal.type==='restaurant'&&!!player&&!player.dead&&overlap(player,doorRect());
function drawRestHint(cx){
  if(G.state!=='play'||G.talk||!restAtDoor())return;
  const d=doorRect(),x=Math.round(d.x+d.w/2-cx)-4,y=d.y-16;
  ctx.fillStyle='rgba(20,14,30,0.7)';ctx.fillRect(x,y,9,11);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x,y,9,1);
  txt('↑',x+2,y+2,'#e0d8c8',1,'l',null);
}
