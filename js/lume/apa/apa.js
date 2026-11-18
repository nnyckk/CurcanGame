'use strict';
// ===== APA: gropile cu apă, iazurile, lacurile =====
// Coloanele fără sol pe rândul 12 sunt gropi cu apă
const WATER_Y=12*TS+5;
// Apă doar unde lipsește tot solul (adânciturile au pământ jos)
const waterCol=tx=>'.I'.includes(tileAt(tx,12))&&tileAt(tx,13)==='.';
function overPit(e){const tx=Math.floor((e.x+e.w/2)/TS);return tileAt(tx,12)==='.'&&tileAt(tx,13)==='.';}
function splash(x){
  const w=theme.water;
  for(let i=0;i<12;i++)parts.push({x:x+(Math.random()-0.5)*8,y:WATER_Y-1,vx:(Math.random()-0.5)*2.2,vy:-1.5-Math.random()*2.5,g:0.22,life:28,max:28,col:i%3?w.top:w.foam,s:2});
  sfx.splash();
  scareDucks(x);   // pe lac, rațele din apropiere se sperie
}
// Bulă care urcă din adânc și dispare exact la suprafață
function bubble(x,y){
  y=clamp(y,WATER_Y+4,H-2);
  parts.push({x:x+(Math.random()-0.5)*6,y,vx:(Math.random()-0.5)*0.3,vy:-0.7,g:0,life:Math.max(4,Math.floor((y-WATER_Y)/0.7)),max:0,col:theme.water.foam,s:1});
}
function steam(x){for(let i=0;i<7;i++)parts.push({x:x+(Math.random()-0.5)*8,y:WATER_Y-2,vx:(Math.random()-0.5)*0.6,vy:-0.5-Math.random()*0.7,g:-0.01,life:30,max:30,col:'#d8d8e0',s:2});}
// Un mob viu cade în apă: se scufundă
function enterWater(e){
  e.sink=true;e.vy=Math.min(Math.max(e.vy,0.5),2.5);splash(e.x+e.w/2);
  // Apa frânează brusc mișcarea pe orizontală
  e.vx*=0.3;
  let l=Math.floor((e.x+e.w/2)/TS),r=l;
  while(waterCol(l-1))l--;while(waterCol(r+1))r++;
  e.pitL=l*TS;e.pitR=(r+1)*TS;
  if(e.type==='man'&&e.frozen&&e.slideDir)addScore(e.boy?100:200,e.x+5,WATER_Y-14);   // l-ai împins tu în apă, înghețat
  if(e.type==='bomb'){
    if(e.slideDir)addScore(100,e.x+6,WATER_Y-14);   // ai împins-o tu în apă
    if(e.lit){e.lit=0;steam(e.x+6);sfx.hiss();}
    e.slideDir=0;
  }
}
// Scufundare lentă: viteza tinde spre ~0,33 px/cadru
function sinkStep(e){
  e.vy=e.vy*0.88+0.04;e.y+=e.vy;e.vx*=0.85;
  // Rămâne între pereții gropii: dacă se lovește de unul
  const nx=clamp(e.x+e.vx,e.pitL+3,e.pitR-e.w-3);if(nx!==e.x+e.vx)e.vx=0;e.x=nx;
  if(G.t%10===0)bubble(e.x+e.w/2,e.y);
  if(e.y>H+20)e.remove=true;
}
// Desenată peste personaje
function drawWater(cx){
  const w=theme.water,x0=Math.max(0,Math.floor(cx/TS)),x1=Math.min(cols-1,Math.floor((cx+W)/TS));
  const wet=waterCol;
  const waveTop=wx=>WATER_Y+Math.round(Math.sin(wx*0.3+G.t*0.07)*1.2);
  for(let tx=x0;tx<=x1;tx++){
    if(!wet(tx))continue;
    let end=tx;while(end<x1&&wet(end+1))end++;
    for(let x=tx*TS-cx;x<(end+1)*TS-cx;x++){
      const iced=grid[12][Math.floor((x+cx)/TS)]==='I';
      // Valuri: suprafața urcă și coboară cu 1px
      const top=iced?WATER_Y:waveTop(x+cx);
      // Sub gheață stratul de apă e mai subțire
      ctx.globalAlpha=iced?0.35:0.82;
      if(iced){ctx.fillStyle=w.body;ctx.fillRect(x,12*TS+ICE_SLAB,1,WATER_Y+9-12*TS-ICE_SLAB);}
      else{ctx.fillStyle=w.body;ctx.fillRect(x,top+1,1,8);}
      ctx.fillStyle=w.deep;ctx.fillRect(x,top+9,1,H-top-9);
      ctx.globalAlpha=1;
      if(!iced){ctx.fillStyle=w.top;ctx.fillRect(x,top,1,1);}
    }
    // Sclipiri care clipesc pe apă — doar pe apa deschisă
    ctx.fillStyle=w.glint;
    for(let wx=Math.ceil(tx*TS/12)*12;wx<(end+1)*TS-1;wx+=12){const k=wx/12;
      if(grid[12][Math.floor(wx/TS)]==='.'&&(((G.t>>3)+k*5)%7)<2)ctx.fillRect(wx-cx,WATER_Y+3+(k%3)*4,2,1);}
    if(theme.snow)drawIce(cx,tx,end,waveTop);
    // La fermă, gropile sunt iazuri
    if(theme.farm){let s=tx;while(s>0&&grid[12][s-1]==='.'&&waterCol(s-1))s--;let e2=end;while(e2<cols-1&&grid[12][e2+1]==='.'&&waterCol(e2+1))e2++;drawPond(cx,s,e2);}
    tx=end;
  }
}
// Fundul opac al lacurilor înghețate
function drawLakeBase(cx){
  const x0=Math.max(0,Math.floor(cx/TS)),x1=Math.min(cols-1,Math.floor((cx+W)/TS));
  for(let tx=x0;tx<=x1;tx++){if(waterCol(tx))ctx.drawImage(pickVar(tiles.Lv,tx,13),tx*TS-cx,WATER_Y);}
}
// Iazul fermei
function drawPond(cx,s,e){
  const L=s*TS,R=(e+1)*TS;
  for(let wx=L+10;wx<R-12;wx+=19){const h=vhash(wx,7);if(h%3===0)continue;
    const x=wx+(h>>>4)%6-cx,top=WATER_Y+Math.round(Math.sin(wx*0.3+G.t*0.07)*1.2);
    ctx.fillStyle='#2f7a2a';ctx.fillRect(x,top,7,2);ctx.fillRect(x+1,top-1,5,1);
    ctx.fillStyle='#5aa83a';ctx.fillRect(x+1,top-1,3,1);
    ctx.fillStyle=theme.water.body;ctx.fillRect(x+3,top,1,1);   // crestătura frunzei
    if(h%5===1){ctx.fillStyle='#ff9ac0';ctx.fillRect(x+4,top-2,2,2);ctx.fillStyle='#ffffff';ctx.fillRect(x+4,top-2,1,1);}
  }
  for(const [ex,dir] of [[L,1],[R,-1]]){
    for(let i=0;i<4;i++){const x=ex+dir*(2+i*2)-cx-(dir<0?1:0),hgt=10+((i*7)%5)*2,sway=Math.round(Math.sin(G.t*0.03+i+ex)*1);
      ctx.fillStyle=i%2?'#3a8a2a':'#2a6a22';
      ctx.fillRect(x,WATER_Y-hgt/2,1,hgt/2+4);ctx.fillRect(x+sway,WATER_Y-hgt,1,hgt/2);
      if(i%2===0){ctx.fillStyle='#7a4a20';ctx.fillRect(x+sway,WATER_Y-hgt-1,2,4);}   // spicul de papură
    }
  }
}
