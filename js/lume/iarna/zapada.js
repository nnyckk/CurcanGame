'use strict';
// ===== IARNA: zăpada de pe blocuri, ninsoarea =====
const SNOW_CAPPED='BPMHAUX=';
// Copcă = apă deschisă dintr-un lac, pusă din nivel
function isCopca(tx){
  if(tileAt(tx,12)!=='.'||iceHole[tx]>0)return false;
  let l=tx,r=tx;while(tileAt(l,12)==='.')l--;while(tileAt(r,12)==='.')r++;
  return tileAt(l,12)==='I'||tileAt(r,12)==='I';
}
// Țăruș de avertizare înfipt în gheață
function drawStake(x){
  const y=12*TS,wave=(G.t>>3)%2;
  ctx.fillStyle='#4a3020';ctx.fillRect(x,y-13,2,13);ctx.fillStyle='#7a5636';ctx.fillRect(x,y-13,1,13);
  ctx.fillStyle='#d8282f';ctx.fillRect(x+2,y-13,4,3);ctx.fillRect(x+6,y-12+wave,1,2);
  ctx.fillStyle='#ff6a5a';ctx.fillRect(x+2,y-13,4,1);
}
// Fulguire ușoară
const SNOW_N=55;
function drawSnowfall(){
  ctx.fillStyle='#ffffff';
  const WW=W+20,HH=H+10;
  for(let i=0;i<SNOW_N;i++){const h=vhash(i,31),d=0.35+(h%100)/160,vy=0.22+d*0.38;
    const x=((((h>>>8)%WW)-cam.x*d*0.6+G.t*0.12+Math.sin(G.t*0.013+i)*6)%WW+WW)%WW-10;
    const cy=Math.round(cam.y),y=((((h>>>16)%HH)+G.t*vy-cy*d*0.6)%HH+HH)%HH-5+cy;   // camera sus: fulgii rămân pe ecran
    ctx.globalAlpha=0.55+d*0.4;const s=d>0.85?2:1;ctx.fillRect(Math.round(x),Math.round(y),s,s);}
  ctx.globalAlpha=1;
}
// Decor discret pe zăpadă, în fața personajelor
function drawSnowDecor(cx,ok){
  const x0=Math.floor(cx/TS)-1,x1=Math.floor((cx+W)/TS)+1,y=192;
  for(let tx=x0;tx<=x1;tx++){
    if(!ok(tx))continue;
    const h=vhash(tx,77),k=h%16,bx=tx*TS-cx+((h>>>5)%9)+2;
    if(k<2){pcirc(ctx,bx+4,y,4,'#c6d6e6');pcirc(ctx,bx+4,y+1,4,'#ffffff');ctx.fillStyle='#eef4fa';ctx.fillRect(bx+1,y-1,6,1);}   // troian
    else if(k<4)fir(ctx,bx+3,y+1,9+((h>>>9)%4),'#2b5a4a','#f4f8fc','#c4d4e2','#4a3a30');   // brăduț
    else if(k===4){ctx.fillStyle='#6a4a30';[[0,0],[1,-1],[2,-2],[3,-2],[4,-3],[2,-3],[1,-4]].forEach(([dx,dy])=>ctx.fillRect(bx+dx,y-1+dy,1,1));}   // crenguță
    else if(k===5){ctx.fillStyle='#55535e';ctx.fillRect(bx,y-3,6,3);ctx.fillStyle='#7a7884';ctx.fillRect(bx+1,y-3,4,2);
      ctx.fillStyle='#ffffff';ctx.fillRect(bx,y-4,6,1);ctx.fillRect(bx+1,y-5,3,1);}   // piatră cu zăpadă
  }
}
