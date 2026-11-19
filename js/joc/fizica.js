'use strict';
// ===== FIZICA: tile-uri solide, mișcare cu coliziuni =====
// P = cărămidă cu o pană de aur înăuntru
function solid(c){return c==='G'||c==='D'||c==='B'||c==='P'||c==='M'||c==='H'||c==='A'||c==='U'||c==='X'||c==='^'||c==='I'||c==='F'||c==='S'||c==='E'||c==='K';}
function tileAt(tx,ty){if(tx<0||tx>=cols)return 'X';if(ty<0||ty>=ROWS)return '.';return grid[ty][tx];}
// Pe ce stai doar de sus: scândurile și iarba de pe pământul din spate
// W = pământul din spate, al doilea strat (mai departe); pe iarba lui de sus stai, dacă nu-l acoperă cel din față
function ledge(tx,ty){const c=tileAt(tx,ty),u=tileAt(tx,ty-1);return c==='='||(c==='Z'&&u!=='Z')||(c==='W'&&u!=='W'&&u!=='Z');}
function moveX(e){
  e.x+=e.vx;e.hitWall=false;const t=Math.floor(e.y/TS),b=Math.floor((e.y+e.h-0.01)/TS);
  if(e.vx>0){const tx=Math.floor((e.x+e.w-0.01)/TS);for(let ty=t;ty<=b;ty++)if(solid(tileAt(tx,ty))){e.x=tx*TS-e.w;e.hitWall=true;break;}}
  else if(e.vx<0){const tx=Math.floor(e.x/TS);for(let ty=t;ty<=b;ty++)if(solid(tileAt(tx,ty))){e.x=(tx+1)*TS;e.hitWall=true;break;}}
  if(e.hitWall)e.vx=0;
}
function moveY(e){
  const pb=e.y+e.h,down=e.vy>0;e.y+=e.vy;e.onGround=false;e.headHit=null;e.plat=null;
  const l=Math.floor(e.x/TS),r=Math.floor((e.x+e.w-0.01)/TS),bot=e.y+e.h;
  if(down){const ty=Math.floor((e.y+e.h-0.01)/TS);
    for(let tx=l;tx<=r;tx++){const c=tileAt(tx,ty);if(solid(c)||(ledge(tx,ty)&&pb<=ty*TS+0.5)){e.y=ty*TS-e.h;e.vy=0;e.onGround=true;break;}}}
  else if(e.vy<0){const ty=Math.floor(e.y/TS);let hit=null;const mc=e.x+e.w/2;
    for(let tx=l;tx<=r;tx++){const c=tileAt(tx,ty);if(solid(c)||(c==='V'&&e===player))if(!hit||Math.abs(tx*TS+8-mc)<Math.abs(hit[0]*TS+8-mc))hit=[tx,ty];}
    if(hit){e.y=(ty+1)*TS;e.vy=0;e.headHit=hit;}}
  // Platformele care se mișcă / cad: ca scândurile '='
  if(down)for(const p of plats){
    if(!p.solid||e.x+e.w<=p.x||e.x>=p.x+p.w)continue;
    if(pb<=p.y+Math.max(0,-p.dy)+0.5&&bot>=p.y&&(!e.onGround||p.y<e.y+e.h)){e.y=p.y-e.h;e.vy=0;e.onGround=true;e.plat=p;}
  }
}
// Stă cu picioarele pe un tile cu țepi — și pentru curcan
function standsOnSpikes(e){
  const ty=Math.floor((e.y+e.h+1)/TS);
  for(let tx=Math.floor(e.x/TS);tx<=Math.floor((e.x+e.w-1)/TS);tx++)if(tileAt(tx,ty)==='^')return true;
  return false;
}
// Țepi chiar în fața mobului, la înălțimea corpului
function spikeAhead(e,dir){
  const tx=Math.floor((dir>0?e.x+e.w+1:e.x-1)/TS);
  for(let ty=Math.floor(e.y/TS);ty<=Math.floor((e.y+e.h-1)/TS);ty++)if(tileAt(tx,ty)==='^')return true;
  return false;
}
// E sol sigur în față?
function groundAhead(e,dir){const ax=dir>0?e.x+e.w+1:e.x-1,tx=Math.floor(ax/TS),ty=Math.floor((e.y+e.h+2)/TS),c=tileAt(tx,ty);
  return (solid(c)&&c!=='^'&&(c!=='I'||onIce(e)))||ledge(tx,ty)||!!platAt(ax,e.y+e.h+2);}
// Platforma din punctul, dacă e vreuna
function platAt(x,y){for(const p of plats)if(p.solid&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<=p.y+p.h)return p;return null;}
