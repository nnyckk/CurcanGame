'use strict';
// ===== DESEN: ecranele =====
function drawTitle(){
  tiles=getTiles(0);bg=getBG(0);
  drawBG();
  const fc=Math.floor(cam.x),off=-(fc%16);
  for(let x=off;x<W;x+=16){const tx=(fc+x)/16;
    ctx.drawImage(tiles.Gv?pickVar(tiles.Gv,tx,12):tiles.G,x,192);ctx.drawImage(tiles.Dv?pickVar(tiles.Dv,tx,13):tiles.D,x,208);}
  // Curcanul mic fuge, doar în meniul principal
  if(G.menu==='main'){
  const f=TK_RUN[Math.floor(G.t/5)%4],bob=Math.floor(G.t/5)%2?-1:0;
  ctx.drawImage(tkSmall()[f].r,239,176+bob);
  const mf=Math.floor(G.t/6)%2?'B':'A';
  ctx.drawImage(MAN[mf].r,175,172);ctx.drawImage(BOY[mf==='A'?'B':'A'].r,145,172);
  if((G.t>>4)%2)txt('!',180,160,'#ff4040');}
  if(THEMES[0].farm)drawGroundDecor(fc,THEMES[0],()=>true);   // în fața personajelor
  if(G.menu==='settings'){txtCute('SETĂRI',W/2,40,3,'#e8323e','#000000');drawMenuButtons();return;}
  if(G.menu==='controls'){txtCute('CONTROALE',W/2,20,3,'#e8323e','#000000');drawControls();drawMenuButtons();return;}
  if(G.menu==='custi'){txtCute('CURCANI PRINȘI',W/2,30,3,'#e8323e','#000000');drawCageInfo();drawMenuButtons();return;}
  if(G.menu==='pene'){txtCute('PENE DE AUR',W/2,30,3,'#e8323e','#000000');drawGoldInfo();drawMenuButtons();return;}
  if(G.menu==='mine'){txtCute('NIVELURILE MELE',W/2,10,3,'#e8323e','#000000');drawMineInfo();drawMenuButtons();return;}
  if(G.menu==='ach'){txtCute('ACHIEVEMENTS',W/2,5,3,'#e8323e','#000000');drawMenuButtons();drawAchInfo();return;}
  txtCute('CURCANUL',W/2,18,4,'#e8323e','#000000');
  txtCute('ÎN FUGĂ',W/2,59,3,'#e8323e','#000000');
  txt('DRUMUL SPRE MESOPOTAMIA',W/2,88,'#ffffff',1,'c','#2a6aa0');
  drawMenuButtons();
  drawRecordBadge();   // insigna penelor e un buton al meniului
  // Versiunea jocului, în colțul din dreapta jos
  if(!INFO.out)txt('V'+GAME_VERSION,W-4,G.music?H-10:H-30,'#f0e0c8',1,'r','#000');
}
// Meniul de pauză, peste joc
function drawPauseMenu(){
  ctx.fillStyle='rgba(10,8,20,0.6)';ctx.fillRect(0,0,W,H);
  if(G.menu==='settings')txtCute('SETĂRI',W/2,40,3,'#e8323e','#000000');   // ca titlul PAUZĂ
  else if(G.menu==='controls'){txtCute('CONTROALE',W/2,20,3,'#e8323e','#000000');drawControls();}
  else txtCute('PAUZĂ',W/2,40,3,'#e8323e','#000000');
  drawMenuButtons();
}
// Butoanele meniului: cel ales e roșu
function drawMenuButtons(){
  menuRects().forEach((b,i)=>{
    const on=i===G.sel,it=b.it,ty=b.y+4;
    if(b.hidden)return;
    if(it.badge==='arrow'){drawMineArrow(b,it.scroll,i===G.hover);return;}
    // Un nivel salvat: numele în stânga, biomul în dreapta
    if(it.lvl||it.story){const l=it.lvl?it.lvl.L||{}:{},st=it.story;
      if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(b.x,b.y,b.w,b.h);
      txt(it.label,b.x+7,ty,on?'#ffffff':st?'#ffd23f':'#d8e4f0',1,'l',on?'#7a0a10':null);
      txt(st?'POVESTE · '+st.items.length:({ferma:'FERMĂ',iarna:'IARNĂ',desert:'DEȘERT'}[l.biome]||'FERMĂ')+(l.night?' NOAPTE':' ZI'),b.x+b.w-7,ty,on?'#ffd0d4':'#8a84a8',1,'r',null);
      if(on)txt('→',b.x-11+((G.t>>4)%2),ty,'#ffffff',1,'l','#000');return;}
    // Insignele de jos: luminate doar cât e mouse-ul pe ele
    if(it.badge){if(it.badge==='custi')drawCageBadge(b,i===G.hover);else (it.badge==='ach'?drawAchBadge:drawGoldBadge)(b,i===G.hover);return;}
    if(it.ach){drawAchCell(b,on);return;}   // cartonașele din pagina ACHIEVEMENTS
    if(it.pg){drawAchArrow(b,i===G.hover);return;}
    const au=!!it.gold;   // curcanul de aur: mereu galben (apare doar cu toate penele)
    if(on&&au)uiBox(b.x,b.y,b.w,b.h,'#ffc020','#fff6c0','#ffe070','#a06a00');
    else if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(b.x,b.y,b.w,b.h);
    const tc=au?(on?'#ffffff':'#ffd23f'):on?'#ffffff':'#d8e4f0',sh=on?(au?'#7a4a00':'#7a0a10'):null;
    if(it.val){
      txt(it.label,b.x+7,ty,tc,1,'l',sh);
      const v=it.val();
      ctx.fillStyle='rgba(0,0,0,0.45)';ctx.fillRect(b.x+b.w-21,b.y+2,15,b.h-4);
      txt(v?'DA':'NU',b.x+b.w-8,ty,v?'#7fff7f':'#ff8a8a',1,'r',null);
    }else if(it.sub&&b.w>120){txt(it.label,b.x+7,ty,tc,1,'l',sh);txt('>',b.x+b.w-11,ty,tc,1,'l',sh);}
    else txt(it.label,b.x+b.w/2,ty,tc,1,'c',sh);
    if(on)txt('→',b.x-11+((G.t>>4)%2),ty,'#ffffff',1,'l','#000');
  });
}
// Pagina CONTROALE: tasta într-o „clapă” în stânga
const CONTROLS=[['← →','MERGI'],['SPACE','SARI (ȚINE: MAI SUS)'],['X','ȚINUT: FUGI, SCURT: FOC'],['↓','ÎN AER: LOVEȘTE PĂMÂNTUL'],null,['ESC','PAUZĂ ȘI MENIU'],['M','MUZICĂ PORNITĂ/OPRITĂ']];
function drawControls(){
  const x=100,w=200,y0=50;uiBox(x,y0,w,98);
  let y=y0+8,sys=false;
  for(const row of CONTROLS){
    if(!row){ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+8,y-3,w-16,1);y+=4;sys=true;continue;}
    const [k,a]=row,kw=[...k].length*6-1;
    ctx.fillStyle='#3a3450';ctx.fillRect(x+8,y-2,kw+4,11);txt(k,x+10,y,'#ffffff',1,'l',null);
    txt(a,x+48,y,sys?'#b8c8d8':'#e8f4ff',1,'l',null);
    y+=14;
  }
}
// Insignele din colțurile de jos, în stilul butoanelor
// Iconițe cu detalii, fără umbră: l deschis, g auriu, d închis, s tija
const ICON_PAL={l:'#fff3b0',g:'#ffd23f',d:'#d08a10',s:'#a8641a',w:'#fff8e0'};
const CUP_PIX=["lgggggd","l.lgd.d",".lggdd.","..lgd..","...d...","..lgd..",".lgggd."];
// Pana mică: aceeași ca pana mare din nivel, cu tija albă (w)
const FEATHER_PIX=["..g..",".lgd.","lgwgd","lgwgd","lgwgd",".gwd.","..w..","..w.."];
// sh: umbră închisă, doar când e mouse-ul pe insignă
function drawPix(map,x,y,sh,pal=ICON_PAL){if(sh)map.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.'){ctx.fillStyle='#5a1008';ctx.fillRect(x+i+1,y+j+1,1,1);}});map.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.'){ctx.fillStyle=pal[r[i]];ctx.fillRect(x+i,y+j,1,1);}});}
const CUP_ICON=["#######","#.###.#",".#####.","..###..","...#...","..###..",".#####."];
const NOTE_ICON=["..#####","..#####","..#...#","..#...#",".##..##","###.###","##..##."];
function drawRecordBadge(){
  const w=98,h=15,x=4,y=H-4-h,ty=y+4;
  uiBox(x,y,w,h);drawPix(CUP_PIX,x+5,ty);
  txt('RECORD',x+16,ty,'#ffd23f',1,'l',null);txt(pad(G.hi,6),x+w-6,ty,'#ffffff',1,'r',null);
}
// Lângă record: câte pene de aur ai găsit din câte sunt în joc
function drawGoldBadge(b,on){
  const {x,y,w,h,s}=b,ty=y+4;
  if(on)uiBox(x,y,w,h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(x,y,w,h);
  drawPix(FEATHER_PIX,x+6,y+3,on);
  txt(s,x+w-6,ty,'#ffffff',1,'r',on?'#7a0a10':null);
}
// Câți curcani prinși ai salvat
const CAGE_ICON=["...#...","..###..",".#.#.#.","#.#.#.#","#.#.#.#","#.#.#.#","#######"];
// Colivia mică, aurie, ca penița și cupa: cârlig, dom, gratii, talpă
const IRON_PAL={l:'#eceef4',g:'#a8b0c0',d:'#6a7080',s:'#4a5060',w:'#ffffff'};   // culoarea fierului
const CAGE_PIX=["...w...","..lgd..",".lgggd.","l.g.g.d","l.g.g.d","l.g.g.d","sgggggs",".s...s."];
// Deschisă: fără gratiile din față, ușița dată în stânga
const CAGE_OPEN_PIX=[".....w...","....lgd..","...lgggd.","lgl...g.d","lgl...g.d","lgl...g.d","..sgggggs","...s...s."];
function drawCageBadge(b,on){
  const {x,y,w,h,s}=b;if(on)uiBox(x,y,w,h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(x,y,w,h);
  drawPix(CAGE_PIX,x+6,y+3,on,IRON_PAL);   // umbra apare la hover
  txt(s,x+w-6,y+4,'#ffffff',1,'r',on?'#7a0a10':null);
}
// Pagina CURCANI PRINȘI: ce ai de făcut, și cine e salvat
function drawCageInfo(){
  const x=36,w=W-72,y0=62,lh=14,won=cageOK();
  const paras=[
    ['FIULE, FERMIERII ȚIN ÎNCHIS CÂTE UN CURCAN ÎN FIECARE NIVEL.','#ffd23f'],
    ['GĂSEȘTE CHEIA ȘI DESCHIDE COLIVIA UNDE SUNT ÎNCHIȘI.','#e8f4ff'],
    ...(won?[['I-AI SALVAT PE TOȚI. TE AȘTEAPTĂ LA MESOPOTAMIA!','#7fff7f']]:[])];
  const rows=paras.map(([t,c])=>[wrapWords(t,52),c]),n=rows.reduce((k,[l])=>k+l.length,0);
  uiBox(x,y0,w,8+n*lh+rows.length*4+36);
  let y=y0+8;
  for(const [lines,c] of rows){for(const l of lines){txt(l,x+10,y,c,1,'l',null);y+=lh;}y+=4;}
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+8,y-2,w-16,1);
  // Câte un cartonaș pe curcan: nivelul și capul lui (umbră dacă nu e salvat)
  const cw=56,ch=26,gap=8,cy=y+4;let cx=Math.round(W/2-(CAPT_INFO.length*cw+(CAPT_INFO.length-1)*gap)/2);
  CAPT_INFO.forEach((c,i)=>{const ok=cageSaved(c.id),li=LEVELS.findIndex(d=>d.id===c.id);
    if(ok)uiBox(cx,cy,cw,ch,'#3a2c0c','rgba(255,210,63,0.9)','#4a3a12','#1a1206');else uiBox(cx,cy,cw,ch,'#262040','rgba(255,255,255,0.3)','#302a4c','#18142a');
    txt(String(li>=0?levelNum(li):i+1),cx+7,cy+10,ok?'#ffd23f':'#9fe8ff',1,'l',null);
    // Salvat: colivia deschisă; nesalvat: închisă
    const pm=ok?CAGE_OPEN_PIX:CAGE_PIX,ox=ok?cx+20:cx+24;
    pm.forEach((r,j)=>{for(let k=0;k<r.length;k++)if(r[k]!=='.'){ctx.fillStyle=IRON_PAL[r[k]];ctx.fillRect(ox+k*2,cy+5+j*2,2,2);}});
    cx+=cw+gap;});
}
// Pagina PENE DE AUR: ce ai de făcut cu penele
function drawGoldInfo(){
  const x=36,w=W-72,y0=62,lh=14;
  const won=goldOK();
  const paras=[
    ['FIULE, ÎN FIECARE NIVEL AM ASCUNS 3 PENE DE AUR.','#ffd23f'],
    ['O PANĂ E A TA ABIA CÂND AJUNGI CU EA LA FINAL.','#e8f4ff'],
    won?['LE AI PE TOATE. VEZI SURPRIZA ÎN SETĂRI.','#7fff7f']
       :['GĂSEȘTE-LE PE TOATE ȘI AI O SURPRIZĂ.','#ffd23f']];
  const rows=paras.map(([t,c])=>[wrapWords(t,52),c]),n=rows.reduce((k,[l])=>k+l.length,0);
  const h=8+n*lh+rows.length*4+34;
  uiBox(x,y0,w,h);
  let y=y0+8;
  for(const [lines,c] of rows){for(const l of lines){txt(l,x+10,y,c,1,'l',null);y+=lh;}y+=4;}
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+8,y-2,w-16,1);
  // Câte un cartonaș pe nivel: numărul și cele 3 pene
  const lv=LEVELS.map((d,i)=>[d,i]).filter(([d,i])=>!d.arena&&(goldCounts()[i]||0)>0),cw=56,ch=24,gap=8,cy=y+4;
  let cx=Math.round(W/2-(lv.length*cw+(lv.length-1)*gap)/2);
  for(const [d,i] of lv){
    const k=goldCounts()[i],all=goldFoundIn(i)>=k;
    if(all)uiBox(cx,cy,cw,ch,'#3a2c0c','rgba(255,210,63,0.9)','#4a3a12','#1a1206');else uiBox(cx,cy,cw,ch,'#262040','rgba(255,255,255,0.3)','#302a4c','#18142a');
    txt(String(levelNum(i)),cx+7,cy+9,all?'#ffd23f':'#9fe8ff',1,'l',null);
    for(let j=0;j<k;j++){const fx=cx+18+j*12,fy=cy+5;
      if(!goldSaved(d.id,j)){ctx.drawImage(GOLD_PANA_DIM,fx,fy);continue;}
      ctx.drawImage(GOLD_PANA,fx,fy);
      if((G.t+i*23+j*41)%90<8){ctx.fillStyle='#ffffff';ctx.fillRect(fx+4,fy+2,3,1);ctx.fillRect(fx+5,fy+1,1,3);}}   // sclipește
    cx+=cw+gap;}
}
// Pana negăsită: doar umbra ei
const GOLD_PANA_DIM=(()=>{const [c,g]=mkCanvas(GOLD_PANA.width,GOLD_PANA.height);g.drawImage(GOLD_PANA,0,0);
  g.globalCompositeOperation='source-in';g.fillStyle='#3a3456';g.fillRect(0,0,c.width,c.height);return c;})();
function drawMusicOff(){
  const w=17,h=15,x=W-4-w,y=H-4-h,ty=y+5,ix=x+5;
  uiBox(x,y,w,h);icon(NOTE_ICON,ix,ty,'#d8e4f0');
  // Linia roșie în diagonală
  for(let i=-1;i<=7;i++){ctx.fillStyle='#1c1730';ctx.fillRect(ix+i+1,ty+i,1,1);ctx.fillStyle='#ff4a5a';ctx.fillRect(ix+i,ty+i,1,1);}
}
// Finalul unui nivel, în stilul meniului
const CLOCK_ICON=["..###..",".#...#.","#..#..#","#..##.#","#.....#",".#...#.","..###.."];
const STAR_ICON=["...#...","..###..","#######",".#####.","..###..",".##.##.",".#...#."];
function drawClearCard(){
  const a=Math.min(1,(G.stateT-60)/14),e=1-(1-a)**3,dy=Math.round((1-e)*-18);
  txtCute(G.final?'AI AJUNS!':'NIVEL TERMINAT!',W/2,42+dy,2,'#e8323e','#000000');
  // Sclipiri, pe lângă capetele titlului
  const half=G.final?78:122;
  for(const [sx,sy,ph] of [[-half-4,40,0],[half,52,16],[-half+10,60,30],[half-12,34,8]]){
    const t=(G.t+ph)%48;if(t>=24)continue;
    const r=t<6||t>=18?1:2,x=W/2+sx,y=sy+dy;
    ctx.fillStyle='#fff3b0';ctx.fillRect(x-r,y,r*2+1,1);ctx.fillRect(x,y-r,1,r*2+1);ctx.fillStyle='#ffffff';ctx.fillRect(x,y,1,1);
  }
  const w=164,h=(golds.length?50:36)+(cage?14:0),x=W/2-w/2,y=70+dy,bonus=Math.max(0,(G.clearTime||0)-G.time)*50;
  ctx.globalAlpha=e;
  uiBox(x,y,w,h);
  icon(CLOCK_ICON,x+8,y+8,'#9fe8ff');txt('TIMP RĂMAS',x+19,y+8,'#d8e4f0',1,'l',null);txt(pad(G.time,3),x+w-8,y+8,'#ffffff',1,'r',null);
  ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,y+18,w-16,1);
  icon(STAR_ICON,x+8,y+22,'#ffd23f');txt('BONUS',x+19,y+22,'#d8e4f0',1,'l',null);txt('+'+bonus,x+w-8,y+22,'#ffd23f',1,'r',null);
  // Penele de aur ale nivelului
  if(golds.length){const gy=y+37,id=LEVELS[G.level].id;
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,y+32,w-16,1);
    drawGoldMini(x+8,gy,'got',0);txt('PENE DE AUR',x+19,gy+1,'#d8e4f0',1,'l',null);
    golds.forEach((g,i)=>{const run=(G.goldRun||[]).includes(i),nw=(G.goldNew||[]).includes(i);
      drawGoldMini(x+w-31+i*8,gy,run?'got':goldSaved(id,i)?'ghost':'empty',nw&&G.stateT<150?G.stateT:0);});}
  // Curcanul prins al nivelului
  if(cage){const cy=y+h-13,id=LEVELS[G.level].id;
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,cy-4,w-16,1);
    icon(CAGE_ICON,x+8,cy,G.cageRun?'#ffd23f':'#8a84a8');txt('CURCAN PRINS',x+19,cy,'#d8e4f0',1,'l',null);
    txt(G.cageRun?'ELIBERAT!':cageSaved(id)?'SALVAT':'-',x+w-8,cy,G.cageRun?'#ffd23f':'#8a84a8',1,'r',null);}
  // Tocmai ai strâns toate penele din joc
  if(G.goldUnlockNow){const uw=232,ux=W/2-uw/2,uy=y+h+6;
    uiBox(ux,uy,uw,30,'#3a2a08','#ffd23f','#5a4010','#1a1004');
    txt('AI TOATE PENELE DE AUR!',W/2,uy+5,'#ffd23f',1,'c',null);txt('PORNEȘTE CURCANUL DE AUR DIN SETĂRI!',W/2,uy+17,'#ffffff',1,'c',null);}
  ctx.globalAlpha=1;
}
// Ecranul de dinaintea nivelului
const DOT_ICON=[".###.","#####","#####","#####",".###."];   // bulina din nodurile drumului
function drawIntro(){
  const def=LEVELS[G.level],th=THEMES[def.theme],B=getBG(def.theme),T=getTiles(def.theme),s=G.t*1.2;
  const a=Math.min(1,G.stateT/14),e=1-(1-a)**3,dy=Math.round((1-e)*-14);
  // Decorul nivelului, care curge spre stânga
  const par=(img,f)=>{const w=img.width,ox=Math.floor(-((s*f)%w));ctx.drawImage(img,ox,0);ctx.drawImage(img,ox+w,0);};
  ctx.drawImage(B.sky,0,0);if(B.clouds)par(B.clouds,0.15);par(B.far,0.25);par(B.mid,0.5);if(B.near)par(B.near,0.75);
  ctx.fillStyle='rgba(13,11,20,0.3)';ctx.fillRect(0,0,W,192);
  const fc=Math.floor(s),off=-(fc%16);
  for(let x=off;x<W;x+=16){const tx=(fc+x)/16;
    ctx.drawImage(T.Gv?pickVar(T.Gv,tx,12):T.G,x,192);ctx.drawImage(T.Dv?pickVar(T.Dv,tx,13):T.D,x,208);}
  if(th.night){ctx.fillStyle='rgba(12,18,56,0.4)';ctx.fillRect(0,192,W,32);}
  // Curcanul: mic, mare, de foc sau de gheață
  const S=G.carryBig?(G.carryFire?tkFire():G.carryIce?tkIce():tkBig()):tkSmall(),img=S[TK_RUN[Math.floor(G.t/5)%4]].r;
  ctx.drawImage(img,100-(img.width>>1),192-img.height+(Math.floor(G.t/5)%2?-1:0));
  if(th.snow)drawSnowfall();
  // „NIVELUL n” și numele nivelului
  const own=!!def.custom,st=own&&!!G.story,lbl=st?(G.story.items[G.storyIdx].bonus?'NIVEL BONUS':'NIVELUL '+storyNum()):own?'NIVELUL TĂU':def.bonus?'NIVEL BONUS':'NIVELUL '+levelNum(G.level),pw=[...lbl].length*6+13;
  uiBox(Math.round(W/2-pw/2),12+dy,pw,15);txt(lbl,W/2,16+dy,'#ffffff',1,'c',null);
  {const nm=own?custName():th.name;txtCute(nm,W/2,own&&[...nm].length>12?46+dy:40+dy,own&&[...nm].length>12?2:3,'#e8323e','#000000');}
  if(!own){
  // Drumul spre MESOPOTAMIA: un nod pentru fiecare nivel
  const lv=LEVELS.filter(d=>!d.arena),N=lv.length,gap=40,x0=W/2-N*gap/2,ny=90+dy;
  for(let i=0;i<N;i++){const xa=x0+i*gap+7,xb=x0+(i+1)*gap-7;
    if(i<G.level){ctx.fillStyle='#ffd23f';ctx.fillRect(xa,ny+6,xb-xa,2);}
    else{ctx.fillStyle='rgba(255,255,255,0.45)';for(let x=xa+1;x<xb-1;x+=4)ctx.fillRect(x,ny+6,2,2);}}
  for(let i=0;i<=N;i++){const cx=x0+i*gap,x=cx-6,mark=(col)=>lv[i].bonus?icon(STAR_ICON,x+3,ny+3,col):icon(DOT_ICON,x+4,ny+4,col);
    if(i===N){uiBox(x,ny,13,13,'#7a1a1a','#ffd23f','#9a2a2a','#4a0a0a');txt('M',cx-2,ny+3,'#ffd23f',1,'l',null);}
    else if(i<G.level){uiBox(x,ny,13,13,'#ffd23f','#fff3b0','#ffe680','#b88a10');mark('#7a4a00');}
    else if(i===G.level){uiBox(x,ny,13,13,'#e8323e','#ffffff','#ff6a72','#a01822');mark('#ffffff');
      ctx.drawImage(headImg(),cx-4,ny-11+Math.round(Math.sin(G.t*0.15)*1.5));}
    else{uiBox(x,ny,13,13);mark(lv[i].bonus?'#ffd23f':'#8a84a8');}
  }
  // Sub fiecare nivel
  for(let i=0;i<N;i++){const n=goldCounts()[i]||0,cx=x0+i*gap;
    for(let j=0;j<n;j++){ctx.fillStyle=goldSaved(lv[i].id,j)?'#ffd23f':'rgba(255,255,255,0.25)';ctx.fillRect(cx-5+j*4,ny+16,2,2);}}
  }else if(st){
    // Drumul poveștii: un nod pe nivel (steluță la bonus), numele poveștii dedesubt
    const its=G.story.items,N=its.length,gap=Math.min(40,Math.floor(320/Math.max(1,N))),x0=Math.round(W/2-(N-1)*gap/2),ny=90+dy;
    for(let i=0;i<N-1;i++){const xa=x0+i*gap+7,xb=x0+(i+1)*gap-7;
      if(i<G.storyIdx){ctx.fillStyle='#ffd23f';ctx.fillRect(xa,ny+6,xb-xa,2);}
      else{ctx.fillStyle='rgba(255,255,255,0.45)';for(let x=xa+1;x<xb-1;x+=4)ctx.fillRect(x,ny+6,2,2);}}
    for(let i=0;i<N;i++){const cx=x0+i*gap,x=cx-6,mark=col=>its[i].bonus?icon(STAR_ICON,x+3,ny+3,col):icon(DOT_ICON,x+4,ny+4,col);
      if(i<G.storyIdx){uiBox(x,ny,13,13,'#ffd23f','#fff3b0','#ffe680','#b88a10');mark('#7a4a00');}
      else if(i===G.storyIdx){uiBox(x,ny,13,13,'#e8323e','#ffffff','#ff6a72','#a01822');mark('#ffffff');ctx.drawImage(headImg(),cx-4,ny-11+Math.round(Math.sin(G.t*0.15)*1.5));}
      else{uiBox(x,ny,13,13);mark(its[i].bonus?'#ffd23f':'#8a84a8');}}
    txt(G.story.name,W/2,ny+18,'#d8e4f0',1,'c',null);
  }
  // Sfatul ți-l dă Moș Curcan, în caseta lui de dialog
  const bx=W/2-TALK_BOX_W/2,by=124+dy,bh=TALK_BOX_H;
  drawTalkBox(bx,by,TALK_WHO.old,G.tip||def.tip,introTipN(),false);
  // Butonul de pornire, ca butonul ales din meniu
  const touchUI=document.getElementById('touch').classList.contains('on');
  const go=touchUI?'ATINGE - PORNEȘTE':'ENTER - PORNEȘTE',gw=[...go].length*6+15,gx=Math.round(W/2-gw/2),gy=by+bh+6,ready=G.stateT>40;
  if(ready){uiBox(gx,gy,gw,15,'#e8323e','#ffffff','#ff6a72','#a01822');txt(go,W/2,gy+4,'#ffffff',1,'c','#7a0a10');
    txt('→',gx-11+((G.t>>4)%2),gy+4,'#ffffff',1,'l','#000');}
  else{uiBox(gx,gy,gw,15);txt(go,W/2,gy+4,'#8a84a8',1,'c',null);}
  // Viețile și scorul
  const iy=H-19,iw=124;
  uiBox(4,iy,iw,15);ctx.drawImage(headImg(),9,iy+3);txt('X '+G.lives,20,iy+4,'#ffffff',1,'l',null);
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(44,iy+3,1,9);
  txt('SCOR',50,iy+4,'#ffd23f',1,'l',null);txt(pad(G.score,6),4+iw-6,iy+4,'#ffffff',1,'r',null);
  if(e<1){ctx.fillStyle=`rgba(13,11,20,${1-e})`;ctx.fillRect(0,0,W,H);}
}
// NIVELURILE MELE: lista goală, sau săgețile când sunt mai mult de 8
function drawMineInfo(){
  const n=MENU.mine.filter(mineRow).length;
  if(!n){const x=50,w=W-100,y=70;uiBox(x,y,w,62);
    txt('ÎNCĂ N-AI NICIUN NIVEL AL TĂU.',W/2,y+10,'#ffd23f',1,'c',null);
    txt('FĂ UNUL ÎN EDITOR ȘI APASĂ SALVEAZĂ:',W/2,y+28,'#e8f4ff',1,'c',null);
    txt('APARE AICI, GATA DE JUCAT.',W/2,y+42,'#e8f4ff',1,'c',null);return;}
  if(n>MINE_VIS)txt((G.mineTop+1)+'-'+Math.min(n,G.mineTop+MINE_VIS)+' DIN '+n,W/2,42+MINE_VIS*18+1,'#8a84a8',1,'c',null);
}
function drawMineArrow(b,d,on){
  if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(b.x,b.y,b.w,b.h);
  ctx.fillStyle='#ffffff';for(let i=0;i<4;i++){const w=1+i*2,y=d<0?b.y+5+i:b.y+9-i;ctx.fillRect(b.x+7-i,y,w,1);}
}
// Povestea terminată: titlul, numele ei, scorul
function drawStoryEnd(){
  ctx.fillStyle='rgba(10,8,20,0.78)';ctx.fillRect(0,0,W,H);
  txtCute('POVESTE TERMINATĂ!',W/2,46,2,'#e8323e','#000000');
  txt(G.story?G.story.name:'',W/2,84,'#ffd23f',1,'c',null);
  txt((G.story?G.story.items.length:0)+' NIVELURI',W/2,100,'#d8e4f0',1,'c',null);
  txt('SCOR '+pad(G.score,6),W/2,128,'#ffffff',2,'c','#000');
  if(G.stateT>60&&(G.t>>5)%2===0)txt('ENTER - ÎNAPOI LA NIVELURI',W/2,176,'#7fff7f',1,'c',null);
}
