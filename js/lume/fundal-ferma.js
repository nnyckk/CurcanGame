'use strict';
// ===== FERMA DIN FUNDAL =====
// Siluete de fermă în depărtare
function farmFar(g,th,R,hill,FW){
  const F=th.far,L=th.farL,night=!!th.night,dyn={F,L,smokeC:night?'#5a6488':'#eef6fa',mills:[],smoke:[],cows:[],sheep:[],hens:[]};
  const hy=x=>hill(((x%FW)+FW)%FW);
  const px=(x,y,w=1,h=1,c=F)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  // Ferestrele: ziua doar o muchie deschisă
  const win=(x,y,w,h)=>{if(night){g.fillStyle='rgba(255,200,90,0.22)';g.fillRect(x-2,y-2,w+4,h+4);px(x,y,w,h,'#ffd56a');}else px(x,y,w,h,L);};
  // Baza = cel mai înalt punct al dealului sub obiect
  const base=(x0,w)=>{let b=H;for(let x=x0;x<x0+w;x++)b=Math.min(b,hy(x));
    for(let x=x0;x<x0+w;x++)px(x,b,1,hy(x)-b+1);return b+1;};
  const barn=x0=>{const b=base(x0,53);
    // acoperiș „frânt”, ca la hambarele din desene animate
    for(let i=0;i<40;i++){const d=Math.min(i,39-i),rh=d<8?16+Math.round(d*1.25):26+Math.round((d-8)*0.42);px(x0+i,b-rh,1,rh);px(x0+i,b-rh,1,1,L);}
    px(x0+13,b-12,14,1,L);px(x0+13,b-12,1,12,L);px(x0+26,b-12,1,12,L);
    for(let k=0;k<11;k++){px(x0+14+k,b-11+k,1,1,L);px(x0+25-k,b-11+k,1,1,L);}   // ușa cu X
    px(x0+17,b-23,6,5,L);if(night)win(x0+18,b-22,4,3);else px(x0+18,b-22,4,3);   // fereastra de fân
    const sx=x0+42;px(sx,b-30,11,30);pcirc(g,sx+5,b-30,5,F);   // silozul
    for(let y=b-26;y<b;y+=6)px(sx,y,11,1,L);px(sx+3,b-34,2,1,L);
  };
  const mill=x0=>{const c=x0+17,b=base(c-7,14);
    for(let y=0;y<38;y++){const hw=Math.round(7-y*3/38);px(c-hw,b-1-y,hw*2,1);}
    px(c-2,b-10,4,10,L);px(c-1,b-9,2,9);
    px(c-4,b-43,8,5);px(c-4,b-43,8,1,L);
    dyn.mills.push({x:c,y:b-41});
  };
  const house=x0=>{const b=base(x0,30);
    px(x0+2,b-14,26,14);
    for(let r=0;r<=10;r++){const s=Math.round(r*1.5);px(x0+s,b-14-r,30-2*s,1);px(x0+s,b-14-r,1,1,L);px(x0+29-s,b-14-r,1,1,L);}
    px(x0+21,b-27,4,9);px(x0+21,b-27,4,1,L);   // hornul
    win(x0+6,b-10,4,4);win(x0+20,b-10,4,4);px(x0+13,b-8,4,8,L);px(x0+14,b-7,2,7);
    dyn.smoke.push({x:x0+23,y:b-28});
  };
  const hay=x0=>{const n=2+(R()<0.5?1:0);
    for(let k=0;k<n;k++){const x=x0+k*13,b=base(x,10);
      for(let i=0;i<10;i++){const hh=Math.max(1,Math.round(Math.sqrt(1-((i-4.5)/5)**2)*9));px(x+i,b-hh,1,hh);px(x+i,b-hh,1,1,L);}
      px(x+4,b-11,1,3,L);}
  };
  const coop=x0=>{const b=base(x0,20);
    px(x0,b-12,14,8);for(let r=0;r<4;r++)px(x0-1+r,b-13-r,16-2*r,1);px(x0-1,b-13,16,1,L);
    px(x0+1,b-4,1,4);px(x0+12,b-4,1,4);px(x0+5,b-10,3,3,L);
    for(let k=0;k<6;k++)px(x0+14+k,b-5+Math.round(k*4/5),1,1);   // rampa
    for(let i=0;i<4;i++){const hx=x0+22+i*4+(R()*2|0);dyn.hens.push({x:hx,y:hy(hx)+1,dir:R()<0.5?-1:1,ph:R()*100|0});}
  };
  const cows=x0=>{const b=base(x0,34);
    for(let x=x0;x<x0+34;x+=6)px(x,b-5,1,5);px(x0,b-4,34,1);px(x0,b-2,34,1);   // gardul pășunii
    const n=2+(R()<0.5?1:0);
    for(let i=0;i<n;i++)dyn.cows.push({x:x0+6+i*11+(R()*3|0),y:b,dir:R()<0.5?-1:1,ph:R()*TAU});
  };
  const sheep=x0=>{for(let i=0;i<3;i++){const sx=x0+4+i*9+(R()*3|0);dyn.sheep.push({x:sx,y:hy(sx)+1,dir:R()<0.5?-1:1,ph:R()*TAU});}};
  // Ordinea e amestecată la întâmplare
  const kinds={barn:[barn,53],mill:[mill,34],house:[house,30],hay:[hay,36],coop:[coop,40],cows:[cows,34],sheep:[sheep,30]};
  const bag=['barn','mill','house','hay','hay','coop','cows','cows','sheep'];
  for(let i=bag.length-1;i>0;i--){const j=R()*(i+1)|0;[bag[i],bag[j]]=[bag[j],bag[i]];}
  let x=20+(R()*30|0);
  for(const k of bag){const [fn,w]=kinds[k];if(x+w>FW-40)break;fn(x);x+=w+16+(R()*36|0);}
  return dyn;
}
// Copaci diferiți pe dealurile din planul mijlociu
function farmTrees(g,th,R,FW){
  const mh=x=>(170+Math.sin(x*TAU*3/FW)*12+Math.sin(x*TAU*7/FW+1)*6)|0;
  // Nuanțele de verde sunt mai închise noaptea
  const night=!!th.night,greens=night?[th.midD,'#0e2219','#1a3428']:[th.midD,'#347a2e','#4c9a40'],pick=()=>greens[R()*greens.length|0];
  const fruitC=night?['#8a3a2a','#9a7030']:['#e84a3a','#ffb030'];
  const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  const trunk=(x,b,h)=>px(x,b-h,2,h,night?'#2a2016':'#5a4426');
  const shine=(cx,cy,r)=>{px(cx-r+2,cy-r+2,2,1,th.midL);px(cx-r+1,cy-r+3,1,1,th.midL);};   // luciu sus-stânga
  const round=(x,b)=>{const r=5+(R()*3|0),t=4+(R()*5|0),c=pick(),cy=b-t-r,side=R()<0.5?-1:1;
    trunk(x,b,t+r);pcirc(g,x+1,cy,r,c);pcirc(g,x+1+side*(r-2),cy+2,r-2,c);shine(x+1,cy,r);};
  const poplar=(x,b)=>{const hgt=18+(R()*9|0),c=pick();trunk(x,b,5);
    for(let i=0;i<hgt;i++){const hw=Math.round(3.5*Math.sin(Math.PI*(i+0.5)/hgt));px(x+1-hw,b-4-i,hw*2+1,1,c);}
    px(x,b-hgt+2,1,3,th.midL);};
  const pine=(x,b)=>{const c=pick(),s=R()<0.5?1:1.3;trunk(x,b,4);
    [6,4.5,3].forEach((w,k)=>{const yb=b-4-k*4;for(let r=0;r<6;r++){const hw=Math.round(w*s*(r+1)/6);px(x+1-hw,yb-6+r+1,hw*2+1,1,c);}});};
  const wide=(x,b)=>{const c=pick(),t=3+(R()*2|0);trunk(x,b,t+3);
    pcirc(g,x-4,b-t-4,4,c);pcirc(g,x+6,b-t-4,4,c);pcirc(g,x+1,b-t-6,5,c);shine(x+1,b-t-6,5);};
  const fruit=(x,b)=>{const r=6,t=5,c=pick(),cy=b-t-r;trunk(x,b,t+r);pcirc(g,x+1,cy,r,c);shine(x+1,cy,r);
    for(let i=0;i<5;i++)px(x+1+Math.round(Math.cos(i*1.9)*(r-2)),cy+Math.round(Math.sin(i*1.9)*(r-2)),1,1,fruitC[i%2]);};
  const bag=[round,round,round,poplar,poplar,pine,pine,wide,wide,fruit,fruit];
  for(let i=bag.length-1;i>0;i--){const j=R()*(i+1)|0;[bag[i],bag[j]]=[bag[j],bag[i]];}
  bag.forEach((fn,i)=>{const x=20+Math.round((i+R()*0.8)*(FW-40)/bag.length);fn(x,mh(x)+3);});
}
// Viața fermei din fundal
function drawFarmLife(){
  const d=bg.dyn,FWc=bg.far.width;
  let ox=-((cam.x*0.2)%FWc);if(ox>0)ox-=FWc;ox=Math.floor(ox);
  const each=(fx,fn)=>{for(const o of [ox,ox+FWc]){const sx=fx+o;if(sx>-30&&sx<W+30)fn(sx);}};
  const p=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  for(const m of d.mills)each(m.x,sx=>{const a=G.t*0.025;
    for(let k=0;k<4;k++){const ang=a+k*TAU/4,c=Math.cos(ang),s=Math.sin(ang);
      for(let j=2;j<=17;j++){p(Math.round(sx+c*j),Math.round(m.y+s*j),1,1,d.F);
        if(j>6)for(let q=1;q<=3;q++)p(Math.round(sx+c*j-s*q),Math.round(m.y+s*j+c*q),1,1,d.F);}}   // pânza palei
    p(sx-1,m.y-1,2,2,d.L);});
  for(const c of d.smoke)each(c.x,sx=>{for(let k=0;k<4;k++){const t=((G.t*0.4+k*25)%100)/100;
      ctx.globalAlpha=0.6*(1-t);pcirc(ctx,sx+Math.round(t*10+Math.sin(t*6+k)*1.5),Math.round(c.y-t*26),1+Math.round(t*3),d.smokeC);}
    ctx.globalAlpha=1;});
  // Animalele sunt mici, clar mai mici decât căpițele
  for(const c of d.cows)each(c.x,x=>{const y=c.y,dr=c.dir,graze=Math.sin(G.t*0.015+c.ph)>-0.2;
    p(x-3,y-5,6,3,d.F);p(x-3,y-2,1,2,d.F);p(x+2,y-2,1,2,d.F);
    p(dr>0?x+3:x-5,graze?y-3:y-6,2,2,d.F);   // capul: jos când paște
    p(dr>0?x-4:x+3,y-5+(Math.sin(G.t*0.08+c.ph*3)>0.85?-1:0),1,2,d.F);   // coada mai dă
    p(x-2,y-5,2,1,d.L);p(x+1,y-4,1,1,d.L);});   // petele
  for(const s of d.sheep)each(s.x,x=>{const y=s.y,dr=s.dir,graze=Math.sin(G.t*0.017+s.ph)>-0.3;
    pcirc(ctx,x,y-4,2,d.L);p(x-1,y-1,1,1,d.F);p(x+1,y-1,1,1,d.F);
    p(dr>0?x+2:x-3,graze?y-3:y-5,2,2,d.F);});
  for(const h of d.hens)each(h.x,x=>{const y=h.y,dr=h.dir,peck=((G.t+h.ph)%50)<10;
    p(x-1,y-3,3,2,d.F);p(x-1,y-1,1,1,d.F);p(x+1,y-1,1,1,d.F);
    p(dr>0?x+2:x-2,peck?y-1:y-4,1,1,d.F);p(dr>0?x-2:x+2,y-4,1,1,d.F);});
}
// Câteva păsări departe pe cer, cu aripile bătând
function drawBirds(){
  ctx.fillStyle='#4a6a8a';
  for(let i=0;i<3;i++){const x=Math.round(((G.t*(0.3+i*0.07)+i*160)%(W+60))-30),y=Math.round(28+i*13+Math.sin(G.t*0.02+i)*4),up=((G.t>>3)+i)%2;
    ctx.fillRect(x-1,y,3,1);ctx.fillRect(x-3,y+(up?-1:1),2,1);ctx.fillRect(x+2,y+(up?-1:1),2,1);}
}
