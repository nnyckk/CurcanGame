'use strict';
// ===== CURCANII PRINȘI: cine sunt, ce spun =====
// Câte unul în fiecare nivel normal
const CAPT_INFO=[
  {id:'ferma',name:'DOAMNA GLU-GLU',line:'VAI, CE CAVALER! NE VEDEM LA MESOPOTAMIA, DRAGĂ!'},
  {id:'noapte',name:"CONU' GUȘĂLAN",line:'MULȚUMESC, TINERE! FERMIERII N-AU MANIERE. NE VEDEM LA MESOPOTAMIA!'},
  {id:'lac',name:'NENEA PENEL',line:'URA, SUNT LIBER! TE AȘTEPT LA MESOPOTAMIA!'},
  {id:'padure',name:'NENEA ȚEPOȘEL',line:'MUSTAȚA MEA ȚI-E DATOARE, TINERE! NE VEDEM LA MESOPOTAMIA!'},
  {id:'iarna',name:'TANTI PUFOAICA',line:'BRRR! MERSI, PUIȘORULE! NE ÎNCĂLZIM ÎMPREUNĂ LA MESOPOTAMIA!'},
];
// Moș Curcan, la final: după câți ai salvat
const CAPT_NUM=['','UN PRIETEN','DOI PRIETENI','TREI PRIETENI','PATRU PRIETENI'];
function captEndLine(n,all){
  if(!n)return 'SINGUR, FIULE? PE VREMEA MEA NU LĂSAM PE NIMENI ÎN COLIVIE!';
  if(n>=all)return 'TOȚI AICI! AZI CAFEAUA E DIN PARTEA CASEI. MDA... DOAR AZI.';
  return CAPT_NUM[n]+'! BINE, BINE... DAR AUD ÎNCĂ GLU-GLU-URI DIN PĂDURE.';
}
// După ce e liber: vorbește cu tine când apeși sus lângă el
const CAPT_TALK=[
  ['CE PENE FRUMOASE AI, DRAGĂ! MAI ALES COADA.','?AM AUZIT CĂ LÂNGĂ UN DEAL E UN BLOC PE CARE NU-L VEZI.',
    '?O PANĂ STĂ SUS DE TOT, PESTE O GROAPĂ. CURAJ!','?CĂRĂMIZILE LE SPARGI DOAR CÂND EȘTI MARE, PUIULE.'],
  ['UN CURCAN CU MANIERE NU FUGE... DECÂT DE FERMIERI.','?ÎN CAPĂTUL DIN STÂNGA AL FERMEI SE ASCUNDE CEVA.',
    'NOAPTEA, FELINARUL TE TRĂDEAZĂ. STAI ÎN UMBRĂ, TINERE.','?DE PE DEALUL DIN SPATE AJUNGI FOARTE SUS. ȘTIU, AM MONOCLU.'],
  ['SCÂNDURILE CRĂPATE ȚIN CÂT ZICI GLU. SARI REPEDE!','?LA ÎNCEPUTUL UNEI INSULE AM VĂZUT CEVA SCLIPIND ÎN AER.',
    '?SUS, PESTE APĂ, E O PANĂ. EU NU ZBOR, TU POATE DA.','AI SĂRITURI BUNE PENTRU UN CURCAN. EU MĂ ÎNEC ȘI ÎN BALTĂ.'],
  ['AM CALCULAT: GHEAȚA CRAPĂ REPEDE. NU STA PE LOC.','?DEASUPRA UNUI BLOC DIN MIJLOC LIPSEȘTE CEVA... SAU NU SE VEDE.',
    '?PE LACUL CEL MARE, BLOCURILE DE SUS ASCUND UN SECRET.','MUSTAȚA MEA E NATURALĂ, SĂ ȘTII.'],
  ['ÎMBRACĂ-TE GROS, PUIȘORULE! E FRIG RĂU.','?LÂNGĂ O TREAPTĂ AM SIMȚIT UN BLOC INVIZIBIL. BRRR.',
    '?FERMIERUL-ȘEF ARE O STIVĂ DE FÂN... CINE ȘTIE CE E ÎN EA.','CE CURCAN VOINIC AI AJUNS! MĂNÂNCI BINE.'],
];
// Prima replică: câte pene mai sunt; ? = indiciu, doar cât mai ai pene de găsit
function captChat(i,k){
  const n=golds.filter(g=>!g.taken&&!g.ghost).length;
  const l=[!n?'AI GĂSIT TOATE PENELE DE AUR DE AICI. BRAVO!':n===1?'MAI E O PANĂ DE AUR ASCUNSĂ PE AICI.':`MAI SUNT ${n} PENE DE AUR ASCUNSE PE AICI.`]
    .concat(CAPT_TALK[i].filter(t=>n||t[0]!=='?').map(t=>t.replace(/^[?]/,'')));
  return l[k%l.length];
}
