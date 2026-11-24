'use strict';
// ===== MODUL DE TEST =====
// Laboratorul
const TEST_LEVEL={theme:0,tip:'',arena:true,build(){const m=newMap(64);m.g(0,63);
  m.f(0,0,1,12,'X');m.f(63,0,1,12,'X');
  m.r(6,8,'BHBMB');m.c(7,5,3);m.r(14,8,'H');
  m.r(22,8,'======');m.c(23,7,4);
  // Groapa cu apă e pe primul ecran
  if(THEMES[TEST_LEVEL.theme].snow){m.lake(19,28);m.pit(23,24);}else m.pit(20,22);
  m.e('bomb',17);m.c(20,9,3);m.e('boy',30);
  // Deal cu pasaj în trepte, deal mare în spate și un bloc sus
  m.hill(32,[4,4,4,4,4,4,4,4,4,4,4,4]);m.tunnel(32,10,12,2);m.tunnel(34,9,8,1);m.c(35,9,6);m.e('bomb',38);
  m.back(40,[6,6,6,6,6,6,6]);m.c(41,5,3);m.e('man',45,5);m.r(43,2,'M');
  m.st(50,3,1);
  m.sp(56,2);
  return m.done();}};
const ARENA_SONG={0:undefined,1:'winter',2:undefined,3:'night',5:'winter'};
const ARENA_THEMES=[0,3,1,5,2];   // decorurile arenei: zi, noapte
// Arena e ultima în LEVELS
const ARENA=TEST?LEVELS.push(TEST_LEVEL)-1:-1;
// Pornește nivelul lv de la început sau de la punctul de salvare cp
function testLoad(lv,cp){
  const alive=player&&!player.dead;
  G.carryBig=alive&&player.big;G.carryFire=alive&&player.fire;G.carryIce=alive&&player.ice;
  G.level=lv;G.slotUsed=null;G.cafeLv=-1;G.bossMet=false;G.goldLv=-1;G.cageLv=-1;G.cafeSeen=false;G.underOpen=-1;
  G.lvlHurt=false;G.lvlSeen=false;G.fullRun=false;   // achievements: nivelul ales e luat de la început
  const x=cp>0?LEVELS[lv].build().cps[cp-1]:undefined;
  G.cp=x===undefined?null:{level:lv,x};
  startLevel();
}
// Rândul pe care se poate sta în coloana x
function standRow(x){
  for(let y=0;y<ROWS;y++){const t=tileAt(x,y);if(t==='K')continue;
    if(solid(t)||ledge(x,y))return y<2||t==='^'||(t==='I'&&iceHole[x]>0)?-1:y;}
  return -1;
}
// Mută curcanul pe coloana tx
function testTeleport(tx){
  if(G.state!=='play'||player.dead||!isFinite(tx))return;
  tx=clamp(Math.floor(tx),1,cols-2);
  for(let d=0;d<40;d++)for(const x of d?[tx+d,tx-d]:[tx]){
    if(x<1||x>cols-2)continue;
    const y=standRow(x);if(y<0)continue;
    const p=player;p.x=x*TS+(TS-p.w)/2;p.y=y*TS-p.h;p.vx=0;p.vy=0;p.onGround=false;
    feathers=[];cam.x=clamp(p.x+p.w/2-W*0.42,0,cols*TS-W);
    // În nivelul bonus
    G.inCafe=!!cafe&&p.x>=cafe.a*TS;if(G.inCafe)cam.x=cafe.a*TS+CAFE_CAMX;
    G.inUnder=!!under&&p.x>=under.a*TS;if(G.inUnder)cam.x=underCam();   // în peștera de sub pământ
    dust(p.x+p.w/2,p.y+p.h,6);
    return;
  }
}
// Forma curcanului, aleasă din panou: mic, mare
function testForm(f){
  if(G.state!=='play'||player.dead)return;
  const p=player,x=p.x+p.w/2,y=p.y;
  if(f==='small'){p.fire=false;p.ice=false;if(p.big){setBig(false);G.morph='size';G.growT=48;sfx.shrink();}}
  else if(f==='big'){if(!p.big)powerUp(x,y);else if(p.fire||p.ice){G.morph=p.fire?'fire':'ice';p.fire=false;p.ice=false;G.growT=48;sfx.shrink();}}
  else if(f==='fire')powerFire(x,y);
  else if(f==='ice')powerIce(x,y);
}
// Pune un mob nou pe sol
function testSpawn(type){
  if(G.state!=='play'||player.dead)return null;
  const tx=clamp(Math.floor((player.x+player.w/2+player.face*96)/TS),1,cols-2);
  let ty=Math.max(0,Math.floor(player.y/TS));
  while(ty<ROWS&&!solid(tileAt(tx,ty))&&!ledge(tx,ty))ty++;   // și pe scânduri / iarba din spate
  if(ty>=ROWS)return null;
  const e=makeEnemy(type,tx,ty-1);e.active=true;e.dir=-player.face;enemies.push(e);
  return e;
}
const TEST_CMDS={
  // Panoul s-a încărcat: îi trimitem nivelurile
  hello(){testHello();testMap();},
  // Un nivel adevărat sau arena într-un decor
  level(d){
    if(d.arena!==undefined){const t=d.arena|0;if(!THEMES[t])return;TEST_LEVEL.theme=t;TEST_LEVEL.song=ARENA_SONG[t];testLoad(ARENA,0);}
    else testLoad(clamp(d.level|0,0,ARENA-1),0);},
  // Nivelul de acum
  from(d){testLoad(G.level,d.cp|0);},
  // Repornește de unde ai reapărea dacă ai muri
  reset(){const alive=!player.dead;G.carryBig=alive&&player.big;G.carryFire=alive&&player.fire;G.carryIce=alive&&player.ice;startLevel();},
  tp(d){testTeleport(+d.x);},
  form(d){testForm(d.form);},
  boy(){testSpawn('boy');},
  man(){testSpawn('man');},
  bomb(){testSpawn('bomb');},
  sitbomb(){const e=testSpawn('bomb');if(e)sitBomb(e);},
  clear(){enemies=[];},
  goldskin(){G.testGold=!G.testGold;},   // curcanul de aur, pornit / oprit
  god(){G.god=!G.god;},
  haskey(){G.testKey=!G.hasKey;G.hasKey=G.testKey;},   // cheia coliviei
  hitbox(){G.showHB=!G.showHB;},
  speed(d){G.speed=[1,0.5,0.25].includes(d.v)?d.v:1;},
  pause(){if(G.state!=='play')return;G.paused=!G.paused;sfx.pause();applyAudio();},
  // Un singur cadru: dacă jocul merge
  step(){if(G.state!=='play')return;if(!G.paused){G.paused=true;sfx.pause();applyAudio();}else G.stepOnce=true;},
};
if(TEST)addEventListener('message',e=>{
  // Doar comenzi de la pagina care ne-a deschis
  if(e.source!==window.parent||!(location.protocol==='file:'||e.origin===location.origin))return;
  const d=e.data;if(!d||!Object.prototype.hasOwnProperty.call(TEST_CMDS,d.cmd)||!player)return;
  TEST_CMDS[d.cmd](d);
});
const toParent=msg=>{if(window.parent!==window)window.parent.postMessage(msg,'*');};
// O dată, la cererea panoului: nivelurile
function testHello(){
  const u=c=>c.toDataURL();
  const levels=LEVELS.slice(0,ARENA).map((d,i)=>({name:THEMES[d.theme].name,theme:d.theme,cps:d.build().cps.length,
    bonus:!!d.bonus,num:d.bonus?'★':String(levelNum(i))}));
  const themes=THEMES.map(t=>({sky:t.sky,grass:t.grass,night:!!t.night}));
  toParent({hello:{version:GAME_VERSION,levels,arenaTheme:TEST_LEVEL.theme,themes,
    icons:{tks:u(TKS.A.r),tk:u(TK.A.r),tkf:u(TKF.A.r),tki:u(TKI.A.r),boy:u(BOY.A.l),man:u(MAN.A.l),bomb:u(BOMB.A.l),sit:u(BOMB.S.l),head:u(HEAD)}}});
}
// Harta nivelului pentru panou
function testMap(){
  const def=LEVELS[G.level],th=theme;
  toParent({map:{level:G.level,arena:!!def.arena,bonus:!!def.bonus,num:def.arena?0:levelNum(G.level),theme:def.theme,name:th.name,cols,rows:grid.map(r=>r.join('')),
    cps:cps.map(c=>c.tx),goal,colors:{sky:th.sky,grass:th.grass,dirt:th.dirt,water:th.water.body,night:!!th.night},
    plats:plats.map(p=>({kind:p.kind,x:p.x0/TS,y:p.y0/TS,w:p.w/TS,ax:p.ax,range:p.range/TS})),
    golds:golds.map(g=>({x:g.tx,y:g.ty,kind:g.kind})),cage:cage?{x:(cage.x-8)/TS,y:cage.y/TS-1}:null}});
}
// Starea, de 10 ori pe secundă
function testStatus(){
  if(!player)return;
  const p=player,r1=v=>Math.round(v*10)/10;
  toParent({status:{level:G.level,state:G.state,form:!p.big?'small':p.fire?'fire':p.ice?'ice':'big',
    god:!!G.god,hitbox:!!G.showHB,goldskin:!!G.testGold,haskey:!!G.hasKey,speed:G.speed||1,paused:!!G.paused,
    px:r1((p.x+p.w/2)/TS),py:r1((p.y+p.h)/TS),cam:r1(cam.x/TS),view:W/TS,
    cp:G.cp&&G.cp.level===G.level?cps.findIndex(c=>c.tx===G.cp.x)+1:0,cpOn:cps.map(c=>c.on),
    gold:golds.map(g=>g.taken?2:g.ghost?1:0),
    // Colivia: 0 încuiată, 1 deschisă acum, 2 salvată deja; cheia: unde e
    cage:cage?(cage.st==='locked'?0:G.cageNow||G.cageHeld?1:2):-1,
    key:G.hasKey?'got':keyIt?[r1((keyIt.x+2)/TS),r1((keyIt.y+keyIt.h)/TS)]:(k=>k?[r1((k.x+k.w/2)/TS),r1((k.y+k.h)/TS)]:null)(enemies.find(e=>e.key&&!e.dead&&!e.remove)),
    mobs:enemies.filter(e=>!e.dead&&!e.remove).map(e=>[r1((e.x+e.w/2)/TS),r1((e.y+e.h)/TS),e.frozen?'f':e.type==='bomb'?'b':e.boy?'u':'m'])
      .concat(boss&&(bossFighting()||boss.st==='wait')?[[r1((boss.x+boss.w/2)/TS),r1((boss.y+boss.h)/TS),'B']]:[])}});
}
// Contururile hitbox-urilor: verde = curcan
function drawHitboxes(cx){
  ctx.lineWidth=1;
  const r=(o,col)=>{ctx.strokeStyle=col;ctx.strokeRect(Math.round(o.x-cx)+0.5,Math.round(o.y)+0.5,Math.max(1,Math.round(o.w)-1),Math.max(1,Math.round(o.h)-1));};
  if(player&&!player.dead)r(player,'#00ff66');
  for(const e of enemies){if(!e.active||e.dead||e.remove)continue;
    r(e,e.type==='man'?(e.boy?'#ffffff':'#ff4040'):'#ffa000');
    if(e.type==='man'&&e.atk>MAN_WIND_T&&e.atk-MAN_WIND_T<=10)r(forkBox(e),'#ff40ff');
    if(e.type==='bomb'&&e.sit&&BOMB_PUSH_PAD)r({x:e.x-BOMB_PUSH_PAD,y:e.y,w:e.w+BOMB_PUSH_PAD*2,h:e.h},'#ffff40');}
  for(const it of items)r(it,'#40c0ff');
  for(const f of feathers)r(f,'#ffc080');
  for(const p of plats)if(p.solid)r(p,'#40ffd0');
  if(bossFighting()||(boss&&boss.st==='wait')){r(boss,'#ff4040');for(const f of boss.forks)if(!f.stuckT)r(forkTip(f),'#ff40ff');
    if(boss.st==='strike'&&boss.ext>0)r(bossStrikeBox(),'#ff40ff');}
}
