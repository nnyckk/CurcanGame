'use strict';
// ================= FERMIERUL-ȘEF: comportamentul (atacuri, eschive, lovituri) =================
function makeBoss(d){
  // Scândurile din poiană (pe care sare ca să scape de bombe).
  const planks=[];
  for(let ty=3;ty<12;ty++)for(let tx=d.a;tx<d.b;tx++)if(tileAt(tx,ty)==='='){let e=tx;while(tileAt(e+1,ty)==='=')e++;planks.push({x0:tx*TS,x1:(e+1)*TS,top:ty*TS});tx=e;}
  return {x:d.x*TS,y:BOSS_Y,w:16,h:BOSS_H,dir:-1,hp:BOSS_HP,st:'wait',t:0,vx:0,vy:0,a0:d.a*TS,a1:d.b*TS,lock:false,planks,bombSeen:0,fleeDir:1,
    cd:40,volleyT:40,leapT:200,bombT:120,chargeT:0,inv:0,ice:0,logY:-60,gate:0,forks:[],vn:0,vk:0,vwt:20,pn:0,raise:false,
    anim:0,kdir:1,crash:false,jx:0,jy:0,jT:36,after:'land',ext:0};
}
// Furcile aruncate: zboară spre locul unde erai când a aruncat-o (o iau ușor în jos pe drum).
const FORK_G=0.06;
function bossThrowFork(){
  const b=boss,p=player,hx=b.x+b.w/2+b.dir*12,hy=b.y+12,tx=p.x+p.w/2,ty=p.y+p.h/2;
  const t=Math.max(20,Math.abs(tx-hx)/3.6);
  b.forks.push({x:hx,y:hy,vx:b.dir*clamp(Math.abs(tx-hx)/t,2.4,4.2),vy:clamp((ty-hy-0.5*FORK_G*t*t)/t,-3,3),dir:b.dir,stuckT:0,a:0});
  sfx.fwip();
}
// Partea care lovește a furcii aruncate: un pătrat în jurul dinților.
const forkTip=f=>({x:f.x-5,y:f.y-5,w:10,h:10});
// Boss-ul e „în luptă” (îl atingi, te rănește, poate fi lovit) — nu înainte de luptă și nu după ce l-ai învins.
const bossFighting=()=>boss&&!['wait','intro','dead','gone'].includes(boss.st);
const bossVulnerable=()=>['tired','dazed','frozen'].includes(boss.st);
// Se pregătește să sară peste tine sau să dea buzna (sau chiar o face): atunci felinarele poienii se fac roșii.
const bossDanger=()=>boss&&(['leapWarn','chargePrep','charge'].includes(boss.st)||(boss.st==='leap'&&boss.after==='strike'));
// Felinarele de pe stâlpi, câte unul la fiecare capăt al poienii (x = stâlpul, y = felinarul din vârf).
const bossLamps=()=>[{x:boss.a0+14,y:12*TS-82,d:1},{x:boss.a1-14,y:12*TS-82,d:-1}];   // d = grinda spre poiană
// E apă deschisă (nu sol, nu gheață) sub coloana din x?
const bossWater=x=>tileAt(Math.floor(x/TS),12)==='.';
// Cel mai apropiat loc din poiană (x al mijlocului) unde poate sta pe sol sau pe gheață.
function bossSafeX(x){
  const b=boss;x=clamp(x,b.a0+b.w/2,b.a1-b.w/2);
  for(let d=0;d<b.a1-b.a0;d+=4)for(const c of [x+d,x-d])if(c>=b.a0+b.w/2&&c<=b.a1-b.w/2&&!bossWater(c)&&!bossWater(c-b.w/2+2)&&!bossWater(c+b.w/2-2))return c;
  return x;
}
// Sare cu mijlocul în cx, cu picioarele la floorY (sol sau o scândură), în T cadre; after = ce face când aterizează
// ('strike' = împunge, 'perch' = stă pe scândură, 'land' = își revine).
function bossJump(cx,T,after,floorY=12*TS){
  const b=boss;b.jx=cx-b.w/2;b.jy=floorY-b.h;b.after=after;b.st='leap';b.t=0;
  b.vx=(b.jx-b.x)/T;b.vy=(b.jy-b.y-0.2*T*T)/T;sfx.jump();
}
// Pe ce stă (picioarele): pe o scândură, dacă e deasupra uneia, altfel pe sol.
function bossFloorY(){
  const b=boss,cx=b.x+b.w/2;
  for(const pl of b.planks)if(cx>pl.x0&&cx<pl.x1&&b.y+b.h<=pl.top+1)return pl.top;
  return 12*TS;
}
// Cea mai apropiată bombă aprinsă de pe jos, de lângă el (r = distanța), dacă e vreuna. (Nu cea care încă zboară,
// abia aruncată, nici cea înghețată sau stinsă în apă.)
function bossBombNear(r){
  const b=boss,cx=b.x+b.w/2,cy=b.y+b.h/2;let best=null,bd=r*r;
  for(const e of enemies){if(e.type!=='bomb'||e.dead||e.remove||e.sink||e.frozen||e.thrown||!(e.lit>0))continue;
    const dx=e.x+e.w/2-cx,dy=e.y+e.h/2-cy,d=dx*dx+dy*dy;if(d<bd){bd=d;best=e;}}
  return best;
}
// Scapă de bomba de lângă el: sare pe o scândură apropiată (pe care nu stai tu), altfel fuge în partea cealaltă,
// iar dacă n-are loc (e la margine), sare peste bombă.
function bossDodge(e){
  const b=boss,p=player,bcx=b.x+b.w/2,ex=e.x+e.w/2,pcx=p.x+p.w/2;b.raise=false;b.bombSeen=0;
  const pl=b.planks.filter(pl=>Math.abs((pl.x0+pl.x1)/2-bcx)<120&&!(p.y+p.h<=pl.top+1&&pcx>pl.x0-8&&pcx<pl.x1+8))
    .sort((u,v)=>Math.abs((u.x0+u.x1)/2-bcx)-Math.abs((v.x0+v.x1)/2-bcx))[0];
  if(pl){bossJump((pl.x0+pl.x1)/2,36,'perch',pl.top);return;}
  const away=Math.sign(bcx-ex)||(bcx<(b.a0+b.a1)/2?1:-1),room=away>0?b.a1-(b.x+b.w):b.x-b.a0;
  if(room>72){b.st='flee';b.t=0;b.fleeDir=away;return;}
  bossJump(bossSafeX(ex-away*80),32,'land');
}
// O bombă lângă el de cel puțin 10 cadre (îi ia o clipă s-o vadă): fuge de ea. true = a pornit să fugă.
function bossWatchBombs(){
  const b=boss,e=bossBombNear(64);
  if(!e){b.bombSeen=0;return false;}
  if(++b.bombSeen<10)return false;
  bossDodge(e);return true;
}
// Cât lovește furca când împunge (după săritură), în fața lui, la înălțimea pieptului.
function bossStrikeBox(){const b=boss,r=20+b.ext;return b.dir>0?{x:b.x+b.w,y:b.y+13,w:r,h:10}:{x:b.x-r,y:b.y+13,w:r,h:10};}
function bossHit(kdir){
  const b=boss;if(!bossFighting()||b.inv>0||b.st==='hurt')return;
  const wasIce=b.st==='frozen';
  b.hp--;b.lostT=40;b.inv=70;b.kdir=kdir||1;b.vy=0;b.raise=false;b.ice=0;G.shake=12;sfx.bossHurt();
  if(wasIce){iceShards(b.x+b.w/2,b.y+14,14);sfx.shatter();}
  if(b.hp<=0){b.st='dead';b.t=0;b.vy=-6;b.vx=b.kdir*1.4;b.forks=[];stopSong();sfx.bossDown();addScore(5000,b.x+b.w/2,b.y-10);
    popup('FERMIERUL-ȘEF ÎNVINS!',b.x+b.w/2,b.y-24,'#ffd23f');return;}
  addScore(1000,b.x+b.w/2,b.y-8);b.st='hurt';b.t=0;
}
// O pană de gheață l-a nimerit: după BOSS_ICE_HITS pene se face cub de gheață (5 s), în care îi poți sări în cap.
function bossIceHit(){
  const b=boss;if(!bossFighting()||b.st==='frozen'||b.st==='hurt')return;
  for(let i=0;i<6;i++)parts.push({x:b.x+Math.random()*b.w,y:b.y+4+Math.random()*(b.h-8),vx:(Math.random()-0.5)*0.6,vy:-0.3-Math.random()*0.4,g:0,life:18,max:18,col:i%2?'#ffffff':'#bfe8ff',s:1});
  if(++b.ice<BOSS_ICE_HITS){sfx.fwipIce();return;}
  b.ice=0;b.st='frozen';b.t=0;b.raise=false;b.vx=0;b.vy=0;sfx.freezeHit();
}
// De la 2 inimi (după fiecare lovitură primită): cheamă 2 sau 3 mobi, la întâmplare fermieri sau ucenici, care intră în
// poiană pe jos, din lateral: din stânga, de după baloții de fân, și din dreapta, de după cealaltă stivă (vezi e.enter în updateMan).
// Vin pe rând din ambele părți; dacă stai chiar lângă una dintre margini, vin toți din partea cealaltă. Deasupra
// marginii din care vin apare un „!”. Cel mult 4 mobi deodată în poiană.
function bossSummon(){
  const b=boss,alive=enemies.filter(e=>e.type==='man'&&!e.dead&&!e.remove&&(e.enter||(e.x>b.a0-TS&&e.x<b.a1+TS))).length;
  const n=Math.min(2+(Math.random()<0.5?1:0),4-alive);if(n<=0)return;
  const pcx=player.x+player.w/2,near=pcx<b.a0+56?-1:pcx>b.a1-56?1:0;   // marginea lângă care stai: -1 stânga, 1 dreapta
  let side=near?-near:(Math.random()<0.5?-1:1);const queue={'-1':0,'1':0};
  for(let i=0;i<n;i++){
    const e=makeEnemy(Math.random()<0.5?'man':'boy',0,11),q=queue[side]++;   // q = al câtelea vine din partea asta
    // Pornesc chiar de după marginea ecranului (camera stă pe poiană), la rând, unul după altul.
    e.x=side<0?b.a0-TS-e.w-q*28:b.a1+TS+q*28;e.enter=-side;e.dir=-side;e.active=true;e.onGround=true;enemies.push(e);
    if(q===0)popup('!',side<0?b.a0-TS/2:b.a1+TS/2,12*TS-56,'#ff8a5a');
    if(!near)side=-side;
  }
  sfx.alert();   // fără vorbe deasupra lui: vorbește doar în caseta de dialog, prima dată când îl vezi
}
// Mobul chemat de boss care n-a intrat încă de tot în poiană (e după una dintre stivele de fân): nu-l atingi, nu te
// atinge, iar penele trec pe lângă el.
const offstage=e=>e.enter&&boss&&(e.x<boss.a0||e.x+e.w>boss.a1);
// Aruncă o bombă aprinsă în arc, ca să cadă pe jos în tx; stă în fund, cu fitilul obișnuit, ca s-o poți împinge în el.
function bossThrowAt(tx){
  const b=boss,hx=b.x+b.w/2,e=makeEnemy('bomb',0,0);
  e.x=hx-6;e.y=b.y-12;e.active=true;e.sit=true;e.lit=BOMB_SIT_FUSE;e.thrown=true;e.dir=b.dir;
  const g=0.4,vy=-4.5,dyF=12*TS-(e.y+e.h),disc=vy*vy+2*g*dyF,t=disc>0?(-vy+Math.sqrt(disc))/g:40;
  e.vy=vy;e.vx=clamp((tx-hx)/Math.max(12,t),-4,4);enemies.push(e);sfx.fuse();
}
function updateBoss(){
  const b=boss,p=player;
  b.t++;if(b.inv>0)b.inv--;if(b.lostT>0)b.lostT--;if(b.gate>0&&b.gate<60)b.gate++;
  // Furcile aruncate: zboară, te rănesc dacă te ating cu dinții, se înfig în sol, în gheață, sau în baloți și
  // dispar după vreo 2 secunde.
  for(const f of b.forks){
    if(f.stuckT>0){if(--f.stuckT<=0)f.gone=true;continue;}
    f.vy+=FORK_G;f.x+=f.vx;f.y+=f.vy;f.a=Math.atan2(f.vy,f.vx);
    if(!p.dead&&overlap(p,forkTip(f))){hurt(f.dir);f.gone=true;continue;}
    const tx=Math.floor(f.x/TS),ty=Math.floor(f.y/TS);
    if(f.y>=12*TS+2||solid(tileAt(tx,ty))){f.y=Math.min(f.y,12*TS+3);f.stuckT=120;dust(f.x,12*TS,3);sfx.bump();}
    else if(f.x<b.a0-2||f.x>b.a1+2){f.x=clamp(f.x,b.a0-2,b.a1+2);f.stuckT=120;sfx.bump();}
  }
  b.forks=b.forks.filter(f=>!f.gone);
  if(b.st==='gone')return;
  const pcx=p.x+p.w/2,bcx=b.x+b.w/2,dx=pcx-bcx,dy=(p.y+p.h)-(b.y+b.h);
  const ph=BOSS_HP-Math.max(1,b.hp),spd=[0.5,0.65,0.8][ph],cdk=[1,0.8,0.6][ph];
  b.ext=0;if(b.st!=='leap'&&b.st!=='dead')b.vx=0;   // pașii (vx) doar cât merge; săritura și căderea își țin viteza
  // Nu stă niciodată deasupra apei: dacă s-a deschis o gaură în gheață sub el, sare pe cel mai apropiat loc sigur.
  if(['walk','volley','tired','dazed','frozen','gthrow','leapWarn','strike','land','chargePrep','flee'].includes(b.st)&&b.y>=BOSS_Y-1&&bossWater(bcx)){
    b.raise=false;bossJump(bossSafeX(bcx),24,'land');}
  switch(b.st){
    case 'wait':b.dir=-1;if(!p.dead&&p.x>b.a0+TS){b.st='intro';b.t=0;b.lock=true;stopSong();}break;
    case 'intro':                                                    // cad baloții de fân în spatele tău, apoi răcnește
      b.logY=Math.min(12*TS-44,-60+b.t*13);
      if(b.t===16){G.shake=10;sfx.thud();}
      // Prima dată când îl vezi, îți spune ceva (după ce s-au oprit baloții și curcanul a pus piciorul jos).
      if(b.t===32&&!G.bossMet&&!p.dead){if(!p.onGround)b.t--;else{G.bossMet=true;MOS.boss=true;mosSave();openTalk(BOSS_HELLO,'boss');}}
      if(b.t===40){sfx.roar();G.shake=14;popup('!',bcx,b.y-14,'#ff4040');playSong('boss');}      if(b.t>=80){b.st='walk';b.t=0;}
      break;
    case 'walk':{
      // A rămas sus, pe o scândură (de exemplu după ce a fost înghețat acolo): sare jos, lângă tine.
      if(b.y<BOSS_Y-1){bossJump(bossSafeX(pcx-(Math.sign(dx)||1)*30),30,'land');break;}
      if(bossWatchBombs())break;                                     // fuge de bomba de lângă el
      if(b.cd>0)b.cd--;if(b.volleyT>0)b.volleyT--;if(b.leapT>0)b.leapT--;if(b.bombT>0)b.bombT--;if(b.chargeT>0)b.chargeT--;
      if(Math.abs(dx)>4)b.dir=Math.sign(dx);
      const low=p.y+p.h>=12*TS-16;                                  // ești pe sol sau pe gheață (nu pe scânduri)
      if(!b.cd&&!p.dead){
        if(b.hp===1&&!b.chargeT&&low&&Math.abs(dx)>70){b.st='chargePrep';b.t=0;sfx.alert();break;}
        if(!b.volleyT&&Math.abs(dx)>70){b.st='volley';b.t=0;b.vn=0;break;}
        if(!b.leapT){const side=Math.sign(dx)||b.dir;                 // aterizează lângă tine, de partea lui
          b.jx=bossSafeX(pcx-side*26)-b.w/2;b.st='leapWarn';b.t=0;sfx.alert();break;}
        if(!b.bombT&&enemies.filter(e=>e.type==='bomb'&&!e.dead&&!e.remove).length<3){b.st='gthrow';b.t=0;b.pn=0;break;}
      }
      // Merge spre tine, dar nu calcă în găurile din gheață (se oprește la marginea lor).
      const nx=b.x+(Math.abs(dx)>36?b.dir*spd:0);
      if(nx!==b.x&&!bossWater(nx+b.w/2+b.dir*(b.w/2-2))){b.vx=nx-b.x;b.x=nx;b.anim++;}
      break;}
    case 'volley':{                                                  // trei furci, una după alta, apoi obosește
      const wt=Math.round(20*cdk)+6,k=(b.t-1)%(wt+12);b.vk=k;b.vwt=wt; // wt cadre trage furca înapoi, apoi aruncă
      if(k===0){if(Math.abs(dx)>4)b.dir=Math.sign(dx);sfx.windup();}
      if(k===wt){bossThrowFork();b.vn++;}
      if(b.vn>=3&&k===wt+11){b.st='tired';b.t=0;}
      break;}
    case 'tired':                                                    // obosit 3 s: gâfâie aburi; acum îi poți sări în cap
      if(b.t%20===1)for(let i=0;i<4;i++)parts.push({x:bcx+b.dir*9,y:b.y+13,vx:b.dir*(0.3+Math.random()*0.4),vy:-0.2-Math.random()*0.3,g:-0.01,life:26,max:26,col:i%2?'#ffffff':'#dfeaf4',s:2});
      if(b.t>=BOSS_TIRED){b.st='walk';b.t=0;b.cd=30;b.volleyT=Math.round(260*cdk);}
      break;
    case 'gthrow':{                                                  // două bombe, la întâmplare pe jos
      if(bossWatchBombs())break;                                     // o bombă la picioare: lasă aruncatul și fuge
      const bt=Math.round(40*cdk)+10,k=b.t%bt;
      b.raise=b.pn<2&&k>=bt-18;
      if(b.pn<2&&k===bt-1){                                          // la întâmplare, dar niciodată lângă el
        let x=bcx;for(let i=0;i<16&&Math.abs(x-bcx)<80;i++)x=bossSafeX(b.a0+20+Math.random()*(b.a1-b.a0-40));
        if(Math.abs(x-bcx)<80)x=bossSafeX(bcx<(b.a0+b.a1)/2?b.a1-24:b.a0+24);   // dacă n-a găsit, în capătul celălalt
        bossThrowAt(x);b.pn++;}
      if(b.pn>=2&&b.t>=bt*2+16){b.st='walk';b.t=0;b.raise=false;b.cd=Math.round(40*cdk);b.bombT=Math.round(rnd(280,360)*cdk);}
      break;}
    case 'leapWarn':                                                 // ghemuit; pe sol clipește semnul unde va ateriza
      if(b.t>=40){b.dir=Math.sign(b.jx-b.x)||b.dir;bossJump(b.jx+b.w/2,36,'strike');sfx.dive();}
      break;
    case 'leap':
      b.vy+=0.4;b.y+=b.vy;b.x+=b.vx;
      if(b.vy>0&&b.y>=b.jy){b.x=b.jx;b.y=b.jy;b.vy=0;b.vx=0;G.shake=8;sfx.thud();
        for(let i=0;i<10;i++)parts.push({x:b.x+b.w/2+(Math.random()-0.5)*24,y:12*TS-1,vx:(Math.random()-0.5)*2.4,vy:-0.6-Math.random()*1.4,g:0.12,life:24,max:24,col:i%2?'#ffffff':'#dbe7f1',s:2});
        if(b.after==='strike'){b.st='strike';b.t=0;if(Math.abs(dx)>4)b.dir=Math.sign(dx);}
        else if(b.after==='perch'){b.st='perch';b.t=0;}else{b.st='land';b.t=0;}}
      break;
    // Fuge de bombă (merge repede în partea cealaltă), până ajunge destul de departe de ea.
    case 'flee':{
      b.dir=b.fleeDir;const nx=b.x+b.fleeDir*1.8,lead=nx+b.w/2+b.fleeDir*(b.w/2-2);
      if(bossWater(lead)||nx<=b.a0||nx+b.w>=b.a1){const e=bossBombNear(72);if(e)bossJump(bossSafeX((e.x+e.w/2)-b.fleeDir*80),32,'land');else{b.st='walk';b.t=0;}break;}
      b.vx=nx-b.x;b.x=nx;b.anim+=2;
      if(!bossBombNear(72)||b.t>70){b.st='walk';b.t=0;b.cd=20;}
      break;}
    // Pe scândură, ferit de bombă: se uită la tine și așteaptă să explodeze (sau să nu mai fie bombe sub el), apoi sare
    // jos lângă tine, într-un loc fără bombe.
    case 'perch':{
      if(Math.abs(dx)>4)b.dir=Math.sign(dx);
      const below=enemies.some(e=>e.type==='bomb'&&!e.dead&&!e.remove&&!e.sink&&e.lit>0&&Math.abs(e.x+e.w/2-bcx)<90);
      if((b.t>30&&!below)||b.t>200){
        let x=bossSafeX(pcx-(Math.sign(dx)||1)*30);
        for(let i=0;i<8&&enemies.some(e=>e.type==='bomb'&&!e.dead&&!e.remove&&e.lit>0&&Math.abs(e.x+e.w/2-x)<64);i++)x=bossSafeX(b.a0+20+Math.random()*(b.a1-b.a0-40));
        bossJump(x,30,'land');}
      break;}
    case 'strike':                                                   // trage furca înapoi, apoi împunge
      if(b.t>14&&b.t<=26){b.ext=Math.min(16,(b.t-14)*4);if(b.t===15)sfx.stab();if(!p.dead&&overlap(p,bossStrikeBox()))hurt(b.dir);}
      if(b.t>=38){b.st='walk';b.t=0;b.cd=Math.round(30*cdk);b.leapT=Math.round(rnd(240,320)*cdk);}
      break;
    case 'land':if(bossWatchBombs())break;if(b.t>=20){b.st='walk';b.t=0;}break;
    // Fuga ca un taur (doar la ultima inimă): bate din picior, apoi dă buzna cu furca în față până se izbește de
    // margine (sau până la o gaură în gheață, unde se oprește brusc) și rămâne amețit.
    case 'chargePrep':if(b.t%8===0)dust(bcx-b.dir*4,12*TS,3);if(b.t>=32){b.st='charge';b.t=0;sfx.roar();}break;
    case 'charge':{
      const nx=b.x+b.dir*3.4,lead=nx+b.w/2+b.dir*(b.w/2-2);if(G.t%3===0)dust(bcx-b.dir*8,12*TS,2);
      if(nx<=b.a0||nx+b.w>=b.a1||bossWater(lead)){b.x=clamp(b.x,b.a0,b.a1-b.w);b.st='dazed';b.t=0;b.crash=true;G.shake=14;sfx.thud();
        for(let i=0;i<18;i++)parts.push({x:(b.dir>0?b.a1:b.a0)+(Math.random()-0.5)*50,y:16+Math.random()*90,vx:(Math.random()-0.5)*0.4,vy:0.6+Math.random()*0.8,g:0.03,life:70,max:70,col:'#ffffff',s:Math.random()<0.4?2:1});}
      else b.x=nx;
      break;}
    case 'dazed':if(b.t>=BOSS_TIRED){b.st='walk';b.t=0;b.cd=30;b.chargeT=200;b.crash=false;}break;   // amețit 3 s
    case 'frozen':                                                   // cub de gheață 5 s (nu poate fi împins)
      {const fy=bossFloorY()-b.h;if(b.y<fy){b.vy=Math.min(b.vy+0.4,7);b.y=Math.min(fy,b.y+b.vy);}}   // înghețat în aer: cade pe ce are dedesubt
      if(b.t>=BOSS_VULN){b.st='walk';b.t=0;b.cd=30;iceShards(bcx,b.y+16,10);sfx.crack();}
      break;
    case 'hurt':
      if(b.t<=16&&!bossWater(bcx+b.kdir*(b.w/2+2)))b.x+=b.kdir*1.5;
      {const fy=bossFloorY()-b.h;if(b.y<fy){b.vy=Math.min(b.vy+0.4,7);b.y=Math.min(fy,b.y+b.vy);}}   // lovit în aer: cade pe ce are dedesubt
      if(b.t>=60){bossSummon();b.st='walk';b.t=0;b.cd=40;b.volleyT=90;b.leapT=Math.round(180*cdk);b.bombT=Math.round(140*cdk);b.chargeT=60;}
      break;
    case 'dead':                                                     // aruncat de pe ecran; apoi se prăbușesc stivele de fân
      b.vy+=0.35;b.y+=b.vy;b.x+=b.vx;
      if(b.t===70){b.gate=1;b.lock=false;sfx.brk();sfx.thud();G.shake=10;goldFromHay();
        // Baloții se desfac: paie care zboară și cad, plus un nor de praf de fân care se ridică încet și se risipește.
        const hay=['#f6d872','#dcae40','#b08222'];
        for(const [x0,d] of [[b.a1,1],[b.a0-TS,-1]]){
          for(let i=0;i<40;i++)parts.push({x:x0+Math.random()*TS,y:12*TS-Math.random()*44,vx:(Math.random()-0.35)*3.2*d,vy:-0.8-Math.random()*3,g:0.16,life:45+Math.random()*25|0,max:70,col:hay[i%3],s:i%4?1:2});
          for(let i=0;i<22;i++)parts.push({x:x0+8+(Math.random()-0.5)*30,y:12*TS-4-Math.random()*44,vx:(Math.random()-0.5)*0.7,vy:-0.15-Math.random()*0.35,g:-0.004,life:50+Math.random()*30|0,max:80,col:i%2?'#e8d8a8':'#d4c088',s:3+(i%3)});}}
      if(b.t===110)playSong(LEVELS[G.level].song||'main');
      if(b.t>110&&b.y>H+40)b.st='gone';
      break;
  }
  if(b.st!=='dead')b.x=clamp(b.x,b.a0,b.a1-b.w);
  if(!bossFighting())return;
  // Atingerea: îi sari în cap (obosit, amețit sau cub de gheață = lovitură; altfel pălăria te aruncă înapoi) sau te
  // rănește (nu și când e obosit, amețit, înghețat sau tocmai lovit). Cubul de gheață e un bloc solid, cât e desenat:
  // nu treci prin el, te oprești lângă el (trebuie să sari peste el — sau pe el, ca să-l lovești).
  const cube=b.st==='frozen',box=cube?{x:b.x-4,y:b.y-2,w:b.w+8,h:b.h+2}:b;
  if(!p.dead&&overlap(p,box)){
    if(p.vy>0&&(p.y+p.h-box.y)<=Math.max(8,p.vy+3)){p.y=box.y-p.h;
      if(bossVulnerable()){p.vy=inJump()?-6.6:-4.6;bossHit(Math.sign(dx)||1);sfx.stomp();}
      else{p.vy=-5.2;p.vx=(Math.sign(dx)||1)*2.5;sfx.bump();}}
    else if(cube){const d=Math.sign(dx)||-p.face,pen=d>0?(box.x+box.w)-p.x:(p.x+p.w)-box.x;   // scos din cub, ca dintr-un zid
      if(pen>0){const vx=p.vx;p.vx=d*pen;moveX(p);p.vx=vx;}}
    else if(!bossVulnerable()&&b.st!=='hurt')hurt(Math.sign(dx)||1);
  }
  // (Bombele sunt cele obișnuite: alunecă pe lângă el ca pe lângă orice mob și explodează când li se termină fitilul;
  // explozia îl rănește dacă e aproape.)
}
// În timpul luptei, nimeni nu iese din poiană: curcanul se oprește la margini, bombele împinse ricoșează, mobii se
// întorc, iar un dușman înghețat împins în margine se sparge.
function bossArenaBounds(){
  const b=boss,p=player;if(!b||!b.lock)return;
  if(!p.dead)p.x=clamp(p.x,b.a0,b.a1-p.w);
  for(const e of enemies){if(e.dead||e.remove||(e.enter&&!e.frozen))continue;   // mobii chemați încă intră (bossSummon)
    // Cine e în afara poienii (de exemplu fermierii rămași în urmă) rămâne afară; cine e înăuntru rămâne înăuntru.
    const c=e.x+e.w/2;
    if(c<b.a0){e.x=Math.min(e.x,b.a0-e.w);continue;}
    if(c>b.a1){e.x=Math.max(e.x,b.a1);continue;}
    const out=e.x<b.a0?1:e.x+e.w>b.a1?-1:0;if(!out)continue;
    e.x=out>0?b.a0:b.a1-e.w;
    if(e.frozen&&e.slideDir)shatter(e,200);
    else if(e.slideDir){e.slideDir=out;e.dir=out;sfx.bump();}
    else e.dir=out;}
}
