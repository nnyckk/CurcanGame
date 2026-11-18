'use strict';
// ===== MOȘ CURCAN: ce spune în cafenea =====
const CAFE_HELLO=['BINE AI VENIT LA MESOCAFÉ, FIULE!','OBOSIT DE ATÂTA FUGĂ?','ODIHNEȘTE-TE PUȚIN DIN AVENTURA TA.',
  'LA BLOCUL MARE AI O SINGURĂ ÎNCERCARE: LOVEȘTE-L FIX CÂND ARATĂ CE VREI!'];
const CAFE_REACT=['PANĂ DE FOC! O SĂ-ȚI ÎNCĂLZEASCĂ IARNA!','AFINĂ ÎNGHEȚATĂ! RĂCOROASĂ CA UN FRAPPE!',
  'DOUĂ VIEȚI! AZI E ZIUA TA NOROCOASĂ!','NIMIC... NU-I BAI, CAFEAUA E DIN PARTEA CASEI!'];
const CAFE_BYE='DRUM BUN SPRE MESOPOTAMIA!';
// Dacă ai mai fost la el în alt joc, te ține minte
function cafeHello(){
  if(MOS.cafe<=1)return CAFE_HELLO;
  const l=['IAR TU, FIULE? BINE AI REVENIT LA MESOCAFÉ!'];
  if(MOS.slot>=0)l.push(`DATA TRECUTĂ AI LUAT ${MOS_SLOT[MOS.slot]} DE LA BLOC.`);
  return l.concat(CAFE_HELLO[CAFE_HELLO.length-1]);
}
// Dacă tot dai cu capul în blocul-slot gol
const CAFE_BONK=['HEI, FIULE! BLOCUL E GOL, NU MAI DA CU CAPUL ÎN EL!','MAI ÎNCET, CĂ-MI STRICI CAFENEAUA! ABIA AM ZUGRĂVIT-O!',
  'GATA, ȚI-O TREC PE NOTĂ: O CAFEA ȘI UN TAVAN NOU!'];
const CAFE_BONK_MORE=['CE CAP TARE AI... SEMENI CU MAICĂ-TA.','LASĂ BLOCUL ÎN PACE ȘI BEA-ȚI CAFEAUA!',
  'AUZI CUM SCÂRȚÂIE GRINDA? NU MAI SĂRI!','CURCANII DE AZI... PE VREMEA MEA BĂTEAM DIN ARIPI!'];
function cafeBonk(){
  const c=cafe;if(!c||!inCafe())return;
  const n=++c.bonks;
  if(n>=30)achUnlock('cap');   // CAP TARE
  // Camera se zgâlțâie de la prima lovitură
  G.shake=Math.max(G.shake,n>=7?6:4);
  if(n>5)for(let i=0;i<12;i++)c.dust.push({x:c.a*TS+CAFE_L+4+Math.random()*(CAFE_R-CAFE_L-8),t:Math.floor(Math.random()*60)});
  // Replica a câta: la a 5-a lovitură, la a 10-a
  const j=n===5?0:n>=10&&(n-10)%7===0?1+(n-10)/7:-1;
  if(j>=0)openTalk([j<CAFE_BONK.length?CAFE_BONK[j]:CAFE_BONK_MORE[(j-CAFE_BONK.length)%CAFE_BONK_MORE.length]]);
}
// Ce îți spune dacă îl mai întrebi: cum merge blocul-slot
const cafeLine=()=>cafe.done?CAFE_BYE:'DĂ CU CAPUL ÎN BLOC FIX CÂND ARATĂ CE-ȚI DOREȘTI!';
