'use strict';
// ===== PARTICULE ȘI TEXTE PLUTITOARE =====
function addScore(n,x,y){G.score+=n;if(x!==undefined)popups.push({x,y,s:String(n),t:45,c:'#fff'});}
function popup(s,x,y,c='#ffd23f'){popups.push({x,y,s,t:60,c});}
function dust(x,y,n){if(inPool(x,y)){poolSplash(x,n+2);return;}   // în balta din peșteră: stropi, nu praf
  for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-0.5)*1.5,vy:-Math.random()*0.8,g:0.02,life:18,max:18,col:'#efe6d6',s:2});}
// Bănuțul și găleata din găleată: cad pe sol; în apă sau în groapă se pierd
function landPart(p){
  if(p.vy<=0||p.g===0)return;const tx=Math.floor(p.x/TS),ty=Math.floor((p.y+p.land)/TS);
  if(solid(tileAt(tx,ty))||ledge(tx,ty)){p.y=ty*TS-p.land;p.vy=0;p.vx=0;p.g=0;if(p.toCoin){coins.push({x:p.x,y:p.y,taken:false});sparkle(p.x,p.y);p.life=0;}return;}
  if(p.y+p.land>WATER_Y&&!inUnder()&&!solid(tileAt(tx,12))){splash(p.x);p.life=0;return;}   // în apă: pleosc
  if(p.y>H+16)p.life=0;   // în groapă
}
function updateFx(){
  for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;if(p.spin&&p.vy!==0)p.rot+=p.spin;
    // Ajunge pe jos: stă (găleata) sau devine bănuț de luat
    if(p.land)landPart(p);
    else if(p.floor!=null&&p.y>=p.floor&&p.vy>0){p.y=p.floor;p.vy=0;p.vx=0;p.g=0;if(p.toCoin){coins.push({x:p.x,y:p.y,taken:false});sparkle(p.x,p.y);p.life=0;}}}
  parts=parts.filter(p=>p.life>0);
  for(const p of popups){p.y-=0.5;p.t--;}popups=popups.filter(p=>p.t>0);
  for(const b of booms)b.t++;booms=booms.filter(b=>b.t<24);
  for(const b of bumps)b.t++;bumps=bumps.filter(b=>b.t<8);
  if(lakeLife)updateLakeLife();
  if(G.shake>0)G.shake--;
}
