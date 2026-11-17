'use strict';
// ================= FERMIERUL: felinarul (noaptea te vede doar în lumina lui) =================
// Felinarul (noaptea): conul de lumină din fața fermierului — lung de ~7 tile-uri, deschis la ±17°.
// Te vede dacă vârful, mijlocul sau picioarele curcanului intră în con. LOST_T = cât te mai caută după ce ieși.
const LANTERN_LEN=110,LANTERN_HALF=0.3,LOST_T=150;
function lanternPos(e){return {x:e.x+5+e.dir*6,y:e.y+11};}
function lanternSees(e){
  const l=lanternPos(e),px=player.x+player.w/2;
  for(const py of [player.y+3,player.y+player.h/2,player.y+player.h-2]){
    const ddx=px-l.x,ddy=py-l.y;
    if(ddx*e.dir<=0||ddx*ddx+ddy*ddy>LANTERN_LEN*LANTERN_LEN)continue;
    if(Math.atan2(Math.abs(ddy),Math.abs(ddx))<=LANTERN_HALF)return true;
  }
  return false;
}
