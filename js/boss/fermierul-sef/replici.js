'use strict';
// ================= FERMIERUL-ȘEF: ce spune (și bustul din caseta de dialog) =================
// Bustul Fermierului-Șef pentru caseta de dialog: desenul lui, încruntat, cu furca ținută drept în sus (ca în drawBoss),
// făcut o singură dată. Tăietura (coloanele 3-24, rândurile 0-19) prinde pălăria, fața, barba și pieptul.
let BOSS_BUST=null;
function bossBust(){
  if(BOSS_BUST)return BOSS_BUST;
  const [c,g]=mkCanvas(28,31);g.drawImage(BOSS.A.r,0,0);
  const R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},RO=(x,y,w,h,col)=>{R(x-1,y-1,w+2,h+2,'#1a1020');R(x,y,w,h,col);};
  bossFace(R,'angry',false);
  R(22,2,2,27,'#7a5230');R(20,1,7,1,'#6a6e7a');for(const o of [-3,0,3])R(23+o,-4,1,5,'#c8ccd8');
  bossSleeve(R,20,15,2,6,'#c8302a','#ece6d8');RO(21,21,2,2,'#f0b088');
  return BOSS_BUST=c;
}
// Ce îți spune Fermierul-Șef când îl vezi prima dată (după ce cad baloții de fân în spatele tău, înainte să răcnească).
// O singură dată pe joc: dacă pierzi o viață și te întorci, nu mai vorbește (vezi G.bossMet).
const BOSS_HELLO=['STAI PE LOC, CURCANULE! DE AICI NU MAI SCAPI!',
  'TE-AM FUGĂRIT PRIN TOATĂ FERMA, PRIN PĂDURE ȘI PRIN ZĂPADĂ!',
  'VREI LA RESTAURANT? AJUNGI, NU-ȚI FACE GRIJI... PE MENIU!'];
