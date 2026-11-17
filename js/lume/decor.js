'use strict';
// ================= DECOR: palmierul, decorul de pe sol =================
// --- Palm decor ---
const PALM=(()=>{const [c,g]=mkCanvas(36,50);
  for(let i=0;i<36;i++){const x=16+Math.round(Math.sin(i/36*1.5)*3);g.fillStyle=i%4<2?'#8a5a2a':'#6a4018';g.fillRect(x,49-i,3,1);}
  [0.25,-0.35,-0.95,-2.2,-2.8,-3.4].forEach(a=>{for(let j=0;j<15;j++){const fx=19+Math.cos(a)*j,fy=13+Math.sin(a)*j+j*j*0.05;g.fillStyle='#2e7a30';g.fillRect(Math.round(fx),Math.round(fy)+1,2,1);g.fillStyle='#48a83e';g.fillRect(Math.round(fx),Math.round(fy),2,1);}});
  g.fillStyle='#5a3010';g.fillRect(17,14,2,2);g.fillRect(20,15,2,2);return c;})();
// Decor discret pe sol, în fața jocului: smocuri de iarbă, flori și câte o tufă mică (cam o treime din tile-uri).
// ok(tx) spune pe ce coloane se poate pune (în joc: doar pe sol, nu lângă gropi).
function drawGroundDecor(cx,th,ok){
  const x0=Math.floor(cx/TS)-1,x1=Math.floor((cx+W)/TS)+1,y=192;
  for(let tx=x0;tx<=x1;tx++){
    if(!ok(tx))continue;
    const h=vhash(tx,99),k=h%16,bx=tx*TS-cx+((h>>>5)%10)+2;
    if(k<3){                                                                       // smoc de iarbă
      ctx.fillStyle=th.grassD;ctx.fillRect(bx,y-3,1,3);ctx.fillRect(bx+2,y-4,1,4);ctx.fillRect(bx+4,y-2,1,2);
      ctx.fillStyle=th.grassL;ctx.fillRect(bx+1,y-2,1,2);ctx.fillRect(bx+3,y-3,1,3);
    }else if(k<5){                                                                 // floare
      ctx.fillStyle=th.grassD;ctx.fillRect(bx+1,y-4,1,4);ctx.fillRect(bx,y-2,1,1);
      ctx.fillStyle=['#ffffff','#ffe14a','#ff8ac0','#ff5a5a'][(h>>>9)%4];ctx.fillRect(bx,y-6,3,1);ctx.fillRect(bx+1,y-7,1,3);
      ctx.fillStyle='#ffd23f';ctx.fillRect(bx+1,y-6,1,1);
    }else if(k===5){                                                               // tufă mică
      pcirc(ctx,bx+4,y-1,4,th.grassD);pcirc(ctx,bx+4,y-2,3,th.grass);ctx.fillStyle=th.grassL;ctx.fillRect(bx+2,y-4,2,1);
    }
  }
}
