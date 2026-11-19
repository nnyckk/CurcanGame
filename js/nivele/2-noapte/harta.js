'use strict';
// ===== NIVELUL 2 — NOAPTEA LA FERMĂ: harta =====
// Nivelul 2 — ferma noaptea
LEVELS.push({id:'noapte',theme:3,song:'night',tip:'NOAPTEA, FERMIERII VĂD DOAR CE LE LUMINEAZĂ FELINARUL.',build(){const m=newMap(248);m.g(0,219);
  m.c(6,10,3);m.r(11,8,'BMBHB');m.c(12,5,3);
  m.pana(0,8,'hidden');   // pana 1: invizibilă, în capătul din stânga al nivelului
  m.e('boy',24);
  m.st(30,3,1);m.pit(33,36);m.c(33,8,4);m.st(37,3,-1);
  // Peștera de sub pământ: cazi în gaură, ieși sărind din cealaltă, chiar înainte de punctul de salvare
  const a=222;m.under(44,93,a,26,{fall:[8,18],pool:[5,7],gems:[12,20,['L',9],['R',9]],skel:[[9,1],[24,-1]]});m.e('man',51);
  // Bănuții: 3 în arc peste baltă, 4 pe movilă, 3 lângă peretele din dreapta și 2 în puțul de ieșire
  const C=(i,y)=>m.c(a+i,y);[[5,10],[6,9],[7,10],[24,9],[24,10],[24,11],[22,6],[23,6]].forEach(([i,y])=>C(i,y));
  m.r(a+11,9,'H');m.pana(a+10,9,'brick');   // pana 2: în cărămida de lângă bloc
  m.f(a+13,7,3,1,'D');m.f(a+14,11,4,1,'D');m.c(a+14,10,4);m.e('bomb',a+19);   // un singur bloc, cu putere
  m.pit(64,67);m.r(64,8,'====');m.c(64,7,4);
  m.e('bomb',72);m.e('boy',78);
  m.r(82,8,'BBMBBB');m.c(83,7,4);m.e('man',85,7);
  m.cp(96);
  // Trei dealuri în trepte: mic în față, mare în spate, și unul și mai mare, cu blocurile sus
  // Trei dealuri: mic în față, la mijloc; mijlociu în dreapta; mare în stânga (pe cel mare ajungi doar de pe cel mijlociu)
  m.hill(104,[2,2,2,2,2]);m.back(107,[4,4,4,4,4,4]);m.far(101,[7,7,7,7,7,7,7]);m.r(102,2,'BHB');m.e('man',109,7);m.c(104,8,3);m.c(107,6,4);m.e('boy',116);
  m.hill(119,[1,2,3,4]);m.pit(123,126);m.c(123,6,4);m.hill(127,[4,3,2,1]);
  m.e('bomb',134);m.sp(138,2);m.e('boy',143);
  // Dâmb în față, deal mare în spate: de pe el ajungi la pană
  m.f(147,9,6,3,'D');m.e('man',150,8);m.back(150,[6,6,6,6,6]);
  m.pana(153,2);   // pana 3: sus, deasupra dealului din spate (săritură întreagă)
  m.pit(155,168);m.r(157,9,'===');m.r(162,7,'====');m.c(157,8,3);m.c(162,6,4);
  m.e('man',174);m.e('bomb',180);
  // Un deal mic înainte de final, cu ucenicul sus
  m.hill(186,[2,3,3,3,3,2]);m.e('boy',189,8);
  m.c(193,10,6);
  m.goal('sign',204);
  return m.done();}});
