// BeepBop's Break Lounge — Bob Marley vibes, actual smoke animation

function renderLounge() {
  var el = document.getElementById('break-lounge-canvas');
  if (!el || el.dataset.rendered) return;
  el.dataset.rendered = '1';

  el.innerHTML = `
<div class="lounge-wrap">
  <div class="lounge-bg">

    <!-- Ambient color blobs -->
    <div class="l-blob l-blob-1"></div>
    <div class="l-blob l-blob-2"></div>
    <div class="l-blob l-blob-3"></div>

    <!-- Bob Marley wall poster (text-based, no copyright issues) -->
    <div class="marley-poster">
      <div class="poster-frame">
        <div class="poster-silhouette">
          <svg viewBox="0 0 120 160" width="90" xmlns="http://www.w3.org/2000/svg">
            <defs><style>
              @keyframes poster-glow{0%,100%{opacity:.7}50%{opacity:1}}
              .pg{animation:poster-glow 3s ease-in-out infinite}
            </style></defs>
            <!-- Silhouette of dreadlocked figure -->
            <g class="pg" fill="#2d1a00">
            <!-- Dreads -->
            <ellipse cx="60" cy="28" rx="26" ry="28" fill="#1a0d00"/>
            <path d="M34 30 Q20 60 18 90" stroke="#1a0d00" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M86 30 Q100 60 102 90" stroke="#1a0d00" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M40 28 Q32 55 30 80" stroke="#1a0d00" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M80 28 Q88 55 90 80" stroke="#1a0d00" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M50 25 Q44 52 43 76" stroke="#1a0d00" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M70 25 Q76 52 77 76" stroke="#1a0d00" stroke-width="4" fill="none" stroke-linecap="round"/>
            <!-- Head -->
            <ellipse cx="60" cy="52" rx="20" ry="22" fill="#2a1500"/>
            <!-- Body -->
            <path d="M40 72 Q38 110 36 140 L84 140 Q82 110 80 72 Z" fill="#1a0d00"/>
            <!-- Guitar hint -->
            <ellipse cx="85" cy="110" rx="14" ry="18" fill="#0d0800" opacity="0.6"/>
            <line x1="85" y1="92" x2="85" y2="128" stroke="#0d0800" stroke-width="3"/>
            </g>
          </svg>
        </div>
        <div class="poster-name">BOB MARLEY</div>
        <div class="poster-sub">ONE LOVE</div>
        <div class="poster-colors">
          <div class="rasta-bar rasta-red"></div>
          <div class="rasta-bar rasta-gold"></div>
          <div class="rasta-bar rasta-green"></div>
        </div>
      </div>
    </div>

    <!-- Neon sign -->
    <div class="lounge-neon">
      <div class="neon-text">🌿 BREAK LOUNGE</div>
      <div class="neon-sub">no props. just vibes.</div>
    </div>

    <!-- Main scene -->
    <div class="lounge-scene">
      <!-- Floor rug -->
      <div class="lounge-rug"></div>
      <!-- Couch -->
      <div class="lounge-couch">
        <div class="couch-back"></div>
        <div class="couch-seat"></div>
        <div class="couch-arm-l"></div>
        <div class="couch-arm-r"></div>
      </div>
      <!-- BeepBop on couch -->
      <div class="bb-sit">${bbSitting()}</div>
      <!-- Side table -->
      <div class="lounge-table">
        <div class="table-top">
          <div class="ashtray"><div class="ash-inner"></div></div>
          <div class="drink"><div class="drink-fill"></div></div>
        </div>
        <div class="table-leg"></div>
      </div>
    </div>

    <!-- Smoke container -->
    <div id="lounge-smoke" class="smoke-wrap"></div>
    <!-- Music notes -->
    <div id="lounge-notes" class="notes-wrap"></div>

  </div>
</div>`;

  startLoungeSmoke();
  startLoungeNotes();
}

function bbSitting() {
  return `<svg viewBox="0 0 190 250" xmlns="http://www.w3.org/2000/svg" width="150">
<defs><style>
@keyframes bb-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.018)}}
@keyframes blunt-ember{0%,100%{opacity:.6;r:3}50%{opacity:1;r:4.5}}
@keyframes arm-sway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(8deg)}}
.torso{animation:bb-breathe 3.5s ease-in-out infinite;transform-origin:95px 150px}
.ember{animation:blunt-ember 1.8s ease-in-out infinite}
.rarm{animation:arm-sway 4s ease-in-out infinite;transform-origin:148px 145px}
</style></defs>
<!-- ANTENNA -->
<line x1="95" y1="16" x2="95" y2="4" stroke="#FFD700" stroke-width="1.5"/>
<circle cx="95" cy="2" r="4" fill="#FFD700"/><circle cx="95" cy="2" r="2" fill="#ff4444"/>
<line x1="82" y1="10" x2="74" y2="4" stroke="#FFD700" stroke-width="1.5" opacity=".6"/>
<line x1="108" y1="10" x2="116" y2="4" stroke="#FFD700" stroke-width="1.5" opacity=".6"/>
<circle cx="74" cy="3" r="3" fill="#FFD700" opacity=".7"/>
<circle cx="116" cy="3" r="3" fill="#FFD700" opacity=".7"/>
<!-- HEAD -->
<rect x="55" y="16" width="80" height="64" rx="9" fill="#1a1a2e" stroke="#e52222" stroke-width="1.2"/>
<!-- Headband -->
<rect x="53" y="24" width="84" height="12" rx="3" fill="#e52222"/>
<text x="95" y="33" font-family="Arial Black,sans-serif" font-size="6.5" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="1.5">BEEPBOP</text>
<!-- Headband tie -->
<path d="M135 26 Q144 24 146 30 Q144 36 135 34" fill="#c41c1c"/>
<path d="M135 26 Q142 30 135 34" fill="#e52222"/>
<path d="M137 30 Q128 22 133 18 Q140 16 141 24" fill="#c41c1c"/>
<path d="M137 30 Q128 38 133 42 Q140 44 141 36" fill="#c41c1c"/>
<!-- Eyes — half-closed chill -->
<rect x="63" y="40" width="26" height="16" rx="3.5" fill="#0d0d1a" stroke="#e52222" stroke-width="0.7"/>
<rect x="101" y="40" width="26" height="16" rx="3.5" fill="#0d0d1a" stroke="#e52222" stroke-width="0.7"/>
<!-- Half lids -->
<rect x="63" y="40" width="26" height="8" rx="3" fill="#1a1a2e" opacity=".85"/>
<rect x="101" y="40" width="26" height="8" rx="3" fill="#1a1a2e" opacity=".85"/>
<ellipse cx="76" cy="50" rx="7" ry="4" fill="#e52222" opacity=".75"/>
<ellipse cx="114" cy="50" rx="7" ry="4" fill="#e52222" opacity=".75"/>
<ellipse cx="73" cy="48" rx="2.5" ry="1.8" fill="#ff8888" opacity=".7"/>
<ellipse cx="111" cy="48" rx="2.5" ry="1.8" fill="#ff8888" opacity=".7"/>
<!-- Smile -->
<rect x="68" y="64" width="54" height="11" rx="3" fill="#0d0d1a" stroke="#FFD700" stroke-width="0.7"/>
<path d="M73 70 Q95 76 117 70" stroke="#FFD700" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<!-- Bolts -->
<circle cx="59" cy="20" r="2" fill="#FFD700"/>
<circle cx="131" cy="20" r="2" fill="#FFD700"/>
<circle cx="59" cy="78" r="2" fill="#FFD700"/>
<circle cx="131" cy="78" r="2" fill="#FFD700"/>
<!-- NECK -->
<rect x="82" y="80" width="26" height="16" fill="#1a1a2e" stroke="#e52222" stroke-width="0.8"/>
<!-- TORSO -->
<g class="torso">
<rect x="28" y="96" width="134" height="108" rx="7" fill="#060606" stroke="#e52222" stroke-width="1"/>
<rect x="28" y="96" width="24" height="108" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<rect x="138" y="96" width="24" height="108" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="52" y1="96" x2="52" y2="202" stroke="#FFD700" stroke-width="1" opacity=".9"/>
<line x1="138" y1="96" x2="138" y2="202" stroke="#FFD700" stroke-width="1" opacity=".9"/>
<text x="95" y="118" font-family="Arial Black,sans-serif" font-size="7" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="1.5">BEEPBOP</text>
<text x="95" y="170" font-family="Arial Black,sans-serif" font-size="46" font-weight="900" fill="#FFD700" text-anchor="middle" opacity=".9">00</text>
<!-- Sleeve L -->
<path d="M28 96 L28 136 L4 136 Q-3 136 -5 128 L-5 118 Q-3 103 14 99 L28 96Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="-5" y1="136" x2="28" y2="136" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
<!-- Sleeve R -->
<path d="M162 96 L162 136 L186 136 Q193 136 195 128 L195 118 Q193 103 176 99 L162 96Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="195" y1="136" x2="162" y2="136" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
</g>
<!-- LEFT ARM — relaxed down -->
<rect x="4" y="128" width="22" height="50" rx="6" fill="#1a1a2e" stroke="#e52222" stroke-width="0.8"/>
<rect x="2" y="176" width="26" height="14" rx="5" fill="#2a2a4e" stroke="#e52222" stroke-width="0.7"/>
<!-- RIGHT ARM — raised, holding blunt -->
<g class="rarm">
<rect x="162" y="120" width="22" height="48" rx="6" fill="#1a1a2e" stroke="#e52222" stroke-width="0.8" transform="rotate(20 173 144)"/>
<rect x="172" y="162" width="26" height="13" rx="5" fill="#2a2a4e" stroke="#e52222" stroke-width="0.7" transform="rotate(20 185 168)"/>
<!-- BLUNT -->
<g transform="rotate(20 173 144)">
<rect x="192" y="155" width="30" height="5" rx="2.5" fill="#8B6914"/>
<rect x="192" y="155" width="7" height="5" rx="2.5" fill="#d4aa60"/>
<!-- Wrap lines on blunt -->
<line x1="199" y1="155" x2="199" y2="160" stroke="#7a5c10" stroke-width="0.5" opacity=".6"/>
<line x1="204" y1="155" x2="204" y2="160" stroke="#7a5c10" stroke-width="0.5" opacity=".6"/>
<line x1="209" y1="155" x2="209" y2="160" stroke="#7a5c10" stroke-width="0.5" opacity=".6"/>
<line x1="214" y1="155" x2="214" y2="160" stroke="#7a5c10" stroke-width="0.5" opacity=".6"/>
<!-- Ember -->
<circle class="ember" cx="222" cy="157" r="3.5" fill="#ff5500"/>
<circle cx="222" cy="157" r="1.5" fill="#ffaa00"/>
</g>
</g>
</svg>`;
}

function startLoungeSmoke() {
  var container = document.getElementById('lounge-smoke');
  if (!container) return;

  function puff() {
    var s = document.createElement('div');
    s.className = 'smoke-puff';
    // Smoke comes from blunt position (right side, mid height)
    var x = 62 + (Math.random()-0.5)*6;
    var size = 14 + Math.random()*18;
    var dur = 4 + Math.random()*4;
    s.style.cssText = [
      'left:'+x+'%',
      'bottom:42%',
      'width:'+size+'px',
      'height:'+size+'px',
      'animation-duration:'+dur+'s',
      'opacity:'+(0.12+Math.random()*0.18),
      'animation-delay:'+(Math.random()*1.5)+'s',
    ].join(';');
    container.appendChild(s);
    setTimeout(function(){ s.remove(); }, (dur+2)*1000);
  }

  // Rapid initial puffs then steady
  for(var i=0;i<4;i++) setTimeout(puff, i*400);
  setInterval(puff, 700);
}

function startLoungeNotes() {
  var container = document.getElementById('lounge-notes');
  if (!container) return;
  var notes = ['♪','♫','♩','♬','🎵'];
  var colors = ['#FFD700','#39ff14','#ff6b6b','#a855f7','#22d3ee'];
  function note() {
    var n = document.createElement('div');
    n.className = 'music-note';
    n.textContent = notes[Math.floor(Math.random()*notes.length)];
    var col = colors[Math.floor(Math.random()*colors.length)];
    var dur = 5 + Math.random()*4;
    n.style.cssText = 'left:'+(4+Math.random()*88)+'%;bottom:10%;color:'+col+';animation-duration:'+dur+'s;font-size:'+(14+Math.random()*10)+'px';
    container.appendChild(n);
    setTimeout(function(){ n.remove(); }, dur*1000+500);
  }
  setInterval(note, 1000);
}

// Init on tab click
document.addEventListener('DOMContentLoaded', function() {
  var orig = window.showTab;
  window.showTab = function(id, el) {
    orig(id, el);
    if (id === 'tab-lounge') setTimeout(renderLounge, 50);
  };
});
