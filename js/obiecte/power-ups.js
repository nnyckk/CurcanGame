'use strict';
// ===== POWER-UP-URI: grăuntele, boaba roșie =====
// Grăuntele auriu luminos
const GRAIN=mkSprite([
"....kk....",
"...kYYk...",
"..kYWYyk..",
".kYWYyyyk.",
".kYYyyyok.",
"kYyyyyyyok",
"kYyyyyyook",
"kyyyyyyook",
".kyyyyook.",
"..kooook..",
"...kkkk...",
],{k:'#7a4a00',Y:'#fff2a0',W:'#ffffff',y:'#ffc61a',o:'#e08a00'},false);
// Boaba roșie strălucitoare
const BERRY=mkSprite([
".....gk...",
"....gGGk..",
"..kkgkkk..",
".kRRrrrrk.",
"kRWWRrrrrk",
"kRWRrrrrok",
"kRrrrrrrok",
"krrrrrrook",
".krrrrook.",
"..kooook..",
"...kkkk...",
],{k:'#5a0a10',R:'#ff7a7a',W:'#ffffff',r:'#e8202a',o:'#a01018',G:'#5ac04a',g:'#2a7a2a'},false);
// Afina înghețată — albastră, cu chiciură și coroniță
const ICEBERRY=mkSprite([
"....kk....",
"...kFFk...",
"..kFkkFk..",
".kBBbbbbk.",
"kBWWBbbFbk",
"kBWBbbbbdk",
"kBbbbFbbdk",
"kbbFbbbddk",
".kbbbbdFk.",
"..kddddk..",
"...kkkk...",
],{k:'#1a2a5a',B:'#8ab8f0',W:'#ffffff',b:'#4a6ad8',d:'#2a3a9a',F:'#dff4ff'},false);
// Schimbă mărimea curcanului păstrând picioarele pe loc
function setBig(b){
  const p=player,ow=p.w,oh=p.h;p.big=b;p.w=b?12:10;p.h=b?20:13;
  p.x+=(ow-p.w)/2;p.y+=oh-p.h;
}
function powerUp(x,y){
  addScore(1000,x,y);
  if(!player.big){setBig(true);G.morph='size';G.growT=48;sfx.grow();}else sfx.coin();
}
function powerFire(x,y){
  addScore(1000,x,y);
  if(player.fire){sfx.coin();return;}
  // Chiar dacă e mic
  const wasSmall=!player.big;
  if(wasSmall)setBig(true);
  player.fire=true;player.ice=false;G.morph=wasSmall?'size':'fire';G.growT=48;sfx.fireUp();
  popup('PENE DE FOC!',player.x+player.w/2,player.y-14,'#ff9a3a');
}
// Afina înghețată
function powerIce(x,y){
  addScore(1000,x,y);
  if(player.ice){sfx.coin();return;}
  const wasSmall=!player.big;
  if(wasSmall)setBig(true);
  player.ice=true;player.fire=false;G.morph=wasSmall?'size':'ice';G.growT=48;sfx.iceUp();
  popup('PENE DE GHEAȚĂ!',player.x+player.w/2,player.y-14,'#9fe8ff');
}
