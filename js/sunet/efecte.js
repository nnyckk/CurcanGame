'use strict';
// ===== SUNET: Web Audio și efectele sonore =====
let AC=null,master,musicG,sfxG,noiseBuf,pulseW,pulse12,echoIn;
function mkPulse(d){const n=32,re=new Float32Array(n),im=new Float32Array(n);for(let k=1;k<n;k++)re[k]=2/(k*Math.PI)*Math.sin(k*Math.PI*d);return AC.createPeriodicWave(re,im);}
function initAudio(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  master=AC.createGain();master.gain.value=0.55;master.connect(AC.destination);
  musicG=AC.createGain();musicG.connect(master);
  // Ecoul de peșteră: sunetul se repetă, tot mai încet și mai înfundat
  echoIn=AC.createGain();echoIn.connect(musicG);
  const dl=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter();dl.delayTime.value=0.42;fb.gain.value=0.5;lp.type='lowpass';lp.frequency.value=1600;
  echoIn.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(musicG);
  sfxG=AC.createGain();sfxG.connect(master);
  applyAudio();
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  pulseW=mkPulse(0.25);pulse12=mkPulse(0.125);
  if(seq.pending){const p=seq.pending;seq.pending=null;playSong(p);}
}
const mtof=m=>440*Math.pow(2,(m-69)/12);
let SFX_K=1;   // cât de tare (1 = lângă tine), pentru sunetele mobilor
function tone(type,f,t,dur,vol,dest,f2){
  if(dest===sfxG)vol*=SFX_K;
  const o=AC.createOscillator(),g=AC.createGain();
  if(type==='pulse')o.setPeriodicWave(pulseW);else if(type==='pulse12')o.setPeriodicWave(pulse12);else o.type=type;
  o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.006);
  g.gain.exponentialRampToValueAtTime(Math.max(vol*0.35,0.0002),t+dur*0.85);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g).connect(dest);o.start(t);o.stop(t+dur+0.03);
}
function noise(t,dur,vol,dest,freq,type='highpass'){
  if(dest===sfxG)vol*=SFX_K;
  const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;
  const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f).connect(g).connect(dest);s.start(t,Math.random()*0.5);s.stop(t+dur+0.02);
}
function arp(notes,step,vol,type='pulse'){if(!AC)return;const t=AC.currentTime;notes.forEach((n,i)=>tone(type,mtof(n),t+i*step,step*1.6,vol,sfxG));}
const sfx={
  jump(){if(!AC)return;tone('pulse',260,AC.currentTime,0.15,0.13,sfxG,640);},
  coin(){if(!AC)return;const t=AC.currentTime;tone('pulse',988,t,0.07,0.11,sfxG);tone('pulse',1319,t+0.07,0.22,0.11,sfxG);},
  stomp(){if(!AC)return;const t=AC.currentTime;tone('square',520,t,0.13,0.12,sfxG,110);noise(t,0.08,0.18,sfxG,900);},
  bump(){if(!AC)return;tone('triangle',190,AC.currentTime,0.1,0.35,sfxG,80);},
  brk(){if(!AC)return;const t=AC.currentTime;noise(t,0.28,0.35,sfxG,900,'lowpass');tone('square',160,t,0.12,0.08,sfxG,60);},
  hurt(){if(!AC)return;tone('sawtooth',720,AC.currentTime,0.35,0.12,sfxG,110);},
  boom(){if(!AC)return;const t=AC.currentTime;noise(t,0.8,0.6,sfxG,1100,'lowpass');tone('sine',150,t,0.6,0.5,sfxG,30);},
  grow(){arp([60,67,72,64,71,76,67,74,79,72,79,84],0.04,0.1);},
  shrink(){arp([84,79,72,79,74,67,76,71,64,72,67,60],0.035,0.1);},
  oneup(){arp([76,79,88,84,86,91],0.08,0.1);},
  sprout(){arp([62,66,69,74],0.04,0.08,'triangle');},
  tick(){if(!AC)return;tone('square',1500,AC.currentTime,0.025,0.05,sfxG);},
  fuse(){if(!AC)return;noise(AC.currentTime,0.25,0.12,sfxG,3500);},
  cp(){arp([69,74,78,81,86],0.06,0.1);},
  // Pana de aur: o scară strălucitoare care urcă
  gold(){arp([79,83,86,91,95,98],0.055,0.1,'triangle');arp([91,98,103],0.09,0.06);},
  // Achievement deblocat: o mică fanfară care urcă
  ach(){arp([72,76,79,84,88],0.07,0.1,'triangle');arp([84,91],0.16,0.07);},
  alert(){if(!AC)return;const t=AC.currentTime;tone('square',880,t,0.05,0.07,sfxG);tone('square',1175,t+0.06,0.09,0.07,sfxG);},
  windup(){if(!AC)return;tone('triangle',150,AC.currentTime,0.16,0.2,sfxG,110);},
  stab(){if(!AC)return;const t=AC.currentTime;noise(t,0.14,0.22,sfxG,2200);tone('square',240,t,0.1,0.07,sfxG,760);},
  fireUp(){arp([67,71,74,79,74,79,83,86,83,86,91],0.04,0.1);},
  fwip(){if(!AC)return;const t=AC.currentTime;noise(t,0.1,0.12,sfxG,3000);tone('pulse',600,t,0.08,0.07,sfxG,1500);},
  splash(){if(!AC)return;const t=AC.currentTime;noise(t,0.4,0.4,sfxG,1400,'lowpass');tone('sine',620,t,0.18,0.14,sfxG,140);},
  hiss(){if(!AC)return;noise(AC.currentTime,0.5,0.18,sfxG,4000);},
  // „Toc” scurt și ușor
  kick(){if(!AC)return;const t=AC.currentTime;tone('square',260,t,0.06,0.12,sfxG,520);noise(t,0.04,0.12,sfxG,2500);},
  burn(){if(!AC)return;const t=AC.currentTime;noise(t,0.25,0.25,sfxG,1400,'lowpass');tone('square',420,t,0.18,0.09,sfxG,70);},
  blip(){if(!AC)return;tone('pulse',1700,AC.currentTime,0.03,0.05,sfxG);},
  // Liliacul: trei chițăituri scurte, ascuțite
  bat(){if(!AC)return;const t=AC.currentTime;for(let i=0;i<3;i++)tone('square',2600+Math.random()*900,t+i*0.055,0.035,0.035,sfxG,3800+Math.random()*600);},
  // Picătura care cade: un „plic” rotund
  drip(){if(!AC)return;const t=AC.currentTime;tone('sine',1500+Math.random()*400,t,0.09,0.05,sfxG,600);tone('sine',900,t+0.1,0.06,0.015,sfxG,500);},
  // Gheața: trosnet scurt când mai crapă un pic
  crack(){if(!AC)return;const t=AC.currentTime;noise(t,0.09,0.3,sfxG,3200);tone('square',1400,t,0.05,0.05,sfxG,500);},
  iceBreak(){if(!AC)return;const t=AC.currentTime;noise(t,0.45,0.4,sfxG,2600);tone('triangle',1200,t,0.3,0.12,sfxG,180);},
  freeze(){arp([86,93,98],0.05,0.05,'triangle');},
  // Puterea de gheață: urcare cristalină la afină
  iceUp(){arp([72,76,79,84,79,84,88,91,88,91,96],0.04,0.09,'triangle');},
  fwipIce(){if(!AC)return;const t=AC.currentTime;noise(t,0.08,0.1,sfxG,6000);tone('sine',1200,t,0.1,0.08,sfxG,2600);},
  freezeHit(){arp([84,91,96,103],0.03,0.07,'triangle');},
  shatter(){if(!AC)return;const t=AC.currentTime;noise(t,0.3,0.35,sfxG,4000);tone('triangle',1600,t,0.16,0.1,sfxG,400);},
  hurry(){arp([74,75,74,75,74,75],0.07,0.09);},
  pause(){arp([74,69,74],0.05,0.08);},
  pop(){if(!AC)return;const t=AC.currentTime;noise(t,0.3,0.15,sfxG,2000);tone('square',300+Math.random()*400,t,0.25,0.05,sfxG,1200);},
  // Scârțâit de lemn vechi: platforma care cade
  creak(){if(!AC)return;const t=AC.currentTime;tone('sawtooth',190,t,0.24,0.06,sfxG,92);noise(t,0.18,0.14,sfxG,700,'lowpass');},
  // Lacul: „mac-mac” de rață
  quack(){if(!AC)return;const t=AC.currentTime;tone('sawtooth',560,t,0.08,0.045,sfxG,420);tone('sawtooth',540,t+0.12,0.09,0.045,sfxG,400);},
  plip(){if(!AC)return;tone('sine',700,AC.currentTime,0.07,0.05,sfxG,1500);},
  croak(){if(!AC)return;const t=AC.currentTime;tone('square',120,t,0.09,0.04,sfxG,95);tone('square',110,t+0.13,0.11,0.04,sfxG,85);},
  // Boss-ul: răcnet gros, bubuitură, „au” când e lovit
  roar(){if(!AC)return;const t=AC.currentTime;tone('sawtooth',140,t,0.5,0.14,sfxG,70);tone('square',95,t,0.5,0.08,sfxG,60);noise(t,0.45,0.25,sfxG,500,'lowpass');},
  thud(){if(!AC)return;const t=AC.currentTime;tone('sine',90,t,0.3,0.5,sfxG,35);noise(t,0.25,0.35,sfxG,400,'lowpass');},
  // Lovitura în pământ: se ghemuiește în aer (un „fâșș” care urcă), apoi bufnitura la aterizare
  poundUp(){if(!AC)return;const t=AC.currentTime;tone('pulse',300,t,0.12,0.09,sfxG,900);noise(t,0.1,0.08,sfxG,2500);},
  pound(){if(!AC)return;const t=AC.currentTime;tone('sine',110,t,0.25,0.45,sfxG,40);tone('square',180,t,0.08,0.1,sfxG,60);noise(t,0.2,0.3,sfxG,700,'lowpass');},
  bossHurt(){if(!AC)return;const t=AC.currentTime;tone('sawtooth',300,t,0.3,0.12,sfxG,90);noise(t,0.15,0.2,sfxG,1200);},
  bossDown(){arp([62,66,69,74,69,74,78,81,86],0.07,0.11);},
  // Fluierat care coboară
  dive(){if(!AC)return;tone('sine',1500,AC.currentTime,0.55,0.06,sfxG,420);},
  // Clopoțelul de la ușa cafenelei și „nimic” la blocul-slot
  bell(){if(!AC)return;const t=AC.currentTime;tone('triangle',1568,t,0.3,0.12,sfxG);tone('triangle',2093,t+0.11,0.4,0.1,sfxG);},
  // „Bla-bla”-ul bătrânelului
  talk(){if(!AC)return;tone('triangle',230+Math.random()*90,AC.currentTime,0.05,0.07,sfxG);},
  nope(){if(!AC)return;const t=AC.currentTime;tone('square',330,t,0.17,0.07,sfxG,310);tone('square',262,t+0.19,0.17,0.07,sfxG,247);tone('square',196,t+0.38,0.45,0.07,sfxG,175);},
  // Lacătul zăngăne: n-ai cheia
  rattle(){if(!AC)return;const t=AC.currentTime;for(let i=0;i<3;i++){tone('square',1100-i*120,t+i*0.07,0.03,0.05,sfxG);noise(t+i*0.07,0.03,0.1,sfxG,3000);}},
};
// Sunetul unui mob: tare cât se vede pe ecran, apoi tot mai încet, iar foarte departe deloc
const SFX_NEAR=W/2+16,SFX_FAR=W/2+300;
function sfxNear(x){const d=Math.abs(x-(cam.x+W/2));return d<=SFX_NEAR?1:Math.max(0,1-(d-SFX_NEAR)/(SFX_FAR-SFX_NEAR));}
function mobSfx(e,name){const k=sfxNear(e.x+e.w/2);if(k<=0.02||!sfx[name])return;SFX_K=k*k;try{sfx[name]();}finally{SFX_K=1;}}
