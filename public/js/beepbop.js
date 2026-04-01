// BeepBop Mascot — static normally, spinning ball when loading

var BB_LOADING = false;

var BEEPBOP_SVG_STATIC = `<svg viewBox="0 0 340 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:160px;display:block;margin:0 auto">
<defs><style>.bbcl{stroke:#e52222;stroke-width:.8;fill:none;opacity:.5}.bbal{stroke:#FFD700;stroke-width:2;fill:none}</style></defs>
<line x1="170" y1="28" x2="170" y2="8" class="bbal"/><circle cx="170" cy="4" r="6" fill="#FFD700"/><circle cx="170" cy="4" r="3" fill="#ff4444"/>
<line x1="154" y1="18" x2="146" y2="10" class="bbal" opacity=".6"/><line x1="186" y1="18" x2="194" y2="10" class="bbal" opacity=".6"/>
<circle cx="146" cy="8" r="3" fill="#FFD700" opacity=".7"/><circle cx="194" cy="8" r="3" fill="#FFD700" opacity=".7"/>
<rect x="84" y="28" width="172" height="118" rx="14" fill="#1a1a2e" stroke="#e52222" stroke-width="1.5"/>
<rect x="81" y="42" width="178" height="20" rx="4" fill="#e52222"/>
<text x="170" y="57" font-family="Arial Black,sans-serif" font-size="9" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>
<path d="M257 45 Q272 43 274 53 Q272 63 257 61" fill="#c41c1c"/><path d="M257 45 Q269 53 257 61" fill="#e52222"/>
<rect x="97" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>
<rect x="191" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>
<ellipse cx="123" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/><ellipse cx="217" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/>
<ellipse cx="118" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/><ellipse cx="212" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/>
<rect x="110" y="112" width="120" height="18" rx="4" fill="#0d0d1a" stroke="#FFD700" stroke-width="1"/>
<rect x="117" y="116" width="5" height="10" rx="1" fill="#FFD700"/><rect x="126" y="119" width="5" height="7" rx="1" fill="#FFD700" opacity=".7"/>
<rect x="135" y="117" width="5" height="9" rx="1" fill="#FFD700"/><rect x="144" y="115" width="5" height="11" rx="1" fill="#e52222"/>
<rect x="153" y="118" width="5" height="8" rx="1" fill="#FFD700"/><rect x="162" y="116" width="5" height="10" rx="1" fill="#FFD700"/>
<rect x="171" y="119" width="5" height="7" rx="1" fill="#e52222"/><rect x="180" y="116" width="5" height="10" rx="1" fill="#FFD700"/>
<rect x="189" y="118" width="5" height="8" rx="1" fill="#FFD700"/><rect x="198" y="117" width="5" height="9" rx="1" fill="#FFD700"/>
<rect x="149" y="146" width="42" height="20" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<line x1="161" y1="146" x2="161" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<line x1="170" y1="146" x2="170" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<line x1="179" y1="146" x2="179" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<rect x="60" y="170" width="36" height="175" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<rect x="96" y="170" width="148" height="175" fill="#060606" stroke="#e52222" stroke-width="1"/>
<rect x="244" y="170" width="36" height="175" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="96" y1="170" x2="96" y2="342" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
<line x1="244" y1="170" x2="244" y2="342" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
<rect x="60" y="338" width="220" height="6" fill="#9B0000"/>
<rect x="60" y="342" width="220" height="3" fill="#FFD700" opacity=".6"/>
<path d="M96 170 Q118 170 130 184 Q140 196 170 198 Q200 196 210 184 Q222 170 244 170" stroke="#FFD700" stroke-width="1.4" fill="none"/>
<path d="M96 170 Q118 170 130 184 Q140 196 170 198 Q200 196 210 184 Q222 170 244 170 L238 170 Q216 172 206 186 Q194 200 170 202 Q146 200 134 186 Q122 172 102 170Z" fill="#9B0000"/>
<text x="170" y="208" font-family="Arial Black,sans-serif" font-size="10" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>
<text x="170" y="280" font-family="Arial Black,sans-serif" font-size="60" font-weight="900" fill="#FFD700" text-anchor="middle" opacity=".95">00</text>
<circle cx="118" cy="298" r="4" fill="#e52222" opacity=".7"/><circle cx="118" cy="298" r="2" fill="#ff8888"/>
<circle cx="170" cy="296" r="6" fill="#FFD700" opacity=".6"/><circle cx="170" cy="296" r="3" fill="#060606"/>
<circle cx="222" cy="298" r="4" fill="#e52222" opacity=".7"/><circle cx="222" cy="298" r="2" fill="#ff8888"/>
<path d="M96 170 L60 170 L60 220 L30 228 L28 246 Q26 258 36 260 L46 258 Q50 256 52 248 L54 238 L60 230 L60 344" fill="none" stroke="#e52222" stroke-width=".5" opacity=".3"/>
<circle cx="100" cy="182" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<circle cx="100" cy="182" r="5" fill="#1a1a2e"/><circle cx="100" cy="182" r="2.5" fill="#e52222" opacity=".8"/>
<rect x="28" y="196" width="40" height="68" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<circle cx="48" cy="268" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="26" y="273" width="44" height="20" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="30" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="42" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="54" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<circle cx="240" cy="182" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<circle cx="240" cy="182" r="5" fill="#1a1a2e"/><circle cx="240" cy="182" r="2.5" fill="#e52222" opacity=".8"/>
<rect x="272" y="196" width="40" height="68" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<circle cx="292" cy="268" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="270" y="273" width="44" height="20" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="274" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="286" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="298" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<circle cx="270" cy="235" r="12" fill="#ff6b00"/>
<path d="M258 235 Q270 226 282 235" stroke="#1a1a1a" stroke-width="1.2" fill="none"/>
<path d="M258 235 Q270 244 282 235" stroke="#1a1a1a" stroke-width="1.2" fill="none"/>
<line x1="270" y1="223" x2="270" y2="247" stroke="#1a1a1a" stroke-width="1.2"/>
<ellipse cx="265" cy="228" rx="4" ry="3" fill="white" opacity=".22"/>
<rect x="60" y="170" width="36" height="50" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="60" y1="218" x2="96" y2="218" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
<rect x="244" y="170" width="36" height="50" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="244" y1="218" x2="280" y2="218" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
<rect x="60" y="344" width="220" height="14" rx="5" fill="#080808" stroke="#e52222" stroke-width="1"/>
<path d="M60 357 L78 357 L81 390 L62 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<rect x="78" y="357" width="184" height="33" rx="3" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<path d="M262 357 L280 357 L278 390 L259 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<rect x="60" y="390" width="92" height="24" rx="8" fill="#f5f0e8"/>
<path d="M66 390 Q66 383 74 381 L112 381 Q120 383 120 390" fill="#e8e0cc"/>
<path d="M68 396 Q80 389 104 391 Q112 393 115 398 Q107 400 94 399 Q79 398 68 402Z" fill="#e52222" opacity=".9"/>
<path d="M70 402 Q82 399 102 400 Q111 401 115 405 Q104 407 88 406 Q74 405 70 408Z" fill="#FFD700" opacity=".8"/>
<rect x="58" y="408" width="96" height="7" rx="3" fill="#111"/>
<rect x="58" y="412" width="96" height="2" rx="1" fill="#e52222" opacity=".7"/>
<rect x="188" y="390" width="92" height="24" rx="8" fill="#f5f0e8"/>
<path d="M194 390 Q194 383 202 381 L240 381 Q248 383 248 390" fill="#e8e0cc"/>
<path d="M246 396 Q234 389 210 391 Q202 393 199 398 Q207 400 220 399 Q235 398 246 402Z" fill="#e52222" opacity=".9"/>
<path d="M244 402 Q232 399 212 400 Q203 401 199 405 Q210 407 226 406 Q240 405 244 408Z" fill="#FFD700" opacity=".8"/>
<rect x="186" y="408" width="96" height="7" rx="3" fill="#111"/>
<rect x="186" y="412" width="96" height="2" rx="1" fill="#e52222" opacity=".7"/>
</svg>`;

var BEEPBOP_SVG_LOADING = `<svg viewBox="0 0 340 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:160px;display:block;margin:0 auto">
<defs><style>
.bbcl{stroke:#e52222;stroke-width:.8;fill:none;opacity:.5}
.bbal{stroke:#FFD700;stroke-width:2;fill:none}
@keyframes bb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes bb-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.bb-body{animation:bb-bob 1s ease-in-out infinite;transform-origin:170px 280px}
.bb-ball-spin{animation:bb-spin .9s linear infinite;transform-origin:270px 235px}
</style></defs>
<g class="bb-body">
<line x1="170" y1="28" x2="170" y2="8" class="bbal"/><circle cx="170" cy="4" r="6" fill="#FFD700"/><circle cx="170" cy="4" r="3" fill="#ff4444"/>
<line x1="154" y1="18" x2="146" y2="10" class="bbal" opacity=".6"/><line x1="186" y1="18" x2="194" y2="10" class="bbal" opacity=".6"/>
<circle cx="146" cy="8" r="3" fill="#FFD700" opacity=".7"/><circle cx="194" cy="8" r="3" fill="#FFD700" opacity=".7"/>
<rect x="84" y="28" width="172" height="118" rx="14" fill="#1a1a2e" stroke="#e52222" stroke-width="1.5"/>
<rect x="81" y="42" width="178" height="20" rx="4" fill="#e52222"/>
<text x="170" y="57" font-family="Arial Black,sans-serif" font-size="9" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>
<path d="M257 45 Q272 43 274 53 Q272 63 257 61" fill="#c41c1c"/><path d="M257 45 Q269 53 257 61" fill="#e52222"/>
<rect x="97" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>
<rect x="191" y="67" width="52" height="30" rx="5" fill="#0d0d1a" stroke="#e52222" stroke-width="1"/>
<ellipse cx="123" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/><ellipse cx="217" cy="82" rx="11" ry="8" fill="#e52222" opacity=".9"/>
<ellipse cx="118" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/><ellipse cx="212" cy="79" rx="3.5" ry="2.5" fill="#ff8888" opacity=".8"/>
<rect x="110" y="112" width="120" height="18" rx="4" fill="#0d0d1a" stroke="#FFD700" stroke-width="1"/>
<rect x="117" y="116" width="5" height="10" rx="1" fill="#FFD700"/><rect x="126" y="119" width="5" height="7" rx="1" fill="#FFD700" opacity=".7"/>
<rect x="135" y="117" width="5" height="9" rx="1" fill="#FFD700"/><rect x="144" y="115" width="5" height="11" rx="1" fill="#e52222"/>
<rect x="153" y="118" width="5" height="8" rx="1" fill="#FFD700"/><rect x="162" y="116" width="5" height="10" rx="1" fill="#FFD700"/>
<rect x="171" y="119" width="5" height="7" rx="1" fill="#e52222"/><rect x="180" y="116" width="5" height="10" rx="1" fill="#FFD700"/>
<rect x="189" y="118" width="5" height="8" rx="1" fill="#FFD700"/><rect x="198" y="117" width="5" height="9" rx="1" fill="#FFD700"/>
<rect x="149" y="146" width="42" height="20" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<line x1="161" y1="146" x2="161" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<line x1="170" y1="146" x2="170" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<line x1="179" y1="146" x2="179" y2="166" stroke="#e52222" stroke-width=".7" opacity=".5"/>
<rect x="60" y="170" width="36" height="175" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<rect x="96" y="170" width="148" height="175" fill="#060606" stroke="#e52222" stroke-width="1"/>
<rect x="244" y="170" width="36" height="175" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="96" y1="170" x2="96" y2="342" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
<line x1="244" y1="170" x2="244" y2="342" stroke="#FFD700" stroke-width="1.5" opacity=".9"/>
<rect x="60" y="338" width="220" height="6" fill="#9B0000"/>
<rect x="60" y="342" width="220" height="3" fill="#FFD700" opacity=".6"/>
<path d="M96 170 Q118 170 130 184 Q140 196 170 198 Q200 196 210 184 Q222 170 244 170 L238 170 Q216 172 206 186 Q194 200 170 202 Q146 200 134 186 Q122 172 102 170Z" fill="#9B0000"/>
<path d="M96 170 Q118 170 130 184 Q140 196 170 198 Q200 196 210 184 Q222 170 244 170" stroke="#FFD700" stroke-width="1.4" fill="none"/>
<text x="170" y="208" font-family="Arial Black,sans-serif" font-size="10" font-weight="900" fill="#FFD700" text-anchor="middle" letter-spacing="2">BEEPBOP</text>
<text x="170" y="280" font-family="Arial Black,sans-serif" font-size="60" font-weight="900" fill="#FFD700" text-anchor="middle" opacity=".95">00</text>
<circle cx="118" cy="298" r="4" fill="#e52222" opacity=".7"/><circle cx="118" cy="298" r="2" fill="#ff8888"/>
<circle cx="170" cy="296" r="6" fill="#FFD700" opacity=".6"/><circle cx="170" cy="296" r="3" fill="#060606"/>
<circle cx="222" cy="298" r="4" fill="#e52222" opacity=".7"/><circle cx="222" cy="298" r="2" fill="#ff8888"/>
<circle cx="100" cy="182" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<circle cx="100" cy="182" r="5" fill="#1a1a2e"/><circle cx="100" cy="182" r="2.5" fill="#e52222" opacity=".8"/>
<rect x="28" y="196" width="40" height="68" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<circle cx="48" cy="268" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="26" y="273" width="44" height="20" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="30" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="42" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="54" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<circle cx="240" cy="182" r="10" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<circle cx="240" cy="182" r="5" fill="#1a1a2e"/><circle cx="240" cy="182" r="2.5" fill="#e52222" opacity=".8"/>
<rect x="272" y="196" width="40" height="68" rx="8" fill="#1a1a2e" stroke="#e52222" stroke-width="1"/>
<circle cx="292" cy="268" r="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="270" y="273" width="44" height="20" rx="7" fill="#2a2a4e" stroke="#e52222" stroke-width="1"/>
<rect x="274" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="286" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="298" y="277" width="8" height="12" rx="3" fill="#1a1a2e" stroke="#e52222" stroke-width=".7"/>
<rect x="60" y="170" width="36" height="50" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="60" y1="218" x2="96" y2="218" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
<rect x="244" y="170" width="36" height="50" fill="#b31515" stroke="#e52222" stroke-width="1"/>
<line x1="244" y1="218" x2="280" y2="218" stroke="#FFD700" stroke-width="1.5" opacity=".85"/>
<rect x="60" y="344" width="220" height="14" rx="5" fill="#080808" stroke="#e52222" stroke-width="1"/>
<path d="M60 357 L78 357 L81 390 L62 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<rect x="78" y="357" width="184" height="33" rx="3" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<path d="M262 357 L280 357 L278 390 L259 390 Z" fill="#080808" stroke="#e52222" stroke-width=".8"/>
<rect x="60" y="390" width="92" height="24" rx="8" fill="#f5f0e8"/>
<path d="M68 396 Q80 389 104 391 Q112 393 115 398 Q107 400 94 399 Q79 398 68 402Z" fill="#e52222" opacity=".9"/>
<path d="M70 402 Q82 399 102 400 Q111 401 115 405 Q104 407 88 406 Q74 405 70 408Z" fill="#FFD700" opacity=".8"/>
<rect x="58" y="408" width="96" height="7" rx="3" fill="#111"/>
<rect x="188" y="390" width="92" height="24" rx="8" fill="#f5f0e8"/>
<path d="M246 396 Q234 389 210 391 Q202 393 199 398 Q207 400 220 399 Q235 398 246 402Z" fill="#e52222" opacity=".9"/>
<path d="M244 402 Q232 399 212 400 Q203 401 199 405 Q210 407 226 406 Q240 405 244 408Z" fill="#FFD700" opacity=".8"/>
<rect x="186" y="408" width="96" height="7" rx="3" fill="#111"/>
</g>
<g class="bb-ball-spin">
  <circle cx="270" cy="235" r="22" fill="#e8621a"/>
  <ellipse cx="270" cy="235" rx="22" ry="9" fill="none" stroke="#1a0a00" stroke-width="1.5"/>
  <line x1="270" y1="213" x2="270" y2="257" stroke="#1a0a00" stroke-width="1.5"/>
  <ellipse cx="270" cy="235" rx="9" ry="22" fill="none" stroke="#1a0a00" stroke-width="1" opacity=".5"/>
</g>
<ellipse cx="270" cy="222" rx="5" ry="3" fill="white" opacity=".25"/>
</svg>`;

// Replace all loader-box spinners with BeepBop
function injectBeepBop() {
  document.querySelectorAll('.loader-box').forEach(function(box) {
    var lt = box.querySelector('.lt');
    var text = lt ? lt.textContent : 'Loading...';
    box.innerHTML = '<div class="bb-loader">'
      + BEEPBOP_SVG_LOADING
      + '<div class="bb-loader-text">' + text + '</div>'
      + '</div>';
  });
}

// Observe DOM for new loader-boxes
var bbObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(m) {
    m.addedNodes.forEach(function(node) {
      if (node.nodeType !== 1) return;
      if (node.classList && node.classList.contains('loader-box')) {
        var lt = node.querySelector('.lt');
        var text = lt ? lt.textContent : 'Loading...';
        node.innerHTML = '<div class="bb-loader">'
          + BEEPBOP_SVG_LOADING
          + '<div class="bb-loader-text">' + text + '</div>'
          + '</div>';
      }
      node.querySelectorAll && node.querySelectorAll('.loader-box').forEach(function(box) {
        if (box.querySelector('.bb-loader')) return;
        var lt = box.querySelector('.lt');
        var text = lt ? lt.textContent : 'Loading...';
        box.innerHTML = '<div class="bb-loader">'
          + BEEPBOP_SVG_LOADING
          + '<div class="bb-loader-text">' + text + '</div>'
          + '</div>';
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  bbObserver.observe(document.body, { childList: true, subtree: true });
  injectBeepBop();

  // Replace logo area with BeepBop static
  var logoArea = document.querySelector('.logo-bb');
  if (logoArea) logoArea.innerHTML = BEEPBOP_SVG_STATIC;
});
