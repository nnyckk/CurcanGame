'use strict';
// ===== EDITORUL: panoul din editor.html =====
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const frame=$('#frame'),mainEl=$('#main');
const send=(cmd,data)=>{try{frame.contentWindow.postMessage(Object.assign({cmd},data),'*');}catch(e){}};
const focusGame=()=>{try{frame.focus();frame.contentWindow.focus();}catch(e){}};
const press=(b,on)=>{const v=String(!!on);if(b.getAttribute('aria-pressed')!==v)b.setAttribute('aria-pressed',v);};

// ---- Iconițe pixel, 7×7 ----
const PX={
  sun:['#..#..#','.#...#.','..###..','#.###.#','..###..','.#...#.','#..#..#'],
  moon:['...###.','..##...','.##....','.##....','.##....','..##...','...###.'],
  flake:['#..#..#','.#.#.#.','..###..','#######','..###..','.#.#.#.','#..#..#'],
  palm:['.##.##.','#..#..#','...#...','...#...','...#...','...#...','.#####.'],
  play:['.#.....','.##....','.###...','.####..','.###...','.##....','.#.....'],
  stop:['.......','.#####.','.#####.','.#####.','.#####.','.#####.','.......'],
  undo:['..#....','.##....','######.','.##...#','..#...#','......#','..####.'],
  redo:['....#..','....##.','.######','#...##.','#...#..','#......','.####..'],
  x:['#.....#','##...##','.##.##.','..###..','.##.##.','##...##','#.....#'],
  pointer:['#......','##.....','###....','####...','#####..','##.#...','#...#..'],
  paint:['.....##','....###','...###.','..###..','.###...','##.....','#......'],
  erase:['...###.','..#####','.#####.','#####..','.###...','..#....','.......'],
  rect:['#######','#.....#','#.....#','#.....#','#.....#','#.....#','#######'],
  move:['...#...','..###..','...#...','#######','...#...','..###..','...#...'],
  enter:['.#####.','.#...#.','.#.#.#.','.#.#.#.','.#...#.','.#..##.','.#####.'],
  back:['..#....','.##....','#######','.##....','..#....','.......','.......'],
  sign:['#######','#######','#######','...#...','...#...','...#...','..###..'],
  rest:['...#...','..###..','.#####.','#######','.#.#.#.','.#.#.#.','.#####.'],
  cafe:['.#.#...','#.#....','.......','#####..','#####.#','#####.#','.###.#.'],
  cavein:['...#...','...#...','.#####.','..###..','...#...','#######','#.....#'],
  caveout:['...#...','..###..','.#####.','...#...','...#...','#######','#.....#'],
  gem:['...#...','..###..','.##.##.','.#####.','.#####.','..###..','...#...'],
  bat:['.......','#.....#','##.#.##','#######','.#####.','..#.#..','.......'],
  icicle:['#######','.#####.','.#####.','..###..','..###..','...#...','...#...'],
  pool:['.......','.......','.#..#..','#.##.##','.......','#######','#######'],
  pit:['.......','#..#..#','#..#..#','##.##.#','#######','#######','#######'],
};
function pix(name){
  const rows=PX[name];let r='';
  rows.forEach((row,y)=>{for(let x=0;x<row.length;){if(row[x]!=='#'){x++;continue;}let w=0;while(row[x+w]==='#')w++;r+=`<rect x="${x}" y="${y}" width="${w}" height="1"/>`;x+=w;}});
  return `<svg class="px" viewBox="0 0 7 7" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
const fillPx=root=>root.querySelectorAll('[data-px]').forEach(el=>{el.outerHTML=pix(el.dataset.px);});

// ---- Uneltele și elementele ----
const MODES=[{id:'pointer',name:'Pointer',k:'P'},{id:'paint',name:'Pensulă',k:'B'},{id:'erase',name:'Gumă',k:'E'},{id:'rect',name:'Dreptunghi',k:'R'},{id:'move',name:'Mutare',k:'V'}];
// g = grupa din panou; px = iconiță din panou (altfel vine din joc)
const ELS=[
  {g:'teren',id:'D',name:'Pământ'},{g:'teren',id:'Z',name:'Deal din spate'},{g:'teren',id:'W',name:'Deal îndepărtat'},
  {g:'teren',id:'Y',name:'Tunel'},{g:'teren',id:'X',name:'Piatră'},{g:'teren',id:'I',name:'Gheață',snow:true},
  {g:'teren',id:'water',name:'Apă'},{g:'teren',id:'^',name:'Țepi'},{g:'teren',id:'=',name:'Scândură'},
  {g:'cteren',id:'D',name:'Pământ',icon:'Dc'},{g:'cteren',id:'X',name:'Piatră'},{g:'cteren',id:'^',name:'Țepi'},{g:'cteren',id:'=',name:'Scândură'},{g:'cteren',id:'Y',name:'Tunel'},
  {g:'blocuri',id:'B',name:'Cărămidă'},{g:'blocuri',id:'M',name:'Bloc M'},{g:'blocuri',id:'H',name:'Bloc cu putere'},
  {g:'obiecte',id:'coin',name:'Bănuț'},{g:'obiecte',id:'cp',name:'Checkpoint',main:1},{g:'obiecte',id:'start',name:'Start',main:1},
  {g:'obiecte',id:'gopen',name:'Pană vizibilă'},{g:'obiecte',id:'gbrick',name:'Pană în cărămidă'},{g:'obiecte',id:'ghidden',name:'Pană ascunsă'},
  {g:'obiecte',id:'cage',name:'Colivie',main:1},
  {g:'final',id:'sign',name:'Semn de final',px:'sign'},{g:'final',id:'rest',name:'Restaurant',px:'rest'},{g:'final',id:'cafe',name:'MesoCafé',px:'cafe'},
  {g:'platforme',id:'mvx',name:'Se mișcă ↔'},{g:'platforme',id:'mvy',name:'Se mișcă ↕'},{g:'platforme',id:'fall',name:'Cade'},
  {g:'inamici',id:'boy',name:'Ucenic'},{g:'inamici',id:'man',name:'Fermier'},{g:'inamici',id:'bomb',name:'Bombă'},
  {g:'pestera',id:'cavein',name:'Intrare',px:'cavein'},{g:'pestera',id:'caveout',name:'Ieșire',px:'caveout'},
  {g:'decor',id:'gem',name:'Cristal',px:'gem'},{g:'decor',id:'bat',name:'Liliac',px:'bat'},{g:'decor',id:'icicle',name:'Țurțure care cade',px:'icicle'},
  {g:'decor',id:'pool',name:'Baltă',px:'pool'},{g:'decor',id:'cin',name:'Unde cazi',px:'cavein'},{g:'decor',id:'cout',name:'Pe unde ieși',px:'caveout'}];
const CAVE_EL=new Set(['D','X','^','=','Y','B','M','H','coin','gopen','gbrick','ghidden','boy','man','bomb','gem','bat','icicle','pool','cin','cout']);
const CAPT_NAMES=['Doamna Glu-Glu',"Conu' Gușălan",'Nenea Penel','Nenea Țepoșel','Tanti Pufoaica'];
// Mărimea iconiței în panou
const ICON_K={boy:2,man:2,bomb:2,start:2,coin:2,gopen:2,cage:0.85,mvx:1,mvy:1,fall:1};
// Opțiunile elementelor (lățimea platformei, raza, curcanul din colivie)
const POWER={normal:'H',ice:'A',fire:'R'},POWER_NAMES={normal:'Normală',ice:'Gheață',fire:'Foc'};
const kindOf=c=>c==='A'?'ice':c==='R'?'fire':'normal';
const OPT={H:{kind:'normal'},mvx:{w:3,range:6,speed:3},mvy:{w:3,range:4,speed:3},fall:{w:1},cage:{capt:0}};
$('#modes').innerHTML=MODES.map(m=>`<button class="mode" data-mode="${m.id}" title="${m.name} (${m.k})"><i data-px="${m.id}"></i>${m.name}<kbd>${m.k}</kbd></button>`).join('');
for(const box of $$('.els'))box.innerHTML=ELS.filter(e=>e.g===box.dataset.group).map(e=>
  `<button class="el" data-el="${e.id}" title="${e.name}"><span class="ic">${e.px?`<i data-px="${e.px}"></i>`:`<img data-icon="${e.icon||e.id}" alt="">`}</span>${e.name}</button>`).join('');
fillPx(document);

// ---- Nivelul, anularea ----
const DRAFT='curcan_editor_ciorna';
let L=null;
try{const s=localStorage.getItem(DRAFT);if(s)L=edNorm(JSON.parse(s));}catch(e){}
if(!L)L=edNewLevel();
let undo=[],redo=[],pending=null,region='main',sel=null,insp=null;   // insp: ce arată Pointerul   // sel: platforma sau colivia aleasă
let tool={mode:'paint',el:'D'},view={cam:0,view:25,cols:L.w,state:'edit'},playing=false,hover=null,THEME=null,ICONS={};
// O acțiune nouă: ce era înainte intră în istoria de anulare, la prima schimbare
const begin=()=>{pending=JSON.stringify(L);};
function commit(){
  if(pending!==null){undo.push(pending);if(undo.length>100)undo.shift();redo=[];pending=null;}
  changed();
}
function undoIt(){if(!undo.length||playing)return;redo.push(JSON.stringify(L));L=JSON.parse(undo.pop());afterLoad();changed();}
function redoIt(){if(!redo.length||playing)return;undo.push(JSON.stringify(L));L=JSON.parse(redo.pop());afterLoad();changed();}
// Dacă peștera a dispărut, ieși din ea
function afterLoad(){sel=null;insp=null;if(typeof clearSel==='function')clearSel();if(region==='cave'&&!L.cave)setRegion('main');}
// După orice schimbare: jocul, ciorna, harta, butoanele
let sendQ=false,saveT=0;
function changed(){
  if(!sendQ){sendQ=true;requestAnimationFrame(()=>{sendQ=false;send('edLevel',{L});});}
  clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(DRAFT,JSON.stringify(L));}catch(e){}},400);
  syncUI();drawMap();marks();
}

// ---- Desenatul ----
const SOLID='DBMHXI^';
const isSnow=()=>L.biome==='iarna';
const zone=()=>region==='cave'&&L.cave?L.cave:L;   // drumul sau camera peșterii
const inMain=()=>zone()===L;
const allGolds=()=>L.golds.length+(L.cave?L.cave.golds.length:0);
function setT(z,x,y,c){const r=z.grid[y];if(r[x]===c)return false;z.grid[y]=r.slice(0,x)+c+r.slice(x+1);return true;}
// Rândul pe care stă curcanul la start
function startRow(x){let gy=12;while(gy>0&&SOLID.includes(L.grid[gy-1][x]))gy--;return gy;}
// Ce ocupă fiecare lucru mare din pătrățelul (x, y), pe drum
const hitCage=(x,y)=>L.cage&&x===L.cage.x&&y>=L.cage.y-3&&y<L.cage.y;
const hitGoal=(x,y)=>L.goal&&(L.goal.type==='sign'?x>=L.goal.x&&x<=L.goal.x+4&&y>=8:x>=L.goal.x&&x<=L.goal.x+11&&y>=7);
const hitCafe=(x,y)=>L.cafe&&x>=L.cafe.x&&x<=L.cafe.x+5&&y>=6;
const hitPlat=(x,y)=>L.plats.find(p=>y===p.y&&x>=p.x&&x<p.x+p.w);
const hitHole=(x,y)=>L.cave&&y>=12?(x>=L.cave.x&&x<=L.cave.x+1?'x':x>=L.cave.x2&&x<=L.cave.x2+1?'x2':null):null;
// Ce obiect se poate muta din pătrățelul (x, y)
function pick(x,y){
  const z=zone();
  const e=z.ents.find(m=>m.x===x&&(m.y===y||m.y-1===y));if(e)return {k:'ent',o:e};
  const c=z.coins.find(c=>c[0]===x&&c[1]===y);if(c)return {k:'coin',o:c};
  const g=z.golds.find(g=>g.x===x&&g.y===y);if(g)return {k:'gold',o:g};
  if(!inMain())return null;
  const sr=startRow(L.start);if(x===L.start&&y>=sr-1&&y<=sr)return {k:'start'};
  if(hitCage(x,y))return {k:'cage'};
  for(const q of L.plats)if(q.kind==='move'){const h=rangeAt(q);if(h.x===x&&h.y===y)return {k:'range',o:q};}
  const p=hitPlat(x,y);if(p)return p.w>1&&x===p.x+p.w-1?{k:'pwidth',o:p}:{k:'plat',o:p,dx:x-p.x};
  const h=hitHole(x,y);if(h)return {k:'hole',h};
  if(y>=9&&L.cps.includes(x))return {k:'cp',v:x};
  if(hitCafe(x,y))return {k:'cafe',dx:x-L.cafe.x};
  if(hitGoal(x,y))return {k:'goal',dx:x-L.goal.x};
  return null;
}
function moveTo(d,x,y){
  if(d.k==='cage'||!inMain())return moveTo0(d,x,y);
  const was=edZoneBad(L),keep=d.o?(Array.isArray(d.o)?d.o.slice():{...d.o}):null,s={start:L.start,cps:L.cps.slice(),v:d.v,cafe:L.cafe&&{...L.cafe},goal:L.goal&&{...L.goal},cv:L.cave&&[L.cave.x,L.cave.x2]};
  if(!moveTo0(d,x,y))return false;
  const now=edZoneBad(L),i=now.findIndex((b,k)=>b&&!was[k]);if(i<0)return true;
  const np=L.plats.length,why=i===0?edCageWhy(L,L.cage.x,L.cage.y):i<=np?edPlatWhy(L,L.plats[i-1]):edHoleWhy(L,i===np+1?'in':'out');
  if(keep){if(Array.isArray(keep))d.o.splice(0,d.o.length,...keep);else Object.assign(d.o,keep);}   // înapoi
  L.start=s.start;L.cps=s.cps;d.v=s.v;if(s.cafe)Object.assign(L.cafe,s.cafe);if(s.goal)Object.assign(L.goal,s.goal);if(s.cv)[L.cave.x,L.cave.x2]=s.cv;
  status(why,5000);return false;
}
function moveTo0(d,x,y){
  const same=(a,b)=>a===b;
  if(d.k==='ent'){if(d.o.x===x&&d.o.y===y)return false;d.o.x=x;d.o.y=y;return true;}
  if(d.k==='coin'){if((d.o[0]===x&&d.o[1]===y)||zone().coins.some(c=>c[0]===x&&c[1]===y))return false;d.o[0]=x;d.o[1]=y;return true;}
  if(d.k==='gold'){if((d.o.x===x&&d.o.y===y)||zone().golds.some(g=>g.x===x&&g.y===y))return false;d.o.x=x;d.o.y=y;return true;}
  if(d.k==='start'){if(same(L.start,x))return false;L.start=x;return true;}
  if(d.k==='cage'){const ny=Math.min(13,y+1);if(L.cage.x===x&&L.cage.y===ny)return false;const why=edCageWhy(L,x,ny);if(why){status(why,5000);return false;}L.cage.x=x;L.cage.y=ny;return true;}
  if(d.k==='range'){const p=d.o,r=Math.max(1,p.ax==='x'?Math.min(x-(p.x+p.w-1),L.w-p.x-p.w):Math.min(y-p.y,13-p.y));if(r===p.range)return false;p.range=r;return true;}
  if(d.k==='pwidth'){const p=d.o,w=Math.max(1,Math.min(x-p.x+1,L.w-p.x));if(w===p.w)return false;p.w=w;if(p.kind==='move'&&p.ax==='x')p.range=Math.max(1,Math.min(p.range,L.w-p.x-w));return true;}
  if(d.k==='plat'){const nx=Math.max(0,Math.min(L.w-1,x-d.dx));if(d.o.x===nx&&d.o.y===y)return false;d.o.x=nx;d.o.y=y;return true;}
  if(d.k==='hole'){const nx=Math.max(0,Math.min(L.w-2,x)),o=d.h==='x'?L.cave.x2:L.cave.x;if(L.cave[d.h]===nx||Math.abs(nx-o)<2)return false;L.cave[d.h]=nx;return true;}
  if(d.k==='cp'){if(L.cps.includes(x))return false;const i=L.cps.indexOf(d.v);if(i<0)return false;L.cps[i]=x;d.v=x;return true;}
  if(d.k==='cafe'){const nx=Math.max(0,Math.min(L.w-1,x-d.dx));if(L.cafe.x===nx)return false;L.cafe.x=nx;return true;}
  if(d.k==='goal'){const nx=Math.max(0,Math.min(L.w-1,x-d.dx));if(L.goal.x===nx)return false;L.goal.x=nx;return true;}
  return false;
}
// Decorul peșterii din pătrățelul (x, y)
function eraseDecor(c,x,y){
  const n=JSON.stringify([c.gems,c.bats,c.fall,c.pools]);
  let ct=0;while(ct<12&&c.grid[ct][x]==='D')ct++;   // sub tavanul coloanei: liliacul, țurțurele, cristalul din tavan
  c.gems=c.gems.filter(g=>typeof g==='number'?!(g===x&&y>=7):g[0]==='C'?!(g[1]===x&&y<=ct+2):!(g[1]===y&&((g[0]==='L'&&x<=1)||(g[0]==='R'&&x>=c.w-2))));
  if(y<=ct+2){c.bats=c.bats.filter(b=>b!==x);c.fall=c.fall.filter(f=>f!==x);}
  if(y>=9)c.pools=c.pools.filter(p=>!(x>=p[0]&&x<=p[1]));
  return JSON.stringify([c.gems,c.bats,c.fall,c.pools])!==n;
}
function eraseAt(x,y){
  const z=zone(),n=z.ents.length+z.coins.length+z.golds.length;
  z.ents=z.ents.filter(m=>!(m.x===x&&(m.y===y||m.y-1===y)));
  z.coins=z.coins.filter(c=>!(c[0]===x&&c[1]===y));
  z.golds=z.golds.filter(g=>!(g.x===x&&g.y===y));
  if(z.ents.length+z.coins.length+z.golds.length<n)return true;
  if(inMain()){
    if(hitCage(x,y)){L.cage=null;return true;}
    const p=hitPlat(x,y);if(p){L.plats=L.plats.filter(q=>q!==p);return true;}
    if(hitHole(x,y)){status('Peștera se scoate cu butonul „Șterge peștera”.');return false;}
    if(y>=9&&L.cps.includes(x)){L.cps=L.cps.filter(c=>c!==x);return true;}
    if(hitCafe(x,y)){L.cafe=null;return true;}
    if(hitGoal(x,y)){L.goal=null;return true;}
  }else if(eraseDecor(z,x,y))return true;
  return setT(z,x,y,'.');
}
// Locul coliviei: aerul din jur și pământul de sub ea
function cageGuard(x,y,erase){
  const c=L.cage;if(!c||!inMain()||tool.el==='cage'&&!erase)return false;
  const b=edCageBox(c.x,c.y),gx=x>=b.x0&&x<=c.x;
  if(erase)return gx&&y===c.y;   // guma: doar pământul de sub ea
  if(x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1)return true;
  if(gx&&(tool.el==='water'||tool.el==='I')&&c.y>=12)return true;
  return gx&&y===c.y&&!(ED_TILES.includes(tool.el)&&ED_CAGE_GROUND.includes(tool.el));
}
// Găurile peșterii și aerul de deasupra: bănuții au voie
function holeGuard(x,y,erase){
  const e=tool.el;if(erase||!inMain()||!L.cave||e==='coin'||e==='cavein'||e==='caveout')return false;
  const ty=e==='I'||e==='water'?12:y;
  return ['in','out'].some(k=>{const b=edHoleBox(L,k);return x>=b.x0&&x<=b.x1&&ty>=b.y0&&ty<=b.y1&&(ty<12||x<=b.x0+1);});
}
// Drumul platformelor: bănuții au voie, restul nu
function platGuard(x,y,erase){
  const e=tool.el;if(erase||!inMain()||e==='coin'||e==='water'||e==='mvx'||e==='mvy'||e==='fall')return false;
  const ty=e==='I'?12:y;
  return L.plats.some(p=>{const b=edPlatBox(p);return x>=b.x0&&x<=b.x1&&ty>=b.y0&&ty<=b.y1;});
}
// first = click, nu trasul mai departe
function applyAt(x,y,erase,first){
  const z=zone();
  if(x<0||x>=z.w||y<0||y>=ED_ROWS)return false;
  if(!inMain()&&(x===0||x===z.w-1)){if(first)status('Pereții din margine ai camerei rămân: altfel ai ieși din peșteră.');return false;}
  if(cageGuard(x,y,erase)){if(first)status('Locul coliviei rămâne liber: acolo sare curcanul când iese. Mut-o sau șterge-o întâi.');return false;}
  if(holeGuard(x,y,erase)){if(first)status('Intrarea și ieșirea peșterii rămân libere. Mută-le întâi.');return false;}
  if(platGuard(x,y,erase)){if(first)status('Drumul platformei rămâne liber. Mut-o, scurteaz-o sau șterge-o întâi.');return false;}
  if(erase)return eraseAt(x,y);
  const e=tool.el,o=OPT[e]||{};
  if(!inMain()&&!CAVE_EL.has(e))return false;
  if(e==='I'){if(!isSnow())return false;const a=setT(z,x,12,'I');return setT(z,x,13,'.')||a;}   // gheața: doar pe rândul solului, cu apă dedesubt
  if(e==='water'){const a=setT(z,x,12,'.');return setT(z,x,13,'.')||a;}   // apa: scoate solul din coloană
  if(e==='H')return setT(z,x,y,POWER[o.kind||'normal']);   // blocul cu puterea aleasă
  if(ED_TILES.includes(e))return setT(z,x,y,e);
  if(e==='coin'){if(z.coins.some(c=>c[0]===x&&c[1]===y))return false;z.coins.push([x,y]);return true;}
  if(!first)return false;
  if(ED_MOBS.includes(e)){z.ents=z.ents.filter(m=>!(m.x===x&&m.y===y));z.ents.push({t:e,x,y});return true;}
  if(e==='gopen'||e==='gbrick'||e==='ghidden'){
    const kind=e==='gopen'?'open':e==='gbrick'?'brick':'hidden',old=z.golds.find(g=>g.x===x&&g.y===y);
    if(old){if(old.kind===kind)return false;old.kind=kind;return true;}
    if(allGolds()>=ED_GOLDS){status('Cel mult 3 pene de aur pe nivel. Șterge una ca să pui alta.');return false;}
    z.golds.push({x,y,kind});return true;}
  if(e==='gem'){let ct=0;while(ct<12&&z.grid[ct][x]==='D')ct++;   // imediat sub tavan: atârnă din tavan
    const g=x<=1?['L',Math.min(11,y)]:x>=z.w-2?['R',Math.min(11,y)]:y<=ct+1?['C',x]:x;if(z.gems.some(q=>JSON.stringify(q)===JSON.stringify(g)))return false;z.gems.push(g);return true;}
  if(e==='bat'){if(z.bats.includes(x))return false;z.bats.push(x);return true;}
  if(e==='icicle'){if(z.fall.includes(x))return false;z.fall.push(x);return true;}
  if(e==='cin'||e==='cout'){const k=e==='cin'?'in':'out',v=Math.max(1,Math.min(z.w-3,x));if(z[k]===v)return false;z[k]=v;return true;}
  // De aici: doar pe drum
  if(e==='cp'){if(L.cps.includes(x))return false;L.cps.push(x);L.cps.sort((a,b)=>a-b);return true;}
  if(e==='start'){if(L.start===x)return false;L.start=x;return true;}
  if(e==='cage'){const ny=Math.min(13,y+1),why=edCageWhy(L,x,ny);if(why){status(why,5000);return false;}L.cage={x,y:ny,capt:o.capt|0};return true;}
  if(e==='sign'||e==='rest'){L.goal={type:e==='sign'?'sign':'restaurant',x};return true;}
  if(e==='cafe'){L.cafe={x,game:'slot'};return true;}
  if(e==='mvx'||e==='mvy'||e==='fall'){L.plats=L.plats.filter(p=>!(p.x===x&&p.y===y));
    L.plats.push(e==='fall'?{kind:'fall',x,y,w:o.w}:{kind:'move',x,y,w:o.w,ax:e==='mvx'?'x':'y',range:o.range});return true;}
  if(e==='cavein'){if(x>L.w-2)return false;
    if(!L.cave){const tc={...L,cave:{x,x2:-9}},why=edHoleWhy(tc,'in');if(why){status(why,5000);return false;}
      L.cave=edNewCave(x,Math.min(L.w-2,x+12));if(Math.abs(L.cave.x2-x)<2)L.cave.x2=Math.max(0,x-12);status('Peștera e pusă. Alege acum ieșirea, apoi „Intră în peșteră” ca s-o desenezi.');return true;}
    if(L.cave.x===x||Math.abs(x-L.cave.x2)<2)return false;{const why=edHoleWhy({...L,cave:{...L.cave,x}},'in');if(why){status(why,5000);return false;}}L.cave.x=x;return true;}
  if(e==='caveout'){if(!L.cave){status('Pune întâi intrarea în peșteră.');return false;}
    if(x>L.w-2||L.cave.x2===x||Math.abs(x-L.cave.x)<2)return false;{const why=edHoleWhy({...L,cave:{...L.cave,x2:x}},'out');if(why){status(why,5000);return false;}}L.cave.x2=x;return true;}
  return false;
}
// Pătrățelele dintre două puncte, ca linia să nu aibă goluri
function line(a,b,f){let x=a.x,y=a.y;const dx=Math.abs(b.x-x),dy=-Math.abs(b.y-y),sx=x<b.x?1:-1,sy=y<b.y?1:-1;let er=dx+dy,ch=false;
  for(;;){if(f(x,y))ch=true;if(x===b.x&&y===b.y)break;const e2=2*er;if(e2>=dy){er+=dy;x+=sx;}if(e2<=dx){er+=dx;y+=sy;}}return ch;}
function fillRect(a,b,erase){
  const x0=Math.min(a.x,b.x),x1=Math.max(a.x,b.x),y0=Math.min(a.y,b.y),y1=Math.max(a.y,b.y),e=tool.el;let ch=false;
  if(!erase&&!ED_TILES.includes(e)&&e!=='water'&&e!=='coin'){status('Dreptunghiul umple doar teren, blocuri sau bănuți.');return false;}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(applyAt(x,y,erase,false))ch=true;
  return ch;
}
let last=null,rect0=null,drag=null,plat0=null;
const isPlatTool=()=>tool.mode==='paint'&&['mvx','mvy','fall'].includes(tool.el);
const isPoolTool=()=>tool.mode==='paint'&&tool.el==='pool'&&!inMain();
// Lungimea: cât ai tras (un click = lungimea din opțiuni)
function placePlat(a,b){
  const e=tool.el,o=OPT[e],x=Math.min(a.x,b.x),w=a.x===b.x?o.w:Math.abs(b.x-a.x)+1,y=a.y;
  o.w=w;sendTool();
  const rest=L.plats.filter(p=>!(p.x===x&&p.y===y));
  const np=e==='fall'?{kind:'fall',x,y,w}:{kind:'move',x,y,w,ax:e==='mvx'?'x':'y',range:Math.max(1,Math.min(o.range,e==='mvy'?13-y:L.w-x-w)),speed:o.speed};
  const why=edPlatWhy({...L,plats:rest},np);if(why){status(why,5000);return false;}
  L.plats=rest;L.plats.push(np);sel={k:'plat',o:np};
  return true;
}
// Balta: cât ai tras (un click = 3 pătrate); bălțile care se suprapun se unesc
function placePool(a,b){
  const c=L.cave;let x0=Math.max(1,Math.min(a.x,b.x)),x1=Math.min(c.w-2,a.x===b.x?x0+2:Math.max(a.x,b.x));
  for(const p of c.pools)if(p[1]>=x0-1&&p[0]<=x1+1){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[1]);}
  c.pools=c.pools.filter(p=>!(p[1]>=x0&&p[0]<=x1)).concat([[x0,x1]]).sort((p,q)=>p[0]-q[0]);
  return true;
}
// Mânerele platformei care se mișcă: capătul drumului
const rangeAt=p=>p.ax==='x'?{x:p.x+p.w-1+p.range,y:p.y}:{x:p.x+((p.w-1)>>1),y:p.y+p.range};
// ---- Pointer: ce e acolo ----
// Elementul din pătrățelul (x, y): obiectul de deasupra sau terenul
function elAt(x,y){
  const d=pick(x,y),z=zone();
  if(d){if(d.k==='ent')return d.o.t;if(d.k==='coin')return 'coin';if(d.k==='gold')return {open:'gopen',brick:'gbrick',hidden:'ghidden'}[d.o.kind];
    if(['plat','pwidth','range'].includes(d.k))return d.o.kind==='fall'?'fall':d.o.ax==='x'?'mvx':'mvy';
    if(d.k==='hole')return d.h==='x'?'cavein':'caveout';if(d.k==='goal')return L.goal.type==='sign'?'sign':'rest';return d.k;}
  const c=z.grid[y][x];if(c!=='.')return c==='A'||c==='R'?'H':c;
  return inMain()&&y>=12&&z.grid[12][x]==='.'&&z.grid[13][x]==='.'?'water':null;
}
function pointAt(x,y){
  const d=pick(x,y);
  sel=d&&['plat','pwidth','range'].includes(d.k)?{k:'plat',o:d.o}:d&&d.k==='cage'?{k:'cage'}:null;
  if(!d&&'HAR'.includes(zone().grid[y][x]))sel={k:'tile',x,y,z:region};   // blocul cu putere: îi schimbi puterea
  insp=elAt(x,y);if(!insp)status('Aici nu e nimic.');
  marks();drawProps();
}
// ---- Mutarea bucăților: selecția (dreptunghi), apoi o tragi cu tot ce e în ea ----
let selR=null,marq=null,chunk=null;
const inR=(r,x,y)=>r&&x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1;
const normR=(a,b)=>({x0:Math.min(a.x,b.x),y0:Math.min(a.y,b.y),x1:Math.max(a.x,b.x),y1:Math.max(a.y,b.y)});
// Scoate din zonă tot ce e în dreptunghi și ține minte ce era
function cutR(r){
  const z=zone(),it={tiles:[],coins:[],ents:[],golds:[],plats:[]};
  for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++){const c=z.grid[y][x];if(c==='.')continue;if(!inMain()&&(x===0||x===z.w-1))continue;it.tiles.push([x,y,c]);setT(z,x,y,'.');}
  z.coins=z.coins.filter(c=>inR(r,c[0],c[1])?(it.coins.push(c),false):true);
  z.ents=z.ents.filter(e=>inR(r,e.x,e.y)?(it.ents.push(e),false):true);
  z.golds=z.golds.filter(g=>inR(r,g.x,g.y)?(it.golds.push(g),false):true);
  if(inMain())L.plats=L.plats.filter(p=>inR(r,p.x,p.y)?(it.plats.push(p),false):true);
  return it;
}
// Pune înapoi, mutat cu (dx, dy)
function pasteR(it,dx,dy){
  const z=zone(),ok=(x,y)=>x>=0&&x<z.w&&y>=0&&y<ED_ROWS&&(inMain()||(x>0&&x<z.w-1));
  for(const [x,y,c] of it.tiles)if(ok(x+dx,y+dy))setT(z,x+dx,y+dy,c);
  for(const c of it.coins)if(ok(c[0]+dx,c[1]+dy))z.coins.push([c[0]+dx,c[1]+dy]);
  for(const e of it.ents)if(ok(e.x+dx,e.y+dy))z.ents.push({t:e.t,x:e.x+dx,y:e.y+dy});
  for(const g of it.golds)if(ok(g.x+dx,g.y+dy))z.golds.push({x:g.x+dx,y:g.y+dy,kind:g.kind});
  for(const p of it.plats)if(ok(p.x+dx,p.y+dy))L.plats.push(Object.assign({},p,{x:p.x+dx,y:p.y+dy}));
}
function startChunk(x,y){const before=JSON.stringify(L),it=cutR(selR);chunk={base:JSON.stringify(L),it,x,y,r:selR,before};L=JSON.parse(before);}
function dragChunk(x,y){
  const c=chunk,dx=x-c.x,dy=y-c.y;
  L=JSON.parse(c.base);pasteR(c.it,dx,dy);
  selR={x0:c.r.x0+dx,y0:c.r.y0+dy,x1:c.r.x1+dx,y1:c.r.y1+dy};marks();commit();
}
// Selecția și ce arată Pointerul: pe harta din joc
function marks(){
  let hi=null;
  if(sel&&sel.k==='plat'&&L.plats.includes(sel.o)){const p=sel.o;hi={x0:p.x,y0:p.y,x1:p.x+p.w-1,y1:p.y};}
  else if(sel&&sel.k==='cage'&&L.cage)hi={x0:L.cage.x,y0:L.cage.y-3,x1:L.cage.x,y1:L.cage.y-1};
  send('edMarks',{sel:selR,hi:tool.mode==='pointer'||tool.mode==='move'?hi:null});
}
function clearSel(){if(selR||marq){selR=null;marq=null;marks();}}
function delSel(){if(!selR||playing)return;begin();cutR(selR);selR=null;marks();commit();}
function onPtr(p){
  hover=p;showPos();
  if(playing||p.t==='hover'||(p.r||'main')!==region){drawMap();return;}
  const erase=p.b===2||tool.mode==='erase';
  if(tool.mode==='pointer'&&!erase){if(p.t==='down')pointAt(p.x,p.y);return;}
  if(tool.mode==='move'&&!erase){
    if(p.t==='down'){begin();
      if(inR(selR,p.x,p.y)){startChunk(p.x,p.y);return;}
      drag=pick(p.x,p.y);
      sel=drag&&['plat','pwidth','range'].includes(drag.k)?{k:'plat',o:drag.o}:drag&&drag.k==='cage'?{k:'cage'}:null;
      if(drag){selR=null;marks();drawProps();return;}
      if(zone().grid[p.y][p.x]!=='.'){selR={x0:p.x,y0:p.y,x1:p.x,y1:p.y};startChunk(p.x,p.y);return;}   // un bloc / o bucată: o apuci direct
      selR=null;marq={x:p.x,y:p.y};marks();drawProps();return;}
    if(p.t==='move'){
      if(chunk){dragChunk(p.x,p.y);return;}
      if(marq){selR=normR(marq,p);marks();return;}
      if(drag&&moveTo(drag,p.x,p.y))commit();return;}
    if(p.t==='up'){
      if(chunk&&selR&&selR.x0===selR.x1&&selR.y0===selR.y1&&!chunk.it.coins.length)selR=null;   // un singur bloc: fără selecție rămasă
      if(drag&&drag.k==='cp')L.cps.sort((a,b)=>a-b);
      chunk=null;marq=null;drag=null;pending=null;marks();}
    return;}
  if(p.t==='down'){
    begin();last={x:p.x,y:p.y};
    if(tool.mode==='rect'){rect0={x:p.x,y:p.y};return;}
    if((isPlatTool()&&inMain()||isPoolTool())&&!erase){plat0={x:p.x,y:p.y};return;}   // platforma, balta: se pun când dai drumul
    if(applyAt(p.x,p.y,erase,true))commit();
    return;}
  if(p.t==='move'){
    if(tool.mode==='move'&&!erase){if(drag&&moveTo(drag,p.x,p.y))commit();return;}
    if(tool.mode==='rect')return;
    if(last&&line(last,p,(x,y)=>applyAt(x,y,erase,false)))commit();
    last={x:p.x,y:p.y};return;}
  if(p.t==='up'){
    if(tool.mode==='rect'&&rect0){if(fillRect(rect0,p,erase))commit();rect0=null;}
    if(plat0){if(isPoolTool()?placePool(plat0,p):placePlat(plat0,p))commit();plat0=null;}
    if(drag&&drag.k==='cp')L.cps.sort((a,b)=>a-b);
    drag=null;last=null;pending=null;}
}

// ---- Bara de sus ----
const nameIn=$('#name');
nameIn.addEventListener('input',()=>{L.name=nameIn.value.toUpperCase();changed();});
$('#biome').addEventListener('click',e=>{const b=e.target.closest('[data-biome]');if(!b||b.disabled||playing||L.biome===b.dataset.biome)return;
  begin();L.biome=b.dataset.biome;
  if(L.biome!=='iarna')for(let x=0;x<L.w;x++)if(L.grid[12][x]==='I')setT(L,x,12,'.');   // gheața există doar iarna
  if(!isSnow()&&tool.el==='I')setTool(null,'D');
  commit();});
$('#time').addEventListener('click',e=>{const b=e.target.closest('[data-night]');if(!b||b.disabled||playing)return;const n=b.dataset.night==='1';if(L.night===n)return;begin();L.night=n;commit();});
// Lungimea drumului: ce rămâne în afară se scoate sau se trage înapoi
function resize(w){
  w=Math.max(ED_MIN_W,Math.min(ED_MAX_W,w));if(w===L.w)return;
  L.grid=L.grid.map((r,y)=>w>L.w?r+(y>=12?'D':'.').repeat(w-L.w):r.slice(0,w));
  L.w=w;const inW=x=>x<w;
  L.coins=L.coins.filter(c=>inW(c[0]));L.ents=L.ents.filter(m=>inW(m.x));L.golds=L.golds.filter(g=>inW(g.x));L.cps=L.cps.filter(inW);
  L.plats=L.plats.filter(p=>inW(p.x));if(L.start>=w)L.start=w-1;
  if(L.cage&&!inW(L.cage.x))L.cage=null;if(L.goal&&!inW(L.goal.x))L.goal=null;if(L.cafe&&!inW(L.cafe.x))L.cafe=null;
  if(L.cave){L.cave.x=Math.min(L.cave.x,w-2);L.cave.x2=Math.min(L.cave.x2,w-2);if(Math.abs(L.cave.x-L.cave.x2)<2)L.cave.x2=Math.max(0,L.cave.x-3);}
}
$$('[data-len]').forEach(b=>b.addEventListener('click',()=>{if(playing)return;begin();resize(L.w+(+b.dataset.len));commit();}));
$('#undo').addEventListener('click',undoIt);
$('#redo').addEventListener('click',redoIt);
// Fereastra de confirmare: „Nu” e ales din start
const askBox=$('#ask');let askFn=null;
function ask(title,text,yes,fn){askFn=fn;$('#askT').textContent=title;$('#askP').textContent=text;$('#askYes').innerHTML=pix('x')+yes;askBox.hidden=false;$('#askNo').focus();}
const askClose=ok=>{askBox.hidden=true;const f=askFn;askFn=null;if(ok&&f)f();};
$('#askNo').addEventListener('click',()=>askClose(false));
$('#askYes').addEventListener('click',()=>askClose(true));
askBox.addEventListener('click',e=>{if(e.target===askBox)askClose(false);});
askBox.addEventListener('keydown',e=>{if(e.code==='Escape'){e.stopPropagation();askClose(false);}});
$('#new').addEventListener('click',()=>{if(playing)return;ask('Pornești de la zero?','Se șterge tot ce ai desenat și rămâne o pânză goală. Poți anula după aceea cu Ctrl+Z.','Da, șterge tot',()=>{begin();L=edNewLevel();afterLoad();commit();});});
// Testarea: întâi spune ce lipsește (dar te lasă să joci)
const godIn=$('#god');
godIn.addEventListener('change',()=>send('edGod',{v:godIn.checked}));
function warnings(){
  const w=[];
  if(L.cage){const why=edCageWhy(L,L.cage.x,L.cage.y);if(why)w.push(why);}
  {const why=L.plats.map(p=>edPlatWhy(L,p)).find(s=>s);if(why)w.push(why);}
  for(const k of ['in','out']){const why=edHoleWhy(L,k);if(why)w.push(why);}
  if(!L.goal)w.push('Nivelul n-are final (semn sau restaurant): îl poți testa, dar nu-l poți termina.');
  if(L.cage&&!L.ents.some(m=>m.t==='man'||m.t==='boy')&&!(L.cave&&L.cave.ents.some(m=>m.t==='man'||m.t==='boy')))w.push('Colivia n-are cheie: pune un ucenic sau un fermier.');
  return w;
}
function play(from){if(playing)return;const w=warnings();if(w.length)status(w.join(' '),7000);playing=true;syncUI();send('edPlay',{L,from,god:godIn.checked});focusGame();}
function stop(){send('edStop');focusGame();}
$('#test').addEventListener('click',()=>{if(playing)stop();else play(null);});
$('#here').addEventListener('click',()=>play(region==='cave'&&L.cave?L.cave.x:Math.min(L.w-1,Math.floor(view.cam)+3)));
// Peștera: intri în cameră, ieși, o ștergi
function setRegion(r){region=r==='cave'&&L.cave?'cave':'main';send('edRegion',{r:region});
  if(!CAVE_EL.has(tool.el)&&region==='cave')setTool(null,'D');syncUI();drawMap();}
$('#enterCave').addEventListener('click',()=>{if(L.cave&&!playing)setRegion('cave');});
$('#surface').addEventListener('click',()=>setRegion('main'));
$('#delCave').addEventListener('click',()=>{if(!L.cave||playing)return;ask('Ștergi peștera?','Se scot intrarea, ieșirea și tot ce ai desenat în cameră. Poți anula după aceea cu Ctrl+Z.','Da, șterge peștera',()=>{begin();L.cave=null;commit();});});
$$('[data-clen]').forEach(b=>b.addEventListener('click',()=>{const c=L.cave;if(!c||playing)return;
  const w=Math.max(ED_CAVE_MIN,Math.min(ED_CAVE_MAX,c.w+(+b.dataset.clen)));if(w===c.w)return;begin();
  const d=w-c.w,cut=c.w-1;   // coloanele de la cut încolo se mută cu d
  c.grid=c.grid.map((r,y)=>d>0?r.slice(0,cut)+(y<4||y>=12?'D':'.').repeat(d)+r.slice(cut):r.slice(0,cut+d)+r.slice(cut));
  c.w=w;const keep=x=>d>0||x<cut+d,mv=x=>x>=cut?x+d:x;
  c.coins=c.coins.filter(q=>keep(q[0])).map(q=>[mv(q[0]),q[1]]);c.ents=c.ents.filter(m=>keep(m.x));c.ents.forEach(m=>m.x=mv(m.x));
  c.golds=c.golds.filter(g=>keep(g.x));c.golds.forEach(g=>g.x=mv(g.x));
  c.gems=c.gems.filter(g=>typeof g!=='number'||keep(g));c.bats=c.bats.filter(keep);c.fall=c.fall.filter(keep);
  c.pools=c.pools.filter(p=>keep(p[1]));c.in=Math.min(c.in,w-3);c.out=Math.min(c.out,w-3);commit();}));
// Uneltele
function setTool(mode,el){if(el&&el!==tool.el)sel=null;if(el||(mode&&mode!==tool.mode)){insp=null;clearSel();}if(mode)tool.mode=mode;if(el)tool.el=el;if(el&&(tool.mode==='erase'||tool.mode==='pointer'))tool.mode='paint';sendTool();marks();syncUI();}
const sendTool=()=>send('edTool',{mode:tool.mode,el:tool.el,opt:OPT[tool.el]||{}});
$('#modes').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)setTool(b.dataset.mode);});
$('#pal').addEventListener('click',e=>{const b=e.target.closest('[data-el]');if(b&&!b.disabled)setTool(null,b.dataset.el);});
function keyCmd(k){if(k==='esc')clearSel();else if(k==='del')delSel();else if(k==='undo')undoIt();else if(k==='redo')redoIt();else if(MODES.some(m=>m.id===k))setTool(k);}
addEventListener('keydown',e=>{
  if(e.target===nameIn||!askBox.hidden)return;
  if((e.ctrlKey||e.metaKey)&&e.code==='KeyZ'){e.preventDefault();keyCmd(e.shiftKey?'redo':'undo');}
  else if((e.ctrlKey||e.metaKey)&&e.code==='KeyY'){e.preventDefault();keyCmd('redo');}
  else if(e.code==='Escape')keyCmd('esc');
  else if(e.code==='Delete'||e.code==='Backspace'){e.preventDefault();keyCmd('del');}
  else if(!e.ctrlKey&&!e.metaKey&&!e.altKey){const m=MODES.find(m=>'Key'+m.k===e.code);if(m)setTool(m.id);}
});
// ---- Panoul din dreapta: poza elementului, ce face, setările lui ----
const DESC={D:'Pământ. Iarba, marginile și colțurile se pun singure.',Z:'Deal din spate, mai închis: pe iarba lui de sus se poate sta.',
  W:'Deal și mai din spate. Se pune după cele din față.',Y:'Pasaj prin deal: scobit în pământ, treci prin el.',X:'Piatră: bloc tare, pentru trepte.',
  I:'Gheață peste apă, pe rândul solului. Crapă dacă stai pe ea.',water:'Groapă cu apă: scoate solul din toată coloana.',
  '^':'Țepi: te rănesc dacă sari pe ei.','=':'Scândură: stai pe ea, treci prin ea de dedesubt.',B:'Cărămidă: o spargi doar când ești mare.',
  M:'Bloc M: lovit de dedesubt, dă un bănuț.',H:'Bloc cu putere: dă grăunte, boabă de foc sau afină de gheață.',coin:'Bănuț în aer. La 50 primești o viață.',
  cp:'Checkpoint: dacă mori, reapari aici.',start:'De aici pornește curcanul.',gopen:'Pană de aur la vedere, greu de luat.',
  gbrick:'Pană de aur într-o cărămidă: iese când o spargi.',ghidden:'Pană de aur într-un bloc invizibil: apare când îl lovești.',
  cage:'Colivia cu un curcan prins. Cheia o are un ucenic sau un fermier.',sign:'Semnul de final: treci de el și termini nivelul.',
  rest:'Restaurantul MESOPOTAMIA: intri pe ușă cu ↑ și termini jocul.',cafe:'MesoCafé: înăuntru, Moș Curcan și mini-jocul.',
  mvx:'Platformă care merge stânga-dreapta.',mvy:'Platformă care urcă și coboară.',fall:'Platformă care se sfărâmă după ce stai pe ea, apoi revine.',
  boy:'Ucenic: se plimbă, nu te urmărește.',man:'Fermier cu furcă: te urmărește și te împunge.',bomb:'Bombă: își aprinde fitilul când te apropii.',
  cavein:'Intrarea în peșteră: pământ crăpat, îl spargi cu săritură + ↓.',caveout:'Ieșirea din peșteră, la suprafață.',
  gem:'Cristal: pe jos, în tavan (click chiar sub tavan) sau, lângă pereți, în perete.',bat:'Liliac: atârnă de tavan și zboară când treci.',icicle:'Țurțure: cade când treci pe sub el.',
  pool:'Baltă pe podeaua peșterii. Tragi cât de lată o vrei; pot fi oricâte.',cin:'Puțul prin care cazi în peșteră. Lasă-l liber deasupra.',
  cout:'Puțul prin care ieși: sari în el de dedesubt. Lasă-l liber deasupra.'};
const propsBox=$('#props');
// Ce schimbi: obiectul ales sau setările pentru cele noi
function propTarget(){
  if(sel&&sel.k==='plat'&&L.plats.includes(sel.o)){const p=sel.o;return {o:p,live:true,el:p.kind==='fall'?'fall':p.ax==='x'?'mvx':'mvy'};}
  if((tool.el==='cage'&&tool.mode!=='pointer')||(sel&&sel.k==='cage'&&L.cage))return {o:L.cage||OPT.cage,live:!!L.cage,el:'cage'};
  if(sel&&sel.k==='tile'&&sel.z===region&&'HAR'.includes(zone().grid[sel.y][sel.x]))return {o:{kind:kindOf(zone().grid[sel.y][sel.x])},live:true,el:'H'};
  if(tool.mode==='pointer')return {o:null,live:false,el:insp,info:true};
  return {o:OPT[tool.el]||null,live:false,el:tool.el};
}
function drawProps(){
  const t=propTarget();
  if(t.info&&!t.el){propsBox.innerHTML='<section><p class="hint"><b>Pointer:</b> dai click pe orice din joc ca să vezi aici ce e. La platforme și la colivie îi schimbi și setările.</p></section>';return;}
  const el=ELS.find(e=>e.id===t.el)||{name:t.el},o=t.o,src=ICONS[region==='cave'&&t.el==='D'?'Dc':t.el==='H'&&o&&o.kind&&o.kind!=='normal'?'H_'+o.kind:t.el];   // în peșteră: pământul peșterii
  const k=ICON_K[t.el]?ICON_K[t.el]*1.5:3;
  const pic=el.px?pix(el.px):src?`<img src="${src}" alt="" data-k="${k}">`:'';
  const step=(key,lab,txt)=>`<div class="opt"><span>${lab}</span><span class="len"><button class="btn sq" data-o="${key}" data-d="-1">−</button><b>${txt!==undefined?txt:o[key]}</b><button class="btn sq" data-o="${key}" data-d="1">+</button></span></div>`;
  let h=`<section><div class="ihead"><span class="big">${pic}</span><div><b>${el.name}</b><small>${DESC[t.el]||''}</small></div></div>`;
  if(o&&t.el==='H'){
    h+=`<p class="ictx">${t.live?`Blocul ales · coloana ${sel.x}, rândul ${sel.y}`:'Pentru blocurile pe care le pui'}</p><div class="opt"><span>Puterea</span></div><div class="seg pw">`+
      Object.keys(POWER).map(k=>`<button data-kind="${k}" aria-pressed="${o.kind===k}">${ICONS[k==='normal'?'H':'H_'+k]?`<img src="${ICONS[k==='normal'?'H':'H_'+k]}" alt="">`:''}${POWER_NAMES[k]}</button>`).join('')+'</div>';
  }else if(o&&(t.el==='mvx'||t.el==='mvy'||t.el==='fall')){
    h+=`<p class="ictx">${t.live?`Platforma aleasă · coloana ${o.x}, rândul ${o.y}`:'Pentru platformele pe care le pui'}</p>`;
    h+=step('w','Lungime (pătrate)');
    if(t.el!=='fall')h+=step('range',t.el==='mvx'?'Cât merge → (pătrate)':'Cât coboară ↓ (pătrate)')+step('speed','Viteză',ED_SPEED_NAMES[(o.speed||3)-1]);
    if(t.live)h+='<button class="btn" data-del="plat" style="margin-top:8px">'+pix('x')+'Șterge platforma</button>';
  }else if(t.el==='cage'){
    h+=`<p class="ictx">${t.live?`Colivia pusă · coloana ${L.cage.x}`:'Pentru colivia pe care o pui'}</p><div class="capts">`+CAPT_NAMES.map((n,i)=>
      `<button class="capt" data-capt="${i}" aria-pressed="${(o.capt|0)===i}" title="${n}">${ICONS.capt&&ICONS.capt[i]?`<img src="${ICONS.capt[i]}" alt="">`:''}<span>${n}</span></button>`).join('')+'</div>';
  }
  h+='</section><section><p class="hint">Cu <b>Pointer (P)</b> dai click pe orice ca să vezi ce e; la platforme și la colivie îi schimbi setările aici. Cu <b>Mutare (V)</b> tragi orice: obiecte, blocuri sau o bucată întreagă (tragi întâi un dreptunghi pe un loc gol). <b>Delete</b> șterge bucata aleasă, <b>Esc</b> o lasă.</p></section>';
  propsBox.innerHTML=h;
  propsBox.querySelectorAll('img[data-k]').forEach(img=>{const kk=+img.dataset.k;const f=()=>{img.style.width=Math.round(img.naturalWidth*kk)+'px';img.style.height=Math.round(img.naturalHeight*kk)+'px';};if(img.complete)f();else img.onload=f;});
}
propsBox.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||playing)return;const t=propTarget(),o=t.o;if(!o)return;
  if(b.dataset.del==='plat'&&t.live){begin();L.plats=L.plats.filter(p=>p!==o);sel=null;commit();return;}
  if(b.dataset.kind){const k=b.dataset.kind;
    if(t.live){const z=zone(),c=POWER[k];if(z.grid[sel.y][sel.x]!==c){begin();setT(z,sel.x,sel.y,c);commit();}}else{OPT.H.kind=k;sendTool();drawProps();}
    return;}
  if(b.dataset.capt!==undefined){const c=+b.dataset.capt;OPT.cage.capt=c;if(L.cage&&L.cage.capt!==c){begin();L.cage.capt=c;commit();}sendTool();drawProps();return;}
  const key=b.dataset.o;if(!key)return;
  const max=key==='speed'?5:key==='w'?(t.live?L.w-o.x:L.w):t.el==='mvy'?(t.live?13-o.y:13):(t.live?L.w-o.x-o.w:L.w);
  const v=Math.max(1,Math.min(Math.max(1,max),(o[key]||(key==='speed'?3:1))+(+b.dataset.d)));if(v===o[key])return;
  if(t.live){const tp={...o,[key]:v};if(key==='w'&&o.kind==='move'&&o.ax==='x')tp.range=Math.max(1,Math.min(o.range,L.w-o.x-v));
    const why=key!=='speed'&&edPlatWhy({...L,plats:L.plats.filter(p=>p!==o)},tp);   // încercat pe o copie
    if(why){status(why,5000);return;}
    begin();o[key]=v;if(key==='w'&&o.kind==='move'&&o.ax==='x')o.range=Math.max(1,Math.min(o.range,L.w-o.x-o.w));OPT[t.el][key]=v;commit();}
  else{o[key]=v;sendTool();drawProps();}
});

// ---- Ce se vede în panou ----
function syncUI(){
  if(document.activeElement!==nameIn)nameIn.value=L.name;
  $$('[data-biome]').forEach(b=>press(b,b.dataset.biome===L.biome));
  $$('[data-night]').forEach(b=>press(b,(b.dataset.night==='1')===L.night));
  $('#len').textContent=L.w;
  $('#undo').disabled=!undo.length||playing;$('#redo').disabled=!redo.length||playing;
  $$('[data-mode]').forEach(b=>press(b,b.dataset.mode===tool.mode));
  const cave=region==='cave';
  $$('[data-el]').forEach(b=>{press(b,b.dataset.el===tool.el&&!['erase','move','pointer'].includes(tool.mode));
    const el=ELS.find(e=>e.id===b.dataset.el);
    b.disabled=(!!el.snow&&!isSnow())||(cave&&!CAVE_EL.has(el.id))||(!cave&&['gem','bat','icicle','pool','cin','cout'].includes(el.id));
    b.hidden=cave&&!!el.main;
    b.title=el.snow&&!isSnow()?el.name+' (doar iarna)':el.name;});
  $$('[data-zone]').forEach(s=>{s.hidden=s.dataset.zone!==(cave?'cave':'main');});
  $('#caveIn').hidden=!cave;
  if(L.cave)$('#clen').textContent=L.cave.w;
  $('#enterCave').disabled=!L.cave||playing;$('#delCave').disabled=!L.cave||playing;
  const t=$('#test');t.className='btn '+(playing?'stop':'primary');t.innerHTML=pix(playing?'stop':'play')+(playing?'Oprește':'Testează');
  t.title=playing?'Înapoi la desenat':'Joacă nivelul de la start';
  $('#here').disabled=playing;$('#here').title=cave?'Testează de la intrarea în peșteră':'Testează din stânga ecranului de acum';
  mainEl.classList.toggle('playing',playing);
  $$('.bar [data-biome],.bar [data-night],.bar [data-len],#new').forEach(b=>{b.disabled=playing;});
  $('#pal').style.opacity=playing?0.45:1;$('#pal').style.pointerEvents=playing?'none':'';
  drawProps();
}
let statusMsg='',statusT=0,statusLen=3000;
function status(s,ms){statusMsg=s;statusT=performance.now();statusLen=ms||3500;showPos();}
function showPos(){
  const st=$('#status');
  if(statusMsg&&performance.now()-statusT<statusLen)st.textContent=statusMsg;
  else if(playing)st.textContent='Testezi nivelul: ← → mergi, Space sari, X fugi. „Oprește” te întoarce la desenat.';
  else if(region==='cave')st.textContent=`Camera peșterii · ${L.cave?L.cave.w:0} coloane · desenezi înăuntru`;
  else st.textContent=`${L.name||'NIVEL'} · ${ED_BIOMES[L.biome].name}, ${L.night?'noapte':'zi'} · ${L.w} coloane`;
  $('#pos').textContent=hover&&!playing?`coloana ${hover.x} · rândul ${hover.y}`:'';
}
setInterval(showPos,1000);

// ---- Mesajele de la joc ----
addEventListener('message',e=>{
  if(e.source!==frame.contentWindow||!e.data)return;const d=e.data;
  if(d.edIcons)onIcons(d.edIcons,d.edTheme);
  if(d.edView){view=d.edView;const p=view.state!=='edit';if(p!==playing){playing=p;syncUI();}
    // După test poți rămâne în peșteră: panoul trece și el acolo
    if(!playing&&view.region&&view.region!==region){region=view.region==='cave'&&L.cave?'cave':'main';syncUI();}
    showPos();drawMap();}
  if(d.edPtr)onPtr(d.edPtr);
  if(d.edKey)keyCmd(d.edKey);
});
function onIcons(ic,th){
  THEME=th;ICONS=ic;
  $$('img[data-icon]').forEach(img=>{const src=ic[img.dataset.icon];if(!src)return;const k=ICON_K[img.dataset.icon]||2;
    img.onload=()=>{img.style.width=Math.round(img.naturalWidth*k)+'px';img.style.height=Math.round(img.naturalHeight*k)+'px';};img.src=src;});
  const logo=$('#logo');if(ic.head&&!logo.src)logo.src=ic.head;
  drawProps();drawMap();
}
frame.addEventListener('load',()=>{send('edHello');sendTool();send('edLevel',{L});if(region==='cave')send('edRegion',{r:'cave'});focusGame();});

// ---- Harta mică: drumul sau camera peșterii ----
const mapCv=$('#map'),mg=mapCv.getContext('2d');
const TILE_COL={B:'#c98a4b',M:'#f2b630',H:'#f2b630',A:'#8ccfee',R:'#e8402c',X:'#8a8fa0','=':'#b5793a','^':'#d8dce6',I:'#dff4ff'};
function drawMap(){
  const dpr=devicePixelRatio||1,Wd=Math.round(mapCv.clientWidth*dpr),Hd=Math.round(mapCv.clientHeight*dpr);
  if(!Wd||!Hd)return;if(mapCv.width!==Wd||mapCv.height!==Hd){mapCv.width=Wd;mapCv.height=Hd;}
  const th=THEME||{sky:['#4fb4f0','#b4e6fc'],grass:'#5ac04a',dirt:'#8a5a34',water:'#2a6aa8',night:false};
  const cave=region==='cave'&&L.cave,z=cave?L.cave:L,sx=Wd/z.w,rh=Hd/ED_ROWS,cell=(x,y,w,h,c)=>{mg.fillStyle=c;mg.fillRect(Math.floor(x*sx),Math.round(y*rh),Math.max(1,Math.ceil(w*sx)),Math.max(1,Math.round(h*rh)));};
  if(cave){mg.fillStyle='#1a1424';mg.fillRect(0,0,Wd,Hd);}
  else{const sky=mg.createLinearGradient(0,0,0,Hd);th.sky.forEach((c,i)=>sky.addColorStop(i/Math.max(1,th.sky.length-1),c));mg.fillStyle=sky;mg.fillRect(0,0,Wd,Hd);}
  for(let x=0;x<z.w;x++){
    const pit=!cave&&z.grid[12][x]==='.'&&z.grid[13][x]==='.';
    for(let y=0;y<ED_ROWS;y++){const c=z.grid[y][x];
      if(c==='.'){if(pit&&y>=12)cell(x,y===12?12.3:13,1,y===12?0.7:1,th.water);continue;}
      if(c==='D'){const top=y===0||!'DZW'.includes(z.grid[y-1][x]);cell(x,y,1,1,th.dirt);if(top&&!cave)cell(x,y,1,0.45,th.grass);continue;}
      if(c==='Z'||c==='W'){cell(x,y,1,1,c==='Z'?'rgba(70,40,30,.55)':'rgba(70,40,30,.35)');continue;}
      if(c==='Y'){cell(x,y,1,1,'rgba(20,10,10,.6)');continue;}
      if(c==='='){cell(x,y,1,0.4,TILE_COL[c]);continue;}
      if(c==='I'){cell(x,y,1,0.4,TILE_COL[c]);cell(x,13,1,1,th.water);continue;}
      cell(x,y,1,1,TILE_COL[c]||'#888');}
  }
  if(th.night&&!cave){mg.fillStyle='rgba(12,18,56,.4)';mg.fillRect(0,0,Wd,Hd);}
  // Lucrurile puse
  const dot=(x,y,c,r)=>{mg.fillStyle=c;mg.beginPath();mg.arc((x+0.5)*sx,(y+0.5)*rh,Math.max(1.5*dpr,rh*(r||0.35)),0,Math.PI*2);mg.fill();};
  const MOB={boy:'#f4f4f4',man:'#ff4a4a',bomb:'#ffa024'};
  for(const [x,y] of z.coins)cell(x+0.3,y+0.3,0.4,0.4,'#ffd23f');
  for(const g of z.golds){mg.strokeStyle='#ffd23f';mg.lineWidth=dpr;const cx=(g.x+0.5)*sx,cy=(g.y+0.5)*rh,r=Math.max(2.5*dpr,rh*0.4);
    mg.beginPath();mg.moveTo(cx,cy-r);mg.lineTo(cx+r,cy);mg.lineTo(cx,cy+r);mg.lineTo(cx-r,cy);mg.closePath();mg.stroke();}
  for(const m of z.ents)dot(m.x,m.y-0.1,MOB[m.t]);
  if(cave){const ctop=x=>{let y=0;while(y<12&&z.grid[y][x]==='D')y++;return y;};
    for(const g of z.gems)if(typeof g==='number')cell(g+0.2,11,0.6,1,'#a070f0');else if(g[0]==='C')cell(g[1]+0.2,ctop(g[1]),0.6,1,'#a070f0');else cell(g[0]==='L'?1:z.w-2,g[1],1,1,'#a070f0');
    const top=x=>{let y=0;while(y<12&&z.grid[y][x]==='D')y++;return y;};
    for(const b of z.bats)cell(b+0.1,top(b),0.8,0.4,'#8a7aa0');for(const f of z.fall)cell(f+0.25,top(f),0.5,0.8,'#c8b8a0');
    for(const p of z.pools)cell(p[0],11.6,p[1]-p[0]+1,0.4,'#4a8ad0');
    cell(z.in,0,2,0.6,'#9fe8ff');cell(z.out,0,2,0.6,'#7fff7f');}
  else{
    for(const c of L.cps){cell(c+0.45,8.5,0.1,3.5,'#cfd3dc');cell(c+0.55,8.5,0.6,0.5,'#ffcf40');}
    for(const p of L.plats){cell(p.x,p.y,p.w,0.45,p.kind==='fall'?'#9a7046':'#e0a050');if(p.kind==='move'){mg.globalAlpha=0.35;if(p.ax==='x')cell(p.x+p.w,p.y,p.range,0.45,'#e0a050');else cell(p.x,p.y,p.w,p.range,'#e0a050');mg.globalAlpha=1;}}
    if(L.cage)cell(L.cage.x,L.cage.y-2.4,1,2.4,'#c8cedc');
    if(L.goal)cell(L.goal.x,L.goal.type==='sign'?8:7,L.goal.type==='sign'?4.5:12,L.goal.type==='sign'?4:5,L.goal.type==='sign'?'#c89050':'#a8442a');
    if(L.cafe)cell(L.cafe.x,6.5,6,5.5,'#6e5040');
    if(L.cave)for(const hx of [L.cave.x,L.cave.x2])cell(hx,12,2,2,'#9fe8ff');
    const x=(L.start+0.5)*sx,y=(startRow(L.start)-0.6)*rh;mg.fillStyle='#ffd23f';mg.strokeStyle='#000';mg.lineWidth=dpr;
    mg.beginPath();mg.arc(x,y,Math.max(2.5*dpr,rh*0.45),0,Math.PI*2);mg.fill();mg.stroke();}
  // Ce se vede acum în joc
  const vx=Math.round(view.cam*sx),vw=Math.round(view.view*sx);
  mg.fillStyle='rgba(255,255,255,.14)';mg.fillRect(vx,0,vw,Hd);mg.strokeStyle='rgba(255,255,255,.75)';mg.lineWidth=dpr;mg.strokeRect(vx+dpr/2,dpr/2,vw-dpr,Hd-dpr);
  if(hover&&!playing&&(hover.r||'main')===region)cell(hover.x,0,1,14,'rgba(255,210,63,.35)');
}
// Click sau trage pe hartă: jocul arată locul acela
let mapDrag=false;
const mapCol=e=>{const r=mapCv.getBoundingClientRect();return Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*zone().w;};
const mapGo=e=>{if(!playing)send('edCam',{x:mapCol(e)-view.view/2});};
mapCv.addEventListener('pointerdown',e=>{mapDrag=true;mapCv.setPointerCapture(e.pointerId);mapGo(e);});
mapCv.addEventListener('pointermove',e=>{if(mapDrag)mapGo(e);});
mapCv.addEventListener('pointerup',()=>{mapDrag=false;focusGame();});
mapCv.addEventListener('pointercancel',()=>{mapDrag=false;});

// ---- Așezarea: jocul cât mai mare, la scară întreagă ----
function layout(){
  const r=mainEl.getBoundingClientRect(),below=mainEl.querySelector('.mapbox').offsetHeight+mainEl.querySelector('.keys').offsetHeight+20,B=4;
  const s=Math.min((r.width-B)/400,(innerHeight-r.top-14-below-B)/224),k=s>=2?Math.floor(s):Math.max(1,s);
  frame.style.width=Math.floor(400*k)+B+'px';frame.style.height=Math.floor(224*k)+B+'px';
  drawMap();
}
addEventListener('resize',layout);
syncUI();layout();showPos();
