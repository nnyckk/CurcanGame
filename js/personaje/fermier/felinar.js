'use strict';
// ===== FERMIERUL: felinarul =====
// Felinarul: conul de lumină din fața fermierului
const LANTERN_LEN=110,LANTERN_HALF=0.3,LOST_T=150;
// Felinarul mic, ținut de lanț în mâna din spate
function lanternPos(e){return e.mole?{x:e.x+5+e.dir*3,y:e.y}:{x:e.x+5-e.dir*4,y:e.y+14+(e.bob||0)};}   // cârtița: lanterna de pe cască
// Cât merge o rază de lumină până dă de un perete
function lightRay(x,y,ang,max){const c=Math.cos(ang),s=Math.sin(ang);for(let d=2;d<max;d+=2)if(solid(tileAt(Math.floor((x+c*d)/TS),Math.floor((y+s*d)/TS))))return d;return max;}
const lanternLen=e=>e.mole?MOLE_LAMP:LANTERN_LEN;   // cârtița: mai scurtă
const MOLE_TILT=0.22,lanternTilt=e=>e.mole?MOLE_TILT:0;   // cârtița: raza ușor în jos
function lanternSees(e){
  const l=lanternPos(e),px=player.x+player.w/2,LL=lanternLen(e);
  for(const py of [player.y+3,player.y+player.h/2,player.y+player.h-2]){
    const ddx=px-l.x,ddy=py-l.y;
    if(ddx*e.dir<=0||ddx*ddx+ddy*ddy>LL*LL)continue;
    const d=Math.sqrt(ddx*ddx+ddy*ddy);
    if(Math.abs(Math.atan2(ddy,Math.abs(ddx))-lanternTilt(e))<=LANTERN_HALF&&lightRay(l.x,l.y,Math.atan2(ddy,ddx),d)>=d-2)return true;   // nu prin pereți
  }
  return false;
}
