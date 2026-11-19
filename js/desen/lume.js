'use strict';
// ===== DESEN: lumea nivelului =====
function drawWorld(){
  const sh=G.shake>0?Math.round((Math.random()-0.5)*4):0;
  const cx=clamp(Math.round(cam.x)+sh,0,cols*TS-W);   // zguduirea nu arată marginea hărții
  // În cafenea, camera dinăuntru ține loc de cer și fundal
  const lift=inCafe()?0:Math.round(G.lift||0),vy=inCafe()?CAFE_VY:-lift;ctx.save();ctx.translate(0,vy);
  if(inCafe())drawCafeRoom(cx);else if(inUnder())drawUnderBG(cx);else drawBG();
  // Noaptea: lumea de joc se desenează pe un canvas separat
  const night=theme.night,main=ctx;
  if(night){ctx=shadeCtx;ctx.clearRect(0,0,W,H);}
  const drawItem=it=>{
    const gx=Math.round(it.x-cx),gy=Math.round(it.y),ice=it.type==='ice',berry=it.type==='berry'||ice;
    // Aură care pulsează: aurie pentru grăunte
    if(night&&!(it.rise>0))glow(gx+5,gy+5,15+Math.sin(G.t*0.15)*1.5,ice?'140,210,255':berry?'255,80,60':'255,210,90',0.6);
    else{ctx.globalAlpha=(berry?0.34:0.28)+0.12*Math.sin(G.t*(berry?0.3:0.2));pcirc(ctx,gx+5,gy+5,9+Math.round(Math.sin(G.t*0.15)),ice?'#7fd0ff':berry?'#ff4a3a':'#ffe060');ctx.globalAlpha=1;}
    ctx.drawImage(ice?ICEBERRY:berry?BERRY:GRAIN,gx,gy);
    const a=G.t*(berry?-0.16:0.12);
    for(let k=0;k<3;k++){const ang=a+k*TAU/3;ctx.fillStyle=berry&&k%2?(ice?'#bfe8ff':'#ffd040'):'#fff';ctx.fillRect(Math.round(gx+5+Math.cos(ang)*10),Math.round(gy+5+Math.sin(ang)*10),1,1);}};
  // Noaptea bănuții strălucesc
  const drawCoins=()=>coins.forEach((c,i)=>{if(c.taken||c.x-cx<=-10||c.x-cx>=W+10)return;const y=c.y+Math.round(Math.sin(G.t*0.08+i)*1);
    if(night)glow(Math.round(c.x-cx),y,13+Math.sin(G.t*0.1+i)*1.5,'255,190,70',0.6);
    drawCoin(c.x-cx,y,i*0.5);});
  if(goal){if(goal.type==='sign')drawSign(cx);else drawRestaurant(cx);}
  if(cafe)drawCafeHouse(cx);
  for(const cp of cps)drawCP(cp,cx);
  // Noaptea, bănuții și power-up-urile luminează
  for(const it of items)if(!night||it.rise>0)drawItem(it);
  drawTiles(cx);
  if(inUnder())drawCaveLife(cx);else drawHoleCracks(cx);   // stalactite, lilieci, pânze / crăpăturile de deasupra peșterii
  drawPlats(cx);
  if(inCafe())drawCafeFrame(cx);   // întunericul din jurul cafenelei
  if(cafe)drawCafeNPC(cx);
  // Mobii chemați de boss care încă intră în poiană trec
  const entering=e=>e.enter&&!e.dead;
  for(const e of enemies)if(entering(e))drawEnemy(e,cx);
  drawArena(cx);
  if(theme.snow)drawLakeBase(cx);
  if(!night){drawCoins();drawGolds(cx);}
  // Noaptea, bomba aprinsă luminează: nu primește umbra
  const litBomb=e=>night&&e.type==='bomb'&&e.lit>0&&!e.sink;
  for(const e of enemies)if((e.active||(e.x-cx<W+24))&&!litBomb(e)&&!entering(e))drawEnemy(e,cx);
  drawBoss(cx);
  drawPlayer(cx);
  // Decorul de pe sol stă în fața personajelor
  if(theme.farm)drawGroundDecor(cx,theme,tx=>grid[12][tx]==='G'&&grid[11][tx]==='.'&&tileAt(tx-1,12)!=='.'&&tileAt(tx+1,12)!=='.');
  else if(theme.snow&&!inCafe())drawSnowDecor(cx,tx=>grid[12]&&grid[12][tx]==='G'&&grid[11][tx]==='.'&&!'.I'.includes(tileAt(tx-1,12))&&!'.I'.includes(tileAt(tx+1,12)));
  if(!inCafe())drawWater(cx);   // în cafenea nu e apă
  if(lakeLife)drawLakeLife(cx);
  if(night){
    // Umbra de noapte
    ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(12,18,56,0.4)';ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='source-over';
    ctx=main;ctx.drawImage(shadeCv,0,0);
    // Curcanul de aur luminează noaptea
    if(player&&!player.dead&&goldSkinOn()){ctx.globalAlpha=0.62+0.18*Math.sin(G.t*0.035);drawPlayer(cx);ctx.globalAlpha=1;}
    drawNightLights(cx);
    // Strălucire portocalie care pulsează odată cu clipirea
    for(const e of enemies)if(e.active&&litBomb(e)){const fl=(e.lit<36)?(e.lit>>1)%2:(e.lit>>3)%2;
      glow(Math.round(e.x+6-cx),Math.round(e.y+(e.sit?8:6)),e.lit<36?22:17,'255,120,40',fl?0.75:0.45);drawEnemy(e,cx);}
    for(const it of items)if(!(it.rise>0))drawItem(it);
    drawCoins();drawGolds(cx);
  }
  for(const f of feathers){
    // Ușoară fluturare în zbor
    const img=(f.ice?FEATHER_ICE:FEATHER)[(f.t>>2)%2?'B':'A'][f.dir>0?'r':'l'];
    ctx.globalAlpha=clamp((FEATHER_RANGE-f.dist)/28,0.35,1);
    ctx.drawImage(img,Math.round(f.x-cx),Math.round(f.y-2+Math.sin(f.t*0.6)));
    ctx.globalAlpha=1;
  }
  for(const b of booms)ctx.drawImage(BOOM[Math.min(5,b.t>>2)],Math.round(b.x-cx-42),Math.round(b.y-42));
  for(const p of parts){
    if(p.type==='coin'){drawCoin(p.x-cx,p.y,G.t*0.3);continue;}
    if(p.type==='gold'){ctx.globalAlpha=Math.min(1,p.life/(p.max*0.4));ctx.drawImage(GOLD_PANA,Math.round(p.x-cx)-3,Math.round(p.y)-7);ctx.globalAlpha=1;continue;}
    if(p.edge){ctx.fillStyle=p.edge;ctx.fillRect(Math.round(p.x-cx)-1,Math.round(p.y)-1,p.s+2,p.s+2);}
    ctx.globalAlpha=p.max?Math.min(1,p.life/(p.max*0.5)):1;ctx.fillStyle=p.col;ctx.fillRect(Math.round(p.x-cx),Math.round(p.y),p.s,p.s);ctx.globalAlpha=1;
  }
  if(theme.snow&&!inCafe())drawSnowfall();
  for(const p of popups)txt(p.s,p.x-cx,p.y,p.c,1,'c','#000');
  if(cafe)drawCafeHints(cx);
  if(TEST&&G.showHB)drawHitboxes(cx);
  ctx.restore();
  // Lumea urcată
  for(let y=H-lift;y<H;y+=TS){const h=Math.min(TS,H-y);ctx.drawImage(cv,0,H-lift-TS,W,h,0,y,W,h);}
  drawTalk();   // caseta de dialog, fixă pe ecran
  // Intrarea / ieșirea din cafenea
  const fade=G.doorT>0?G.doorT:G.subT>0?G.subT:0;   // ușa cafenelei sau gaura peșterii
  if(fade){ctx.fillStyle=`rgba(13,11,20,${1-Math.abs(fade-DOOR_T/2)/(DOOR_T/2)})`;ctx.fillRect(0,0,W,H);}
}
