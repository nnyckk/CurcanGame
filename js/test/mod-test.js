'use strict';
// ================= MODUL DE TEST (index.html?test, folosit de test.html) =================
// Laboratorul: joci arena de test sau oricare dintre cele 4 niveluri (de la început sau de la un punct de salvare),
// muți curcanul oriunde din harta de sub joc, îi schimbi forma, aduci mobi și pornești unelte (invincibil,
// hitbox-uri, viteză, pauză și avans cadru cu cadru). Fără cronometru, vieți infinite (la moarte reapari pe loc).
// Arena: pereți la capete (ca bombele împinse să ricoșeze), blocuri cu power-up, platformă, trepte și țepi.
// Se poate juca în oricare dintre cele 4 decoruri (theme), fiecare cu muzica lui.
const TEST_LEVEL={theme:0,tip:'',arena:true,build(){const m=newMap(64);m.g(0,63);
  m.f(0,0,1,12,'X');m.f(63,0,1,12,'X');
  m.r(6,8,'BHBMB');m.c(7,5,3);m.r(14,8,'H');
  m.r(22,8,'======');m.c(23,7,4);
  // Groapa cu apă e pe primul ecran, imediat după prima bombă (s-o poți împinge direct în apă).
  // Iarna, groapa devine un lac înghețat mai mare, cu o copcă la mijloc (să încerci alunecarea și crăparea gheții).
  if(THEMES[TEST_LEVEL.theme].snow){m.lake(19,28);m.pit(23,24);}else m.pit(20,22);
  m.e('bomb',17);m.c(20,9,3);m.e('boy',30);m.e('bomb',38);m.e('man',44);
  m.st(50,3,1);
  m.sp(56,2);
  return m.done();}};
const ARENA_SONG={0:undefined,1:'winter',2:undefined,3:'night',5:'winter'};
const ARENA_THEMES=[0,3,1,5,2];   // decorurile arenei: zi, noapte, iarnă, iarnă noaptea, deșert (păstrat pentru viitor)
// Arena e ultima în LEVELS (adăugată doar în modul de test); nivelurile adevărate sunt 0 .. ARENA-1.
const ARENA=TEST?LEVELS.push(TEST_LEVEL)-1:-1;
// Pornește nivelul lv de la început (cp=0) sau de la punctul de salvare cp (1, 2), cu curcanul în forma de acum.
function testLoad(lv,cp){
  const alive=player&&!player.dead;
  G.carryBig=alive&&player.big;G.carryFire=alive&&player.fire;G.carryIce=alive&&player.ice;
  G.level=lv;G.slotUsed=null;G.bossMet=false;G.goldLv=-1;G.cafeSeen=false;
  const x=cp>0?LEVELS[lv].build().cps[cp-1]:undefined;
  G.cp=x===undefined?null:{level:lv,x};
  startLevel();
}
// Rândul pe care se poate sta în coloana x: cel mai de sus sol, bloc sau platformă, dacă deasupra e loc de curcan.
// -1 = acolo nu se poate sta (groapă, zid până sus, țepi, gaură în gheață).
function standRow(x){
  for(let y=0;y<ROWS;y++){const t=tileAt(x,y);if(t==='K')continue;   // (tavanul cafenelei nu e un loc de stat)
    if(solid(t)||t==='=')return y<2||t==='^'||(t==='I'&&iceHole[x]>0)?-1:y;}
  return -1;
}
// Mută curcanul pe coloana tx (click pe harta din panou); dacă acolo nu se poate sta, pe cea mai apropiată coloană bună.
function testTeleport(tx){
  if(G.state!=='play'||player.dead||!isFinite(tx))return;
  tx=clamp(Math.floor(tx),1,cols-2);
  for(let d=0;d<40;d++)for(const x of d?[tx+d,tx-d]:[tx]){
    if(x<1||x>cols-2)continue;
    const y=standRow(x);if(y<0)continue;
    const p=player;p.x=x*TS+(TS-p.w)/2;p.y=y*TS-p.h;p.vx=0;p.vy=0;p.onGround=false;
    feathers=[];cam.x=clamp(p.x+p.w/2-W*0.42,0,cols*TS-W);
    // În nivelul bonus, un click pe camera cafenelei te duce înăuntru (cu camera pe ea), altfel ești afară.
    G.inCafe=!!cafe&&p.x>=cafe.a*TS;if(G.inCafe)cam.x=cafe.a*TS+CAFE_CAMX;
    dust(p.x+p.w/2,p.y+p.h,6);
    return;
  }
}
// Forma curcanului, aleasă din panou: mic, mare, de foc sau de gheață (cu animația de transformare din joc).
function testForm(f){
  if(G.state!=='play'||player.dead)return;
  const p=player,x=p.x+p.w/2,y=p.y;
  if(f==='small'){p.fire=false;p.ice=false;if(p.big){setBig(false);G.morph='size';G.growT=48;sfx.shrink();}}
  else if(f==='big'){if(!p.big)powerUp(x,y);else if(p.fire||p.ice){G.morph=p.fire?'fire':'ice';p.fire=false;p.ice=false;G.growT=48;sfx.shrink();}}
  else if(f==='fire')powerFire(x,y);
  else if(f==='ice')powerIce(x,y);
}
// Pune un mob nou pe sol, la ~6 tile-uri în fața curcanului, cu fața spre el.
function testSpawn(type){
  if(G.state!=='play'||player.dead)return null;
  const tx=clamp(Math.floor((player.x+player.w/2+player.face*96)/TS),1,cols-2);
  let ty=Math.max(0,Math.floor(player.y/TS));
  while(ty<ROWS&&!solid(tileAt(tx,ty))&&tileAt(tx,ty)!=='=')ty++;   // și pe scânduri
  if(ty>=ROWS)return null;
  const e=makeEnemy(type,tx,ty-1);e.active=true;e.dir=-player.face;enemies.push(e);
  return e;
}
const TEST_CMDS={
  // Panoul s-a încărcat: îi trimitem nivelurile, culorile decorurilor, iconițele și harta nivelului de acum.
  hello(){testHello();testMap();},
  // Un nivel adevărat (level 0-3) sau arena într-un decor (arena = indexul din THEMES), de la început.
  level(d){
    if(d.arena!==undefined){const t=d.arena|0;if(!THEMES[t])return;TEST_LEVEL.theme=t;TEST_LEVEL.song=ARENA_SONG[t];testLoad(ARENA,0);}
    else testLoad(clamp(d.level|0,0,ARENA-1),0);},
  // Nivelul de acum, de la început (cp=0) sau de la un punct de salvare (cp=1, 2).
  from(d){testLoad(G.level,d.cp|0);},
  // Repornește de unde ai reapărea dacă ai muri (ultimul punct de salvare atins), cu aceeași formă (tasta R).
  reset(){const alive=!player.dead;G.carryBig=alive&&player.big;G.carryFire=alive&&player.fire;G.carryIce=alive&&player.ice;startLevel();},
  tp(d){testTeleport(+d.x);},
  form(d){testForm(d.form);},
  boy(){testSpawn('boy');},
  man(){testSpawn('man');},
  bomb(){testSpawn('bomb');},
  sitbomb(){const e=testSpawn('bomb');if(e)sitBomb(e);},
  clear(){enemies=[];},
  goldskin(){G.testGold=G.testGold===false;},   // curcanul de aur (și fără pene), pornit / oprit
  god(){G.god=!G.god;},
  hitbox(){G.showHB=!G.showHB;},
  speed(d){G.speed=[1,0.5,0.25].includes(d.v)?d.v:1;},
  pause(){if(G.state!=='play')return;G.paused=!G.paused;sfx.pause();applyAudio();},
  // Un singur cadru: dacă jocul merge, întâi îl pune pe pauză.
  step(){if(G.state!=='play')return;if(!G.paused){G.paused=true;sfx.pause();applyAudio();}else G.stepOnce=true;},
};
if(TEST)addEventListener('message',e=>{
  // Doar comenzi de la pagina care ne-a deschis (test.html), din același loc.
  if(e.source!==window.parent||!(location.protocol==='file:'||e.origin===location.origin))return;
  const d=e.data;if(!d||!Object.prototype.hasOwnProperty.call(TEST_CMDS,d.cmd)||!player)return;
  TEST_CMDS[d.cmd](d);
});
const toParent=msg=>{if(window.parent!==window)window.parent.postMessage(msg,'*');};
// O dată, la cererea panoului: nivelurile (nume, decor, câte puncte de salvare), culorile fiecărui decor (cer și
// iarbă, pentru pătrățelul de pe cardurile de nivel) și iconițele (sprite-urile din joc), ca butoanele din panou să
// arate ca jocul.
function testHello(){
  const u=c=>c.toDataURL();
  const levels=LEVELS.slice(0,ARENA).map((d,i)=>({name:THEMES[d.theme].name,theme:d.theme,cps:d.build().cps.length,
    bonus:!!d.bonus,num:d.bonus?'★':String(levelNum(i))}));
  const themes=THEMES.map(t=>({sky:t.sky,grass:t.grass,night:!!t.night}));
  toParent({hello:{version:GAME_VERSION,levels,arenaTheme:TEST_LEVEL.theme,themes,
    icons:{tks:u(TKS.A.r),tk:u(TK.A.r),tkf:u(TKF.A.r),tki:u(TKI.A.r),boy:u(BOY.A.l),man:u(MAN.A.l),bomb:u(BOMB.A.l),sit:u(BOMB.S.l),head:u(HEAD)}}});
}
// Harta nivelului pentru panou, la fiecare pornire de nivel: rândurile de tile-uri, punctele de salvare, ținta și
// culorile decorului. Panoul o desenează mică, sub joc; un click pe ea mută curcanul acolo (comanda tp).
function testMap(){
  const def=LEVELS[G.level],th=theme;
  toParent({map:{level:G.level,arena:!!def.arena,bonus:!!def.bonus,num:def.arena?0:levelNum(G.level),theme:def.theme,name:th.name,cols,rows:grid.map(r=>r.join('')),
    cps:cps.map(c=>c.tx),goal,colors:{sky:th.sky,grass:th.grass,dirt:th.dirt,water:th.water.body,night:!!th.night},
    plats:plats.map(p=>({kind:p.kind,x:p.x0/TS,y:p.y0/TS,w:p.w/TS,ax:p.ax,range:p.range/TS})),
    golds:golds.map(g=>({x:g.tx,y:g.ty,kind:g.kind}))}});
}
// Starea, de 10 ori pe secundă: ce e pornit (pentru butoanele din panou) și unde sunt curcanul, camera și mobii
// (în tile-uri, pentru hartă). cp = punctul de unde reapari (0 = început).
function testStatus(){
  if(!player)return;
  const p=player,r1=v=>Math.round(v*10)/10;
  toParent({status:{level:G.level,state:G.state,form:!p.big?'small':p.fire?'fire':p.ice?'ice':'big',
    god:!!G.god,hitbox:!!G.showHB,goldskin:G.testGold!==false,speed:G.speed||1,paused:!!G.paused,
    px:r1((p.x+p.w/2)/TS),py:r1((p.y+p.h)/TS),cam:r1(cam.x/TS),view:W/TS,
    cp:G.cp&&G.cp.level===G.level?cps.findIndex(c=>c.tx===G.cp.x)+1:0,cpOn:cps.map(c=>c.on),
    gold:golds.map(g=>g.taken?2:g.ghost?1:0),
    mobs:enemies.filter(e=>!e.dead&&!e.remove).map(e=>[r1((e.x+e.w/2)/TS),r1((e.y+e.h)/TS),e.frozen?'f':e.type==='bomb'?'b':e.boy?'u':'m'])
      .concat(boss&&(bossFighting()||boss.st==='wait')?[[r1((boss.x+boss.w/2)/TS),r1((boss.y+boss.h)/TS),'B']]:[])}});
}
// Contururile hitbox-urilor: verde = curcan, roșu = fermier, alb = ucenic, portocaliu = bombă, mov = furca (cât lovește),
// galben = zona solidă a bombei în fund (dacă e mai mare decât hitbox-ul), albastru = power-up, portocaliu deschis = pene.
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
