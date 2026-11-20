'use strict';
// ===== DIALOGUL: caseta cu cine vorbește =====
// Ce spune apare jos, într-o casetă
const TALK_WRAP=44,TALK_LIFT=28;
// Cine vorbește: numele de pe etichetă și bustul din ramă
const TALK_WHO={
  old:{name:'MOȘ CURCAN',bust:(x,y)=>ctx.drawImage(OLD_BUST,6,0,22,20,x,y,22,20)},
  boss:{name:'FERMIERUL-ȘEF',bust:(x,y)=>ctx.drawImage(bossBust(),3,0,22,20,x,y,22,20)},
};
// Curcanii prinși: p0..p4
CAPT_INFO.forEach((c,i)=>{TALK_WHO['p'+i]={name:c.name,bust:(x,y)=>ctx.drawImage(CAPT[i].L.r,3,1,19,20,x+1,y,19,20)};});
// Litere mici: eticheta dialogului, cartonașele
const TINY={A:[".#.","#.#","###","#.#","#.#"],B:["##.","#.#","##.","#.#","##."],C:[".##","#..","#..","#..",".##"],
  D:["##.","#.#","#.#","#.#","##."],E:["###","#..","##.","#..","###"],F:["###","#..","##.","#..","#.."],G:[".##","#..","#.#","#.#",".##"],
  H:["#.#","#.#","###","#.#","#.#"],I:["#","#","#","#","#"],L:["#..","#..","#..","#..","###"],M:["#...#","##.##","#.#.#","#...#","#...#"],
  N:["#..#","##.#","#.##","#..#","#..#"],O:[".#.","#.#","#.#","#.#",".#."],P:["##.","#.#","##.","#..","#.."],R:["##.","#.#","##.","#.#","#.#"],
  S:[".##","#..",".#.","..#","##."],T:["###",".#.",".#.",".#.",".#."],U:["#.#","#.#","#.#","#.#","###"],V:["#.#","#.#","#.#","#.#",".#."],
  Z:["###","..#",".#.","#..","###"],'Ș':[".##","#..",".#.","..#","##.","...",".#."],'Ț':["###",".#.",".#.",".#.",".#.","...",".#."],
  'Ă':["#.#",".#.","...",".#.","#.#","###","#.#","#.#"],'Â':[".#.","#.#","...",".#.","#.#","###","#.#","#.#"],
  'Î':[".#.","#.#","...",".#.",".#.",".#.",".#.",".#."],
  '!':["#","#","#",".","#"],'?':["##.","..#",".#.","...",".#."],'-':["..","..","##","..",".."],' ':["..",".."],"'":["#","#",".",".","."],J:["..#","..#","..#","#.#",".#."],'.':[".",".",".",".","#"]};
const TINY_UP={'Ă':3,'Â':3,'Î':3};   // accentul stă deasupra rândului
const tinyW=s=>[...s].reduce((w,ch)=>w+(TINY[ch]||TINY[' '])[0].length+1,0)-1;
function tinyTxt(s,x,y,col){ctx.fillStyle=col;
  for(const ch of s){const g=TINY[ch]||TINY[' '],up=TINY_UP[ch]||0;
    g.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='#')ctx.fillRect(x+i,y+j-up,1,1);});x+=g[0].length+1;}}
// Împarte pe rânduri de cel mult max pixeli
function tinyWrap(s,max){const out=[];let line='';
  for(const w of s.split(' ')){const t=line?line+' '+w:w;if(line&&tinyW(t)>max){out.push(line);line=w;}else line=t;}
  if(line)out.push(line);return out;}
function openTalk(lines,who='old'){G.talk={lines,i:0,n:0,who:TALK_WHO[who]};if(player)player.vx=0;}
function updateTalk(){
  const T=G.talk,len=[...T.lines[T.i]].length,prev=Math.floor(T.n);
  if(T.n<len){T.n=Math.min(len,T.n+0.5);const n=Math.floor(T.n);if(n!==prev&&n%2===0)sfx.talk();}
  if(startPressed()||upPressed()){
    if(T.n<len)T.n=len;
    else if(++T.i>=T.lines.length)G.talk=null;
    else T.n=0;
    sfx.blip();
  }
}
function drawTalk(){
  const T=G.talk;if(!T||(G.state!=='play'&&G.state!=='win'))return;
  // O casetă mică, jos la mijloc, ca să nu acopere camera
  const line=T.lines[T.i];
  drawTalkBox((W-TALK_BOX_W)/2,H-TALK_BOX_H-4,T.who||TALK_WHO.old,line,T.n,T.n>=[...line].length);
}
// Caseta de dialog: who = cine vorbește
const TALK_BOX_W=320,TALK_BOX_H=40;
function drawTalkBox(x,y,who,line,n,next){
  const w=TALK_BOX_W,h=TALK_BOX_H;
  uiBox(x,y,w,h);
  // Numele, cu litere mici
  const tw=tinyW(who.name)+8;uiBox(x+6,y-10,tw,11);tinyTxt(who.name,x+10,y-7,'#ffd23f');
  // Bustul celui care vorbește, la mărimea
  ctx.fillStyle='#c8962c';ctx.fillRect(x+8,y+9,24,22);ctx.fillStyle='#e8c060';ctx.fillRect(x+8,y+9,24,1);
  ctx.fillStyle='#4a2228';ctx.fillRect(x+9,y+10,22,20);who.bust(x+9,y+10);
  // Textul, în dreapta portretului, la mijlocul casetei
  const rows=wrapWords(line,TALK_WRAP),ty=y+Math.round((h-(rows.length*12-5))/2);let left=Math.floor(n);
  rows.forEach((l,i)=>{const s=[...l].slice(0,Math.max(0,left)).join('');left-=[...l].length+1;
    if(s)txt(s,x+38,ty+i*12,'#ffffff',1,'l',null);});
  // După ce s-a scris tot rândul: un triunghi mic
  if(next){ctx.fillStyle='#8a84a8';ctx.fillRect(x+w-11,y+h-9,5,1);ctx.fillRect(x+w-10,y+h-8,3,1);ctx.fillRect(x+w-9,y+h-7,1,1);}
}
