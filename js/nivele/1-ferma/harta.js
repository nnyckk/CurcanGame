'use strict';
// ===== NIVELUL 1 — FERMA: harta =====
LEVELS.push({id:'ferma',theme:0,tip:'GRĂUNTELE AURIU TE FACE MARE, FIULE!',build(){const m=newMap(210);m.g(0,209);
  // Primul nivel e de învățat
  m.c(6,10,3);m.r(12,8,'BMBHB');m.c(13,5,3);
  m.e('boy',22);
  m.st(27,4,1);m.pit(31,33);m.c(31,6,3);m.st(34,2,-1);
  m.sp(41,3);m.c(41,8,3);
  m.r(48,8,'======');m.c(49,7,4);m.e('boy',51,7);
  m.e('bomb',60);
  m.r(64,8,'BMBMB');m.c(65,4,3);
  m.e('boy',72);
  m.pit(77,80);m.c(77,9,4);
  m.f(83,10,6,2,'D');m.e('boy',86,9);
  m.pana(85,6,'hidden');   // pana 1: invizibilă
  m.cp(93);
  m.c(96,10,5);m.r(97,8,'MHM');
  m.e('boy',102);m.e('boy',108);
  m.e('bomb',114);m.sp(118,2);
  m.st(122,4,1);m.pit(126,128);m.c(126,6,3);m.st(129,4,-1);
  m.pana(127,3);   // pana 2: sus peste groapă
  m.e('man',138);m.e('bomb',143);m.r(140,8,'BBMBB');
  m.r(141,4,'B B');m.pana(142,4,'brick');   // pana 3: în cărămida din mijloc
  m.pit(149,162);m.r(151,9,'====');m.r(157,7,'====');m.c(151,8,4);m.c(157,6,4);
  m.sp(167,2);m.e('bomb',172);m.e('man',177);
  m.c(182,10,6);
  m.goal('sign',196);
  return m.done();}});
