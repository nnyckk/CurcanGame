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
  save:['######.','#.###.#','#.###.#','#.....#','#.###.#','#.###.#','#######'],
  list:['##.####','.......','##.####','.......','##.####','.......','##.####'],
  code:['.#...#.','#.....#','#.....#','#.....#','#.....#','#.....#','.#...#.'],
  plus:['...#...','...#...','...#...','#######','...#...','...#...','...#...'],
  pick:['....##.','...####','..#.##.','.#.#...','#.#....','##.....','#......'],
  grid:['#######','#.#.#.#','#######','#.#.#.#','#######','#.#.#.#','#######'],
  help:['.###...','#...#..','....#..','...#...','..#....','.......','..#....'],
  copy:['####...','#..#...','#..####','####..#','...#..#','...#..#','...####'],
  up:['...#...','..###..','.#####.','#######','..###..','..###..','..###..'],
  down:['..###..','..###..','..###..','#######','.#####.','..###..','...#...'],
  slot:['#######','#.....#','#.###.#','#.#.#.#','#.###.#','#.....#','#######'],
  cup:['.......','..###..','.#####.','.#####.','.####.#','.#####.','#######'],
  note:['..#####','..#...#','..#...#','..#...#','.##..##','###.###','.#...#.'],
  mouse:['.......','##...##','##.#.##','.#####.','.#.#.#.','..###..','...#...'],
  temp:['...#...','..#.#..','..#.#..','..###..','..###..','.#####.','..###..'],
  pit:['.......','#..#..#','#..#..#','##.##.#','#######','#######','#######'],
};
function pix(name){
  const rows=PX[name];let r='';
  rows.forEach((row,y)=>{for(let x=0;x<row.length;){if(row[x]!=='#'){x++;continue;}let w=0;while(row[x+w]==='#')w++;r+=`<rect x="${x}" y="${y}" width="${w}" height="1"/>`;x+=w;}});
  return `<svg class="px" viewBox="0 0 7 7" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
const fillPx=root=>root.querySelectorAll('[data-px]').forEach(el=>{el.outerHTML=pix(el.dataset.px);});

// ---- Uneltele și elementele ----
const MODES=[{id:'pointer',name:'Pointer',k:'V',px:'move',d:'Click pe orice ca să vezi ce e și să-i schimbi setările. Tragi ca să muți obiecte sau blocuri; pentru o bucată întreagă, tragi întâi un dreptunghi pe un loc gol.'},
  {id:'paint',name:'Pensulă',k:'B',d:'Click pune elementul ales; trage ca să desenezi.'},
  {id:'rect',name:'Dreptunghi',k:'R',d:'Tragi un dreptunghi și se umple. Cu click dreapta se golește.'},
  {id:'erase',name:'Gumă',k:'E',d:'Șterge ce e sub cursor. Click dreapta șterge cu orice unealtă.'},
  {id:'pick',name:'Pipetă',k:'I',d:'Click pe ceva din nivel și devine elementul pensulei.'}];
// g = grupa din panou; px = iconiță din panou (altfel vine din joc)
const ELS=[
  {g:'teren',id:'D',name:'Pământ'},{g:'teren',id:'Z',name:'Deal din spate'},{g:'teren',id:'W',name:'Deal îndepărtat'},
  {g:'teren',id:'Y',name:'Tunel'},{g:'teren',id:'X',name:'Piatră'},{g:'teren',id:'I',name:'Gheață',snow:true},
  {g:'teren',id:'water',name:'Apă'},{g:'teren',id:'^',name:'Țepi'},{g:'teren',id:'=',name:'Scândură'},
  {g:'cteren',id:'D',name:'Pământ',icon:'Dc'},{g:'cteren',id:'X',name:'Piatră'},{g:'cteren',id:'^',name:'Țepi'},{g:'cteren',id:'=',name:'Scândură'},{g:'cteren',id:'Y',name:'Tunel'},
  {g:'blocuri',id:'B',name:'Cărămidă'},{g:'blocuri',id:'M',name:'Bloc M'},{g:'blocuri',id:'H',name:'Bloc cu putere'},
  {g:'obiecte',id:'coin',name:'Bănuț'},{g:'obiecte',id:'cp',name:'Checkpoint'},{g:'obiecte',id:'start',name:'Start'},
  {g:'obiecte',id:'gopen',name:'Pană vizibilă'},{g:'obiecte',id:'gbrick',name:'Pană în cărămidă'},{g:'obiecte',id:'ghidden',name:'Pană ascunsă'},
  {g:'obiecte',id:'cage',name:'Colivie'},
  {g:'final',id:'sign',name:'Semn de final',px:'sign'},{g:'final',id:'rest',name:'Restaurant',px:'rest'},{g:'final',id:'cafe',name:'MesoCafé',px:'cafe'},
  {g:'platforme',id:'mvx',name:'Se mișcă ↔'},{g:'platforme',id:'mvy',name:'Se mișcă ↕'},{g:'platforme',id:'fall',name:'Cade'},
  {g:'inamici',id:'boy',name:'Ucenic'},{g:'inamici',id:'man',name:'Fermier'},{g:'inamici',id:'bomb',name:'Bombă'},{g:'inamici',id:'mole',name:'Cârtița miner'},
  {g:'pestera',id:'cavein',name:'Intrare',px:'cavein'},{g:'pestera',id:'caveout',name:'Ieșire',px:'caveout'},
  {g:'decor',id:'gem',name:'Cristal',px:'gem'},{g:'decor',id:'bat',name:'Liliac',px:'bat'},{g:'decor',id:'icicle',name:'Țurțure care cade',px:'icicle'},
  {g:'decor',id:'pool',name:'Baltă',px:'pool'},{g:'puturi',id:'cin',name:'Unde cazi',px:'cavein'},{g:'puturi',id:'cout',name:'Pe unde ieși',px:'caveout'}];
// Categoriile: zone = doar pe drum sau doar în peșteră
const CATS=[
  {id:'teren',name:'Teren',icon:'D',zone:'main',tip:'Pământ, dealuri, tunel, apă, țepi, scânduri.'},
  {id:'cteren',name:'Teren',icon:'Dc',zone:'cave',tip:'Pământul peșterii, piatră, țepi, scânduri.'},
  {id:'blocuri',name:'Blocuri',icon:'M',tip:'Cărămizi, blocuri M și blocuri cu putere.'},
  {id:'obiecte',name:'Obiecte',icon:'coin',tip:'Bănuți, pene, start, checkpoint, colivie.'},
  {id:'inamici',name:'Inamici',icon:'man',tip:'Ucenici, fermieri și bombe.'},
  {id:'platforme',name:'Platforme',icon:'mvx',tip:'Platforme care se mișcă sau cad.'},
  {id:'decor',name:'Decor',px:'gem',zone:'cave',tip:'Cristale, lilieci, țurțuri și bălți.'},
  {id:'puturi',name:'Puțuri',px:'caveout',zone:'cave',tip:'Puțul prin care cazi în peșteră și cel prin care ieși.'},
  {id:'pestera',name:'Peștera',px:'cavein',zone:'main',tip:'Intrarea, ieșirea și camera de sub pământ.'},
  {id:'final',name:'Locuri',px:'rest',zone:'main',tip:'Clădirile și semnele: semnul de final, restaurantul și MesoCafé.'}];
const cat={main:'teren',cave:'cteren'};   // categoria deschisă, pe fiecare zonă
let gridOn=true;try{gridOn=localStorage.getItem('curcan_editor_grila')!=='0';}catch(e){}
const CAVE_EL=new Set(['D','X','^','=','Y','B','M','H','coin','gopen','gbrick','ghidden','boy','man','bomb','gem','bat','icicle','pool','cin','cout','mvx','mvy','fall','start','cage','cp','mole']);
const CAPT_NAMES=['Doamna Glu-Glu',"Conu' Gușălan",'Nenea Penel','Nenea Țepoșel','Tanti Pufoaica'];
// Mărimea iconiței în panou
const ICON_K={boy:2,man:2,bomb:2,mole:2,start:2,coin:2,gopen:2,cage:0.85,mvx:1,mvy:1,fall:1};
// Opțiunile elementelor (lățimea platformei, raza, curcanul din colivie)
const POWER={normal:'H',ice:'A',fire:'R'},POWER_NAMES={normal:'Normală',ice:'Gheață',fire:'Foc'};
const kindOf=c=>c==='A'?'ice':c==='R'?'fire':'normal';
const OPT={H:{kind:'normal'},mvx:{w:3,range:6,speed:3},mvy:{w:3,range:4,speed:3},fall:{w:1},cage:{capt:0},gem:{sz:1,c:0},cafe:{game:'slot'}};
const CAFE_GAMES=[{id:'slot',name:'Blocul-slot',px:'slot',d:'Dai cu capul în bloc fix când arată ce vrei.'},
  {id:'cups',name:'Ghicește ceșcuța',px:'cup',d:'Moș ascunde premiul sub o ceașcă și le amestecă.'},
  {id:'blocks',name:'Blocurile lui Moș',px:'note',d:'Moș aprinde blocurile într-o ordine; tu le lovești la fel. Trei runde.'},
  {id:'mouse',name:'Prinde șoricelul',px:'mouse',d:'Vine în curând.',soon:true},
  {id:'hotcold',name:'Cald sau rece',px:'temp',d:'Vine în curând.',soon:true}];
const GEM_SZ=['Mic','Mijlociu','Mare'],GEM_CN=['Mov','Albastru','Verde'];
const gemSC=g=>g[0]==='L'||g[0]==='R'?[g[2],g[3]]:[g[3],g[4]];
$('#modes').innerHTML=MODES.map(m=>`<button class="mode" data-mode="${m.id}" data-tip="${m.name}|${m.k}|${m.d}"><i data-px="${m.px||m.id}"></i>${m.name}<kbd>${m.k}</kbd></button>`).join('');
$('#cats').innerHTML=CATS.map(c=>`<button class="cat" role="tab" data-cat="${c.id}" data-tip="${c.name}||${c.tip}"><span class="ci">${c.px?`<i data-px="${c.px}"></i>`:`<img data-cicon="${c.icon}" alt="">`}</span>${c.name}</button>`).join('');
for(const box of $$('.els'))box.innerHTML=ELS.filter(e=>e.g===box.dataset.group).map(e=>
  `<button class="el" data-el="${e.id}"><span class="ic">${e.px?`<i data-px="${e.px}"></i>`:`<img data-icon="${e.icon||e.id}" alt="">`}</span>${e.name}</button>`).join('');
fillPx(document);

// ---- Nivelul, anularea ----
const DRAFT='curcan_editor_ciorna';
let L=null;
try{const s=localStorage.getItem(DRAFT);if(s)L=edNorm(JSON.parse(s));}catch(e){}
if(!L)L=edNewLevel();
let undo=[],redo=[],pending=null,region='main',sel=null,insp=null;   // insp: ce arată Pointerul   // sel: platforma sau colivia aleasă
let tool={mode:'pointer',el:'D'},view={cam:0,view:25,cols:L.w,state:'edit'},playing=false,hover=null,THEME=null,ICONS={};
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
// Peștera: tavanul deasupra click-ului (rândul de sub el) și podeaua de dedesubt
const CSOL='DXBMHAR';
function hangRow(z,x,y){if(CSOL.includes(z.grid[y][x]))return -1;let r=y;while(r>0&&!CSOL.includes(z.grid[r-1][x]))r--;return r>0?r:-1;}
function floorRow(z,x,y){if(CSOL.includes(z.grid[y][x]))return -1;let r=y;while(r<ED_ROWS&&!CSOL.includes(z.grid[r][x]))r++;return r<ED_ROWS?r:-1;}
// Cristalul din pătrățelul (x, y)
function gemAt(c,x,y){return c.gems.find(g=>typeof g==='number'?g===x&&y>=7:g[0]==='C'?g[1]===x&&(y===g[2]||y===g[2]+1):g[0]==='F'?g[1]===x&&(y===g[2]-1||y===g[2]-2):g[1]===y&&((g[0]==='L'&&x<=1)||(g[0]==='R'&&x>=c.w-2)));}
const allGolds=()=>L.golds.length+(L.cave?L.cave.golds.length:0);
function setT(z,x,y,c){const r=z.grid[y];if(r[x]===c)return false;z.grid[y]=r.slice(0,x)+c+r.slice(x+1);return true;}
// Rândul pe care stă curcanul la start
function startRow(x,z=L){let gy=12;while(gy>0&&SOLID.includes(z.grid[gy-1][x]))gy--;return gy;}
// Ce ocupă fiecare lucru mare din pătrățelul (x, y), pe drum
// Steagul: pe drum de la rândul 9 în jos; în peșteră, deasupra podelei
function hitCp(x,y){const z=zone();if(!(z.cps||[]).includes(x))return false;if(inMain())return y>=9;const sr=startRow(x,z);return y>=sr-3&&y<sr;}
const anyCage=()=>L.cage||(L.cave&&L.cave.cage)||null;   // una singură: pe drum sau în peșteră
const hitCage=(x,y)=>{const c=zone().cage;return !!c&&x===c.x&&y>=c.y-3&&y<c.y;};
const hitGoal=(x,y)=>L.goal&&(L.goal.type==='sign'?x>=L.goal.x&&x<=L.goal.x+4&&y>=8:x>=L.goal.x&&x<=L.goal.x+11&&y>=7);
const hitCafe=(x,y)=>L.cafe&&x>=L.cafe.x&&x<=L.cafe.x+5&&y>=6;
const hitPlat=(x,y)=>zone().plats.find(p=>y===p.y&&x>=p.x&&x<p.x+p.w);
const hitHole=(x,y)=>L.cave&&y>=12?(x>=L.cave.x&&x<=L.cave.x+1?'x':x>=L.cave.x2&&x<=L.cave.x2+1?'x2':null):null;
// Ce obiect se poate muta din pătrățelul (x, y)
function pick(x,y){
  const z=zone();
  const e=z.ents.find(m=>m.x===x&&(m.y===y||m.y-1===y));if(e)return {k:'ent',o:e};
  const c=z.coins.find(c=>c[0]===x&&c[1]===y);if(c)return {k:'coin',o:c};
  const g=z.golds.find(g=>g.x===x&&g.y===y);if(g)return {k:'gold',o:g};
  for(const q of z.plats)if(q.kind==='move'){const h=rangeAt(q);if(h.x===x&&h.y===y)return {k:'range',o:q};}
  const p=hitPlat(x,y);if(p)return p.w>1&&x===p.x+p.w-1?{k:'pwidth',o:p}:{k:'plat',o:p,dx:x-p.x};
  if(hitCage(x,y))return {k:'cage'};
  if(hitCp(x,y))return {k:'cp',v:x};
  if(!inMain()){for(const k of ['in','out']){const H=z[k+'H']||6;if(x>=z[k]&&x<=z[k]+1&&y===H-1)return {k:'shaft',s:k};}   // mânerul puțului
    if(L.cstart===x){const sr=startRow(x,z);if(y>=sr-1&&y<=sr)return {k:'start'};}return null;}
  if(L.cstart==null){const sr=startRow(L.start);if(x===L.start&&y>=sr-1&&y<=sr)return {k:'start'};}
  const h=hitHole(x,y);if(h)return {k:'hole',h};
  if(hitCafe(x,y))return {k:'cafe',dx:x-L.cafe.x};
  if(hitGoal(x,y))return {k:'goal',dx:x-L.goal.x};
  return null;
}
function moveTo(d,x,y){
  if(d.k==='shaft'){const z=zone(),H=Math.max(1,Math.min(6,y+1));if(z[d.s+'H']===H)return false;z[d.s+'H']=H;return true;}
  if(d.k==='cage')return moveTo0(d,x,y);
  if(!inMain()){const c=L.cave,bad=()=>[c.cage?edCageWhy(c,c.cage.x,c.cage.y):'',...c.plats.map(p=>edPlatWhy(c,p))],was=bad(),keep=d.o?(Array.isArray(d.o)?d.o.slice():{...d.o}):null,cs=L.cstart,cc=c.cps.slice(),cv0=d.v;
    if(!moveTo0(d,x,y))return false;
    const now=bad(),i=now.findIndex((w,k)=>w&&!was[k]);if(i<0)return true;
    const why=now[i];L.cstart=cs;c.cps=cc;d.v=cv0;if(keep){if(Array.isArray(keep))d.o.splice(0,d.o.length,...keep);else Object.assign(d.o,keep);}
    status(why,5000);return false;}
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
  if(d.k==='start'){if(!inMain()){if(L.cstart===x)return false;L.cstart=x;return true;}if(same(L.start,x))return false;L.start=x;return true;}
  if(d.k==='cage'){const z=zone(),c=z.cage,ny=Math.min(13,y+1);if(!c||(c.x===x&&c.y===ny))return false;const why=edCageWhy(z,x,ny);if(why){status(why,5000);return false;}c.x=x;c.y=ny;return true;}
  if(d.k==='range'){const p=d.o,W=zone().w,r=Math.max(1,p.ax==='x'?Math.min(x-(p.x+p.w-1),W-p.x-p.w):Math.min(y-p.y,13-p.y));if(r===p.range)return false;p.range=r;return true;}
  if(d.k==='pwidth'){const p=d.o,W=zone().w,w=Math.max(1,Math.min(x-p.x+1,W-p.x));if(w===p.w)return false;p.w=w;if(p.kind==='move'&&p.ax==='x')p.range=Math.max(1,Math.min(p.range,W-p.x-w));return true;}
  if(d.k==='plat'){const nx=Math.max(0,Math.min(zone().w-1,x-d.dx));if(d.o.x===nx&&d.o.y===y)return false;d.o.x=nx;d.o.y=y;return true;}
  if(d.k==='hole'){const nx=Math.max(0,Math.min(L.w-2,x)),o=d.h==='x'?L.cave.x2:L.cave.x;if(L.cave[d.h]===nx||Math.abs(nx-o)<2)return false;L.cave[d.h]=nx;return true;}
  if(d.k==='cp'){const z=zone();if(z.cps.includes(x)||(!inMain()&&(x<1||x>z.w-2)))return false;const i=z.cps.indexOf(d.v);if(i<0)return false;z.cps[i]=x;d.v=x;return true;}
  if(d.k==='cafe'){const nx=Math.max(0,Math.min(L.w-1,x-d.dx));if(L.cafe.x===nx)return false;L.cafe.x=nx;return true;}
  if(d.k==='goal'){const nx=Math.max(0,Math.min(L.w-1,x-d.dx));if(L.goal.x===nx)return false;L.goal.x=nx;return true;}
  return false;
}
// Decorul peșterii din pătrățelul (x, y)
function eraseDecor(c,x,y){
  const n=JSON.stringify([c.gems,c.bats,c.fall,c.pools]),g=gemAt(c,x,y);
  if(g)c.gems=c.gems.filter(q=>q!==g);
  const at=q=>q[0]===x&&(y===q[1]||y===q[1]+1);c.bats=c.bats.filter(q=>!at(q));c.fall=c.fall.filter(q=>!at(q));
  c.pools=c.pools.filter(p=>!(x>=p[0]&&x<=p[1]&&(y===p[2]-1||y===p[2])));
  return JSON.stringify([c.gems,c.bats,c.fall,c.pools])!==n;
}
function eraseAt(x,y){
  const z=zone(),n=z.ents.length+z.coins.length+z.golds.length;
  z.ents=z.ents.filter(m=>!(m.x===x&&(m.y===y||m.y-1===y)));
  z.coins=z.coins.filter(c=>!(c[0]===x&&c[1]===y));
  z.golds=z.golds.filter(g=>!(g.x===x&&g.y===y));
  if(z.ents.length+z.coins.length+z.golds.length<n)return true;
  {const p=hitPlat(x,y);if(p){z.plats=z.plats.filter(q=>q!==p);return true;}}
  if(hitCage(x,y)){z.cage=null;return true;}
  if(hitCp(x,y)){z.cps=z.cps.filter(c=>c!==x);return true;}
  if(!inMain()&&L.cstart===x){const sr=startRow(x,z);if(y>=sr-1&&y<=sr){L.cstart=null;status('Startul s-a întors pe drum.');return true;}}
  if(inMain()){
    if(hitHole(x,y)){status('Peștera se scoate cu butonul „Șterge peștera”.');return false;}
    if(hitCafe(x,y)){L.cafe=null;return true;}
    if(hitGoal(x,y)){L.goal=null;return true;}
  }else if(eraseDecor(z,x,y))return true;
  return setT(z,x,y,'.');
}
// Locul coliviei: aerul din jur și pământul de sub ea
function cageGuard(x,y,erase){
  const c=zone().cage;if(!c||tool.el==='cage'&&!erase)return false;
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
  const e=tool.el;if(erase||e==='coin'||e==='water'||e==='mvx'||e==='mvy'||e==='fall')return false;
  const ty=e==='I'?12:y;
  return zone().plats.some(p=>{const b=edPlatBox(p);return x>=b.x0&&x<=b.x1&&ty>=b.y0&&ty<=b.y1;});
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
  if(e==='mole'&&inMain()&&!L.night){status('Cârtița iese afară doar noaptea. Pune nivelul pe Noapte sau pune-o în peșteră.');return false;}
  if(ED_MOBS.includes(e)){z.ents=z.ents.filter(m=>!(m.x===x&&m.y===y));z.ents.push({t:e,x,y});return true;}
  if(e==='gopen'||e==='gbrick'||e==='ghidden'){
    const kind=e==='gopen'?'open':e==='gbrick'?'brick':'hidden',old=z.golds.find(g=>g.x===x&&g.y===y);
    if(old){if(old.kind===kind)return false;old.kind=kind;return true;}
    if(allGolds()>=ED_GOLDS){status('Cel mult 3 pene de aur pe nivel. Șterge una ca să pui alta.');return false;}
    z.golds.push({x,y,kind});return true;}
  if(e==='gem'){const og=OPT.gem;let g;   // în perete, din tavan (click chiar sub el) sau pe podeaua de dedesubt
    if(x<=1||x>=z.w-2)g=[x<=1?'L':'R',Math.min(11,y),og.sz,og.c];
    else{const hr=hangRow(z,x,y);if(hr>=0&&y-hr<=1)g=['C',x,hr,og.sz,og.c];else{const fr=floorRow(z,x,y);if(fr<0)return false;g=['F',x,fr,og.sz,og.c];}}
    const n=g.length-2,same=z.gems.find(q=>Array.isArray(q)&&JSON.stringify(q.slice(0,n))===JSON.stringify(g.slice(0,n)));
    if(same){if(JSON.stringify(same)===JSON.stringify(g))return false;same.splice(0,same.length,...g);return true;}
    z.gems.push(g);return true;}
  if(e==='bat'||e==='icicle'){const hr=hangRow(z,x,y);if(hr<0)return false;const a=e==='bat'?z.bats:z.fall;   // cât de sus se poate, deasupra click-ului
    if(a.some(q=>q[0]===x&&q[1]===hr))return false;a.push([x,hr]);return true;}
  if(e==='cin'||e==='cout'){const k=e==='cin'?'in':'out',v=Math.max(1,Math.min(z.w-3,x));if(z[k]===v)return false;z[k]=v;return true;}
  if(e==='cage'){const ny=Math.min(13,y+1),why=edCageWhy(z,x,ny);if(why){status(why,5000);return false;}L.cage=null;if(L.cave)L.cave.cage=null;z.cage={x,y:ny,capt:o.capt|0};return true;}   // una singură
  if(e==='cp'&&!inMain()){if(z.cps.includes(x)||x<1||x>z.w-2)return false;z.cps.push(x);z.cps.sort((a,b)=>a-b);return true;}
  if(e==='start'&&!inMain()){if(L.cstart===x)return false;L.cstart=x;return true;}
  // De aici: doar pe drum
  if(e==='cp'){if(L.cps.includes(x))return false;L.cps.push(x);L.cps.sort((a,b)=>a-b);return true;}
  if(e==='start'){if(L.start===x&&L.cstart==null)return false;L.start=x;L.cstart=null;return true;}
  if(e==='sign'||e==='rest'){L.goal={type:e==='sign'?'sign':'restaurant',x};return true;}
  if(e==='cafe'){L.cafe={x,game:(L.cafe&&L.cafe.game)||OPT.cafe.game};return true;}
  if(e==='mvx'||e==='mvy'||e==='fall'){z.plats=z.plats.filter(p=>!(p.x===x&&p.y===y));
    z.plats.push(e==='fall'?{kind:'fall',x,y,w:o.w}:{kind:'move',x,y,w:o.w,ax:e==='mvx'?'x':'y',range:o.range});return true;}
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
  const z=zone(),rest=z.plats.filter(p=>!(p.x===x&&p.y===y));
  const np=e==='fall'?{kind:'fall',x,y,w}:{kind:'move',x,y,w,ax:e==='mvx'?'x':'y',range:Math.max(1,Math.min(o.range,e==='mvy'?13-y:z.w-x-w)),speed:o.speed};
  const why=edPlatWhy({...z,plats:rest},np);if(why){status(why,5000);return false;}
  z.plats=rest;z.plats.push(np);sel={k:'plat',o:np};
  return true;
}
// Balta: cât ai tras (un click = 3 pătrate); bălțile care se suprapun se unesc
function placePool(a,b){
  const c=L.cave;let x0=Math.max(1,Math.min(a.x,b.x)),x1=Math.min(c.w-2,a.x===b.x?x0+2:Math.max(a.x,b.x));
  const fy=floorRow(c,Math.max(1,Math.min(c.w-2,a.x)),a.y);if(fy<1){status('Balta stă pe o podea: dă click deasupra ei.');return false;}   // pe podeaua de sub click
  for(let x=x0;x<=x1;x++)if(!CSOL.includes(c.grid[fy][x])||CSOL.includes(c.grid[fy-1][x])){status('Balta trebuie să stea pe o podea dreaptă, toată la același nivel.',5000);return false;}
  for(const p of c.pools)if(p[2]===fy&&p[1]>=x0-1&&p[0]<=x1+1){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[1]);}
  c.pools=c.pools.filter(p=>!(p[2]===fy&&p[1]>=x0&&p[0]<=x1)).concat([[x0,x1,fy]]).sort((p,q)=>p[0]-q[0]);
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
// Pipeta: ce e sub cursor devine elementul pensulei
function pickAt(x,y){
  const z=zone();let e=elAt(x,y);
  if(!inMain()){const g=gemAt(z,x,y);if(g){if(typeof g!=='number'){const [a,c]=gemSC(g);if(a!=null)OPT.gem={sz:a,c};}e='gem';}}
  if(e==='H')OPT.H.kind=kindOf(z.grid[y][x]);
  if(!e||!ELS.some(q=>q.id===e)){status('Aici nu e nimic de luat cu pipeta.');return;}
  if(!inMain()&&!CAVE_EL.has(e)){status('Elementul ăsta nu merge în peșteră.');return;}
  setTool('paint',e);status('Pipeta a luat: '+ELS.find(q=>q.id===e).name+'. Acum desenezi cu el.');
}
function pointAt(x,y){
  const d=pick(x,y);
  sel=d&&['plat','pwidth','range'].includes(d.k)?{k:'plat',o:d.o}:d&&d.k==='cage'?{k:'cage'}:d&&d.k==='cafe'?{k:'cafe'}:null;
  if(!d&&'HAR'.includes(zone().grid[y][x]))sel={k:'tile',x,y,z:region};
  if(!d&&!inMain()){const g=gemAt(L.cave,x,y);if(g&&typeof g!=='number')sel={k:'gem',o:g};}   // cristalul: îi schimbi mărimea și culoarea   // blocul cu putere: îi schimbi puterea
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
  z.plats=z.plats.filter(p=>inR(r,p.x,p.y)?(it.plats.push(p),false):true);
  return it;
}
// Pune înapoi, mutat cu (dx, dy)
function pasteR(it,dx,dy){
  const z=zone(),ok=(x,y)=>x>=0&&x<z.w&&y>=0&&y<ED_ROWS&&(inMain()||(x>0&&x<z.w-1));
  for(const [x,y,c] of it.tiles)if(ok(x+dx,y+dy))setT(z,x+dx,y+dy,c);
  for(const c of it.coins)if(ok(c[0]+dx,c[1]+dy))z.coins.push([c[0]+dx,c[1]+dy]);
  for(const e of it.ents)if(ok(e.x+dx,e.y+dy))z.ents.push({t:e.t,x:e.x+dx,y:e.y+dy});
  for(const g of it.golds)if(ok(g.x+dx,g.y+dy))z.golds.push({x:g.x+dx,y:g.y+dy,kind:g.kind});
  for(const p of it.plats)if(ok(p.x+dx,p.y+dy))z.plats.push(Object.assign({},p,{x:p.x+dx,y:p.y+dy}));
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
  if(sel&&sel.k==='plat'&&zone().plats.includes(sel.o)){const p=sel.o;hi={x0:p.x,y0:p.y,x1:p.x+p.w-1,y1:p.y};}
  else if(sel&&sel.k==='cage'&&zone().cage){const c=zone().cage;hi={x0:c.x,y0:c.y-3,x1:c.x,y1:c.y-1};}
  send('edMarks',{sel:selR,hi:tool.mode==='pointer'?hi:null});
}
function clearSel(){if(selR||marq){selR=null;marq=null;marks();}}
function delSel(){if(!selR||playing)return;begin();cutR(selR);selR=null;marks();commit();}
// Pointer: cursorul de mutare peste ce se poate trage
function ptrCursor(p){let c='';
  if(!playing&&tool.mode==='pointer'&&(p.r||'main')===region&&p.x>=0&&p.y>=0){const z=zone();if(pick(p.x,p.y)||inR(selR,p.x,p.y)||(z.grid[p.y]&&z.grid[p.y][p.x]!=='.'))c='move';}
  try{frame.contentDocument.body.style.cursor=c;}catch(e){}}
function onPtr(p){
  hover=p;showPos();ptrCursor(p);
  if(playing||p.t==='hover'||(p.r||'main')!==region){drawMap();return;}
  const erase=p.b===2||tool.mode==='erase';
  if(tool.mode==='pick'&&!erase){if(p.t==='down')pickAt(p.x,p.y);return;}
  // Pointer: arată ce e și, tras, mută
  if(tool.mode==='pointer'&&!erase){
    if(p.t==='down'){begin();pointAt(p.x,p.y);
      if(inR(selR,p.x,p.y)){startChunk(p.x,p.y);return;}
      drag=pick(p.x,p.y);
      if(drag){selR=null;marks();drawProps();return;}
      if(zone().grid[p.y][p.x]!=='.'){selR={x0:p.x,y0:p.y,x1:p.x,y1:p.y};startChunk(p.x,p.y);return;}   // un bloc / o bucată: o apuci direct
      selR=null;marq={x:p.x,y:p.y};marks();drawProps();return;}
    if(p.t==='move'){
      if(chunk){dragChunk(p.x,p.y);return;}
      if(marq){selR=normR(marq,p);marks();return;}
      if(drag&&moveTo(drag,p.x,p.y))commit();return;}
    if(p.t==='up'){
      if(chunk&&selR&&selR.x0===selR.x1&&selR.y0===selR.y1&&!chunk.it.coins.length)selR=null;   // un singur bloc: fără selecție rămasă
      if(drag&&drag.k==='cp')zone().cps.sort((a,b)=>a-b);
      chunk=null;marq=null;drag=null;pending=null;marks();}
    return;}
  if(p.t==='down'){
    begin();last={x:p.x,y:p.y};
    if(tool.mode==='rect'){rect0={x:p.x,y:p.y};return;}
    if((isPlatTool()||isPoolTool())&&!erase){plat0={x:p.x,y:p.y};return;}   // platforma, balta: se pun când dai drumul
    if(applyAt(p.x,p.y,erase,true))commit();
    return;}
  if(p.t==='move'){
    if(tool.mode==='rect')return;
    if(last&&line(last,p,(x,y)=>applyAt(x,y,erase,false)))commit();
    last={x:p.x,y:p.y};return;}
  if(p.t==='up'){
    if(tool.mode==='rect'&&rect0){if(fillRect(rect0,p,erase))commit();rect0=null;}
    if(plat0){if(isPoolTool()?placePool(plat0,p):placePlat(plat0,p))commit();plat0=null;}
    if(drag&&drag.k==='cp')zone().cps.sort((a,b)=>a-b);
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
// ---- Nivelurile salvate (curcan_niveluri: id, nume, data, nivelul) ----
const SAVES='curcan_niveluri',CUR='curcan_editor_id';
function loadSaves(){try{const a=JSON.parse(localStorage.getItem(SAVES)||'[]');return Array.isArray(a)?a.filter(s=>s&&s.id&&s.L):[];}catch(e){return [];}}
function putSaves(a){try{localStorage.setItem(SAVES,JSON.stringify(a));return true;}catch(e){status('Nu s-a putut salva: memoria browserului e plină.',6000);return false;}}
// curId: nivelul din listă deschis acum; savedJSON: cum arăta la ultima salvare
let curId=null,savedJSON=null;
try{curId=localStorage.getItem(CUR)||null;}catch(e){}
{const s=curId&&loadSaves().find(s=>s.id===curId);if(s)savedJSON=JSON.stringify(edNorm(s.L));else curId=null;}
const BLANK=JSON.stringify(edNorm(edNewLevel()));
const dirty=()=>savedJSON===null||JSON.stringify(edNorm(L))!==savedJSON;
const blank=()=>JSON.stringify(edNorm(L))===BLANK;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
function saveLevel(){
  if(playing)return;
  const a=loadSaves(),now=Date.now(),data=edNorm(L);let s=curId&&a.find(s=>s.id===curId);
  if(s){s.name=data.name;s.date=now;s.L=data;}
  else{s={id:'n'+now.toString(36)+Math.random().toString(36).slice(2,6),name:data.name,date:now,L:data};a.unshift(s);}
  if(!putSaves(a))return false;
  {const st=loadStories();let ch=false;for(const x of st)for(const it of x.items)if(it.ref===s.id){it.L=data;ch=true;}if(ch)putStories(st);}
  curId=s.id;savedJSON=JSON.stringify(data);try{localStorage.setItem(CUR,curId);}catch(e){}
  status('„'+data.name+'” e salvat.');syncUI();if(!mineBox.hidden)drawMine();return true;
}
// Deschide alt nivel: istoria de anulare pornește de la zero
function openLevel(nl,id){
  L=edNorm(nl);curId=id||null;savedJSON=id?JSON.stringify(L):null;
  try{if(id)localStorage.setItem(CUR,id);else localStorage.removeItem(CUR);}catch(e){}
  undo=[];redo=[];pending=null;afterLoad();setRegion('main');changed();send('edLevel',{L});goStart();
}
// Înainte să pleci de pe nivelul de acum: întreabă doar dacă ai ceva nesalvat
function leaveOk(what,fn){
  if(!dirty()||blank())return fn();
  ask('Ai schimbări nesalvate','„'+L.name+'” are schimbări pe care nu le-ai salvat. Dacă '+what+', le pierzi.','Da, mergi mai departe',fn);
}
$('#new').addEventListener('click',()=>{if(playing)return;leaveOk('pornești un nivel nou',()=>{openLevel(edNewLevel(),null);status('Nivel nou. Apasă Salvează ca să-l păstrezi.');});});
$('#save').addEventListener('click',saveLevel);
// Lista
const mineBox=$('#mineBox'),codeBox=$('#codeBox'),BIO_PX={ferma:'sun',iarna:'flake',desert:'palm'},BIO_N={ferma:'Fermă',iarna:'Iarnă',desert:'Deșert'};
const helpBox=$('#helpBox');
// ---- Poveștile: până la 10 niveluri jucate unul după altul (curcan_povesti) ----
const STORIES='curcan_povesti';
let mineTab='levels',storyEdit=null;   // fila din fereastră; povestea deschisă
function loadStories(){try{const a=JSON.parse(localStorage.getItem(STORIES)||'[]');return Array.isArray(a)?a.filter(s=>s&&s.id&&Array.isArray(s.items)):[];}catch(e){return [];}}
function putStories(a){try{localStorage.setItem(STORIES,JSON.stringify(a));return true;}catch(e){status('Nu s-a putut salva povestea: memoria browserului e plină.',6000);return false;}}
const newId=()=>'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function drawStories(){
  if(storyEdit)return drawStoryEdit();
  const a=loadStories();
  let h='<div class="msep">Poveștile tale'+(a.length?' · '+a.length:'')+'</div><div class="cards">'+a.map(s=>{const n=s.items.length,b=s.items.filter(i=>i.bonus).length;
    return '<div class="card"><canvas class="thumb" data-sedit="'+s.id+'" data-sthumb="'+s.id+'"></canvas><div class="cm"><b><span class="nm">'+esc(s.name||'POVESTEA MEA')+'</span></b>'+
      '<small>'+n+(n===1?' nivel':' niveluri')+(b?' · '+b+' bonus':'')+'</small><small>'+when(s.date)+'</small></div>'+
      '<div class="ca"><button class="btn grow" data-sedit="'+s.id+'">Editează</button><button class="btn ico" data-scode="'+s.id+'" data-tip="Codul poveștii">'+pix('code')+'</button>'+
      '<button class="btn ico danger" data-sdel="'+s.id+'" data-tip="Șterge povestea">'+pix('x')+'</button></div></div>';}).join('')+
    '<button class="card new" data-snew="1">'+pix('plus')+'Poveste nouă</button></div>'+
    '<p class="hint">O poveste are până la 10 niveluri, normale sau bonus, jucate unul după altul ca jocul principal: aceleași 3 vieți, scorul se adună, puterile trec mai departe. Dacă pierzi toate viețile, o iei de la primul nivel. O joci din meniul jocului, la NIVELURILE MELE.</p>';
  $('#mineList').innerHTML=h;
  requestAnimationFrame(()=>$$('#mineList canvas[data-sthumb]').forEach(cv=>{const s=a.find(q=>q.id===cv.dataset.sthumb);if(s&&s.items[0])try{paintThumb(cv,edNorm(s.items[0].L));}catch(e){}}));
}
function drawStoryEdit(){
  const s=loadStories().find(q=>q.id===storyEdit);if(!s){storyEdit=null;return drawStories();}
  const saves=loadSaves(),full=s.items.length>=ED_STORY_MAX;
  let h='<div class="sedit"><div class="shead"><button class="btn" data-sback="1">'+pix('back')+'Poveștile mele</button>'+
    '<input class="sname" data-sname="1" maxlength="24" spellcheck="false" placeholder="NUMELE POVEȘTII" value="'+esc(s.name||'')+'"><span class="sp"></span>'+
    '<button class="btn" data-scode="'+s.id+'">'+pix('code')+'Codul poveștii</button></div>';
  h+='<div class="msep">Nivelurile, în ordinea în care se joacă · '+s.items.length+' din '+ED_STORY_MAX+'</div><div class="slist">'+(s.items.length?s.items.map((it,i)=>{const l=it.L||{};
    return '<div class="sitem"><span class="snum">'+(i+1)+'</span><canvas class="sthumb" data-ithumb="'+i+'"></canvas>'+
      '<div class="sinfo"><b>'+esc(l.name||'NIVEL')+'</b><small>'+(BIO_N[l.biome]||'Fermă')+' · '+(l.night?'noapte':'zi')+' · '+(l.w|0)+' pătrate'+(it.ref&&!loadSaves().some(q=>q.id===it.ref)?' · șters din Niveluri, rămâne aici':'')+'</small></div>'+
      '<div class="seg"><button data-skind="'+i+'" data-v="0" aria-pressed="'+!it.bonus+'">Normal</button><button data-skind="'+i+'" data-v="1" aria-pressed="'+!!it.bonus+'">'+pix('gem')+'Bonus</button></div>'+
      '<div class="smove"><button class="btn ico" data-sup="'+i+'" data-tip="Mai devreme"'+(i?'':' disabled')+'>'+pix('up')+'</button>'+
      '<button class="btn ico" data-sdown="'+i+'" data-tip="Mai târziu"'+(i<s.items.length-1?'':' disabled')+'>'+pix('down')+'</button>'+
      '<button class="btn ico danger" data-srem="'+i+'" data-tip="Scoate din poveste">'+pix('x')+'</button></div></div>';}).join('')
    :'<p class="mempty">Încă n-ai pus niciun nivel. Alege de mai jos; se joacă în ordinea de aici.</p>')+'</div>';
  h+='<div class="msep">Adaugă un nivel'+(full?' · povestea e plină (10)':'')+'</div><div class="sadd">'+(saves.length?saves.map(q=>'<button class="btn" data-sadd="'+q.id+'"'+(full?' disabled':'')+'>'+pix('plus')+esc(q.name||'NIVEL')+'</button>').join('')
    :'<p class="hint">Întâi salvează niveluri, în fila „Niveluri”.</p>')+'</div>';
  h+='<p class="hint">Povestea se salvează singură. Dacă schimbi un nivel în editor și îl salvezi, se schimbă și în poveste.</p></div>';
  $('#mineList').innerHTML=h;
  requestAnimationFrame(()=>$$('#mineList canvas[data-ithumb]').forEach(cv=>{const it=s.items[+cv.dataset.ithumb];if(it)try{paintThumb(cv,edNorm(it.L));}catch(e){}}));
}
// Schimbă povestea deschisă și o salvează
function storyMut(f,redraw=true){const a=loadStories(),s=a.find(q=>q.id===storyEdit);if(!s)return;f(s);s.date=Date.now();if(putStories(a)&&redraw)drawMine();}
// startMode: fereastra de la intrarea în editor („Ce nivel vrei să editezi?”)
let startMode=false;
const closeBoxes=()=>{mineBox.hidden=true;codeBox.hidden=true;helpBox.hidden=true;
  if(startMode){startMode=false;$('#mineT').textContent='Nivelurile mele';$('#mineSave').hidden=false;}};
function openStart(){startMode=true;mineTab='levels';storyEdit=null;$('#mineT').textContent='Ce nivel vrei să editezi?';$('#mineSave').hidden=true;drawMine();mineBox.hidden=false;
  const c=$('[data-cont]')||$('button[data-open]')||$('[data-new]');if(c)c.focus();}
function openHelp(){closeBoxes();helpBox.hidden=false;$('#helpClose').focus();}
$('#helpBtn').addEventListener('click',openHelp);$('#helpClose').addEventListener('click',closeBoxes);
helpBox.addEventListener('click',e=>{if(e.target===helpBox)closeBoxes();});
// Grila din joc: pornită sau ascunsă (ținut minte)
function toggleGrid(){gridOn=!gridOn;try{localStorage.setItem('curcan_editor_grila',gridOn?'1':'0');}catch(e){}send('edGrid',{v:gridOn});syncUI();status(gridOn?'Grila e pornită.':'Grila e ascunsă.');}
$('#gridBtn').addEventListener('click',toggleGrid);
const when=d=>{const t=new Date(d);return t.toLocaleDateString('ro-RO',{day:'numeric',month:'short'})+', '+t.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'});};
function drawMine(){
  $$('[data-mtab]').forEach(b=>press(b,b.dataset.mtab===mineTab));
  if(mineTab==='stories')return drawStories();
  const a=loadSaves(),meta=l=>{const bi=BIO_N[l.biome]?l.biome:'ferma';return BIO_N[bi]+' · '+(l.night?'noapte':'zi')+' · '+(l.w|0)+' pătrate'+(l.cave?' · peșteră':'');};
  let h='';
  // Sus, despărțit cu o linie: ce lucrai data trecută
  if(startMode&&!blank())h+='<div class="msep">Continuă de unde ai rămas</div><div class="cont"><canvas class="thumb" data-cont="1" data-thumb="draft"></canvas>'+
    '<div class="cm"><b>'+esc(L.name||'FĂRĂ NUME')+'</b><small>'+meta(L)+(dirty()?' · cu schimbări nesalvate':'')+'</small></div>'+
    '<button class="btn primary" data-cont="1">'+pix('play')+'Continuă</button></div>';
  h+='<div class="msep">Nivelurile tale'+(a.length?' · '+a.length:'')+'</div><div class="cards">'+a.map(s=>{const l=s.L||{};
    return '<div class="card"><canvas class="thumb" data-open="'+s.id+'" data-thumb="'+s.id+'"></canvas>'+
      '<div class="cm"><b><span class="nm">'+esc(s.name||'FĂRĂ NUME')+'</span>'+(s.id===curId?'<span class="tag">deschis acum</span>':'')+'</b><small>'+meta(l)+'</small><small>'+when(s.date)+'</small></div>'+
      '<div class="ca"><button class="btn grow" data-open="'+s.id+'">Deschide</button><button class="btn ico" data-copy="'+s.id+'" data-tip="Fă o copie">'+pix('copy')+'</button>'+
      '<button class="btn ico danger" data-del="'+s.id+'" data-tip="Șterge nivelul">'+pix('x')+'</button></div></div>';}).join('')+
    '<button class="card new" data-new="1">'+pix('plus')+'Nivel nou</button></div>';
  if(!a.length)h+='<p class="hint">Încă n-ai salvat niciun nivel. Desenează unul și apasă „Salvează”.</p>';
  $('#mineList').innerHTML=h;
  const byId=Object.fromEntries(a.map(s=>[s.id,s.L]));
  requestAnimationFrame(()=>$$('#mineList canvas[data-thumb]').forEach(cv=>{const l=cv.dataset.thumb==='draft'?L:byId[cv.dataset.thumb];if(l)try{paintThumb(cv,edNorm(l));}catch(e){}}));
}
// Poza nivelului: începutul lui, de la start, în culorile biomului
const BIO_COL={ferma:{sky:['#4fb4f0','#b4e6fc'],grass:'#5ac04a',dirt:'#8a5a34',water:'#2a6aa8'},
  iarna:{sky:['#8fc0e6','#dcefff'],grass:'#eef6fb',dirt:'#6e5a5e',water:'#3f74ad'},
  desert:{sky:['#f2b45e','#ffe6a8'],grass:'#e6c074',dirt:'#b9824a',water:'#2f78a8'}};
function paintThumb(cv,l){
  const dpr=devicePixelRatio||1,Wd=Math.round(cv.clientWidth*dpr),Hd=Math.round(cv.clientHeight*dpr);if(!Wd||!Hd)return;cv.width=Wd;cv.height=Hd;
  const g=cv.getContext('2d'),th=BIO_COL[l.biome]||BIO_COL.ferma,rh=Hd/ED_ROWS,n=Math.min(l.w,Math.max(8,Math.round(Wd/rh))),x0=Math.max(0,Math.min(l.w-n,(l.start|0)-4)),s=Wd/n;
  const sky=g.createLinearGradient(0,0,0,Hd);sky.addColorStop(0,th.sky[0]);sky.addColorStop(1,th.sky[1]);g.fillStyle=sky;g.fillRect(0,0,Wd,Hd);
  const cell=(x,y,w,hh,c)=>{g.fillStyle=c;g.fillRect(Math.floor((x-x0)*s),Math.floor(y*rh),Math.ceil(w*s),Math.ceil(hh*rh));};
  for(let x=x0;x<x0+n;x++){const pit=l.grid[12][x]==='.'&&l.grid[13][x]==='.';
    for(let y=0;y<ED_ROWS;y++){const c=l.grid[y][x];
      if(c==='.'){if(pit&&y>=12)cell(x,y===12?12.3:13,1,y===12?0.7:1,th.water);continue;}
      if(c==='D'){cell(x,y,1,1,th.dirt);if(y===0||!'DZW'.includes(l.grid[y-1][x]))cell(x,y,1,0.4,th.grass);continue;}
      if(c==='Z'||c==='W'){cell(x,y,1,1,c==='Z'?'rgba(70,40,30,.5)':'rgba(70,40,30,.3)');continue;}
      if(c==='Y'){cell(x,y,1,1,'rgba(20,10,10,.6)');continue;}
      if(c==='='||c==='I'){cell(x,y,1,0.4,TILE_COL[c]);continue;}
      cell(x,y,1,1,TILE_COL[c]||'#888');}}
  for(const [x,y] of l.coins)if(x>=x0&&x<x0+n)cell(x+0.3,y+0.3,0.4,0.4,'#ffd23f');
  for(const m of l.ents)if(m.x>=x0&&m.x<x0+n)cell(m.x+0.2,m.y-0.7,0.6,0.7,m.t==='man'?'#ff4a4a':m.t==='bomb'?'#202020':'#f4f4f4');
  if(l.start>=x0&&l.start<x0+n){let r=12;while(r>0&&'DBMHXI^'.includes(l.grid[r-1][l.start]))r--;cell(l.start+0.15,r-1,0.7,1,'#ffffff');cell(l.start+0.45,r-1.25,0.3,0.3,'#e8323e');}
  if(l.night){g.fillStyle='rgba(12,18,56,.45)';g.fillRect(0,0,Wd,Hd);}
}
$('#mine').addEventListener('click',()=>{if(playing)return;closeBoxes();mineTab='levels';storyEdit=null;drawMine();mineBox.hidden=false;$('#mineClose').focus();});
$('#mineClose').addEventListener('click',closeBoxes);
$('#mineSave').addEventListener('click',saveLevel);
$('#mineList').addEventListener('click',e=>{const b=e.target.closest('[data-open],[data-copy],[data-del],[data-cont],[data-new]');if(!b)return;
  if(b.dataset.cont){closeBoxes();return;}
  if(b.dataset.new){leaveOk('pornești un nivel nou',()=>{openLevel(edNewLevel(),null);closeBoxes();status('Nivel nou. Apasă Salvează ca să-l păstrezi.');});return;}
  const a=loadSaves(),id=b.dataset.open||b.dataset.copy||b.dataset.del,s=a.find(s=>s.id===id);if(!s)return;
  if(b.dataset.open){if(s.id===curId&&!dirty()){closeBoxes();return;}
    leaveOk('deschizi alt nivel',()=>{openLevel(s.L,s.id);closeBoxes();status('Ai deschis „'+L.name+'”.');});}
  else if(b.dataset.copy){const now=Date.now(),n=(s.name||'NIVEL').slice(0,18)+' COPIE',c={id:'n'+now.toString(36)+Math.random().toString(36).slice(2,6),name:n,date:now,L:Object.assign(JSON.parse(JSON.stringify(s.L)),{name:n})};
    a.splice(a.indexOf(s)+1,0,c);if(putSaves(a)){drawMine();status('Am făcut o copie: „'+n+'”.');}}
  else ask('Ștergi „'+(s.name||'nivelul')+'”?','Nivelul dispare din listă și nu se mai poate recupera.'+(s.id===curId?' Ce e acum pe ecran rămâne, dar nesalvat.':''),'Da, șterge-l',()=>{
    if(putSaves(loadSaves().filter(q=>q.id!==id))){if(id===curId){curId=null;savedJSON=null;try{localStorage.removeItem(CUR);}catch(e){}syncUI();}drawMine();status('Nivelul e șters.');}});
});
mineBox.addEventListener('click',e=>{if(e.target===mineBox)closeBoxes();});
$$('[data-mtab]').forEach(b=>b.addEventListener('click',()=>{mineTab=b.dataset.mtab;storyEdit=null;drawMine();}));
$('#mineList').addEventListener('click',e=>{
  const b=e.target.closest('[data-snew],[data-sedit],[data-sdel],[data-scode],[data-sback],[data-skind],[data-sup],[data-sdown],[data-srem],[data-sadd]');if(!b||b.disabled)return;const d=b.dataset;
  if(d.snew){const a=loadStories(),s={id:newId(),name:'POVESTEA MEA',date:Date.now(),items:[]};a.unshift(s);if(putStories(a)){storyEdit=s.id;drawMine();const n=$('.sname');if(n){n.focus();n.select();}}return;}
  if(d.sedit){storyEdit=d.sedit;drawMine();return;}
  if(d.sback){storyEdit=null;drawMine();return;}
  if(d.scode){const s=loadStories().find(q=>q.id===d.scode);if(!s)return;if(!s.items.length){status('Povestea n-are încă niciun nivel.');return;}
    showCode(edEncodeStory(s),'Codul poveștii','Copiază codul și trimite-l cuiva. El îl lipește la „Încarcă un cod” și primește toată povestea, cu nivelurile ei.');return;}
  if(d.sdel){const s=loadStories().find(q=>q.id===d.sdel);if(s)ask('Ștergi povestea „'+(s.name||'')+'”?','Povestea dispare. Nivelurile ei rămân în fila „Niveluri”.','Da, șterge-o',()=>{if(putStories(loadStories().filter(q=>q.id!==d.sdel))){drawMine();status('Povestea e ștearsă.');}});return;}
  if(d.sadd){const q=loadSaves().find(x=>x.id===d.sadd);if(q)storyMut(s=>{if(s.items.length<ED_STORY_MAX)s.items.push({ref:q.id,L:edNorm(q.L),bonus:false});});return;}
  const i=+(d.skind??d.sup??d.sdown??d.srem);
  if(d.skind!==undefined)storyMut(s=>{if(s.items[i])s.items[i].bonus=d.v==='1';});
  else if(d.sup!==undefined)storyMut(s=>{if(i>0)[s.items[i-1],s.items[i]]=[s.items[i],s.items[i-1]];});
  else if(d.sdown!==undefined)storyMut(s=>{if(i<s.items.length-1)[s.items[i+1],s.items[i]]=[s.items[i],s.items[i+1]];});
  else if(d.srem!==undefined)storyMut(s=>{s.items.splice(i,1);});
});
// Numele poveștii: se salvează pe loc, fără să redeseneze (ca să nu pierzi cursorul)
$('#mineList').addEventListener('input',e=>{if(!e.target.dataset.sname)return;const v=e.target.value.toUpperCase().slice(0,24);storyMut(s=>{s.name=v||'POVESTEA MEA';},false);});
// Codul
const codeOut=$('#codeOut'),codeIn=$('#codeIn'),codeErr=$('#codeErr');
function showCode(code,title,desc){closeBoxes();codeOut.value=code;$('#codeT').textContent=title;$('#codeDesc').textContent=desc;codeIn.value='';codeErr.hidden=true;codeBox.hidden=false;codeOut.focus();codeOut.select();}
$('#code').addEventListener('click',()=>{if(playing)return;showCode(edEncode(L),'Codul nivelului','Copiază codul și trimite-l cuiva. El îl lipește aici, la „Încarcă un cod”, și primește nivelul tău.');});
$('#codeClose').addEventListener('click',closeBoxes);
codeBox.addEventListener('click',e=>{if(e.target===codeBox)closeBoxes();});
$('#codeCopy').addEventListener('click',()=>{const done=()=>status('Codul e copiat. Lipește-l unde vrei să-l trimiți.');
  codeOut.select();if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(codeOut.value).then(done,()=>{document.execCommand('copy');done();});else{document.execCommand('copy');done();}});
codeIn.addEventListener('input',()=>{codeErr.hidden=true;});
$('#codeLoad').addEventListener('click',()=>{
  // Codul unei povești: intră în fila Povești
  if(codeIn.value.includes(ED_STORY)){const st=edDecodeStory(codeIn.value);if(!st){codeErr.hidden=false;return;}
    const a=loadStories();a.unshift({id:newId(),name:st.name,date:Date.now(),items:st.items.map(it=>({ref:null,L:it.L,bonus:it.bonus}))});
    if(putStories(a)){closeBoxes();mineTab='stories';storyEdit=null;drawMine();mineBox.hidden=false;status('Ai primit povestea „'+st.name+'”, cu '+st.items.length+' niveluri.',6000);}return;}
  const nl=edDecode(codeIn.value);if(!nl){codeErr.hidden=false;return;}
  leaveOk('încarci alt nivel',()=>{openLevel(nl,null);closeBoxes();status('Ai încărcat „'+L.name+'”. Apasă Salvează ca să-l păstrezi în listă.',6000);});});
// Testarea: întâi spune ce lipsește (dar te lasă să joci)
const godIn=$('#god');
godIn.addEventListener('change',()=>send('edGod',{v:godIn.checked}));
function warnings(){
  const w=[];
  for(const z of [L,L.cave])if(z&&z.cage){const why=edCageWhy(z,z.cage.x,z.cage.y);if(why)w.push(why);}
  {const why=L.plats.map(p=>edPlatWhy(L,p)).concat(L.cave?L.cave.plats.map(p=>edPlatWhy(L.cave,p)):[]).find(s=>s);if(why)w.push(why);}
  for(const k of ['in','out']){const why=edHoleWhy(L,k);if(why)w.push(why);}
  if(!L.goal)w.push('Nivelul n-are final (semn sau restaurant): îl poți testa, dar nu-l poți termina.');
  if(anyCage()&&!L.ents.some(m=>m.t==='man'||m.t==='boy')&&!(L.cave&&L.cave.ents.some(m=>m.t==='man'||m.t==='boy'||m.t==='mole')))w.push('Colivia n-are cheie: pune un ucenic, un fermier sau o cârtiță miner.');
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
$$('[data-region]').forEach(b=>b.addEventListener('click',()=>{if(!b.disabled&&!playing)setRegion(b.dataset.region);}));
$('#cats').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;cat[region]=b.dataset.cat;syncUI();});
$('#delCave').addEventListener('click',()=>{if(!L.cave||playing)return;ask('Ștergi peștera?','Se scot intrarea, ieșirea și tot ce ai desenat în cameră. Poți anula după aceea cu Ctrl+Z.','Da, șterge peștera',()=>{begin();L.cave=null;L.cstart=null;commit();});});
$$('[data-clen]').forEach(b=>b.addEventListener('click',()=>{const c=L.cave;if(!c||playing)return;
  const w=Math.max(ED_CAVE_MIN,Math.min(ED_CAVE_MAX,c.w+(+b.dataset.clen)));if(w===c.w)return;begin();
  const d=w-c.w,cut=c.w-1;   // coloanele de la cut încolo se mută cu d
  c.grid=c.grid.map((r,y)=>d>0?r.slice(0,cut)+(y<4||y>=12?'D':'.').repeat(d)+r.slice(cut):r.slice(0,cut+d)+r.slice(cut));
  c.w=w;const keep=x=>d>0||x<cut+d,mv=x=>x>=cut?x+d:x;
  c.coins=c.coins.filter(q=>keep(q[0])).map(q=>[mv(q[0]),q[1]]);c.ents=c.ents.filter(m=>keep(m.x));c.ents.forEach(m=>m.x=mv(m.x));
  c.golds=c.golds.filter(g=>keep(g.x));c.golds.forEach(g=>g.x=mv(g.x));
  c.gems=c.gems.filter(g=>typeof g!=='number'||keep(g));c.bats=c.bats.filter(q=>keep(q[0]));c.fall=c.fall.filter(q=>keep(q[0]));c.plats=c.plats.filter(p=>keep(p.x));c.plats.forEach(p=>p.x=mv(p.x));
  if(c.cage){if(keep(c.cage.x))c.cage.x=mv(c.cage.x);else c.cage=null;}c.cps=c.cps.filter(keep).map(mv);if(Number.isInteger(L.cstart)){if(keep(L.cstart))L.cstart=mv(L.cstart);else L.cstart=null;}
  c.pools=c.pools.filter(p=>keep(p[1]));c.in=Math.min(c.in,w-3);c.out=Math.min(c.out,w-3);commit();}));
// Uneltele
// Fila elementului ales se deschide singură
function setTool(mode,el){
  if(el){const c=CATS.find(c=>(!c.zone||c.zone===region)&&ELS.some(e=>e.g===c.id&&e.id===el));if(c)cat[region]=c.id;}
  if(el&&el!==tool.el)sel=null;if(el||(mode&&mode!==tool.mode)){insp=null;clearSel();}if(mode)tool.mode=mode;if(el)tool.el=el;if(el&&(tool.mode==='erase'||tool.mode==='pointer'))tool.mode='paint';sendTool();marks();syncUI();}
const sendTool=()=>send('edTool',{mode:tool.mode,el:tool.el,opt:OPT[tool.el]||{}});
$('#modes').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)setTool(b.dataset.mode);});
$('#pal').addEventListener('click',e=>{const b=e.target.closest('[data-el]');if(b&&!b.disabled)setTool(null,b.dataset.el);});
function keyCmd(k){if(k==='esc')clearSel();else if(k==='del')delSel();else if(k==='undo')undoIt();else if(k==='redo')redoIt();else if(k==='save')saveLevel();else if(k==='grid')toggleGrid();else if(k==='help')openHelp();else if(MODES.some(m=>m.id===k))setTool(k);}
addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.code==='KeyS'){e.preventDefault();if(askBox.hidden&&mineBox.hidden&&codeBox.hidden&&helpBox.hidden)saveLevel();return;}
  if(!askBox.hidden)return;
  if(!mineBox.hidden||!codeBox.hidden||!helpBox.hidden){if(e.code==='Escape')closeBoxes();return;}
  if(e.target===nameIn)return;
  if((e.ctrlKey||e.metaKey)&&e.code==='KeyZ'){e.preventDefault();keyCmd(e.shiftKey?'redo':'undo');}
  else if((e.ctrlKey||e.metaKey)&&e.code==='KeyY'){e.preventDefault();keyCmd('redo');}
  else if(e.code==='Escape')keyCmd('esc');
  else if(e.code==='Delete'||e.code==='Backspace'){e.preventDefault();keyCmd('del');}
  else if(!e.ctrlKey&&!e.metaKey&&!e.altKey){if(e.key==='?'){openHelp();return;}if(e.code==='KeyG'){toggleGrid();return;}const m=MODES.find(m=>'Key'+m.k===e.code);if(m)setTool(m.id);}
});
// ---- Panoul din dreapta: poza elementului, ce face, setările lui ----
const DESC={D:'Pământ. Iarba, marginile și colțurile se pun singure.',Z:'Deal din spate, mai închis: pe iarba lui de sus se poate sta.',
  W:'Deal și mai din spate. Se pune după cele din față.',Y:'Pasaj prin deal: scobit în pământ, treci prin el.',X:'Piatră: bloc tare, pentru trepte.',
  I:'Gheață peste apă, pe rândul solului. Crapă dacă stai pe ea.',water:'Groapă cu apă: scoate solul din toată coloana.',
  '^':'Țepi: te rănesc dacă sari pe ei.','=':'Scândură: stai pe ea, treci prin ea de dedesubt.',B:'Cărămidă: o spargi doar când ești mare.',
  M:'Bloc M: lovit de dedesubt, dă un bănuț.',H:'Bloc cu putere: dă grăunte, boabă de foc sau afină de gheață.',coin:'Bănuț în aer. La 100 primești o viață.',
  cp:'Checkpoint: dacă mori, reapari aici.',start:'De aici pornește curcanul.',gopen:'Pană de aur la vedere, greu de luat.',
  gbrick:'Pană de aur într-o cărămidă: iese când o spargi.',ghidden:'Pană de aur într-un bloc invizibil: apare când îl lovești.',
  cage:'Colivia cu un curcan prins. Cheia o are un ucenic sau un fermier.',sign:'Semnul de final: treci de el și termini nivelul.',
  rest:'Restaurantul MESOPOTAMIA: intri pe ușă cu ↑ și termini jocul.',cafe:'MesoCafé: înăuntru, Moș Curcan și mini-jocul ales mai jos.',
  mvx:'Platformă care merge stânga-dreapta.',mvy:'Platformă care urcă și coboară.',fall:'Platformă care se sfărâmă după ce stai pe ea, apoi revine.',
  boy:'Ucenic: se plimbă, nu te urmărește.',man:'Fermier cu furcă: te urmărește și te împunge.',bomb:'Bombă: își aprinde fitilul când te apropii.',
  mole:'Cârtița miner (în peșteră sau, noaptea, afară): dacă te prinde lanterna ei, se bagă în pământ și iese lângă tine. Te lovește cu târnăcopul. O învingi sărindu-i în cap doar cât e afară.',
  cavein:'Intrarea în peșteră: pământ crăpat, îl spargi cu săritură + ↓.',caveout:'Ieșirea din peșteră, la suprafață.',
  gem:'Cristal: pe podeaua de sub click, în tavan (click chiar sub tavan) sau, lângă pereți, în perete. Cu Pointerul îi schimbi mărimea și culoarea.',bat:'Liliac: atârnă de tavan și zboară când treci.',icicle:'Țurțure: cade când treci pe sub el.',
  pool:'Baltă pe podeaua peșterii. Tragi cât de lată o vrei; pot fi oricâte.',cin:'Puțul prin care cazi în peșteră. Lasă-l liber deasupra. Cu Pointer tragi mânerul de jos ca să-l faci mai scurt.',
  cout:'Puțul prin care ieși: sari în el de dedesubt. Lasă-l liber deasupra.'};
const propsBox=$('#propsEl');
// Ce schimbi: obiectul ales sau setările pentru cele noi
function propTarget(){
  if(sel&&sel.k==='plat'&&zone().plats.includes(sel.o)){const p=sel.o;return {o:p,live:true,el:p.kind==='fall'?'fall':p.ax==='x'?'mvx':'mvy'};}
  if((tool.el==='cage'&&tool.mode!=='pointer')||(sel&&sel.k==='cage'&&anyCage()))return {o:anyCage()||OPT.cage,live:!!anyCage(),el:'cage'};
  if(sel&&sel.k==='tile'&&sel.z===region&&'HAR'.includes(zone().grid[sel.y][sel.x]))return {o:{kind:kindOf(zone().grid[sel.y][sel.x])},live:true,el:'H'};
  if(sel&&sel.k==='gem'&&region==='cave'&&L.cave&&L.cave.gems.includes(sel.o)){const [s,c]=gemSC(sel.o);return {o:{sz:s??1,c:c??0},live:true,el:'gem'};}
  if((tool.el==='cafe'&&tool.mode==='paint')||(sel&&sel.k==='cafe'&&L.cafe&&inMain()))return {o:L.cafe||OPT.cafe,live:!!L.cafe,el:'cafe'};
  if(tool.mode==='pointer')return {o:null,live:false,el:insp,info:true};
  return {o:OPT[tool.el]||null,live:false,el:tool.el};
}
function drawProps(){
  const t=propTarget();
  if(t.info&&!t.el){propsBox.innerHTML='<section><p class="hint"><b>Pointer:</b> dai click pe orice din joc ca să vezi aici ce e. La platforme și la colivie îi schimbi și setările.</p></section>';return;}
  const el=ELS.find(e=>e.id===t.el)||{name:t.el},o=t.o,src=t.el==='gem'&&o?ICONS['gem'+o.sz+o.c]:ICONS[region==='cave'&&t.el==='D'?'Dc':t.el==='H'&&o&&o.kind&&o.kind!=='normal'?'H_'+o.kind:t.el];   // în peșteră: pământul peșterii
  const k=ICON_K[t.el]?ICON_K[t.el]*1.5:3;
  const pic=el.px&&!(t.el==='gem'&&src)?pix(el.px):src?`<img src="${src}" alt="" data-k="${k}">`:'';
  const step=(key,lab,txt)=>`<div class="opt"><span>${lab}</span><span class="len"><button class="btn sq" data-o="${key}" data-d="-1">−</button><b>${txt!==undefined?txt:o[key]}</b><button class="btn sq" data-o="${key}" data-d="1">+</button></span></div>`;
  let h=`<section><div class="ihead"><span class="big">${pic}</span><div><b>${el.name}</b><small>${DESC[t.el]||''}</small></div></div>`;
  if(o&&t.el==='H'){
    h+=`<p class="ictx">${t.live?`Blocul ales · coloana ${sel.x}, rândul ${sel.y}`:'Pentru blocurile pe care le pui'}</p><div class="opt"><span>Puterea</span></div><div class="seg pw">`+
      Object.keys(POWER).map(k=>`<button data-kind="${k}" aria-pressed="${o.kind===k}">${ICONS[k==='normal'?'H':'H_'+k]?`<img src="${ICONS[k==='normal'?'H':'H_'+k]}" alt="">`:''}${POWER_NAMES[k]}</button>`).join('')+'</div>';
  }else if(o&&t.el==='gem'){
    const im=(s,c)=>ICONS['gem'+s+c]?`<img src="${ICONS['gem'+s+c]}" alt="">`:'';
    h+=`<p class="ictx">${t.live?'Cristalul ales':'Pentru cristalele pe care le pui'}</p><div class="opt"><span>Mărimea</span></div><div class="seg pw">`+
      GEM_SZ.map((n,s)=>`<button data-gsz="${s}" aria-pressed="${o.sz===s}">${im(s,o.c)}${n}</button>`).join('')+'</div><div class="opt"><span>Culoarea</span></div><div class="seg pw">'+
      GEM_CN.map((n,c)=>`<button data-gc="${c}" aria-pressed="${o.c===c}">${im(1,c)}${n}</button>`).join('')+'</div>';
  }else if(o&&(t.el==='mvx'||t.el==='mvy'||t.el==='fall')){
    h+=`<p class="ictx">${t.live?`Platforma aleasă · coloana ${o.x}, rândul ${o.y}`:'Pentru platformele pe care le pui'}</p>`;
    h+=step('w','Lungime (pătrate)');
    if(t.el!=='fall')h+=step('range',t.el==='mvx'?'Cât merge → (pătrate)':'Cât coboară ↓ (pătrate)')+step('speed','Viteză',ED_SPEED_NAMES[(o.speed||3)-1]);
    if(t.live)h+='<button class="btn" data-del="plat" style="margin-top:8px">'+pix('x')+'Șterge platforma</button>';
  }else if(o&&t.el==='cafe'){
    h+='<p class="ictx">'+(t.live?'Cafeneaua pusă · coloana '+o.x:'Pentru cafeneaua pe care o pui')+'</p><div class="opt"><span>Mini-jocul dinăuntru</span></div><div class="capts games">'+
      CAFE_GAMES.map(g=>'<button class="capt" data-cgame="'+g.id+'" aria-pressed="'+((o.game||'slot')===g.id)+'"'+(g.soon?' disabled':'')+' data-tip="'+g.name+'||'+g.d+'">'+pix(g.px)+'<span>'+g.name+'</span></button>').join('')+'</div>';
  }else if(t.el==='cage'){
    h+=`<p class="ictx">${t.live?`Colivia pusă · coloana ${anyCage().x}${L.cage?'':' (în peșteră)'}`:'Pentru colivia pe care o pui'}</p><div class="capts">`+CAPT_NAMES.map((n,i)=>
      `<button class="capt" data-capt="${i}" aria-pressed="${(o.capt|0)===i}" title="${n}">${ICONS.capt&&ICONS.capt[i]?`<img src="${ICONS.capt[i]}" alt="">`:''}<span>${n}</span></button>`).join('')+'</div>';
  }
  h+='</section><section><p class="hint">Cu <b>Pointer (V)</b> dai click pe orice ca să vezi ce e; la platforme și la colivie îi schimbi setările aici. Tot cu el tragi orice: obiecte, blocuri sau o bucată întreagă (tragi întâi un dreptunghi pe un loc gol). <b>Delete</b> șterge bucata aleasă, <b>Esc</b> o lasă.</p></section>';
  propsBox.innerHTML=h;
  propsBox.querySelectorAll('img[data-k]').forEach(img=>{const kk=+img.dataset.k;const f=()=>{img.style.width=Math.round(img.naturalWidth*kk)+'px';img.style.height=Math.round(img.naturalHeight*kk)+'px';};if(img.complete)f();else img.onload=f;});
}
propsBox.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||playing)return;const t=propTarget(),o=t.o;if(!o)return;
  if(b.dataset.del==='plat'&&t.live){begin();const z=zone();z.plats=z.plats.filter(p=>p!==o);sel=null;commit();return;}
  if(b.dataset.gsz!==undefined||b.dataset.gc!==undefined){const s=b.dataset.gsz!==undefined?+b.dataset.gsz:o.sz,c=b.dataset.gc!==undefined?+b.dataset.gc:o.c;
    OPT.gem={sz:s,c};
    if(t.live){const g=sel.o,n=g[0]==='L'||g[0]==='R'?2:3;begin();g.splice(n,2,s,c);commit();}else{sendTool();drawProps();}
    return;}
  if(b.dataset.kind){const k=b.dataset.kind;
    if(t.live){const z=zone(),c=POWER[k];if(z.grid[sel.y][sel.x]!==c){begin();setT(z,sel.x,sel.y,c);commit();}}else{OPT.H.kind=k;sendTool();drawProps();}
    return;}
  if(b.dataset.cgame){const g=b.dataset.cgame;OPT.cafe.game=g;if(L.cafe&&L.cafe.game!==g){begin();L.cafe.game=g;commit();}else{sendTool();drawProps();}return;}
  if(b.dataset.capt!==undefined){const c=+b.dataset.capt;OPT.cage.capt=c;{const cg=anyCage();if(cg&&cg.capt!==c){begin();cg.capt=c;commit();}}sendTool();drawProps();return;}
  const key=b.dataset.o;if(!key)return;
  const ZW=zone().w,max=key==='speed'?5:key==='w'?(t.live?ZW-o.x:ZW):t.el==='mvy'?(t.live?13-o.y:13):(t.live?ZW-o.x-o.w:ZW);
  const v=Math.max(1,Math.min(Math.max(1,max),(o[key]||(key==='speed'?3:1))+(+b.dataset.d)));if(v===o[key])return;
  if(t.live){const tp={...o,[key]:v},z=zone();if(key==='w'&&o.kind==='move'&&o.ax==='x')tp.range=Math.max(1,Math.min(o.range,ZW-o.x-v));
    const why=key!=='speed'&&edPlatWhy({...z,plats:z.plats.filter(p=>p!==o)},tp);   // încercat pe o copie
    if(why){status(why,5000);return;}
    begin();o[key]=v;if(key==='w'&&o.kind==='move'&&o.ax==='x')o.range=Math.max(1,Math.min(o.range,ZW-o.x-o.w));OPT[t.el][key]=v;commit();}
  else{o[key]=v;sendTool();drawProps();}
});

// ---- Ce se vede în panou ----
function syncUI(){
  if(document.activeElement!==nameIn)nameIn.value=L.name;
  $$('[data-biome]').forEach(b=>press(b,b.dataset.biome===L.biome));
  $$('[data-night]').forEach(b=>press(b,(b.dataset.night==='1')===L.night));
  $('#len').textContent=L.w;
  // Salvat sau nu: eticheta de lângă nume
  {const j=JSON.stringify(edNorm(L)),fresh=curId===null&&j===BLANK,d=!fresh&&(savedJSON===null||j!==savedJSON),ch=$('#saveState');
    ch.hidden=!d;
    const sv=$('#save');sv.disabled=playing;sv.dataset.tip='Salvează|Ctrl+S|'+(!d?'Păstrează nivelul în Nivelurile mele.':curId===null?'Nivelul nu e încă în Nivelurile mele.':'Ai schimbări nesalvate.');}
  $('#mine').disabled=playing;$('#code').disabled=playing;
  $('#undo').disabled=!undo.length||playing;$('#redo').disabled=!redo.length||playing;
  $$('[data-mode]').forEach(b=>press(b,b.dataset.mode===tool.mode));
  const cave=region==='cave';
  // Drumul sau peștera
  $$('[data-region]').forEach(b=>{const c=b.dataset.region==='cave';b.setAttribute('aria-selected',String(b.dataset.region===region));
    b.disabled=playing||(c&&!L.cave);b.dataset.tip=c?(L.cave?'Peștera secretă||Desenezi camera de sub pământ.':'Peștera secretă||Pune întâi intrarea, din fila Peștera.'):'Drumul||Nivelul de la suprafață.';});
  $('#lenMain').hidden=cave;$('#lenCave').hidden=!cave;if(L.cave)$('#clen').textContent=L.cave.w;
  // Filele: doar cele din zona de acum
  const cats=CATS.filter(c=>!c.zone||c.zone===region);if(!cats.some(c=>c.id===cat[region]))cat[region]=cats[0].id;
  $$('[data-cat]').forEach(b=>{const c=CATS.find(c=>c.id===b.dataset.cat);b.hidden=!!c.zone&&c.zone!==region;b.setAttribute('aria-selected',String(c.id===cat[region]));});
  $$('[data-group]').forEach(g=>{const show=g.dataset.group===cat[region],box=g.closest('[data-group-box]');if(box)box.hidden=!show;else g.hidden=!show;});
  $('#catName').textContent=CATS.find(c=>c.id===cat[region]).name;
  $$('[data-el]').forEach(b=>{press(b,b.dataset.el===tool.el&&!['erase','pointer','pick'].includes(tool.mode));
    const el=ELS.find(e=>e.id===b.dataset.el);
    b.disabled=(!!el.snow&&!isSnow())||(cave&&!CAVE_EL.has(el.id))||(!cave&&(['gem','bat','icicle','pool','cin','cout'].includes(el.id)||(el.id==='mole'&&!L.night)));
    b.dataset.tip=el.name+'||'+(el.snow&&!isSnow()?'Doar iarna. ':'')+(el.id==='mole'&&!cave&&!L.night?'Afară, doar noaptea. ':'')+(DESC[el.id]||'');});
  $('#enterCave').disabled=!L.cave||playing;$('#delCave').disabled=!L.cave||playing;
  const t=$('#test');t.className='btn '+(playing?'stop':'primary');t.innerHTML=pix(playing?'stop':'play')+(playing?'Oprește':'Testează');
  t.dataset.tip=playing?'Oprește||Înapoi la desenat.':'Testează||Joci nivelul de la start.';
  $('#here').disabled=playing;$('#here').dataset.tip=cave?'Testează de aici||Pornești de la intrarea în peșteră.':'Testează de aici||Pornești din stânga ecranului de acum.';
  mainEl.classList.toggle('playing',playing);
  $$('[data-biome],[data-night],[data-len],[data-clen],#new').forEach(b=>{b.disabled=playing;});
  $('#gridBtn').classList.toggle('on',gridOn);
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
    if(view.region&&view.region!==region){region=view.region==='cave'&&L.cave?'cave':'main';syncUI();}   // și cât testezi: harta arată unde e curcanul
    showPos();drawMap();}
  if(d.edPtr)onPtr(d.edPtr);
  if(d.edKey)keyCmd(d.edKey);
});
function onIcons(ic,th){
  THEME=th;ICONS=ic;
  $$('img[data-icon]').forEach(img=>{const src=ic[img.dataset.icon];if(!src)return;const k=(ICON_K[img.dataset.icon]||2)*1.5;   // în panou: mai mari
    img.onload=()=>{img.style.width=Math.round(img.naturalWidth*k)+'px';img.style.height=Math.round(img.naturalHeight*k)+'px';};img.src=src;});
  $$('img[data-cicon]').forEach(img=>{const src=ic[img.dataset.cicon];if(src&&img.src!==src)img.src=src;});
  const logo=$('#logo');if(ic.head&&!logo.src)logo.src=ic.head;
  drawProps();drawMap();
}
// Camera pe start: pe drum sau în peșteră, cu curcanul cam la o treime din ecran
function goStart(){
  const cave=Number.isInteger(L.cstart)&&!!L.cave,x=cave?L.cstart:L.start;
  if((region==='cave')!==cave)setRegion(cave?'cave':'main');
  send('edCam',{x:x-Math.floor((view.view||25)/3)});
}
frame.addEventListener('load',()=>{send('edHello');send('edGrid',{v:gridOn});sendTool();send('edLevel',{L});if(region==='cave')send('edRegion',{r:'cave'});goStart();focusGame();});

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
  if(cave){
    for(const p of z.plats){cell(p.x,p.y,p.w,0.45,p.kind==='fall'?'#9a7046':'#e0a050');if(p.kind==='move'){mg.globalAlpha=0.35;if(p.ax==='x')cell(p.x+p.w,p.y,p.range,0.45,'#e0a050');else cell(p.x,p.y,p.w,p.range,'#e0a050');mg.globalAlpha=1;}}
    for(const g of z.gems)if(typeof g==='number')cell(g+0.2,11,0.6,1,'#a070f0');else if(g[0]==='C')cell(g[1]+0.2,g[2],0.6,1,'#a070f0');else if(g[0]==='F')cell(g[1]+0.2,g[2]-1,0.6,1,'#a070f0');else cell(g[0]==='L'?1:z.w-2,g[1],1,1,'#a070f0');
    for(const b of z.bats)cell(b[0]+0.1,b[1],0.8,0.4,'#8a7aa0');for(const f of z.fall)cell(f[0]+0.25,f[1],0.5,0.8,'#c8b8a0');
    for(const p of z.pools)cell(p[0],p[2]-0.4,p[1]-p[0]+1,0.4,'#4a8ad0');
    if(z.cage)cell(z.cage.x,z.cage.y-2.4,1,2.4,'#c8cedc');
    for(const c of z.cps){const r=startRow(c,z);cell(c+0.45,r-3.5,0.1,3.5,'#cfd3dc');cell(c+0.55,r-3.5,0.6,0.5,'#ffcf40');}
    cell(z.in,0,2,(z.inH||6)*0.1,'#9fe8ff');cell(z.out,0,2,(z.outH||6)*0.1,'#7fff7f');}
  else{
    for(const c of L.cps){cell(c+0.45,8.5,0.1,3.5,'#cfd3dc');cell(c+0.55,8.5,0.6,0.5,'#ffcf40');}
    for(const p of z.plats){cell(p.x,p.y,p.w,0.45,p.kind==='fall'?'#9a7046':'#e0a050');if(p.kind==='move'){mg.globalAlpha=0.35;if(p.ax==='x')cell(p.x+p.w,p.y,p.range,0.45,'#e0a050');else cell(p.x,p.y,p.w,p.range,'#e0a050');mg.globalAlpha=1;}}
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

// ---- Așezarea: jocul cât mai mare; filele, harta și starea au lățimea lui ----
const PAL_W=268,PAL_MAX=440;
function layout(){
  const r=mainEl.getBoundingClientRect(),B=4,gap=10,rb=$('#regionbar').offsetHeight,mb=$('#mapbox').offsetHeight,sb=$('#statusbar').offsetHeight;
  const ah=innerHeight-r.top-rb-mb-sb-gap*3-14-B;
  // Lățimea pentru joc, socotită cu panoul din stânga la mărimea lui de bază (așa nu se bate cu el însuși)
  const box=mainEl.parentElement,cs=getComputedStyle(box),bg=parseFloat(cs.columnGap)||14,props=$('#props');
  const free=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-2*bg-(props.offsetParent?props.offsetWidth:0)-PAL_W-B;
  const fit=Math.min(free,ah*400/224),extra=Math.max(0,Math.floor(free-fit));
  $('#pal').style.width=PAL_W+Math.min(extra,PAL_MAX-PAL_W)+'px';
  const aw=free-Math.min(extra,PAL_MAX-PAL_W);   // cât rămâne pentru joc
  const w=Math.max(320,Math.floor(Math.min(aw,ah*400/224))),h=Math.round(w*224/400);
  frame.style.width=w+B+'px';frame.style.height=h+B+'px';
  for(const id of ['#regionbar','#mapbox','#statusbar'])$(id).style.width=w+B+'px';
  drawMap();
}
addEventListener('resize',layout);
// ---- Tooltipurile: data-tip = „Nume|Tastă|Ce face” ----
const tipEl=$('#tip');let tipT=0,tipFor=null;
function tipShow(el){
  const [t,k,d]=(el.dataset.tip||'').split('|');if(!t)return;
  tipEl.innerHTML='<b>'+esc(t)+'</b>'+(k?'<kbd>'+esc(k)+'</kbd>':'')+(d?'<span>'+esc(d)+'</span>':'');
  tipEl.hidden=false;const r=el.getBoundingClientRect(),w=tipEl.offsetWidth,h=tipEl.offsetHeight;
  let x=r.left+r.width/2-w/2,y=r.bottom+8;if(y+h>innerHeight-6)y=r.top-h-8;
  tipEl.style.left=Math.max(6,Math.min(innerWidth-w-6,x))+'px';tipEl.style.top=Math.max(6,y)+'px';
}
const tipHide=()=>{clearTimeout(tipT);tipEl.hidden=true;};
document.addEventListener('pointerover',e=>{const el=e.target.closest?e.target.closest('[data-tip]'):null;if(el===tipFor)return;tipFor=el;tipHide();
  if(el&&e.pointerType!=='touch')tipT=setTimeout(()=>{if(tipFor===el&&el.isConnected)tipShow(el);},420);});
document.addEventListener('pointerdown',()=>{tipHide();tipFor=null;},true);
addEventListener('keydown',tipHide,true);
if(window.ResizeObserver){const ro=new ResizeObserver(()=>requestAnimationFrame(layout));ro.observe(mainEl.parentElement);ro.observe(document.querySelector('.bar'));ro.observe($('#regionbar'));}
syncUI();layout();showPos();openStart();
