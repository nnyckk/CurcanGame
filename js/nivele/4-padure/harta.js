'use strict';
// ===== NIVELUL 4 — PĂDUREA DE BRAZI: harta =====
// Nivelul 4 — pădurea de brazi, iarna: zăpadă
LEVELS.push({id:'padure',theme:1,song:'winter',tip:'PE GHEAȚĂ NU STA PE LOC, FIULE. CRAPĂ!',build(){const m=newMap(506);m.g(0,465);
  m.c(3,10,3);m.r(7,8,'BMBHB');m.c(8,5,3);
  // Deal dublu înainte de primul lac
  m.hill(16,[2,2,2,2]);m.back(19,[4,4,4,4]);m.e('boy',20,7);m.e('bomb',24);
  // Lacul 1: deja cu o copcă
  m.lake(27,36);m.pit(31,32);m.c(28,10,3);m.c(33,10,3);
  // Adâncitură mică între fermieri
  m.e('man',42);m.dip(45,47);m.c(45,12,3);m.e('man',50);m.e('bomb',52);
  m.st(55,3,1);m.r(60,8,'BMB');m.sp(63,2);
  // Lacul 2: două copci, platformă cu bănuți
  m.lake(68,87);m.pit(76,78);m.pit(83,84);m.r(72,8,'====');m.c(72,7,4);m.c(80,10,2);
  m.e('man',90);
  // Peștera: intri la 94 (pământ crăpat), ieși la 219, înainte de dealul dublu
  const a=466;m.under(94,219,a,40,{ceil:4,pit:[14,17],fall:[7,19],pool:[24,27],gems:[9,22,['L',9],['R',8]]});
  m.c(a+5,10,3);m.f(a+8,10,4,2,'D');m.c(a+8,9,4);   // movilă
  m.c(a+14,8);m.c(a+15,7,2);m.c(a+17,8);   // groapa cu țepi: sari peste
  m.r(a+20,8,'BMB');m.c(a+20,6,3);m.e('boy',a+25);   // blocuri, apoi balta
  m.f(a+29,9,4,3,'D');   // a doua movilă
  m.colivie(a+31,9);   // colivia: pe a doua movilă
  m.r(103,8,'BHB');m.e('man',109);m.e('bomb',114);
  // Lacul 3: două copci late, platforme deasupra
  m.lake(119,142);m.pit(125,127);m.pit(134,136);m.r(122,8,'===');m.r(130,7,'BMMB');m.e('boy',131,6);m.c(122,7,3);m.c(138,10,3);
  m.pana(104,4,'hidden');   // pana 1: invizibilă, deasupra blocului din mijloc al BHB
  m.cp(145);   // punctul de salvare 1
  m.e('bomb',150);m.r(152,8,'BBMBB');m.e('man',156);
  m.sp(161,2);
  // Lacul 4: o copcă sub blocuri
  m.lake(165,180);m.pit(172,173);m.c(167,10,4);m.c(176,10,4);m.r(170,8,'BMB');
  m.e('man',184);m.e('man',188);m.dip(192,194);m.c(192,12,3);m.e('bomb',197);m.e('man',200);
  m.hill(203,[2,2,3,3,2]);m.c(203,8,5);   // deal mic
  // ——— A doua jumătate
  m.r(212,8,'BMB');m.e('man',214);
  // Deal dublu: fermier și bombă pe cel din față
  m.hill(225,[1,2,3,3,3,3,3,3,3,3,3]);m.back(231,[5,5,5,5,5,5]);m.e('bomb',229,8);m.e('man',233,8);m.c(232,5,4);
  m.sp(240,3);m.e('bomb',246);
  // Lacul 5: o copcă lată și un fermier pe malul celălalt
  m.lake(252,263);m.pit(256,258);m.c(253,10,2);m.c(260,10,3);
  m.e('man',266);m.dip(269,271);m.c(269,12,3);m.e('bomb',274);
  m.r(278,8,'BMBMB');m.c(279,4,3);
  m.cp(290);   // punctul de salvare 2
  // LACUL CEL MARE: două copci late
  m.lake(296,341);m.pit(310,312);m.pit(326,328);
  m.r(300,9,'===');m.r(314,9,'===');m.e('boy',315,8);m.r(330,9,'===');
  m.r(304,6,'BBMMBB');m.e('man',306,5);m.c(305,5,2);
  m.r(318,6,'BMBBMB');m.e('man',321,5);m.r(319,2,'BMB');
  m.pana(320,1);   // pana 2: deasupra blocurilor de sus

  m.r(334,6,'BBMBBB');m.e('bomb',337,5);m.c(335,5,2);
  m.c(298,10,2);m.c(320,10,4);m.c(336,10,4);
  m.e('man',345);m.hill(348,[2,2,2,2,2]);m.e('bomb',350,9);m.e('man',355);
  // Lacul 6: blocuri deasupra unei copci
  m.lake(360,367);m.pit(364,365);m.r(362,8,'BMB');m.c(361,10,3);
  m.sp(371,3);
  m.hill(376,[1,2,3,4,4,3,2,1]);m.c(379,6,2);   // deal în pantă
  m.e('man',386);m.e('man',391);m.dip(395,397);m.c(395,12,3);m.e('bomb',399);m.e('man',402);
  m.r(405,8,'BBMBB');
  // Lacul 7: o copcă lată la mijloc
  m.lake(412,425);m.pit(418,420);m.c(414,10,3);m.c(422,10,3);
  m.r(413,8,'B B');m.pana(414,8,'brick');   // pana 3: în cărămidă
  m.e('man',430);m.e('bomb',435);m.e('man',438);
  m.c(442,10,5);
  m.goal('sign',452);
  return m.done();}});
