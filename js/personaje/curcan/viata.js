'use strict';
// ===== CURCANUL: lovit, moarte, înec =====
// Ai fost lovit: fără FĂRĂ ZGÂRIETURĂ în nivelul ăsta
function markHurt(){G.lvlHurt=true;if(boss&&boss.lock)G.bossHurt=true;}
function hurt(dir=0){
  if(player.inv>0||player.dead||G.state!=='play'||G.god)return;
  markHurt();
  if(!player.big){die();return;}
  // Curcanul de foc pierde întâi costumul
  if(player.fire){player.fire=false;G.morph='fire';}else if(player.ice){player.ice=false;G.morph='ice';}else{setBig(false);G.morph='size';}
  G.growT=48;player.inv=120;sfx.shrink();G.shake=6;
}
// cause = cum ai murit: 'hit', 'water', 'pit', 'time'
function die(cause='hit'){
  if(player.dead)return;player.dead=true;G.lastDeath=cause;G.lvlDeaths=(G.lvlDeaths||0)+1;MOS.deaths++;mosSave();
  markHurt();G.runDeaths=(G.runDeaths||0)+1;   // NEMURITOR: tot jocul fără nicio viață pierdută
  G.carryBig=false;G.carryFire=false;G.carryIce=false;feathers=[];G.state='dying';G.stateT=0;
  stopSong();playSong('death');player.vx=0;player.vy=0;
}
// Curcanul cade în apă: pleoscăie
function drown(){
  if(player.dead)return;
  const vy=player.vy;splash(player.x+player.w/2);
  MOS.drowns=(MOS.drowns||0)+1;if(MOS.drowns>=10)achUnlock('inot');   // CURCANII NU ÎNOATĂ
  die('water');
  player.drown=true;player.vy=Math.min(Math.max(vy,0.5),2.5);
}
