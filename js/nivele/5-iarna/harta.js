'use strict';
// ===== NIVELUL 5 — NOAPTE DE IARNĂ: harta =====
// Nivelul 5 — NOAPTE DE IARNĂ: pădurea de brazi noaptea
LEVELS.push({id:'iarna',theme:5,song:'winter',tip:'MESOPOTAMIA E APROAPE. DAR NU EȘTI SINGUR PE DRUM, FIULE...',build(){const m=newMap(266);m.g(0,265);
  m.c(6,10,3);m.r(11,8,'BMBHB');m.c(12,5,3);
  m.e('boy',21);
  // Lacul 1: o copcă
  m.lake(26,35);m.pit(30,31);m.c(27,10,3);m.c(32,10,3);
  m.e('man',41);m.st(47,3,1);m.c(47,8,3);
  // Lacul 2: două copci și o scândură între ele
  m.lake(52,69);m.pit(57,59);m.pit(64,65);m.r(60,8,'====');m.c(60,7,4);m.c(53,10,3);
  m.e('man',74);m.e('bomb',79);
  // Un dâmb cu un fermier sus
  m.f(84,9,7,3,'D');m.e('man',88,8);m.c(85,7,3);
  m.pana(87,4);   // pana 1: deasupra dâmbului
  m.sp(95,2);
  m.cp(104);m.c(101,10,4);   // punctul de salvare
  // ——— A doua jumătate
  m.r(108,8,'BHB');
  m.r(108,4,'B B');m.pana(109,4,'brick');   // pana 2: în cărămidă
  m.e('boy',114);m.e('man',120);m.e('boy',126);
  // Lacul 3: copci late, scânduri sus
  m.lake(131,150);m.pit(136,138);m.pit(145,146);m.r(133,8,'====');m.r(140,6,'====');m.e('boy',141,5);m.c(133,7,4);m.c(140,5,4);
  m.e('man',155);m.e('bomb',160);
  // Un iaz înghețat între două trepte mici
  m.st(165,2,1);m.lake(167,174);m.pit(170,171);m.st(175,2,-1);m.c(167,10,3);m.c(172,10,2);
  m.e('man',184);m.e('man',190);
  // Lacul 4: o copcă la mijloc, blocuri deasupra
  m.lake(196,209);m.pit(201,203);m.r(199,8,'BMB');m.c(197,10,3);m.c(205,10,3);
  m.cp(211);   // punctul de salvare de dinaintea boss-ului
  // Chiar înainte de boss
  m.r(213,8,'BAB');m.c(212,5,5);
  // Poiana boss-ului
  m.lake(224,234);m.r(225,8,'===');m.r(231,8,'===');
  m.boss(237,218,241);
  m.pana(241,9,'boss');   // pana 3: în stiva de fân din dreapta
  m.goal('restaurant',245);
  return m.done();}});
