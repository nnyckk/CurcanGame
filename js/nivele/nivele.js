'use strict';
// ================= NIVELURILE: cum se construiește o hartă (newMap) și lista LEVELS =================
function newMap(w){
  const grid=[];for(let y=0;y<ROWS;y++)grid.push(new Array(w).fill('.'));
  const m={w,grid,coins:[],ents:[],cps:[],goalDef:null,plats:[],bossDef:null,cafeDef:null,golds:[]};
  m.set=(x,y,c)=>{if(x>=0&&x<w&&y>=0&&y<ROWS)grid[y][x]=c;};
  m.f=(x,y,ww,hh,c)=>{for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)m.set(x+i,y+j,c);};
  m.g=(a,b)=>m.f(a,12,b-a+1,2,'D');
  m.pit=(a,b)=>m.f(a,12,b-a+1,2,'.');
  // Lac înghețat: gheață (I) pe rândul solului, apă dedesubt. Un m.pit în interior lasă o copcă (apă deschisă).
  m.lake=(a,b)=>{m.f(a,12,b-a+1,1,'I');m.f(a,13,b-a+1,1,'.');};
  m.r=(x,y,s)=>{for(let i=0;i<s.length;i++)if(s[i]!==' ')m.set(x+i,y,s[i]);};
  m.c=(x,y,n=1)=>{for(let i=0;i<n;i++)m.coins.push([x+i,y]);};
  m.e=(type,x,y=11)=>m.ents.push({type,x,y});
  m.sp=(x,n=1,y=11)=>{for(let i=0;i<n;i++)m.set(x+i,y,'^');};
  m.st=(x,h,dir)=>{for(let i=0;i<h;i++){const hh=dir>0?i+1:h-i;m.f(x+i,12-hh,1,hh,'X');}};
  m.cp=x=>m.cps.push(x);
  m.goal=(type,x)=>{m.goalDef={type,x};};
  // Insulă care iese din apă: pământ de la rândul top până jos (cu iarbă deasupra, pusă de m.done).
  m.isl=(a,b,top)=>m.f(a,top,b-a+1,ROWS-top,'D');
  // Platformă care se mișcă (vezi PLATFORME): pornește din (x,y), lată de w tile-uri, și merge lin înainte și înapoi
  // range tile-uri — ax 'x' = spre dreapta, ax 'y' = în jos — într-o perioadă de period cadre (phase = 0..1, decalaj).
  m.mv=(x,y,w,ax,range,period=240,phase=0)=>m.plats.push({kind:'move',x,y,w,ax,range,period,phase});
  // Platformă care cade: tremură după ce te urci pe ea, apoi cade în lac; după câteva secunde reapare.
  m.fall=(x,y,w)=>m.plats.push({kind:'fall',x,y,w});
  // Boss-ul (vezi BOSS): stă la tile-ul x, iar poiana în care se luptă e între tile-urile a și b (b = stiva de fân din dreapta).
  m.boss=(x,a,b)=>{m.bossDef={x,a,b};};
  // Căsuța MesoCafe (vezi CAFENEAUA): stă la tile-urile x .. x+5 (ușa la mijloc), iar camera dinăuntru, lată de un
  // ecran (25 de tile-uri), e la tile-urile a .. a+24, în dreapta hărții, după țintă. Pe podeaua ei, la mijloc, blocul-slot
  // (2 × 2 tile-uri, S).
  m.cafe=(x,a)=>{m.cafeDef={x,a};m.f(a,CAFE_FLOOR,CAFE_W,ROWS-CAFE_FLOOR,'F');m.f(a+CAFE_SLOT,CAFE_SLOT_Y,2,2,'S');
    m.f(a,0,CAFE_W,CAFE_CEIL,'K');};   // K = tavanul (solid, nedesenat): dai cu capul în grindă, nu sari afară
  // Pană de aur (vezi PENELE DE AUR), a câta e dată de ordinea în care sunt puse (0, 1, 2). kind:
  // 'open' = plutește la (x, y); 'brick' = într-o cărămidă (P) la (x, y), care se sparge doar dacă ești mare (sau cu o
  // bombă); 'hidden' = într-un bloc invizibil (V) la (x, y), care apare când dai cu capul în el de dedesubt;
  // 'boss' = în stiva de fân din dreapta poienii boss-ului, la (x, y): iese când se prăbușește stiva.
  m.pana=(x,y,kind='open')=>{m.golds.push({x,y,kind});if(kind==='brick')m.set(x,y,'P');else if(kind==='hidden')m.set(x,y,'V');};
  m.done=()=>{for(let y=0;y<ROWS;y++)for(let x=0;x<w;x++)if(grid[y][x]==='D'&&(y===0||(grid[y-1][x]!=='D'&&grid[y-1][x]!=='G')))grid[y][x]='G';return m;};
  return m;
}
// Numărul nivelului i, cum îl vede jucătorul: nivelul bonus nu se numără (Pădurea de brazi rămâne nivelul 4).
const levelNum=i=>LEVELS.slice(0,i+1).filter(d=>!d.bonus&&!d.arena).length;
const levelTag=i=>LEVELS[i].bonus?'BONUS':String(levelNum(i));
const LEVELS=[];  // Nivelurile se adaugă din nivele/*/harta.js (LEVELS.push), în ordinea din index.html.
// id = numele sub care se salvează penele de aur găsite (nu se schimbă, chiar dacă se schimbă ordinea nivelurilor).
// Penele de aur (m.pana, vezi PENELE DE AUR), câte 3 pe nivel: una ascunsă într-un bloc invizibil (sau în fân, la
// boss), una la vedere dar greu de luat și una într-o cărămidă (trebuie să fii mare).
