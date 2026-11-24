'use strict';
// ===== BUCLA PRINCIPALĂ ȘI PORNIREA JOCULUI =====
let last=performance.now(),acc=0;
const STEP=1000/60;
function frame(now){
  acc+=Math.min(100,now-last)*(G.speed||1);last=now;
  while(acc>=STEP){update();acc-=STEP;}
  render();requestAnimationFrame(frame);
}
achRetro();   // achievements pentru ce ai făcut
if(EDIT){G.god=true;edShow(edNewLevel());}   // editorul: pânza goală, până vine nivelul
else if(TEST){G.god=true;G.level=ARENA;startLevel();}   // în test pornești invincibil
else playSong('title');
requestAnimationFrame(frame);
