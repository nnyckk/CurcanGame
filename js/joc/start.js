'use strict';
// ===== JOC NOU, ECRANUL DINAINTEA NIVELULUI =====
function newGame(){G.carryBig=false;G.carryFire=false;G.carryIce=false;G.lives=3;G.score=0;G.coins=0;G.level=0;G.cp=null;G.slotUsed=null;G.bossMet=false;G.goldLv=-1;G.cafeSeen=false;G.tip=null;G.underOpen=-1;
  G.fullRun=true;G.runDeaths=0;   // NEMURITOR: un joc întreg
  MOS.plays++;mosSave();toIntro(true);stopSong();}
// Ecranul de dinaintea nivelului
const introTipN=()=>Math.max(0,(G.stateT-18)*1.2);
// Sfatul se alege înainte ca Moș Curcan să-și noteze nivelul nou
function toIntro(first){
  if(first){G.lvlDeaths=0;G.underOpen=-1;G.lvlHurt=false;G.lvlSeen=false;}
  G.state='intro';G.stateT=0;G.tip=pickTip(first);
  if(first&&!LEVELS[G.level].arena){MOS.last=G.level;MOS.best=Math.max(MOS.best,G.level);mosSave();}
}
// quiet = doar pregătește nivelul, fără muzică
function startLevel(quiet){
  const def=LEVELS[G.level],m=def.build();
  grid=m.grid;cols=m.w;theme=THEMES[def.theme];tiles=getTiles(def.theme);bg=getBG(def.theme);goal=m.goalDef;
  enemies=m.ents.map(d=>makeEnemy(d.type,d.x,d.y));
  G.frame=0;plats=m.plats.map(makePlat);boss=m.bossDef?makeBoss(m.bossDef):null;cafe=m.cafeDef?makeCafe(m.cafeDef):null;under=m.underDef?makeUnder(m.underDef):null;G.inUnder=false;G.subT=0;G.doorT=0;G.inCafe=false;G.talk=null;G.lift=0;golds=makeGolds(m);
  // Mobii puși pe o platformă care se mișcă stau pe ea de la început
  for(const e of enemies){const p=plats.find(p=>Math.abs(p.y-(e.y+e.h))<1&&e.x+e.w>p.x&&e.x<p.x+p.w);if(p)e.plat=p;}
  coins=m.coins.map(([x,y])=>({x:x*TS+8,y:y*TS+8,taken:false}));G.lvlCoins=0;   // bănuții luați acum
  items=[];parts=[];popups=[];booms=[];bumps=[];feathers=[];
  iceCrack=new Float32Array(cols);iceHole=new Int16Array(cols);iceTouch=new Int32Array(cols);
  const atCp=G.cp&&G.cp.level===G.level;
  // La reapariție, punctele de salvare până la cel atins sunt deja ridicate
  cps=m.cps.map(x=>{const done=atCp&&x<=G.cp.x;return {x:x*TS,tx:x,on:done,raise:done?1:0};});
  const sx=atCp?G.cp.x*TS+3:2*TS+3;
  const big=!!G.carryBig;
  // Pe sol, chiar dacă pământul de acolo e mai sus (insulă înălțată, deal)
  let gy=12;const gx=[Math.floor(sx/TS),Math.floor((sx+11)/TS)];while(gy>0&&gx.some(c=>solid(tileAt(c,gy-1))))gy--;
  player={x:sx,y:gy*TS-(big?20:13),w:big?12:10,h:big?20:13,big,fire:big&&!!G.carryFire,ice:big&&!!G.carryIce,vx:0,vy:0,face:1,onGround:false,coyote:0,jbuf:0,inv:0,anim:0,combo:0,dead:false,alpha:1};
  G.growT=0;
  G.time=300;G.frame=0;G.paused=false;G.tally=0;
  cam.x=clamp(player.x-W*0.4,0,cols*TS-W);
  lakeLife=initLakeLife();
  G.state='play';if(quiet)return;
  playSong(def.song||'main');
  applyAudio();
  if(TEST)testMap();
}
function levelClear(final){goldSaveLevel();achLevelClear();G.carryBig=player.big;G.carryFire=player.fire;G.carryIce=player.ice;feathers=[];G.state='clear';G.final=final;G.stateT=0;G.tally=0;G.clearTime=G.time;stopSong();playSong('clear');player.vx=0;}
