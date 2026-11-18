'use strict';
// ===== DUȘMANI ÎNGHEȚAȚI =====
MAN.ICE=spr(MAN_TOP.concat(MLEG_A),icePal(MAN_PAL));
BOY.ICE=spr(BOY_TOP.concat(BLEG_A),icePal(BOY_PAL));
BOMB.ICE=spr(bombTop(0).concat(BF_A),icePal(BOMB_PAL));
// Cât stau înghețați
const FREEZE_T=300,THAW_WARN=60;
// Un dușman lovit de o pană de gheață rămâne prins într-un bloc de gheață ~5 s
function freeze(e){
  const again=e.frozen>0;e.frozen=FREEZE_T;
  if(again)return;   // deja înghețat: doar reîncepe timpul
  e.vx=0;e.slideDir=0;e.slideT=0;e.kickT=0;
  if(e.type==='man'){e.atk=0;e.alert=0;e.chasing=false;e.puzzled=0;e.lost=0;}
  else{e.lit=0;e.sit=false;}
  for(let i=0;i<8;i++)parts.push({x:e.x+Math.random()*e.w,y:e.y+Math.random()*e.h,vx:(Math.random()-0.5)*0.6,vy:-0.3-Math.random()*0.5,g:0,life:18,max:18,col:i%2?'#ffffff':'#bfe8ff',s:1});
  sfx.freezeHit();
}
function iceShards(x,y,n){for(let i=0;i<n;i++){const a=Math.random()*TAU,s=1+Math.random()*2;
  parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.5,g:0.2,life:28,max:28,col:i%3?'#c8eeff':'#ffffff',s:2,edge:'#5aa8d8'});}}
// Gheața se sparge cu el cu tot: moare
function shatter(e,pts){
  iceShards(e.x+e.w/2,e.y+e.h/2,12);sfx.shatter();
  e.frozen=0;e.slideDir=0;
  if(e.type==='man')killMan(e,2,pts);else{e.remove=true;addScore(pts,e.x+6,e.y-4);}
}
// Se dezgheață singur: își revine
function thaw(e){
  e.frozen=0;e.slideDir=0;e.vx=0;iceShards(e.x+e.w/2,e.y+e.h/2,6);sfx.crack();
  if(e.type==='man'){e.atk=0;e.cd=40;}
}
function updateFrozen(e){
  if(e.kickT>0)e.kickT--;
  if(--e.frozen<=0){thaw(e);return;}
  if(e.slideDir){
    e.slideT+=onIce(e)?0.5:1;   // pe gheața lacului alunecă de două ori mai mult
    if(e.slideT>=BOMB_SLIDE_T){e.slideDir=0;e.vx=0;}
    else{e.vx=e.slideDir*bombSlideSpeed(e.slideT);if(e.onGround&&G.t%3===0&&Math.abs(e.vx)>0.8)parts.push({x:e.x+e.w/2,y:e.y+e.h,vx:-e.vx*0.2,vy:-0.4,g:0.03,life:12,max:12,col:'#dff4ff',s:1});}
  }else e.vx=0;
  e.vy=Math.min(e.vy+0.4,7);
  moveX(e);
  if(e.hitWall&&e.slideDir){shatter(e,200);return;}   // izbit de un perete
  moveY(e);
  if(e.y+e.h>WATER_Y&&overPit(e)){enterWater(e);return;}
  // Împins în boss: se sparge de el
  if(e.slideDir&&Math.abs(e.vx)>0.3&&bossFighting()&&overlap(e,boss)){shatter(e,200);return;}
  if(e.slideDir&&Math.abs(e.vx)>0.3)for(const o of enemies){
    if(o===e||!o.active||o.dead||o.remove||o.sink||!overlap(e,o))continue;
    // Mor amândoi: alt înghețat se sparge și el
    if(o.frozen)shatter(o,200);
    else{if(o.type==='man')killMan(o,2,200);else knockBomb(o);sfx.stomp();}
    shatter(e,200);return;
  }
  if(e.y>H+20)e.remove=true;
}
// Un dușman înghețat: sprite-ul lui albăstrit
function drawFrozen(e,sx){
  const sh=e.frozen<THAW_WARN&&(G.t>>1)%2?1:0,f=e.dir>0?'r':'l';
  if(e.type==='man')ctx.drawImage((e.boy?BOY:MAN).ICE[f],sx-3+sh,Math.round(e.y-2));
  else ctx.drawImage(BOMB.ICE[f],sx-2+sh,Math.round(e.y-4));
  const x=sx-2+sh,y=Math.round(e.y)-3,w=e.w+4,h=e.h+3;
  ctx.globalAlpha=0.45;ctx.fillStyle='#bfeaff';ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;
  ctx.fillStyle='#5aa8d8';ctx.fillRect(x,y,w,1);ctx.fillRect(x,y+h-1,w,1);ctx.fillRect(x,y,1,h);ctx.fillRect(x+w-1,y,1,h);
  ctx.fillStyle='#ffffff';ctx.fillRect(x+1,y+1,w-2,1);ctx.fillRect(x+1,y+1,1,h-2);ctx.fillRect(x+3,y+3,1,3);ctx.fillRect(x+w-3,y+h-5,1,2);
  if(e.frozen<THAW_WARN){ctx.fillStyle='#ffffff';[[3,6],[4,7],[4,8],[5,9],[w-4,4],[w-5,5],[w-5,6],[w-6,7]].forEach(([dx,dy])=>ctx.fillRect(x+dx,y+dy,1,1));}
}
