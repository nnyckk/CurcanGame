'use strict';
// ===== ACHIEVEMENTS: iconițele de pe cartonașe =====
const ART_W=28,ART_H=28;
const N8=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
// O formă plină: lumină sus-stânga, umbră jos-dreapta, contur pe dinafară
function artShape(g,inside,c){
  for(let y=1;y<ART_H-1;y++)for(let x=1;x<ART_W-1;x++){
    const px=x+0.5,py=y+0.5;let col=null;
    if(inside(px,py)){
      const f=typeof c.f==='function'?c.f(px,py):c.f;
      col=c.l&&(!inside(px-1,py)||!inside(px,py-1))?c.l:c.d&&(!inside(px+1,py)||!inside(px,py+1))?c.d:f;}
    else if(c.k&&N8.some(([dx,dy])=>inside(px+dx,py+dy)))col=c.k;
    if(col){g.fillStyle=col;g.fillRect(x,y,1,1);}
  }
}
const inCirc=(cx,cy,r)=>(x,y)=>(x-cx)**2+(y-cy)**2<=r*r;
const inEll=(cx,cy,rx,ry)=>(x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
const inRect=(x0,y0,x1,y1)=>(x,y)=>x>=x0&&x<=x1&&y>=y0&&y<=y1;
const inAny=(...f)=>(x,y)=>f.some(h=>h(x,y));
function inPoly(p){return (x,y)=>{let o=false;
  for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)o=!o;}
  return o;};}
// Stea cu n colțuri
const starPts=(cx,cy,n,ro,ri)=>Array.from({length:n*2},(_,i)=>{const r=i%2?ri:ro,a=-Math.PI/2+i*Math.PI/n;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];});
function artStar(R,x,y,c){R(x-1,y,3,1,c);R(x,y-1,1,3,c);}
const ART_M=["#.....#","##...##","#.#.#.#","#..#..#","#.....#"];
// Câte o iconiță pentru fiecare achievement
const ACH_DRAW={
  pofta(g,R){   // clopotul de servit
    const c={k:'#0c0a14',f:'#c8cedc',l:'#ffffff',d:'#8a90a8'};
    artShape(g,(x,y)=>y<=19&&inEll(14,19,10,10)(x,y),c);
    artShape(g,inCirc(14,8.5,1.8),c);
    artShape(g,inRect(3,19,25,22),{k:'#0c0a14',f:'#e8ecf4',d:'#9aa0b8'});
  },
  pene(g,R){   // pana de aur
    const s=Math.SQRT1_2,u=(x,y)=>((x-14)-(y-14))*s,v=(x,y)=>((x-14)+(y-14))*s;
    artShape(g,(x,y)=>{const a=u(x,y);return a>=-5&&a<=10&&Math.abs(v(x,y))<=4.3*Math.sin(Math.PI*(a+5)/15);},{k:'#3a2004',f:'#ffd23f',l:'#fff3b0',d:'#d08a10'});
    for(let y=1;y<27;y++)for(let x=1;x<27;x++){const a=u(x+0.5,y+0.5);   // tija
      if(Math.abs(v(x+0.5,y+0.5))<=0.6&&a>=-10&&a<=9)R(x,y,1,1,a<-5?'#e0b050':'#fff8e0');}
  },
  bogatas(g,R){   // cuibul cu bani
    const coin={k:'#5a3008',f:'#f5c030',l:'#fff0a0',d:'#a8641a'};
    artShape(g,inCirc(6.5,13.5,3.2),coin);artShape(g,inCirc(21.5,13.5,3.2),coin);
    g.drawImage(COIN,8,4);   // bănuțul din joc
    const twig=(x,y)=>Math.floor(x+y*2)%5===0||Math.floor(x-y*2+100)%5===0?'#7a4a1a':'#a0682a';   // crenguțe împletite
    artShape(g,(x,y)=>y>=14&&inEll(14,15,12.5,9)(x,y),{k:'#2a1606',f:twig,l:'#c89050',d:'#5a3410'});
    R(0,14,3,1,'#7a4a1a');R(25,13,3,1,'#7a4a1a');R(2,13,1,1,'#a0682a');R(25,15,2,1,'#a0682a');   // crenguțe care ies
    artStar(R,23,6,'#ffffff');
  },
  zgarietura(g,R){   // scutul
    const hw=y=>y<14?9:9*Math.sqrt(Math.max(0,(24.5-y)/10.5));
    artShape(g,(x,y)=>y>=4.5&&y<=24.5&&Math.abs(x-14)<=hw(y),{k:'#0a1430',f:'#3a6ad8',l:'#7aa4ff',d:'#24449a'});
    const v=[[9,13],[10,14],[11,15],[12,16],[13,15],[14,14],[15,13],[16,12],[17,11],[18,10]];
    for(const [x,y] of v)R(x+1,y+1,2,2,'#0a1430');for(const [x,y] of v)R(x,y,2,2,'#ffffff');
  },
  ziua(g,R){   // confetti de petrecere
    artShape(g,inPoly([[5,24],[8,11],[18,21]]),{k:'#2a0a10',f:(x,y)=>Math.floor(((x-5)+(24-y))/3.2)%2?'#fff4e0':'#e8323e'});
    for(const [x,y,w,h,c] of [[16,4,2,1,'#ffd23f'],[20,7,1,2,'#3a86e8'],[13,6,1,2,'#7ad058'],[22,3,2,1,'#e8323e'],[21,12,2,1,'#ff8ac0'],
      [24,9,1,2,'#ffd23f'],[18,10,1,1,'#ffffff'],[11,3,1,1,'#ffd23f'],[17,1,1,1,'#7ad058'],[24,15,1,1,'#3a86e8']])R(x,y,w,h,c);
  },
  combo(g,R){   // steaua cu X4
    artShape(g,inPoly(starPts(14,14,8,11,7)),{k:'#3a1400',f:'#ff8a1a',l:'#ffc060',d:'#c85a00'});
    txtRaw(g,'X4',10,12,'#3a1400',1);txtRaw(g,'X4',9,11,'#ffffff',1);
  },
  fulger(g,R){
    artShape(g,inPoly([[15,3],[21,3],[16,11],[21,11],[10,25],[13,15],[8,15]]),{k:'#3a2600',f:'#ffd23f',l:'#fff6b0',d:'#e09a10'});
  },
  nemuritor(g,R){   // inima cu aripi
    // Aripile din spate: câte 3 pene răsfirate, de la cea de sus la cea din față
    const wc={k:'#0c0a14',f:'#ffffff',d:'#c8d0e8'};
    const feather=(px,py,deg,L,w)=>{const a=deg*Math.PI/180,ux=Math.cos(a),uy=-Math.sin(a),cx=px+ux*(L/2+1),cy=py+uy*(L/2+1);
      return (x,y)=>{const dx=x-cx,dy=y-cy;return ((dx*ux+dy*uy)/(L/2))**2+((dy*ux-dx*uy)/w)**2<=1;};};
    for(const s of [-1,1])for(const [deg,L] of [[110,10],[140,11],[170,9]])artShape(g,feather(14+s*3,13,s<0?deg:180-deg,L,1.9),wc);
    artShape(g,inAny(inCirc(11,11,3.8),inCirc(17,11,3.8),inPoly([[7.2,12.3],[20.8,12.3],[14,20.5]])),{k:'#2a0610',f:'#ff4a6a',l:'#ffa0b4',d:'#c0203c'});
  },
  umbra(g,R){   // luna
    artShape(g,(x,y)=>inCirc(13,14,9)(x,y)&&!inCirc(18,10.5,7.5)(x,y),{k:'#1a0c30',f:'#b48ae8',l:'#e0c8ff',d:'#7a50b8'});
    artStar(R,19,11,'#ffffff');R(23,5,1,1,'#ffffff');R(15,6,1,1,'#e0c8ff');
  },
  vultur(g,R){   // ținta
    artShape(g,(x,y)=>{const r=Math.hypot(x-14,y-14),ax=Math.abs(x-14),ay=Math.abs(y-14);
      return (r>=6.5&&r<=9)||r<=1.6||(ax<=1&&ay>=5&&ay<=11)||(ay<=1&&ax>=5&&ax<=11);},{k:'#06222a',f:'#3ad0e0',l:'#a0f4ff',d:'#1a8aa0'});
  },
  piroman(g,R){   // flacăra
    artShape(g,inAny(inEll(14,18.5,7,6.5),inPoly([[7.2,17],[20.8,17],[16,2]]),inPoly([[7.5,16],[10.5,13],[6.5,8]])),{k:'#3a0a02',f:'#ff5a1a',l:'#ffa040',d:'#c02a0a'});
    artShape(g,inAny(inEll(14,20.5,3.8,3.8),inPoly([[10.3,20],[17.7,20],[15,10]])),{f:'#ffd23f',l:'#fff6b0'});
  },
  glaciara(g,R){   // fulgul de zăpadă
    artShape(g,(x,y)=>{
      for(let k=0;k<6;k++){const a=k*Math.PI/3-Math.PI/2,ux=Math.cos(a),uy=Math.sin(a);
        const t=(x-14)*ux+(y-14)*uy,n=Math.abs((y-14)*ux-(x-14)*uy);if(t>=0&&t<=10&&n<=0.75)return true;
        for(const s of [-1,1]){const bx=14+ux*6,by=14+uy*6,b=a+s*Math.PI/3,vx=Math.cos(b),vy=Math.sin(b);   // crenguțele
          const t2=(x-bx)*vx+(y-by)*vy;if(t2>=0&&t2<=3.2&&Math.abs((y-by)*vx-(x-bx)*vy)<=0.6)return true;}}
      return Math.hypot(x-14,y-14)<=2;},{k:'#0a2a40',f:'#dff6ff',d:'#7cc4ea'});
  },
  nepot(g,R){   // ceașca de cafea cu aburi
    const cup={k:'#2a1a10',f:'#f0ece4',l:'#ffffff',d:'#b8b0a4'};
    artShape(g,(x,y)=>{const d=Math.hypot(x-20.5,y-16);return d<=3.6&&d>=1.8;},cup);   // toarta
    artShape(g,(x,y)=>y>=11&&y<=23&&Math.abs(x-13)<=(y<19?6.5:6.5-(y-19)**2/3),cup);
    artShape(g,inEll(14,24.5,10,1.6),cup);   // farfuria
    artShape(g,inEll(13,11.5,5.5,1.2),{f:'#6a3a1a'});
    R(7,16,13,2,'#e8323e');
    for(let y=3;y<=9;y++){R(11+Math.round(Math.sin(y*0.9)),y,1,1,'#ffffff');R(15+Math.round(Math.sin(y*0.9+2)),y-1,1,1,'#d8dce8');}   // aburii
  },
  cap(g,R){   // cărămida spartă în două, cu cioburi
    const brick=(sx,sy)=>({k:'#2a1206',l:'#e6ae70',d:'#a86a34',f:(x,y)=>{const X=Math.floor(x-sx),Y=Math.floor(y-sy);
      return Y===14||(Y<14&&(X===9||X===20))||(Y>14&&(X===6||X===21))?'#6a3a1a':'#c98a4b';}});
    artShape(g,inPoly([[3,8],[12,8],[10,11],[13,14],[11,17],[13,20],[11,23],[3,23]]),brick(-1,1));
    artShape(g,inPoly([[16,6],[25,6],[25,21],[15,21],[17,18],[15,15],[17,12],[14,9]]),brick(1,-1));
    const bit={k:'#2a1206',f:'#c98a4b',l:'#e6ae70',d:'#a86a34'};
    artShape(g,inPoly([[4,2],[7,2],[8,5],[5,5]]),bit);artShape(g,inPoly([[21,1],[24,2],[23,4],[20,3]]),bit);artShape(g,inPoly([[19,24],[22,23],[22,26],[19,26]]),bit);
  },
  inot(g,R){   // colacul de salvare pe apă
    artShape(g,(x,y)=>{const d=Math.hypot(x-14,y-11);return d<=8.5&&d>=4.2;},
      {k:'#2a0a10',f:(x,y)=>Math.floor((Math.atan2(y-11,x-14)+Math.PI*2.25)/(Math.PI/2))%2?'#ffffff':'#e8323e'});
    const pool=inEll(14,17,12.5,8.5);
    artShape(g,(x,y)=>pool(x,y)&&y>=15.5+1.6*Math.sin(x*0.7+1),{k:'#08183a',f:'#3a8ae8',l:'#9ad4ff',d:'#1e5ab8'});
    artShape(g,(x,y)=>pool(x,y)&&y>=20.5+1.2*Math.sin(x*0.7+3)&&inEll(14,17,11.5,7.5)(x,y),{f:'#2a6ad0'});
    for(const [bx,by,r] of [[23,4,1.8],[4,6,1.3]])artShape(g,(x,y)=>{const d=Math.hypot(x-bx,y-by);return d<=r&&d>=r-1.1;},{f:'#bfe8ff'});
  },
  autogol(g,R){   // bomba din joc (culorile, ochii furioși, picioarele), cu fitilul aprins
    const P=BOMB_PAL;
    artShape(g,inRect(11,6,16,9),{k:P.k,f:P.c,l:P.C,d:'#8a5a10'});   // căpăcelul
    artShape(g,inCirc(13,16,7.5),{k:P.k,f:P.b});
    R(8,12,1,2,P.w);R(9,11,1,1,P.w);R(10,10,1,1,P.w);   // luciul
    R(12,13,3,3,P.W);R(16,13,3,3,P.W);   // ochii
    for(const [x,y] of [[11,11],[12,11],[13,12],[14,12],[14,13],[19,11],[18,11],[17,12],[16,12],[16,13]])R(x,y,1,1,P.k);   // sprâncenele
    R(20,21,2,1,P.o);R(19,22,4,1,P.o);R(19,23,3,1,P.o);   // picioarele
    R(15,5,1,1,P.f);R(16,4,1,1,P.f);R(17,3,2,1,P.f);   // fitilul
    R(19,2,3,1,'#ff8a1a');R(20,1,1,3,'#ff8a1a');R(20,2,1,1,'#ffffff');R(22,4,1,1,'#ffd23f');R(18,0,1,1,'#ffd23f');R(23,0,1,1,'#ffd23f');
  },
};
// Încă blocat: aceeași iconiță, stinsă
function artDim(g){
  const d=g.getImageData(0,0,ART_W,ART_H),p=d.data;
  for(let i=0;i<p.length;i+=4){const v=(p[i]*0.3+p[i+1]*0.59+p[i+2]*0.11)*0.4;p[i]=v+22;p[i+1]=v+20;p[i+2]=v*1.1+38;}
  g.putImageData(d,0,0);
}
// st: 'on' = deblocat, 'off' = blocat, 'secret'
const ACH_ART={};
function achArt(id,st){
  const k=id+'|'+st;if(ACH_ART[k])return ACH_ART[k];
  const [c,g]=mkCanvas(ART_W,ART_H),R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  if(st==='secret'){txtRaw(g,'?',10,8,'#0c0a18',2);txtRaw(g,'?',9,7,'#5a5478',2);}
  else{ACH_DRAW[id](g,R);if(st==='off')artDim(g);}
  // Cât trebuie mutată ca forma să stea fix la mijloc
  const d=g.getImageData(0,0,ART_W,ART_H).data;let x0=ART_W,y0=ART_H,x1=-1,y1=-1;
  for(let y=0;y<ART_H;y++)for(let x=0;x<ART_W;x++)if(d[(y*ART_W+x)*4+3]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  c.ox=x1<0?0:Math.round((ART_W-1-x0-x1)/2);c.oy=x1<0?0:Math.round((ART_H-1-y0-y1)/2);
  return ACH_ART[k]=c;
}
