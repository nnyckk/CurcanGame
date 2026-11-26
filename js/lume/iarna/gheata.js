'use strict';
// ===== IARNA: lacurile înghețate =====
// Fiecare tile de gheață strânge „crăpături” cât timp
const ICE_CRACK_T=120,ICE_HEAL=0.6,ICE_REFREEZE_T=300,ICE_ACC=0.15,ICE_FRICTION=0.07;
let iceCrack=new Float32Array(0),iceHole=new Int16Array(0),iceTouch=new Int32Array(0);
function onIce(e){return e.onGround&&tileAt(Math.floor((e.x+e.w/2)/TS),Math.floor((e.y+e.h+1)/TS))==='I';}
function iceUnder(e){const ty=Math.floor((e.y+e.h+1)/TS),out=[];
  for(let tx=Math.floor(e.x/TS);tx<=Math.floor((e.x+e.w-1)/TS);tx++)if(tileAt(tx,ty)==='I')out.push(tx);return out;}
function iceStage(tx){const c=iceCrack[tx]/ICE_CRACK_T;return c>0.8?3:c>0.5?2:c>0.2?1:0;}
function stepOnIce(under){
  let brk=false;
  for(const tx of under){const s0=iceStage(tx);iceCrack[tx]++;iceTouch[tx]=G.frame;
    if(iceStage(tx)>s0)sfx.crack();
    if(iceCrack[tx]>=ICE_CRACK_T)brk=true;}
  // Se sparge tot ce e sub picioare deodată
  if(brk){for(const tx of under)breakIce(tx,true);sfx.iceBreak();achIceFall();}
}
// quiet: fără sunet
function breakIce(tx,quiet){
  grid[12][tx]='.';iceCrack[tx]=0;iceHole[tx]=ICE_REFREEZE_T;
  for(let i=0;i<7;i++)parts.push({x:tx*TS+2+Math.random()*12,y:12*TS+1,vx:(Math.random()-0.5)*2.4,vy:-1.5-Math.random()*2,g:0.25,life:30,max:30,col:i%2?'#ffffff':'#bfe6f8',s:2,edge:'#7ab0d0'});
  if(!quiet)sfx.iceBreak();
}
function updateIce(){
  for(let tx=0;tx<cols;tx++){
    if(iceCrack[tx]>0&&iceTouch[tx]!==G.frame)iceCrack[tx]=Math.max(0,iceCrack[tx]-ICE_HEAL);
    if(iceHole[tx]>0&&--iceHole[tx]===0){
      // Nu îngheață peste curcan cât timp e chiar în gaură
      const box={x:tx*TS,y:12*TS,w:TS,h:ICE_SLAB};
      if(!player.dead&&overlap(player,box))iceHole[tx]=1;
      else{grid[12][tx]='I';
        for(let i=0;i<5;i++)parts.push({x:tx*TS+2+Math.random()*12,y:12*TS-1-Math.random()*3,vx:0,vy:-0.3,g:0,life:20,max:20,col:'#ffffff',s:1});
        if(tx*TS>cam.x-TS&&tx*TS<cam.x+W)sfx.freeze();}
    }
  }
}
// Placa de gheață a lacului
const ICE_TEETH=[1,2,1,2,2,1,0];
function drawIce(cx,s,e,waveTop){
  for(let tx=s;tx<=e;tx++){const x=tx*TS-cx,y=12*TS;
    if(grid[12][tx]==='I'){
      ctx.drawImage(pickVar(tiles.Iv,tx,12),x,y);const st=iceStage(tx);if(st)ctx.drawImage(tiles.Icrack[st-1],x,y);
      const h=vhash(tx,5);
      for(let r=0;r<ICE_SLAB;r++){const len=ICE_TEETH[(r+h)%ICE_SLAB];if(!len)continue;ctx.fillStyle=ICE_ROWS[r];
        if(grid[12][tx+1]==='.')ctx.fillRect(x+TS,y+r,len,1);
        if(tx>0&&grid[12][tx-1]==='.')ctx.fillRect(x-len,y+r,len,1);}
    }else{
      const h=vhash(tx,9);if(h%3===0)continue;
      const bx=x+3+(h>>>4)%8,top=waveTop(bx+cx);
      ctx.fillStyle='#ffffff';ctx.fillRect(bx,top-1,4,1);ctx.fillStyle='#c4e6f6';ctx.fillRect(bx,top,4,1);ctx.fillStyle='#8cc4e2';ctx.fillRect(bx+1,top+1,2,1);
    }
  }
}
