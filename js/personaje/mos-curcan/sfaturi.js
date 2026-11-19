'use strict';
// ===== MOȘ CURCAN: sfaturile dintre niveluri și ce ține minte =====
// Sfaturile de pe ecranul de dinaintea nivelului
const TIPS={
  all:['ȚINE APĂSAT SPACE ȘI SARI MAI SUS.','ȚINE APĂSAT X ȘI FUGI MAI REPEDE.','STRÂNGE BĂNUȚII, FIULE: LA 50 PRIMEȘTI O VIAȚĂ.',
    'SARI PE BOMBĂ, APOI ÎMPINGE-O SPRE FERMIERI!','BOMBELE EXPLODEAZĂ, FIULE. NU STA LÂNGĂ ELE.',
    'FERMIERII ÎMPUNG CU FURCA. NU-I LĂSA SĂ SE APROPIE.','UCENICII NU TE URMĂRESC. SUNT PREA LENEȘI.',
    'CURCANII NU ÎNOATĂ, FIULE. NICI MĂCAR EU.','TIMPUL CARE ÎȚI RĂMÂNE SE FACE PUNCTE.','FEREȘTE-TE DE ȚEPI, FIULE. ÎNȚEAPĂ!',
    'FII CU OCHII ÎN PATRU, FIULE. DACĂ VEZI PĂMÂNT CRĂPAT, SARI ȘI LOVEȘTE-L CU ↓...'],
  // Penele de aur
  gold:['ÎN FIECARE NIVEL SE ASCUND 3 PENE DE AUR. CAUTĂ BINE, FIULE!','O PANĂ DE AUR E A TA ABIA CÂND AJUNGI CU EA LA FINAL.',
    'NU TOATE CĂRĂMIZILE SUNT DOAR CĂRĂMIZI...','ADUNĂ TOATE PENELE DE AUR, FIULE. MERITĂ.'],
  fire:['BOABA ROȘIE ÎȚI DĂ PENE DE FOC.','APASĂ SCURT X ȘI ARUNCI O PANĂ DE FOC.'],
  night:['STRECOARĂ-TE PE LA SPATELE FERMIERILOR, FIULE.','UCENICII N-AU FELINAR. NICI PREA MULTĂ MINTE.'],
  snow:['PE GHEAȚĂ ALUNECI. FRÂNEAZĂ DIN TIMP!','SARI PESTE COPCILE CU STEGULEȚ ROȘU.','AFINA ÎNGHEȚATĂ ÎȚI DĂ PENE DE GHEAȚĂ.',
    'UN FERMIER ÎNGHEȚAT SE POATE ÎMPINGE, FIULE.','FERMIERII NU CALCĂ PE GHEAȚĂ. SUNT FRICOȘI.','EXPLOZIILE SPARG GHEAȚA. ȚINE MINTE!'],
  level:{0:['LOVEȘTE BLOCURILE M CU CAPUL, FIULE.'],2:['UNELE PLATFORME SE MIȘCĂ. AȘTEAPTĂ-LE!'],
    3:['LA MINE ÎN CAFENEA TIMPUL STĂ PE LOC. VINO SĂ TE ODIHNEȘTI!','AM UN BLOC MARE ÎN CAFENEA. VEI VEDEA...'],
    4:['PĂDUREA E LUNGĂ, FIULE: ARE DOUĂ STEAGURI DE SALVARE.'],
    5:['INTRĂ PE UȘA RESTAURANTULUI ȘI AI SCĂPAT!','FERMIERUL-ȘEF OBOSIT? SARI-I ÎN CAP!']},
};
// ---- Ce ține minte Moș Curcan ----
// De la un joc la altul: de câte ori ai pornit jocul
const MOS_KEY=TEST?'curcan_mos_test':'curcan_mos';
let MOS={plays:0,deaths:0,best:0,last:0,wins:0,cafe:0,slot:-1,boss:false};   // last = până unde ai ajuns în jocul trecut
try{Object.assign(MOS,JSON.parse(localStorage.getItem(MOS_KEY)||'{}'));}catch(e){}
function mosSave(){try{localStorage.setItem(MOS_KEY,JSON.stringify(MOS));}catch(e){}}
const MOS_SLOT=['PANA DE FOC','AFINA ÎNGHEȚATĂ','DOUĂ VIEȚI','UN X'];
// Ce i-ar veni lui Moș Curcan să-ți spună acum
function mosLines(first){
  const out=[],i=G.level,def=LEVELS[i];
  if(!first){
    const d=G.lastDeath;
    if(d==='water')out.push('CURCANII NU ÎNOATĂ, FIULE. ȚI-AM MAI SPUS-O.','APA E RECE ȘI ADÂNCĂ. SARI MAI DIN TIMP!');
    else if(d==='pit')out.push('GROPILE ALEA N-AU FUND, FIULE. UITĂ-TE PE UNDE CALCI.');
    else if(d==='time')out.push('AI STAT PREA MULT LA POVEȘTI. TIMPUL TRECE, FIULE!');
    else out.push('TE-AU PRINS. SE MAI ÎNTÂMPLĂ, DAR NU PREA DES, BINE?','UN CURCAN ÎNȚELEPT NU SE BATE CU FURCA.');
    if(G.lvlDeaths>=3)out.push('IAR AICI, FIULE? RESPIRĂ ADÂNC ȘI MAI ÎNCEARCĂ O DATĂ.','ȘI EU AM CĂZUT DE MULTE ORI AICI. PE VREMEA MEA...');
    if(G.lives===1)out.push('ȚI-A MAI RĂMAS O SINGURĂ VIAȚĂ. AI GRIJĂ DE EA!');
    return out;
  }
  // La începutul jocului
  if(i===0&&MOS.plays>1){
    if(MOS.wins>0)out.push(MOS.wins>1?`AI AJUNS DE ${MOS.wins} ORI LA MESOPOTAMIA. MAI POȚI O DATĂ?`:'AI MAI AJUNS O DATĂ LA MESOPOTAMIA. MAI POȚI?');
    else if(MOS.last>0)out.push(`IAR LA DRUM, FIULE? DATA TRECUTĂ AI AJUNS PÂNĂ LA NIVELUL ${levelTag(MOS.last)}.`);
    else out.push('IAR LA DRUM, FIULE? DE DATA ASTA AJUNGI MAI DEPARTE, SIMT EU.');
  }
  // Penele de aur din nivelul ăsta: câte ai găsit
  const n=goldCounts()[i]||0,f=n?goldFoundIn(i):0;
  if(n&&f===n)out.push('AICI AI GĂSIT DEJA TOATE PENELE DE AUR. BRAVO, FIULE!');
  else if(n&&f>0)out.push(`AICI AI GĂSIT ${f===1?'O PANĂ':f+' PENE'} DE AUR. MAI ${n-f===1?'E UNA':'SUNT '+(n-f)}.`);
  // După cafenea: ce ți-a ieșit la blocul
  if(i>0&&LEVELS[i-1].bonus){const s=G.slotUsed&&G.slotUsed.level===i-1?G.slotUsed.res:-1;
    if(s===SLOT_FIRE)out.push('CUM ÎȚI MERGE CU PANA DE FOC? AI GRIJĂ SĂ NU-ȚI ARZI COADA!');
    else if(s===SLOT_ICE)out.push('AFINA ÎNGHEȚATĂ E BUNĂ PRIN PĂDURE. AI ALES BINE, FIULE.');
    else if(s===SLOT_2UP)out.push('CU DOUĂ VIEȚI ÎN PLUS AJUNGI DEPARTE. NU LE RISIPI!');
    else if(s===SLOT_NONE)out.push('UN X LA BLOC? NU-I NIMIC, MĂCAR CAFEAUA A FOST BUNĂ.');
    else if(G.cafeSeen)out.push('AI PLECAT FĂRĂ SĂ ÎNCERCI BLOCUL MEU? PĂCAT, FIULE.');
    else out.push('N-AI TRECUT PE LA CAFENEA? DATA VIITOARE TE AȘTEPT.');}
  // Înaintea cafenelei, dacă ai mai fost la el
  if(def.bonus&&MOS.cafe>0)out.push(MOS.slot>=0?`DATA TRECUTĂ AI LUAT ${MOS_SLOT[MOS.slot]} DE LA BLOC. VII IAR?`:'TE MAI AȘTEPT LA O CAFEA, FIULE. ȘTII DRUMUL.');
  // Înaintea boss-ului, dacă l-ai mai întâlnit
  if(def.id==='iarna'&&MOS.boss)out.push('FERMIERUL-ȘEF TE ȚINE MINTE, FIULE. ȘI FURCA LUI LA FEL.');
  return out;
}
function pickTip(first){
  const def=LEVELS[G.level],th=THEMES[def.theme],gold=(goldCounts()[G.level]||0)>0;
  // Ce ține minte
  const mem=mosLines(first).filter(t=>t!==G.tip);
  if(mem.length&&Math.random()<(first?0.6:0.75))return mem[Math.random()*mem.length|0];
  const own=[def.tip,...(TIPS.level[G.level]||[]),...(th.night?TIPS.night:[]),...(th.snow?TIPS.snow:[]),...(gold?TIPS.gold:[])].filter(Boolean);
  const all=own.concat(TIPS.all,th.snow?[]:TIPS.fire);
  const pool=(first||Math.random()<0.4?own:all).filter(t=>t!==G.tip);
  return pool.length?pool[Math.random()*pool.length|0]:def.tip;
}
