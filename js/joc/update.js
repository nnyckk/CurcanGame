'use strict';
// ===== UPDATE: un cadru de joc =====
function updateCam(){
  // În lupta cu boss-ul, camera stă pe poiană
  const target=boss&&boss.lock?boss.a0-TS:inCafe()?cafe.a*TS+CAFE_CAMX:inUnder()?underCam():clamp(player.x+player.w/2-W*0.42,0,camMax());
  cam.x+=(target-cam.x)*0.18;
}
function updatePlay(){
  // Afară, cât vorbește cineva
  G.lift=(G.lift||0)+((G.talk&&!inCafe()?TALK_LIFT:0)-(G.lift||0))*0.25;if(G.lift<0.5&&!G.talk)G.lift=0;
  // Animația de creștere/micșorare îngheață jocul pentru o clipă
  if(G.growT>0){G.growT--;return;}
  // Intrarea / ieșirea din cafenea: ecranul se întunecă
  if(G.doorT>0){if(--G.doorT===DOOR_T/2)cafeTeleport();updateFx();return;}
  // Intrarea / ieșirea din peșteră: tot cu întunecare
  if(G.subT>0){if(--G.subT===DOOR_T/2)subTeleport();updateFx();return;}
  // Cât vorbește cineva, jocul stă: doar caseta de dialog
  if(G.talk){updateTalk();if(cafe)updateCafe();updateFx();return;}
  G.frame++;
  if(!TEST&&!inCafe()&&G.frame%60===0){G.time--;   // în cafenea timpul stă pe loc
    if(G.time===100){sfx.hurry();popup('GRĂBEȘTE-TE!',player.x+5,player.y-12,'#ff6060');}
    if(G.time<=0){G.time=0;die('time');return;}}
  updatePlats();
  updatePlayer();
  if(G.state!=='play'){updateFx();return;}
  updateUnder();
  if(cafe){updateCafe();const d=cafeAction();
    if(d&&upPressed()){if(d==='talk')openTalk([cafeLine()]);else{G.doorT=DOOR_T;G.doorTo=d;player.vx=0;sfx.bell();}}}
  for(const e of enemies){
    if(e.remove)continue;
    if(!e.active){if(e.x<cam.x+W+24&&e.x>cam.x-80)e.active=true;else continue;}
    if(e.type==='man')updateMan(e);else updateBomb(e);
    if(G.state!=='play')break;
  }
  if(G.state==='play')for(const e of enemies){
    if(!e.active||e.dead||e.remove||e.sink||player.dead||offstage(e))continue;
    const box=e.sit?{x:e.x-BOMB_PUSH_PAD,y:e.y,w:e.w+BOMB_PUSH_PAD*2,h:e.h}:e;
    if(!overlap(player,box))continue;
    const stomp=player.vy>0&&(player.y+player.h-e.y)<=Math.max(8,player.vy+3);
    if(stomp){
      player.y=e.y-player.h;player.vy=inJump()?-6.6:-4.3;
      // Înghețat: săritura în cap sparge gheața cu el
      if(e.frozen){shatter(e,[200,400,800,1600,3200][Math.min(player.combo,4)]);player.combo++;}
      else if(e.type==='man'){killMan(e,1,[200,400,800,1600,3200][Math.min(player.combo,4)]);player.combo++;sfx.stomp();}
      else{
        // Bomba: prima săritură în cap o așază în fund
        if(!e.sit||e.slideDir)sitBomb(e);else kickBomb(e,player.face);
        e.byPlayer=true;sfx.stomp();   // byPlayer: dacă te prinde explozia ei, e AUTOGOL
      }
      if(player.combo>=4)achUnlock('combo');   // 4 dușmani la rând
    }else if(e.frozen||(e.type==='bomb'&&e.sit)){pushBomb(e,box);e.byPlayer=true;}   // înghețații nu rănesc: se împing
    else if(e.type==='man')hurt(Math.sign(player.x-e.x)||1);
  }
  enemies=enemies.filter(e=>!e.remove);
  if(boss){updateBoss();bossArenaBounds();enemies=enemies.filter(e=>!e.remove);}
  updateIce();
  updateFeathers();
  for(const c of coins){if(c.taken)continue;if(overlap(player,{x:c.x-5,y:c.y-6,w:10,h:12})){c.taken=true;addCoin(c.x,c.y);sparkle(c.x,c.y);}}
  updateGolds();
  for(const it of items){
    if(it.rise>0){it.y+=it.down?1:-1;it.rise--;continue;}   // down: iese pe dedesubt
    // Boaba roșie stă pe loc deasupra blocului
    if(it.type==='berry'||it.type==='ice'){if(it.down){it.vy=Math.min(it.vy+0.35,6);moveY(it);if(it.y+it.h>WATER_Y&&overPit(it)){it.remove=true;splash(it.x+it.w/2);continue;}}   // ieșită pe dedesubt: cade drept pe pământ
      if(overlap(player,it)){it.remove=true;if(it.type==='ice')powerIce(it.x+5,it.y);else powerFire(it.x+5,it.y);}continue;}
    it.vx=it.dir*0.8;it.vy=Math.min(it.vy+0.35,6);moveX(it);if(it.hitWall)it.dir*=-1;moveY(it);
    if(it.y+it.h>WATER_Y&&overPit(it)){it.remove=true;splash(it.x+it.w/2);continue;}
    if(overlap(player,it)){it.remove=true;powerUp(it.x+5,it.y);}
  }
  items=items.filter(i=>!i.remove);
  for(const cp of cps){if(cp.on){cp.raise=Math.min(1,cp.raise+0.05);continue;}
    if(!inRoom()&&player.x+player.w>cp.x+6){cp.on=true;G.cp={level:G.level,x:cp.tx};goldCheckpoint();sfx.cp();popup('SALVAT!',cp.x+8,150,'#7fff7f');}}
  if(G.state==='play'&&goal&&!inRoom()){
    if(goal.type==='sign'&&player.x+player.w>goal.x*TS+34)levelClear(false);
    else if(goal.type==='restaurant'&&overlap(player,doorRect()))levelClear(true);
  }
  updateFx();updateCam();
}
function updateDying(){
  G.stateT++;
  if(player.drown){
    // Se scufundă încet
    player.vy=player.vy*0.88+0.04;player.y+=player.vy;
    if(G.stateT%7===0&&G.stateT<130)bubble(player.x+player.w/2,player.y+4);
  }else{
    if(G.stateT===30)player.vy=-6.5;
    if(G.stateT>30){player.vy+=0.35;player.y+=player.vy;}
  }
  if(G.stateT>=160){if(TEST){startLevel();return;}G.lives--;
    if(G.lives<=0){G.state='gameover';G.stateT=0;playSong('gameover');saveHi();}
    else toIntro(false);}
}
function updateClear(){
  G.stateT++;
  if(!G.final){player.face=1;player.vx=1.3;player.vy=Math.min(player.vy+0.42,7);moveX(player);moveY(player);player.anim+=0.3;}
  else{const d=doorRect(),tx=d.x+d.w/2-player.w/2;player.x+=Math.sign(tx-player.x)*Math.min(0.8,Math.abs(tx-player.x));player.anim+=0.2;
    if(G.stateT>25)player.alpha=Math.max(0,player.alpha-0.04);}
  updateCam();
  if(G.stateT>60){
    if(G.time>0){const d=Math.min(G.time,3);G.time-=d;G.score+=d*50;if(G.stateT%4===0)sfx.blip();}
    else if(++G.tally>90){
      if(G.final){G.state='win';G.stateT=0;saveHi();playSong('win');MOS.wins++;mosSave();
        achUnlock('pofta');if(G.fullRun&&!G.runDeaths)achUnlock('nemuritor');}
      else{G.level++;G.cp=null;toIntro(true);}
    }
  }
}
function updateWin(){
  G.stateT++;
  if(G.stateT%28===1){const x=cam.x+40+Math.random()*(W-80),y=30+Math.random()*70;const cols=['#ff4a5a','#ffd23f','#5ad0ff','#7fff7f','#ff8ae0','#ffffff'];const c=cols[Math.random()*cols.length|0];
    for(let i=0;i<34;i++){const a=i/34*TAU,s=1.2+Math.random()*1.4;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:0.035,life:55,max:55,col:i%3?c:'#fff',s:2});}sfx.pop();}
  updateFx();
  if(G.stateT>120&&startPressed()){
    if(TEST){G.cp=null;startLevel();return;}   // în modul de test nu există meniu
    G.state='title';stopSong();playSong('title');}
}
function toggleMusic(){G.music=!G.music;saveSettings();applyAudio();}
function update(){
  G.t++;
  if(pressed.KeyM)toggleMusic();
  if(TEST&&pressed.KeyR)TEST_CMDS.reset();
  switch(G.state){
    case 'title':cam.x+=0.6;if(AC&&!seq.song)playSong('title');break;
    // Ecranul de dinaintea nivelului stă până apeși ENTER / SPACE
    case 'intro':G.stateT++;
      {const n=Math.floor(introTipN()),len=[...(G.tip||'')].length;if(n>0&&n<len&&G.stateT%3===0)sfx.talk();}   // Moș Curcan vorbește
      if(G.stateT>40&&startPressed())startLevel();break;
    case 'play':
      if(pressed.KeyP||pressed.Escape){G.paused=!G.paused;sfx.pause();applyAudio();}
      // G.stepOnce: pe pauză, jocul avansează un singur cadru
      if(!G.paused||G.stepOnce){G.stepOnce=false;updatePlay();}break;
    case 'dying':updateDying();updateFx();break;
    case 'clear':updateClear();updateFx();break;
    case 'win':updateWin();break;
    case 'gameover':G.stateT++;if(G.stateT>90&&startPressed()){G.state='title';stopSong();playSong('title');}break;
  }
  updateAch();
  for(const k in pressed)delete pressed[k];
  if(TOUCH_UI)TOUCH_UI.classList.toggle('door',G.state==='play'&&!!cafeAction());
  if(TEST&&G.t%6===0)testStatus();
}
