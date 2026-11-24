'use strict';
// ===== EDITORUL: partea din joc (index.html?edit, în editor.html) =====
// Nivelul desenat: ultimul în LEVELS
const CUSTOM={id:'custom',theme:0,tip:'',arena:true,custom:true,start:2,capt:0,L:null,build(){return customBuild(CUSTOM.L);}};
const CUSTOM_IX=EDIT?LEVELS.push(CUSTOM)-1:-1;
const ED={marks:{sel:null,hi:null},tool:{mode:'paint',el:'D'},hover:null,down:null,lastShow:0,dirty:false,view:'',iconTheme:-1,region:'main'};
function edUse(L){const o=edNorm(L);CUSTOM.L=o;CUSTOM.theme=edTheme(o);CUSTOM.song=edSong(CUSTOM.theme);CUSTOM.start=o.start;CUSTOM.capt=o.cage?o.cage.capt:0;}
// Ca la modul de test: nivelul de la zero
function edReset(){G.slotUsed=null;G.bossMet=false;G.goldLv=-1;G.cageLv=-1;G.cafeSeen=false;G.underOpen=-1;G.cageRun=false;
  G.lvlHurt=false;G.lvlSeen=false;G.fullRun=false;G.carryBig=false;G.carryFire=false;G.carryIce=false;G.paused=false;G.inCafe=false;G.inUnder=false;}
// Zona desenată: drumul sau camera peșterii (prima coloană, lățimea)
const edZone=()=>ED.region==='cave'&&under?{a:under.a,w:under.w}:{a:0,w:CUSTOM.L.w};
const edCamClamp=x=>{const z=edZone();return clamp(x,z.a*TS,Math.max(z.a*TS,(z.a+z.w)*TS-W));};
// Arată nivelul nemișcat, pentru desenat
function edShow(L){
  const cx=cam.x,now=performance.now(),quick=now-ED.lastShow<300,oldShade=SHADE.cv,oldTheme=theme,wasCave=ED.region==='cave'&&!!under;
  ED.lastShow=now;edUse(L);edReset();G.level=CUSTOM_IX;G.cp=null;
  startLevel(true);G.state='edit';
  if(!under)ED.region='main';
  G.inUnder=ED.region==='cave';
  player.x=-999;player.y=-99;player.vx=0;player.vy=0;
  cam.x=edCamClamp(wasCave===G.inUnder?cx:G.inUnder?under.a*TS:0);
  // Umbra pământului se reface doar când te oprești din desenat
  if(quick&&oldShade&&oldShade.width===cols*TS&&theme===oldTheme){SHADE.grid=grid;SHADE.cv=oldShade;ED.dirty=true;}
  if(ED.iconTheme!==CUSTOM.theme)edIcons();
}
// Joci nivelul: de la start sau de la coloana from
function edPlay(L,from,god){
  edUse(L);edReset();G.level=CUSTOM_IX;G.god=!!god;
  G.cp=Number.isInteger(from)?{level:CUSTOM_IX,x:clamp(from,0,CUSTOM.L.w-1)}:null;
  startLevel();
}
function edStop(){stopSong();const cx=cam.x,inside=!!G.inUnder;if(inside!==(ED.region==='cave'))ED.region=inside?'cave':'main';edShow(CUSTOM.L);cam.x=edCamClamp(cx);}
// Un cadru în editor: camera, umbra, animațiile
function edUpdate(){
  if(!grid)return;
  const sp=keys.ShiftLeft||keys.ShiftRight?14:6;
  if(keys.ArrowLeft||keys.KeyA)cam.x-=sp;if(keys.ArrowRight||keys.KeyD)cam.x+=sp;
  cam.x=edCamClamp(cam.x);
  if(ED.dirty&&performance.now()-ED.lastShow>250){SHADE.grid=null;ED.dirty=false;}
  updateFx();
}
// Panoul află ce se vede și ce face jocul
function edSendView(){
  const z=G.state==='edit'?edZone():{a:0,w:CUSTOM.L?CUSTOM.L.w:cols};
  const v=JSON.stringify([Math.round(cam.x/TS*10)/10,G.state,ED.region,z.a,z.w]);if(v===ED.view)return;ED.view=v;
  toParent({edView:{cam:cam.x/TS-z.a,view:W/TS,cols:z.w,state:G.state,region:ED.region}});
}
// Iconițele din panou, în culorile biomului
function edIcons(){
  ED.iconTheme=CUSTOM.theme;
  const u=c=>c?c.toDataURL():'',can=(w,h,f)=>{const [c,g]=mkCanvas(w,h);f(g,c);return c;};
  const draw=(w,h,f)=>can(w,h,g=>{const old=ctx;ctx=g;try{f();}finally{ctx=old;}});   // desenele jocului, pe un canvas mic
  const sw=(col,h,y)=>can(16,16,g=>{g.fillStyle=col;g.fillRect(0,y||0,16,h||16);});
  const H=can(16,16,g=>{g.drawImage(tiles.M[0],0,0);g.fillStyle='#e8323e';g.fillRect(11,1,4,4);g.fillStyle='#fff';g.fillRect(12,2,2,2);});
  const CPI=can(16,16,g=>{g.fillStyle='#cfd3dc';g.fillRect(3,1,2,15);g.fillStyle='#ffcf40';g.fillRect(5,2,9,6);});
  const plank=img=>can(32,8,g=>{g.drawImage(img,0,0);g.drawImage(img,16,0);});
  const Dc=can(16,16,g=>{g.drawImage(tiles.D,0,0);g.fillStyle=theme.dirtL;g.fillRect(0,0,16,1);});   // pământul din peșteră: fără iarbă
  toParent({edIcons:{D:u(tiles.G),Dc:u(Dc),H_ice:u(tiles.A[0]),H_fire:u(tiles.R[0]),Z:u(tiles.ZG),W:u(tiles.WG),Y:u(tiles.Yv[0]),X:u(tiles.X),I:u(tiles.I),'^':u(tiles['^']),'=':u(tiles['=']),
    B:u(tiles.B),M:u(tiles.M[0]),H:u(H),water:u(sw(theme.water.body,11,5)),coin:u(COIN),cp:u(CPI),start:u(TKS.A.r),
    boy:u(BOY.A.r),man:u(MAN.A.r),bomb:u(BOMB.A.r),head:u(HEAD),
    gopen:u(GOLD_PANA),gbrick:u(can(16,16,g=>{g.drawImage(tiles.B,0,0);g.drawImage(GOLD_PANA,5,1);})),
    ghidden:u(can(16,16,g=>{g.globalAlpha=0.4;g.drawImage(GOLD_PANA,5,1);g.globalAlpha=1;g.strokeStyle='#ffd23f';g.setLineDash([2,2]);g.strokeRect(0.5,0.5,15,15);})),
    cage:u(draw(32,40,()=>drawCageBars(16,40,false,0))),
    mvx:u(plank(tiles['='])),mvy:u(plank(tiles['='])),fall:u(plank(PLANK_WORN[0])),
    capt:CAPT.map(s=>u(s.L.r))},
    edTheme:{sky:theme.sky,grass:theme.grass,dirt:theme.dirt,water:theme.water.body,night:!!theme.night,snow:!!theme.snow}});
}
// Rândul pe care stă curcanul la start (ca în startLevel)
function edStartRow(x){let gy=12;while(gy>0&&solid(tileAt(x,gy-1)))gy--;return gy;}
const edLabel=(s,x,y,col)=>tinyTxt(s,x-Math.floor(tinyW(s)/2),y,col);
// Peste lume: grila, startul, semnele, fantoma uneltei
// Locul coliviei: aerul liber, pământul de sub ea și unde aterizează curcanul
function edCageZone(x,y,cx,bad){
  const b=edCageBox(x,y),col=bad?'#ff4a4a':'#7fff7f',a=ctx.globalAlpha;ctx.globalAlpha=1;
  ctx.fillStyle=bad?'rgba(255,74,74,0.18)':'rgba(127,255,127,0.12)';ctx.fillRect(b.x0*TS-cx,b.y0*TS,(b.x1-b.x0+1)*TS,(b.y1-b.y0+1)*TS);
  ctx.strokeStyle=col;ctx.lineWidth=1;ctx.setLineDash([3,2]);ctx.strokeRect(b.x0*TS-cx+0.5,b.y0*TS+0.5,(b.x1-b.x0+1)*TS-1,(b.y1-b.y0+1)*TS-1);ctx.setLineDash([]);
  ctx.fillStyle=col;ctx.fillRect(b.x0*TS-cx,y*TS,3*TS,2);   // pământul de sub ea
  ctx.fillRect(b.x0*TS-cx+5,y*TS-4,6,2);ctx.fillRect(b.x0*TS-cx+7,y*TS-7,2,3);   // aici aterizează curcanul
  ctx.globalAlpha=a;
}
// Un perimetru punctat (fill = și umplut ușor)
function edBox(b,cx,bad,fill){
  const a=ctx.globalAlpha;ctx.globalAlpha=1;
  if(fill||bad){ctx.fillStyle=bad?'rgba(255,74,74,0.18)':'rgba(127,255,127,0.10)';ctx.fillRect(b.x0*TS-cx,b.y0*TS,(b.x1-b.x0+1)*TS,(b.y1-b.y0+1)*TS);}
  ctx.strokeStyle=bad?'#ff4a4a':'#7fff7f';ctx.lineWidth=1;ctx.setLineDash([3,2]);ctx.strokeRect(b.x0*TS-cx+0.5,b.y0*TS+0.5,(b.x1-b.x0+1)*TS-1,(b.y1-b.y0+1)*TS-1);ctx.setLineDash([]);
  ctx.globalAlpha=a;
}
function drawEditOverlay(){
  const cx=Math.round(cam.x),x0=Math.floor(cx/TS),x1=Math.min(cols-1,x0+W/TS+1),L=CUSTOM.L,main=ED.region==='main';
  ctx.fillStyle='rgba(255,255,255,0.07)';
  for(let x=-(cx%TS);x<W;x+=TS)ctx.fillRect(x,0,1,H);
  for(let y=TS;y<H;y+=TS)ctx.fillRect(0,y,W,1);
  for(let ty=0;ty<ROWS;ty++)for(let tx=x0;tx<=x1;tx++){const c=grid[ty][tx],x=tx*TS-cx,y=ty*TS;
    // Blocul cu putere: semn roșu, ca să nu-l confunzi cu M
    if(c==='H'){ctx.fillStyle='#e8323e';ctx.fillRect(x+11,y+1,4,4);ctx.fillStyle='#fff';ctx.fillRect(x+12,y+2,2,2);}
    // Pana din cărămidă și pana ascunsă
    else if(c==='P')ctx.drawImage(GOLD_PANA,x+5,y+1);
    else if(c==='V'){ctx.globalAlpha=0.45;ctx.drawImage(GOLD_PANA,x+5,y+1);ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,210,63,0.8)';ctx.setLineDash([2,2]);ctx.strokeRect(x+0.5,y+0.5,TS-1,TS-1);ctx.setLineDash([]);}}
  if(main){
    // Startul
    const sx=L.start,sy=edStartRow(sx)*TS;
    ctx.globalAlpha=0.9;ctx.drawImage(TKS.A.r,sx*TS-cx,sy-16);ctx.globalAlpha=1;
    edLabel('START',sx*TS-cx+8,sy-24,'#ffd23f');
    // Găurile peșterii
    if(under)for(const [hx,s] of [[under.x,'INTRARE'],[under.x2,'IEȘIRE']]){const x=hx*TS-cx;
      ctx.strokeStyle='rgba(159,232,255,0.9)';ctx.setLineDash([3,2]);ctx.strokeRect(x+0.5,12*TS+0.5,SUB_SHAFT*TS-1,2*TS-1);ctx.setLineDash([]);
      edLabel(s,x+TS,12*TS-8,'#9fe8ff');}
  }
  // Locul coliviei, mereu: verde = liber, roșu = stricat
  if(main&&L.cage)edCageZone(L.cage.x,L.cage.y,cx,!!edCageWhy(L,L.cage.x,L.cage.y));
  // Aerul de deasupra găurilor peșterii
  if(main&&L.cave)for(const k of ['in','out'])edBox(edHoleBox(L,k),cx,!!edHoleWhy(L,k),true);
  // Drumul fiecărei platforme: verde = liber, roșu = ceva în cale
  if(main)for(const p of L.plats)edBox(edPlatBox(p),cx,!!edPlatWhy(L,p),p.kind==='move');
  // Mânerele platformelor: capătul (lungimea) și capătul drumului (cât merge)
  if(main)for(const p of L.plats){const on=ED.tool.mode==='move',a=on?1:0.55;ctx.globalAlpha=a;
    const ex=(p.x+p.w)*TS-cx;ctx.fillStyle='#14121c';ctx.fillRect(ex-3,p.y*TS-1,3,8);ctx.fillStyle='#ffd23f';ctx.fillRect(ex-2,p.y*TS,1,6);
    if(p.kind==='move'){const hx=(p.ax==='x'?p.x+p.w-1+p.range:p.x+((p.w-1)>>1))*TS-cx+8,hy=(p.ax==='x'?p.y:p.y+p.range)*TS+3;
      ctx.fillStyle='#14121c';ctx.fillRect(hx-3,hy-3,7,7);ctx.fillStyle='#ffd23f';ctx.fillRect(hx-2,hy-2,5,5);ctx.fillStyle='#14121c';ctx.fillRect(hx,hy,1,1);}
    ctx.globalAlpha=1;}
  // În cameră: puțul în care cazi și cel prin care ieși
  if(!main&&under)for(const [sx,s,col] of [[under.en,'AICI CAZI','#9fe8ff'],[under.ex,'IEȘIRE','#7fff7f']]){const x=sx*TS-cx;
    ctx.strokeStyle=col;ctx.setLineDash([3,2]);ctx.strokeRect(x+0.5,0.5,SUB_SHAFT*TS-1,6*TS-1);ctx.setLineDash([]);edLabel(s,x+TS,6*TS+4,col);}
  // Bucata aleasă (Mutare) și obiectul arătat (Pointer)
  {const za=edZone().a,R=(r,col,dash)=>{if(!r)return;ctx.strokeStyle=col;ctx.lineWidth=1;ctx.setLineDash(dash?[3,2]:[]);
    ctx.strokeRect((r.x0+za)*TS-cx+0.5,r.y0*TS+0.5,(r.x1-r.x0+1)*TS-1,(r.y1-r.y0+1)*TS-1);ctx.setLineDash([]);};
    if(ED.marks.sel){const r=ED.marks.sel;ctx.fillStyle='rgba(159,232,255,0.12)';ctx.fillRect((r.x0+za)*TS-cx,r.y0*TS,(r.x1-r.x0+1)*TS,(r.y1-r.y0+1)*TS);R(r,'#9fe8ff',true);}
    R(ED.marks.hi,'#ffd23f',false);}
  const h=ED.hover;if(!h)return;
  const t=ED.tool,d=ED.down;
  // Dreptunghiul, cât tragi
  if(t.mode==='rect'&&d){const ax=Math.min(d.x,h.x),bx=Math.max(d.x,h.x),ay=Math.min(d.y,h.y),by=Math.max(d.y,h.y);
    const er=d.b===2;ctx.fillStyle=er?'rgba(255,74,74,0.25)':'rgba(255,210,63,0.25)';ctx.fillRect(ax*TS-cx,ay*TS,(bx-ax+1)*TS,(by-ay+1)*TS);
    ctx.strokeStyle=er?'#ff4a4a':'#ffd23f';ctx.lineWidth=1;ctx.strokeRect(ax*TS-cx+0.5,ay*TS+0.5,(bx-ax+1)*TS-1,(by-ay+1)*TS-1);return;}
  const X=h.x*TS-cx,Y=h.y*TS;
  const box=col=>{ctx.strokeStyle=col;ctx.lineWidth=1;ctx.strokeRect(X+0.5,Y+0.5,TS-1,TS-1);};
  if(t.mode==='erase'||(d&&d.b===2)){box('#ff4a4a');return;}
  if(t.mode==='move'){box('#9fe8ff');return;}
  if(t.mode==='pointer'){box('#ffffff');return;}
  const e=t.el,o=t.opt||{};ctx.globalAlpha=0.6;
  if(e==='water'||e==='I'){ctx.fillStyle=e==='I'?'#dff4ff':theme.water.body;ctx.fillRect(X,12*TS+(e==='I'?0:5),TS,e==='I'?6:2*TS-5);}
  else if(ED_TILES.includes(e)){const img=e==='D'?(ED.region==='cave'?tiles.D:tiles.G):e==='Z'?tiles.ZG:e==='W'?tiles.WG:e==='Y'?tiles.Yv[0]:e==='M'?tiles.M[0]:e==='H'?({ice:tiles.A,fire:tiles.R}[o.kind]||tiles.M)[0]:tiles[e];if(img)ctx.drawImage(img,X,Y);}
  else if(e==='coin')ctx.drawImage(COIN,X+2,Y+2);
  else if(e==='boy'||e==='man')ctx.drawImage((e==='boy'?BOY:MAN).A.r,X,Y+TS-20);
  else if(e==='bomb')ctx.drawImage(BOMB.A.r,X,Y+TS-16);
  else if(e==='cp'){ctx.fillStyle='#cfd3dc';ctx.fillRect(X+7,146,2,46);ctx.fillStyle='#8a8a9a';ctx.fillRect(X+9,148,12,9);}
  else if(e==='start')ctx.drawImage(TKS.A.r,X,edStartRow(h.x)*TS-16);
  else if(e==='gopen')ctx.drawImage(GOLD_PANA,X+5,Y+1);
  else if(e==='gbrick'){ctx.drawImage(tiles.B,X,Y);ctx.drawImage(GOLD_PANA,X+5,Y+1);}
  else if(e==='ghidden')ctx.drawImage(GOLD_PANA,X+5,Y+1);
  else if(e==='cage'){const cy=Math.min(13,h.y+1),bad=!!edCageWhy(L,h.x,cy);edCageZone(h.x,cy,cx,bad);ctx.globalAlpha=0.75;drawCageBars(X+8,cy*TS,false,0);}
  else if(e==='mvx'||e==='mvy'||e==='fall'){
    // Cât tragi, atât de lungă e
    const drag=d&&d.b!==2,w=drag?Math.abs(h.x-d.x)+1:(o.w|0)||(e==='fall'?1:3),PX=drag?Math.min(h.x,d.x)*TS-cx:X,PY=drag?d.y*TS:Y;
    {const gx=drag?Math.min(h.x,d.x):h.x,gy=drag?d.y:h.y,gp=e==='fall'?{kind:'fall',x:gx,y:gy,w}:{kind:'move',x:gx,y:gy,w,ax:e==='mvx'?'x':'y',range:Math.max(1,Math.min((o.range|0)||1,e==='mvy'?13-gy:L.w-gx-w))};
      edBox(edPlatBox(gp),cx,!!edPlatWhy({...L,plats:L.plats.filter(p=>!(p.x===gx&&p.y===gy))},gp),true);}
    for(let i=0;i<w;i++)ctx.drawImage(e==='fall'?PLANK_WORN[i%2]:tiles['='],PX+i*TS,PY);
    if(e!=='fall'){const r=(o.range|0)||1;ctx.fillStyle='rgba(255,255,255,0.8)';
      if(e==='mvx')for(let x=PX+2;x<PX+(w+r)*TS-2;x+=4)ctx.fillRect(x,PY+3,1,1);else for(let y=PY+2;y<=PY+r*TS+6;y+=4)ctx.fillRect(PX+w*TS/2,y,1,1);}
    if(drag){ctx.globalAlpha=1;edLabel(w+'',PX+w*TS/2,PY-8,'#ffd23f');}}
  else if(e==='sign'){ctx.fillStyle='#c89050';ctx.fillRect(X,130,72,26);ctx.fillStyle='#5a3510';ctx.fillRect(X+33,156,6,36);}
  else if(e==='rest'){ctx.fillStyle='#a8442a';ctx.fillRect(X,130,192,62);ctx.fillStyle='#16121a';ctx.fillRect(X-8,110,208,20);}
  else if(e==='cafe'){ctx.fillStyle='#6e5040';ctx.fillRect(X,139,96,53);ctx.fillStyle='#3e3238';ctx.fillRect(X-6,98,108,26);}
  else if(e==='cavein'||e==='caveout'){const k=e==='cavein'?'in':'out',tc={...L,cave:L.cave?{...L.cave,[k==='in'?'x':'x2']:h.x}:{x:h.x,x2:h.x}};
    edBox(edHoleBox(tc,k),cx,!!edHoleWhy(tc,k),true);ctx.fillStyle='#9fe8ff';ctx.fillRect(X,12*TS,SUB_SHAFT*TS,2*TS);}
  else if(e==='gem')ctx.fillStyle='#a070f0',ctx.fillRect(X+5,Y+4,6,12);
  else if(e==='bat')ctx.fillStyle='#3a3048',ctx.fillRect(X+2,Y+4,12,5);
  else if(e==='icicle'){ctx.fillStyle='#8a7a6a';for(let i=0;i<10;i++)ctx.fillRect(X+3+(i>>1),Y+i,10-i,1);}
  else if(e==='pool'){const dr=d&&d.b!==2,ax=dr?Math.min(d.x,h.x):h.x,w=dr&&d.x!==h.x?Math.abs(h.x-d.x)+1:3;ctx.fillStyle='#4a8ad0';ctx.fillRect(ax*TS-cx,Y+12,w*TS,4);}
  else if(e==='cin'||e==='cout'){ctx.fillStyle=e==='cin'?'#9fe8ff':'#7fff7f';ctx.fillRect(X,0,SUB_SHAFT*TS,6*TS);}
  ctx.globalAlpha=1;box('rgba(255,255,255,0.8)');
}
// Comenzile de la editor.html
const ED_CMDS={
  edHello(){edIcons();ED.view='';},
  edLevel(d){if(G.state==='edit'||G.state==='title')edShow(d.L);else edUse(d.L);},
  edTool(d){ED.tool={mode:d.mode,el:d.el,opt:d.opt||{}};},
  edCam(d){if(G.state==='edit'){const z=edZone();cam.x=edCamClamp((z.a+(+d.x||0))*TS);}},
  edRegion(d){if(G.state!=='edit')return;ED.region=d.r==='cave'&&under?'cave':'main';G.inUnder=ED.region==='cave';cam.x=edCamClamp(G.inUnder?under.a*TS:(under?under.x*TS-W/2:0));ED.view='';},
  edPlay(d){edPlay(d.L,d.from,d.god);},
  edStop(){if(G.state!=='edit')edStop();},
  edGod(d){G.god=!!d.v;},
  edMarks(d){ED.marks={sel:d.sel||null,hi:d.hi||null};},
};
if(EDIT){
  addEventListener('message',e=>{
    if(e.source!==window.parent||!(location.protocol==='file:'||e.origin===location.origin))return;
    const d=e.data;if(!d||typeof d.cmd!=='string'||!Object.prototype.hasOwnProperty.call(ED_CMDS,d.cmd))return;
    ED_CMDS[d.cmd](d);
  });
  // Mouse-ul pe hartă: pătrățelul de sub el (în coloanele zonei) ajunge la panou
  const tileOf=e=>{const r=cv.getBoundingClientRect(),z=edZone();
    return {x:clamp(Math.floor(((e.clientX-r.left)/r.width*W+Math.round(cam.x))/TS),z.a,z.a+z.w-1),y:clamp(Math.floor((e.clientY-r.top)/r.height*H/TS),0,ROWS-1)};};
  const send=(t,p,b)=>toParent({edPtr:{t,x:p.x-edZone().a,y:p.y,b,r:ED.region}});
  cv.addEventListener('pointerdown',e=>{if(G.state!=='edit')return;cv.setPointerCapture(e.pointerId);const p=tileOf(e);ED.hover=p;ED.down={x:p.x,y:p.y,b:e.button};send('down',p,e.button);});
  cv.addEventListener('pointermove',e=>{if(G.state!=='edit')return;const p=tileOf(e),h=ED.hover;
    if(h&&h.x===p.x&&h.y===p.y)return;ED.hover=p;send(ED.down?'move':'hover',p,ED.down?ED.down.b:-1);});
  const up=e=>{if(!ED.down)return;const b=ED.down.b;ED.down=null;if(G.state==='edit')send('up',tileOf(e),b);};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('pointerleave',()=>{if(!ED.down)ED.hover=null;});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  // Rotița mută harta
  cv.addEventListener('wheel',e=>{if(G.state!=='edit')return;e.preventDefault();cam.x=edCamClamp(cam.x+(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*0.6);},{passive:false});
  // Scurtăturile ajung la panou și când jocul are focusul
  addEventListener('keydown',e=>{
    if(G.state!=='edit')return;
    const k=(e.ctrlKey||e.metaKey)?(e.code==='KeyZ'?(e.shiftKey?'redo':'undo'):e.code==='KeyY'?'redo':null):({KeyP:'pointer',KeyB:'paint',KeyE:'erase',KeyR:'rect',KeyV:'move',Escape:'esc',Delete:'del',Backspace:'del'})[e.code]||null;
    if(k){e.preventDefault();toParent({edKey:k});}
  });
}
