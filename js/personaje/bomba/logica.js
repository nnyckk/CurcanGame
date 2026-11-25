'use strict';
// ===== BOMBA: comportamentul =====
function lightBomb(e){if(e.type!=='bomb'||e.frozen)return;if(!e.lit){e.lit=96;mobSfx(e,'fuse');}}
// Bomba lovită de un dușman înghețat
function knockBomb(e){
  e.dead=2;e.deadT=120;e.lit=0;e.sit=false;e.slideDir=0;e.vy=-4.5;e.vx=(Math.random()<0.5?-1:1)*1.2;
  addScore(100,e.x+6,e.y-4);
}
// Lovită, bomba se așază în fund pe loc și se aprinde
function sitBomb(e){
  if(!e.sit){addScore(100,e.x+6,e.y-4);e.lit=BOMB_SIT_FUSE;mobSfx(e,'fuse');}
  e.sit=true;e.slideDir=0;e.vx=0;
}
// Bomba care stă în fund e solidă din lateral
function pushBomb(e,box){
  const p=player,d=Math.sign((e.x+e.w/2)-(p.x+p.w/2))||p.face;
  // Scoate curcanul din bombă ca dintr-un perete
  const pen=d>0?(p.x+p.w)-box.x:(box.x+box.w)-p.x;
  if(pen>0){const vx=p.vx;p.vx=-d*pen;moveX(p);p.vx=vx;}
  if(!e.kickT)kickBomb(e,d);
}
// Pornește bomba din nou cu viteză maximă
function kickBomb(e,d){
  e.slideDir=d;e.slideT=0;e.dir=d;e.kickT=12;mobSfx(e,'kick');dust(e.x+6,e.y+e.h,2);
}
function explode(e){
  const cx=e.x+6,cy=e.y+6,R=38;booms.push({x:cx,y:cy,t:0});mobSfx(e,'boom');G.shake=Math.round(14*sfxNear(cx));   // departe: tremură mai puțin
  for(let i=0;i<22;i++){const a=Math.random()*TAU,s=1+Math.random()*2.5;parts.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,g:0.08,life:30+Math.random()*20|0,max:50,col:['#fff3a0','#ffb02a','#ff5a1a','#6a5a62'][i%4],s:3});}
  // Te prinde explozia unei bombe pe care ai așezat-o / împins-o chiar tu
  if(!player.dead){const dx=player.x+player.w/2-cx,dy=player.y+player.h/2-cy;
    if(dx*dx+dy*dy<R*R){if(e.byPlayer&&player.inv<=0&&!G.god&&G.state==='play')achUnlock('autogol');hurt(Math.sign(dx)||1);}}
  for(const o of enemies){if(o===e||o.dead||o.remove||o.sink||moleSafe(o))continue;const dx=o.x+o.w/2-cx,dy=o.y+o.h/2-cy;
    if(dx*dx+dy*dy<R*R){if(o.frozen)shatter(o,300);else if(o.type==='man')killMan(o,2,300);else o.lit=o.lit?Math.min(o.lit,12):12;}}
  // Boss-ul e mare
  if(bossFighting()){const dx=boss.x+boss.w/2-cx,dy=boss.y+boss.h/2-cy;if(dx*dx+dy*dy<(R+14)*(R+14))bossHit(Math.sign(dx)||1);}
  const t0=Math.floor((cy-R)/TS),t1=Math.floor((cy+R)/TS),l0=Math.floor((cx-R)/TS),l1=Math.floor((cx+R)/TS);
  for(let ty=t0;ty<=t1;ty++)for(let tx=l0;tx<=l1;tx++){if(tileAt(tx,ty)!=='B'&&tileAt(tx,ty)!=='P')continue;const dx=tx*TS+8-cx,dy=ty*TS+8-cy;if(dx*dx+dy*dy<R*R)breakBrick(tx,ty);}
  // Explozia sparge și gheața lacurilor pe care o atinge
  let ice=false;
  for(let tx=l0;tx<=l1;tx++){if(tileAt(tx,12)!=='I')continue;const dx=tx*TS+8-cx,dy=12*TS+3-cy;if(dx*dx+dy*dy<R*R){breakIce(tx,true);ice=true;}}
  if(ice)mobSfx(e,'iceBreak');
}
function updateBomb(e){
  // Aruncată de pe ecran: cade ca fermierii
  if(e.dead){e.deadT--;e.vy+=0.35;e.y+=e.vy;e.x+=e.vx;
    if(!e.wet&&e.y+e.h>WATER_Y){e.wet=true;if(overPit(e)&&!inUnder())splash(e.x+e.w/2);}
    if(e.deadT<=0)e.remove=true;return;}
  if(e.sink){sinkStep(e);return;}
  if(e.frozen){updateFrozen(e);return;}
  if(e.kickT>0)e.kickT--;
  // Încruntată când curcanul e în fața
  const sdx=(player.x+player.w/2)-(e.x+6),sdy=(player.y+player.h)-(e.y+e.h);
  e.angry=!player.dead&&Math.sign(sdx)===e.dir&&Math.abs(sdx)<120&&Math.abs(sdy)<48;
  if(e.sit){
    // Stă în fund: nu mai fuge după curcan
    if(e.thrown){if(e.onGround){e.thrown=false;e.vx=0;mobSfx(e,'bump');}}
    else if(e.slideDir){
      e.slideT+=onIce(e)?0.5:1;   // pe gheață alunecă de două ori mai mult
      if(e.slideT>=BOMB_SLIDE_T){e.slideDir=0;e.vx=0;}
      else{e.vx=e.slideDir*bombSlideSpeed(e.slideT);if(e.onGround&&G.t%3===0&&Math.abs(e.vx)>0.8)dust(e.x+6,e.y+e.h,1);}
    }else e.vx=0;
  }else if(!e.lit){
    const dx=(player.x+player.w/2)-(e.x+6),dy=(player.y+player.h-6)-(e.y+6);
    if(!player.dead&&dx*dx+dy*dy<40*40)lightBomb(e);
    e.vx=e.dir*0.4;if(e.onGround&&!groundAhead(e,e.dir)){e.dir*=-1;e.vx=e.dir*0.4;}
  }else{
    const dx=(player.x+player.w/2)-(e.x+6);if(Math.abs(dx)>3)e.dir=Math.sign(dx);
    e.vx=e.dir*0.7;if(e.onGround&&!groundAhead(e,e.dir))e.vx=0;
  }
  if(e.lit){
    e.lit--;if(e.lit%(e.lit<36?5:10)===0)mobSfx(e,'tick');
    if(e.lit<=0){explode(e);e.remove=true;return;}
  }
  e.vy=Math.min(e.vy+0.4,7);
  moveX(e);
  if(e.hitWall){if(e.slideDir){e.slideDir=-e.slideDir;e.dir*=-1;mobSfx(e,'bump');}else if(!e.lit)e.dir*=-1;}
  moveY(e);if(!e.sit)e.anim++;
  if(e.y+e.h>WATER_Y&&overPit(e)){enterWater(e);return;}
  if(e.y>H+20)e.remove=true;
}
