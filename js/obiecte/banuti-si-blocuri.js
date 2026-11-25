'use strict';
// ===== BĂNUȚI ȘI BLOCURI =====
// --- Coin with M
const COIN=mkSprite([
"...oooooo...",
".ooyyyyyyoo.",
".oyYYyyyyyo.",
"oyYmyyyymyyo",
"oyYmmyymmyyo",
"oyymymmymyyo",
"oyymyyyymyyo",
"oyymyyyymyyo",
"oyymyyyymyyo",
".oyyyyyyyyo.",
".ooyyyyyyoo.",
"...oooooo...",
],{o:'#a8641a',y:'#f5c030',Y:'#fff0a0',m:'#6a2a0a'},false);
function sparkle(x,y){for(let i=0;i<6;i++){const a=i/6*TAU;parts.push({x,y,vx:Math.cos(a)*1.4,vy:Math.sin(a)*1.4,g:0,life:16,max:16,col:i%2?'#fff':'#ffd23f',s:2});}}
function addCoin(x,y){
  G.coins++;G.lvlCoins=(G.lvlCoins||0)+1;addScore(100);sfx.coin();   // lvlCoins: bănuții din nivelul ăsta
  if(G.coins>=50){G.coins-=50;G.lives++;sfx.oneup();popup('1 VIAȚĂ!',x,y-10,'#7fff7f');}
}
// top = lovit de sus (lovitura în pământ): ce iese din bloc iese pe dedesubt, dacă e loc
function hitBlock(tx,ty,top){
  const c=tileAt(tx,ty),dn=!!top&&!solid(tileAt(tx,ty+1)),iy=dn?ty*TS+5:ty*TS;
  noiseAt(tx*TS+8,ty*TS+8,4*TS);   // bufnitura trezește
  if(c==='M'||c==='H'||c==='A'||c==='R'){
    grid[ty][tx]='U';bumps.push({tx,ty,t:0});
    if(c==='M'){parts.push(dn?{type:'coin',x:tx*TS+8,y:(ty+1)*TS+4,vx:0,vy:0.8,g:0.1,life:14,max:14}:{type:'coin',x:tx*TS+8,y:ty*TS-6,vx:0,vy:-3.6,g:0.35,life:16,max:16});addCoin(tx*TS+8,dn?(ty+1)*TS+8:ty*TS);}
    // Blocul de gheață: mereu afina înghețată
    else if(c==='A'){items.push({type:'ice',x:tx*TS+3,y:iy,w:10,h:11,vx:0,vy:0,rise:11,down:dn,dir:1});sfx.sprout();}
    // Blocul de foc: mereu boaba de foc
    else if(c==='R'){items.push({type:'berry',x:tx*TS+3,y:iy,w:10,h:11,vx:0,vy:0,rise:11,down:dn,dir:1});sfx.sprout();}
    // Curcan mic → grăunte auriu
    else{items.push({type:player.big?(theme.snow?'ice':'berry'):'grain',x:tx*TS+3,y:iy,w:10,h:11,vx:0,vy:0,rise:11,down:dn,dir:player.x<tx*TS?1:-1});sfx.sprout();}
  }else if(c==='B'||c==='P'){if(player.big)breakBrick(tx,ty);else{bumps.push({tx,ty,t:0});sfx.bump();}}
  else if(c==='V'){grid[ty][tx]='U';bumps.push({tx,ty,t:0});sfx.bump();goldFromTile(tx,ty);}   // blocul invizibil apare
  else if(c==='S')slotHit();   // blocul-slot din cafenea
  else if(c==='E'){sfx.bump();cafeBonk();}   // blocul-slot gol
  else if(c==='N')noteHit(tx,ty);   // blocurile lui Moș
  else sfx.bump();
  if(!'MHARBPVS'.includes(c))return;   // doar blocurile pline lovesc ce e deasupra; pământul și blocul gol nu
  for(const e of enemies){if(e.dead||e.remove||!e.active)continue;
    if(!moleSafe(e)&&overlap(e,{x:tx*TS,y:ty*TS-4,w:TS,h:5})){if(e.frozen)shatter(e,200);else if(e.type==='man')killMan(e,2,200);else lightBomb(e);}}
}
// Ce rămâne în spate după cărămidă: tunelul sau dealul de dedesubt, dacă e înconjurată (nu cer în lateral)
function brickBack(tx,ty){
  const b=tileAt(tx,ty+1),l=tileAt(tx-1,ty),r=tileAt(tx+1,ty);
  if('YZW'.includes(b)&&l!=='.'&&r!=='.')return b;
  return 'YZW'.includes(l)&&l===r?l:'.';   // pe podea, cu fundal în ambele părți
}
function breakBrick(tx,ty){
  const gold=grid[ty][tx]==='P';
  grid[ty][tx]=brickBack(tx,ty);SHADE.grid=null;sfx.brk();addScore(50);if(gold)goldFromTile(tx,ty);
  [[-1,-4],[1,-4],[-1,-2.5],[1,-2.5]].forEach(([vx,vy],i)=>parts.push({x:tx*TS+4+(i%2)*8,y:ty*TS+4+(i>>1)*8,vx:vx*1.3,vy,g:0.3,life:50,max:50,col:'#c98a4b',s:4,edge:'#6a3a1a'}));
}
function drawCoin(x,y,phase){const w=Math.max(2,Math.round(12*Math.abs(Math.cos(G.t*0.07+phase))));ctx.drawImage(COIN,Math.round(x-w/2),Math.round(y-6),w,12);}
