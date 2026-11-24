'use strict';
// ===== MINI-JOCUL DIN CAFENEA: BLOCURILE LUI MOȘ =====
// 5 blocuri cu note (N în hartă), pe rândul 7; Moș le aprinde într-o ordine, tu le lovești la fel
const NOTE_TX=[6,8,10,12,14],NOTE_TY=7,NOTE_ROUNDS=3;   // coloanele (față de cameră); runde de 3, 4, 5 blocuri
const NOTE_COL=['#ff5a5a','#ffa020','#ffe040','#5ad05a','#5aa0ff'],NOTE_MIDI=[72,74,76,79,81];
const NOTE_ON=26,NOTE_GAP=12;   // cât stă aprins un bloc când îl arată Moș, pauza dintre ele
const NOTE_PIX=['..###','..#.#','..#.#','.##.#','###..','.#...'];   // nota de pe bloc
function noteSfx(i){if(!AC)return;const t=AC.currentTime;tone('pulse',mtof(NOTE_MIDI[i]),t,0.26,0.13,sfxG);tone('triangle',mtof(NOTE_MIDI[i]-12),t,0.26,0.1,sfxG);}
// Blocurile în hartă: solide, desenate de noi
function notesPlace(c,on){for(const x of NOTE_TX)grid[NOTE_TY][c.a+x]=on?'N':'.';}
function notesStart(c){
  // Ordinea întreagă de la început: fiecare rundă e începutul ei, cu un bloc în plus; nu același bloc de două ori la rând
  const seq=[];for(let k=0;k<2+NOTE_ROUNDS;k++){let b;do b=Math.random()*5|0;while(b===seq[k-1]);seq.push(b);}
  c.mg={ph:'talk',t:0,seq,round:0,i:0,step:0,lit:[0,0,0,0,0],litCol:['','','','',''],bump:[-1,-1,-1,-1,-1]};
  openTalk(['ASCULTĂ ȘI ȚINE MINTE, FIULE! APOI CÂNT-O ȘI TU, CU CAPUL ÎN BLOCURI.']);
}
const notesLen=m=>3+m.round;
function noteLight(m,i,col,t){m.lit[i]=t;m.litCol[i]=col;}
function updateNotes(c){
  const m=c.mg;if(!m)return;m.t++;
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
    // Premiul: după câte runde ai trecut
    c.res=m.round>=NOTE_ROUNDS?SLOT_2UP:m.round>=1?(Math.random()<0.5?SLOT_FIRE:SLOT_ICE):SLOT_NONE;slotPrize();m.ph='done';}
}
// Lovit cu capul (din hitBlock)
function noteHit(tx,ty){
  const c=cafe;if(!c||!inCafe())return;const i=NOTE_TX.indexOf(tx-c.a),m=c.mg;if(i<0)return;
  if(m)m.bump[i]=0;
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
  const m=c.mg,off=c.done&&(!m||m.ph==='done');
  for(let i=0;i<5;i++){
    const x=x0+NOTE_TX[i]*TS,y=NOTE_TY*TS-(m&&m.bump[i]>=0?BUMPY[m.bump[i]]:0),on=m&&m.lit[i]>0,col=on?m.litCol[i]:null;
    const P=(px,py,w,h,cl)=>{ctx.fillStyle=cl;ctx.fillRect(x+px,y+py,w,h);};
    if(on)glow(x+8,y+8,22,col==='#5aff7a'?'90,255,120':col==='#ff3a3a'?'255,60,60':'255,230,160',0.55);
    P(0,0,16,16,'#3a2010');P(1,1,14,14,on?col:off?'#6a4a30':'#9a6030');P(1,1,14,2,on?'#ffffff':'#b07840');P(1,13,14,2,'#00000040');
    P(1,1,2,14,on?'#ffffffa0':'#b0784080');
    const nc=on?'#2a1a10':NOTE_COL[i];ctx.globalAlpha=off?0.4:1;
    NOTE_PIX.forEach((r,j)=>{for(let k=0;k<r.length;k++)if(r[k]==='#')P(5+k,5+j,1,1,nc);});ctx.globalAlpha=1;
  }
}
