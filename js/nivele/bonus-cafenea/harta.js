'use strict';
// ================= NIVELUL BONUS — POPAS LA MESOCAFÉ: harta =================
// Nivelul BONUS — POPAS LA MESOCAFÉ: la începutul iernii, între Lac și Pădurea de brazi. Scurt (puțin mai scurt decât
// primul nivel), liniștit: fără punct de salvare, fără blocuri cu power-up și fără trepte de piatră; doar câțiva
// ucenici, două iazuri mici înghețate, bănuți și blocuri cu bănuți. La mijloc e căsuța MesoCafé: în fața ușii apeși ↑
// și intri în cafenea (vezi CAFENEAUA), unde te așteaptă un curcan bătrânel și blocul-slot. Pe drumul spre
// MESOPOTAMIA are o steluță în loc de bulină, iar numerotarea nivelurilor îl sare.
LEVELS.push({id:'bonus',theme:6,song:'winter',bonus:true,tip:'TE AȘTEPT LA CAFENEA, FIULE! APASĂ ↑ LA UȘĂ.',build(){const m=newMap(168);m.g(0,142);   // sol până lângă camera cafenelei (fără gol cu apă)
  // Bănuții: exact 50 cu totul (împreună cu cei 6 din blocurile M), puși ca să te poarte prin nivel: un rând după
  // blocurile de la început, un arc pe drumul săriturii peste primul iaz, două scânduri în trepte înainte de
  // cafenea (sus, o răsplată pentru cine urcă), o grămadă după cafenea, blocuri cu câte un bănuț deasupra fiecăruia,
  // o boltă peste copca celui de-al doilea iaz și un rând spre tăbliță. Cu 50 de bănuți primești o viață.
  // arc: n bănuți de la x0 la x1, cu capetele pe rândul bot și mijlocul pe rândul top (pot fi și jumătăți de tile).
  const arc=(x0,x1,top,bot,n)=>{for(let i=0;i<n;i++){const t=i/(n-1),u=2*t-1;m.coins.push([x0+(x1-x0)*t,top+(bot-top)*u*u]);}};
  m.r(10,8,'MBMBM');                                                               //  3 (în blocuri)
  m.c(20,9,5);                                                                     //  5 →  8
  m.e('boy',24);
  // Primul iaz înghețat: mic și fără copcă, de încercat gheața; arcul de bănuți merge de pe un mal pe altul.
  m.lake(36,41);arc(34.5,42.5,7,10,7);                                             //  7 → 15
  // Două scânduri în trepte: 3 bănuți pe cea de jos, 4 pe cea de sus.
  m.r(45,9,'===');m.c(45,8,3);                                                     //  3 → 18
  m.r(50,6,'====');m.c(50,5,4);                                                    //  4 → 22
  // Căsuța MesoCafé la mijloc (tile-urile 60-65); camera ei e la 143-167. Fără punct de salvare: nivelul e scurt.
  m.cafe(60,143);
  m.c(70,9,5);m.c(70,10,5);                                                        // 10 → 32 (grămada)
  m.e('boy',82);
  m.r(87,8,'BMMMB');m.c(87,6,5);                                                   //  3 + 5 → 40
  // Al doilea iaz: o copcă mică la mijloc, cu o boltă de 5 bănuți chiar peste ea (îi iei sărind copca).
  m.lake(103,111);m.pit(106,107);arc(104.5,108.5,7,9,5);                           //  5 → 45
  m.e('boy',116);
  m.c(118,9,5);                                                                    //  5 → 50
  m.goal('sign',128);
  return m.done();}});
