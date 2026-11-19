'use strict';
// ===== NIVELUL BONUS — POPAS LA MESOCAFÉ: harta =====
// Nivelul BONUS — POPAS LA MESOCAFÉ: la începutul iernii
LEVELS.push({id:'bonus',theme:6,song:'winter',bonus:true,tip:'TE AȘTEPT LA CAFENEA, FIULE! APASĂ ↑ LA UȘĂ.',build(){const m=newMap(168);m.g(0,142);   // sol până lângă camera cafenelei
  // Bănuții: exact 50 cu totul
  const arc=(x0,x1,top,bot,n)=>{for(let i=0;i<n;i++){const t=i/(n-1),u=2*t-1;m.coins.push([x0+(x1-x0)*t,top+(bot-top)*u*u]);}};
  m.r(10,8,'MBMBM');   // 3
  m.hill(19,[2,2,2,2,2]);m.c(19,9,5);   // deal mic; 5 → 8
  m.e('boy',24);
  // Primul iaz înghețat: mic și fără copcă
  m.lake(36,41);arc(34.5,42.5,7,10,7);   // 7 → 15
  // Două scânduri în trepte: 3 bănuți pe cea de jos
  m.r(45,9,'===');m.c(45,8,3);   // 3 → 18
  m.r(50,6,'====');m.c(50,5,4);   // 4 → 22
  // Căsuța MesoCafé la mijloc
  m.cafe(60,143);
  m.c(70,9,5);m.c(70,10,5);   // 10 → 32
  m.e('boy',82);
  m.hill(94,[2,2,2,2]);m.back(97,[4,4,4,4]);   // deal dublu înainte de iaz
  m.r(87,8,'BMMMB');m.c(87,6,5);   // 3 + 5 → 40
  // Al doilea iaz: o copcă mică la mijloc
  m.lake(103,111);m.pit(106,107);arc(104.5,108.5,7,9,5);   // 5 → 45
  m.e('boy',116);
  m.hill(118,[2,2,2,2,2]);m.c(118,9,5);   // deal mic; 5 → 50
  m.goal('sign',128);
  return m.done();}});
