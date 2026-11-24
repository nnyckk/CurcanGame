'use strict';
// ===== TEMELE NIVELURILOR, TILE-URILE, FUNDALURILE =====
// Placa de gheață a lacurilor: 7 rânduri
const ICE_SLAB=7,ICE_ROWS=['#ffffff','#e6f6fe','#e6f6fe','#c4e6f6','#c4e6f6','#c4e6f6','#a6d2ea'];
const THEMES=[
 {name:'AVENTURA ÎNCEPE',farm:true,sky:['#4fb4f0','#6cc6f6','#8ed6fa','#b4e6fc'],sun:{x:330,y:42,r:14,c:'#fff6b0',c2:'#ffe070'},far:'#9ac4dc',farL:'#b4d6e8',
  mid:'hills',midC:'#5cae48',midL:'#7ccc5c',midD:'#3e8a36',clouds:true,cloudC:'#ffffff',cloudS:'#cfe8f4',
  grass:'#5cc23a',grassL:'#8ae060',grassD:'#3a8a28',dirt:'#9a5a2a',dirtD:'#6e3c18',dirtL:'#b87440',
  water:{body:'#3a8ee8',deep:'#2662b8',top:'#a8e0ff',foam:'#ffffff',glint:'#ffffff'}},
 // Pădurea de brazi iarna: munți înzăpeziți în spate
 {name:'ALUNECUȘ',snow:true,sky:['#94bee2','#acd0ec','#c4def2','#dae9f6'],sun:{x:318,y:40,r:11,c:'#fffdf2',c2:'#f4eccc'},
  far:'#a9bcd2',farL:'#bfcfe0',farHill:'#c8d7e6',farHillL:'#e4ecf4',
  mid:'forest',midC:'#dbe7f1',midL:'#f6f9fc',midD:'#bccdde',clouds:true,cloudN:3,cloudC:'#ffffff',cloudS:'#cfdbe8',
  grass:'#f2f6fa',grassL:'#ffffff',grassD:'#c6d6e6',dirt:'#5e4a40',dirtD:'#3e3028',dirtL:'#7a6658',
  water:{body:'#4a8ab8',deep:'#26507a',top:'#cdeeff',foam:'#ffffff',glint:'#ffffff'}},
 {name:'DEȘERTUL',sky:['#060818','#0c1030','#141a48','#202a60'],moon:{x:80,y:44,r:12},far:'#1c2250',farL:'#28306a',
  mid:'dunes',midC:'#2c2848',midL:'#3c3660',midD:'#1c1830',clouds:false,stars:true,
  grass:'#e8c47a',grassL:'#f8dc98',grassD:'#c8a058',dirt:'#b8864a',dirtD:'#8a5e30',dirtL:'#d0a060',
  water:{body:'#1c2c64',deep:'#0e1640',top:'#6a8ad0',foam:'#c8d8ff',glint:'#f0f4ff'}},
 // Ferma noaptea
 {name:'ORA DE CULCARE',farm:true,night:true,sky:['#070a1c','#0c1230','#141c44','#1e2a58'],moon:{x:300,y:38,r:10},stars:true,
  far:'#1c2448',farL:'#2c3864',mid:'hills',midC:'#1c3a30',midL:'#2a5444',midD:'#12281f',
  clouds:true,cloudN:3,cloudC:'#2e3862',cloudS:'#1e2648',
  grass:'#5cc23a',grassL:'#8ae060',grassD:'#3a8a28',dirt:'#9a5a2a',dirtD:'#6e3c18',dirtL:'#b87440',
  water:{body:'#3a8ee8',deep:'#2662b8',top:'#a8e0ff',foam:'#ffffff',glint:'#ffffff'}},
];
// Lacul: tot ferma ziua, cu alt nume
THEMES.push(Object.assign({},THEMES[0],{name:'MARELE ALBASTRU',lake:true}));
// Noaptea de iarnă: pădurea de brazi noaptea
THEMES.push(Object.assign({},THEMES[1],{name:'MINUS GRADE',night:true,sun:null,moon:{x:92,y:42,r:10},stars:true,
  sky:['#070a1c','#0b1230','#121c44','#1c2a58']}));
// Popasul la MesoCafe: pădurea de brazi ziua, cu alt nume
THEMES.push(Object.assign({},THEMES[1],{name:'BONUS'}));
// Deșertul ziua (editorul): cer cald, soare, dune și ziguraturi de nisip
THEMES.push(Object.assign({},THEMES[2],{name:'DEȘERTUL ZIUA',sky:['#5aaee6','#7cc2ee','#a8d6f0','#f0dcae'],moon:null,stars:false,
  sun:{x:326,y:40,r:15,c:'#fff8d8',c2:'#ffe6a0'},far:'#e2b878',farL:'#f2cc92',midC:'#d4a25c',midL:'#ecc07c',midD:'#b8884a',
  clouds:true,cloudN:2,cloudC:'#ffffff',cloudS:'#f2e2c8',water:{body:'#3a8ee8',deep:'#2662b8',top:'#a8e0ff',foam:'#ffffff',glint:'#ffffff'}}));
const tileCache={},bgCache={};
function getTiles(ti){
  if(tileCache[ti])return tileCache[ti];
  const th=THEMES[ti],T={};
  const SPECK=[[3,7],[10,9],[6,12],[13,13],[1,11],[8,6],[12,5],[4,14],[15,8],[9,15]];
  function dirt(g,from){g.fillStyle=th.dirt;g.fillRect(0,0,16,16);SPECK.forEach(([x,y],i)=>{if(y<from)return;g.fillStyle=i%2?th.dirtD:th.dirtL;g.fillRect(x,y,1,1);if(i%3===0)g.fillRect(x+1,y,1,1);});}
  let [c,g]=mkCanvas(16,16);dirt(g,0);T.D=c;
  [c,g]=mkCanvas(16,16);dirt(g,6);g.fillStyle=th.grass;g.fillRect(0,0,16,4);
  for(let x=0;x<16;x++){if((x*5+3)%4<2)g.fillRect(x,4,1,1);if((x*7)%5===0)g.fillRect(x,5,1,1);}
  g.fillStyle=th.grassL;g.fillRect(0,0,16,1);g.fillStyle=th.grassD;[2,6,9,13].forEach(x=>g.fillRect(x,2,1,1));T.G=c;
  if(th.farm){
    // Variante de iarbă și pământ
    const stone=(g,x,y,small)=>{const w=small?2:3;g.fillStyle='#7a6a5a';g.fillRect(x,y,w,2);g.fillStyle='#a8988a';g.fillRect(x,y,w-1,1);g.fillStyle='#4a3a2a';g.fillRect(x,y+2,w,1);};
    const from=base=>{const [c,g]=mkCanvas(16,16);g.drawImage(base,0,0);return [c,g];};
    T.Gv=[T.G];T.Dv=[T.D];
    [c,g]=from(T.G);[[3,1,'#ffffff'],[11,2,'#ffe14a'],[7,0,'#ff8ac0']].forEach(([x,y,col])=>{g.fillStyle=col;g.fillRect(x,y,1,1);});T.Gv.push(c);   // flori mici
    [c,g]=from(T.G);g.fillStyle=th.grassD;[[1,1],[4,2],[5,1],[10,1],[14,2]].forEach(([x,y])=>g.fillRect(x,y,1,2));
    g.fillStyle=th.grassL;g.fillRect(4,0,3,1);g.fillRect(12,0,2,1);T.Gv.push(c);   // smocuri
    [c,g]=from(T.G);stone(g,10,10);T.Gv.push(c);   // pietricică
    [c,g]=from(T.D);stone(g,4,5);T.Dv.push(c);   // piatră
    [c,g]=from(T.D);g.fillStyle=th.dirtD;[[2,3],[3,4],[4,4],[5,5],[6,5],[7,6],[6,7],[8,6],[9,7]].forEach(([x,y])=>g.fillRect(x,y,1,1));T.Dv.push(c);   // rădăcină
    [c,g]=from(T.D);stone(g,11,3,true);stone(g,3,11,true);T.Dv.push(c);   // pietricele
  }
  if(th.snow){
    // Solul de iarnă: un strat de zăpadă de 5-7 px
    const px=(g,x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
    const mkG=extra=>{const [c,g]=mkCanvas(16,16);dirt(g,7);
      for(let x=0;x<16;x++){const d=5+((x*7+3)%5===0?1:0)+((x*3)%7===1?1:0);px(g,x,0,1,d,th.grass);px(g,x,d-1,1,1,th.grassD);}
      px(g,0,0,16,1,th.grassL);if(extra)extra(g);return c;};
    T.G=mkG();
    T.Gv=[T.G,
      mkG(g=>{px(g,3,2,1,1,'#bfe8ff');px(g,11,1,1,1,'#ffffff');px(g,12,3,1,1,'#bfe8ff');px(g,7,3,1,1,'#dff4ff');}),   // sclipiri
      mkG(g=>{px(g,9,1,4,3,'#7a7884');px(g,10,1,2,1,'#a4a2ae');px(g,9,0,4,1,th.grassL);px(g,9,3,4,1,'#55535e');}),   // piatră
      mkG(g=>{[[3,3],[4,2],[5,2],[6,1],[7,0],[5,1]].forEach(([x,y])=>px(g,x,y,1,1,'#6a4a30'));})];   // crenguță
    const mkD=extra=>{const [c,g]=mkCanvas(16,16);dirt(g,0);extra(g);return c;};
    T.D=mkD(()=>{});
    T.Dv=[T.D,
      mkD(g=>{px(g,4,5,3,2,'#6e6c78');px(g,4,5,2,1,'#94929e');px(g,11,11,2,2,'#6e6c78');}),   // pietre
      mkD(g=>{[[2,3],[9,6],[13,2],[6,12],[12,13]].forEach(([x,y])=>px(g,x,y,1,1,'#a8b8c8'));})];   // brumă
  }
  // Gheața lacurilor
  {const w=th.water;
    T.Iv=[0,1].map(v=>{const [c,g]=mkCanvas(16,ICE_SLAB);
      ICE_ROWS.forEach((col,y)=>{g.fillStyle=col;g.fillRect(0,y,16,1);});
      g.fillStyle='#ffffff';(v?[[9,2],[10,3],[11,4],[3,4],[4,5]]:[[2,2],[3,3],[4,4],[12,2],[13,3]]).forEach(([x,y])=>g.fillRect(x,y,1,1));   // luciu
      return c;});
    T.I=T.Iv[0];
    // Fundul lacului, opac, ca să nu se vadă fundalul prin apă
    T.Lv=[0,1,2].map(v=>{const LH=H-(12*TS+5),[c,g]=mkCanvas(16,LH),r=rng(v*31+7);
      for(let y=0;y<LH;y++){g.fillStyle=y<7?'#5c9acb':y<13?'#4c8aba':y<19?'#3e78a8':'#305f8e';g.fillRect(0,y,16,1);}
      g.fillStyle='#78b2da';for(let i=0;i<2;i++)g.fillRect(r()*10|0,4+(r()*12|0),3+(r()*5|0),1);   // dungi
      for(let i=0;i<3;i++){const bx=1+(r()*14|0),by=5+(r()*18|0);g.fillStyle='#a4d2ee';g.fillRect(bx,by,1,1);   // bule
        if(i===0){g.fillStyle='#d8f0ff';g.fillRect(bx,by-1,1,1);}}
      return c;});
    const CR=[[[7,1],[8,2],[8,3],[9,4],[7,4],[6,5]],
              [[9,2],[10,1],[11,1],[5,3],[4,3],[3,4],[10,4],[11,5],[12,5]],
              [[2,2],[1,2],[12,2],[13,3],[14,3],[6,1],[5,0],[13,6],[3,6],[2,5]]];
    T.Icrack=[1,2,3].map(n=>{const [c,g]=mkCanvas(16,7);
      for(let k=0;k<n;k++)CR[k].forEach(([x,y])=>{g.fillStyle='#4f86ac';g.fillRect(x,y,1,1);g.fillStyle='#ffffff';g.fillRect(x+1,y,1,1);});
      if(n===3){g.fillStyle=w.body;[[8,3],[7,4],[10,4]].forEach(([x,y])=>g.fillRect(x,y,1,1));}   // apa se vede prin gheață
      return c;});}
  // Puțină zăpadă pe blocuri: un strat subțire
  T.cap=mkSprite([
    "WWWWWWWWWWWWWWWW",
    "wwwwwwwwwwwwwwww",
    "swwsswwwwswwwssw",
    ".s...w...s....s.",
  ],{W:'#ffffff',w:'#eef4fa',s:'#cfdcea'},false);
  // mud brick
  [c,g]=mkCanvas(16,16);g.fillStyle='#c98a4b';g.fillRect(0,0,16,16);g.fillStyle='#6a3a1a';
  g.fillRect(0,7,16,1);g.fillRect(0,15,16,1);g.fillRect(7,0,1,7);g.fillRect(15,0,1,7);g.fillRect(3,8,1,7);g.fillRect(11,8,1,7);
  g.fillStyle='#e6ae70';g.fillRect(0,0,7,1);g.fillRect(8,0,7,1);g.fillRect(0,8,3,1);g.fillRect(4,8,7,1);g.fillRect(12,8,4,1);
  g.fillStyle='#a86a34';g.fillRect(5,3,1,1);g.fillRect(12,4,1,1);g.fillRect(8,11,1,1);T.B=c;
  // M block frames
  const mBlock=(bases,o,hi,sh,dk)=>bases.map(base=>{const [c,g]=mkCanvas(16,16);
    g.fillStyle=o;g.fillRect(0,0,16,16);g.fillStyle=base;g.fillRect(1,1,14,14);
    g.fillStyle=hi;g.fillRect(1,1,14,1);g.fillRect(1,1,1,14);g.fillStyle=sh;g.fillRect(1,14,14,1);g.fillRect(14,1,1,14);
    g.fillStyle=o;[[2,2],[13,2],[2,13],[13,13]].forEach(([x,y])=>g.fillRect(x,y,1,1));
    const M=["m....m","mm..mm","m.mm.m","m....m","m....m","m....m","m....m"];
    M.forEach((r,y)=>{for(let x=0;x<6;x++)if(r[x]==='m'){g.fillStyle=sh;g.fillRect(6+x,5+y,1,1);g.fillStyle=dk;g.fillRect(5+x,4+y,1,1);}});
    return c;});
  T.M=mBlock(['#f2b630','#f7c850','#ffd970'],'#7a3e0a','#fff0b0','#b8701a','#6a2a0a');
  T.A=mBlock(['#8ccfee','#a4dcf4','#c0e8fa'],'#24507a','#f0fbff','#5a98c4','#1a3a5e');
  T.R=mBlock(['#e8402c','#f2603e','#ff8a5a'],'#5c0c12','#ffe0d0','#b02a1e','#4a0a0e');   // blocul de foc
  [c,g]=mkCanvas(16,16);g.fillStyle='#4a2a10';g.fillRect(0,0,16,16);g.fillStyle='#9a6030';g.fillRect(1,1,14,14);
  g.fillStyle='#b07840';g.fillRect(1,1,14,1);g.fillStyle='#4a2a10';[[2,2],[13,2],[2,13],[13,13]].forEach(([x,y])=>g.fillRect(x,y,1,1));T.U=c;
  [c,g]=mkCanvas(16,16);g.fillStyle='#3a3a48';g.fillRect(0,0,16,16);g.fillStyle='#8a8fa0';g.fillRect(1,1,14,14);
  g.fillStyle='#b8bccc';g.fillRect(1,1,14,2);g.fillRect(1,1,2,14);g.fillStyle='#5a5e6e';g.fillRect(1,13,14,2);g.fillRect(13,1,2,14);
  g.fillStyle='#6a6e7e';g.fillRect(6,5,1,3);g.fillRect(7,8,1,2);g.fillRect(8,10,2,1);T.X=c;
  // Podeaua cafenelei: scânduri vechi de lemn închis
  [c,g]=mkCanvas(16,16);g.fillStyle='#5a3a26';g.fillRect(0,0,16,16);g.fillStyle='#8a5c3a';g.fillRect(0,0,16,1);
  g.fillStyle='#6e4a30';g.fillRect(0,1,16,1);g.fillStyle='#462c1c';g.fillRect(0,6,16,1);g.fillRect(0,11,16,1);
  g.fillRect(9,2,1,4);g.fillRect(3,7,1,4);g.fillRect(12,12,1,4);
  g.fillStyle='#64422c';[[5,3],[13,8],[7,14],[1,13]].forEach(([x,y])=>g.fillRect(x,y,2,1));T.F=c;
  // Sub alt rând de podea: fără muchia luminată de sus
  [c,g]=mkCanvas(16,16);g.drawImage(T.F,0,0);g.fillStyle='#5a3a26';g.fillRect(0,0,16,2);g.fillStyle='#462c1c';g.fillRect(0,0,16,1);T.F2=c;
  [c,g]=mkCanvas(16,16);g.fillStyle='#b5793a';g.fillRect(0,0,16,6);g.fillStyle='#e0a860';g.fillRect(0,0,16,1);
  g.fillStyle='#5a3510';g.fillRect(0,5,16,1);g.fillRect(2,2,1,1);g.fillRect(13,2,1,1);g.fillStyle='#8a5424';g.fillRect(7,1,1,4);T['=']=c;
  // spikes
  [c,g]=mkCanvas(16,16);
  for(let s=0;s<2;s++){const cx=s*8+4;for(let r=0;r<13;r++){const hw=Math.floor(r*4/13);g.fillStyle='#2a2a38';g.fillRect(cx-hw-1,3+r,hw*2+3,1);g.fillStyle=r<2?'#ffffff':'#d8dce6';g.fillRect(cx-hw,3+r,hw*2+1,1);g.fillStyle='#9aa0b0';g.fillRect(cx,3+r,hw+1,1);}}
  g.fillStyle='#4a4a5a';g.fillRect(0,15,16,1);T['^']=c;
  // Pământ moale: pete neregulate, firimituri, rar o pietricică (se repetă fără cusături)
  const ink='#120810';
  const earth=(seed,base,lite,dark)=>{const [c,g]=mkCanvas(16,16),R=rng(seed);g.fillStyle=base;g.fillRect(0,0,16,16);
    const wrap=(x,y,w,h)=>{for(const ox of [0,-16,16])for(const oy of [0,-16,16])g.fillRect(x+ox,y+oy,w,h);};
    for(let i=0;i<6;i++){const x=R()*16|0,y=R()*16|0,w=3+(R()*3|0);g.fillStyle=i%2?lite:dark;g.globalAlpha=0.45;
      wrap(x,y,w,2);wrap(x+1,y-1,w-2,1);wrap(x+1,y+2,w-2,1);}
    g.globalAlpha=1;
    for(let i=0;i<16;i++){g.fillStyle=R()<0.6?dark:lite;wrap(R()*16|0,R()*16|0,1,1);}
    if(R()<0.4){const x=2+(R()*11|0),y=2+(R()*11|0);g.fillStyle=mixHex(lite,'#ffffff',0.15);g.fillRect(x,y,2,1);g.fillStyle=dark;g.fillRect(x,y+1,2,1);}
    return c;};
  // Pământul din spate: același pământ, mai deschis sus și tot mai închis în jos
  const ZA=[0.22,0.37,0.5,0.62];
  const dim=(img,a,y0=0)=>{const [c,g]=mkCanvas(16,16);g.drawImage(img,0,0);g.fillStyle='rgba(18,8,16,'+a+')';g.fillRect(0,y0,16,16-y0);return c;};
  T.Zd=ZA.map(a=>(T.Dv||[T.D]).map(d=>dim(d,a)));T.Z=T.Zd[1][0];
  // Al doilea strat, mai departe: mai închis
  const WA=[0.42,0.54,0.64,0.72];T.Wd=WA.map(a=>(T.Dv||[T.D]).map(d=>dim(d,a)));
  T.WG=dim(T.G,WA[0],6);{const g=T.WG.getContext('2d');g.fillStyle='rgba(18,8,16,0.14)';g.fillRect(0,0,16,6);g.fillStyle='rgba(0,0,0,0.3)';g.fillRect(0,6,16,1);}   // iarba puțin stinsă; pământul de sub ea, la fel ca restul dealului
  T.ZG=dim(T.G,ZA[0],6);{const g=T.ZG.getContext('2d');g.fillStyle='rgba(0,0,0,0.25)';g.fillRect(0,6,16,1);}   // iarba de sus, aprinsă: pe ea poți sta
  // Interiorul unui pasaj prin deal: pământ foarte închis
  T.Yv=[3,17,29].map(s=>earth(s,mixHex(th.dirtD,ink,0.62),mixHex(th.dirt,ink,0.5),mixHex(th.dirtD,ink,0.8)));T.Y=T.Yv[0];
  return tileCache[ti]=T;
}
// Număr pseudo-aleator stabil pentru un tile
function vhash(x,y){let h=(x*374761393+y*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return (h^(h>>>16))>>>0;}
// Jumătate din tile-uri sunt cele de bază
function pickVar(arr,tx,ty){const h=vhash(tx,ty);return h%10<5?arr[0]:arr[1+((h>>>4)%(arr.length-1))];}
function getBG(ti){
  if(bgCache[ti])return bgCache[ti];
  const th=THEMES[ti],R=rng(ti*977+13);
  // sky
  const [sky,sg]=mkCanvas(W,H);const n=th.sky.length,bh=Math.ceil(H/n);
  th.sky.forEach((c,i)=>{sg.fillStyle=c;sg.fillRect(0,i*bh,W,bh);});
  for(let i=1;i<n;i++){const y=i*bh;sg.fillStyle=th.sky[i];for(let yy=y-3;yy<y;yy++)for(let x=(yy%2);x<W;x+=2)sg.fillRect(x,yy,1,1);sg.fillStyle=th.sky[i-1];for(let x=((y+1)%2);x<W;x+=4)sg.fillRect(x,y,1,1);}
  if(th.stars){for(let i=0;i<90;i++){const x=R()*W|0,y=R()*150|0;sg.fillStyle=R()<0.2?'#ffe9a0':'#ffffff';sg.fillRect(x,y,1,1);if(R()<0.12){sg.fillRect(x-1,y,3,1);sg.fillRect(x,y-1,1,3);}}}
  if(th.sun){pcirc(sg,th.sun.x,th.sun.y,th.sun.r+3,th.sun.c2);pcirc(sg,th.sun.x,th.sun.y,th.sun.r,th.sun.c);}
  if(th.moon){const m=th.moon;pcirc(sg,m.x,m.y,m.r+4,'#2a3a7a');pcirc(sg,m.x,m.y,m.r,'#f4f0d8');sg.fillStyle='#d8d2b8';sg.fillRect(m.x-4,m.y-3,3,3);sg.fillRect(m.x+3,m.y+2,4,3);sg.fillRect(m.x-1,m.y+5,2,2);}
  // far layer Iarna straturile sunt mai late
  const FW=th.snow?1200:800,[far,fg]=mkCanvas(FW,H);
  const wrap=fn=>{fn(0);fn(-FW);fn(FW);};
  fg.fillStyle=th.far;
  const hill=x=>(148+Math.sin(x*TAU*2/FW)*9+Math.sin(x*TAU*5/FW)*4)|0;
  for(let x=0;x<FW;x++)fg.fillRect(x,hill(x),1,H);
  // Ferma: siluete de fermă în loc de ziguraturi și palmieri
  let dyn=null;
  if(th.farm)dyn=farmFar(fg,th,R,hill,FW);
  else if(th.snow)snowFar(fg,th,R,hill,FW);
  else{
  [[170,150],[560,148]].forEach(([zx,base])=>wrap(o=>{const x0=zx+o,sh=11;
    // fundație până jos, ca zigguratul să stea pe deal
    fg.fillStyle=th.far;fg.fillRect(x0-59,base,118,H-base);
    for(let s=0;s<4;s++){const w=118-s*26,y=base-(s+1)*sh;fg.fillStyle=th.far;fg.fillRect(x0-w/2,y,w,sh);fg.fillStyle=th.farL;fg.fillRect(x0-w/2,y,w,1);}
    fg.fillStyle=th.farL;fg.fillRect(x0-5,base-4*sh,10,4*sh);fg.fillStyle=th.far;for(let y=base-4*sh;y<base;y+=3)fg.fillRect(x0-5,y,10,1);
    fg.fillStyle=th.far;fg.fillRect(x0-11,base-4*sh-9,22,9);fg.fillStyle=th.farL;fg.fillRect(x0-11,base-4*sh-9,22,1);fg.fillRect(x0-2,base-4*sh-6,4,6);}));
  const palm=(px,b0)=>wrap(o=>{const x0=px+o,base=Math.max(b0,hill(((px%FW)+FW)%FW)+2);fg.fillStyle=th.far;fg.fillRect(x0,base,2,H-base);for(let i=0;i<30;i++)fg.fillRect(x0+Math.round(Math.sin(i/30*1.3)*4),base-i,2,1);
    const tx=x0+4,ty=base-30;[0.2,-0.4,-1.1,-2.0,-2.7,-3.3].forEach(a=>{for(let j=0;j<12;j++)fg.fillRect(Math.round(tx+Math.cos(a)*j),Math.round(ty+Math.sin(a)*j+j*j*0.06),2,2);});});
  [60,90,300,330,420,700,740].forEach((px,i)=>palm(px,150+(i%2)*3));
  }
  // mid layer
  const [mid,mg]=mkCanvas(FW,H);
  if(th.mid==='hills'){for(let x=0;x<FW;x++){const h=(170+Math.sin(x*TAU*3/FW)*12+Math.sin(x*TAU*7/FW+1)*6)|0;mg.fillStyle=th.midC;mg.fillRect(x,h,1,H);mg.fillStyle=th.midL;mg.fillRect(x,h,1,2);}
    mg.fillStyle=th.midD;for(let i=0;i<60;i++){const x=R()*FW|0;const h=(170+Math.sin(x*TAU*3/FW)*12+Math.sin(x*TAU*7/FW+1)*6)|0;mg.fillRect(x,h+6+(R()*14|0),2,2);}
    if(th.farm)farmTrees(mg,th,R,FW);}
  else if(th.mid==='forest'){
    // Dealuri albe, line
    const mh=x=>(172+Math.sin(x*TAU*3/FW)*10+Math.sin(x*TAU*7/FW+1)*5)|0;
    for(let x=0;x<FW;x++){const h=mh(x);mg.fillStyle=th.midC;mg.fillRect(x,h,1,H);mg.fillStyle=th.midL;mg.fillRect(x,h,1,2);}
    forestFirs(mg,R,FW,mh);}
  else{for(let x=0;x<FW;x++){const h=(174+Math.sin(x*TAU*2/FW)*10+Math.sin(x*TAU*5/FW+2)*5)|0;mg.fillStyle=th.midC;mg.fillRect(x,h,1,H);mg.fillStyle=th.midL;mg.fillRect(x,h,1,1);}
    const h2=x=>(186+Math.sin(x*TAU*3/FW+1)*6)|0;for(let x=0;x<FW;x++){mg.fillStyle=th.midD;mg.fillRect(x,h2(x),1,H);}}
  // clouds
  let clouds=null;
  if(th.clouds){const [cl,cg]=mkCanvas(FW,110),cn=th.cloudN||7;for(let i=0;i<cn;i++){const cx=40+i*Math.floor(770/cn)+(R()*40|0),cy=20+(R()*60|0),k=3+(R()*3|0);
    const blobs=[];for(let j=0;j<k;j++)blobs.push([cx+j*10-k*5,cy-(j%2?4:0)-(R()*4|0),7+(R()*5|0)]);
    blobs.forEach(([x,y,r])=>pcirc(cg,x,y+3,r,th.cloudS));blobs.forEach(([x,y,r])=>pcirc(cg,x,y,r,th.cloudC));cg.clearRect(0,cy+8,FW,0);}
    clouds=cl;}
  // Iarna: încă un strat, mai aproape — doi brazi mari, rari
  let near=null;
  if(th.snow){const [nc,ng]=mkCanvas(FW,H);
    for(let i=0;i<FW/400;i++){const x=150+i*400+(R()*90|0),hgt=64+(R()*22|0);
      for(const o of [0,-FW,FW])fir(ng,x+o,206,hgt,'#3d6a5c','#e8f0f6','#bccbd8','#4a3a30');}
    near=nc;}
  // Iarna noaptea: munții
  if(th.snow&&th.night)for(const c of [far,mid,clouds,near])if(c){const g=c.getContext('2d');
    g.globalCompositeOperation='source-atop';g.fillStyle='rgba(8,14,44,0.6)';g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='source-over';}
  return bgCache[ti]={sky,far,mid,clouds,dyn,near,night:!!th.night};
}
