'use strict';
// ===== NIVELURILE: cum se construiește o hartă și lista LEVELS =====
function newMap(w){
  const grid=[];for(let y=0;y<ROWS;y++)grid.push(new Array(w).fill('.'));
  const m={w,grid,coins:[],ents:[],cps:[],goalDef:null,plats:[],bossDef:null,cafeDef:null,golds:[]};
  m.set=(x,y,c)=>{if(x>=0&&x<w&&y>=0&&y<ROWS)grid[y][x]=c;};
  m.f=(x,y,ww,hh,c)=>{for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)m.set(x+i,y+j,c);};
  m.g=(a,b)=>m.f(a,12,b-a+1,2,'D');
  m.pit=(a,b)=>m.f(a,12,b-a+1,2,'.');
  // Lac înghețat: gheață pe rândul solului, apă dedesubt
  m.lake=(a,b)=>{m.f(a,12,b-a+1,1,'I');m.f(a,13,b-a+1,1,'.');};
  // Pământul din spate (Z): doar decor, treci prin el
  m.z=(x,y,ww,hh)=>{for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)if(grid[y+j]&&grid[y+j][x+i]==='.')grid[y+j][x+i]='Z';};
  // Deal din față / din spate, din sol în sus: câte o înălțime pe coloană
  m.hill=(x,hs)=>hs.forEach((h,i)=>m.f(x+i,12-h,1,h,'D'));
  m.back=(x,hs)=>hs.forEach((h,i)=>m.z(x+i,12-h,1,h));
  // Deal și mai în spate (W): se pune după cele din față, doar unde e gol
  m.far=(x,hs)=>hs.forEach((h,i)=>{for(let j=12-h;j<12;j++)if(grid[j]&&grid[j][x+i]==='.')grid[j][x+i]='W';});
  // Pasaj prin deal (Y): scobit în pământ, treci prin el
  m.tunnel=(x,y,ww,hh)=>m.f(x,y,ww,hh,'Y');
  m.r=(x,y,s)=>{for(let i=0;i<s.length;i++)if(s[i]!==' ')m.set(x+i,y,s[i]);};
  m.c=(x,y,n=1)=>{for(let i=0;i<n;i++)m.coins.push([x+i,y]);};
  m.e=(type,x,y=11)=>m.ents.push({type,x,y});
  m.sp=(x,n=1,y=11)=>{for(let i=0;i<n;i++)m.set(x+i,y,'^');};
  m.st=(x,h,dir)=>{for(let i=0;i<h;i++){const hh=dir>0?i+1:h-i;m.f(x+i,12-hh,1,hh,'X');}};
  m.cp=x=>m.cps.push(x);
  m.goal=(type,x)=>{m.goalDef={type,x};};
  // Insulă care iese din apă
  m.isl=(a,b,top)=>m.f(a,top,b-a+1,ROWS-top,'D');
  // Platformă care se mișcă (ax 'x' sau 'y', range tile-uri)
  m.mv=(x,y,w,ax,range,period=240,phase=0)=>m.plats.push({kind:'move',x,y,w,ax,range,period,phase});
  // Platformă care cade: tremură după ce te urci pe ea
  m.fall=(x,y,w)=>m.plats.push({kind:'fall',x,y,w});
  // Boss-ul la x; poiana între a și b
  m.boss=(x,a,b)=>{m.bossDef={x,a,b};};
  // Căsuța MesoCafe la x; camera ei la a (în dreapta hărții)
  m.cafe=(x,a)=>{m.cafeDef={x,a};m.f(a,CAFE_FLOOR,CAFE_W,ROWS-CAFE_FLOOR,'F');m.f(a+CAFE_SLOT,CAFE_SLOT_Y,2,2,'S');
    m.f(a,0,CAFE_W,CAFE_CEIL,'K');};   // K = tavanul
  // Pană de aur: 'open', 'brick' (P), 'hidden' (V) sau 'boss'
  m.pana=(x,y,kind='open')=>{m.golds.push({x,y,kind});if(kind==='brick')m.set(x,y,'P');else if(kind==='hidden')m.set(x,y,'V');};
  // Peștera de sub pământ: găurile x, x2 în sol; camera de la a, lată de w (în dreapta hărții); opt: fall, pool, gems
  m.under=(x,x2,a,w,opt)=>{m.underDef={x,x2,a,w,opt};   // găurile se deschid în joc
    m.f(a,0,w,SUB_CEIL,'D');m.f(a,12,w,2,'D');m.f(a,SUB_CEIL,1,12-SUB_CEIL,'D');m.f(a+w-1,SUB_CEIL,1,12-SUB_CEIL,'D');
    m.f(a+2,0,2,SUB_CEIL,'Y');m.f(a+w-4,0,2,SUB_CEIL,'Y');m.f(a+w-4,10,2,2,'D');m.f(a+w-5,11,1,1,'D');};   // puțurile și treapta de ieșire
  // În peșteră nu crește iarbă
  m.done=()=>{const u=m.underDef;for(let y=0;y<ROWS;y++)for(let x=0;x<w;x++)if(grid[y][x]==='D'&&!(u&&x>=u.a)&&(y===0||(grid[y-1][x]!=='D'&&grid[y-1][x]!=='G')))grid[y][x]='G';return m;};
  return m;
}
// Numărul nivelului i, cum îl vede jucătorul
const levelNum=i=>LEVELS.slice(0,i+1).filter(d=>!d.bonus&&!d.arena).length;
const levelTag=i=>LEVELS[i].bonus?'BONUS':String(levelNum(i));
const LEVELS=[];   // Nivelurile se adaugă din nivele/*/harta.js
// id = numele sub care se salvează penele de aur găsite
