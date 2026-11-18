'use strict';
// ===== IARNA: pădurea de brazi din fundal =====
// Un brad înzăpezit
function fir(g,x,b,hgt,c,snow,shade,trunkC){
  const px=(X,Y,w,h,col)=>{g.fillStyle=col;g.fillRect(X,Y,w,h);};
  px(x-1,b-3,2,3,trunkC);
  const tiers=hgt<18?3:hgt<30?4:5,step=(hgt-3)/tiers;
  for(let k=0;k<tiers;k++){
    const yb=Math.round(b-3-k*step*0.85),th=Math.round(step*1.5),wB=Math.max(2,Math.round((tiers-k)*hgt/tiers*0.32)),yt=yb-th,sn=Math.floor(th*0.45);
    for(let r=0;r<th;r++){const hw=Math.round(wB*(r+1)/th);px(x-hw,yt+r,hw*2+1,1,c);
      if(r<sn)px(x-hw,yt+r,Math.max(1,hw*2),1,snow);else if(r===sn)px(x-hw,yt+r,Math.max(1,hw*2),1,shade);}
  }
}
// Stratul îndepărtat
function snowFar(g,th,R,hill,FW){
  g.clearRect(0,0,FW,H);
  // Munții apar doar din când în când: un masiv
  const BASE=158,PEAKS=[
    {x:FW*0.11+R()*30,y:60+R()*8,wl:85+R()*15,wr:70+R()*15},
    {x:FW*0.11+85+R()*15,y:98+R()*8,wl:40,wr:65+R()*15},
    {x:FW*0.74+R()*30,y:80+R()*10,wl:70+R()*15,wr:85+R()*15}];
  const top=new Array(FW).fill(H),who=new Array(FW).fill(null);
  for(const pk of PEAKS)for(let x=0;x<FW;x++){
    const dx=((x-pk.x+FW*1.5)%FW)-FW/2,y=pk.y+Math.abs(dx)*(BASE-pk.y)/(dx<0?pk.wl:pk.wr)+(vhash(x,pk.x|0)%3)-1;
    if(y<top[x]){top[x]=y;who[x]={pk,dx};}}
  for(let x=0;x<FW;x++){const w=who[x];if(!w||top[x]>=BASE)continue;const t=Math.round(top[x]),lt=w.dx>0;
    g.fillStyle=lt?th.farL:th.far;g.fillRect(x,t,1,H-t);
    const sl=Math.round(w.pk.y+(BASE-w.pk.y)*0.32+Math.sin(x*0.45)*2+(vhash(x,7)%4));   // limita zăpezii, zimțată
    if(sl>t){g.fillStyle=lt?'#f6fafd':'#d8e3ee';g.fillRect(x,t,1,sl-t);}}
  for(let x=0;x<FW;x++){const y=hill(x);g.fillStyle=th.farHill;g.fillRect(x,y,1,H-y);g.fillStyle=th.farHillL;g.fillRect(x,y,1,1);}
  // Câteva pâlcuri mici de brazi în depărtare
  for(let k=0;k<5;k++){const cx=60+k*FW/5+R()*60,n=3+(R()*4|0);
    for(let i=0;i<n;i++){const x=Math.round(cx+(R()-0.5)*30),b=hill(((x%FW)+FW)%FW)+3+(R()*4|0),h=5+(R()*5|0),col=R()<0.5?'#7d97a4':'#6b8794';
      for(const o of [0,-FW,FW]){g.fillStyle=col;for(let r=0;r<h;r++){const hw=Math.round(r*0.4);g.fillRect(x+o-hw,b-h+r,hw*2+1,1);}
        g.fillStyle='#eef4fa';g.fillRect(x+o,b-h,1,2);}}}
}
// Pâlcuri de brazi pe dealurile din planul mijlociu
function forestFirs(g,R,FW,mh){
  const greens=['#2b5a4a','#24503f','#336650'];
  for(let k=0;k<5;k++){const cx=60+k*FW/5+R()*60,n=2+(R()*4|0),trees=[];
    for(let i=0;i<n;i++)trees.push({x:Math.round(cx+(R()-0.5)*56),hgt:14+(R()*22|0),c:greens[R()*3|0]});
    trees.sort((a,b)=>b.hgt-a.hgt);
    for(const t of trees)for(const o of [0,-FW,FW])fir(g,t.x+o,mh(((t.x%FW)+FW)%FW)+4,t.hgt,t.c,'#f4f8fc','#c4d4e2','#4a3a30');}
}
