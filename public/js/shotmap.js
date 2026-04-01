// BeepBopProps$ — Shot Map Panel (ESPN/2K Style)

var shotMapOpen = false;
var currentShotPlayer = null;

var TEAM_IDS = {
  'ATL':'1610612737','BOS':'1610612738','BKN':'1610612751','CHA':'1610612766',
  'CHI':'1610612741','CLE':'1610612739','DAL':'1610612742','DEN':'1610612743',
  'DET':'1610612765','GSW':'1610612744','HOU':'1610612745','IND':'1610612754',
  'LAC':'1610612746','LAL':'1610612747','MEM':'1610612763','MIA':'1610612748',
  'MIL':'1610612749','MIN':'1610612750','NOP':'1610612740','NYK':'1610612752',
  'OKC':'1610612760','ORL':'1610612753','PHI':'1610612755','PHX':'1610612756',
  'POR':'1610612757','SAC':'1610612758','SAS':'1610612759','TOR':'1610612761',
  'UTA':'1610612762','WAS':'1610612764',
};

window.openShotMapFromCard = function(btn) {
  window.openShotMap(
    btn.getAttribute('data-name'),
    btn.getAttribute('data-pid'),
    btn.getAttribute('data-team'),
    btn.getAttribute('data-opp'),
    btn.getAttribute('data-stat')
  );
};

window.openShotMap = function(playerName, photoId, team, opponent, statType) {
  currentShotPlayer = { name: playerName, photoId: photoId, team: team, opponent: opponent, statType: statType };
  var panel = document.getElementById('shot-panel');
  var overlay = document.getElementById('shot-overlay');
  if (!panel) return;
  document.getElementById('shot-player-name').textContent = playerName;
  document.getElementById('shot-player-img').src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/' + photoId + '.png';
  document.getElementById('shot-player-sub').textContent = team + (opponent ? ' vs ' + opponent : '') + ' · ' + capStr(statType);
  panel.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  shotMapOpen = true;
  switchShotView('season');
};

window.closeShotMap = function() {
  document.getElementById('shot-panel').classList.remove('open');
  document.getElementById('shot-overlay').classList.remove('show');
  document.body.style.overflow = '';
  shotMapOpen = false;
};

window.switchShotView = function(view) {
  document.querySelectorAll('.shot-tab').forEach(function(t){ t.classList.remove('active'); });
  var tab = document.querySelector('.shot-tab[data-view="'+view+'"]');
  if (tab) tab.classList.add('active');
  loadShotView(view);
};

async function loadShotView(view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');
  canvas.innerHTML = '<div class="shot-loading"><div class="shot-spinner"></div><div style="color:var(--muted);font-size:12px;margin-top:8px">Loading shot data...</div></div>';
  statsEl.innerHTML = '';
  if (!currentShotPlayer) return;
  try {
    var shots = [];
    var oppId = TEAM_IDS[currentShotPlayer.opponent] || '';
    if (view === 'season')   shots = await fetchShots(currentShotPlayer.photoId, null, null);
    else if (view === 'last5')  shots = await fetchShots(currentShotPlayer.photoId, null, 5);
    else if (view === 'last10') shots = await fetchShots(currentShotPlayer.photoId, null, 10);
    else if (view === 'opponent') shots = await fetchShots(currentShotPlayer.photoId, oppId, null);
    else if (view === 'position') shots = await fetchShots(currentShotPlayer.photoId, oppId, null);
    renderShotMap(shots, view);
  } catch(e) {
    renderEstimatedMap(view);
  }
}

async function fetchShots(playerId, oppTeamId, lastN) {
  var url = '/api/nba/shots?playerId=' + playerId + '&season=2025-26';
  if (oppTeamId) url += '&oppTeamId=' + oppTeamId;
  if (lastN) url += '&lastN=' + lastN;
  var controller = new AbortController();
  var timeout = setTimeout(function(){ controller.abort(); }, 8000);
  var r = await fetch(url, { signal: controller.signal });
  clearTimeout(timeout);
  var d = await r.json();
  if (!d.success) throw new Error(d.error);
  return d.shots || [];
}

// ── NBA COURT DIMENSIONS (scaled) ──
// Real NBA: 500 units wide (-250 to 250), 470 units deep
// We render half court: 500 wide, 470 tall in SVG units
// SVG viewBox: "0 0 500 470"
function nbaX(x) { return parseFloat(x) + 250; }
function nbaY(y) { return 470 - (parseFloat(y) + 48); }

function renderShotMap(shots, view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');

  if (!shots || !shots.length) {
    renderEstimatedMap(view);
    return;
  }

  var made   = shots.filter(function(s){ return s.made; });
  var missed = shots.filter(function(s){ return !s.made; });
  var fgPct  = Math.round((made.length / shots.length) * 100);

  // Zone breakdown
  var zones = {};
  shots.forEach(function(s) {
    var z = s.zone || 'Other';
    if (!zones[z]) zones[z] = { made:0, total:0 };
    zones[z].total++;
    if (s.made) zones[z].made++;
  });

  // Render stats bar
  var statsHtml = '<div class="shot-zone-grid">'
    + mkZone(fgPct+'%', 'FG%')
    + mkZone(made.length+'/'+shots.length, 'Made/Att');
  Object.entries(zones).slice(0,5).forEach(function(e) {
    var pct = Math.round((e[1].made/e[1].total)*100);
    var label = e[0].replace('Above the Break ','').replace(' Zone','').replace('Right Side Center','RSC').replace('Left Side Center','LSC').replace('Right Side','Right').replace('Left Side','Left').replace('Center','Mid');
    statsHtml += mkZone(pct+'%', label);
  });
  statsHtml += '</div>';
  statsEl.innerHTML = statsHtml;

  // Build shot dots on court SVG
  var dots = '';
  missed.forEach(function(s) {
    var x = nbaX(s.x).toFixed(1);
    var y = nbaY(s.y).toFixed(1);
    if (y < 0 || y > 470 || x < 0 || x > 500) return;
    dots += '<g opacity="0.75"><line x1="'+(parseFloat(x)-4)+'" y1="'+(parseFloat(y)-4)+'" x2="'+(parseFloat(x)+4)+'" y2="'+(parseFloat(y)+4)+'" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/>'
      + '<line x1="'+(parseFloat(x)+4)+'" y1="'+(parseFloat(y)-4)+'" x2="'+(parseFloat(x)-4)+'" y2="'+(parseFloat(y)+4)+'" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/></g>';
  });
  made.forEach(function(s) {
    var x = nbaX(s.x).toFixed(1);
    var y = nbaY(s.y).toFixed(1);
    if (y < 0 || y > 470 || x < 0 || x > 500) return;
    dots += '<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="#FFD700" opacity="0.88" stroke="#cc8800" stroke-width="0.8"/>';
  });

  canvas.innerHTML = buildCourtSVG(dots);
}

function buildCourtSVG(dots) {
  return '<svg viewBox="0 0 500 470" width="100%" style="display:block;max-width:500px;margin:0 auto;border-radius:8px">'
    + courtFloor()
    + (dots || '')
    + shotLegend()
  + '</svg>';
}

function courtFloor() {
  // ESPN/2K style court — dark wood floor, bright lines
  return ''
  // Court background — hardwood look
  + '<rect width="500" height="470" fill="#1a1008" rx="6"/>'
  + '<rect width="500" height="470" fill="url(#wood)" rx="6" opacity="0.18"/>'
  // Court boundary
  + '<rect x="0" y="0" width="500" height="470" fill="none" stroke="#c8a96e" stroke-width="2"/>'

  // Paint / key — left side open (halfcourt, basket at bottom)
  + '<rect x="170" y="190" width="160" height="280" fill="rgba(229,34,34,0.08)" stroke="#c8a96e" stroke-width="1.5"/>'
  // Inner lane
  + '<rect x="190" y="190" width="120" height="280" fill="none" stroke="#c8a96e" stroke-width="0.8" opacity="0.5"/>'

  // Lane hash marks
  + '<line x1="170" y1="278" x2="182" y2="278" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="278" x2="330" y2="278" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="308" x2="182" y2="308" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="308" x2="330" y2="308" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="338" x2="182" y2="338" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="338" x2="330" y2="338" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="368" x2="182" y2="368" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="368" x2="330" y2="368" stroke="#c8a96e" stroke-width="1.5"/>'

  // Free throw circle
  + '<ellipse cx="250" cy="190" rx="60" ry="60" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'
  // Top half of FT circle (dashed)
  + '<path d="M190 190 A60 60 0 0 1 310 190" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>'

  // Basket
  + '<circle cx="250" cy="422" r="9" fill="none" stroke="#FF6B00" stroke-width="2.5"/>'
  + '<circle cx="250" cy="422" r="3" fill="#FF6B00"/>'
  // Backboard
  + '<rect x="220" y="435" width="60" height="4" rx="1" fill="#c8a96e" stroke="#888" stroke-width="0.5"/>'
  // Backboard support
  + '<line x1="250" y1="431" x2="250" y2="435" stroke="#c8a96e" stroke-width="1.5"/>'

  // Restricted area arc
  + '<path d="M226 422 A24 24 0 0 1 274 422" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'

  // 3PT arc — NBA regulation
  + '<path d="M30 422 L30 348 A222 222 0 0 1 470 348 L470 422" fill="none" stroke="#c8a96e" stroke-width="2"/>'
  // Corner 3 lines
  + '<line x1="30" y1="348" x2="30" y2="470" stroke="#c8a96e" stroke-width="2"/>'
  + '<line x1="470" y1="348" x2="470" y2="470" stroke="#c8a96e" stroke-width="2"/>'

  // Mid-court line
  + '<line x1="0" y1="0" x2="500" y2="0" stroke="#c8a96e" stroke-width="2"/>'
  // Center circle (half)
  + '<path d="M190 0 A60 60 0 0 0 310 0" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'

  // Zone labels (faint, like ESPN)
  + '<text x="250" y="120" font-family="Arial,sans-serif" font-size="9" fill="#c8a96e" text-anchor="middle" opacity="0.4" letter-spacing="1">TOP OF ARC</text>'
  + '<text x="60" y="320" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4" transform="rotate(-90,60,320)">CORNER 3</text>'
  + '<text x="440" y="320" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4" transform="rotate(90,440,320)">CORNER 3</text>'
  + '<text x="130" y="260" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4">MID</text>'
  + '<text x="370" y="260" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4">MID</text>'
  + '<text x="250" y="390" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4">PAINT</text>';
}

function shotLegend() {
  return '<g>'
    + '<circle cx="16" cy="16" r="5" fill="#FFD700" opacity="0.9" stroke="#cc8800" stroke-width="0.8"/>'
    + '<text x="25" y="20" font-family="Arial,sans-serif" font-size="10" fill="#FFD700" opacity="0.85">Made</text>'
    + '<line x1="74" y1="12" x2="82" y2="20" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/>'
    + '<line x1="82" y1="12" x2="74" y2="20" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/>'
    + '<text x="88" y="20" font-family="Arial,sans-serif" font-size="10" fill="#ff4444" opacity="0.85">Missed</text>'
  + '</g>';
}

function renderEstimatedMap(view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');

  // Realistic zone data
  var zoneData = [
    { x:250, y:400, r:52, pct:68, label:'Restricted',  made:112, total:165 },
    { x:250, y:320, r:38, pct:44, label:'Paint (Non-RA)', made:42, total:96 },
    { x:250, y:200, r:42, pct:38, label:'Mid (Top)',   made:38, total:100 },
    { x:130, y:260, r:34, pct:40, label:'Mid (Left)',  made:28, total:70  },
    { x:370, y:260, r:34, pct:41, label:'Mid (Right)', made:29, total:71  },
    { x:250, y:88,  r:44, pct:36, label:'3PT (Top)',   made:62, total:172 },
    { x:100, y:160, r:34, pct:38, label:'3PT (Left)',  made:41, total:108 },
    { x:400, y:160, r:34, pct:37, label:'3PT (Right)', made:40, total:108 },
    { x:30,  y:390, r:28, pct:42, label:'Corner L',    made:22, total:52  },
    { x:470, y:390, r:28, pct:43, label:'Corner R',    made:23, total:53  },
  ];

  var totalMade  = zoneData.reduce(function(a,z){ return a+z.made; },0);
  var totalShots = zoneData.reduce(function(a,z){ return a+z.total; },0);
  var overallPct = Math.round(totalMade/totalShots*100);

  statsEl.innerHTML = '<div class="shot-zone-grid">'
    + mkZone(overallPct+'%','FG%')
    + mkZone(totalMade+'/'+totalShots,'Made/Att')
    + mkZone('68%','Paint')
    + mkZone('39%','Mid-Range')
    + mkZone('37%','3PT')
    + mkZone('43%','Corners')
    + '</div>'
    + '<div style="font-size:10px;color:var(--muted);text-align:center;padding:4px 0 2px">📊 Zone estimates — live data unavailable</div>';

  var zones = '';
  zoneData.forEach(function(z) {
    var hot  = z.pct >= 55;
    var warm = z.pct >= 43;
    var cold = z.pct < 35;
    var col  = hot ? '#FFD700' : warm ? '#ff8c00' : cold ? '#4466cc' : '#e52222';
    var alpha = 0.12 + (z.pct/100)*0.38;
    zones += '<circle cx="'+z.x+'" cy="'+z.y+'" r="'+z.r+'" fill="'+col+'" opacity="'+alpha.toFixed(2)+'"/>';
    zones += '<text x="'+z.x+'" y="'+(z.y-6)+'" font-family="Arial Black,sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="900">'+z.pct+'%</text>';
    zones += '<text x="'+z.x+'" y="'+(z.y+8)+'" font-family="Arial,sans-serif" font-size="9" fill="white" text-anchor="middle" opacity="0.7">'+z.made+'/'+z.total+'</text>';
  });

  canvas.innerHTML = buildCourtSVG(zones);
}

function mkZone(val, lbl) {
  return '<div class="shot-zone-item"><div class="szv">'+val+'</div><div class="szl">'+lbl+'</div></div>';
}

function capStr(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ''; }

window.openShotMapFromCard = function(btn) {
  window.openShotMap(
    btn.getAttribute('data-name'),
    btn.getAttribute('data-pid'),
    btn.getAttribute('data-team'),
    btn.getAttribute('data-opp'),
    btn.getAttribute('data-stat')
  );
};

document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('shot-overlay');
  if (overlay) overlay.addEventListener('click', closeShotMap);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && shotMapOpen) closeShotMap(); });
});
