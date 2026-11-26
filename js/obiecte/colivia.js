'use strict';
// ===== CURCANII PRINȘI: colivia și cheia =====
const CAGE_KEY=TEST?'curcan_custi_test':'curcan_custi',CAGE_PTS=5000;
let cage=null,keyIt=null,CAGE_SAVE={},CAGE_LV=null;
try{CAGE_SAVE=JSON.parse(localStorage.getItem(CAGE_KEY)||'{}')||{};}catch(e){}
const CAGE_ALL=ALL_OPEN||/[?&]custiall\b/.test(location.search);   // ?custiall: toți apar salvați, fără să salveze
const cageSaved=id=>CAGE_ALL||!!CAGE_SAVE[id];
// Nivelurile care au colivie
const cageLevels=()=>CAGE_LV||(CAGE_LV=LEVELS.filter(d=>!d.arena&&d.build().cageDef).map(d=>d.id));
const cageTotal=()=>cageLevels().length;
const cageFound=()=>cageLevels().filter(cageSaved).length;
const cageOK=()=>cageTotal()>0&&cageFound()>=cageTotal();
// Cheia: mică la brâu, mare pe jos

const KEY_BIG=mkSprite([".kkkkk.","kYyyyYk","kyk.kYk","kYk.kYk","kYYYYYk",".kkYkk.","..kYk..","..kYk..","..kYkkk","..kYYYk","..kYkkk","..kYYk.","..kkkk."],
  {k:'#5a3408',Y:'#ffd23f',y:'#fff3b0'},false);
// La pornirea nivelului
function makeCage(m){
  if(G.cageLv!==G.level){G.cageLv=G.level;G.cageHeld=false;}
  G.cageNow=false;G.hasKey=!!(TEST&&G.testKey);keyIt=null;cage=null;   // modul test: cu cheia
  const def=LEVELS[G.level],d=m.cageDef,id=def.id,i=def.custom?(def.capt|0):CAPT_INFO.findIndex(c=>c.id===id);   // nivelul din editor: curcanul ales acolo
  if(!d||i<0)return;
  const free=cageSaved(id)||G.cageHeld;
  cage={i,x:d.x*TS+8,y:d.y*TS,st:free?'empty':'locked',shake:0,t:0,b:null,door:free?1:0};
  // Eliberat înainte de checkpoint: stă tot lângă ușă
  if(G.cageHeld&&!cageSaved(id)){cage.st='out';cage.b={x:cage.x+CAPT_OUT-5,y:cage.y-14,w:10,h:14,vy:0};}
  if(free)return;
  // Cheia: la un ucenic sau fermier, nu în primul sfert (editor: oriunde)
  const men=enemies.filter(e=>e.type==='man'),road=men.filter(e=>!(under&&e.x>=under.a*TS));
  let pool=def.custom?road:road.filter(e=>e.x>=cols*TS/4);
  if(def.custom)pool=pool.concat(men.filter(e=>e.mole&&!pool.includes(e)));   // cârtițele din peșteră pot ține și ele cheia
  if(def.custom&&!pool.length)pool=men;   // doar în peșteră: tot el o are
  if(pool.length)pool[Math.random()*pool.length|0].key=true;
}
// Lângă curcanul eliberat: poți vorbi cu el
const captNear=()=>!!cage&&cage.st==='out'&&!!player&&!player.dead&&Math.abs(player.x+player.w/2-(cage.b.x+5))<18&&player.y+player.h>cage.y-30&&player.y<cage.y;
const cageNear=()=>!!cage&&cage.st==='locked'&&!!player&&!player.dead&&Math.abs(player.x+player.w/2-cage.x)<16&&player.y+player.h>cage.y-34&&player.y<cage.y;
function cageOpen(){
  const c=cage;G.hasKey=false;G.cageNow=true;c.st='open';c.t=0;
  c.b={x:c.x-5,y:c.y-17,w:10,h:14,vx:0,vy:-3.6,anim:0,t:0,face:1};
  sfx.oneup();addScore(CAGE_PTS,c.x,c.y-40);popup('CURCAN ELIBERAT!',c.x,c.y-52,'#ffd23f');
  for(let i=0;i<16;i++){const a=i/16*TAU,s=1+Math.random()*1.5;
    parts.push({x:c.x+6,y:c.y-13,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:0.03,life:28,max:28,col:i%3?'#ffd23f':'#ffffff',s:i%4?1:2});}
}
// Mobul cu cheia: o dungă de luciu metalic trece des peste el, plus mici sclipiri
const KEY_SHINE_T=110,KEY_SWEEP=30,[SHINE_C,SHINE_G]=mkCanvas(32,32);
function keyShine(e,img,dx,dy){
  if(!e.key||e.dead)return;const t=(G.t+Math.round(e.x))%KEY_SHINE_T;if(t>=KEY_SWEEP)return;
  const w=img.width,h=img.height,g=SHINE_G,p=-4+(w+h+8)*t/KEY_SWEEP;
  g.clearRect(0,0,32,32);g.drawImage(img,0,0);g.globalCompositeOperation='source-atop';
  g.fillStyle='rgba(255,246,190,0.8)';g.beginPath();g.moveTo(p,0);g.lineTo(p+3,0);g.lineTo(p+3-h,h);g.lineTo(p-h,h);g.fill();
  g.globalCompositeOperation='source-over';ctx.drawImage(SHINE_C,0,0,w,h,dx,dy,w,h);
}
function keySparkles(){
  if(G.t%22)return;for(const e of enemies){if(!e.key||e.dead||e.remove||!e.active||(e.mole&&!moleOut(e)))continue;
    parts.push({type:'twinkle',x:Math.round(e.x-1+Math.random()*(e.w+2)),y:Math.round(e.sleep||e.wake?e.y+5+Math.random()*(e.h-6):e.y+Math.random()*e.h),vx:0,vy:0,g:0,life:24,max:24});}
}
function updateCage(){
  keySparkles();
  updateKey();
  const c=cage;if(!c)return;c.t++;if(c.shake>0)c.shake--;
  if(c.st==='locked'){if(cageNear()&&upPressed()){if(G.hasKey)cageOpen();else{c.shake=24;sfx.rattle();}}return;}
  const b=c.b;
  if(c.st==='out'){if(captNear()&&upPressed()){openTalk([captChat(c.i,c.chat||0)],'p'+c.i);c.chat=(c.chat||0)+1;}return;}
  if(c.st==='open'){
    // Ușița se deschide, el sare afară de bucurie, apoi vorbește
    c.door=Math.min(1,c.door+0.08);
    b.x+=(c.x+CAPT_OUT-5-b.x)*0.1;
    const fy=b.x+5<c.x-15?c.y-14:c.y-17;b.vy+=0.25;b.y+=b.vy;if(b.y>=fy){b.y=fy;b.vy=c.t<30?-3:0;}   // afară stă pe sol, nu pe talpă
    // Vorbește abia după ce a aterizat
    if(!c.said&&c.t>=44&&b.y>=fy){c.said=true;b.vy=0;openTalk([CAPT_INFO[c.i].line],'p'+c.i);}
    else if(c.said&&!G.talk){c.st='out';b.x=c.x+CAPT_OUT-5;b.y=c.y-14;}
  }
}
const CAPT_OUT=-30;   // unde stă: pe jos, în stânga ușiței
// La atingerea unui punct de salvare
function cageCheckpoint(){if(G.cageNow){G.cageHeld=true;G.cageNow=false;}}
// Ai terminat nivelul: curcanul eliberat se salvează
function cageSaveLevel(){
  const def=LEVELS[G.level];G.cageRun=false;G.cageNew=false;
  if(!def||!cage)return;
  const got=G.cageHeld||G.cageNow;G.cageHeld=false;G.cageNow=false;
  if(!got)return;
  G.cageRun=true;
  if(def.custom)return;   // nivelurile proprii nu intră în progres
  if(!cageSaved(def.id)){G.cageNew=true;CAGE_SAVE[def.id]=1;try{localStorage.setItem(CAGE_KEY,JSON.stringify(CAGE_SAVE));}catch(e){}}
  if(cageOK())achUnlock('eliberator');
}
// Cheia cade din cel care o avea
function keyDrop(e,water){
  e.key=false;
  keyIt={x:e.x+1,y:e.y+2,w:7,h:13,vx:(Math.random()<0.5?-1:1)*0.6,vy:-4,onGround:false,t:0};
  if(water)keyToEdge();
}
// Din groapă: sare pe cel mai apropiat mal
function keyToEdge(){
  const k=keyIt,tx=Math.floor((k.x+2)/TS);
  for(let d=1;d<60;d++)for(const s of [-1,1]){const c=tx+s*d;if(c<0||c>=cols||!solid(tileAt(c,12)))continue;
    let ty=0;while(ty<12&&!solid(tileAt(c,ty)))ty++;
    k.x=c*TS+(s<0?TS-k.w-2:2);k.y=ty*TS-k.h-6;k.vx=0;k.vy=-3;sparkle(k.x+2,k.y+5);return;}
}
function updateKey(){
  const k=keyIt;if(!k)return;k.t++;
  k.vy=Math.min(k.vy+0.3,6);moveX(k);moveY(k);if(k.onGround)k.vx=0;
  if(k.y+k.h>WATER_Y&&overPit(k)){if(waterCol(Math.floor((k.x+2)/TS)))splash(k.x+2);keyToEdge();return;}
  if(player&&!player.dead&&overlap(player,k)){keyIt=null;G.hasKey=true;sfx.coin();sparkle(k.x+2,k.y+5);popup('CHEIA!',k.x+2,k.y-8,'#ffd23f');}
}
// Colivia rotundă: x = mijlocul, y = jos
function drawCageBars(x,y,open,shake){
  const dark='#2a2a36',bar='#6a7080',hi='#a8b0c0';
  // Inelul de sus și bulbul
  ctx.fillStyle=dark;ctx.fillRect(x-2,y-38,5,1);ctx.fillRect(x-2,y-35,5,1);ctx.fillRect(x-2,y-37,1,2);ctx.fillRect(x+2,y-37,1,2);
  pcirc(ctx,x,y-32,2,dark);ctx.fillStyle=hi;ctx.fillRect(x-1,y-33,1,1);
  // Gratiile, cu dom sus
  for(let dx=-12;dx<=12;dx+=4){
    if(open&&dx>=-8&&dx<=-4)continue;   // ușița e dată la o parte
    const top=Math.round(y-22-Math.sqrt(Math.max(0,144-dx*dx))*0.7);
    ctx.fillStyle=dark;ctx.fillRect(x+dx,top,1,y-3-top);
    ctx.fillStyle=Math.abs(dx)<12?bar:dark;ctx.fillRect(x+dx,top+1,1,y-5-top);
  }
  // Dom: arcul de sus
  for(let dx=-12;dx<=12;dx++){const t=Math.round(y-22-Math.sqrt(Math.max(0,144-dx*dx))*0.7);ctx.fillStyle=dark;ctx.fillRect(x+dx,t,1,1);}
  // Cercurile de la mijloc și de jos
  ctx.fillStyle=dark;ctx.fillRect(x-12,y-22,25,1);
  if(open){ctx.fillRect(x-12,y-12,2,1);ctx.fillRect(x-1,y-12,14,1);}else ctx.fillRect(x-12,y-12,25,1);
  ctx.fillStyle=hi;ctx.fillRect(x-11,y-23,23,1);
  // Talpa
  ctx.fillStyle=dark;ctx.fillRect(x-14,y-3,29,3);ctx.fillStyle=bar;ctx.fillRect(x-13,y-3,27,1);
  if(open){
    // Rama rămâne; ușița, prinsă în balamaua din stânga, iese în afară
    ctx.fillStyle=dark;ctx.fillRect(x-10,y-20,9,1);ctx.fillRect(x-10,y-20,1,17);ctx.fillRect(x-2,y-20,1,17);
    ctx.fillRect(x-17,y-21,1,17);ctx.fillRect(x-17,y-21,8,1);ctx.fillRect(x-17,y-5,8,1);ctx.fillRect(x-17,y-13,8,1);
    ctx.fillStyle=bar;ctx.fillRect(x-15,y-20,1,15);ctx.fillRect(x-12,y-20,1,15);
    return;}
  // Rama ușiței și lacătul
  ctx.fillStyle=dark;ctx.fillRect(x-10,y-20,9,1);ctx.fillRect(x-10,y-20,1,17);ctx.fillRect(x-2,y-20,1,17);
  const lx=x-11+shake,ly=y-14;   // lacătul, pe latura din stânga a ușiței
  ctx.fillStyle='#7a4a08';ctx.fillRect(lx,ly-3,4,1);ctx.fillRect(lx,ly-2,1,2);ctx.fillRect(lx+3,ly-2,1,2);
  ctx.fillRect(lx-1,ly,6,5);ctx.fillStyle='#ffd23f';ctx.fillRect(lx,ly+1,4,3);ctx.fillStyle='#7a4a08';ctx.fillRect(lx+2,ly+2,1,1);
}
// Gratiile din spate: între cele din față, mai închise
function drawCageBack(x,y){
  const back='rgba(30,28,44,0.55)';ctx.fillStyle=back;
  for(let dx=-10;dx<=10;dx+=4){const top=Math.round(y-22-Math.sqrt(Math.max(0,144-dx*dx))*0.7)+2;ctx.fillRect(x+dx,top,1,y-3-top);}
  ctx.fillRect(x-11,y-21,23,1);ctx.fillRect(x-11,y-11,23,1);
}
// Curcanul: x = mijlocul, y = tălpile
// Curcanul stă pe loc: respiră, fiecare în ritmul lui
function drawCapt(i,set,x,y,face){
  if((set==='S'||set==='L')&&(G.t+i*37)%BREATH_T<BREATH_OUT)set+='I';
  const img=CAPT[i][set][face>0?'r':'l'];ctx.drawImage(img,Math.round(x)-10,Math.round(y)-img.height);
}
function drawCage(cx){
  const c=cage;if(!c)return;
  const x=Math.round(c.x-cx),y=c.y;
  if(x>-40&&x<W+40){
    drawCageBack(x,y);
    if(c.st==='locked'){
      // Trist: din când în când se uită spre tine și zice „glu”
      const look=(c.t%200)>150,face=look&&player?Math.sign(player.x+player.w/2-c.x)||1:1;
      drawCapt(c.i,look?'L':'S',x,y-3,face);
      if((c.t%320)>260&&!cageNear()){const s='AJUTOR!';tinyTxt(s,x-Math.floor(tinyW(s)/2),y-46,'#ffffff');}
    }
    drawCageBars(x,y,c.st!=='locked',c.shake?((c.shake>>1)%2?1:-1):0);
  }
  const b=c.b;if(!b)return;
  // Afară, lângă ușiță: se uită spre tine
  const face=player?Math.sign(player.x+player.w/2-(b.x+5))||1:1;
  if(c.st==='open')drawCapt(c.i,b.vy<0?'J':'L',b.x+5-cx,b.y+b.h,face);
  else if(c.st==='out')drawCapt(c.i,'L',b.x+5-cx,b.y+b.h,face);
}
// Lângă colivie: săgeata în sus, ca la cafenea
function drawCageHint(cx){
  if(G.talk)return;
  const out=captNear();if(!out&&!cageNear())return;
  const x=Math.round((out?cage.b.x+5:cage.x)-cx)-4,y=cage.y-(out?44:54);
  ctx.fillStyle='rgba(20,14,30,0.7)';ctx.fillRect(x,y,9,11);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x,y,9,1);
  txt('↑',x+2,y+2,'#e0d8c8',1,'l',null);
}
// Cheia la brâu și cheia căzută
function drawKeys(cx){
  const k=keyIt;if(!k)return;
  const x=Math.round(k.x-cx),y=Math.round(k.y+(k.onGround?Math.sin(G.t*0.1)*1.5-2:0));
  if(theme.night||inUnder())glow(x+3,y+6,15,'255,210,90',0.6);
  ctx.drawImage(KEY_BIG,x,y);
  if(G.t%40<8){ctx.fillStyle='#ffffff';ctx.fillRect(x+6,y,3,1);ctx.fillRect(x+7,y-1,1,3);}
}
// Finalul: cei salvați așteaptă lângă restaurant
const CAPT_SPOTS=[22,44,64,128,150];
function drawEndBirds(cx){
  // Stau afară tot timpul; și cel eliberat chiar acum, în nivelul ăsta
  const def=LEVELS[G.level],x0=goal.x*TS-cx;
  // Nivelul din editor: doar curcanul eliberat aici
  const saved=def.custom?(cage&&(G.cageNow||G.cageHeld||G.cageRun)?[cage.i]:[]):CAPT_INFO.map((c,i)=>i).filter(i=>{const id=CAPT_INFO[i].id;return cageSaved(id)||(id===def.id&&(G.cageNow||G.cageHeld));});
  const pj=G.photoT>=14&&G.photoT<34?Math.round(Math.sin((G.photoT-14)/20*Math.PI)*8):0;
  saved.forEach((i,n)=>{const sx=CAPT_SPOTS[n],face=sx<96?1:-1;
    const hop=(G.t+n*41)%150<12?Math.round(Math.sin(((G.t+n*41)%150)/12*Math.PI)*3):0;
    drawCapt(i,pj||hop?'J':'L',x0+sx,192-Math.max(pj,hop),face);});
}
