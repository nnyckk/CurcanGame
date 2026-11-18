'use strict';
// ===== PARTICULE ȘI TEXTE PLUTITOARE =====
function addScore(n,x,y){G.score+=n;if(x!==undefined)popups.push({x,y,s:String(n),t:45,c:'#fff'});}
function popup(s,x,y,c='#ffd23f'){popups.push({x,y,s,t:60,c});}
function dust(x,y,n){if(inPool(x,y)){poolSplash(x,n+2);return;}   // în balta din peșteră: stropi, nu praf
  for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-0.5)*1.5,vy:-Math.random()*0.8,g:0.02,life:18,max:18,col:'#efe6d6',s:2});}
function updateFx(){
  for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;}
  parts=parts.filter(p=>p.life>0);
  for(const p of popups){p.y-=0.5;p.t--;}popups=popups.filter(p=>p.t>0);
  for(const b of booms)b.t++;booms=booms.filter(b=>b.t<24);
  for(const b of bumps)b.t++;bumps=bumps.filter(b=>b.t<8);
  if(lakeLife)updateLakeLife();
  if(G.shake>0)G.shake--;
}
