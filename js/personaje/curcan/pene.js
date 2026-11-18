'use strict';
// ===== CURCANUL: penele de foc și de gheață =====
// Pana de foc: pană maro cu flăcări care pâlpâie
const FEATHER_PAL={n:'#8a4a22',m:'#b8723a',N:'#5a2c12',l:'#ecdcb8',k:'#3a1a08',o:'#ff8a1a',y:'#ffe040',r:'#e03a10'};
const FEATHER_BODY=["..nnnnnnn.","lNNNNNNNNk","..mnnnnnn.","...mmmm..."];
const FEATHER={A:spr(["..yo.oy...",".oroyoro.."].concat(FEATHER_BODY),FEATHER_PAL),B:spr([".y..oy.o..","..oyoroyo."].concat(FEATHER_BODY),FEATHER_PAL)};
// Pana de gheață: aceeași pană, albastru deschis
const FEATHER_ICE_PAL={n:'#7cc4ea',m:'#c8eeff',N:'#3a86b8',l:'#ffffff',k:'#1a4a6a',o:'#bfe8ff',y:'#ffffff',r:'#5ab0e0'};
const FEATHER_ICE={A:spr(["..yo.oy...",".oroyoro.."].concat(FEATHER_BODY),FEATHER_ICE_PAL),B:spr([".y..oy.o..","..oyoroyo."].concat(FEATHER_BODY),FEATHER_ICE_PAL)};
const FEATHER_RANGE=128,FEATHER_MAX=2;
function throwFeather(){
  const p=player,d=p.face;
  // Mai rapidă decât curcanul
  const sp=6+Math.max(0,p.vx*d)*0.5;
  feathers.push({x:d>0?p.x+p.w-2:p.x-8,y:p.y+10,w:10,h:4,vx:d*sp,dir:d,dist:0,t:0,ice:!!p.ice});
  if(p.ice){sfx.fwipIce();frostBreath(6);}else sfx.fwip();   // cu un puf de abur mai mare la aruncare
}
function puffFeather(f){
  f.remove=true;
  for(let i=0;i<6;i++)parts.push({x:f.x+5,y:f.y+2,vx:(Math.random()-0.5)*1.4,vy:-Math.random()*1.2,g:-0.01,life:16,max:16,col:f.ice?(i%2?'#ffffff':'#9fdcff'):(i%2?'#8a8494':'#ff9a2a'),s:2});
}
function updateFeathers(){
  for(const f of feathers){
    f.x+=f.vx;f.dist+=Math.abs(f.vx);f.t++;
    // Dâră de flăcări în urma penei
    if(f.t%2===0)parts.push({x:f.x+(f.dir>0?0:9),y:f.y-2+Math.random()*3,vx:-f.dir*0.4,vy:f.ice?0.2:-0.4-Math.random()*0.5,g:-0.01,life:10,max:10,
      col:f.ice?(Math.random()<0.5?'#ffffff':'#bfe8ff'):(Math.random()<0.5?'#ffb02a':'#ffe040'),s:f.ice?1:2});
    // Zboară doar o anumită distanță
    const tx=Math.floor((f.dir>0?f.x+f.w:f.x)/TS),ty=Math.floor((f.y+f.h/2)/TS);
    if(solid(tileAt(tx,ty))||f.dist>=FEATHER_RANGE){puffFeather(f);continue;}
    // În cafenea, pana se stinge la pereți
    if(inCafe()&&(f.x<cafe.a*TS+CAFE_L||f.x+f.w>cafe.a*TS+CAFE_R)){puffFeather(f);continue;}
    // Boss-ul: pana de gheață îl brumează
    if(bossFighting()&&overlap(f,boss)){if(f.ice)bossIceHit();puffFeather(f);continue;}
    for(const e of enemies){
      if(!e.active||e.dead||e.remove||e.sink||offstage(e)||!overlap(f,e))continue;
      if(f.ice)freeze(e);   // pana de gheață îngheață
      else if(e.frozen)shatter(e,200);   // pana de foc topește gheața cu el
      else if(e.type==='man'){killMan(e,2,200);sfx.burn();}
      else if(!e.sit)sitBomb(e);
      puffFeather(f);break;
    }
  }
  feathers=feathers.filter(f=>!f.remove);
}
