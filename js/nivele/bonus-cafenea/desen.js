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
  // Lămpile de alamă, atârnate de grindă, cu becuri calde
  for(const lx of [120,240]){P(lx,T+8,1,10,'#1a100a');P(lx-1,T+18,3,2,BRD);
    // Abajurul, ca un clopot, și becul
    for(let k=0;k<5;k++){const w=7+2*Math.min(k,3);P(lx-(w>>1),T+20+k,w,1,k===0?BRL:BR);}
    P(lx-6,T+24,13,1,BRD);P(lx-2,T+25,5,2,'#fff0b0');P(lx-1,T+27,3,1,'#ffe080');
    glow(x0+lx,T+28,44,'255,190,110',0.4);}
  // Fereastra: afară e ca în nivel (iarnă, fermă sau deșert; zi sau noapte). La blocuri: mai lată, mai spre mijloc
  const big=cafe.game==='blocks',fx=big?136:104,fy=big?108:126,fw=big?48:24,fh=big?28:26,ix=fx+2,iy=fy+2,iw=fw-4,ih=fh-4,sc=iw/20;
  const A=o=>Math.round(o*sc),Wp=(px,py,w,h,col)=>P(ix+px,iy+py,w,h,col);   // A: locul pe lățime, scalat cu geamul
  const snow=!!theme.snow,des=theme===THEMES[2]||theme===THEMES[7],nt=!!theme.moon;
  const sky=nt?'#141c40':snow?'#8aa6bc':des?'#9ccbea':'#7cc4f0';
  const gnd=snow?(nt?'#7c8aa8':'#dfe8f0'):des?(nt?'#5a4a4a':'#e6c074'):(nt?'#1e3a26':'#5ab04a');
  if(big){
    // La blocuri: fără geam; un perete de galerie cu 6 tablouri, între cele două lămpi
    const fr=(px,py,w,h)=>{P(px,py,w,h,BR);P(px,py,w,1,BRL);P(px,py+h-1,w,1,BRD);P(px+w-1,py,1,h,BRD);};
    const In=(px,py)=>(x,y,w,h,c)=>P(px+1+x,py+1+y,w,h,c);   // în ramă
    // 1. Un apus mic, lat
    fr(121,124,18,10);{const Q=In(121,124);Q(0,0,16,8,'#f0b070');Q(0,0,16,2,'#e8905a');Q(11,1,2,2,'#fff0a0');Q(0,5,16,3,'#5a6a34');Q(3,4,6,1,'#5a6a34');}
    // 2. Portretul unui curcan bătrân, cu pălărie
    fr(137,103,14,18);{const Q=In(137,103);
      Q(0,0,12,16,'#4a6a8a');Q(2,10,8,6,'#7a4a2a');Q(3,9,6,1,'#7a4a2a');Q(4,4,4,6,'#f4f0e8');Q(5,3,2,1,'#f4f0e8');
      Q(6,5,1,1,'#1a1a1a');Q(8,6,2,1,'#f0a020');Q(7,7,1,2,'#d02020');Q(3,2,6,1,'#3a2a1a');Q(4,0,4,2,'#3a2a1a');}
    // 3. Peisajul mare: munți, un câmp, o căsuță și un copac
    fr(154,112,37,23);{const Q=In(154,112);
      Q(0,0,35,21,'#9cc8e0');Q(0,9,35,3,'#b8d8e8');
      for(let i=0;i<9;i++){Q(4-i+4,4+i,1+i*2,1,'#7a8aa0');Q(20-i+5,6+i,1+i*2,1,'#8a9ab0');}
      Q(0,13,35,8,'#7a9a4a');Q(0,13,35,1,'#8aaa5a');Q(0,18,35,3,'#6a8a3a');
      Q(8,10,7,4,'#e8dcc0');Q(7,9,9,1,'#c84a3a');Q(8,8,7,1,'#c84a3a');Q(9,7,5,1,'#c84a3a');Q(11,11,2,3,'#6a4428');
      Q(27,11,1,4,'#5a3a20');Q(25,7,5,4,'#3a7a3a');Q(26,6,3,1,'#3a7a3a');}
    // 4. Un oval cu o floare
    {const ox=196,oy=101,ow=12,oh=16,row=(y,inset)=>{const t=(y-(oh-1)/2)/((oh-1)/2),w=Math.round((ow/2-inset)*Math.sqrt(Math.max(0,1-t*t)));return w;};
      for(let y=0;y<oh;y++){const w=row(y,0);if(w>0)P(ox+ow/2-w,oy+y,w*2,1,y<2?BRL:y>oh-3?BRD:BR);}
      for(let y=1;y<oh-1;y++){const w=row(y,1.5);if(w>0)P(ox+ow/2-w,oy+y,w*2,1,'#3a2a4a');}
      P(ox+5,oy+8,1,5,'#3a7a3a');P(ox+6,oy+10,2,1,'#3a7a3a');P(ox+4,oy+5,3,3,'#e86a9a');P(ox+5,oy+4,1,5,'#e86a9a');P(ox+3,oy+6,5,1,'#e86a9a');P(ox+5,oy+6,1,1,'#ffe060');}
    // 5. Ceașca de cafea, mică
    fr(201,125,14,12);{const Q=In(201,125);Q(0,0,12,10,'#c8b088');Q(0,8,12,2,'#8a5a34');Q(2,7,8,1,'#e8e2d8');Q(3,3,5,4,'#f4f0e8');Q(4,3,3,1,'#5a3010');Q(8,4,1,2,'#f4f0e8');Q(5,0,1,2,'#fff8f0');}
    // 6. Pana de aur, pe verde închis, înaltă
    fr(218,104,11,23);{const Q=In(218,104);Q(0,0,9,21,'#24402e');Q(0,0,9,1,'#2e5038');ctx.drawImage(GOLD_PANA,x0+219+1,107);}
  }else{
  P(fx,fy,fw,fh,'#2a1a12');P(ix,iy,iw,ih,sky);P(ix,iy+15,iw,ih-15,gnd);
  // Cerul: stele și lună noaptea, soare ziua (iarna, cerul e înnorat)
  if(nt){for(const [sx,sy] of [[2,2],[6,6],[12,1],[18,7],[3,9],[14,5],[9,3]])if(((G.t>>4)+sx)%7)Wp(A(sx),sy,1,1,'#e8ecff');
    Wp(A(16),1,3,4,'#f4f0d0');Wp(A(16)+1,1,2,3,sky);}
  else if(!snow){const x=A(16);Wp(x-1,2,3,3,'#fff0a0');Wp(x,1,1,5,'#fff0a0');Wp(x-2,3,5,1,'#fff0a0');}
  if(snow){
    const pine=nt?'#1a3a2e':'#24463a';
    Wp(A(4),9,1,6,'#3a2a20');for(let j=0;j<3;j++)Wp(A(4)-j,4+j*2,1+j*2,2,pine);
    Wp(A(15),11,1,4,'#3a2a20');for(let j=0;j<2;j++)Wp(A(15)-j,7+j*2,1+j*2,2,pine);
    if(big){Wp(A(10),12,1,3,'#3a2a20');for(let j=0;j<2;j++)Wp(A(10)-j,8+j*2,1+j*2,2,pine);}
    for(let i=0,n=Math.round(6*sc);i<n;i++){const x=(i*13+Math.floor(G.t*0.2))%iw,y=(i*7+Math.floor(G.t*0.35+i*5))%ih;Wp(x,y,1,1,'#ffffff');}
  }else if(des){
    // O dună în spate și cactuși
    const dn=nt?'#4a3c40':'#d8ac60',cac=nt?'#24402a':'#3a8a3a';
    Wp(0,13,iw,2,dn);Wp(A(4),12,A(8),1,dn);
    const cactus=x=>{Wp(x,6,2,9,cac);Wp(x-2,9,1,3,cac);Wp(x-2,11,2,1,cac);Wp(x+3,8,1,3,cac);Wp(x+2,10,2,1,cac);};
    cactus(A(4));Wp(A(15),12,1,3,cac);Wp(A(15)-1,13,3,1,cac);if(big)cactus(A(11));
  }else{
    // Copaci rotunzi și o tufă
    const leaf=nt?'#1e3a28':'#3a9a3a',leafL=nt?'#2a4a34':'#5ab84a',tree=x=>{Wp(x+2,10,1,5,'#5a3a20');Wp(x,6,5,4,leaf);Wp(x+1,5,3,1,leaf);Wp(x+1,6,2,1,leafL);};
    tree(A(3));if(big)tree(A(11));Wp(A(14),13,4,2,leaf);Wp(A(15),12,2,1,leaf);
  }
  // Ramele, perdelele, galeria și pervazul
  P(ix+(iw>>1)-1,iy,2,ih,'#2a1a12');P(ix,iy+10,iw,1,'#2a1a12');
  for(const [x,d] of [[fx-3,1],[fx+fw-1,-1]]){P(x,fy-2,4,fh+4,'#7a1e24');P(x+(d>0?1:2),fy-2,1,fh+4,'#5a141a');P(x+(d>0?3:0),fy-2,1,fh+3,'#9a2a30');}
  P(fx-5,fy-3,fw+10,1,BR);P(fx-1,fy+fh,fw+2,2,'#5a3a24');
  }
  // Un tablou mic și ceasul de perete
  if(!big){P(214,140,16,12,BR);P(214,140,16,1,BRL);P(215,141,14,10,'#c8a878');P(215,147,14,4,'#9a7a50');P(220,144,4,3,'#7a5a38');}
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
  // Firma MesoCafé: deasupra camerei, ca un titlu, de două ori mai mare
  const lw=MESO_LOGO.width*2,lh=MESO_LOGO.height*2,mx=(L+R)>>1,bw=lw+18,bh=lh+10,by=top-bh-6;
  P(mx-(bw>>1),by,bw,bh,'#c8962c');P(mx-(bw>>1),by,bw,1,'#e8c060');P(mx-(bw>>1),by+bh-1,bw,1,'#8a6418');
  P(mx-(bw>>1)+2,by+2,bw-4,bh-4,'#16121a');
  ctx.drawImage(MESO_LOGO,x0+mx-(lw>>1),by+5,lw,lh);
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
  if(cafe.game==='cups')drawCups(cx);   // masa cu ceștile, în spatele curcanului
  if(cafe.game==='blocks')drawNotes(cx);
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
