// BeepBop's Break Lounge — Bot Bubble couch scene

var loungeStarted = false;

function renderLounge() {
  var el = document.getElementById('break-lounge-canvas');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';

  el.innerHTML = [
    '<div class="lounge-wrap">',
    '<div class="lounge-neon-sign">🌿 BOT BUBBLE &nbsp;·&nbsp; NO PROPS, JUST VIBES 🌿</div>',
    '<canvas id="lounge-cv" style="display:block;width:100%;max-height:440px;border-radius:0 0 12px 12px"></canvas>',
    '<div class="lounge-player" id="lounge-player-ui">',
    '  <div class="lp-icon">🌿</div>',
    '  <div class="lp-info">',
    '    <div class="lp-track" id="lp-track">Sun Is Shining — Bob Marley</div>',
    '    <div class="lp-artist">Break Lounge Radio</div>',
    '  </div>',
    '  <div class="lp-controls">',
    '    <button class="lp-btn" id="lp-play-btn" onclick="loungePlay()">▶ Play</button>',
    '    <button class="lp-btn" onclick="loungeNext()" style="padding:4px 8px">⏭</button>',
    '  </div>',
    '</div>',

    '</div>'
  ].join('');

  setTimeout(function() {
    var cv = document.getElementById('lounge-cv');
    if (!cv) return;
    cv.width = 680; cv.height = 400;
    startLoungeCanvas(cv);
  }, 60);
}

function startLoungeCanvas(cv) {
  var ctx = cv.getContext('2d');
  var t = 0;
  var TOTAL = 300;
  function ease(x){ return x<0.5?2*x*x:1-Math.pow(-2*x+2,2)/2; }

  function loop(){
    draw(t % TOTAL);
    t++;
    requestAnimationFrame(loop);
  }

  function draw(f) {
    ctx.clearRect(0,0,680,400);

    // ── BG: space dome ──
    ctx.fillStyle = '#06060f';
    ctx.fillRect(0,0,680,400);

    // Stars
    [[60,25],[150,45],[250,18],[380,38],[500,22],[620,55],[660,100],[40,160],[670,140],[580,200],[110,240],[640,290]].forEach(function(s){
      ctx.fillStyle='rgba(255,255,255,'+(.5+Math.random()*.3)+')';
      ctx.beginPath(); ctx.arc(s[0],s[1],1.2,0,Math.PI*2); ctx.fill();
    });

    // Dome glass
    ctx.beginPath(); ctx.ellipse(340,500,310,310,0,Math.PI,0);
    ctx.fillStyle='rgba(12,18,45,0.7)'; ctx.fill();
    ctx.strokeStyle='rgba(80,140,255,0.18)'; ctx.lineWidth=2.5; ctx.stroke();

    // Dome highlight
    ctx.beginPath(); ctx.ellipse(260,170,60,35,0,0,Math.PI*2);
    ctx.fillStyle='rgba(80,140,255,0.04)'; ctx.fill();

    // Floor
    ctx.beginPath(); ctx.ellipse(340,388,280,22,0,0,Math.PI*2);
    ctx.fillStyle='#0e0e06'; ctx.fill();

    // Rug
    ctx.beginPath(); ctx.ellipse(340,382,190,14,0,0,Math.PI*2);
    ctx.fillStyle='#280808'; ctx.fill();
    ctx.strokeStyle='rgba(229,34,34,0.25)'; ctx.lineWidth=1; ctx.stroke();

    // ── COUCH ──
    // Back
    ctx.fillStyle='#2a1240';
    ctx.beginPath(); ctx.roundRect(130,230,420,90,12); ctx.fill();
    ctx.strokeStyle='rgba(150,80,220,0.35)'; ctx.lineWidth=1; ctx.stroke();
    // Seat
    ctx.fillStyle='#341858';
    ctx.beginPath(); ctx.roundRect(130,316,420,38,6); ctx.fill();
    ctx.strokeStyle='rgba(150,80,220,0.25)'; ctx.lineWidth=1; ctx.stroke();
    // Arms
    ctx.fillStyle='#2a1240'; ctx.strokeStyle='rgba(150,80,220,0.3)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(110,250,30,100,8); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(540,250,30,100,8); ctx.fill(); ctx.stroke();
    // Cushions
    ctx.fillStyle='rgba(80,40,120,0.4)';
    ctx.beginPath(); ctx.roundRect(145,240,185,70,8); ctx.fill();
    ctx.beginPath(); ctx.roundRect(350,240,185,70,8); ctx.fill();

    // ── SMOKE ──
    // BeepBop blows frames 75-140
    if(f>=75&&f<=140){
      var sp=(f-75)/65;
      for(var i=0;i<5;i++){
        var sa=sp-i*.1; if(sa<0||sa>1) continue;
        var se=ease(sa);
        ctx.beginPath(); ctx.arc(205+se*55+Math.sin(i*2)*10, 195-se*55-i*5, 6+se*18,0,Math.PI*2);
        ctx.fillStyle='rgba(190,210,240,'+(0.14*(1-se))+')'; ctx.fill();
      }
    }
    // Lerobot blows frames 215-275
    if(f>=215&&f<=275){
      var lp=(f-215)/60;
      for(var j=0;j<5;j++){
        var la=lp-j*.1; if(la<0||la>1) continue;
        var le=ease(la);
        ctx.beginPath(); ctx.arc(475-le*55-Math.sin(j*2)*10, 195-le*55-j*5, 6+le*18,0,Math.PI*2);
        ctx.fillStyle='rgba(190,210,240,'+(0.14*(1-le))+')'; ctx.fill();
      }
    }

    // Blunt in hand — always visible outside body
    // Frames 0-115: at BeepBop's hand (~x:225,y:268)
    // Frames 115-145: flying to Lerobot
    // Frames 145-270: at Lerobot's hand (~x:455,y:258)
    // Frames 270-300: flying back
    var bx,by,bang;
    if(f<115){      bx=225; by=268; bang=0.25; }
    else if(f<145){ var p=ease((f-115)/30); bx=225+p*(455-225); by=268+p*(258-268); bang=0.25-p*.5; }
    else if(f<270){ bx=455; by=258; bang=-0.25; }
    else {          var p2=ease((f-270)/30); bx=455-p2*(455-225); by=258-p2*(258-268); bang=-0.25+p2*.5; }

    // ── BEEPBOP (left, sitting) ──
    drawBeepBop(ctx, f);

    // ── LEROBOT (right, sitting) ──
    drawLerobot(ctx, f);

    // Draw blunt AFTER bodies so it's on top
    drawBlunt(ctx, bx, by, bang, f);
  }

  function drawBlunt(ctx,x,y,a,f){
    ctx.save(); ctx.translate(x,y); ctx.rotate(a);
    ctx.fillStyle='#8B6914';
    ctx.beginPath(); ctx.roundRect(-20,-2.5,38,5,2.5); ctx.fill();
    ctx.fillStyle='#c8a050';
    ctx.beginPath(); ctx.roundRect(-20,-2.5,9,5,2.5); ctx.fill();
    ctx.strokeStyle='#6a4e0a'; ctx.lineWidth=0.5;
    for(var i=-12;i<18;i+=5){ ctx.beginPath(); ctx.moveTo(i,-2.5); ctx.lineTo(i,2.5); ctx.stroke(); }
    var g=0.5+0.5*Math.sin(f*.35);
    ctx.fillStyle='rgba(255,'+(70+g*80|0)+',0,'+g+')';
    ctx.beginPath(); ctx.arc(18,0,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,200,0,.9)';
    ctx.beginPath(); ctx.arc(18,0,1.8,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawBeepBop(ctx,f){
    // Sitting position — lower on couch
    var bob=Math.sin(f*.04)*2;
    var mo=0;
    if(f>=55&&f<=130) mo=Math.min(1,Math.abs(Math.sin((f-55)*.08)));
    else if(f>=270) mo=Math.min(1,Math.abs(Math.sin((f-270)*.08)));

    ctx.save(); ctx.translate(188,290+bob);

    // Legs (sitting)
    ctx.fillStyle='#111'; ctx.strokeStyle='#e52222'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(-22,30,18,40,5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(4,30,18,40,5); ctx.fill(); ctx.stroke();
    // Shoes
    ctx.fillStyle='#eee8d8';
    ctx.beginPath(); ctx.roundRect(-26,66,26,12,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(2,66,26,12,4); ctx.fill();
    ctx.fillStyle='#e52222'; ctx.fillRect(-26,68,26,4); ctx.fillRect(2,68,26,4);

    // Body/Jersey
    ctx.fillStyle='#060606'; ctx.strokeStyle='#e52222'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(-24,-58,48,90,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#b31515';
    ctx.beginPath(); ctx.roundRect(-24,-58,11,90,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(13,-58,11,90,4); ctx.fill();
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.moveTo(-13,-58); ctx.lineTo(-13,32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(13,-58); ctx.lineTo(13,32); ctx.stroke();
    ctx.fillStyle='#FFD700'; ctx.font='bold 16px Arial Black'; ctx.textAlign='center';
    ctx.fillText('00',0,-14);

    // Sleeves
    ctx.fillStyle='#b31515';
    ctx.beginPath(); ctx.moveTo(-24,-58); ctx.lineTo(-24,-32); ctx.lineTo(-40,-32);
    ctx.quadraticCurveTo(-44,-38,-42,-50); ctx.quadraticCurveTo(-36,-58,-24,-58); ctx.fill();
    ctx.beginPath(); ctx.moveTo(24,-58); ctx.lineTo(24,-32); ctx.lineTo(40,-32);
    ctx.quadraticCurveTo(44,-38,42,-50); ctx.quadraticCurveTo(36,-58,24,-58); ctx.fill();
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-40,-32); ctx.lineTo(-24,-32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40,-32); ctx.lineTo(24,-32); ctx.stroke();

    // Left arm resting
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(-38,-46,13,42,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a2a4e';
    ctx.beginPath(); ctx.roundRect(-40,-6,17,11,4); ctx.fill();

    // Right arm — raised holding blunt (hand at ~+25,-58 after rotation)
    ctx.save(); ctx.translate(22,-40); ctx.rotate(-0.55);
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(0,-8,13,38,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a2a4e';
    ctx.beginPath(); ctx.roundRect(-2,28,17,10,4); ctx.fill();
    ctx.restore();

    // Head
    ctx.fillStyle='#1a1a2e'; ctx.strokeStyle='#e52222'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.roundRect(-28,-118,56,56,9); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#e52222';
    ctx.beginPath(); ctx.roundRect(-30,-107,60,11,3); ctx.fill();
    ctx.fillStyle='#FFD700'; ctx.font='bold 5px Arial Black'; ctx.textAlign='center';
    ctx.fillText('BEEPBOP',0,-99);
    // Antenna
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(0,-118); ctx.lineTo(0,-133); ctx.stroke();
    ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(0,-136,3.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff4444'; ctx.beginPath(); ctx.arc(0,-136,1.8,0,Math.PI*2); ctx.fill();
    // Eyes droopy
    ctx.fillStyle='#0d0d1a'; ctx.strokeStyle='#e52222'; ctx.lineWidth=.6;
    ctx.beginPath(); ctx.roundRect(-22,-94,18,13,3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(4,-94,18,13,3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#1a1a2e';
    ctx.beginPath(); ctx.roundRect(-22,-94,18,8,3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(4,-94,18,8,3); ctx.fill();
    ctx.fillStyle='rgba(229,34,34,.75)';
    ctx.beginPath(); ctx.ellipse(-13,-88,5.5,2.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(13,-88,5.5,2.5,0,0,Math.PI*2); ctx.fill();
    // Mouth
    var mh=7+mo*9;
    ctx.fillStyle='#0d0d1a'; ctx.strokeStyle='#FFD700'; ctx.lineWidth=.6;
    ctx.beginPath(); ctx.roundRect(-15,-80,30,mh+3,3); ctx.fill(); ctx.stroke();
    if(mo>.4){ ctx.fillStyle='rgba(255,215,0,.3)'; ctx.beginPath(); ctx.roundRect(-10,-77,20,mh,2); ctx.fill(); }
    // Corner bolts
    ctx.fillStyle='#FFD700';
    [[-32,-115],[-32,-64],[28,-115],[28,-64]].forEach(function(b){
      ctx.beginPath(); ctx.arc(b[0],b[1],2,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  function drawLerobot(ctx,f){
    var bob=Math.sin(f*.04+1.5)*2;
    var mo=0;
    if(f>=185&&f<=260) mo=Math.min(1,Math.abs(Math.sin((f-185)*.08)));

    ctx.save(); ctx.translate(492,280+bob);

    // Legs
    ctx.fillStyle='#1a0d00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(-24,40,19,44,5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(5,40,19,44,5); ctx.fill(); ctx.stroke();
    // Shoes
    ctx.fillStyle='#e8e0cc';
    ctx.beginPath(); ctx.roundRect(-28,80,28,12,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(0,80,28,12,4); ctx.fill();
    ctx.fillStyle='#c8a020'; ctx.fillRect(-28,82,28,4); ctx.fillRect(0,82,28,4);

    // Body/Jersey — taller
    ctx.fillStyle='#1a0d00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(-28,-72,56,112,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.roundRect(-28,-72,12,112,4); ctx.fill();
    ctx.beginPath(); ctx.roundRect(16,-72,12,112,4); ctx.fill();
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.moveTo(-16,-72); ctx.lineTo(-16,40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,-72); ctx.lineTo(16,40); ctx.stroke();
    ctx.fillStyle='#c8a020'; ctx.font='bold 20px Arial Black'; ctx.textAlign='center';
    ctx.fillText('23',0,-22);
    ctx.fillStyle='rgba(200,160,0,.7)'; ctx.font='bold 5px Arial'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,-48);

    // Sleeves
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.moveTo(-28,-72); ctx.lineTo(-28,-42); ctx.lineTo(-48,-42);
    ctx.quadraticCurveTo(-54,-50,-50,-62); ctx.quadraticCurveTo(-42,-72,-28,-72); ctx.fill();
    ctx.beginPath(); ctx.moveTo(28,-72); ctx.lineTo(28,-42); ctx.lineTo(48,-42);
    ctx.quadraticCurveTo(54,-50,50,-62); ctx.quadraticCurveTo(42,-72,28,-72); ctx.fill();
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-48,-42); ctx.lineTo(-28,-42); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(48,-42); ctx.lineTo(28,-42); ctx.stroke();

    // Right arm down/resting
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(28,-60,15,48,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#3a2200';
    ctx.beginPath(); ctx.roundRect(26,-14,19,11,4); ctx.fill();

    // Left arm raised holding blunt
    ctx.save(); ctx.translate(-28,-50); ctx.rotate(0.55);
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.7;
    ctx.beginPath(); ctx.roundRect(-13,-8,13,40,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#3a2200';
    ctx.beginPath(); ctx.roundRect(-15,30,19,11,4); ctx.fill();
    ctx.restore();

    // Head — taller bald
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.roundRect(-26,-140,52,65,10); ctx.fill(); ctx.stroke();
    // Headband
    ctx.fillStyle='#c8a020';
    ctx.beginPath(); ctx.roundRect(-28,-126,56,11,3); ctx.fill();
    ctx.fillStyle='#1a0d00'; ctx.font='bold 4.5px Arial Black'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,-118);
    // Ears
    ctx.fillStyle='#2a1800'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.8;
    ctx.beginPath(); ctx.ellipse(-28,-112,4.5,7,0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(28,-112,4.5,7,-0.2,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Eyes droopy high
    ctx.fillStyle='#0d0a00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.6;
    ctx.beginPath(); ctx.roundRect(-20,-108,17,13,3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(3,-108,17,13,3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2a1800';
    ctx.beginPath(); ctx.roundRect(-20,-108,17,9,3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(3,-108,17,9,3); ctx.fill();
    ctx.fillStyle='rgba(200,160,0,.85)';
    ctx.beginPath(); ctx.ellipse(-11.5,-102,4.5,2.2,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(11.5,-102,4.5,2.2,0,0,Math.PI*2); ctx.fill();
    // Mouth
    var mh2=6+mo*9;
    ctx.fillStyle='#0d0a00'; ctx.strokeStyle='#c8a020'; ctx.lineWidth=.6;
    ctx.beginPath(); ctx.roundRect(-13,-93,26,mh2+3,3); ctx.fill(); ctx.stroke();
    if(mo>.4){ ctx.fillStyle='rgba(200,160,0,.28)'; ctx.beginPath(); ctx.roundRect(-8,-90,16,mh2,2); ctx.fill(); }
    // Name
    ctx.fillStyle='rgba(200,160,0,.8)'; ctx.font='bold 7px Arial Black'; ctx.textAlign='center';
    ctx.fillText('LEROBOT',0,52);
    ctx.restore();
  }

  loop();
}

// ── AUDIO: Web Audio reggae beat ──
var _audioCtx = null;
var _masterGain = null;
var _loungePlaying = false;
var _loungeNodes = [];
var _beatInterval = null;
var _bpm = 78;

function _beat() { return 60 / _bpm; }

function _initAudio() {
  if (_audioCtx) return;
  _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  _masterGain = _audioCtx.createGain();
  _masterGain.gain.value = 0.5;
  _masterGain.connect(_audioCtx.destination);
}

function _kick(t) {
  var o = _audioCtx.createOscillator();
  var g = _audioCtx.createGain();
  o.connect(g); g.connect(_masterGain);
  o.frequency.setValueAtTime(160, t);
  o.frequency.exponentialRampToValueAtTime(0.01, t + 0.35);
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.start(t); o.stop(t + 0.36);
}

function _snare(t) {
  var buf = _audioCtx.createBuffer(1, _audioCtx.sampleRate * 0.15, _audioCtx.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 2500);
  var s = _audioCtx.createBufferSource();
  var g = _audioCtx.createGain();
  var f = _audioCtx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 2000; f.Q.value = 0.7;
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(_masterGain);
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  s.start(t); s.stop(t + 0.15);
}

function _skank(t) {
  // Reggae offbeat chord stab - Am7 voicing
  [220, 262, 330, 392].forEach(function(hz) {
    var o = _audioCtx.createOscillator();
    var g = _audioCtx.createGain();
    o.type = 'sawtooth';
    o.connect(g); g.connect(_masterGain);
    o.frequency.value = hz;
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.start(t); o.stop(t + 0.08);
  });
}

function _bass(t, hz) {
  var o = _audioCtx.createOscillator();
  var g = _audioCtx.createGain();
  var f = _audioCtx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 280;
  o.type = 'triangle';
  o.connect(f); f.connect(g); g.connect(_masterGain);
  o.frequency.value = hz;
  g.gain.setValueAtTime(0.6, t);
  g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
  o.start(t); o.stop(t + 0.32);
}

function _hat(t, vol) {
  var buf = _audioCtx.createBuffer(1, _audioCtx.sampleRate * 0.04, _audioCtx.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  var s = _audioCtx.createBufferSource();
  var g = _audioCtx.createGain();
  var f = _audioCtx.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = 8000;
  s.buffer = buf; s.connect(f); f.connect(g); g.connect(_masterGain);
  g.gain.setValueAtTime((vol||0.12), t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
  s.start(t); s.stop(t + 0.04);
}

function _playBar(startT) {
  var b = _beat();
  // Kick on 1 and 3
  _kick(startT);
  _kick(startT + b * 2);
  // Snare on 2 and 4 (reggae drop)
  _snare(startT + b);
  _snare(startT + b * 3);
  // Reggae skank: offbeats only (+of1, +of2, +of3, +of4)
  _skank(startT + b * 0.5);
  _skank(startT + b * 1.5);
  _skank(startT + b * 2.5);
  _skank(startT + b * 3.5);
  // Bass line root-fifth
  _bass(startT,        55.0);  // A1
  _bass(startT + b*0.75, 55.0);
  _bass(startT + b*2,    82.4); // E2
  _bass(startT + b*2.75, 82.4);
  // Hi-hats 8th notes
  for (var i = 0; i < 8; i++) _hat(startT + i * b * 0.5, i%2===0 ? 0.12 : 0.07);
}

window.loungePlay = function() {
  _initAudio();
  var btn = document.getElementById('lp-play-btn');
  var trk = document.getElementById('lp-track');
  if (_loungePlaying) {
    // Stop
    _loungePlaying = false;
    if (_beatInterval) { clearInterval(_beatInterval); _beatInterval = null; }
    _masterGain.gain.setTargetAtTime(0, _audioCtx.currentTime, 0.1);
    if (btn) btn.textContent = '▶ Play';
  } else {
    // Start
    _loungePlaying = true;
    _masterGain.gain.setTargetAtTime(0.5, _audioCtx.currentTime, 0.1);
    if (trk) trk.textContent = 'Reggae Vibes';
    if (btn) btn.textContent = '⏸ Pause';
    var barLen = _beat() * 4 * 1000;
    var nextBar = _audioCtx.currentTime + 0.05;
    _playBar(nextBar);
    nextBar += _beat() * 4;
    _beatInterval = setInterval(function() {
      if (!_loungePlaying) return;
      _playBar(_audioCtx.currentTime + 0.04);
    }, barLen);
  }
};

window.loungeNext = function() {
  _bpm = _bpm === 78 ? 84 : _bpm === 84 ? 72 : 78;
  var trk = document.getElementById('lp-track');
  if (trk) trk.textContent = 'Reggae Vibes — ' + _bpm + ' BPM';
};

document.addEventListener('DOMContentLoaded', function() {
  var orig = window.showTab;
  if (orig) window.showTab = function(id, el) {
    orig(id, el);
    if (id === 'tab-lounge') setTimeout(renderLounge, 50);
  };
});
