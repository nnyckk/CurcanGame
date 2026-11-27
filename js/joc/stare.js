'use strict';
// ===== STAREA JOCULUI, setările =====
const G={state:'title',t:0,level:0,lives:3,score:0,coins:0,time:300,hi:0,cp:null,frame:0,shake:0,stateT:0,music:true,sfx:true,menu:'main',sel:0,paused:false,final:false,tally:0,lastAlert:0};
try{G.hi=+localStorage.getItem('curcan_hi')||0;}catch(e){}
// Setările se țin minte în browser
try{const s=JSON.parse(localStorage.getItem('curcan_settings')||'{}');G.music=s.music!==false;G.sfx=s.sfx!==false;G.goldSkin=!!s.gold;}catch(e){}
function saveSettings(){try{localStorage.setItem('curcan_settings',JSON.stringify({music:G.music,sfx:G.sfx,gold:!!G.goldSkin}));}catch(e){}}
// Volumul muzicii și al efectelor, după setări
function applyAudio(){if(!AC)return;musicG.gain.value=G.music?(G.paused?0.06:G.duck?0.1:0.32):0;sfxG.gain.value=G.sfx?0.7:0;}   // duck: mai încet, la jocul cu note
function saveHi(){if(G.custRun)return;if(G.score>G.hi){G.hi=G.score;try{localStorage.setItem('curcan_hi',G.hi);}catch(e){}}}
let grid=null,cols=0,theme=THEMES[0],tiles=getTiles(0),bg=getBG(0),goal=null;
let player=null,enemies=[],coins=[],items=[],parts=[],popups=[],booms=[],bumps=[],cps=[],feathers=[],plats=[],boss=null,cafe=null;
const cam={x:0,y:0};
let topRow=0,botRow=ROWS;   // botRow: până unde se desenează (ROWS + rândurile de dedesubt)   // cel mai de sus rând folosit: 0 sau -SKY_ROWS
