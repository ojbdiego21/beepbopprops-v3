// BeepBop Mascot — full body on loading, face icon everywhere else

function bbFaceStatic(size) {
  size = size || 80;
  var w = size, h = Math.round(size * 0.76);
  return '<svg viewBox="0 0 120 92" xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" style="display:inline-block;vertical-align:middle">'
  + '<line x1="60" y1="12" x2="60" y2="3" stroke="#FFD700" stroke-width="1.5"/>'
  + '<circle cx="60" cy="2" r="4" fill="#FFD700"/><circle cx="60" cy="2" r="2" fill="#ff4444"/>'
  + '<rect x="10" y="14" width="100" height="76" rx="10" fill="#1a1a2e" stroke="#e52222" stroke-width="1.5"/>'
  + '<rect x="8" y="23" width="104" height="14" rx="3" fill="#e52222"/>'
  + '<text x="60" y="34" font-family="Arial Black,sans-serif" font-size="7.5" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>'
  + '<rect x="18" y="43" width="34" height="22" rx="4" fill="#0d0d1a" stroke="#e52222" stroke-width="0.8"/>'
  + '<rect x="68" y="43" width="34" height="22" rx="4" fill="#0d0d1a" stroke="#e52222" stroke-width="0.8"/>'
  + '<ellipse cx="35" cy="54" rx="8" ry="6" fill="#e52222" opacity="0.9"/>'
  + '<ellipse cx="85" cy="54" rx="8" ry="6" fill="#e52222" opacity="0.9"/>'
  + '<ellipse cx="32" cy="51" rx="2.5" ry="2" fill="#ff8888" opacity="0.8"/>'
  + '<ellipse cx="82" cy="51" rx="2.5" ry="2" fill="#ff8888" opacity="0.8"/>'
  + '<rect x="22" y="71" width="76" height="13" rx="3" fill="#0d0d1a" stroke="#FFD700" stroke-width="0.8"/>'
  + '<rect x="27" y="74" width="4" height="7" rx="1" fill="#FFD700"/>'
  + '<rect x="34" y="76" width="4" height="5" rx="1" fill="#FFD700" opacity="0.7"/>'
  + '<rect x="41" y="75" width="4" height="6" rx="1" fill="#FFD700"/>'
  + '<rect x="48" y="73" width="4" height="8" rx="1" fill="#e52222"/>'
  + '<rect x="55" y="76" width="4" height="5" rx="1" fill="#FFD700"/>'
  + '<rect x="62" y="74" width="4" height="7" rx="1" fill="#FFD700"/>'
  + '<rect x="69" y="77" width="4" height="4" rx="1" fill="#e52222"/>'
  + '<rect x="76" y="75" width="4" height="6" rx="1" fill="#FFD700"/>'
  + '<circle cx="14" cy="18" r="2.5" fill="#FFD700"/>'
  + '<circle cx="106" cy="18" r="2.5" fill="#FFD700"/>'
  + '<circle cx="14" cy="88" r="2.5" fill="#FFD700"/>'
  + '<circle cx="106" cy="88" r="2.5" fill="#FFD700"/>'
  + '</svg>';
}

function bbFullBodyLoading() {
  return '<svg viewBox="0 0 340 520" xmlns="http://www.w3.org/2000/svg" width="160" style="display:block;margin:0 auto">'
  + '<defs><style>'
  + '@keyframes bb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'
  + '@keyframes bb-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'
  + '.bbb{animation:bb-bob 1s ease-in-out infinite;transform-origin:170px 260px}'
  + '.bbs{animation:bb-spin .9s linear infinite;transform-origin:270px 295px}'
  + '</style></defs>'
  + '<g class="bbb">'
  // ANTENNA
  + '<line x1="170" y1="28" x2="170" y2="8" stroke="#FFD700" stroke-width="2"/>'
  + '<circle cx="170" cy="4" r="6" fill="#FFD700"/><circle cx="170" cy="4" r="3" fill="#ff4444"/>'
  + '<line x1="154" y1="18" x2="144" y2="10" stroke="#FFD700" stroke-width="2" opacity=".6"/>'
  + '<line x1="186" y1="18" x2="196" y2="10" stroke="#FFD700" stroke-width="2" opacity=".6"/>'
  + '<circle cx="144" cy="8" r="3" fill="#FFD700" opacity=".7"/>'
  + '<circle cx="196" cy="8" r="3" fill="#FFD700" opacity=".7"/>'
  // HEAD
  + '<rect x="84" y="28" width="172" height="118" rx="14" fill="#1a1a2e" stroke="#e52222" stroke-width="1.5"/>'
  // HEADBAND
  + '<rect x="81" y="42" width="178" height="20" rx="4" fill="#e52222"/>'
  + '<text x="170" y="57" font-family="Arial Black,sans-serif" font-size="9" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>'
  + '<path d="M257 45 Q272 43 274 53 Q272 63 257 61" fill="#c41c1c"/>'
  + '<path d="M257 45 Q269 53 257 61" fill="#e52222"/>'
  + '<path d="M259 53 Q245 41 252 35 Q263 32 264 43" fill="#c41c1c"/>'
  + '<path d="M259 53 Q245 65 252 71 Q263 74 264 63" fill="#c41c1c"/>'
  + '<path d="M264 43 Q280 38 285 32" stroke="#e52222" stroke-width="3" fill="none" stroke-linecap="round"/>'
  + '<path d="M264 63 Q280 68 283 75" stroke="#e52222" stroke-width="3" fill="none" stroke-linecap="round"/>'
  // EYES
  + '<rect x="97" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="191" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>'
  + '<ellipse cx="123" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/>'
  + '<ellipse cx="217" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/>'
  + '<ellipse cx="118" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/>'
  + '<ellipse cx="212" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/>'
  // MOUTH
  + '<rect x="110" y="108" width="120" height="18" rx="4" fill="#0d0d1a" stroke="#FFD700" stroke-width="1"/>'
  + '<rect x="117" y="112" width="5" height="10" rx="1" fill="#FFD700"/>'
  + '<rect x="126" y="116" width="5" height="6" rx="1" fill="#FFD700" opacity=".7"/>'
  + '<rect x="135" y="113" width="5" height="9" rx="1" fill="#FFD700"/>'
  + '<rect x="144" y="111" width="5" height="11" rx="1" fill="#e52222"/>'
  + '<rect x="153" y="115" width="5" height="7" rx="1" fill="#FFD700"/>'
  + '<rect x="162" y="112" width="5" height="10" rx="1" fill="#FFD700"/>'
  + '<rect x="171" y="116" width="5" height="6" rx="1" fill="#e52222"/>'
  + '<rect x="180" y="113" width="5" height="9" rx="1" fill="#FFD700"/>'
  + '<rect x="189" y="115" width="5" height="7" rx="1" fill="#FFD700"/>'
  + '<rect x="198" y="113" width="5" height="9" rx="1" fill="#FFD700"/>'
  // BOLTS
  + '<circle cx="88" cy="32" r="3" fill="#FFD700"/>'
  + '<circle cx="252" cy="32" r="3" fill="#FFD700"/>'
  + '<circle cx="88" cy="142" r="3" fill="#FFD700"/>'
  + '<circle cx="252" cy="142" r="3" fill="#FFD700"/>'
  // NECK
  + '<rect x="148" y="146" width="44" height="26" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>'
  + '<line x1="161" y1="146" x2="161" y2="172" stroke="#e52222" stroke-width=".7" opacity=".5"/>'
  + '<line x1="170" y1="146" x2="170" y2="172" stroke="#e52222" stroke-width=".7" opacity=".5"/>'
  + '<line x1="179" y1="146" x2="179" y2="172" stroke="#e52222" stroke-width=".7" opacity=".5"/>'
  // JERSEY BODY
  + '<rect x="60" y="172" width="36" height="168" fill="#b31515" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="96" y="172" width="148" height="168" fill="#060606" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="244" y="172" width="36" height="168" fill="#b31515" stroke="#e52222" stroke-width="1"/>'
  + '<line x1="96" y1="172" x2="96" y2="338" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>'
  + '<line x1="244" y1="172" x2="244" y2="338" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>'
  + '<rect x="60" y="334" width="220" height="6" fill="#9B0000"/>'
  + '<rect x="60" y="339" width="220" height="3" fill="#FFD700" opacity=".6"/>'
  // V-NECK
  + '<path d="M96 172 Q118 172 130 184 Q140 196 170 198 Q200 196 210 184 Q222 172 244 172 L238 172 Q216 174 206 188 Q194 202 170 204 Q146 202 134 188 Q122 174 102 172Z" fill="#9B0000"/>'
  + '<path d="M102 172 Q122 174 134 188 Q146 202 170 204 Q194 202 206 188 Q216 174 238 172" stroke="#FFD700" stroke-width="1.4" fill="none"/>'
  // NAME + NUMBER
  + '<text x="170" y="210" font-family="Arial Black,sans-serif" font-size="10" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>'
  + '<text x="170" y="306" font-family="Arial Black,sans-serif" font-size="68" font-weight="900" fill="#FFD700" text-anchor="middle" opacity=".95">00</text>'
  // LIGHTS
  + '<circle cx="118" cy="320" r="4" fill="#e52222" opacity=".7"/><circle cx="118" cy="320" r="2" fill="#ff8888"/>'
  + '<circle cx="170" cy="318" r="6" fill="#FFD700" opacity=".6"/><circle cx="170" cy="318" r="3" fill="#060606"/>'
  + '<circle cx="222" cy="320" r="4" fill="#e52222" opacity=".7"/><circle cx="222" cy="320" r="2" fill="#ff8888"/>'
  // LEFT ARM
  + '<circle cx="100" cy="186" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>'
  + '<circle cx="100" cy="186" r="5" fill="#1a1a2e"/><circle cx="100" cy="186" r="2.5" fill="#e52222" opacity=".8"/>'
  + '<rect x="28" y="196" width="40" height="58" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>'
  + '<circle cx="48" cy="258" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="26" y="263" width="44" height="20" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="30" y="267" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  + '<rect x="42" y="267" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  + '<rect x="54" y="267" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  // RIGHT ARM (raised for ball)
  + '<circle cx="240" cy="186" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>'
  + '<circle cx="240" cy="186" r="5" fill="#1a1a2e"/><circle cx="240" cy="186" r="2.5" fill="#e52222" opacity=".8"/>'
  + '<rect x="270" y="196" width="40" height="52" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1" transform="rotate(-14 290 222)"/>'
  + '<circle cx="294" cy="256" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="280" y="262" width="40" height="18" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1" transform="rotate(-6 300 271)"/>'
  + '<rect x="283" y="265" width="8" height="11" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  + '<rect x="294" y="264" width="8" height="11" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  + '<rect x="305" y="263" width="8" height="11" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>'
  // LEFT SLEEVE over arm
  + '<path d="M60 172 L60 222 L20 222 Q8 222 6 212 L6 202 Q8 184 28 178 L60 172Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>'
  + '<line x1="6" y1="222" x2="60" y2="222" stroke="#FFD700" stroke-width="2" opacity=".9"/>'
  // RIGHT SLEEVE over arm
  + '<path d="M280 172 L280 222 L316 222 Q328 222 330 212 L330 202 Q328 184 312 178 L280 172Z" fill="#b31515" stroke="#e52222" stroke-width="1"/>'
  + '<line x1="330" y1="222" x2="280" y2="222" stroke="#FFD700" stroke-width="2" opacity=".9"/>'
  // WAISTBAND
  + '<rect x="60" y="340" width="220" height="14" rx="5" fill="#080808" stroke="#e52222" stroke-width="1"/>'
  + '<rect x="68" y="344" width="22" height="6" rx="2" fill="#b31515"/>'
  + '<rect x="96" y="344" width="148" height="6" rx="2" fill="#0d0d1a"/>'
  + '<rect x="250" y="344" width="22" height="6" rx="2" fill="#b31515"/>'
  // SHORTS
  + '<path d="M60 353 L78 353 L82 390 L62 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>'
  + '<rect x="78" y="353" width="184" height="37" rx="3" fill="#080808" stroke="#e52222" stroke-width=".8"/>'
  + '<path d="M262 353 L280 353 L278 390 L258 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>'
  // LEFT SHOE
  + '<path d="M44 420 Q44 410 58 408 L126 408 Q138 408 138 420 L138 430 Q138 438 124 438 L52 438 Q44 438 44 430 Z" fill="#f5f0e8"/>'
  + '<path d="M58 408 Q58 401 66 400 L98 400 Q106 402 106 408" fill="#e8e0cc"/>'
  + '<path d="M64 414 Q78 406 102 408 Q112 410 116 416 Q108 418 92 417 Q76 416 64 420Z" fill="#e52222" opacity=".9"/>'
  + '<path d="M66 420 Q80 417 100 418 Q110 419 116 423 Q104 425 88 424 Q72 423 66 426Z" fill="#FFD700" opacity=".8"/>'
  + '<rect x="42" y="430" width="98" height="8" rx="3" fill="#111"/>'
  + '<rect x="42" y="434" width="98" height="2" rx="1" fill="#e52222" opacity=".7"/>'
  + '<rect x="42" y="407" width="16" height="26" rx="5" fill="#e0d8c4"/>'
  + '<text x="50" y="423" font-family="Arial Black,sans-serif" font-size="5" fill="#e52222" text-anchor="middle" font-weight="900">BB</text>'
  // RIGHT SHOE
  + '<path d="M202 420 Q202 410 216 408 L284 408 Q296 408 296 420 L296 430 Q296 438 282 438 L210 438 Q202 438 202 430 Z" fill="#f5f0e8"/>'
  + '<path d="M216 408 Q216 401 224 400 L256 400 Q264 402 264 408" fill="#e8e0cc"/>'
  + '<path d="M278 414 Q264 406 240 408 Q230 410 226 416 Q234 418 250 417 Q266 416 278 420Z" fill="#e52222" opacity=".9"/>'
  + '<path d="M276 420 Q262 417 242 418 Q232 419 226 423 Q238 425 254 424 Q270 423 276 426Z" fill="#FFD700" opacity=".8"/>'
  + '<rect x="200" y="430" width="98" height="8" rx="3" fill="#111"/>'
  + '<rect x="200" y="434" width="98" height="2" rx="1" fill="#e52222" opacity=".7"/>'
  + '<rect x="282" y="407" width="16" height="26" rx="5" fill="#e0d8c4"/>'
  + '<text x="290" y="423" font-family="Arial Black,sans-serif" font-size="5" fill="#e52222" text-anchor="middle" font-weight="900">BB</text>'
  + '</g>'
  // SPINNING BALL
  + '<g class="bbs">'
  + '<circle cx="270" cy="295" r="24" fill="#e8621a"/>'
  + '<ellipse cx="270" cy="295" rx="24" ry="9" fill="none" stroke="#1a0a00" stroke-width="1.6"/>'
  + '<line x1="270" y1="271" x2="270" y2="319" stroke="#1a0a00" stroke-width="1.6"/>'
  + '<ellipse cx="270" cy="295" rx="9" ry="24" fill="none" stroke="#1a0a00" stroke-width="1" opacity=".5"/>'
  + '</g>'
  + '<ellipse cx="263" cy="285" rx="6" ry="3.5" fill="white" opacity=".24"/>'
  + '<ellipse cx="170" cy="510" rx="110" ry="5" fill="#e52222" opacity=".06"/>'
  + '</svg>';
}

// ── INJECT LOADERS — full body with spinning ball ──
function injectBeepBop() {
  document.querySelectorAll('.loader-box').forEach(function(box) {
    if (box.querySelector('.bb-injected')) return;
    var lt = box.querySelector('.lt');
    var text = lt ? lt.textContent : 'Loading...';
    box.innerHTML = '<div class="bb-injected" style="display:flex;flex-direction:column;align-items:center;padding:16px 10px;gap:6px">'
      + bbFullBodyLoading()
      + '<div style="font-family:\'Bebas Neue\',cursive;font-size:14px;color:#e52222;letter-spacing:2px;text-align:center">' + text + '</div>'
      + '</div>';
  });
}

// ── INJECT LOGO — face only ──
function injectLogo() {
  // Target our specific logo span
  var face = document.querySelector('.logo-bb-face');
  if (face) face.innerHTML = bbFaceStatic(38);

  // Also replace any stray robot emojis in nav/header
  document.querySelectorAll('.logo, header, .nav-logo').forEach(function(el) {
    if (!el.querySelector('svg') && el.innerHTML.includes('🤖')) {
      el.innerHTML = el.innerHTML.replace('🤖', bbFaceStatic(32));
    }
  });
}

// ── INJECT STATS LABEL — face only ──
function injectStatsIcon() {
  document.querySelectorAll('.stats-ai-label, .bb-icon').forEach(function(el) {
    el.innerHTML = el.innerHTML.replace('🤖', bbFaceStatic(20));
  });
}

// ── MUTATION OBSERVER for dynamically added loaders ──
var bbObserver = new MutationObserver(function(mutations) {
  var needs = false;
  mutations.forEach(function(m) {
    m.addedNodes.forEach(function(node) {
      if (node.nodeType !== 1) return;
      if ((node.classList && node.classList.contains('loader-box')) ||
          (node.querySelectorAll && node.querySelectorAll('.loader-box').length)) {
        needs = true;
      }
    });
  });
  if (needs) injectBeepBop();
});

document.addEventListener('DOMContentLoaded', function() {
  bbObserver.observe(document.body, { childList: true, subtree: true });
  injectBeepBop();
  injectLogo();
  setTimeout(injectStatsIcon, 800);
});
