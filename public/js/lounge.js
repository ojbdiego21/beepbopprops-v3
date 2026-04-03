// BeepBop's Break Lounge — Bot Bubble Dome with Lerobot

var loungeStarted = false;
var loungeAudioStarted = false;

function renderLounge() {
  var el = document.getElementById('break-lounge-canvas');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';

  el.innerHTML = '<div class="lounge-wrap"><canvas id="lounge-cv" style="display:block;width:100%;border-radius:12px"></canvas>'
    + '<div id="lounge-player-ui" class="lounge-player"></div></div>';

  setTimeout(function() {
    var cv = document.getElementById('lounge-cv');
    if (!cv) return;
    cv.width = 680; cv.height = 520;
    startLoungeCanvas(cv);
    initLoungeAudio();
  }, 50);
}

function startLoungeCanvas(cv) {
  var ctx = cv.getContext('2d');
  var t = 0;
  var TOTAL = 320;

  function ease(x) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2,2)/2; }

  function drawScene() {
    ctx.clearRect(0,0,680,520);
    var frame = t % TOTAL;

    // Background — space
    ctx.fillStyle = '#050510';
    ctx.fillRect(0,0,680,520);

    // Stars
    var stars = [[50,30],[120,80],[200,20],[350,50],[480,30],[600,70],[650,120],[30,200],[670,180],[590,250],[100,280],[650,380],[20,420],[580,460],[300,15],[440,400],[160,450]];
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    stars.forEach(function(s) {
      ctx.beginPath(); ctx.arc(s[0],s[1],1.5,0,Math.PI*2); ctx.fill();
    });

    // Dome
    ctx.beginPath(); ctx.arc(340,290,245,0,Math.PI*2);
    ctx.fillStyle = 'rgba(15,25,55,0.65)'; ctx.fill();
    ctx.strokeStyle = 'rgba(100,180,255,0.2)'; ctx.lineWidth = 3; ctx.stroke();

    // Dome highlight
    ctx.beginPath(); ctx.arc(275,185,70,0,Math.PI*2);
    ctx.fillStyle = 'rgba(100,150,255,0.04)'; ctx.fill();

    // Ground / floor
    ctx.beginPath(); ctx.ellipse(340,465,200,28,0,0,Math.PI*2);
    ctx.fillStyle = '#12120a'; ctx.fill();
    ctx.strokeStyle = 'rgba(139,105,20,0.3)'; ctx.lineWidth = 1; ctx.stroke();

    // Rug
    ctx.beginPath(); ctx.ellipse(340,458,140,18,0,0,Math.PI*2);
    ctx.fillStyle = '#2a0808'; ctx.fill();
    ctx.strokeStyle = 'rgba(229,34,34,0.25)'; ctx.lineWidth = 1; ctx.stroke();

    // Neon sign
    ctx.fillStyle = '#39ff14';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOT BUBBLE — NO PROPS, JUST VIBES', 340, 68);

    // Smoke from BeepBop (frames 90-170)
    if (frame >= 90 && frame <= 170) {
      var p = (frame - 90) / 80;
      for (var i = 0; i < 6; i++) {
        var age = p - i * 0.1;
        if (age > 0 && age < 1) {
          var ex = ease(age);
          ctx.beginPath();
          ctx.arc(205 + ex*70 + Math.sin(i*2)*12, 310 - ex*65 - i*6, 7 + ex*20, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(200,215,240,' + (0.16*(1-ex)) + ')';
          ctx.fill();
        }
      }
    }

    // Smoke from Lerobot (frames 240-310)
    if (frame >= 240 && frame <= 310) {
      var p2 = (frame - 240) / 70;
      for (var j = 0; j < 6; j++) {
        var age2 = p2 - j * 0.1;
        if (age2 > 0 && age2 < 1) {
          var ex2 = ease(age2);
          ctx.beginPath();
          ctx.arc(475 - ex2*70 - Math.sin(j*2)*12, 310 - ex2*65 - j*6, 7 + ex2*20, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(200,215,240,' + (0.16*(1-ex2)) + ')';
          ctx.fill();
        }
      }
    }

    // Blunt position
    var bx, by, bang;
    if (frame < 120) { bx=200; by=335; bang=0.3; }
    else if (frame < 155) {
      var pb = ease((frame-120)/35);
      bx = 200+pb*(480-200); by = 335+pb*(320-335); bang = 0.3-pb*0.6;
    } else if (frame < 280) { bx=480; by=320; bang=-0.3; }
    else {
      var pb2 = ease((frame-280)/40);
      bx = 480-pb2*(480-200); by = 320-pb2*(320-335); bang = -0.3+pb2*0.6;
    }
    drawBlunt(ctx, bx, by, bang, frame);

    // BeepBop
    drawBeepBop(ctx, frame);

    // Lerobot
    drawLerobot(ctx, frame);
  }

  function drawBlunt(ctx, x, y, angle, frame) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = '#8B6914';
    ctx.beginPath(); ctx.roundRect(-18,-2,36,5,2); ctx.fill();
    ctx.fillStyle = '#d4aa60';
    ctx.beginPath(); ctx.roundRect(-18,-2,9,5,2); ctx.fill();
    ctx.strokeStyle = '#7a5c10'; ctx.lineWidth = 0.5;
    for (var i=-10; i<18; i+=5) {
      ctx.beginPath(); ctx.moveTo(i,-2); ctx.lineTo(i,3); ctx.stroke();
    }
    var glow = 0.55 + 0.45*Math.sin(frame*0.3);
    ctx.fillStyle = 'rgba(255,' + Math.floor(70+glow*70) + ',0,' + glow + ')';
    ctx.beginPath(); ctx.arc(18,0,3.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,0,0.9)';
    ctx.beginPath(); ctx.arc(18,0,1.5,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawBeepBop(ctx, frame) {
    var x=190, y=370;
    var bob = Math.sin(frame*0.04)*3;
    var mouthAmt = 0;
    if (frame >= 60 && frame <= 130) mouthAmt = Math.min(1, Math.abs(Math.sin((frame-60)*0.09)));
    else if (frame >= 280) mouthAmt = Math.min(1, Math.abs(Math.sin((frame-280)*0.09)));

    ctx.save(); ctx.translate(x, y+bob);

    // Jersey body
    ctx.fillStyle = '#060606';
    ctx.beginPath(); ctx.roundRect(-26,-75,52,80,5); ctx.fill();
    ctx.strokeStyle = '#e52222'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle = '#b31515';
    ctx.beginPath(); ctx.roundRect(-26,-75,13,80,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(13,-75,13,80,4); ctx.fill();
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(-13,-75); ctx.lineTo(-13,5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(13,-75); ctx.lineTo(13,5); ctx.stroke();
    ctx.fillStyle='#FFD700'; ctx.font='bold 18px Arial Black'; ctx.textAlign='center';
    ctx.fillText('00',0,-28);

    // Sleeves
    ctx.fillStyle='#b31515';
    ctx.beginPath(); ctx.moveTo(-26,-75); ctx.lineTo(-26,-45); ctx.lineTo(-44,-45);
    ctx.quadraticCurveTo(-50,-52,-46,-64); ctx.quadraticCurveTo(-38,-75,-26,-75); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26,-75); ctx.lineTo(26,-45); ctx.lineTo(44,-45);
    ctx.quadraticCurveTo(50,-52,46,-64); ctx.quadraticCurveTo(38,-75,26,-75); ctx.fill();
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-44,-45); ctx.lineTo(-26,-45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(44,-45); ctx.lineTo(26,-45); ctx.stroke();

    // Left arm down
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-41,-63,14,46,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a2a4e';
    ctx.beginPath(); ctx.roundRect(-43,-18,18,12,4); ctx.fill();

    // Right arm raised
    ctx.save(); ctx.translate(26,-55); ctx.rotate(-0.5);
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(0,-8,12,44,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a2a4e';
    ctx.beginPath(); ctx.roundRect(-2,34,18,11,4); ctx.fill();
    ctx.restore();

    // Head
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.roundRect(-30,-145,60,65,9); ctx.fill(); ctx.stroke();
    // Headband
    ctx.fillStyle='#e52222';
    ctx.beginPath(); ctx.roundRect(-32,-132,64,12,3); ctx.fill();
    ctx.fillStyle='#FFD700'; ctx.font='bold 5.5px Arial Black'; ctx.textAlign='center';
    ctx.fillText('BEEPBOP',0,-123);
    // Antenna
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(0,-145); ctx.lineTo(0,-162); ctx.stroke();
    ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(0,-165,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff4444'; ctx.beginPath(); ctx.arc(0,-165,2,0,Math.PI*2); ctx.fill();
    // Eyes droopy
    ctx.fillStyle='#0d0d1a'; ctx.strokeStyle='#e52222'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-24,-122,20,14,3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(4,-122,20,14,3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#1a1a2e';
    ctx.beginPath(); ctx.roundRect(-24,-122,20,9,3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4,-122,20,9,3); ctx.fill();
    ctx.fillStyle='rgba(229,34,34,0.75)';
    ctx.beginPath(); ctx.ellipse(-14,-115,6,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(14,-115,6,3,0,0,Math.PI*2); ctx.fill();
    // Mouth
    var mh = 8 + mouthAmt*10;
    ctx.fillStyle='#0d0d1a'; ctx.strokeStyle='#FFD700'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-18,-103,36,mh+3,3); ctx.fill(); ctx.stroke();
    if (mouthAmt>0.4) {
      ctx.fillStyle='rgba(255,215,0,0.35)';
      ctx.beginPath(); ctx.roundRect(-12,-100,24,mh,2); ctx.fill();
    }
    // Bolts
    ctx.fillStyle='#FFD700';
    [[-34,-142],[-34,-82],[30,-142],[30,-82]].forEach(function(b){
      ctx.beginPath(); ctx.arc(b[0],b[1],2,0,Math.PI*2); ctx.fill();
    });
    ctx.fillStyle='rgba(229,34,34,0.7)'; ctx.font='bold 8px Arial Black'; ctx.textAlign='center';
    ctx.fillText('BEEPBOP',0,16);
    ctx.restore();
  }

  function drawLerobot(ctx, frame) {
    var x=490, y=345;
    var bob = Math.sin(frame*0.04+1.5)*3;
    var mouthAmt = 0;
    if (frame >= 210 && frame <= 270) mouthAmt = Math.min(1, Math.abs(Math.sin((frame-210)*0.09)));

    ctx.save(); ctx.translate(x, y+bob);

    // Jersey — gold/dark (original design, no team)
    ctx.fillStyle='#1a0d00';
    ctx.beginPath(); ctx.roundRect(-30,-95,60,90,5); ctx.fill();
    ctx.strokeStyle='#c8a020'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.roundRect(-30,-95,12,90,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(18,-95,12,90,4); ctx.fill();
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(-18,-95); ctx.lineTo(-18,-5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(18,-95); ctx.lineTo(18,-5); ctx.stroke();
    ctx.fillStyle='#c8a020'; ctx.font='bold 24px Arial Black'; ctx.textAlign='center';
    ctx.fillText('23',0,-42);
    ctx.fillStyle='rgba(200,160,0,0.7)'; ctx.font='bold 5.5px Arial'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,-68);

    // Sleeves
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.moveTo(-30,-95); ctx.lineTo(-30,-60); ctx.lineTo(-52,-60);
    ctx.quadraticCurveTo(-58,-67,-54,-80); ctx.quadraticCurveTo(-46,-94,-30,-95); ctx.fill();
    ctx.beginPath(); ctx.moveTo(30,-95); ctx.lineTo(30,-60); ctx.lineTo(52,-60);
    ctx.quadraticCurveTo(58,-67,54,-80); ctx.quadraticCurveTo(46,-94,30,-95); ctx.fill();
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-52,-60); ctx.lineTo(-30,-60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(52,-60); ctx.lineTo(30,-60); ctx.stroke();

    // Right arm down
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(30,-78,16,52,6); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#3a2200';
    ctx.beginPath(); ctx.roundRect(28,-28,20,13,4); ctx.fill();

    // Left arm raised for blunt (frames 150-280)
    var lRaise = (frame>=150&&frame<280)?0.55:0.1;
    ctx.save(); ctx.translate(-30,-70); ctx.rotate(lRaise+0.3);
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-16,-8,16,50,6); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#3a2200';
    ctx.beginPath(); ctx.roundRect(-18,40,20,12,4); ctx.fill();
    ctx.restore();

    // Head — taller bald robot
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.roundRect(-28,-170,56,70,10); ctx.fill(); ctx.stroke();
    // Headband
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.roundRect(-30,-155,60,12,3); ctx.fill();
    ctx.fillStyle='#1a0d00'; ctx.font='bold 5px Arial Black'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,-146);
    // Ears
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.ellipse(-30,-135,5,8,0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(30,-135,5,8,-0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Eyes — very droopy high look
    ctx.fillStyle='#0d0a00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-22,-138,18,14,3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(4,-138,18,14,3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a1800';
    ctx.beginPath(); ctx.roundRect(-22,-138,18,10,3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4,-138,18,10,3); ctx.fill();
    ctx.fillStyle='rgba(200,160,0,0.85)';
    ctx.beginPath(); ctx.ellipse(-13,-131,5,2.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(13,-131,5,2.5,0,0,Math.PI*2); ctx.fill();
    // Mouth
    var lmh = 7+mouthAmt*10;
    ctx.fillStyle='#0d0a00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=0.7;
    ctx.beginPath(); ctx.roundRect(-16,-120,32,lmh+3,3); ctx.fill(); ctx.stroke();
    if (mouthAmt>0.4) {
      ctx.fillStyle='rgba(200,160,0,0.3)';
      ctx.beginPath(); ctx.roundRect(-10,-117,20,lmh,2); ctx.fill();
    }
    ctx.fillStyle='rgba(200,160,0,0.8)'; ctx.font='bold 8px Arial Black'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,14);
    ctx.restore();
  }

  function loop(){
    drawScene();
    t++;
    requestAnimationFrame(loop);
  }
  loop();
}

// ── AUDIO — YouTube Bob Marley ──
function initLoungeAudio() {
  if (loungeAudioStarted) return;
  loungeAudioStarted = true;
  var ui = document.getElementById('lounge-player-ui');
  if (!ui) return;

  var tracks = [
    {id:'mrOjFHHxfLg', title:'Sun Is Shining'},
    {id:'zaGUyDPnmAA', title:'One Love'},
    {id:'xnVwNSHpJSA', title:'Could You Be Loved'},
  ];
  window._loungeTracks = tracks;
  window._loungeTrackIdx = 0;
  window._loungeIsPlaying = false;

  ui.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:8px 16px">'
    + '<div style="font-size:16px">🌿</div>'
    + '<div style="flex:1"><div style="font-size:11px;color:#39ff14;font-weight:700" id="lp-track">'+tracks[0].title+'</div>'
    + '<div style="font-size:9px;color:rgba(255,255,255,.4)">Bob Marley & The Wailers</div></div>'
    + '<button class="lp-btn" id="lp-play-btn" onclick="loungeTogglePlay()">▶ Play</button>'
    + '<button class="lp-btn" onclick="loungeNextTrack()" style="padding:4px 8px">⏭</button>'
    + '</div>'
    + '<div style="position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;top:0;left:0">'
    + '<iframe id="yt-player" width="1" height="1" frameborder="0" allow="autoplay"></iframe>'
    + '</div>';
}

window.loungeTogglePlay = function() {
  var iframe = document.getElementById('yt-player');
  var btn = document.getElementById('lp-play-btn');
  if (!iframe) return;
  if (!window._loungeIsPlaying) {
    var t = window._loungeTracks[window._loungeTrackIdx];
    iframe.src = 'https://www.youtube.com/embed/'+t.id+'?autoplay=1&loop=1&playlist='+t.id;
    btn.textContent = '⏸ Pause';
    window._loungeIsPlaying = true;
  } else {
    iframe.src = '';
    btn.textContent = '▶ Play';
    window._loungeIsPlaying = false;
  }
};

window.loungeNextTrack = function() {
  window._loungeTrackIdx = (window._loungeTrackIdx+1) % window._loungeTracks.length;
  var t = window._loungeTracks[window._loungeTrackIdx];
  var el = document.getElementById('lp-track');
  if (el) el.textContent = t.title;
  var iframe = document.getElementById('yt-player');
  if (iframe && window._loungeIsPlaying)
    iframe.src = 'https://www.youtube.com/embed/'+t.id+'?autoplay=1&loop=1&playlist='+t.id;
};

document.addEventListener('DOMContentLoaded', function() {
  var orig = window.showTab;
  window.showTab = function(id, el) {
    orig(id, el);
    if (id === 'tab-lounge') setTimeout(renderLounge, 50);
  };
});
