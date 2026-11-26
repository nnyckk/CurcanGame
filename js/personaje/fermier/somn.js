'use strict';
// ===== FERMIERUL: somnul de noapte =====
const SLEEP_P=1/3,NAP_T=1200,WAKE_T=30,SCARE_T=120,SLEEP_LIGHT=20,SLEEP_SENSE=28,SLEEP_SUS=45;
// Stă jos, rezemat de furcă, pălăria pe ochi
const MAN_SLEEP=spr([
"...........g.g.g",
"...........ggggg",
"....kkkkk....f..",
"...kHyHyHk...f..",
"...kRRRRRk...f..",
".kHHyHHyHHHk.f..",
"...khKKKKk...f..",
"...khsbbbk...f..",
"...kbbbKbk...f..",
"....kbbk.....f..",
"..kkRRRRRkk..f..",
".krRRwvwRRRk.f..",
".krRRwwwRrRssf..",
".krrRwvwRRRk.f..",
".kkPpPPPPpPPPkk.",
".kpPPpPPPPpPPKKk",
"..kkkkkkkkkkkkk.",
],MAN_PAL);
// Doar noaptea, în nivelul 2 și în nivelurile tale
function sleepLevel(){const d=LEVELS[G.level];return !!theme.night&&!boss&&(!!d.custom||d.id==='noapte');}
// La începutul nivelului: unii dorm
function sleepInit(){G.napOk=sleepLevel();if(!G.napOk)return;
  for(const e of enemies)if(e.type==='man'&&!e.boy&&!e.mole&&!e.plat&&Math.random()<SLEEP_P){e.sleep=1;e.zt=(Math.random()*110)|0;}}
// Felinarul pus jos, în față
function sleepLight(e){return {x:e.x+5+e.dir*9,y:e.y+e.h-3};}
// Un zgomot trezește pe cei din jur
function noiseAt(x,y,r){
  for(const e of enemies){if(!e.sleep||e.dead||e.remove)continue;
    const dx=e.x+5-x,dy=e.y+e.h/2-y;if(dx*dx+dy*dy<r*r)wakeMan(e,x);}
}
function wakeMan(e,x){
  if(!e.sleep)return;
  e.sleep=0;e.wake=WAKE_T;e.woke=true;e.sus=0;e.dir=Math.sign(x-(e.x+5))||e.dir;mobSfx(e,'wake');
  // Strigă: îi trezește pe ceilalți
  for(const o of enemies){if(o===e||!o.sleep||o.dead||o.remove)continue;
    if(Math.abs(o.x-e.x)<=6*TS&&Math.abs(o.y-e.y)<=4*TS)wakeMan(o,x);}
}
// Speriat, ucenicul scapă din găleată: un bănuț, rar (7%) o putere
const BUCKET_POWER_P=0.07;   // putere: doar foc sau gheață, niciodată grăunte
function bucketDrop(o){
  if(o.dropped)return;o.dropped=true;o.noBucket=true;
  const bx=o.x+5+o.dir*7,by=o.y+o.h-5,gy=o.y+o.h;
  // Găleata îi sare din mână, se rostogolește și dispare pe jos
  parts.push({type:'bucket',x:bx,y:by,vx:-o.dir*0.9,vy:-3.2,g:0.25,life:80,max:80,land:2,rot:0,spin:-o.dir*0.35});
  // Din ea sare un bănuț sau, rar, o putere
  if(Math.random()<BUCKET_POWER_P){const t=Math.random()<0.5?'ice':'berry';
    items.push({type:t,x:bx-5,y:by-11,w:10,h:11,vx:0,vy:-4,rise:0,down:true,dir:o.dir});sfx.sprout();}
  else parts.push({type:'coin',x:bx,y:by-4,vx:o.dir*0.5,vy:-4,g:0.3,life:200,max:200,land:8,toCoin:true});
}
// Găleata care zboară: aceeași ca în mâna ucenicului
const BUCKET_IMG=mkSprite(['.ll.','kbbk','kbBk','.kk.'],BOY_PAL,false);
function drawBucket(p,cx){
  ctx.save();ctx.globalAlpha=Math.min(1,p.life/30);ctx.translate(Math.round(p.x-cx),Math.round(p.y));ctx.rotate(Math.round(p.rot/(Math.PI/2))*(Math.PI/2));
  ctx.drawImage(BUCKET_IMG,-2,-2);
  ctx.restore();
}
// Ucenicii fug de explozie
function scareBoys(x,y){
  for(const o of enemies){if(!o.boy||o.dead||o.remove||o.frozen||o.sink)continue;
    const dx=o.x+5-x;if(Math.abs(dx)<8*TS&&Math.abs(o.y-y)<4*TS){o.scared=SCARE_T;o.dir=Math.sign(dx)||o.dir;bucketDrop(o);}}
}
// Fermierul care doarme sau se trezește
function updateSleep(e){
  e.vx=0;e.vy=Math.min(e.vy+0.4,7);moveY(e);
  if(e.y+e.h>WATER_Y&&overPit(e)){e.sleep=0;e.wake=0;enterWater(e);return;}
  if(e.wake){if(--e.wake<=0)wakeDone(e);return;}
  if(!e.onGround){wakeMan(e,e.x+5);return;}   // a dispărut solul
  e.zt=(e.zt||0)+1;
  const p=player;if(p.dead)return;
  const px=p.x+p.w/2;
  if(e.zt%110===0&&Math.abs(px-e.x)<8*TS)mobSfx(e,'snore');
  // Alergi pe lângă el
  if(p.onGround&&Math.abs(p.vx)>2.6&&Math.abs(px-(e.x+5))<3*TS&&Math.abs(p.y-e.y)<2*TS){wakeMan(e,px);return;}
  // Stai în lumina felinarului
  const l=sleepLight(e),dx=px-l.x,dy=p.y+p.h/2-l.y;
  if(dx*dx+dy*dy<SLEEP_SENSE*SLEEP_SENSE){if(++e.sus>SLEEP_SUS)wakeMan(e,px);}else if(e.sus>0)e.sus--;
}
// S-a ridicat: te vede sau e nedumerit
function wakeDone(e){
  e.wake=0;e.alert=0;
  if(!player.dead&&lanternSees(e)){e.chasing=true;e.lost=0;e.lastX=player.x+player.w/2;mobSfx(e,'alert');}
  else{e.chasing=false;e.puzzled=70;}
}
// Patrulând liniștit mult timp, poate adormi
function napTick(e){
  if(!G.napOk||e.woke||e.plat||e.chasing||e.alert>0||e.puzzled>0||!e.onGround){e.calm=0;return false;}
  if(++e.calm<NAP_T||Math.random()>0.003)return false;
  if(e.x+e.w>cam.x-8&&e.x<cam.x+W+8)return false;   // nu sub ochii tăi
  e.sleep=1;e.vx=0;e.zt=0;e.sus=0;return true;
}
// Un „z” mic din pixeli
function drawZ(x,y,n){ctx.fillRect(x,y,n,1);for(let i=1;i<n-1;i++)ctx.fillRect(x+n-1-i,y+i,1,1);ctx.fillRect(x,y+n-1,n,1);}
function drawSleep(e,sx){
  if(e.wake&&e.wake<=WAKE_T/2)ctx.drawImage(MAN.A[e.dir>0?'r':'l'],sx-3,Math.round(e.y-2));
  else{const sh=e.wake?((e.wake>>1)%2?1:-1):0,img=MAN_SLEEP[e.dir>0?'r':'l'];ctx.drawImage(img,sx-3+sh,Math.round(e.y+e.h)-img.height);keyShine(e,img,sx-3+sh,Math.round(e.y+e.h)-img.height);}
  if(e.wake){txt('!',sx+3,Math.round(e.y-12),'#ff4040',1,'l','#000');return;}
  // z-urile care urcă
  ctx.fillStyle='#e8ecff';
  for(let i=0;i<3;i++){const k=(((e.zt||0)+i*40)%120)/120;
    ctx.globalAlpha=1-k;drawZ(sx+4+Math.round(k*7+Math.sin(k*6+i)*1.5),Math.round(e.y+2-k*16),k>0.5?5:4);}
  ctx.globalAlpha=1;
}
// Lumina felinarului de pe jos
function drawSleepLight(e,cx){
  const l=sleepLight(e),lx=Math.round(l.x-cx),ly=Math.round(l.y);if(lx<-40||lx>W+40)return;
  const fl=0.8+0.2*Math.sin(G.t*0.1+e.x);   // pâlpâie încet
  glow(lx,ly,SLEEP_LIGHT*fl,'255,200,110',0.25);glow(lx,ly,6*fl,'255,210,110',0.7);
  drawLantern(lx,ly,fl,false);   // la fel ca în mână
}
