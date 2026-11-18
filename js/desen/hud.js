'use strict';
// ===== DESEN: HUD =====
function drawHUD(){
  ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(0,0,W,15);
  ctx.drawImage(headImg(),6,3);txt('X'+G.lives,16,4,'#fff');
  ctx.drawImage(COIN,40,2);txt('X'+pad(G.coins,2),54,4,'#ffd23f');
  // Penele de aur din nivel: aurii cele luate acum
  golds.forEach((g,i)=>drawGoldMini(82+i*8,3,g.taken?'got':g.ghost?'ghost':'empty',g.flash));
  txt('SCOR '+pad(G.score,6),W/2,4,'#fff',1,'c');
  txt(TEST?(LEVELS[G.level].arena?'ARENĂ':'TEST '+levelTag(G.level)):'NIVEL '+levelTag(G.level),262,4,'#9fe8ff');
  txt('TIMP '+pad(G.time,3),W-5,4,(G.time<=100&&(G.t>>4)%2)?'#ff5050':'#fff',1,'r');
  drawBossBar();
}
