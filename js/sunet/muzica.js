'use strict';
// ===== MUZICA: melodiile și sequencer-ul =====
// --- Music sequencer
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function P(str){return str.trim().split(/\s+/).map(t=>{if(t==='-')return 0;if(t==='.')return -1;const m=t.match(/^([A-G])(b|#)?(\d)$/);return 12*(+m[3]+1)+NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);});}
function bassBars(bars){const out=[];for(const b of bars)for(let h=0;h<2;h++){const r=b[h]??b[0];for(let e=0;e<4;e++)out.push(e%2?r+12:r,0);}return out;}
// Piesa cafenelei e în swing: 3 pași pe timp
function walkBass(bars){const out=[];for(const b of bars)for(const n of b)out.push(n,0,0);return out;}
function chordTrack(bars){const out=[];for(const bar of bars){const a=new Array(12).fill(0);for(const [st,n,d] of bar)a[st]={n,d};out.push(...a);}return out;}
// Acordurile, fără fundamentală
const JZ={F:[57,60,64,67],D7:[54,57,60,64],Gm:[58,62,65,69],C7:[58,62,64,69],Am:[55,60,64,67],Bb:[57,62,65,69],Bbm:[56,61,65,68],Eb7:[55,58,61,65]};
// Ritmul acordurilor
const comp1=c=>[[0,JZ[c],2],[5,JZ[c],7]],comp2=(a,b)=>[[0,JZ[a],5],[6,JZ[b],6]];
const SONGS={
  main:{bpm:120,loop:true,drums:'k.h.s.h.k.khs.h.',
    lead:P(`D5 - A4 - Bb4 A4 G4 - F#4 - G4 A4 Bb4 - A4 -
            G4 - F#4 - Eb4 - D4 - F#4 - A4 - D5 - - -
            Eb5 - D5 - C5 - Bb4 - A4 - Bb4 C5 D5 - A4 -
            Bb4 A4 G4 F#4 G4 - A4 - D4 - - - . . . .
            A4 A4 D5 - A4 A4 Eb5 - D5 C5 Bb4 A4 Bb4 - A4 -
            G4 G4 Bb4 - G4 G4 C5 - Bb4 A4 G4 F#4 G4 - - -
            F#4 G4 A4 Bb4 A4 G4 F#4 Eb4 D4 - F#4 - A4 - C5 -
            Bb4 - A4 - G4 - F#4 - D4 - - - . . . .`),
    bass:bassBars([[38],[43,38],[39],[36,38],[38],[43],[39,36],[38,45]])},
  title:{bpm:100,loop:true,drums:'k...h...s...h.h.',
    lead:P(`D4 F#4 A4 D5 Eb5 - D5 - A4 - F#4 - G4 - A4 -
            Bb4 A4 G4 F#4 Eb4 - F#4 - D4 - - - . . . .
            D5 - Eb5 - F#5 - Eb5 D5 C5 - D5 - Bb4 - A4 -
            G4 A4 Bb4 A4 G4 F#4 Eb4 F#4 D4 - - - . . . .`),
    bass:bassBars([[38],[39,38],[38],[43,38]])},
  // Noaptea la fermă: aceeași gamă, dar o octavă mai jos
  night:{bpm:92,loop:true,leadType:'triangle',leadVol:0.17,drums:'k.......h...h...',
    lead:P(`D4 - - - A3 - - - Bb3 - A3 - G3 - - -
            F#3 - - - G3 - A3 - Bb3 - - - A3 - - -
            D4 - - - Eb4 - D4 - C4 - Bb3 - A3 - - -
            G3 - A3 - Bb3 - A3 - G3 - F#3 - D3 - - -
            A3 - - - D4 - - - Eb4 - D4 - C4 - - -
            Bb3 - C4 - D4 - - - A3 - - - . . . .
            G3 - - - Bb3 - A3 - G3 - F#3 - Eb3 - - -
            D3 - - - - - - - . . . . . . . .`),
    bass:bassBars([[38],[43,38],[39],[36,38],[38],[43],[39,36],[38,45]])},
  // Iarna în pădurea de brazi: aceeași gamă, dar sus
  winter:{bpm:104,loop:true,leadType:'sine',leadVol:0.13,leadMax:3,drums:'k...h.h.h...h.h.',
    lead:P(`D5 - F#5 - A5 - G5 F#5 Eb5 - D5 - A4 - - -
            Bb4 - D5 - G5 - F#5 Eb5 D5 - C5 - D5 - - -
            D5 - F#5 - A5 - D6 - C6 - Bb5 - A5 - - -
            G5 F#5 Eb5 - D5 - C5 - D5 - - - . . . .
            A5 - G5 - F#5 - G5 - A5 - Bb5 - A5 - - -
            G5 - F#5 - Eb5 - F#5 - D5 - - - . . . .
            Bb4 - C5 - D5 - Eb5 - F#5 - G5 - A5 - - -
            G5 - F#5 - Eb5 - C5 - D5 - - - . . . .`),
    bass:bassBars([[38],[46,45],[38],[43,38],[45],[43],[46,48],[38]])},
  // MesoCafe: jazz lent și liniștit, în Fa major, în swing
  cafe:{bpm:66,loop:true,leadType:'triangle',leadVol:0.18,bassVol:0.36,chordVol:0.055,drums:'q..R.rr..R.r',
    lead:P(`. . . . . C5 E5 - - D5 - C5     A4 - - - - . F#4 - A4 C5 - -
            Bb4 - - - - A4 Bb4 - D5 F5 - -   E5 - - - - . D5 - C5 Bb4 - G4
            A4 - - - - . . . E4 G4 - C5      B4 - - A4 - F#4 A4 - - - - .
            . . D5 F5 - E5 D5 - Bb4 G4 - E4  F4 - - - - - - - . . . C5
            D5 - - - - C5 D5 - F5 A5 - -     Ab5 - - - - F5 G5 - F5 Db5 - -
            C5 - - - - . E5 - D5 C5 - A4     C5 - - - - . A4 - B4 C5 - D5
            F5 - - - - D5 Bb4 - - - - .      . . G4 Bb4 - D5 E5 - D5 C5 - Bb4
            A4 - - - - C5 A4 - - F#4 - -     G4 - - - - . E4 - G4 Bb4 - .`),
    bass:walkBass([[41,45,48,49],[50,48,45,42],[43,45,46,47],[48,46,45,43],[45,48,52,51],[50,48,45,44],[43,50,48,40],[41,45,48,45],
      [46,50,53,47],[46,49,51,46],[45,48,52,51],[50,42,45,44],[43,46,50,49],[48,46,43,40],[41,45,50,44],[43,50,48,40]]),
    chords:chordTrack([comp1('F'),comp1('D7'),comp1('Gm'),comp1('C7'),comp1('Am'),comp1('D7'),comp2('Gm','C7'),comp1('F'),
      comp1('Bb'),comp2('Bbm','Eb7'),comp1('Am'),comp1('D7'),comp1('Gm'),comp1('C7'),comp2('F','D7'),comp2('Gm','C7')])},
  // Lupta cu Fermierul-Șef: aceeași gamă, rapid și apăsat
  boss:{bpm:152,loop:true,drums:'k.hsk.hsk.hsk.ss',
    lead:P(`D5 - D5 Eb5 D5 - C5 - D5 - A4 - - - - -
            D5 - D5 Eb5 F#5 - Eb5 - D5 - - - . . . .
            G5 - F#5 - Eb5 - D5 - C5 - D5 - Eb5 - - -
            D5 C5 Bb4 A4 Bb4 - A4 - G4 - F#4 - D4 - - -
            A4 - A4 Bb4 A4 - G4 - F#4 - G4 - A4 - - -
            Bb4 - Bb4 C5 Bb4 - A4 - G4 - A4 - Bb4 - - -
            D5 - Eb5 - F#5 - G5 - A5 - G5 - F#5 - Eb5 -
            D5 - - - A4 - - - D5 - - - . . . .`),
    bass:bassBars([[38],[38,39],[43,42],[38],[45],[46,45],[38,43],[38,45]])},
  // Peștera: lent, rece și gol, cu ecou; o inimă care bate și vânt prin galerii
  cave:{bpm:56,loop:true,echo:true,leadType:'sine',leadVol:0.12,bassVol:0.2,drums:'k..k....w.......k..k......p.....',
    lead:P(`D4 - - - - - - - . . . . F4 - - -
            E4 - - - - - Bb3 - - - - - . . . .
            A3 - - - - - - - . . . . C4 - C#4 -
            D4 - - - - - - - - - - - . . . .
            F4 - - - E4 - - - D4 - - - G#3 - - -
            A3 - - - - - - - . . . . . . . .
            D5 - - - - - . . C#5 - - - - - . .
            A4 - - - - - - - - - - - . . . .`),
    bass:P(`D2 - - - - - - - - - - - - - - - Bb1 - - - - - - - - - - - - - - -
           A1 - - - - - - - - - - - - - - - D2 - - - - - - - - - - - - - - -
           G1 - - - - - - - - - - - - - - - A1 - - - - - - - - - - - - - - -
           Bb1 - - - - - - - - - - - - - - - A1 - - - - - - - - - - - - - - -`)},
  clear:{bpm:190,loop:false,drums:'k...k...k.......',lead:P('D5 F#5 A5 D6 - - A5 D6 - - - - - - - -'),bass:P('D3 - - - - - A2 D3 - - - - - - - -')},
  death:{bpm:170,loop:false,drums:'',lead:P('A4 Bb4 A4 G4 F#4 Eb4 D4 - - - - - . . . .'),bass:P('D3 - - - - - D2 - - - - - . . . .')},
  gameover:{bpm:120,loop:false,drums:'',lead:P('D5 - - A4 - - F#4 - - Eb4 - - D4 - - - - - - - . . . .'),bass:P('D3 - - - - - - - - Eb2 - - D2 - - - - - - - . . . .')},
  win:{bpm:170,loop:false,next:'title',drums:'k.h.s.h.k.h.s.h.',
    lead:P('D5 D5 D5 - A4 - D5 - F#5 - - - A5 - - - G5 F#5 Eb5 F#5 D5 - - - A5 - - - D6 - - - - - - - . . . .'),
    bass:bassBars([[38],[43,39],[38]])},
};
const seq={song:null,step:0,next:0,pending:null};
function playSong(n){if(!AC){seq.pending=n;return;}seq.song=SONGS[n];seq.step=0;seq.next=AC.currentTime+0.06;}
function stopSong(){seq.song=null;seq.pending=null;}
function sched(){
  if(!AC||!seq.song)return;
  if(seq.next<AC.currentTime-0.2)seq.next=AC.currentTime+0.05;
  while(seq.song&&seq.next<AC.currentTime+0.15){
    const s=seq.song,sd=60/s.bpm/4,i=seq.step,out=s.echo?echoIn:musicG;   // echo: piesa trece prin ecoul de peșteră
    if(!s.loop&&i>=s.lead.length){seq.song=null;if(s.next)playSong(s.next);break;}
    const li=i%s.lead.length,L=s.lead[li];
    if(L>0){let n=1;while(n<16&&s.lead[(li+n)%s.lead.length]===0&&(s.loop||li+n<s.lead.length))n++;if(s.leadMax)n=Math.min(n,s.leadMax);tone(s.leadType||'pulse',mtof(L),seq.next,sd*n*0.95,s.leadVol||0.1,out);}
    if(s.bass&&s.bass.length){const bi=i%s.bass.length,B=s.bass[bi];if(B>0){let n=1;while(n<16&&s.bass[(bi+n)%s.bass.length]===0)n++;tone('triangle',mtof(B),seq.next,sd*n*0.9,s.bassVol||0.3,out);}}
    // Acordurile: {n: notele, d: câți pași țin}
    if(s.chords){const c=s.chords[i%s.chords.length];if(c)for(const m of c.n)tone('sine',mtof(m),seq.next,sd*c.d,s.chordVol||0.04,out);}
    if(s.drums){const d=s.drums[i%s.drums.length],t=seq.next;
      if(d==='k')tone('sine',160,t,0.12,0.5,out,40);
      else if(d==='s')noise(t,0.12,0.22,out,1800);
      else if(d==='h')noise(t,0.03,0.1,out,7000);
      // Peștera: vânt înfundat și o picătură
      else if(d==='w')noise(t,1.4,0.07,out,380,'lowpass');
      else if(d==='p')tone('sine',1300,t,0.08,0.05,out,600);
      // Jazz: r = ride, R = ride + perie pe tobă
      else if(d==='r'||d==='R'||d==='q'){noise(t,0.22,0.06,out,6500);
        if(d==='R')noise(t,0.16,0.1,out,2600,'bandpass');
        if(d==='q')tone('sine',105,t,0.16,0.26,out,52);}}
    seq.step++;seq.next+=sd;
  }
}
setInterval(sched,25);
