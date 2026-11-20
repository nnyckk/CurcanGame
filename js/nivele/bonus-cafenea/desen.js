'use strict';
// ===== CAFENEAUA: desenare =====
// Căsuța de afară. x0 = marginea ei din stânga pe ecran
function drawCafeHouse(cx){
  const x0=Math.round(cafe.x*TS-cx);if(x0>W+40||x0<-140)return;
  const P=(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x0+px,py,w,h);},snow=theme.snow;
  // Hornul, din cărămizi roșii, cu zăpadă deasupra
  P(66,84,12,34,'#a8442a');for(let y=88;y<118;y+=4){P(66,y,12,1,'#7a2a18');P(66+((y>>2)%2?3:8),y+1,1,3,'#7a2a18');}
  P(64,81,16,4,'#5a2a1a');if(snow){P(64,79,16,3,'#f4f8fc');P(66,78,11,1,'#f4f8fc');}
  // Acoperișul: în două ape
  for(let y=98;y<124;y++){const t=(y-98)/26,l=Math.round(24-30*t),r=Math.round(72+30*t);
    P(l,y,r-l,1,(y-98)%5===4?'#2a2026':'#3e3238');P(l,y,2,1,'#54464e');}
  if(snow){for(let y=94;y<103;y++){const t=Math.max(0,(y-98)/26),l=Math.round(24-30*t)-1,r=Math.round(72+30*t)+1;P(l,y,r-l,1,y<101?'#f4f8fc':'#c8d8e8');}
    for(const [dx,h] of [[4,3],[17,2],[31,4],[47,2],[61,3],[78,2],[90,3]])P(dx,124,1,h,'#e8f0f8');}
  // Banda neagră cu sigla MesoCafe și o dungă galbenă jos
  P(-4,122,104,17,'#16121a');P(-4,122,104,1,'#2e2834');P(-4,137,104,2,'#ffd23f');
  ctx.drawImage(MESO_LOGO,x0+48-(MESO_LOGO.width>>1),126);
  // Pereții închiși la culoare, maro-cafea
  P(0,139,96,53,'#6e5040');for(let y=146;y<182;y+=6)P(0,y,96,1,'#5f4436');P(92,139,4,53,'#56392c');P(0,139,96,1,'#7e5e4c');
  P(0,182,96,10,'#e2c290');for(let x=0;x<96;x+=12)P(x,182,1,10,'#c8a46a');P(0,182,96,1,'#f6efe2');
  // Ferestrele luminate: rame galbene, cruce albă
  for(const wx of [8,66]){P(wx-1,147,24,26,'#e0a818');P(wx,148,22,24,'#ffd23f');P(wx+1,149,20,22,'#ffe9a0');P(wx+1,149,20,7,'#fff6c8');
    P(wx+10,149,2,22,'#fffaf0');P(wx+1,159,20,2,'#fffaf0');P(wx+4,166,4,4,'#ffd23f');P(wx+8,167,1,2,'#ffd23f');
    P(wx-2,173,28,2,snow?'#f4f8fc':'#fffaf0');}
  // Ușa: lemn de stejar, mai deschis decât pereții
  P(39,160,18,32,'#3a2414');P(41,162,14,30,'#a8743c');P(43,164,10,7,'#ffe9a0');P(47,164,2,7,'#a8743c');
  P(43,174,10,7,'#946232');P(43,183,10,7,'#946232');P(52,177,1,2,'#ffd23f');
  P(37,157,22,3,'#3a2414');P(37,157,22,1,'#5a3a24');if(snow)P(37,156,22,1,'#f4f8fc');
  P(37,190,22,2,'#5a3a2a');
  glow(x0+19,160,24,'255,214,130',0.22);glow(x0+77,160,24,'255,214,130',0.22);glow(x0+48,167,10,'255,214,130',0.18);
  // Fumul din horn: rotocoale care urcă
  for(let k=0;k<5;k++){const ph=(G.t*0.5+k*22)%110;ctx.globalAlpha=(1-ph/110)*0.75;
    pcirc(ctx,x0+72+Math.sin(G.t*0.03+k)*2+ph*0.2,76-ph*0.6,2+ph*0.045,'#eef2f6');}
  ctx.globalAlpha=1;
}
// Camera dinăuntru: o cafenea veche, mică și caldă
function drawCafeRoom(cx){
  const x0=Math.round(cafe.a*TS-cx),P=(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x0+px,py,w,h);},L=CAFE_L,R=CAFE_R,RW=R-L;
  const BR='#c8962c',BRL='#e8c060',BRD='#8a6418',T=CAFE_TOP;
  ctx.fillStyle='#120c0a';ctx.fillRect(0,-H,W,H*3);   // tot ecranul, și când lumea e urcată
  ctx.save();ctx.translate(0,-CAFE_DY);
  // Grinda de sus și tapetul vișiniu
  P(L,T,RW,8,'#2a1a12');P(L,T,RW,1,'#4a3020');P(L,T+7,RW,1,'#1a100a');
  P(L,T+8,RW,170-T-8,'#4a2228');
  for(let x=L+4;x<R;x+=12)P(x,T+8,2,170-T-8,'#542a30');
  for(let x=L+10,j=0;x<R;x+=12,j++)for(let y=T+14+(j%2)*7;y<168;y+=14){P(x-1,y,3,1,'#60343a');P(x,y-1,1,3,'#60343a');}
  // Brâul și lambriul din lemn închis, cu panouri
  P(L,170,RW,3,'#6a4428');P(L,170,RW,1,'#8a5a38');P(L,172,RW,1,'#3a2414');P(L,173,RW,19,'#40281a');
  for(let x=L+3;x<R-14;x+=16){P(x,175,13,15,'#4a2e1e');P(x,175,13,1,'#5a3a26');P(x,189,13,1,'#2e1c12');P(x+12,175,1,15,'#2e1c12');}
  // Firma MesoCafé pe o tăbliță mică cu ramă de alamă
  const sx=(CAFE_SLOT+1)*TS;
  P(sx-27,T+10,54,13,BR);P(sx-27,T+10,54,1,BRL);P(sx-26,T+11,52,11,'#16121a');
  ctx.drawImage(MESO_LOGO,x0+sx-(MESO_LOGO.width>>1),T+13);
  // Lămpile de alamă, atârnate de grindă, cu becuri calde
  for(const lx of [120,240]){P(lx,T+8,1,10,'#1a100a');P(lx-1,T+18,3,2,BRD);
    // Abajurul, ca un clopot, și becul
    for(let k=0;k<5;k++){const w=7+2*Math.min(k,3);P(lx-(w>>1),T+20+k,w,1,k===0?BRL:BR);}
    P(lx-6,T+24,13,1,BRD);P(lx-2,T+25,5,2,'#fff0b0');P(lx-1,T+27,3,1,'#ffe080');
    glow(x0+lx,T+28,44,'255,190,110',0.4);}
  // Fereastra mică
  const W0=(px,py,w,h,col)=>P(px+6,py-14,w,h,col);
  W0(98,140,24,26,'#2a1a12');W0(100,142,20,22,'#8aa6bc');W0(100,157,20,7,'#dfe8f0');
  W0(104,151,1,6,'#3a2a20');for(let j=0;j<3;j++)W0(104-j,146+j*2,1+j*2,2,'#24463a');
  W0(115,153,1,4,'#3a2a20');for(let j=0;j<2;j++)W0(115-j,149+j*2,1+j*2,2,'#24463a');
  for(let i=0;i<6;i++){const fx=100+(i*13+Math.floor(G.t*0.2))%20,fy=142+(i*7+Math.floor(G.t*0.35+i*5))%22;W0(fx,fy,1,1,'#ffffff');}
  W0(109,142,2,22,'#2a1a12');W0(100,152,20,1,'#2a1a12');
  for(const [x,d] of [[95,1],[121,-1]]){W0(x,138,4,30,'#7a1e24');W0(x+(d>0?1:2),138,1,30,'#5a141a');W0(x+(d>0?3:0),138,1,29,'#9a2a30');}
  W0(93,137,34,1,BR);W0(97,166,26,2,'#5a3a24');
  // Un tablou mic și ceasul de perete
  P(214,140,16,12,BR);P(214,140,16,1,BRL);P(215,141,14,10,'#c8a878');P(215,147,14,4,'#9a7a50');P(220,144,4,3,'#7a5a38');
  pcirc(ctx,x0+296,128,5,BR);pcirc(ctx,x0+296,128,4,'#f0e4c8');P(296,125,1,3,'#2a1a12');P(296,128,2,1,'#2a1a12');P(295,127,2,2,'#2a1a12');
  // Raftul din spatele tejghelei: sticle, borcane
  P(254,150,64,2,'#2a1a12');P(254,150,64,1,'#4a3020');
  P(258,141,2,9,'#2a4a2a');P(264,144,3,6,'#a0601a');P(271,145,4,5,'#d8c8a8');P(271,144,4,1,'#5a3a24');P(272,147,2,3,'#5a3a1a');
  P(279,142,2,8,'#3a2a5a');P(285,145,4,5,BR);P(292,145,4,5,'#d8c8a8');P(292,144,4,1,'#5a3a24');
  pcirc(ctx,x0+309,144,3,'#3e6e34');P(307,146,5,4,'#c86a3a');
  // Două măsuțe cu câte două scaune
  const chair=(x,bl)=>{const bx=bl?x:x+6,cx2=bl?x+1:x+4;
    P(bx,168,1,14,'#8a5a34');P(cx2,167,2,1,'#8a5a34');P(cx2,172,2,1,'#8a5a34');
    P(x,182,7,1,'#8a5a34');P(x+1,183,1,9,'#6a4426');P(x+5,183,1,9,'#6a4426');P(x+2,187,3,1,'#6a4426');
    P(x,179,7,3,'#a82a2a');P(x+1,179,5,1,'#d04848');P(x,181,7,1,'#7a1a1a');};
  // Măsuță rotundă cu blat de lemn închis pe un picior de fontă
  const table=(x,w)=>{const m=x+(w>>1),cx=m-3,cy=173;
    P(x,178,w,2,'#6a4428');P(x,178,w,1,'#8a5c3a');P(x,180,w,1,'#3a2414');P(m-1,181,2,9,'#2a2a30');P(m-4,190,8,2,'#2a2a30');
    P(cx-1,177,8,1,'#e8e2d8');P(cx,173,5,1,'#ffffff');P(cx+1,173,3,1,'#4a2810');P(cx,174,5,3,'#f4efe6');P(cx+4,174,1,3,'#d0c8bc');
    P(cx+5,174,1,1,'#f4efe6');P(cx+6,175,1,1,'#f4efe6');P(cx+5,176,1,1,'#f4efe6');
    for(let j=0;j<3;j++){ctx.globalAlpha=(1-j/3)*0.35;P(cx+2+Math.round(Math.sin(G.t*0.06+x*0.3+j*0.9)),cy-2-j,1,1,'#f4f0ea');}
    ctx.globalAlpha=1;};
  chair(104,true);table(113,12);chair(127,false);
  chair(218,true);table(227,12);chair(241,false);
  // Tejgheaua veche
  P(250,169,70,3,'#3a2414');P(250,169,70,1,'#5a3a24');P(250,172,70,1,BR);
  P(252,173,68,19,'#4a2e1c');for(let x=255;x<315;x+=16){P(x,176,12,11,'#56361f');P(x,176,12,1,'#6a4428');}P(252,189,68,3,'#2a1a12');
  P(300,160,8,9,BR);P(300,160,1,9,BRL);P(307,160,1,9,BRD);pcirc(ctx,x0+304,160,3,BR);P(303,155,2,2,'#2a1a12');
  P(302,165,4,1,'#2a1a12');P(302,167,3,2,'#f0e4c8');
  P(258,167,3,2,'#f0e4c8');P(264,167,3,2,'#f0e4c8');
  // Ușa de ieșire: lemn, cu ferestruică, panou
  P(CAFE_DOOR-10,158,20,34,'#2a1a12');P(CAFE_DOOR-8,160,16,32,'#6a4428');P(CAFE_DOOR-6,163,12,8,'#8aa6bc');P(CAFE_DOOR-1,163,2,8,'#6a4428');
  P(CAFE_DOOR-6,175,12,13,'#5a3a24');P(CAFE_DOOR+5,178,1,2,BR);P(CAFE_DOOR-12,190,24,2,'#5a1a1a');
  ctx.restore();
}
// Peste podea și peste tot ce e în afara camerei
function drawCafeFrame(cx){
  const x0=Math.round(cafe.a*TS-cx);if(x0>W||x0+CAFE_W*TS<0)return;
  const P=(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x0+px,py,w,h);},L=CAFE_L,R=CAFE_R,fy=CAFE_FLOOR*TS+2*TS;
  const top=CAFE_TOP-CAFE_DY,gr=ctx.createRadialGradient(x0+176,150-CAFE_DY,30,x0+176,150-CAFE_DY,160);
  gr.addColorStop(0,'rgba(24,10,6,0)');gr.addColorStop(1,'rgba(24,10,6,0.55)');
  ctx.fillStyle=gr;ctx.fillRect(x0+L,0,R-L,fy);
  // Întunericul: în stânga, în dreapta
  P(-W,-H,W+L,H*3,'#120c0a');P(R,-H,W,H*3,'#120c0a');P(L,-H,R-L,top+H,'#120c0a');P(L,fy,R-L,H*2,'#120c0a');
  for(const x of [L-5,R]){P(x,top,5,fy-top,'#2a1a12');P(x+(x<L?4:0),top,1,fy-top,'#4a3020');}
  // Grinda de jos, ca cea de sus
  P(L-5,fy,R-L+10,8,'#2a1a12');P(L-5,fy,R-L+10,1,'#4a3020');P(L-5,fy+7,R-L+10,1,'#1a100a');
}
// Blocul-slot, desenat o dată
function drawSlotBlock(x,y,used){
  const c=cafe;if(c&&c.bump>=0)y-=BUMPY[c.bump];
  const P=(px,py,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x+px,y+py,w,h);};
  if(used){P(0,0,32,32,'#4a2a10');P(1,1,30,30,'#9a6030');P(1,1,30,2,'#b07840');P(1,29,30,2,'#7a4a20');}
  else{P(0,0,32,32,'#7a3e0a');P(1,1,30,30,['#f2b630','#f7c850','#ffd970'][[0,1,2,1][(G.t>>3)%4]]);
    P(1,1,30,2,'#fff0b0');P(1,1,2,30,'#fff0b0');P(1,29,30,2,'#b8701a');P(29,1,2,30,'#b8701a');
    const sp=c&&c.lock>0?G.t>>1:G.t>>3;   // după lovitură, becurile aleargă repede
    [[4,1],[10,1],[16,1],[22,1],[27,1],[27,9],[27,15],[27,21],[27,28],[22,28],[16,28],[10,28],[4,28],[1,21],[1,15],[1,9]]
      .forEach(([bx,by],i)=>P(bx,by,2,2,(i+sp)%2?'#fff3b0':'#ff5a3a'));}
  P(5,5,22,22,'#120a04');P(6,6,20,20,used?'#3a2410':'#2a1a10');P(6,25,20,1,used?'#5a3a1a':'#4a2e14');
  // După lovitură, simbolul nimerit clipește până primești premiul
  const lk=c&&c.lock>0?c.lock:0,on=!lk||lk>SLOT_LOCK-8||(lk>>2)%2;
  if(lk&&on)P(6,6,20,20,'#5a4020');
  ctx.globalAlpha=used?0.5:1;if(on)drawSlotIcon(c?c.i:0,x+16,y+16);ctx.globalAlpha=1;
}
// Ce arată blocul-slot: boaba roșie, afina înghețată
function drawSlotIcon(r,cx,cy){
  if(r===SLOT_FIRE)ctx.drawImage(BERRY,cx-10,cy-11,20,22);
  else if(r===SLOT_ICE)ctx.drawImage(ICEBERRY,cx-10,cy-11,20,22);
  else if(r===SLOT_2UP){ctx.drawImage(headImg(),cx-4,cy-9);txt('2UP',cx,cy+1,'#7fff7f',1,'c','#0a3a0a');}
  else{for(const [col,o,s] of [['#5a0a10',-1,4],['#ff4a4a',0,2]]){ctx.fillStyle=col;
    for(let i=0;i<12;i++){ctx.fillRect(cx-7+i+o,cy-7+i+o,s,s);ctx.fillRect(cx+4-i+o,cy-7+i+o,s,s);}}}
}
// Bătrânelul, cu o respirație lentă
function drawCafeNPC(cx){
  const c=cafe,x=Math.round(c.npcX-cx);if(x<-40||x>W+40)return;
  const img=OLD[oldFace()>0?'r':'l'],y=CAFE_FLOOR*TS-OLD_H,b=(G.t%110)<14?1:0;
  ctx.drawImage(img,0,0,OLD_W,OLD_H-3,x,y+b,OLD_W,OLD_H-3);ctx.drawImage(img,0,OLD_H-3,OLD_W,3,x,y+OLD_H-3,OLD_W,3);
}
// Cât stai în fața unei uși sau lângă bătrânel
function drawCafeHints(cx){
  const a=cafeAction();if(!a||G.talk)return;
  const hx=a==='in'?cafe.x*TS+48:a==='out'?cafe.a*TS+CAFE_DOOR:cafe.npcX+OLD_W/2;
  const hy=a==='in'?12*TS-49:a==='out'?CAFE_FLOOR*TS-47:CAFE_FLOOR*TS-OLD_H-14;
  const x=Math.round(hx-cx)-4,y=hy;
  ctx.fillStyle='rgba(20,14,30,0.7)';ctx.fillRect(x,y,9,11);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x,y,9,1);
  txt('↑',x+2,y+2,'#e0d8c8',1,'l',null);
}
