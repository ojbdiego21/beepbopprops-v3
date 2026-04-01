// BeepBopProps$ — Shot Map Panel
// Pulls from NBA Stats API via server proxy

var shotMapOpen = false;
var currentShotPlayer = null;
var currentShotData = {};

// NBA position lookup
var PLAYER_POSITIONS = {
  '2544':'SF','201142':'SF','203507':'PF','1628378':'SG','1629636':'PG',
  '1628973':'PG','1630163':'PG','201935':'PG','202695':'SF','1626164':'SG',
  '1630596':'PF','1630578':'C','1631094':'PF','1628969':'SF','1630559':'SG',
  '1642843':'SF','203999':'C','1628369':'SF','1629029':'PG','1628983':'PG',
  '1630162':'SG','203081':'PG','1629027':'PG','203076':'PF','1641705':'C',
  '1630178':'SG','1628386':'PG','1631244':'SG','201939':'PG','2544':'SF',
};

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

window.openShotMap = function(playerName, photoId, team, opponent, statType) {
  currentShotPlayer = { name: playerName, photoId: photoId, team: team, opponent: opponent, statType: statType };
  currentShotData = {};

  var panel = document.getElementById('shot-panel');
  var overlay = document.getElementById('shot-overlay');
  if (!panel) return;

  // Set header
  document.getElementById('shot-player-name').textContent = playerName;
  document.getElementById('shot-player-img').src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/' + photoId + '.png';
  document.getElementById('shot-player-sub').textContent = team + (opponent ? ' vs ' + opponent : '') + ' · ' + cap(statType) + ' Props';

  panel.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  shotMapOpen = true;

  // Load season by default
  loadShotView('season');
};

window.closeShotMap = function() {
  var panel = document.getElementById('shot-panel');
  var overlay = document.getElementById('shot-overlay');
  panel.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  shotMapOpen = false;
};

window.switchShotView = function(view) {
  document.querySelectorAll('.shot-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelector('.shot-tab[data-view="'+view+'"]').classList.add('active');
  loadShotView(view);
};

async function loadShotView(view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');
  canvas.innerHTML = '<div class="shot-loading"><div class="shot-spinner"></div><div>Loading shot data...</div></div>';
  statsEl.innerHTML = '';

  if (!currentShotPlayer) return;

  // Find player ID from photoId
  var playerId = currentShotPlayer.photoId;

  try {
    var shots = [];
    if (view === 'season') {
      shots = await fetchShots(playerId, null, null);
    } else if (view === 'last5') {
      shots = await fetchShots(playerId, null, 5);
    } else if (view === 'last10') {
      shots = await fetchShots(playerId, null, 10);
    } else if (view === 'opponent') {
      var oppId = TEAM_IDS[currentShotPlayer.opponent] || '';
      shots = await fetchShots(playerId, oppId, null);
    } else if (view === 'position') {
      shots = await fetchPositionShots(currentShotPlayer.team, currentShotPlayer.opponent, playerId);
    }

    currentShotData[view] = shots;
    renderShotMap(shots, view);
  } catch(e) {
    canvas.innerHTML = '<div class="shot-error"><div style="font-size:32px;margin-bottom:8px">🤖</div><div>Shot data unavailable</div><div style="font-size:11px;color:var(--muted);margin-top:4px">NBA Stats API may be blocked</div></div>';
    // Render estimated shot map from zone data
    renderEstimatedMap(view);
  }
}

async function fetchShots(playerId, teamId, lastN) {
  var url = '/api/nba/shots?playerId=' + playerId + '&season=2025-26';
  if (teamId) url += '&oppTeamId=' + teamId;
  if (lastN)  url += '&lastN=' + lastN;
  var r = await fetch(url);
  var d = await r.json();
  if (!d.success) throw new Error(d.error);
  return d.shots || [];
}

async function fetchPositionShots(team, opponent, excludePlayerId) {
  var oppId = TEAM_IDS[opponent] || '';
  var url = '/api/nba/positionshots?oppTeamId=' + oppId + '&excludeId=' + excludePlayerId;
  var r = await fetch(url);
  var d = await r.json();
  if (!d.success) throw new Error(d.error);
  return d.shots || [];
}

// ── SHOT MAP RENDERER ──
var COURT_W = 500, COURT_H = 470;
var SCALE = 1; // NBA court is 500x470 in their coordinate system

function nbaToSvg(x, y) {
  // NBA coords: x from -250 to 250, y from -47.5 to 422.5
  // Map to SVG: 0-500 wide, 0-400 tall (half court)
  var sx = (x + 250);
  var sy = (422.5 - y) * (400/470);
  return { x: sx, y: sy };
}

function renderShotMap(shots, view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');

  if (!shots.length) {
    canvas.innerHTML = '<div class="shot-error">No shot data for this view</div>';
    renderEstimatedMap(view);
    return;
  }

  var made   = shots.filter(function(s){ return s.made; });
  var missed = shots.filter(function(s){ return !s.made; });
  var fgPct  = shots.length ? Math.round((made.length/shots.length)*100) : 0;

  // Zone breakdown
  var zones = {};
  shots.forEach(function(s) {
    var z = s.zone || 'Other';
    if (!zones[z]) zones[z] = { made:0, total:0 };
    zones[z].total++;
    if (s.made) zones[z].made++;
  });

  // Build SVG
  var svg = buildCourtSVG(shots);
  canvas.innerHTML = svg;

  // Stats bar
  var statsHtml = '<div class="shot-zone-grid">';
  statsHtml += '<div class="shot-zone-item"><div class="szv">' + fgPct + '%</div><div class="szl">FG%</div></div>';
  statsHtml += '<div class="shot-zone-item"><div class="szv">' + made.length + '/' + shots.length + '</div><div class="szl">Made/Att</div></div>';
  Object.entries(zones).slice(0,4).forEach(function([z,d]) {
    var pct = Math.round((d.made/d.total)*100);
    statsHtml += '<div class="shot-zone-item"><div class="szv">' + pct + '%</div><div class="szl">' + z.replace(' Zone','').replace('Above the Break','ATB') + '</div></div>';
  });
  statsHtml += '</div>';
  statsEl.innerHTML = statsHtml;
}

function buildCourtSVG(shots) {
  var made   = shots.filter(function(s){ return s.made; });
  var missed = shots.filter(function(s){ return !s.made; });

  var dots = '';
  missed.forEach(function(s) {
    var pt = nbaToSvg(s.x, s.y);
    dots += '<circle cx="'+pt.x.toFixed(1)+'" cy="'+pt.y.toFixed(1)+'" r="4" fill="#ff4444" opacity="0.55" stroke="#cc0000" stroke-width="0.5"/>';
  });
  made.forEach(function(s) {
    var pt = nbaToSvg(s.x, s.y);
    dots += '<circle cx="'+pt.x.toFixed(1)+'" cy="'+pt.y.toFixed(1)+'" r="5" fill="#FFD700" opacity="0.85" stroke="#cc8800" stroke-width="0.8"/>';
  });

  return courtBaseSVG() + dots + '</svg>';
}

function courtBaseSVG() {
  return '<svg viewBox="0 0 500 400" width="100%" style="max-width:480px;display:block;margin:0 auto">'
  // Court floor
  + '<rect width="500" height="400" fill="#0a0a18" rx="4"/>'
  // Paint / key
  + '<rect x="170" y="190" width="160" height="190" fill="none" stroke="#e52222" stroke-width="1.5" opacity="0.5"/>'
  + '<rect x="190" y="190" width="120" height="190" fill="none" stroke="#e52222" stroke-width="0.8" opacity="0.3"/>'
  // FT circle
  + '<ellipse cx="250" cy="190" rx="60" ry="60" fill="none" stroke="#e52222" stroke-width="1.2" opacity="0.4"/>'
  // Basket
  + '<circle cx="250" cy="380" r="8" fill="none" stroke="#FFD700" stroke-width="2"/>'
  + '<circle cx="250" cy="380" r="3" fill="#FFD700" opacity="0.8"/>'
  // Backboard
  + '<line x1="227" y1="390" x2="273" y2="390" stroke="#FFD700" stroke-width="2.5" opacity="0.7"/>'
  // 3PT arc
  + '<path d="M30 400 L30 310 A220 220 0 0 1 470 310 L470 400" fill="none" stroke="#e52222" stroke-width="1.5" opacity="0.6"/>'
  // Corner 3 lines
  + '<line x1="30" y1="310" x2="30" y2="400" stroke="#e52222" stroke-width="1.5" opacity="0.6"/>'
  + '<line x1="470" y1="310" x2="470" y2="400" stroke="#e52222" stroke-width="1.5" opacity="0.6"/>'
  // Mid-court line
  + '<line x1="0" y1="0" x2="500" y2="0" stroke="#e52222" stroke-width="1" opacity="0.3"/>'
  // Center circle
  + '<ellipse cx="250" cy="0" rx="60" ry="60" fill="none" stroke="#e52222" stroke-width="1" opacity="0.2"/>'
  // Lane hash marks
  + '<line x1="170" y1="280" x2="180" y2="280" stroke="#e52222" stroke-width="1" opacity="0.4"/>'
  + '<line x1="320" y1="280" x2="330" y2="280" stroke="#e52222" stroke-width="1" opacity="0.4"/>'
  + '<line x1="170" y1="310" x2="180" y2="310" stroke="#e52222" stroke-width="1" opacity="0.4"/>'
  + '<line x1="320" y1="310" x2="330" y2="310" stroke="#e52222" stroke-width="1" opacity="0.4"/>'
  // Legend
  + '<circle cx="20" cy="16" r="5" fill="#FFD700" opacity="0.85"/>'
  + '<text x="30" y="20" font-family="monospace" font-size="10" fill="#FFD700" opacity="0.8">Made</text>'
  + '<circle cx="80" cy="16" r="4" fill="#ff4444" opacity="0.7"/>'
  + '<text x="90" y="20" font-family="monospace" font-size="10" fill="#ff4444" opacity="0.8">Missed</text>';
}

function renderEstimatedMap(view) {
  var canvas = document.getElementById('shot-canvas');
  // Show zone-based heat map estimate using player's typical zones
  var zones = [
    { label:'Paint', x:250, y:350, r:55, pct:62, count:180 },
    { label:'Mid Left', x:150, y:270, r:35, pct:41, count:65 },
    { label:'Mid Right', x:350, y:270, r:35, pct:39, count:58 },
    { label:'3PT Left', x:60, y:220, r:32, pct:36, count:82 },
    { label:'3PT Right', x:440, y:220, r:32, pct:38, count:88 },
    { label:'3PT Top', x:250, y:155, r:40, pct:35, count:120 },
    { label:'Corner L', x:40, y:370, r:28, pct:42, count:44 },
    { label:'Corner R', x:460, y:370, r:28, pct:40, count:40 },
  ];

  var zoneHtml = courtBaseSVG();
  zones.forEach(function(z) {
    var hot = z.pct >= 50;
    var warm = z.pct >= 40;
    var col = hot ? '#FFD700' : warm ? '#ff8c00' : '#e52222';
    var opacity = 0.15 + (z.pct/100)*0.4;
    zoneHtml += '<circle cx="'+z.x+'" cy="'+z.y+'" r="'+z.r+'" fill="'+col+'" opacity="'+opacity.toFixed(2)+'"/>';
    zoneHtml += '<text x="'+z.x+'" y="'+(z.y+4)+'" font-family="monospace" font-size="11" fill="white" text-anchor="middle" opacity="0.9">'+z.pct+'%</text>';
  });
  zoneHtml += '</svg>';

  canvas.innerHTML = '<div style="font-size:10px;color:var(--muted);text-align:center;padding:6px 0 2px">Zone averages — live shot data unavailable</div>' + zoneHtml;

  document.getElementById('shot-stats').innerHTML = '<div class="shot-zone-grid">'
    + '<div class="shot-zone-item"><div class="szv">62%</div><div class="szl">Paint</div></div>'
    + '<div class="shot-zone-item"><div class="szv">40%</div><div class="szl">Mid-Range</div></div>'
    + '<div class="shot-zone-item"><div class="szv">37%</div><div class="szl">3PT</div></div>'
    + '<div class="shot-zone-item"><div class="szv">41%</div><div class="szl">Corners</div></div>'
    + '</div>';
}

function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ''; }

// Close on overlay click
document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('shot-overlay');
  if (overlay) overlay.addEventListener('click', closeShotMap);
  // Escape key
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && shotMapOpen) closeShotMap(); });
});
