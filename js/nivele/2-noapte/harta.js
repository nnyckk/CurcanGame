'use strict';
// ================= NIVELUL 2 — NOAPTEA LA FERMĂ: harta =================
// Nivelul 2 — ferma noaptea: fermierii cu felinar te văd doar în conul de lumină din fața lor,
// așa că traseul are locuri unde te poți strecura prin spatele lor (dâmburi, platforme deasupra ta, iazuri).
// Ucenicii (fără felinar, nu te caută) sunt amestecați printre ei; fermierii cu felinar păstrează locurile de strecurat.
// De două ori fermierul are ucenicul în spatele lui (106/112 și 174/186).
LEVELS.push({id:'noapte',theme:3,song:'night',tip:'NOAPTEA, FERMIERII VĂD DOAR CE LE LUMINEAZĂ FELINARUL.',build(){const m=newMap(220);m.g(0,219);
  m.c(6,10,3);m.r(11,8,'BMBHB');m.c(12,5,3);
  m.e('boy',24);
  m.st(30,3,1);m.pit(33,36);m.c(33,8,4);m.st(37,3,-1);
  m.e('man',44);m.sp(50,2);
  m.f(54,10,8,2,'D');m.e('man',58,9);m.r(55,6,'BMB');
  m.pit(64,67);m.r(64,8,'====');m.c(64,7,4);
  m.e('bomb',72);m.e('boy',78);
  m.r(82,8,'======');m.c(83,7,4);m.e('man',85,7);
  m.r(83,4,'B B');m.pana(84,4,'brick');                                            // pana 1: în cărămidă, deasupra fermierului
  m.cp(96);
  m.r(100,8,'BHB');m.e('man',106);m.e('boy',112);
  m.st(117,4,1);m.pit(121,124);m.c(121,6,4);m.st(125,4,-1);
  m.e('bomb',132);m.sp(136,2);m.e('boy',142);
  m.f(147,9,6,3,'D');m.e('man',150,8);
  m.pana(154,5);                                                                   // pana 2: la marginea dâmbului, peste groapă
  m.pit(155,168);m.r(157,9,'===');m.r(162,7,'====');m.c(157,8,3);m.c(162,6,4);
  m.e('man',174);m.e('bomb',180);m.e('boy',186);
  m.c(190,10,6);
  m.pana(199,8,'hidden');                                                          // pana 3: invizibilă, înainte de tăbliță
  m.goal('sign',204);
  return m.done();}});
