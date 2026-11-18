'use strict';
// ===== FERMIERUL-ȘEF: desenare =====
// Furca văzută ca un șir de pixeli de-a lungul direcției
function drawFork(x,y,a){
  const c=Math.cos(a),s=Math.sin(a),px=(dx,dy,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x+dx),Math.round(y+dy),1,1);};
  for(let i=6;i<=26;i++){px(-c*i,-s*i,'#7a5230');px(-c*i+s,-s*i-c,'#5a3a20');}
  for(let j=-3;j<=3;j++)px(-c*6-s*j,-s*6+c*j,'#6a6e7a');
  for(const j of [-3,0,3])for(let i=0;i<=5;i++)px(-c*i-s*j,-s*i+c*j,'#c8ccd8');
}
// Un balot de fân
const BALE=spr([
  ".kkkkkkkkkkkkkk.",
  "kLLLLtLLLLLtLLLk",
  "kYYLLtLYYYYtLLYk",
  "ksYYYtYYssstYYYk",
  "kYYLLtYYYYYtYssk",
  "kYYYYtLLLYYtYYYk",
  "kssYYtYYYYYtLLYk",
  "kYYYLtLYYsstYYYk",
  "kYLLYtYYYYYtYYsk",
  "ksssstssssstsssk",
  ".kkkkkkkkkkkkkk."],{k:'#5a3a0e',L:'#f6d872',Y:'#dcae40',s:'#b08222',t:'#8a3418'});
// O stivă de patru baloți puși unul peste altul
function drawBaleStack(x0,y0,flip){
  for(let i=0;i<4;i++){const y=y0+i*11,x=x0+[0,1,-1,0][i]*(flip?-1:1),f=(i+(flip?1:0))%2;
    ctx.drawImage(BALE[f?'l':'r'],x,y);
    ctx.fillStyle='#f6d872';ctx.fillRect(f?x+16:x-1,y+3+i%3*2,1,1);ctx.fillStyle='#dcae40';ctx.fillRect(f?x-1:x+16,y+6-f*2,1,1);
    if(theme.snow&&i===0){ctx.fillStyle='#f4f8fc';ctx.fillRect(x+1,y-1,14,2);ctx.fillRect(x+3,y-2,5,1);ctx.fillRect(x+10,y-2,3,1);
      ctx.fillStyle='#c8d8e8';ctx.fillRect(x+1,y+1,14,1);}}
}
// Ce rămâne dintr-o stivă după ce l-ai învins
function drawBaleRuins(x,flip){
  if(flip){ctx.save();ctx.translate(x+TS,0);ctx.scale(-1,1);drawBaleRuins(0,false);ctx.restore();return;}
  const g=12*TS;
  ctx.drawImage(BALE.l,8,0,8,11,x-11,g-11,8,11);   // bucata de balot din stânga
  ctx.fillStyle='#f6d872';ctx.fillRect(x-12,g-9,1,1);ctx.fillRect(x-13,g-6,1,1);ctx.fillRect(x-12,g-3,1,1);
  for(let i=0;i<30;i++){const h=Math.round(Math.sqrt(Math.max(0,1-((i-14.5)/15)**2))*8);if(!h)continue;   // grămada
    const px=x-7+i;ctx.fillStyle='#dcae40';ctx.fillRect(px,g-h,1,h);ctx.fillStyle='#f6d872';ctx.fillRect(px,g-h,1,1);
    if(i%4===1&&h>3){ctx.fillStyle='#b08222';ctx.fillRect(px,g-h+2,1,h-3);}
    if(i%5===3&&h>4){ctx.fillStyle='#f6d872';ctx.fillRect(px,g-h+3,1,2);}}
  ctx.fillStyle='#b08222';ctx.fillRect(x-6,g-1,28,1);
  ctx.drawImage(BALE.r,0,0,10,11,x+14,g-11,10,11);   // jumătatea de balot din dreapta
  ctx.fillStyle='#f6d872';ctx.fillRect(x+24,g-9,2,1);ctx.fillRect(x+24,g-6,1,1);ctx.fillRect(x+24,g-4,2,1);
  ctx.fillStyle='#dcae40';ctx.fillRect(x+24,g-8,1,1);ctx.fillRect(x+25,g-2,1,1);
  ctx.fillStyle='#8a3418';ctx.fillRect(x+3,g-7,4,1);ctx.fillRect(x+7,g-6,1,1);ctx.fillRect(x+8,g-5,2,1);   // sfoara ruptă
  for(const [dx,c] of [[-22,0],[-17,1],[-2,0],[27,1],[31,0],[37,1],[44,0]]){   // paie împrăștiate
    ctx.fillStyle=c?'#dcae40':'#f6d872';ctx.fillRect(x+dx,g-1,2,1);ctx.fillRect(x+dx+(c?2:-1),g-2,1,1);}
}
// Stâlpii cu felinare de la capetele poienii și cele două
function drawArena(cx){
  const b=boss;if(!b)return;
  for(const l of bossLamps()){const lx=Math.round(l.x-cx);if(lx>-20&&lx<W+20)drawLampPost(lx,l.y,bossDanger(),l.d);}
  const gx=Math.round(b.a1-cx),lx=Math.round(b.a0-TS-cx);
  if(gx>-50&&gx<W+50){if(b.gate)drawBaleRuins(gx,false);else drawBaleStack(gx,12*TS-44,true);}
  if(b.st!=='wait'&&lx>-50&&lx<W+50){if(b.gate)drawBaleRuins(lx,true);else drawBaleStack(lx,Math.round(b.logY),false);}
  // Semnul de pe sol unde va ateriza
  if(b.st==='leapWarn'||(b.st==='leap'&&b.after==='strike')){
    const mx=Math.round(b.jx+b.w/2-cx),on=(G.t>>2)%2;
    ctx.fillStyle=on?'#ff3030':'#ffb0a0';
    for(let i=-12;i<=12;i++){const yo=Math.round(Math.sqrt(1-(i/12)*(i/12))*2.5);ctx.fillRect(mx+i,12*TS-2-yo,1,1);ctx.fillRect(mx+i,12*TS-2+yo,1,1);}
    ctx.globalAlpha=0.25;ctx.fillRect(mx-10,12*TS-3,21,3);ctx.globalAlpha=1;
  }
}
function drawBoss(cx){
  const b=boss;if(!b)return;
  for(const f of b.forks)drawFork(f.x-cx,f.y,f.a);   // furcile aruncate
  if(b.st==='gone')return;
  let sx=Math.round(b.x-cx)-6;if(sx<-60||sx>W+60)return;
  if(b.st==='tired')sx+=(b.t>>4)%2;   // obosit: se clatină puțin
  if(b.st==='dead'){ctx.drawImage(BOSS.FLIP,sx,Math.round(b.y+b.h-BOSS_H));return;}
  if(b.st==='hurt'&&(b.t>>2)%2)return;   // clipește după ce e lovit
  const face=b.dir,ice=b.st==='frozen',crouch=b.st==='leapWarn'||(b.st==='land'&&b.t<8);
  const walk=b.vx!==0&&(b.st==='walk'||b.st==='flee')&&Math.floor(b.anim/8)%2;
  const img=(ice?BOSS.ICE:walk?BOSS.B:BOSS.A)[face>0?'r':'l'];
  const by=Math.round(b.y+b.h-BOSS_H)+(crouch?3:0);
  // Ghemuit: partea de sus coboară 3 px
  if(crouch){ctx.drawImage(img,0,0,28,23,sx,by,28,23);ctx.drawImage(img,0,26,28,5,sx,by+23,28,5);}
  else ctx.drawImage(img,sx,by);
  // Brumă din ce în ce mai deasă
  if(!ice&&b.ice>0){ctx.globalAlpha=b.ice/BOSS_ICE_HITS*0.6;if(crouch){ctx.drawImage(BOSS.ICE[face>0?'r':'l'],0,0,28,23,sx,by,28,23);}else ctx.drawImage(BOSS.ICE[face>0?'r':'l'],sx,by);ctx.globalAlpha=1;}
  const R=(dx,dy,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(face>0?sx+dx:sx+28-dx-w,by+dy,w,h);};
  const RO=(dx,dy,w,h,c)=>{R(dx-1,dy-1,w+2,h+2,'#1a1020');R(dx,dy,w,h,c);};
  const cc=c=>ice?mixHex(c,'#a8e0ff',0.55):c;
  const SLV=cc('#c8302a'),SLW=cc('#ece6d8'),SKIN=cc('#f0b088'),SH=cc('#7a5230'),MT=cc('#c8ccd8'),MD=cc('#6a6e7a');
  const SL=(dx,dy,w,h)=>bossSleeve(R,dx,dy,w,h,SLV,SLW);   // mâneca în carouri
  // Fața
  const ex=b.st==='tired'?'tired':(b.st==='dazed'?'dazed':(b.st==='hurt'?'hurt':
    (['leapWarn','leap','strike','chargePrep','charge'].includes(b.st)||(b.st==='volley'&&b.vk>=b.vwt)?'roar':'angry')));
  bossFace(R,ex,ice);
  // Brațul din față și furca, după ce face
  const tines=(x0,y0,horiz)=>{if(horiz){R(x0,y0-3,1,7,MD);for(const o of [-3,0,3])R(x0+1,y0+o,5,1,MT);}
    else{R(x0-3,y0,7,1,MD);for(const o of [-3,0,3])R(x0+o,y0-5,1,5,MT);}};
  // Brațul din față e cât cel din spate
  const back=sh=>{R(4+sh,16,22,2,SH);tines(26+sh,17,true);SL(15+sh,16,5,2);RO(13+sh,16,2,2,SKIN);};   // trasă înapoi
  if(b.st==='volley'){
    if(b.vk<b.vwt)back(b.vk>b.vwt-8?((b.t>>1)%2?1:-1):0);   // tremură înainte s-o arunce
    else{SL(21,15,6,2);RO(27,15,2,2,SKIN);}   // tocmai a aruncat-o: mâna întinsă
  }else if(b.st==='strike'){
    if(b.t<=14)back(b.t>6?((b.t>>1)%2?1:-1):0);
    else{R(10,17,20+b.ext,2,SH);tines(30+b.ext,18,true);SL(20,16,5,2);RO(25,17,2,2,SKIN);}   // împunge
  }else if(b.st==='charge'||b.st==='chargePrep'){R(10,21,18,2,SH);tines(28,22,true);SL(19,16,2,5);RO(19,21,2,2,SKIN);}
  else{R(22,2,2,27,SH);tines(23,1,false);SL(20,15,2,6);RO(21,21,2,2,SKIN);}   // ținută drept în sus, lângă bor
  if(b.raise)ctx.drawImage(BOMB.FA[face>0?'r':'l'],sx+6,by-16);   // bomba ridicată deasupra capului
  // Cubul de gheață
  if(ice){ctx.globalAlpha=0.4;ctx.fillStyle='#bfe8ff';ctx.fillRect(sx+2,by-2,24,BOSS_H+2);ctx.globalAlpha=1;
    ctx.fillStyle='#ffffff';ctx.fillRect(sx+2,by-2,24,1);ctx.fillRect(sx+2,by-2,1,BOSS_H+2);ctx.fillRect(sx+5,by+3,1,5);ctx.fillRect(sx+20,by+8,1,3);
    ctx.fillStyle='#7ab8dc';ctx.fillRect(sx+25,by-2,1,BOSS_H+2);ctx.fillRect(sx+2,by+BOSS_H-1,24,1);}
  // Amețit: steluțe care se rotesc deasupra pălăriei
  if(b.st==='dazed')for(let i=0;i<3;i++){const a=G.t*0.15+i*TAU/3,x=sx+14+Math.round(Math.cos(a)*13),y=by-5+Math.round(Math.sin(a)*3);
    ctx.fillStyle='#ffe14a';ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3);}
  else if(b.st==='tired'){R(7,7+((b.t>>2)%6),1,2,'#8fd0ff');R(20,8+(((b.t>>2)+3)%6),1,2,'#8fd0ff');}
  if(b.st==='chargePrep'&&(b.t>>2)%2)txt('!',sx+12,by-14,'#ff4040',1,'l','#000');
}
// Lumina felinarelor de pe stâlpi, noaptea: mai mult decor
function drawBossLight(cx){
  const b=boss;if(!b)return;
  const red=bossDanger(),col=red?'255,60,50':'255,214,130',a=red?0.4+0.15*Math.sin(G.t*0.5):0.3;
  for(const l of bossLamps()){const lx=Math.round(l.x-cx),ly=l.y+5;if(lx<-40||lx>W+40)continue;
    glow(lx,ly,30,col,a);glow(lx,12*TS-2,18,col,a*0.4);glow(lx,ly,7,red?'255,120,110':'255,236,170',0.7);}
}
// Un stâlp de lemn cu felinar de fermă: stâlp cioplit
function drawLampPost(x,y,red,d){
  const P=(px,py,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(px,py,w,h);};
  const g=12*TS,px=x-d*8,wd='#6e4a2a',wl='#8e6640',wk='#3e2810',mr='#b03030',mk='#6a1818',ir='#2a2026',sn='#f4f8fc';
  P(px-2,y-8,4,g-y+8,wd);P(px-1,y-8,1,g-y+8,wl);P(px+1,y-8,1,g-y+8,wk);P(px-2,y-8,4,1,wl);   // stâlpul, cu capătul tăiat
  for(const ky of [y+14,y+37,y+58])P(px-1,ky,2,1,wk);   // noduri în lemn
  const a0=Math.min(px,x+d*3),a1=Math.max(px,x+d*3)+1;   // grinda
  P(a0,y-6,a1-a0,3,wd);P(a0,y-6,a1-a0,1,wl);P(a0,y-4,a1-a0,1,wk);
  for(let i=0;i<7;i++)P(px+d*(2+(i>>1))-(d<0?1:0),y+3-i,2,1,i%2?wd:wl);   // propteaua
  P(x,y-3,1,2,ir);P(x-1,y-1,3,1,ir);P(x-2,y,1,1,ir);P(x+2,y,1,1,ir);   // cârligul și toarta
  P(x-2,y+1,5,1,mr);P(x-3,y+2,7,1,mr);P(x-2,y+1,2,1,'#d85050');P(x-3,y+2,7,1,mk);P(x-2,y+2,5,1,mr);   // capacul
  const gl=red?((G.t>>2)%2?'#ff4a3a':'#ff8a7a'):'#ffe08a';   // sticla
  P(x-2,y+3,5,1,gl);P(x-3,y+4,7,4,gl);P(x-2,y+8,5,1,gl);P(x-3,y+4,1,4,mk);P(x+3,y+4,1,4,mk);
  P(x,y+5,1,2,red?'#ffd8d0':'#fff6c8');P(x,y+7,1,1,red?'#ff2a1a':'#ffb040');   // flacăra
  P(x-3,y+9,7,2,mr);P(x-2,y+9,1,1,'#d85050');P(x-2,y+11,5,1,mk);   // rezervorul
  if(theme.snow){P(px-2,y-9,4,1,sn);if(d>0)P(px+2,y-7,a1-px-2,1,sn);else P(a0,y-7,px-2-a0,1,sn);
    P(px-3,g-2,6,2,sn);P(px-4,g-1,8,1,sn);}
}
// Bara boss-ului, sub HUD: numele și, dedesubt
function drawBossBar(){
  // Apare abia când răcnește
  const b=boss;if(!b||b.st==='wait'||(b.st==='intro'&&b.t<40)||G.talk||b.st==='gone'||(b.st==='dead'&&b.t>70))return;
  const frost=b.st==='frozen'?BOSS_ICE_HITS:b.ice,lost=b.lostT||0,sh=lost>24?((lost>>1)%2?1:-1):0;
  const w=180,x=W/2-w/2+sh,y=24,P=(px,py,pw,ph,c)=>{ctx.fillStyle=c;ctx.fillRect(px,py,pw,ph);};
  uiBox(x,y,w,frost?31:26);
  txt('FERMIERUL-ȘEF',x+w/2,y+4,'#ffd23f',1,'c',null);
  const bx=x+5,by=y+14,sw=56,gap=1,bh=8;   // 3 segmente de 56 px, lipite
  P(bx-1,by-1,sw*3+gap*2+2,bh+2,'#0a0610');   // conturul barei
  for(let i=0;i<BOSS_HP;i++){const sx=bx+i*(sw+gap);
    P(sx,by,sw,bh,'#2a2238');P(sx,by,sw,1,'#5a4a6a');P(sx,by+bh-1,sw,1,'#1a1428');   // locașul gol
    const fill=(fw,top,mid,bot)=>{P(sx,by,fw,bh,mid);P(sx,by,fw,2,top);P(sx,by+bh-2,fw,2,bot);};
    if(i<b.hp)fill(sw,'#ff7a80','#e8323e','#a01822');
    else if(i===b.hp&&lost>24){if((lost>>2)%2)fill(sw,'#ffffff','#ffffff','#ffd0d0');else fill(sw,'#ff7a80','#e8323e','#a01822');}
    else if(i===b.hp&&lost>0)fill(Math.round(sw*lost/24),'#ffffff','#ffd0d0','#ff9aa0');}   // se golește spre stânga
  if(frost)for(let i=0;i<BOSS_ICE_HITS;i++)P(bx+i*17,y+25,15,2,i<frost?'#bfe8ff':'#3a3450');
}
