'use strict';
// ===== FIZICA: tile-uri solide, mișcare cu coliziuni =====
// P = cărămidă cu o pană de aur înăuntru
function solid(c){return c==='G'||c==='D'||c==='B'||c==='P'||c==='M'||c==='H'||c==='A'||c==='R'||c==='N'||c==='U'||c==='X'||c==='^'||c==='v'||c==='<'||c==='>'||c==='I'||c==='F'||c==='S'||c==='E'||c==='K';}
function tileAt(tx,ty){if(tx<0||tx>=cols)return 'X';if(ty<topRow||ty>=ROWS)return '.';return grid[ty][tx];}
// Pe ce stai doar de sus: scândurile și iarba de pe pământul din spate
// W = pământul din spate, al doilea strat (mai departe); pe iarba lui de sus stai, dacă nu-l acoperă cel din față
function ledge(tx,ty){const c=tileAt(tx,ty),u=tileAt(tx,ty-1);return c==='='||(c==='Z'&&u!=='Z')||(c==='W'&&u!=='W'&&u!=='Z');}
function moveX(e){
  e.x+=e.vx;e.hitWall=false;const t=Math.floor(e.y/TS),b=Math.floor((e.y+e.h-0.01)/TS);
  if(e.vx>0){const tx=Math.floor((e.x+e.w-0.01)/TS);for(let ty=t;ty<=b;ty++)if(solid(tileAt(tx,ty))){e.x=tx*TS-e.w;e.hitWall=true;break;}}
  else if(e.vx<0){const tx=Math.floor(e.x/TS);for(let ty=t;ty<=b;ty++)if(solid(tileAt(tx,ty))){e.x=(tx+1)*TS;e.hitWall=true;break;}}
  if(e.hitWall&&e===player&&ledgeHop(e))return;
  if(e.hitWall)e.vx=0;
}
// Ratezi marginea cu câțiva pixeli: urci pe ea
const LEDGE_PX=5,CORNER_PX=5;
function ledgeHop(e){
  if(e.onGround||e.vy<-1)return false;
  const tx=e.vx>0?Math.floor((e.x+e.w+0.5)/TS):Math.floor((e.x-0.5)/TS),bot=e.y+e.h,row=Math.floor((bot-0.01)/TS);
  if(bot-row*TS>LEDGE_PX||!solid(tileAt(tx,row)))return false;
  const ny=row*TS-e.h,l=Math.floor(e.x/TS),r=Math.floor((e.x+e.w-0.01)/TS);
  for(let ty=Math.floor(ny/TS);ty<row;ty++){if(solid(tileAt(tx,ty)))return false;for(let c=l;c<=r;c++)if(solid(tileAt(c,ty)))return false;}
  e.y=ny;e.vy=0;e.hitWall=false;return true;
}
function moveY(e){
  const pb=e.y+e.h,down=e.vy>0;e.y+=e.vy;e.onGround=false;e.headHit=null;e.plat=null;
  const l=Math.floor(e.x/TS),r=Math.floor((e.x+e.w-0.01)/TS),bot=e.y+e.h;
  if(down){const ty=Math.floor((e.y+e.h-0.01)/TS);
    for(let tx=l;tx<=r;tx++){const c=tileAt(tx,ty);if(solid(c)||(ledge(tx,ty)&&pb<=ty*TS+0.5)){e.y=ty*TS-e.h;e.vy=0;e.onGround=true;break;}}}
  else if(e.vy<0){const ty=Math.floor(e.y/TS);let hit=null;const mc=e.x+e.w/2;
    for(let tx=l;tx<=r;tx++){const c=tileAt(tx,ty);if(solid(c)||(c==='V'&&e===player))if(!hit||Math.abs(tx*TS+8-mc)<Math.abs(hit[0]*TS+8-mc))hit=[tx,ty];}
    // Colțul unui bloc, atins doar cu marginea capului: alunecă pe lângă
    if(hit&&e===player&&l!==r){const sl=solid(tileAt(l,ty))||tileAt(l,ty)==='V',sr=solid(tileAt(r,ty))||tileAt(r,ty)==='V';
      if(sl&&!sr&&(l+1)*TS-e.x<=CORNER_PX){e.x=(l+1)*TS;hit=null;}
      else if(sr&&!sl&&e.x+e.w-r*TS<=CORNER_PX){e.x=r*TS-e.w;hit=null;}}
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
// Țepii întorși: în cap (v) sau din lateral (< în dreapta ta, > în stânga). Întoarce direcția în care ești împins, sau 0
function spikeTouch(e){
  const x0=Math.floor(e.x/TS),x1=Math.floor((e.x+e.w-1)/TS),y0=Math.floor(e.y/TS),y1=Math.floor((e.y+e.h-1)/TS);
  for(let tx=x0;tx<=x1;tx++)if(tileAt(tx,Math.floor((e.y-1)/TS))==='v')return -(e.face||1);
  for(let ty=y0;ty<=y1;ty++){if(tileAt(Math.floor((e.x+e.w+0.5)/TS),ty)==='<')return -1;if(tileAt(Math.floor((e.x-0.5)/TS),ty)==='>')return 1;}
  return 0;
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
// Treaptă de un bloc în jos, sigură?
function stepDownAhead(e,dir){const ax=dir>0?e.x+e.w+1:e.x-1,tx=Math.floor(ax/TS),ty=Math.floor((e.y+e.h+2)/TS)+1,c=tileAt(tx,ty);
  if(solid(tileAt(tx,ty-1)))return false;
  return (solid(c)&&c!=='^'&&c!=='I')||ledge(tx,ty)||!!platAt(ax,e.y+e.h+2+TS);}
// Platforma din punctul, dacă e vreuna
function platAt(x,y){for(const p of plats)if(p.solid&&x>=p.x&&x<p.x+p.w&&y>=p.y&&y<=p.y+p.h)return p;return null;}
