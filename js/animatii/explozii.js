'use strict';
// ===== EXPLOZIILE =====
// --- Explosion frames
const BOOM=[];
[10,20,28,34,36,34].forEach((R,f)=>{
  const [c,g]=mkCanvas(84,84);
  if(f<4){
    const cols=['#ff5a1a','#ffb02a','#fff3a0'];
    for(let k=0;k<10;k++){const a=k/10*TAU+f;pcirc(g,42+Math.cos(a)*R*0.8,42+Math.sin(a)*R*0.8,Math.max(2,R*0.3|0),cols[0]);}
    pcirc(g,42,42,R,cols[0]);pcirc(g,42,42,R*0.72|0,cols[1]);pcirc(g,42,42,R*0.42|0,cols[2]);
    if(f<2)pcirc(g,42,42,R*0.2|0,'#fff');
  }else{
    for(let k=0;k<8;k++){const a=k/8*TAU;pcirc(g,42+Math.cos(a)*R*0.75,42+Math.sin(a)*R*0.75,R*0.3|0,f===4?'#6a5a62':'#4a4048');}
    pcirc(g,42,42,R*0.6|0,f===4?'#8a7a80':'#5a5058');
  }
  BOOM.push(c);
});
