'use strict';
// ===== EDITORUL: formatul nivelului (în joc și în editor.html) =====
const ED_ROWS=14,ED_MIN_W=25,ED_MAX_W=2000,ED_CAVE_MIN=25,ED_CAVE_MAX=80,ED_GOLDS=3,ED_CAFE_W=25;
// Biomul, zi sau noapte → tema jocului
const ED_BIOMES={ferma:{name:'Fermă',day:0,night:3},iarna:{name:'Iarnă',day:1,night:5},desert:{name:'Deșert',day:7,night:2}};
const edTheme=L=>{const b=ED_BIOMES[L.biome]||ED_BIOMES.ferma;return L.night?b.night:b.day;};
const edSong=t=>t===3?'night':t===1||t===5?'winter':undefined;
// Terenul și blocurile care se pot desena
const ED_TILES='DZWYXI^=BMHAR';   // H, A, R = bloc cu putere: normală, gheață, foc
// Mini-jocurile din cafenea (blocks, mouse, hotcold: vin pe rând)
const ED_CAFE_GAMES=['slot','cups','blocks','mouse','hotcold'];
const ED_MOBS=['boy','man','bomb','mole'];   // mole: cârtița miner, doar în peșteră
const ED_GOLD_KINDS=['open','brick','hidden'];
// Viteza platformei care se mișcă: 1–5, în pătrate pe secundă
const ED_SPEEDS=[1,2,3,4,6],ED_SPEED_NAMES=['Foarte încet','Încet','Normal','Repede','Foarte repede'];
// Pânza goală: doar solul
function edNewLevel(w=60){
  const L={v:1,name:'NIVEL NOU',biome:'ferma',night:false,w,grid:[],coins:[],ents:[],cps:[],start:2,
    golds:[],cage:null,plats:[],goal:null,cave:null,cafe:null};
  for(let y=0;y<ED_ROWS;y++)L.grid.push((y>=12?'D':'.').repeat(w));
  return L;
}
// Camera peșterii, nouă: doar pereții (îi face jocul)
// Forma de pornire a camerei: tavan, podea, pereți, puțul în care cazi (2) și cel de ieșire (w-4), cu treaptă
// (ca peșterile din joc; apoi o desenezi cum vrei)
function edCaveBase(w,ceil){
  ceil=ceil||4;const g=[];
  for(let y=0;y<ED_ROWS;y++){let r='';for(let x=0;x<w;x++)r+=y<ceil||y>=12||x===0||x===w-1?'D':'.';g.push(r);}
  const set=(x,y,c)=>{if(x>0&&x<w-1)g[y]=g[y].slice(0,x)+c+g[y].slice(x+1);};
  for(const s of [2,w-4]){for(let y=ceil;y<6;y++)for(let i=-1;i<3;i++)set(s+i,y,'D');for(let y=0;y<6;y++){set(s,y,'Y');set(s+1,y,'Y');}}
  for(const [x,y] of [[w-4,10],[w-3,10],[w-4,11],[w-3,11],[w-5,11]])set(x,y,'D');
  return g;
}
function edNewCave(x,x2){const w=30;return {v:2,x,x2,w,in:2,out:w-4,grid:edCaveBase(w),coins:[],ents:[],golds:[],gems:[],bats:[],fall:[],pools:[],plats:[],cps:[]};}
// Rândurile grilei, curățate
function edRows(src,w,def){const out=[];
  for(let y=0;y<ED_ROWS;y++){const r=String(src&&src[y]||'');let s='';
    for(let x=0;x<w;x++){const c=r[x];s+=c&&ED_TILES.includes(c)?c:(r.length?'.':def(y));}
    out.push(s);}
  return out;}
const edInt=(v,a,b,d)=>Number.isInteger(v)&&v>=a&&v<=b?v:d;
function edObjs(src,w,o){   // bănuți, inamici, pene, într-o zonă lată de w
  const inX=x=>Number.isInteger(x)&&x>=0&&x<w,inY=y=>Number.isInteger(y)&&y>=0&&y<ED_ROWS,seen=new Set();
  o.coins=[];for(const c of (src&&src.coins)||[])if(Array.isArray(c)&&inX(c[0])&&inY(c[1])&&!seen.has(c+'')){seen.add(c+'');o.coins.push([c[0],c[1]]);}
  o.ents=[];for(const e of (src&&src.ents)||[])if(e&&ED_MOBS.includes(e.t)&&inX(e.x)&&inY(e.y))o.ents.push({t:e.t,x:e.x,y:e.y});
  o.golds=[];for(const g of (src&&src.golds)||[])if(g&&ED_GOLD_KINDS.includes(g.kind)&&inX(g.x)&&inY(g.y))o.golds.push({x:g.x,y:g.y,kind:g.kind});
}
// Repară un nivel venit din altă parte
// Platformele (pe drum sau în peșteră)
function edPlats(a,inX){const o=[];for(const p of a||[])if(p&&(p.kind==='move'||p.kind==='fall')&&inX(p.x)&&Number.isInteger(p.y)&&p.y>=0&&p.y<ED_ROWS)
    o.push(p.kind==='move'?{kind:'move',x:p.x,y:p.y,w:edInt(p.w,1,ED_MAX_W,3),ax:p.ax==='y'?'y':'x',range:edInt(p.range,1,ED_MAX_W,p.ax==='y'?4:6),speed:edInt(p.speed,1,5,3)}:{kind:'fall',x:p.x,y:p.y,w:edInt(p.w,1,ED_MAX_W,1)});
  return o;}
function edNorm(L){
  L=L||{};
  const w=edInt(L.w,ED_MIN_W,ED_MAX_W,60),inX=x=>Number.isInteger(x)&&x>=0&&x<w;
  const o={v:1,name:String(L.name||'NIVEL NOU').slice(0,24),biome:ED_BIOMES[L.biome]?L.biome:'ferma',night:!!L.night,w};
  o.grid=edRows(L.grid,w,y=>y>=12?'D':'.');
  edObjs(L,w,o);
  o.cps=[...new Set((L.cps||[]).filter(inX))].sort((a,b)=>a-b);
  o.start=inX(L.start)?L.start:2;
  o.cage=L.cage&&inX(L.cage.x)?{x:L.cage.x,y:edInt(L.cage.y,1,13,12),capt:edInt(L.cage.capt,0,4,0)}:null;
  o.plats=edPlats(L.plats,inX);
  o.goal=L.goal&&(L.goal.type==='sign'||L.goal.type==='restaurant')&&inX(L.goal.x)?{type:L.goal.type,x:L.goal.x}:null;
  o.cafe=L.cafe&&inX(L.cafe.x)?{x:L.cafe.x,game:ED_CAFE_GAMES.includes(L.cafe.game)?L.cafe.game:'slot'}:null;
  const c=L.cave;o.cave=null;o.cstart=null;
  if(c&&inX(c.x)&&inX(c.x2)){
    const cw=edInt(c.w,ED_CAVE_MIN,ED_CAVE_MAX,30),cx=x=>Number.isInteger(x)&&x>=0&&x<cw,rng=r=>Array.isArray(r)&&cx(r[0])&&cx(r[1])&&r[0]<=r[1]?[r[0],r[1]]:null;
    const cv={v:2,x:c.x,x2:c.x2,w:cw,in:edInt(c.in,1,cw-3,2),out:edInt(c.out,1,cw-3,cw-4),inH:edInt(c.inH,1,6,6),outH:edInt(c.outH,1,6,6)};   // inH/outH: cât de înalt e puțul
    if(c.v===2)cv.grid=edRows(c.grid,cw,()=>'.');
    else{   // peștera de dinainte: forma de pornire, cu ce desenaseși peste ea
      cv.grid=edCaveBase(cw,edInt(c.ceil,4,7,4));const old=edRows(c.grid,cw,()=>'.');
      cv.grid=cv.grid.map((r,y)=>[...r].map((ch,x)=>old[y][x]!=='.'?old[y][x]:(c.pit&&y>=12&&x>=c.pit[0]&&x<=c.pit[1]?'.':ch)).join(''));}
    edObjs(c,cw,cv);
    // Decorul: pe tavanul sau podeaua aleasă (y); cristalele cu mărime și culoare
    const topHang=x=>{let y=0;while(y<12&&cv.grid[y][x]==='D')y++;return y;},topFloor=x=>{let y=topHang(x);while(y<12&&!'DX'.includes(cv.grid[y][x]))y++;return y;};
    const ry=y=>Number.isInteger(y)&&y>=0&&y<ED_ROWS,o2=v=>Number.isInteger(v)&&v>=0&&v<=2,sc=(b,s,k)=>o2(s)&&o2(k)?b.concat([s,k]):b;
    const uq=a=>[...new Map(a.map(v=>[JSON.stringify(v),v])).values()],hang=a=>uq((a||[]).map(b=>cx(b)?[b,topHang(b)]:Array.isArray(b)&&cx(b[0])&&ry(b[1])?[b[0],b[1]]:null).filter(Boolean));
    cv.gems=(c.gems||[]).map(g=>cx(g)?g:!Array.isArray(g)?null:(g[0]==='L'||g[0]==='R')&&ry(g[1])&&g[1]<12?sc([g[0],g[1]],g[2],g[3])
      :g[0]==='C'&&cx(g[1])?sc(['C',g[1],ry(g[2])?g[2]:topHang(g[1])],g[3],g[4]):g[0]==='F'&&cx(g[1])&&ry(g[2])?sc(['F',g[1],g[2]],g[3],g[4]):null).filter(g=>g!==null);
    cv.bats=hang(c.bats);cv.fall=hang(c.fall);cv.plats=edPlats(c.plats,cx);cv.cps=[...new Set((c.cps||[]).filter(x=>cx(x)&&x>0&&x<cw-1))].sort((a,b)=>a-b);
    cv.cage=!o.cage&&c.cage&&cx(c.cage.x)?{x:c.cage.x,y:edInt(c.cage.y,1,13,12),capt:edInt(c.cage.capt,0,4,0)}:null;   // colivia din peșteră (doar una pe nivel)
    cv.pools=(c.v===2?(c.pools||[]):(c.pool?[c.pool]:[])).map(r=>{const v=rng(r);return v?[v[0],v[1],ry(r[2])?r[2]:topFloor(v[0])]:null;}).filter(Boolean).slice(0,30);
    o.cave=cv;o.cstart=Number.isInteger(L.cstart)&&L.cstart>0&&L.cstart<cw-1?L.cstart:null;   // startul din peșteră
  }
  // Cel mult 3 pene, cu tot cu peștera
  if(o.golds.length>ED_GOLDS)o.golds.length=ED_GOLDS;
  if(o.cave&&o.golds.length+o.cave.golds.length>ED_GOLDS)o.cave.golds.length=ED_GOLDS-o.golds.length;
  return o;
}
// Harta jocului din nivelul desenat: întâi drumul, apoi camera peșterii, apoi camera cafenelei
// (iarba o pune m.done; customBuild se cheamă doar în joc)
// Colivia: pământ drept sub ea și loc liber în stânga, unde sare curcanul eliberat
const ED_CAGE_GROUND='DBMHARXI=';
const edCageBox=(x,y)=>({x0:x-2,x1:x+1,y0:y-3,y1:y-1});
function edCageWhy(L,x,y){
  if(x<2||x>L.w-2||y<4)return 'Colivia nu încape aici.';
  const b=edCageBox(x,y),inB=(px,py)=>px>=b.x0&&px<=b.x1&&py>=b.y0&&py<=b.y1,cols=(a,w)=>a<=b.x1&&a+w-1>=b.x0;
  for(let i=b.x0;i<=x;i++)if(!ED_CAGE_GROUND.includes(L.grid[y][i]))return 'Sub colivie și în stânga ei, unde aterizează curcanul, trebuie pământ drept.';
  for(let r=b.y0;r<=b.y1;r++)for(let i=b.x0;i<=b.x1;i++)if((ED_CAGE_GROUND+'^').includes(L.grid[r][i]))return 'Colivia are nevoie de loc liber: curcanul sare afară prin stânga.';
  const busy=L.coins.some(c=>inB(c[0],c[1]))||L.ents.some(m=>inB(m.x,m.y)||inB(m.x,m.y-1))||L.golds.some(g=>inB(g.x,g.y))
    ||L.plats.some(p=>{const mv=p.kind==='move',mx=mv&&p.ax==='x'?p.range:0,my=mv&&p.ax==='y'?p.range:0;return cols(p.x,p.w+mx)&&p.y<=b.y1&&p.y+my>=b.y0;})
    ||(L.cps||[]).some(c=>cols(c,1))||cols(L.start,1)||(Number.isInteger(L.in)&&((b.y0<(L.inH||6)&&cols(L.in,2))||(b.y0<(L.outH||6)&&cols(L.out,2))))||(L.cave&&['in','out'].some(k=>{const r=edHoleBox(L,k);return r.x0<=b.x1&&r.x1>=b.x0&&r.y0<=y&&r.y1>=b.y0;}))
    ||(L.goal&&cols(L.goal.x,L.goal.type==='sign'?5:12))||(L.cafe&&cols(L.cafe.x,6));
  return busy?'Lângă colivie trebuie să fie liber: fără bănuți, inamici, platforme sau alte obiecte.':'';
}
// Platforma: tot drumul ei, fără teren, blocuri sau obiecte în cale
const ED_SOLID='DBMHARXI=^';
function edPlatBox(p){const mv=p.kind==='move';return {x0:p.x,x1:p.x+p.w-1+(mv&&p.ax==='x'?p.range:0),y0:p.y,y1:p.y+(mv&&p.ax==='y'?p.range:0)};}
function edPlatWhy(L,p){
  const b=edPlatBox(p);
  if(b.x0<0||b.x1>=L.w||b.y0<0||b.y1>=ED_ROWS)return 'Platforma iese din nivel.';
  const inB=(x,y)=>x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1,hit=r=>r.x0<=b.x1&&r.x1>=b.x0&&r.y0<=b.y1&&r.y1>=b.y0;
  for(let y=b.y0;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++)if(ED_SOLID.includes(L.grid[y][x]))return 'Platforma nu intră în pământ sau în blocuri: pe drumul ei e ceva în cale.';
  if(L.ents.some(m=>inB(m.x,m.y)||inB(m.x,m.y-1))||L.golds.some(g=>inB(g.x,g.y)))return 'Pe drumul platformei e un inamic sau o pană.';
  if(L.plats.some(q=>q!==p&&hit(edPlatBox(q))))return 'Drumul platformei se lovește de altă platformă.';
  if(L.cage&&hit(edCageBox(L.cage.x,L.cage.y)))return 'Platforma trece prin locul coliviei.';
  if(L.cave&&(hit(edHoleBox(L,'in'))||hit(edHoleBox(L,'out'))))return 'Platforma blochează intrarea sau ieșirea peșterii.';
  let sr=12;if(Number.isInteger(L.start))while(sr>0&&'DBMHXI^'.includes(L.grid[sr-1][L.start]))sr--;
  const g=L.goal,sg=g&&g.type==='sign';
  if(Number.isInteger(L.in)&&(hit({x0:L.in,x1:L.in+1,y0:0,y1:(L.inH||6)-1})||hit({x0:L.out,x1:L.out+1,y0:0,y1:(L.outH||6)-1})))return 'Platforma blochează puțul peșterii.';
  if(hit({x0:L.start,x1:L.start,y0:sr-1,y1:sr})||(L.cps||[]).some(c=>hit({x0:c,x1:c,y0:9,y1:13}))
    ||(g&&hit({x0:g.x,x1:g.x+(sg?4:11),y0:sg?8:7,y1:13}))||(L.cafe&&hit({x0:L.cafe.x,x1:L.cafe.x+5,y0:6,y1:13})))return 'Platforma trece prin start, checkpoint, final sau cafenea.';
  return '';
}
// Găurile peșterii: intrarea (o spargi; ieșind pe ea sari spre stânga) și ieșirea (sari afară spre dreapta)
function edHoleBox(L,k){const c=L.cave,x=k==='in'?c.x:c.x2;return k==='in'?{x0:Math.max(0,x-2),x1:x+1,y0:8,y1:13}:{x0:x,x1:Math.min(L.w-1,x+3),y0:8,y1:13};}
function edHoleWhy(L,k){
  if(!L.cave)return '';
  const b=edHoleBox(L,k),inB=(x,y)=>x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1,hit=r=>r.x0<=b.x1&&r.x1>=b.x0&&r.y0<=b.y1&&r.y1>=b.y0;
  const n=k==='in'?'Intrarea în peșteră':'Ieșirea din peșteră';
  for(let y=b.y0;y<12;y++)for(let x=b.x0;x<=b.x1;x++)if(ED_SOLID.includes(L.grid[y][x]))return n+' e blocată: deasupra ei trebuie loc liber.';
  if(L.ents.some(m=>inB(m.x,m.y)||inB(m.x,m.y-1))||L.golds.some(g=>inB(g.x,g.y))||L.plats.some(p=>hit(edPlatBox(p)))||(L.cage&&hit(edCageBox(L.cage.x,L.cage.y))))
    return n+' e blocată de un obiect, o platformă sau colivie.';
  return '';
}
// Ce s-a stricat: colivia și fiecare platformă (true = stricat)
const edZoneBad=L=>[!!(L.cage&&edCageWhy(L,L.cage.x,L.cage.y)),...L.plats.map(p=>!!edPlatWhy(L,p)),!!edHoleWhy(L,'in'),!!edHoleWhy(L,'out')];
function customBuild(L){
  const cv=L.cave,ca=L.w+(cv?cv.w:0),m=newMap(ca+(L.cafe?CAFE_W:0));
  const put=(rows,ox)=>rows.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]!=='.')m.grid[y][ox+x]=r[x];});
  const objs=(o,ox)=>{for(const [x,y] of o.coins)m.c(ox+x,y);for(const e of o.ents)m.e(e.t,ox+e.x,e.y);for(const g of o.golds)m.pana(ox+g.x,g.y,g.kind);};
  put(L.grid,0);
  // Perioada: dus-întors cu viteza aleasă
  const plats=(a,ox)=>{for(const p of a||[])if(p.kind==='move')m.mv(ox+p.x,p.y,p.w,p.ax,p.range,Math.max(40,Math.round(2*p.range*60/ED_SPEEDS[(p.speed||3)-1])));else m.fall(ox+p.x,p.y,p.w);};
  plats(L.plats,0);
  objs(L,0);
  for(const x of L.cps)m.cp(x);
  if(L.cage)m.colivie(L.cage.x,L.cage.y);
  if(L.goal)m.goal(L.goal.type,L.goal.x);
  if(cv){const a=L.w;
    put(cv.grid,a);
    // Tavanul: cel mai de sus rând fără pământ, pe coloanele camerei (fără puțuri)
    let ceil=12;for(let x=1;x<cv.w-1;x++){if((x>=cv.in&&x<cv.in+2)||(x>=cv.out&&x<cv.out+2))continue;let y=0;while(y<12&&cv.grid[y][x]==='D')y++;ceil=Math.min(ceil,y);}
    m.underDef={x:cv.x,x2:cv.x2,a,w:cv.w,opt:{ceil:Math.max(2,Math.min(7,ceil)),gems:cv.gems,bats:cv.bats,fall:cv.fall,pools:cv.pools,in:cv.in,out:cv.out,inH:cv.inH,outH:cv.outH}};
    objs(cv,a);plats(cv.plats,a);for(const x of cv.cps)m.cp(a+x);if(cv.cage)m.colivie(a+cv.cage.x,cv.cage.y);}
  if(L.cafe)m.cafe(L.cafe.x,ca,L.cafe.game);
  return m.done();
}

// ---- Codul de partajare: CURCAN1: + JSON cu rândurile scurtate (D12 = 12 de D), în base64 ----
const ED_CODE='CURCAN1:';
const edRle=r=>r.replace(/(.)\1*/g,m=>m[0]+(m.length>1?m.length:''));
const edUnrle=r=>r.replace(/(\D)(\d*)/g,(m,c,n)=>c.repeat(n?Math.min(+n,ED_MAX_W):1));
const edB64=str=>{const b=new TextEncoder().encode(str);let s='';for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(s);};
const edUnB64=t=>new TextDecoder().decode(Uint8Array.from(atob(t),c=>c.charCodeAt(0)));
// Nivelul strâns (rândurile scurtate) și desfăcut la loc
function edPack(L){const o=JSON.parse(JSON.stringify(edNorm(L)));o.grid=o.grid.map(edRle);if(o.cave)o.cave.grid=o.cave.grid.map(edRle);return o;}
function edUnpack(o){if(!o||!Array.isArray(o.grid))return null;o.grid=o.grid.map(r=>edUnrle(String(r)));if(o.cave&&Array.isArray(o.cave.grid))o.cave.grid=o.cave.grid.map(r=>edUnrle(String(r)));return edNorm(o);}
function edEncode(L){return ED_CODE+edB64(JSON.stringify(edPack(L)));}
// Nivelul din cod, sau null dacă nu e un cod bun
function edDecode(code){
  const t=String(code||'').replace(/\s+/g,''),i=t.indexOf(ED_CODE);if(i<0)return null;
  try{const s=atob(t.slice(i+ED_CODE.length)),o=JSON.parse(new TextDecoder().decode(Uint8Array.from(s,c=>c.charCodeAt(0))));
    if(!o||!Array.isArray(o.grid))return null;
    o.grid=o.grid.map(r=>edUnrle(String(r)));if(o.cave&&Array.isArray(o.cave.grid))o.cave.grid=o.cave.grid.map(r=>edUnrle(String(r)));
    return edNorm(o);}catch(e){return null;}
}
// ---- Codul poveștii: CURCANP1: + numele și nivelurile ei (cel mult 10) ----
const ED_STORY='CURCANP1:',ED_STORY_MAX=10;
function edEncodeStory(s){return ED_STORY+edB64(JSON.stringify({v:1,name:s.name,items:s.items.slice(0,ED_STORY_MAX).map(it=>({L:edPack(it.L),bonus:!!it.bonus}))}));}
function edDecodeStory(code){
  const t=String(code||'').replace(/\s+/g,''),i=t.indexOf(ED_STORY);if(i<0)return null;
  try{const o=JSON.parse(edUnB64(t.slice(i+ED_STORY.length)));if(!o||!Array.isArray(o.items))return null;
    const items=o.items.slice(0,ED_STORY_MAX).map(it=>({L:edUnpack(it&&it.L),bonus:!!(it&&it.bonus)})).filter(it=>it.L);if(!items.length)return null;
    return {name:String(o.name||'POVESTEA MEA').toUpperCase().slice(0,24),items};}catch(e){return null;}
}
