'use strict';
// ================= BUCLA PRINCIPALĂ ȘI PORNIREA JOCULUI =================
let last=performance.now(),acc=0;
const STEP=1000/60;
function frame(now){
  acc+=Math.min(100,now-last)*(G.speed||1);last=now;
  while(acc>=STEP){update();acc-=STEP;}
  render();requestAnimationFrame(frame);
}
if(TEST){G.level=ARENA;startLevel();}
else playSong('title');
requestAnimationFrame(frame);
