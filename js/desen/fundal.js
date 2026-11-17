'use strict';
// ================= DESEN: fundalul cu paralaxă și tile-urile =================
function par(img,f,y=0,extra=0){const w=img.width;let ox=-((cam.x*f+extra)%w);if(ox>0)ox-=w;ox=Math.floor(ox);ctx.drawImage(img,ox,y);ctx.drawImage(img,ox+w,y);}
function drawBG(){ctx.drawImage(bg.sky,0,0);if(bg.clouds)par(bg.clouds,0.1,0,G.t*0.08);
  if(bg.dyn&&!bg.night)drawBirds();par(bg.far,0.2);if(bg.dyn)drawFarmLife();par(bg.mid,0.45);if(bg.near)par(bg.near,0.7);}
const BUMPY=[2,4,5,5,4,3,2,1];
function drawTiles(cx){
  const x0=Math.max(0,Math.floor(cx/TS)),x1=Math.min(cols-1,Math.floor((cx+W)/TS));
  const fi=[0,1,2,1][(G.t>>3)%4],mf=tiles.M[fi];
  for(let ty=0;ty<ROWS;ty++){const row=grid[ty];for(let tx=x0;tx<=x1;tx++){const c=row[tx];if(c==='.')continue;
    // Placa de gheață se desenează în drawWater, peste apă și peste personaje (ca să cazi „pe sub” ea).
    // Aici punem doar țărușii cu steguleț roșu de pe marginea copcilor (ca să se vadă de departe că acolo e apă).
    if(c==='I'){
      if(isCopca(tx-1))drawStake(tx*TS+3-cx);
      if(isCopca(tx+1))drawStake(tx*TS+11-cx);
      continue;}
    // Blocul-slot (2 × 2 tile-uri) se desenează o singură dată, din colțul lui din stânga sus.
    if(c==='S'||c==='E'){if(tileAt(tx-1,ty)!==c&&tileAt(tx,ty-1)!==c)drawSlotBlock(tx*TS-cx,ty*TS,c==='E');continue;}
    let img=(c==='M'||c==='H')?mf:c==='A'?tiles.A[fi]:c==='P'?tiles.B:tiles[c];   // V (invizibil) nu are desen
    if(c==='G'&&tiles.Gv)img=pickVar(tiles.Gv,tx,ty);else if(c==='D'&&tiles.Dv)img=pickVar(tiles.Dv,tx,ty);
    if(!img)continue;let oy=0;for(const b of bumps)if(b.tx===tx&&b.ty===ty)oy=-BUMPY[b.t];
    ctx.drawImage(img,tx*TS-cx,ty*TS+oy);
    // Iarna: puțină zăpadă pe blocuri, platforme și trepte (doar pe cele cu cerul liber deasupra).
    if(theme.snow&&SNOW_CAPPED.includes(c)){const up=tileAt(tx,ty-1);if(!solid(up)&&up!=='=')ctx.drawImage(tiles.cap,tx*TS-cx,ty*TS+oy);}}}
}
