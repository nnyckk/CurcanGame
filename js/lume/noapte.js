'use strict';
// ===== NOAPTEA: conurile de lumină ale felinarelor =====
// Luminile nopții, peste umbră
function drawNightLights(cx){
  for(const e of enemies){
    if(e.type!=='man'||e.boy||!e.active||e.dead||e.sink||e.frozen||(e.mole&&!moleOut(e)))continue;   // ucenicul n-are felinar; cârtița, doar afară
    if(e.sleep||e.wake){drawSleepLight(e,cx);continue;}   // felinarul pus jos
    const l=lanternPos(e),lx=Math.round(l.x-cx),ly=Math.round(l.y),LL=lanternLen(e);
    if(lx<-LL||lx>W+LL)continue;
    const hot=e.chasing||(e.mole&&e.alert>0),   // te-a văzut: sursa e roșie
      col=hot?'255,150,90':'255,220,130',   // la fel pentru toți
      a0=e.dir>0?lanternTilt(e):Math.PI-lanternTilt(e);
    const gr=ctx.createRadialGradient(lx,ly,2,lx,ly,LL);
    gr.addColorStop(0,`rgba(${col},0.25)`);gr.addColorStop(1,`rgba(${col},0)`);
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(lx,ly);
    // Conul se oprește la pereți și urmează colțurile
    for(let i=0;i<=24;i++){const a=a0-LANTERN_HALF+2*LANTERN_HALF*i/24,r=lightRay(l.x,l.y,a,LL);ctx.lineTo(lx+Math.cos(a)*r,ly+Math.sin(a)*r);}
    ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='source-over';
    const fl=0.8+0.2*Math.sin(G.t*0.3+e.x);
    // Felinarul și aura lui: nu peste curcan
    if(player&&!player.dead&&overlap(player,{x:l.x-7,y:l.y-7,w:15,h:14}))continue;
    glow(lx,ly,6*fl,hot?'255,125,110':'255,210,110',0.7);
    if(e.mole){ctx.fillStyle=hot?'#ffa090':'#fff6b0';ctx.fillRect(lx-1,ly-1,2,2);continue;}   // lanterna de pe cască: fără lanț
    drawLantern(lx,ly,fl,hot);
  }
  if(!theme.snow)drawFireflies(cx);   // iarna nu sunt licurici
  // Curcanul de aur luminează încet în noapte
  if(player&&!player.dead&&goldSkinOn()){const p=player,b=0.5+0.5*Math.sin(G.t*0.035);
    glow(Math.round(p.x+p.w/2-cx),Math.round(p.y+p.h/2),20+b*6,'255,196,80',(0.26+b*0.14)*(p.alpha<1?p.alpha:1));}
  drawBossLight(cx);
  drawRestaurantLights(cx);
}
// Felinarul: lanțul, rama, flacăra
function drawLantern(lx,ly,fl,hot){
  ctx.fillStyle='#8a8a9a';ctx.fillRect(lx,ly-4,1,2);
  ctx.fillStyle='#2a2018';ctx.fillRect(lx-1,ly-2,4,1);ctx.fillRect(lx-1,ly-1,1,3);ctx.fillRect(lx+2,ly-1,1,3);ctx.fillRect(lx-1,ly+2,4,1);
  ctx.fillStyle=hot?(fl>0.9?'#f8b0a0':'#f08878'):(fl>0.9?'#ecc878':'#deb054');ctx.fillRect(lx,ly-1,2,3);   // flacăra
}
// Licurici ici-colo, aproape de sol
function drawFireflies(cx){
  for(let i=0;i<14;i++){const h=vhash(i,321);
    let sx=((h%520)-cx*0.9)%520;if(sx<0)sx+=520;sx=Math.round(sx-40+Math.sin(G.t*0.013+i)*10);
    const sy=Math.round(150+((h>>>8)%40)+Math.sin(G.t*0.021+i*2)*6),a=0.5+0.5*Math.sin(G.t*0.06+i*1.7);
    if(a<0.15||sx<-4||sx>W+4)continue;
    glow(sx,sy,5,'200,255,110',0.7*a);ctx.globalAlpha=a;ctx.fillStyle='#f4ffb0';ctx.fillRect(sx,sy,1,1);ctx.globalAlpha=1;
  }
}
