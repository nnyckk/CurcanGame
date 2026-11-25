'use strict';
// ===== NOAPTEA: conurile de lumină ale felinarelor =====
// Luminile nopții, peste umbră
function drawNightLights(cx){
  for(const e of enemies){
    if(e.type!=='man'||e.boy||!e.active||e.dead||e.sink||e.frozen||(e.mole&&!moleOut(e)))continue;   // ucenicul n-are felinar; cârtița, doar afară
    const l=lanternPos(e),lx=Math.round(l.x-cx),ly=Math.round(l.y),LL=lanternLen(e);
    if(lx<-LL||lx>W+LL)continue;
    const col=e.mole?(e.chasing||e.alert>0?'255,60,50':'255,220,130'):e.chasing?'255,150,90':'255,220,130',   // cârtița: roșie
      a0=e.dir>0?0:Math.PI;
    const gr=ctx.createRadialGradient(lx,ly,2,lx,ly,LL);
    gr.addColorStop(0,`rgba(${col},0.3)`);gr.addColorStop(1,`rgba(${col},0)`);
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(lx,ly);ctx.arc(lx,ly,LL,a0-LANTERN_HALF,a0+LANTERN_HALF);ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='source-over';
    const fl=0.8+0.2*Math.sin(G.t*0.3+e.x);
    // Felinarul și aura lui: nu peste curcan
    if(player&&!player.dead&&overlap(player,{x:l.x-7,y:l.y-7,w:15,h:14}))continue;
    glow(lx,ly,6*fl,'255,210,110',0.7);
    if(e.mole){ctx.fillStyle='#fff6b0';ctx.fillRect(lx-1,ly-1,2,2);continue;}   // lanterna de pe cască: fără lanț
    // lanțul din mână, rama, flacăra
    ctx.fillStyle='#8a8a9a';ctx.fillRect(lx,ly-4,1,2);
    ctx.fillStyle='#2a2018';ctx.fillRect(lx-1,ly-2,4,1);ctx.fillRect(lx-1,ly-1,1,3);ctx.fillRect(lx+2,ly-1,1,3);ctx.fillRect(lx-1,ly+2,4,1);
    ctx.fillStyle=fl>0.9?'#fff4c0':'#ffd56a';ctx.fillRect(lx,ly-1,2,3);
  }
  if(!theme.snow)drawFireflies(cx);   // iarna nu sunt licurici
  // Curcanul de aur luminează încet în noapte
  if(player&&!player.dead&&goldSkinOn()){const p=player,b=0.5+0.5*Math.sin(G.t*0.035);
    glow(Math.round(p.x+p.w/2-cx),Math.round(p.y+p.h/2),20+b*6,'255,196,80',(0.26+b*0.14)*(p.alpha<1?p.alpha:1));}
  drawBossLight(cx);
  drawRestaurantLights(cx);
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
