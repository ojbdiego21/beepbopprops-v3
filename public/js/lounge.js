// BeepBop's Break Lounge 🌿

function renderLounge() {
  var el = document.getElementById('break-lounge-canvas');
  if (!el) return;
  el.innerHTML = `
<div class="lounge-wrap">
  <div class="lounge-bg">
    <!-- Ambient lights -->
    <div class="lounge-light lounge-light-1"></div>
    <div class="lounge-light lounge-light-2"></div>
    <div class="lounge-light lounge-light-3"></div>
    <!-- Smoke particles -->
    <div class="smoke-container" id="smoke-container"></div>
    <!-- Main scene -->
    <div class="lounge-scene">
      <!-- Couch -->
      <div class="lounge-couch">
        <div class="couch-back"></div>
        <div class="couch-seat"></div>
        <div class="couch-arm couch-arm-l"></div>
        <div class="couch-arm couch-arm-r"></div>
        <div class="couch-cushion"></div>
        <div class="couch-cushion couch-cushion-2"></div>
      </div>
      <!-- BeepBop sitting -->
      <div class="bb-lounge-robot">
        ${bbLoungeBody()}
      </div>
      <!-- Side table -->
      <div class="lounge-table">
        <div class="table-top"></div>
        <div class="table-leg"></div>
        <!-- Ashtray -->
        <div class="ashtray">
          <div class="ashtray-inner"></div>
        </div>
        <!-- Drink -->
        <div class="drink-glass">
          <div class="drink-liquid"></div>
          <div class="drink-straw"></div>
        </div>
      </div>
      <!-- Floor -->
      <div class="lounge-floor"></div>
    </div>
    <!-- Sign -->
    <div class="lounge-sign">
      <div class="sign-flicker">🌿 BEEPBOP'S BREAK LOUNGE 🌿</div>
      <div class="sign-sub">No prop talk. Just vibes.</div>
    </div>
    <!-- Ambient music note -->
    <div class="music-notes" id="music-notes"></div>
  </div>
</div>`;

  startSmoke();
  startMusicNotes();
}

function bbLoungeBody() {
  return `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" width="160">
  <defs>
    <style>
      @keyframes bb-breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.02)}}
      @keyframes blunt-glow{0%,100%{opacity:.7}50%{opacity:1}}
      @keyframes arm-raise{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
      .bb-torso{animation:bb-breathe 3s ease-in-out infinite;transform-origin:100px 160px}
      .blunt{animation:blunt-glow 2s ease-in-out infinite}
      .bb-arm-r{animation:arm-raise 4s ease-in-out infinite;transform-origin:155px 155px}
    </style>
  </defs>
  <!-- Antenna -->
  <line x1="100" y1="18" x2="100" y2="5" stroke="#FFD700" stroke-width="1.5"/>
  <circle cx="100" cy="3" r="4" fill="#FFD700"/>
  <circle cx="100" cy="3" r="2" fill="#ff4444"/>
  <!-- HEAD -->
  <rect x="45" y="18" width="110" height="76" rx="10" fill="#1a1a2e" stroke="#e52222" stroke-width="1.2"/>
  <!-- Headband -->
  <rect x="43" y="27" width="114" height="13" rx="3" fill="#e52222"/>
  <text x="100" y="37" font-family="Arial Black,sans-serif" font-size="6" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="1.5">BEEPBOP</text>
  <!-- Eyes — half closed/relaxed -->
  <rect x="54" y="45" width="34" height="18" rx="4" fill="#0d0d1a" stroke="#e52222" stroke-width="0.8"/>
  <rect x="112" y="45" width="34" height="18" rx="4" fill="#0d0d1a" stroke="#e52222" stroke-width="0.8"/>
  <!-- Half-lidded eyes — chill mode -->
  <rect x="54" y="45" width="34" height="9" rx="3" fill="#1a1a2e" opacity="0.8"/>
  <rect x="112" y="45" width="34" height="9" rx="3" fill="#1a1a2e" opacity="0.8"/>
  <ellipse cx="71" cy="57" rx="7" ry="4" fill="#e52222" opacity="0.7"/>
  <ellipse cx="129" cy="57" rx="7" ry="4" fill="#e52222" opacity="0.7"/>
  <!-- Smile mouth -->
  <rect x="65" y="72" width="70" height="12" rx="3" fill="#0d0d1a" stroke="#FFD700" stroke-width="0.8"/>
  <path d="M70 78 Q100 84 130 78" stroke="#FFD700" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Bolts -->
  <circle cx="49" cy="22" r="2" fill="#FFD700"/>
  <circle cx="151" cy="22" r="2" fill="#FFD700"/>
  <circle cx="49" cy="91" r="2" fill="#FFD700"/>
  <circle cx="151" cy="91" r="2" fill="#FFD700"/>
  <!-- NECK -->
  <rect x="83" y="94" width="34" height="18" fill="#1a1a2e" stroke="#e52222" stroke-width="0.8"/>
  <!-- JERSEY TORSO -->
  <g class="bb-torso">
  <rect x="38" y="112" width="124" height="120" rx="8" fill="#060606" stroke="#e52222" stroke-width="1"/>
  <rect x="38" y="112" width="24" height="120" fill="#b31515" stroke="#e52222" stroke-width="1"/>
  <rect x="138" y="112" width="24" height="120" fill="#b31515" stroke="#e52222" stroke-width="1"/>
  <line x1="62" y1="112" x2="62" y2="230" stroke="#FFD700" stroke-width="1" opacity=".9"/>
  <line x1="138" y1="112" x2="138" y2="230" stroke="#FFD700" stroke-width="1" opacity=".9"/>
  <text x="100" y="140" font-family="Arial Black,sans-serif" font-size="7" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="1.5">BEEPBOP</text>
  <text x="100" y="195" font-family="Arial Black,sans-serif" font-size="44" font-weight="900" fill="#FFD700" text-anchor="middle" opacity=".9">00</text>
  <!-- Sleeves -->
  <path d="M38 112 L38 148 L12 148 Q4 148 2 140 L2 132 Q4 120 18 116 L38 112Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>
  <line x1="2" y1="148" x2="38" y2="148" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
  <path d="M162 112 L162 148 L188 148 Q196 148 198 140 L198 132 Q196 120 182 116 L162 112Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>
  <line x1="198" y1="148" x2="162" y2="148" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
  </g>
  <!-- LEFT ARM — resting on couch -->
  <rect x="8" y="140" width="28" height="60" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
  <rect x="6" y="198" width="30" height="16" rx="6" fill="#2a2a4e" stroke="#e52222" stroke-width="0.8"/>
  <!-- RIGHT ARM — raised holding blunt -->
  <g class="bb-arm-r">
  <rect x="162" y="135" width="28" height="55" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1" transform="rotate(15 176 162)"/>
  <rect x="175" y="182" width="30" height="14" rx="6" fill="#2a2a4e" stroke="#e52222" stroke-width="0.8" transform="rotate(15 190 189)"/>
  <!-- BLUNT in hand -->
  <g class="blunt">
  <rect x="200" y="165" width="36" height="5" rx="2.5" fill="#8B6914"/>
  <rect x="200" y="165" width="8" height="5" rx="2.5" fill="#c8a96e"/>
  <circle cx="236" cy="167" r="3" fill="#ff6600" opacity="0.9"/>
  <circle cx="236" cy="167" r="1.5" fill="#ffaa00"/>
  </g>
  </g>
</svg>`;
}

function startSmoke() {
  var container = document.getElementById('smoke-container');
  if (!container) return;
  function addSmoke() {
    var s = document.createElement('div');
    s.className = 'smoke-puff';
    var startX = 55 + Math.random()*20;
    s.style.cssText = 'left:'+startX+'%;bottom:45%;animation-duration:'+(3+Math.random()*4)+'s;animation-delay:'+(Math.random()*2)+'s;width:'+(12+Math.random()*16)+'px;height:'+(12+Math.random()*16)+'px;opacity:'+(0.15+Math.random()*0.2);
    container.appendChild(s);
    setTimeout(function(){ s.remove(); }, 7000);
  }
  setInterval(addSmoke, 600);
}

function startMusicNotes() {
  var container = document.getElementById('music-notes');
  if (!container) return;
  var notes = ['♪','♫','♩','♬'];
  function addNote() {
    var n = document.createElement('div');
    n.className = 'music-note';
    n.textContent = notes[Math.floor(Math.random()*notes.length)];
    n.style.cssText = 'left:'+(5+Math.random()*90)+'%;animation-duration:'+(4+Math.random()*4)+'s;color:hsl('+(Math.random()*60+100)+',60%,60%)';
    container.appendChild(n);
    setTimeout(function(){ n.remove(); }, 8000);
  }
  setInterval(addNote, 1200);
}

// Auto-render when tab shown
document.addEventListener('DOMContentLoaded', function() {
  var origShow = window.showTab;
  window.showTab = function(id, el) {
    origShow(id, el);
    if (id === 'tab-lounge') {
      setTimeout(renderLounge, 50);
    }
  };
});
