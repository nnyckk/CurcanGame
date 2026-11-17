'use strict';
// ================= NOAPTEA: conurile de lumină ale felinarelor, licuricii =================
// Luminile nopții, peste umbră: conul felinarului fiecărui fermier (galben cald; portocaliu când te-a văzut),
// felinarul care pâlpâie, apoi licuricii.
function drawNightLights(cx){
  for(const e of enemies){
    if(e.type!=='man'||e.boy||!e.active||e.dead||e.sink||e.frozen)continue;  // ucenicul n-are felinar; înghețat, felinarul e stins
    const l=lanternPos(e),lx=Math.round(l.x-cx),ly=Math.round(l.y);
    if(lx<-LANTERN_LEN||lx>W+LANTERN_LEN)continue;
    const col=e.chasing?'255,150,90':'255,220,130',a0=e.dir>0?0:Math.PI;
    const gr=ctx.createRadialGradient(lx,ly,2,lx,ly,LANTERN_LEN);
    gr.addColorStop(0,`rgba(${col},0.3)`);gr.addColorStop(1,`rgba(${col},0)`);
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(lx,ly);ctx.arc(lx,ly,LANTERN_LEN,a0-LANTERN_HALF,a0+LANTERN_HALF);ctx.closePath();ctx.fill();
    ctx.globalCompositeOperation='source-over';
    const fl=0.8+0.2*Math.sin(G.t*0.3+e.x);
    glow(lx,ly,8*fl,'255,210,110',0.7);
    ctx.fillStyle='#2a2018';ctx.fillRect(lx,ly-5,1,2);ctx.fillRect(lx-1,ly-3,3,1);ctx.fillRect(lx-2,ly-2,1,4);ctx.fillRect(lx+2,ly-2,1,4);ctx.fillRect(lx-1,ly+2,3,1);
    ctx.fillStyle=fl>0.9?'#fff4c0':'#ffd56a';ctx.fillRect(lx-1,ly-2,3,4);
  }
  if(!theme.snow)drawFireflies(cx);   // iarna nu sunt licurici
  // Curcanul de aur luminează încet în noapte: o lumină caldă, aurie, care crește și scade lin în jurul lui.
  if(player&&!player.dead&&goldSkinOn()){const p=player,b=0.5+0.5*Math.sin(G.t*0.035);
    glow(Math.round(p.x+p.w/2-cx),Math.round(p.y+p.h/2),20+b*6,'255,196,80',(0.26+b*0.14)*(p.alpha<1?p.alpha:1));}
  drawBossLight(cx);
  drawRestaurantLights(cx);
}
// Licurici ici-colo, aproape de sol: plutesc încet și se aprind/sting pe rând (cu puțină paralaxă).
function drawFireflies(cx){
  for(let i=0;i<14;i++){const h=vhash(i,321);
    let sx=((h%520)-cx*0.9)%520;if(sx<0)sx+=520;sx=Math.round(sx-40+Math.sin(G.t*0.013+i)*10);
    const sy=Math.round(150+((h>>>8)%40)+Math.sin(G.t*0.021+i*2)*6),a=0.5+0.5*Math.sin(G.t*0.06+i*1.7);
    if(a<0.15||sx<-4||sx>W+4)continue;
    glow(sx,sy,5,'200,255,110',0.7*a);ctx.globalAlpha=a;ctx.fillStyle='#f4ffb0';ctx.fillRect(sx,sy,1,1);ctx.globalAlpha=1;
  }
}
