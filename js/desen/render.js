'use strict';
// ===== DESEN: funcția principală =====
function render(){
  ctx.imageSmoothingEnabled=false;
  switch(G.state){
    case 'title':drawTitle();break;
    case 'intro':drawIntro();break;
    case 'edit':drawWorld();drawEditOverlay();break;   // editorul de niveluri
    case 'gameover':
      ctx.fillStyle='#0d0b14';ctx.fillRect(0,0,W,H);
      txt('JOC TERMINAT',W/2,60,'#ff4a5a',3,'c','#4a0a10');
      ctx.drawImage(tkBig().OVER,W/2-10,100);
      txt('SCOR '+pad(G.score,6),W/2,132,'#fff',1,'c',null);txt('RECORD '+pad(G.hi,6),W/2,146,'#ffd23f',1,'c',null);
      if(G.stateT>90&&(G.t>>5)%2===0)txt('ENTER - ÎNCEARCĂ DIN NOU',W/2,176,'#9fe8ff',1,'c',null);
      break;
    default:
      drawWorld();drawHUD();
      if(G.state==='clear'&&G.stateT>60)drawClearCard();
      // Poza de grup: un flash alb
      if(G.state==='win'&&G.photoT&&G.photoT<12){ctx.fillStyle=`rgba(255,255,255,${1-G.photoT/12})`;ctx.fillRect(0,0,W,H);}
      // Finalul: doar scorul, jos; restul spune restaurantul
      if(G.state==='win'&&!G.talk){
        ctx.fillStyle='rgba(16,8,32,0.8)';ctx.fillRect(0,195,W,29);
        txt('SCOR FINAL '+pad(G.score,6)+'   '+(G.score>=G.hi?'RECORD NOU!':'RECORD '+pad(G.hi,6)),W/2,199,'#9fe8ff',1,'c',null);
        if(G.stateT>120&&(G.t>>5)%2===0)txt('ENTER - JOACĂ DIN NOU',W/2,211,'#7fff7f',1,'c',null);}
      // În modul de test, pauza e doar o etichetă sus
      if(G.state==='play'&&G.paused){if(TEST)txt('PAUZĂ',W/2,20,'#ffd23f',1,'c','#000');
        else drawPauseMenu();}
  }
  if(!G.music)drawMusicOff();
  drawAchToast();   // „ACHIEVEMENT!” deblocat
  if(G.state!=='title'&&cv.style.cursor)cv.style.cursor='';
  // Versiunea din spațiul negru apare doar în meniul principal
  const showInfo=INFO.out&&G.state==='title'&&G.menu==='main';
  if(showInfo!==INFO.shown){INFO.shown=showInfo;INFO.V.style.display=showInfo?'block':'none';
    if(showInfo){const g=INFO.V.getContext('2d');g.clearRect(0,0,INFO_VW,INFO_VH);txt('V'+GAME_VERSION,0,0,'#7a7490',1,'l',null,g);}}
}
