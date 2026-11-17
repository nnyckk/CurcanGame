'use strict';
// ================= CURCANUL: lovit, moarte, înec =================
function hurt(dir=0){
  if(player.inv>0||player.dead||G.state!=='play'||G.god)return;
  if(!player.big){die();return;}
  // Curcanul de foc (sau de gheață) pierde întâi costumul (rămâne mare); abia apoi se micșorează.
  if(player.fire){player.fire=false;G.morph='fire';}else if(player.ice){player.ice=false;G.morph='ice';}else{setBig(false);G.morph='size';}
  G.growT=48;player.inv=120;sfx.shrink();G.shake=6;
}
// cause = cum ai murit (Moș Curcan ține minte, vezi mosLines): 'hit' (te-au prins), 'water', 'pit', 'time'.
function die(cause='hit'){
  if(player.dead)return;player.dead=true;G.lastDeath=cause;G.lvlDeaths=(G.lvlDeaths||0)+1;MOS.deaths++;mosSave();G.carryBig=false;G.carryFire=false;G.carryIce=false;feathers=[];G.state='dying';G.stateT=0;
  stopSong();playSong('death');player.vx=0;player.vy=0;
}
// Curcanul cade în apă (încă nu poate înota): pleoscăie, apoi se scufundă încet și pierde viața.
function drown(){
  if(player.dead)return;
  const vy=player.vy;splash(player.x+player.w/2);die('water');
  player.drown=true;player.vy=Math.min(Math.max(vy,0.5),2.5);
}
