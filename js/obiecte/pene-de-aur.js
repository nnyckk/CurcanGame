'use strict';
// ================= PENELE DE AUR =================
// Pana de aur (de colecționat, vezi PENELE DE AUR): o pană mare, aurie, cu tija deschisă la mijloc. 7 × 14.
const GOLD_PANA=mkSprite([
"...k...",
"..kYk..",
".kLYyk.",
".kLYyk.",
"kLYsYyk",
"kLYsYyk",
"kLYsYyk",
"kLYsYyk",
".kYsYk.",
".kYsyk.",
"..ksk..",
"...s...",
"...s...",
"...k..."],{k:'#7a4a08',L:'#fff3b0',Y:'#ffd23f',y:'#e0a020',s:'#fff8e0'},false);
// Penița mică din HUD și de pe cartonașe (5 × 8): plină (aurie) sau doar conturul locașului gol.
const GOLD_MINI=["..#..",".###.","#####","#####","#####",".###.","..#..","..#.."];
// Câte 3 pene de aur în fiecare nivel normal (nu și în nivelul bonus), puse cu m.pana în locuri greu de ajuns: una la
// vedere, dar greu de luat; una care cere putere (într-o cărămidă: trebuie să fii mare); una ascunsă de tot (într-un
// bloc invizibil, care sclipește din când în când; la boss, în stiva de fân din dreapta poienii). Cea din cărămidă și
// cea din blocul invizibil sar afară și sunt ale tale pe loc.
// O pană contează doar când termini nivelul. Dacă pierzi o viață, pierzi penele luate după ultimul punct de salvare
// atins (cele de dinainte rămân la tine: G.goldHeld; cele de după: G.goldNow); la JOC TERMINAT le pierzi pe toate
// cele nesalvate. Penele salvate rămân în browser (după id-ul nivelului, câte un bit pentru fiecare pană); când
// rejoci nivelul, apar transparente (le poți lua iar, dar nu mai contează). Cu toate penele din joc se deblochează
// CURCANUL DE AUR (doar aspect; se pornește / oprește din SETĂRI). În modul de test se salvează separat.
const GOLD_KEY=TEST?'curcan_pene_test':'curcan_pene',GOLD_PTS=1000;
let golds=[],GOLD_SAVE={},GOLD_COUNTS=null,GOLD_OK=null;
try{GOLD_SAVE=JSON.parse(localStorage.getItem(GOLD_KEY)||'{}')||{};}catch(e){}
function goldStore(){GOLD_OK=null;try{localStorage.setItem(GOLD_KEY,JSON.stringify(GOLD_SAVE));}catch(e){}}
const goldSaved=(id,i)=>!!((GOLD_SAVE[id]||0)&(1<<i));
// Câte pene are fiecare nivel (calculat o dată, la prima nevoie), câte ai găsit și dacă le ai pe toate.
const goldCounts=()=>GOLD_COUNTS||(GOLD_COUNTS=LEVELS.map(d=>d.arena?0:d.build().golds.length));
const goldTotal=()=>goldCounts().reduce((a,b)=>a+b,0);
function goldFoundIn(i){const n=goldCounts()[i]||0;let k=0;for(let j=0;j<n;j++)if(goldSaved(LEVELS[i].id,j))k++;return k;}
const goldFound=()=>LEVELS.reduce((s,d,i)=>s+goldFoundIn(i),0);
const goldOK=()=>GOLD_OK===null?(GOLD_OK=goldTotal()>0&&goldFound()>=goldTotal()):GOLD_OK;
// La pornirea nivelului: penele lui. Cele ținute de dinainte de punctul de salvare (după o viață pierdută) sunt deja
// luate; cărămida lor rămâne o cărămidă obișnuită, iar blocul lor invizibil dispare.
function makeGolds(m){
  const id=LEVELS[G.level].id;
  if(G.goldLv!==G.level){G.goldLv=G.level;G.goldHeld=[];}
  G.goldNow=[];
  return m.golds.map((d,i)=>{
    const held=G.goldHeld.includes(i);
    if(held&&d.kind==='brick')grid[d.y][d.x]='B';else if(held&&d.kind==='hidden')grid[d.y][d.x]='.';
    return {i,kind:d.kind,tx:d.x,ty:d.y,x:d.x*TS+8,y:d.y*TS+8,taken:held,ghost:goldSaved(id,i),out:d.kind==='open',vy:0,restY:0,flash:0};
  });
}
// Ai luat pana i: puncte, sunet, sclipiri și „PANĂ DE AUR!” (ține până termini nivelul sau pierzi viața).
function goldTake(g){
  g.taken=true;g.flash=50;if(!G.goldNow.includes(g.i))G.goldNow.push(g.i);
  sfx.gold();addScore(GOLD_PTS,g.x,g.y-12);popup('PANĂ DE AUR!',g.x,g.y-24,'#ffd23f');
  for(let i=0;i<14;i++){const a=i/14*TAU,s=1+Math.random()*1.6;
    parts.push({x:g.x,y:g.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:0.02,life:26,max:26,col:i%3?'#ffd23f':'#ffffff',s:i%4?1:2});}
}
// Pana din cărămida spartă / din blocul invizibil de la (tx, ty): sare afară și e a ta pe loc.
function goldFromTile(tx,ty){
  const g=golds.find(g=>g.tx===tx&&g.ty===ty&&!g.taken);if(!g)return;
  g.out=true;parts.push({type:'gold',x:g.x,y:g.y-6,vx:0,vy:-3.6,g:0.16,life:40,max:40});goldTake(g);
}
// S-a prăbușit stiva de fân din dreapta poienii boss-ului: pana din ea sare afară și cade pe jos, lângă ruine.
function goldFromHay(){
  for(const g of golds)if(g.kind==='boss'&&!g.out&&!g.taken){g.out=true;g.vy=-4.6;g.restY=12*TS-14;sparkle(g.x,g.y);}
}
function updateGolds(){
  for(const g of golds){
    if(g.flash>0)g.flash--;
    if(g.taken||!g.out)continue;
    if(g.restY){g.vy+=0.2;g.y+=g.vy;if(g.vy>0&&g.y>=g.restY){g.y=g.restY;g.vy=0;g.restY=0;}}
    if(!player.dead&&overlap(player,{x:g.x-5,y:g.y-7,w:10,h:14}))goldTake(g);
  }
}
// La atingerea unui punct de salvare: penele luate până acum rămân la tine chiar dacă pierzi o viață.
function goldCheckpoint(){G.goldHeld.push(...G.goldNow);G.goldNow=[];}
// Ai terminat nivelul: penele luate se salvează. G.goldRun = cele luate de data asta, G.goldNew = cele găsite prima
// dată; G.goldUnlockNow = tocmai le-ai strâns pe toate (se pornește singur curcanul de aur).
function goldSaveLevel(){
  const def=LEVELS[G.level];G.goldRun=[];G.goldNew=[];G.goldUnlockNow=false;
  if(!def||!golds.length)return;
  const before=goldOK();let mask=GOLD_SAVE[def.id]||0;
  for(const i of new Set([...G.goldHeld,...G.goldNow])){G.goldRun.push(i);if(!(mask&(1<<i)))G.goldNew.push(i);mask|=1<<i;}
  G.goldHeld=[];G.goldNow=[];
  if(!G.goldRun.length)return;
  GOLD_SAVE[def.id]=mask;goldStore();
  if(!before&&goldOK()){G.goldUnlockNow=true;G.goldSkin=true;saveSettings();}
}
// Penele din nivel: plutesc și strălucesc (cele salvate deja sunt transparente). Cele încă ascunse (în cărămidă, în
// blocul invizibil, în fân) sclipesc din când în când acolo unde sunt, ca indiciu.
function drawGolds(cx){
  for(const g of golds){
    if(g.taken)continue;
    const x=Math.round(g.x-cx);if(x<-20||x>W+20)continue;
    if(!g.out){const t=(G.t+g.i*67)%200;if(t>=16)continue;
      const r=t<4||t>=12?1:2,hx=x+((g.i*5)%7)-3,hy=Math.round(g.y)-4+((g.i*3)%5);
      ctx.fillStyle='#fff3b0';ctx.fillRect(hx-r,hy,r*2+1,1);ctx.fillRect(hx,hy-r,1,r*2+1);ctx.fillStyle='#ffffff';ctx.fillRect(hx,hy,1,1);continue;}
    const y=Math.round(g.y+(g.restY?0:Math.sin(G.t*0.07+g.i)*1.5));
    if(g.ghost){ctx.globalAlpha=0.4;ctx.drawImage(GOLD_PANA,x-3,y-7);ctx.globalAlpha=1;continue;}
    if(theme.night)glow(x,y,16+Math.sin(G.t*0.12)*2,'255,200,80',0.6);
    else{ctx.globalAlpha=0.3+0.12*Math.sin(G.t*0.15);pcirc(ctx,x,y,9+Math.round(Math.sin(G.t*0.15)),'#ffe060');ctx.globalAlpha=1;}
    ctx.drawImage(GOLD_PANA,x-3,y-7);
    // O steluță care apare din când în când pe lângă ea.
    const t=(G.t+g.i*29)%60;if(t<10){const sx=x+(g.i%2?5:-5),sy=y-6+(g.i*4)%8;ctx.fillStyle='#ffffff';ctx.fillRect(sx-1,sy,3,1);ctx.fillRect(sx,sy-1,1,3);}
  }
}
// Penița mică (HUD, cartonașul de la final): st = 'got' (aurie), 'ghost' (salvată de altă dată, transparentă) sau
// 'empty' (doar locașul).
function drawGoldMini(x,y,st,flash){
  if(st==='empty'){icon(GOLD_MINI,x,y,'#4a4466');return;}
  icon(GOLD_MINI,x+1,y+1,'#5a3a08');
  if(st==='ghost')ctx.globalAlpha=0.45;
  icon(GOLD_MINI,x,y,flash&&(flash>>2)%2?'#ffffff':'#ffd23f');ctx.fillStyle='#fff3b0';ctx.fillRect(x+1,y+2,1,3);
  ctx.globalAlpha=1;
}
