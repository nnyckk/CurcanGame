'use strict';
// ===== MINI-JOCUL DIN CAFENEA: BLOCURILE LUI MOȘ =====
// 5 blocuri cu note (N în hartă), pe rândul 7; Moș le aprinde într-o ordine, tu le lovești la fel
const NOTE_TX=[6,8,10,12,14],NOTE_TY=7,NOTE_ROUNDS=3;   // coloanele (față de cameră); runde de 3, 4, 5 blocuri
const NOTE_COL=['#ff5a5a','#ffa020','#ffe040','#5ad05a','#5aa0ff'],NOTE_MIDI=[72,74,76,79,81];
const NOTE_ON=26,NOTE_GAP=12,NOTE_DX=3;   // NOTE_DX: blocurile desenate cu 3 px mai la dreapta   // cât stă aprins un bloc când îl arată Moș, pauza dintre ele
const NOTE_PIX=['..#####','..#...#','..#...#','..#...#','.##..##','###.###','.#...#.'];   // nota de pe bloc: două optimi legate
function noteSfx(i){if(!AC)return;const t=AC.currentTime;tone('pulse',mtof(NOTE_MIDI[i]),t,0.26,0.13,sfxG);tone('triangle',mtof(NOTE_MIDI[i]-12),t,0.26,0.1,sfxG);}
// Blocurile în hartă: solide, desenate de noi
function notesPlace(c,on){for(const x of NOTE_TX)grid[NOTE_TY][c.a+x]=on?'N':'.';}
function notesStart(c,pre){
  // Ordinea întreagă de la început: fiecare rundă e începutul ei, cu un bloc în plus; același bloc poate veni de mai multe ori la rând
  const seq=[];for(let k=0;k<2+NOTE_ROUNDS;k++)seq.push(Math.random()*5|0);
  c.mg={ph:'talk',t:0,seq,round:0,i:0,step:0,lit:[0,0,0,0,0],litCol:['','','','',''],bump:[-1,-1,-1,-1,-1]};
  openTalk((pre||[]).concat(['DAU MUZICA MAI ÎNCET, SĂ AUZI BINE. ASCULTĂ ȘI ȚINE MINTE, FIULE! APOI CÂNT-O ȘI TU, CU CAPUL ÎN BLOCURI.']));
}
const notesLen=m=>3+m.round;
function noteLight(m,i,col,t){m.lit[i]=t;m.litCol[i]=col;}
// Starea blocurilor cât cânți liber, înainte de joc
const NOTES_FREE_N=10;
const notesFree=c=>c.fp||(c.fp={n:0,lit:[0,0,0,0,0],litCol:['','','','',''],bump:[-1,-1,-1,-1,-1]});
function updateNotes(c){
  const m=c.mg;
  if(!m){const f=c.fp;if(f)for(let i=0;i<5;i++){if(f.lit[i]>0)f.lit[i]--;if(f.bump[i]>=0&&++f.bump[i]>=BUMPY.length)f.bump[i]=-1;}return;}
  m.t++;
  // Muzica mai încet cât ține jocul
  const duck=m.ph!=='talk'&&m.ph!=='done';if(!!G.duck!==duck){G.duck=duck;applyAudio();}
  for(let i=0;i<5;i++){if(m.lit[i]>0)m.lit[i]--;if(m.bump[i]>=0&&++m.bump[i]>=BUMPY.length)m.bump[i]=-1;}
  if(m.ph==='talk'){if(!G.talk){m.ph='show';m.t=-30;m.i=0;}return;}
  // Moș arată ordinea: fiecare bloc se aprinde cu nota lui
  if(m.ph==='show'){
    if(m.t>=0&&m.t%(NOTE_ON+NOTE_GAP)===0){
      if(m.i<notesLen(m)){const b=m.seq[m.i++];noteLight(m,b,NOTE_COL[b],NOTE_ON);noteSfx(b);}
      else{m.ph='input';m.step=0;m.t=0;popup('RÂNDUL TĂU!',c.npcX+OLD_W/2,CAFE_FLOOR*TS-OLD_H-12,'#ffd23f');}}
    return;}
  if(m.ph==='next'){if(m.t>=50){m.round++;m.ph='show';m.t=0;m.i=0;}return;}
  if(m.ph==='end'&&m.t===40){
    // Premiul: doar dacă ai trecut toate rundele
    c.res=m.round>=NOTE_ROUNDS?(Math.random()<0.1?SLOT_2UP:Math.random()<0.5?SLOT_FIRE:SLOT_ICE):SLOT_NONE;slotPrize();m.ph='done';}   // doar toate rundele: 10% 2 vieți, altfel foc/gheață
}
// Lovit cu capul (din hitBlock)
function noteHit(tx,ty,down){   // down: aterizat de sus, blocul se lasă în jos
  const c=cafe;if(!c||!inCafe())return;const i=NOTE_TX.indexOf(tx-c.a),m=c.mg;if(i<0)return;
  // Înainte de joc: cânți liber, fiecare bloc cu nota și culoarea lui
  if(!m&&!c.done){const f=notesFree(c);f.bump[i]=0;f.dn=f.dn||[];f.dn[i]=!!down;noteLight(f,i,NOTE_COL[i],18);noteSfx(i);
    if(++f.n>=NOTES_FREE_N)notesStart(c,['GATA CU EXERSATUL, FIULE! HAI ACUM SĂ JUCĂM.']);   // după 10 note, Moș pornește jocul
    return;}
  if(m){m.bump[i]=0;m.dn=m.dn||[];m.dn[i]=!!down;}
  if(!m||m.ph!=='input'){sfx.bump();return;}
  if(m.seq[m.step]===i){
    noteLight(m,i,'#5aff7a',18);noteSfx(i);m.step++;
    if(m.step>=notesLen(m)){
      if(m.round+1>=NOTE_ROUNDS){m.round++;m.ph='end';m.t=0;sparkle(tx*TS+8,ty*TS);}
      else{m.ph='next';m.t=0;popup('BRAVO! RUNDA '+(m.round+2),c.npcX+OLD_W/2,CAFE_FLOOR*TS-OLD_H-12,'#7fff7f');}}
  }else{noteLight(m,i,'#ff3a3a',40);sfx.nope();m.ph='end';m.t=0;}
}
function notesTalk(c){
  if(c.done){openTalk([CAFE_BYE]);return;}
  if(!c.mg){notesStart(c);return;}
  if(c.mg.ph==='input')openTalk(['LOVEȘTE BLOCURILE ÎN ORDINEA ÎN CARE LE-AM APRINS, FIULE.']);
}
// Blocurile: maro, cu nota colorată; aprinse cu culoarea lor, verde sau roșu
function drawNotes(cx){
  const c=cafe,x0=Math.round(c.a*TS-cx);if(x0>W||x0+CAFE_W*TS<0)return;
  const m=c.mg||c.fp,off=c.done&&(!c.mg||c.mg.ph==='done');
  for(let i=0;i<5;i++){
    const x=x0+NOTE_TX[i]*TS+NOTE_DX,y=NOTE_TY*TS-(m&&m.bump[i]>=0?BUMPY[m.bump[i]]*(m.dn&&m.dn[i]?-1:1):0),on=m&&m.lit[i]>0,col=on?m.litCol[i]:null;
    const P=(px,py,w,h,cl)=>{ctx.fillStyle=cl;ctx.fillRect(x+px,y+py,w,h);};
    if(on)glow(x+8,y+8,22,[1,3,5].map(k=>parseInt(col.slice(k,k+2),16)).join(','),0.55);
    P(0,0,16,16,'#3a2010');P(1,1,14,14,on?col:off?'#6a4a30':'#9a6030');P(1,1,14,2,on?'#ffffff':'#b07840');P(1,13,14,2,'#00000040');
    P(1,1,2,14,on?'#ffffffa0':'#b0784080');
    const nc=on?'#2a1a10':NOTE_COL[i];ctx.globalAlpha=off?0.4:1;
    NOTE_PIX.forEach((r,j)=>{for(let k=0;k<r.length;k++)if(r[k]==='#')P(4+k,5+j,1,1,nc);});ctx.globalAlpha=1;
  }
}
