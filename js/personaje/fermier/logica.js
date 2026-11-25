'use strict';
// ===== FERMIERUL ȘI UCENICUL: comportamentul =====
// Zona în care lovește furca, în fața fermierului
function forkBox(e){return {x:e.dir>0?e.x+e.w:e.x-MAN_REACH,y:e.y+7,w:MAN_REACH,h:8};}
// pts = punctele fermierului cu furcă
function killMan(e,mode,pts){
  e.dead=mode;e.deadT=mode===1?30:120;e.frozen=0;
  if(e.key)keyDrop(e);   // cheia coliviei cade din el
  if(mode===2){e.vy=-4.5;e.vx=(Math.random()<0.5?-1:1)*1.2;}
  addScore(e.boy?pts/2:pts,e.x+5,e.y-4);
}
function updateMan(e){
  if(e.dead){e.deadT--;
    if(e.dead===2){e.vy+=0.35;e.y+=e.vy;e.x+=e.vx;
      // Fermierul aruncat de pe ecran face pleosc doar
      if(!e.wet&&e.y+e.h>WATER_Y){e.wet=true;if(overPit(e)&&!inUnder())splash(e.x+e.w/2);}}
    if(e.deadT<=0)e.remove=true;return;}
  if(e.sink){sinkStep(e);return;}
  if(e.frozen){updateFrozen(e);return;}
  if(e.mole){updateMole(e);return;}
  if(e.sleep||e.wake){updateSleep(e);return;}   // doarme / se trezește
  const dx=(player.x+player.w/2)-(e.x+5),dy=(player.y+player.h)-(e.y+e.h);
  // Chemat de boss: intră pe jos în poiană
  if(e.enter){
    const b=boss;
    if(!b||(e.enter>0?e.x>=b.a0+16:e.x+e.w<=b.a1-16)){e.enter=0;e.dir=Math.sign(dx)||e.dir;e.cd=30;}
    else{e.dir=e.enter;e.vx=0;e.x+=e.enter*(e.boy?0.6:0.9);e.anim+=e.boy?1:1.6;return;}
  }
  if(e.cd>0)e.cd--;
  if(e.boy){
    // Ucenicul nu te urmărește și nu atacă
    // Speriat: fuge mai repede
    if(e.scared>0)e.scared--;
    const bs=e.scared>0?BOY_SPEED*3:BOY_SPEED;
    e.vx=e.dir*bs;
    if(e.onGround&&(!groundAhead(e,e.dir)||spikeAhead(e,e.dir))){e.dir*=-1;e.vx=e.dir*bs;}
  }else if(e.atk){
    // Atac cu furca: trage furca înapoi
    e.atk++;e.vx=0;
    const st=e.atk-MAN_WIND_T;
    if(st===1)mobSfx(e,'stab');
    if(st>0&&st<=6&&e.onGround&&groundAhead(e,e.dir))e.vx=e.dir*1.4;
    if(st>0&&st<=10&&!player.dead&&overlap(player,forkBox(e)))hurt(e.dir);
    if(st>=MAN_STAB_T){e.atk=0;e.cd=50;}
  }else{
    // Ziua te vede de departe
    let see,tdx=dx;
    if(theme.night){
      if(!player.dead&&lanternSees(e)){see=true;e.lastX=player.x+player.w/2;e.lost=0;}
      else if(e.chasing){e.lost=(e.lost||0)+1;tdx=e.lastX-(e.x+5);see=e.lost<LOST_T&&Math.abs(tdx)>6;if(!see)e.puzzled=70;}
      else see=false;
    }else see=!player.dead&&Math.abs(dx)<140&&Math.abs(dy)<56;
    if(see&&theme.night)G.lvlSeen=true;   // te-a văzut un fermier cu felinar
    if(see&&!e.chasing){e.alert=28;e.puzzled=0;if(G.t-G.lastAlert>30){mobSfx(e,'alert');G.lastAlert=G.t;}}
    e.chasing=see;
    if(napTick(e))return;   // adoarme
    if(e.puzzled>0){e.puzzled--;e.vx=0;if(e.puzzled===35)e.dir*=-1;}
    else if(e.alert>0){e.alert--;e.vx=0;if(Math.abs(dx)>2)e.dir=Math.sign(dx);}
    else if(e.chasing&&!(e.lost>0)&&!e.cd&&e.onGround&&Math.abs(dx)<30&&Math.abs(dy)<12){
      // Curcanul e foarte aproape și la aceeași înălțime
      e.atk=1;e.vx=0;e.dir=Math.sign(dx)||e.dir;mobSfx(e,'windup');
    }else{
      if(e.chasing&&Math.abs(tdx)>6)e.dir=Math.sign(tdx);
      const sp=e.chasing?0.8:0.35;e.vx=e.dir*sp;
      // La marginea unei gropi sau în fața țepilor
      if(e.onGround&&(!groundAhead(e,e.dir)||spikeAhead(e,e.dir))){
        // Urmărind, coboară o treaptă de un bloc
        if(e.chasing&&!spikeAhead(e,e.dir)&&stepDownAhead(e,e.dir)){}
        else if(e.chasing)e.vx=0;else{e.dir*=-1;e.vx=e.dir*sp;}}
    }
  }
  e.vy=Math.min(e.vy+0.4,7);
  const moving=e.vx!==0;
  moveX(e);if(e.hitWall&&!e.atk){if(e.chasing&&e.onGround)e.vy=-5.6;else if(!e.chasing)e.dir*=-1;}
  moveY(e);
  if(e.y+e.h>WATER_Y&&overPit(e)){enterWater(e);return;}
  // Ajuns totuși cu picioarele pe țepi
  if(e.onGround&&standsOnSpikes(e)){killMan(e,2,200);mobSfx(e,'stomp');return;}
  if(moving)e.anim+=e.chasing?1.6:1;
  if(e.y>H+20){if(e.key)keyDrop(e,true);e.remove=true;}
}
