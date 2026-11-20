'use strict';
// ===== FERMIERUL: felinarul =====
// Felinarul: conul de lumină din fața fermierului
const LANTERN_LEN=110,LANTERN_HALF=0.3,LOST_T=150;
// Felinarul mic, ținut de lanț în mâna din spate
function lanternPos(e){return {x:e.x+5-e.dir*4,y:e.y+14};}
function lanternSees(e){
  const l=lanternPos(e),px=player.x+player.w/2;
  for(const py of [player.y+3,player.y+player.h/2,player.y+player.h-2]){
    const ddx=px-l.x,ddy=py-l.y;
    if(ddx*e.dir<=0||ddx*ddx+ddy*ddy>LANTERN_LEN*LANTERN_LEN)continue;
    if(Math.atan2(Math.abs(ddy),Math.abs(ddx))<=LANTERN_HALF)return true;
  }
  return false;
}
