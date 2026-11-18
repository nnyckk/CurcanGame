'use strict';
// ===== RESTAURANTUL MESOPOTAMIA =====
const RW=192,RH=136;
const REST=(()=>{const [c,g]=mkCanvas(RW,RH);
  g.fillStyle='#5a5a6a';g.fillRect(44,26,4,14);g.fillRect(144,26,4,14);
  g.fillStyle='#ffcf40';g.fillRect(14,0,164,28);g.fillStyle='#2a1238';g.fillRect(16,2,160,24);
  txt('MESOPOTAMIA',96,7,'#ffd23f',2,'c','#b0300a',g);
  g.fillStyle='#e2b066';g.fillRect(36,38,120,12);g.fillStyle='#c8924a';for(let y=41;y<50;y+=4)g.fillRect(36,y,120,1);
  g.fillStyle='#e2b066';g.fillRect(36,39,120,10);
  txt('FAST FOOD',96,40,'#7a2a0a',1,'c',null,g);
  g.fillStyle='#e2b066';g.fillRect(20,50,152,10);g.fillStyle='#1f4fb0';g.fillRect(20,52,152,6);
  g.fillStyle='#ffcf40';for(let i=2;i<150;i+=6)g.fillRect(20+i,54,2,2);
  g.fillStyle='#e8bc74';g.fillRect(4,60,184,76);
  g.fillStyle='#c8924a';for(let y=70;y<136;y+=6){g.fillRect(4,y,184,1);for(let x=4+((y/6|0)%2)*8;x<188;x+=16)g.fillRect(x,y-5,1,5);}
  g.fillStyle='#1f4fb0';g.fillRect(4,60,184,5);g.fillStyle='#ffcf40';for(let x=8;x<186;x+=8)g.fillRect(x,62,2,1);
  for(let i=0;i<23;i++){g.fillStyle=i%2?'#fff4e0':'#d8282f';g.fillRect(4+i*8,66,8,9);g.fillRect(5+i*8,75,6,1);g.fillRect(6+i*8,76,4,1);}
  const win=(wx,cross)=>{g.fillStyle='#4a2410';g.fillRect(wx,86,48,34);g.fillStyle='#ffd86a';g.fillRect(wx+2,88,44,30);g.fillStyle='#ffeaa8';g.fillRect(wx+2,88,44,4);
    g.fillStyle='#4a2410';if(cross)g.fillRect(wx+23,88,2,30);g.fillRect(wx+2,103,44,2);g.fillStyle='#c8924a';g.fillRect(wx-2,120,52,3);};
  win(14,true);win(130,false);
  // burger in left window
  const bx=40,by=107;g.fillStyle='#d08a30';g.fillRect(bx+2,by,10,1);g.fillRect(bx+1,by+1,12,2);g.fillStyle='#fff';g.fillRect(bx+4,by+1,1,1);g.fillRect(bx+8,by+1,1,1);
  g.fillStyle='#4ab040';g.fillRect(bx,by+3,14,1);g.fillStyle='#5a2a10';g.fillRect(bx+1,by+4,12,2);g.fillStyle='#d08a30';g.fillRect(bx+1,by+6,12,2);
  // kebab in left upper
  g.fillStyle='#8a8a9a';g.fillRect(25,90,1,12);g.fillStyle='#a0501a';g.fillRect(22,92,7,8);g.fillStyle='#c8702a';g.fillRect(23,92,2,8);
  txt('DESCHIS',154,93,'#d8282f',1,'c',null,g);
  g.fillStyle='#4ab040';g.fillRect(140,108,6,7);g.fillStyle='#d8282f';g.fillRect(150,106,8,9);g.fillStyle='#fff';g.fillRect(153,103,1,3);
  // door
  g.fillStyle='#4a2410';g.fillRect(80,90,32,46);g.fillRect(84,86,24,4);g.fillRect(88,84,16,2);
  g.fillStyle='#8a4a22';g.fillRect(83,93,26,43);g.fillStyle='#6a3412';[[86,97],[97,97],[86,117],[97,117]].forEach(([x,y])=>g.fillRect(x,y,9,16));
  g.fillStyle='#ffcf40';g.fillRect(104,114,2,3);g.fillStyle='#a07040';g.fillRect(76,133,40,3);
  [[64,124],[118,124]].forEach(([x,y])=>{g.fillStyle='#b0502a';g.fillRect(x,y,10,12);g.fillStyle='#d06a3a';g.fillRect(x,y,10,2);pcirc(g,x+5,y-4,5,'#3a9a3a');g.fillStyle='#5ac04a';g.fillRect(x+3,y-7,2,2);});
  return c;})();
function doorRect(){return {x:goal.x*TS+83,y:192-RH+93,w:26,h:43};}
function drawRestaurant(cx){
  const x=goal.x*TS-cx,y=192-RH;
  if(x>W+60||x<-RW-60)return;
  // Iarna: brazi înzăpeziți în loc de palmieri și câte un troian lângă ziduri
  if(theme.snow){fir(ctx,x-16,193,48,'#2b5a4a','#f4f8fc','#c4d4e2','#4a3a30');fir(ctx,x+RW+15,193,40,'#24503f','#f4f8fc','#c4d4e2','#4a3a30');
    pcirc(ctx,x+8,193,6,'#f4f8fc');pcirc(ctx,x+RW-8,193,5,'#f4f8fc');}
  else{ctx.drawImage(PALM,x-34,192-50);ctx.drawImage(PALM,x+RW+2,192-50);}
  ctx.fillStyle='rgba(255,210,100,0.18)';ctx.fillRect(x+10,188,56,4);ctx.fillRect(x+126,188,56,4);
  ctx.drawImage(REST,x,y);
  if(theme.snow)restSnow(x,y);
  restNeon(x,y);restDoor(cx);
}
// Luminițele de neon din jurul firmei
function restNeon(x,y){
  const NEON=['#ffe24a','#ff5ac8','#5ae8ff'];let i=0;
  const dot=(dx,dy)=>{ctx.fillStyle=NEON[(i+(G.t>>3))%3];ctx.fillRect(x+dx,y+dy,2,2);i++;};
  for(let dx=14;dx<176;dx+=6)dot(dx,0);for(let dy=6;dy<26;dy+=6)dot(176,dy);for(let dx=176;dx>14;dx-=6)dot(dx,26);for(let dy=26;dy>0;dy-=6)dot(14,dy);
}
// Ușa luminată, când ai ajuns
function restDoor(cx){
  if(G.state==='clear'&&G.final||G.state==='win'){const d=doorRect();ctx.fillStyle='#ffe9a0';ctx.fillRect(d.x-cx,d.y,d.w,d.h);ctx.fillStyle='#ffd060';ctx.fillRect(d.x-cx,d.y+d.h-6,d.w,6);}
}
// Zăpada de pe restaurant: pe firmă
function restSnow(x,y){
  const cap=(sx,sy,w)=>{ctx.fillStyle='#c4d4e2';ctx.fillRect(sx,sy+1,w,2);ctx.fillStyle='#f4f8fc';ctx.fillRect(sx,sy,w,2);ctx.fillRect(sx+1,sy-1,w-2,1);
    for(let i=3;i<w-2;i+=7){ctx.fillRect(sx+i,sy+2,1,1+(i*7)%3);}};
  cap(x+13,y-2,166);cap(x+35,y+36,122);cap(x+19,y+48,154);
}
// Noaptea: firma și ferestrele se văd luminate
function drawRestaurantLights(cx){
  if(!goal||goal.type!=='restaurant')return;
  const x=goal.x*TS-cx,y=192-RH;if(x>W+90||x<-RW-90)return;
  for(const [sx,sy,w,h] of [[16,2,160,24],[16,88,44,30],[132,88,44,30]])ctx.drawImage(REST,sx,sy,w,h,x+sx,y+sy,w,h);
  glow(x+38,y+103,46,'255,200,110',0.35);glow(x+154,y+103,46,'255,200,110',0.35);glow(x+96,y+14,92,'255,190,80',0.16);
  if(theme.snow)restSnow(x,y);
  restNeon(x,y);restDoor(cx);
}
