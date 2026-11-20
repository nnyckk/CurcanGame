'use strict';
// ===== DESEN: HUD =====
const KEY_PIX=[".lgd.","lg.gd","lg.gd",".ggd.","..g..","..gdd","..g..","..gd."];   // cheia mică din HUD
function drawHUD(){
  ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(0,0,W,15);
  ctx.drawImage(headImg(),6,3);txt('X'+G.lives,16,4,'#fff');
  ctx.drawImage(COIN,40,2);txt('X'+pad(G.coins,2),54,4,'#ffd23f');
  // Penele de aur din nivel: aurii cele luate acum
  golds.forEach((g,i)=>drawGoldMini(82+i*8,3,g.taken?'got':g.ghost?'ghost':'empty',g.flash));
  // Cheia coliviei, cât o peniță: umbră până o iei
  const kx=82+golds.length*8+2;
  if(G.hasKey)drawPix(KEY_PIX,kx,3);
  else if(cage&&cage.st==='locked')icon(KEY_PIX.map(r=>r.replace(/[^.]/g,'#')),kx,3,'#4a4466');
  txt('SCOR '+pad(G.score,6),W/2,4,'#fff',1,'c');
  txt(TEST?(LEVELS[G.level].arena?'ARENĂ':'TEST '+levelTag(G.level)):'NIVEL '+levelTag(G.level),262,4,'#9fe8ff');
  txt('TIMP '+pad(G.time,3),W-5,4,(G.time<=100&&(G.t>>4)%2)?'#ff5050':'#fff',1,'r');
  drawBossBar();
}
