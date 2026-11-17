'use strict';
// ================= DESEN: ecranele (titlu, meniu, controale, final de nivel, intro) =================
function drawTitle(){
  tiles=getTiles(0);bg=getBG(0);
  drawBG();
  const fc=Math.floor(cam.x),off=-(fc%16);
  for(let x=off;x<W;x+=16){const tx=(fc+x)/16;
    ctx.drawImage(tiles.Gv?pickVar(tiles.Gv,tx,12):tiles.G,x,192);ctx.drawImage(tiles.Dv?pickVar(tiles.Dv,tx,13):tiles.D,x,208);}
  // Curcanul mic (ca la începutul jocului) fuge; fermierul cu furcă îl urmărește, cu ucenicul lui în spate — la mărimea din joc.
  const f=TK_RUN[Math.floor(G.t/5)%4],bob=Math.floor(G.t/5)%2?-1:0;
  ctx.drawImage(tkSmall()[f].r,239,176+bob);
  const mf=Math.floor(G.t/6)%2?'B':'A';
  ctx.drawImage(MAN[mf].r,175,172);ctx.drawImage(BOY[mf==='A'?'B':'A'].r,145,172);
  if(THEMES[0].farm)drawGroundDecor(fc,THEMES[0],()=>true);
  if((G.t>>4)%2)txt('!',180,160,'#ff4040');
  if(G.menu==='settings'){txtCute('SETĂRI',W/2,20,3,'#e8323e','#000000');drawMenuButtons();return;}
  if(G.menu==='controls'){txtCute('CONTROALE',W/2,20,3,'#e8323e','#000000');drawControls();drawMenuButtons();return;}
  if(G.menu==='pene'){txtCute('PENE DE AUR',W/2,14,3,'#e8323e','#000000');drawGoldInfo();drawMenuButtons();return;}
  txtCute('CURCANUL',W/2,18,4,'#e8323e','#000000');
  txtCute('ÎN FUGĂ',W/2,59,3,'#e8323e','#000000');
  txt('DRUMUL SPRE MESOPOTAMIA',W/2,88,'#ffffff',1,'c','#2a6aa0');
  drawMenuButtons();
  drawRecordBadge();   // insigna penelor e un buton al meniului (vezi drawMenuButtons)
  // Versiunea jocului, în colțul din dreapta jos (urcă deasupra insignei „MUZICĂ OFF”, când apare) — doar când nu
  // încape în spațiul negru de lângă joc.
  if(!INFO.out)txt('V'+GAME_VERSION,W-4,G.music?H-10:H-30,'#f0e0c8',1,'r','#000');
}
// Butoanele meniului: cel ales e roșu (ca titlul), cu contur alb și o săgeată care se mișcă în stânga lui;
// celelalte sunt mov închis. La setări, valoarea (DA/NU) stă în dreapta, într-o pastilă închisă la culoare;
// butoanele care deschid altă pagină au „>” în dreapta.
function drawMenuButtons(){
  menuRects().forEach((b,i)=>{
    const on=i===G.sel,it=b.it,ty=b.y+4;
    if(it.badge){drawGoldBadge(b,on);return;}
    if(on)uiBox(b.x,b.y,b.w,b.h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(b.x,b.y,b.w,b.h);
    const tc=on?'#ffffff':'#d8e4f0',sh=on?'#7a0a10':null;
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
// Pagina CONTROALE: tasta într-o „clapă” în stânga, ce face pe aceeași coloană în dreapta. Sus mișcarea, iar sub
// o linie tastele „de sistem” (pauză, muzică), puțin mai discrete.
const CONTROLS=[['← →','MERGI'],['SPACE','SARI (ȚINE: MAI SUS)'],['X','ȚINUT: FUGI, SCURT: FOC'],null,['P','PAUZĂ'],['M','MUZICĂ PORNITĂ/OPRITĂ']];
function drawControls(){
  const x=100,w=200,y0=50;uiBox(x,y0,w,84);
  let y=y0+8,sys=false;
  for(const row of CONTROLS){
    if(!row){ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+8,y-3,w-16,1);y+=4;sys=true;continue;}
    const [k,a]=row,kw=[...k].length*6-1;
    ctx.fillStyle='#3a3450';ctx.fillRect(x+8,y-2,kw+4,11);txt(k,x+10,y,'#ffffff',1,'l',null);
    txt(a,x+48,y,sys?'#b8c8d8':'#e8f4ff',1,'l',null);
    y+=14;
  }
}
// Insignele din colțurile de jos, în stilul butoanelor: RECORD (stânga, cu o cupă) în meniul principal și
// MUZICĂ OFF (dreapta, cu o notă muzicală tăiată cu roșu) peste tot, cât timp muzica e oprită.
const CUP_ICON=["#######","#.###.#",".#####.","..###..","...#...","..###..",".#####."];
const NOTE_ICON=["..#####","..#####","..#...#","..#...#",".##..##","###.###","##..##."];
function drawRecordBadge(){
  const w=98,h=15,x=4,y=H-4-h,ty=y+4;
  uiBox(x,y,w,h);icon(CUP_ICON,x+5,ty,'#ffd23f');
  txt('RECORD',x+16,ty,'#ffd23f',1,'l',null);txt(pad(G.hi,6),x+16+42,ty,'#ffffff',1,'l',null);
}
// Lângă record: câte pene de aur ai găsit din câte sunt în joc. E un buton (vezi MENU): aleasă, e roșie ca butoanele
// meniului; apăsată, deschide pagina PENE DE AUR.
function drawGoldBadge(b,on){
  const {x,y,w,h,s}=b,ty=y+4;
  if(on)uiBox(x,y,w,h,'#e8323e','#ffffff','#ff6a72','#a01822');else uiBox(x,y,w,h);
  drawGoldMini(x+5,y+3,'got',0);
  txt('PENE',x+15,ty,on?'#ffffff':'#ffd23f',1,'l',on?'#7a0a10':null);txt(s,x+w-6,ty,'#ffffff',1,'r',on?'#7a0a10':null);
}
// Pagina PENE DE AUR: ce ai de făcut cu penele, pe scurt și fără să spună ce primești dacă le strângi pe toate (doar
// că merită), și, jos, câte pene ai găsit în fiecare nivel. Rândurile sunt la 14 px, ca
// virgulele de sub Ș / Ț să nu pară accente pe rândul de dedesubt.
function drawGoldInfo(){
  const x=36,w=W-72,y0=46,lh=14;
  const won=goldOK();
  const paras=[
    ['ÎN FIECARE NIVEL SE ASCUND 3 PENE DE AUR.','#ffd23f'],
    ['O PANĂ CONTEAZĂ DOAR DACĂ AJUNGI CU EA LA FINAL.','#e8f4ff'],
    won?['LE AI PE TOATE. SURPRIZA TE AȘTEAPTĂ ÎN SETĂRI.','#7fff7f']
       :['ADUNĂ-LE PE TOATE. MERITĂ.','#ffd23f']];
  const rows=paras.map(([t,c])=>[wrapWords(t,52),c]),n=rows.reduce((k,[l])=>k+l.length,0);
  const h=8+n*lh+(rows.length-1)*4+26;
  uiBox(x,y0,w,h);
  let y=y0+8;
  for(const [lines,c] of rows){for(const l of lines){txt(l,x+10,y,c,1,'l',null);y+=lh;}y+=4;}
  // Câte pene ai găsit în fiecare nivel (numărul nivelului și cele 3 penițe).
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(x+8,y-2,w-16,1);
  const lv=LEVELS.map((d,i)=>[d,i]).filter(([d,i])=>!d.arena&&(goldCounts()[i]||0)>0),gw=36,gap=12;
  let gx=Math.round(W/2-(lv.length*gw+(lv.length-1)*gap)/2);
  for(const [d,i] of lv){txt(String(levelNum(i)),gx,y+5,'#9fe8ff',1,'l',null);
    for(let j=0;j<goldCounts()[i];j++)drawGoldMini(gx+10+j*8,y+4,goldSaved(d.id,j)?'got':'empty',0);
    gx+=gw+gap;}
}
function drawMusicOff(){
  const w=80,h=15,x=W-4-w,y=H-4-h,ty=y+5,ix=x+5;
  uiBox(x,y,w,h);icon(NOTE_ICON,ix,ty,'#d8e4f0');
  // Linia roșie în diagonală, cu o „tăietură” de culoarea fundalului lângă ea, ca să se despartă de notă.
  for(let i=-1;i<=7;i++){ctx.fillStyle='#1c1730';ctx.fillRect(ix+i+1,ty+i,1,1);ctx.fillStyle='#ff4a5a';ctx.fillRect(ix+i,ty+i,1,1);}
  txt('MUZICĂ',x+16,ty,'#d8e4f0',1,'l',null);txt('OFF',x+16+42,ty,'#ff6a72',1,'l',null);
}
// Finalul unui nivel, în stilul meniului: titlul cu literele „drăguțe” ale titlului jocului (roșu, contur alb, se
// leagănă), cu câteva sclipiri în jur, iar dedesubt o casetă cu timpul rămas (scade) și bonusul (crește, 50 de puncte
// pe secundă). Totul coboară puțin și apare lin în primele ~14 cadre.
const CLOCK_ICON=["..###..",".#...#.","#..#..#","#..##.#","#.....#",".#...#.","..###.."];
const STAR_ICON=["...#...","..###..","#######",".#####.","..###..",".##.##.",".#...#."];
function drawClearCard(){
  const a=Math.min(1,(G.stateT-60)/14),e=1-(1-a)**3,dy=Math.round((1-e)*-18);
  txtCute(G.final?'AI AJUNS!':'NIVEL TERMINAT!',W/2,42+dy,2,'#e8323e','#000000');
  // Sclipiri (o cruciuliță care crește și scade), pe lângă capetele titlului.
  const half=G.final?78:122;
  for(const [sx,sy,ph] of [[-half-4,40,0],[half,52,16],[-half+10,60,30],[half-12,34,8]]){
    const t=(G.t+ph)%48;if(t>=24)continue;
    const r=t<6||t>=18?1:2,x=W/2+sx,y=sy+dy;
    ctx.fillStyle='#fff3b0';ctx.fillRect(x-r,y,r*2+1,1);ctx.fillRect(x,y-r,1,r*2+1);ctx.fillStyle='#ffffff';ctx.fillRect(x,y,1,1);
  }
  const w=164,h=golds.length?50:36,x=W/2-w/2,y=70+dy,bonus=Math.max(0,(G.clearTime||0)-G.time)*50;
  ctx.globalAlpha=e;
  uiBox(x,y,w,h);
  icon(CLOCK_ICON,x+8,y+8,'#9fe8ff');txt('TIMP RĂMAS',x+19,y+8,'#d8e4f0',1,'l',null);txt(pad(G.time,3),x+w-8,y+8,'#ffffff',1,'r',null);
  ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,y+18,w-16,1);
  icon(STAR_ICON,x+8,y+22,'#ffd23f');txt('BONUS',x+19,y+22,'#d8e4f0',1,'l',null);txt('+'+bonus,x+w-8,y+22,'#ffd23f',1,'r',null);
  // Penele de aur ale nivelului: aurii cele luate de data asta (cele găsite prima dată clipesc), transparente cele
  // găsite altă dată, goale cele care lipsesc.
  if(golds.length){const gy=y+37,id=LEVELS[G.level].id;
    ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(x+8,y+32,w-16,1);
    drawGoldMini(x+8,gy,'got',0);txt('PENE DE AUR',x+19,gy+1,'#d8e4f0',1,'l',null);
    golds.forEach((g,i)=>{const run=(G.goldRun||[]).includes(i),nw=(G.goldNew||[]).includes(i);
      drawGoldMini(x+w-31+i*8,gy,run?'got':goldSaved(id,i)?'ghost':'empty',nw&&G.stateT<150?G.stateT:0);});}
  // Tocmai ai strâns toate penele din joc: curcanul de aur e al tău.
  if(G.goldUnlockNow){const uw=232,ux=W/2-uw/2,uy=y+h+6;
    uiBox(ux,uy,uw,30,'#3a2a08','#ffd23f','#5a4010','#1a1004');
    txt('AI TOATE PENELE DE AUR!',W/2,uy+5,'#ffd23f',1,'c',null);txt('CURCANUL DE AUR E AL TĂU!',W/2,uy+17,'#ffffff',1,'c',null);}
  ctx.globalAlpha=1;
}
// Ecranul de dinaintea nivelului. În spate, decorul nivelului care curge (fundal și sol), cu curcanul care aleargă pe
// sol în forma cu care intră în nivel. Sus, „NIVELUL n” într-o pastilă și numele nivelului cu literele titlului.
// Sub ele, drumul spre MESOPOTAMIA: nivelurile trecute sunt aurii, cel de acum roșu, cu capul curcanului deasupra.
// Apoi un sfat ales la întâmplare (vezi pickTip) și butonul de pornire (nivelul pornește doar când apeși). Jos, viețile
// și scorul. Curcanul aleargă în stânga, ca să nu stea sub buton.
const DOT_ICON=[".###.","#####","#####","#####",".###."];   // bulina din nodurile drumului
function drawIntro(){
  const def=LEVELS[G.level],th=THEMES[def.theme],B=getBG(def.theme),T=getTiles(def.theme),s=G.t*1.2;
  const a=Math.min(1,G.stateT/14),e=1-(1-a)**3,dy=Math.round((1-e)*-14);
  // Decorul nivelului, care curge spre stânga (curcanul aleargă spre dreapta), puțin întunecat ca să iasă în față
  // casetele; solul rămâne luminos.
  const par=(img,f)=>{const w=img.width,ox=Math.floor(-((s*f)%w));ctx.drawImage(img,ox,0);ctx.drawImage(img,ox+w,0);};
  ctx.drawImage(B.sky,0,0);if(B.clouds)par(B.clouds,0.15);par(B.far,0.25);par(B.mid,0.5);if(B.near)par(B.near,0.75);
  ctx.fillStyle='rgba(13,11,20,0.3)';ctx.fillRect(0,0,W,192);
  const fc=Math.floor(s),off=-(fc%16);
  for(let x=off;x<W;x+=16){const tx=(fc+x)/16;
    ctx.drawImage(T.Gv?pickVar(T.Gv,tx,12):T.G,x,192);ctx.drawImage(T.Dv?pickVar(T.Dv,tx,13):T.D,x,208);}
  if(th.night){ctx.fillStyle='rgba(12,18,56,0.4)';ctx.fillRect(0,192,W,32);}
  // Curcanul: mic, mare, de foc sau de gheață, cum intră în nivel.
  const S=G.carryBig?(G.carryFire?tkFire():G.carryIce?tkIce():tkBig()):tkSmall(),img=S[TK_RUN[Math.floor(G.t/5)%4]].r;
  ctx.drawImage(img,100-(img.width>>1),192-img.height+(Math.floor(G.t/5)%2?-1:0));
  if(th.snow)drawSnowfall();
  // „NIVELUL n” și numele nivelului.
  const lbl=def.bonus?'NIVEL BONUS':'NIVELUL '+levelNum(G.level),pw=[...lbl].length*6+13;
  uiBox(Math.round(W/2-pw/2),12+dy,pw,15);txt(lbl,W/2,16+dy,'#ffffff',1,'c',null);
  txtCute(th.name,W/2,40+dy,3,'#e8323e','#000000');
  // Drumul spre MESOPOTAMIA: un nod pentru fiecare nivel, plus restaurantul la capăt. Nivelul bonus are o steluță
  // în loc de bulină.
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
  // Sub fiecare nivel, câte o bulină mică pentru fiecare pană de aur din el: aurie dacă ai găsit-o.
  for(let i=0;i<N;i++){const n=goldCounts()[i]||0,cx=x0+i*gap;
    for(let j=0;j<n;j++){ctx.fillStyle=goldSaved(lv[i].id,j)?'#ffd23f':'rgba(255,255,255,0.25)';ctx.fillRect(cx-5+j*4,ny+16,2,2);}}
  // Sfatul ți-l dă Moș Curcan, în caseta lui de dialog: literele apar pe rând, cu „bla-bla”-ul lui (vezi update).
  const bx=W/2-TALK_BOX_W/2,by=124+dy,bh=TALK_BOX_H;
  drawTalkBox(bx,by,TALK_WHO.old,G.tip||def.tip,introTipN(),false);
  // Butonul de pornire, ca butonul ales din meniu (roșu, cu săgeata care se mișcă), după ce se poate apăsa;
  // înainte, mov închis, fără săgeată.
  const touchUI=document.getElementById('touch').classList.contains('on');
  const go=touchUI?'ATINGE - PORNEȘTE':'ENTER - PORNEȘTE',gw=[...go].length*6+15,gx=Math.round(W/2-gw/2),gy=by+bh+6,ready=G.stateT>40;
  if(ready){uiBox(gx,gy,gw,15,'#e8323e','#ffffff','#ff6a72','#a01822');txt(go,W/2,gy+4,'#ffffff',1,'c','#7a0a10');
    txt('→',gx-11+((G.t>>4)%2),gy+4,'#ffffff',1,'l','#000');}
  else{uiBox(gx,gy,gw,15);txt(go,W/2,gy+4,'#8a84a8',1,'c',null);}
  // Viețile și scorul, într-o insignă în colțul din stânga jos (în dreapta jos stă „MUZICĂ OFF”, când apare).
  const iy=H-19,iw=124;
  uiBox(4,iy,iw,15);ctx.drawImage(headImg(),9,iy+3);txt('X '+G.lives,20,iy+4,'#ffffff',1,'l',null);
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(44,iy+3,1,9);
  txt('SCOR',50,iy+4,'#ffd23f',1,'l',null);txt(pad(G.score,6),4+iw-6,iy+4,'#ffffff',1,'r',null);
  if(e<1){ctx.fillStyle=`rgba(13,11,20,${1-e})`;ctx.fillRect(0,0,W,H);}
}
