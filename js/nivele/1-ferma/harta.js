'use strict';
// ===== NIVELUL 1 — FERMA: harta =====
LEVELS.push({id:'ferma',theme:0,tip:'GRĂUNTELE AURIU TE FACE MARE, FIULE!',build(){const m=newMap(210);m.g(0,209);
  // Primul nivel e de învățat
  m.c(6,10,3);m.r(12,8,'BMBHB');m.c(13,5,3);
  m.e('boy',22);
  m.st(27,4,1);m.pit(31,33);m.c(31,6,3);m.st(34,2,-1);
  // Deal dublu, cu ucenici pe el
  m.hill(41,[2,2,2,2,2,2]);m.back(45,[4,4,4,4,4,4,4,4,4]);
  m.e('boy',42,9);m.e('boy',50,7);m.c(48,6,4);
  m.e('bomb',60);
  m.r(64,8,'BMBMB');m.c(65,4,3);m.e('boy',66,7);
  m.e('boy',72);
  m.pit(77,80);m.c(77,9);m.c(78,8,2);m.c(80,9);   // arc de săritură
  m.f(83,9,6,3,'D');m.e('boy',86,8);
  m.pana(89,9,'hidden');   // pana 1: invizibilă, lipită de deal, la nivelul lui
  m.cp(93);
  m.c(96,10,5);m.r(96,8,'BMHMB');
  // Un deal mare, cu un pasaj pe dedesubt și bănuți în el
  m.e('boy',101);m.hill(103,[4,4,4,4,4,4,4,4,4,4,4]);m.tunnel(103,10,11,2);m.tunnel(105,9,7,1);m.e('boy',108,7);m.c(111,7,3);   // bănuții: sus pe deal, nu lângă colivie
  m.colivie(108);   // colivia: în pasajul de sub deal
  m.e('bomb',115);m.sp(118,2);
  m.st(122,4,1);m.pit(126,128);m.c(126,6,3);m.st(129,4,-1);
  m.pana(127,3);   // pana 2: sus peste groapă
  m.e('man',138);m.e('bomb',143);m.r(140,8,'BBMBB');
  m.r(141,4,'B B');m.pana(142,4,'brick');   // pana 3: în cărămida din mijloc
  m.pit(149,162);m.r(151,9,'====');m.r(157,7,'====');m.c(151,8,4);m.c(157,6,4);
  m.sp(167,2);m.e('bomb',172);m.e('man',174);
  // Deal dublu: unul mic în față, unul mare în spate
  m.hill(177,[2,2,2,2,2,2]);m.back(180,[4,4,4,4,4,4,4]);m.c(182,7,4);
  m.goal('sign',196);
  return m.done();}});
