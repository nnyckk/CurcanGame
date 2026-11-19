'use strict';
// ===== NIVELUL 3 — LACUL: harta =====
// Nivelul 3 — LACUL: ferma ziua
LEVELS.push({id:'lac',theme:4,tip:'SCÂNDURILE CRĂPATE NU TE ȚIN MULT. NU STA PE ELE!',build(){const m=newMap(350);m.g(0,349);
  // Primul ecran e tot pe pământ
  m.c(5,10,3);m.r(9,8,'BMBHB');m.c(10,5,3);
  // Deal dublu spre mal: de sus sari pe prima scândură
  m.hill(15,[2,2,2,2,2]);m.back(18,[4,4,4,4,4]);m.c(15,9,3);m.c(19,7,3);
  m.pit(25,322);   // lacul
  // ——— Prima parte: scânduri și insule
  m.r(26,10,'====');m.c(26,9,4);
  // Bănuții
  m.r(32,9,'====');m.c(30,7,2);
  m.isl(38,43,9);m.e('boy',41,8);m.c(39,7,3);
  m.r(46,8,'===');m.c(46,7,3);
  m.r(51,9,'====');
  m.isl(57,63,9);m.e('bomb',61,8);m.r(59,5,'BMB');
  // Platforma care se mișcă pe orizontală
  m.mv(66,9,3,'x',6,240);m.c(70,7,3);
  m.r(78,9,'====');
  m.mv(85,5,3,'y',4,220);m.c(85,3,3);
  m.r(91,5,'=====');m.e('boy',93,4);m.c(92,3,3);
  // Primul șir de platforme care cad, coborând spre mal
  m.fall(99,6,2);m.fall(103,7,2);m.fall(107,8,2);m.fall(111,9,2);m.c(99,4,2);m.c(103,5,2);m.c(107,6,2);m.c(111,7,2);
  m.isl(115,128,11);m.cp(120);m.c(117,9,3);m.r(122,7,'BHB');   // punctul de salvare 1
  m.f(124,11,3,1,'.');m.c(124,11,3);   // mică adâncitură
  m.pana(116,8,'hidden');   // pana 1: invizibilă, la începutul insulei
  // ——— A doua parte
  m.r(131,9,'====');m.e('bomb',133,8);
  m.mv(137,8,3,'x',8,300);m.c(140,6,4);
  m.pana(149,2);   // pana 2: sus, peste apă
  m.isl(150,157,8);m.e('man',154,7);
  m.fall(160,7,2);m.fall(164,6,2);m.fall(168,5,2);m.c(160,5,2);m.c(164,4,2);m.c(168,3,2);
  m.r(172,6,'=====');m.r(173,3,'BMB');
  // Două platforme care urcă și coboară pe rând
  m.mv(179,6,3,'y',4,220,0);m.mv(185,6,3,'y',4,220,0.5);m.c(182,7,3);m.c(179,4,3);m.c(185,4,3);
  m.r(191,8,'====');m.e('boy',192,7);
  m.mv(198,9,5,'x',6,320);m.e('boy',200,8);m.c(204,7,4);   // ucenicul de pe platforma care se mișcă
  m.fall(212,8,2);m.fall(216,9,2);m.c(212,6,2);m.c(216,7,2);
  m.isl(220,233,12);m.cp(225);m.c(222,10,4);   // punctul de salvare 2
  m.hill(227,[2,2,2,2]);m.back(229,[4,4,4,4,4]);m.e('boy',231,7);   // deal dublu, ucenicul sus
  // ——— A treia parte
  m.r(236,9,'===');
  m.mv(241,7,3,'x',7,260);m.c(244,5,4);
  m.isl(253,262,8);m.e('man',256,7);m.e('bomb',260,7);
  m.r(256,4,'B B');m.pana(257,4,'brick');   // pana 3: în cărămidă
  m.fall(265,7,2);m.fall(269,6,2);m.c(265,5,2);m.c(269,4,2);
  m.mv(273,4,3,'y',5,240);m.c(273,2,3);
  m.fall(279,5,2);m.fall(283,6,2);m.fall(287,7,2);m.c(279,3,2);m.c(283,4,2);m.c(287,5,2);
  m.r(291,6,'=====');m.r(292,3,'BHB');m.e('boy',294,5);
  m.mv(299,9,3,'x',10,360);m.c(303,7,5);
  m.r(314,9,'===');m.fall(319,9,2);
  // Malul de la final
  m.hill(323,[2,2,2,1]);m.c(323,9,3);m.c(328,10,3);m.e('man',331);   // mal în pantă spre final
  m.goal('sign',334);
  return m.done();}});
