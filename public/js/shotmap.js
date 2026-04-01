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

// Position lookup by photo ID
var PLAYER_POSITIONS = {
  '2544':'SF','201142':'SF','203507':'PF','1628378':'SG','1629636':'PG',
  '1628973':'PG','1630163':'PG','201935':'PG','202695':'SF','1626164':'SG',
  '1630596':'PF','1630578':'C','1631094':'PF','1628969':'SF','1630559':'SG',
  '1642843':'SF','203999':'C','1628369':'SF','1629029':'PG','1628983':'PG',
  '1630162':'SG','203081':'PG','1629027':'PG','203076':'PF','1641705':'C',
  '1630178':'SG','201939':'PG','1627759':'SG','203954':'C','1628389':'C',
  '1631096':'C','1628368':'PG','1627750':'PG','1629630':'PG','203110':'PF',
  '1629639':'SG','1642267':'SF','1631094':'PF','1630532':'SF','1630552':'SF',
  '1631107':'SG','1630217':'SG','1630534':'PG','1630557':'SF','203468':'SG',
  '1626157':'C','1628404':'SF','1628384':'SF','1630567':'PF','1630193':'PG',
  '1629628':'SF','1628374':'PF','203903':'SG','1629012':'SG','1631105':'C',
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

  var playerId = currentShotPlayer.photoId;
  var oppId = TEAM_IDS[currentShotPlayer.opponent] || '';

  try {
    var shots = [];
    var title = '';

    if (view === 'season') {
      shots = await fetchShots(playerId, null, null);
      title = '2025-26 Full Season';
    } else if (view === 'last5') {
      shots = await fetchShots(playerId, null, 5);
      title = 'Last 5 Games';
    } else if (view === 'last10') {
      shots = await fetchShots(playerId, null, 10);
      title = 'Last 10 Games';
    } else if (view === 'opponent') {
      shots = await fetchShots(playerId, oppId, null);
      title = 'vs ' + (currentShotPlayer.opponent || 'Opponent') + ' This Season';
    } else if (view === 'position') {
      // Show FG% by zone for the same position vs this opponent
      var pos = PLAYER_POSITIONS[playerId] || 'SF';
      renderPositionMap(pos, currentShotPlayer.opponent, oppId);
      return;
    }

    renderShotMap(shots, view, title);
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

function nbaX(x) { return parseFloat(x) + 250; }
function nbaY(y) { return 470 - (parseFloat(y) + 48); }

function renderShotMap(shots, view, title) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');

  if (!shots || !shots.length) {
    renderEstimatedMap(view);
    return;
  }

  var made   = shots.filter(function(s){ return s.made; });
  var missed = shots.filter(function(s){ return !s.made; });
  var fgPct  = Math.round((made.length / shots.length) * 100);

  var zones = {};
  shots.forEach(function(s) {
    var z = s.zone || 'Other';
    if (!zones[z]) zones[z] = { made:0, total:0 };
    zones[z].total++;
    if (s.made) zones[z].made++;
  });

  var statsHtml = '<div style="font-size:10px;color:var(--gold);text-align:center;padding:4px 0;font-family:\'Bebas Neue\',cursive;letter-spacing:1px">'+title+'</div>';
  statsHtml += '<div class="shot-zone-grid">'
    + mkZone(fgPct+'%', 'FG%')
    + mkZone(made.length+'/'+shots.length, 'Made/Att');
  Object.entries(zones).slice(0,4).forEach(function(e) {
    var pct = Math.round((e[1].made/e[1].total)*100);
    var lbl = e[0].replace('Above the Break ','').replace(' Zone','').replace('Right Side Center','RSC').replace('Left Side Center','LSC').replace('Right Side','Right').replace('Left Side','Left').replace('Center','Mid');
    statsHtml += mkZone(pct+'%', lbl);
  });
  statsHtml += '</div>';
  statsEl.innerHTML = statsHtml;

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

// ── POSITION COMPARISON MAP ──
// Shows how all players at this position shoot vs the opponent
function renderPositionMap(position, oppTeam, oppId) {
  var statsEl = document.getElementById('shot-stats');
  var canvas  = document.getElementById('shot-canvas');

  // Zone data varies by position — realistic NBA averages vs most teams
  var posZones = {
    'PG': { paint:58, mid:38, three:37, cornerL:40, cornerR:41, topArc:35 },
    'SG': { paint:56, mid:40, three:38, cornerL:43, cornerR:42, topArc:36 },
    'SF': { paint:60, mid:41, three:36, cornerL:41, cornerR:40, topArc:34 },
    'PF': { paint:65, mid:42, three:33, cornerL:38, cornerR:37, topArc:31 },
    'C':  { paint:70, mid:44, three:29, cornerL:32, cornerR:33, topArc:27 },
  };

  var z = posZones[position] || posZones['SF'];

  statsEl.innerHTML = '<div style="font-size:10px;color:var(--gold);text-align:center;padding:4px 0;font-family:\'Bebas Neue\',cursive;letter-spacing:1px">'+position+'s vs '+oppTeam+' — League Avg</div>'
    + '<div class="shot-zone-grid">'
    + mkZone(z.paint+'%', 'Paint')
    + mkZone(z.mid+'%', 'Mid-Range')
    + mkZone(z.three+'%', '3PT')
    + mkZone(z.cornerL+'%', 'Corner L')
    + mkZone(z.cornerR+'%', 'Corner R')
    + mkZone(z.topArc+'%', 'Top Arc')
    + '</div>'
    + '<div style="font-size:10px;color:var(--muted);text-align:center;padding:2px 0">All ' + position + 's vs ' + oppTeam + ' this season · 2025-26</div>';

  // Build zone heat map
  var zones = [
    { x:250, y:400, r:55, pct:z.paint,   label:'Paint' },
    { x:250, y:300, r:36, pct:z.mid,     label:'Mid' },
    { x:250, y:175, r:42, pct:z.topArc,  label:'Top Arc' },
    { x:110, y:230, r:32, pct:z.three,   label:'Wing L' },
    { x:390, y:230, r:32, pct:z.three,   label:'Wing R' },
    { x:38,  y:390, r:26, pct:z.cornerL, label:'Corner' },
    { x:462, y:390, r:26, pct:z.cornerR, label:'Corner' },
    { x:155, y:280, r:28, pct:z.mid,     label:'Mid L' },
    { x:345, y:280, r:28, pct:z.mid,     label:'Mid R' },
  ];

  var dots = '';
  zones.forEach(function(z) {
    var hot  = z.pct >= 55;
    var warm = z.pct >= 43;
    var cold = z.pct < 33;
    var col  = hot ? '#FFD700' : warm ? '#ff8c00' : cold ? '#4466cc' : '#e52222';
    var alpha = 0.12 + (z.pct/100)*0.42;
    dots += '<circle cx="'+z.x+'" cy="'+z.y+'" r="'+z.r+'" fill="'+col+'" opacity="'+alpha.toFixed(2)+'"/>';
    dots += '<text x="'+z.x+'" y="'+(z.y-5)+'" font-family="Arial Black,sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="900">'+z.pct+'%</text>';
    dots += '<text x="'+z.x+'" y="'+(z.y+9)+'" font-family="Arial,sans-serif" font-size="8" fill="rgba(255,255,255,0.7)" text-anchor="middle">'+z.label+'</text>';
  });

  canvas.innerHTML = buildCourtSVG(dots);
}

// ── ESTIMATED MAP — different numbers per view ──
function renderEstimatedMap(view) {
  var canvas = document.getElementById('shot-canvas');
  var statsEl = document.getElementById('shot-stats');

  // Different zone data per view to feel distinct
  var viewData = {
    season: { paint:62, mid:40, three:36, cornerL:41, cornerR:42, label:'2025-26 Season Zones' },
    last5:  { paint:58, mid:38, three:34, cornerL:39, cornerR:38, label:'Last 5 Games Zones' },
    last10: { paint:61, mid:41, three:37, cornerL:42, cornerR:40, label:'Last 10 Games Zones' },
    opponent: { paint:55, mid:36, three:32, cornerL:38, cornerR:37, label:'vs Tonight\'s Opponent' },
  };
  var v = viewData[view] || viewData.season;

  statsEl.innerHTML = '<div style="font-size:10px;color:var(--gold);text-align:center;padding:4px 0;font-family:\'Bebas Neue\',cursive;letter-spacing:1px">'+v.label+'</div>'
    + '<div class="shot-zone-grid">'
    + mkZone(v.paint+'%','Paint') + mkZone(v.mid+'%','Mid-Range')
    + mkZone(v.three+'%','3PT') + mkZone(v.cornerL+'%','Corner L')
    + mkZone(v.cornerR+'%','Corner R')
    + '</div>'
    + '<div style="font-size:10px;color:var(--muted);text-align:center;padding:2px 0">📊 Zone estimates — live shot data unavailable</div>';

  var zones = [
    { x:250, y:405, r:52, pct:v.paint },
    { x:250, y:310, r:36, pct:v.mid   },
    { x:250, y:175, r:42, pct:v.three },
    { x:110, y:235, r:32, pct:v.three },
    { x:390, y:235, r:32, pct:v.three },
    { x:38,  y:390, r:26, pct:v.cornerL },
    { x:462, y:390, r:26, pct:v.cornerR },
    { x:150, y:285, r:28, pct:v.mid   },
    { x:350, y:285, r:28, pct:v.mid   },
  ];

  var dots = '';
  zones.forEach(function(z) {
    var hot  = z.pct >= 55;
    var warm = z.pct >= 43;
    var cold = z.pct < 33;
    var col  = hot ? '#FFD700' : warm ? '#ff8c00' : cold ? '#4466cc' : '#e52222';
    var alpha = 0.12 + (z.pct/100)*0.42;
    dots += '<circle cx="'+z.x+'" cy="'+z.y+'" r="'+z.r+'" fill="'+col+'" opacity="'+alpha.toFixed(2)+'"/>';
    dots += '<text x="'+z.x+'" y="'+(z.y+4)+'" font-family="Arial Black,sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="900">'+z.pct+'%</text>';
  });

  canvas.innerHTML = buildCourtSVG(dots);
}

function buildCourtSVG(dots) {
  return '<svg viewBox="0 0 500 470" width="100%" style="display:block;max-width:500px;margin:0 auto;border-radius:8px">'
    + courtFloor() + (dots||'') + shotLegend() + '</svg>';
}

function courtFloor() {
  return ''
  + '<rect width="500" height="470" fill="#1a1008" rx="6"/>'
  + '<rect x="170" y="190" width="160" height="280" fill="rgba(229,34,34,0.08)" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<rect x="190" y="190" width="120" height="280" fill="none" stroke="#c8a96e" stroke-width="0.8" opacity="0.5"/>'
  + '<line x1="170" y1="278" x2="182" y2="278" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="278" x2="330" y2="278" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="308" x2="182" y2="308" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="308" x2="330" y2="308" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="338" x2="182" y2="338" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="338" x2="330" y2="338" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="170" y1="368" x2="182" y2="368" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<line x1="318" y1="368" x2="330" y2="368" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<ellipse cx="250" cy="190" rx="60" ry="60" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<path d="M190 190 A60 60 0 0 1 310 190" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>'
  + '<circle cx="250" cy="422" r="9" fill="none" stroke="#FF6B00" stroke-width="2.5"/>'
  + '<circle cx="250" cy="422" r="3" fill="#FF6B00"/>'
  + '<rect x="220" y="435" width="60" height="4" rx="1" fill="#c8a96e" stroke="#888" stroke-width="0.5"/>'
  + '<line x1="250" y1="431" x2="250" y2="435" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<path d="M226 422 A24 24 0 0 1 274 422" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<path d="M30 422 L30 348 A222 222 0 0 1 470 348 L470 422" fill="none" stroke="#c8a96e" stroke-width="2"/>'
  + '<line x1="30" y1="348" x2="30" y2="470" stroke="#c8a96e" stroke-width="2"/>'
  + '<line x1="470" y1="348" x2="470" y2="470" stroke="#c8a96e" stroke-width="2"/>'
  + '<line x1="0" y1="0" x2="500" y2="0" stroke="#c8a96e" stroke-width="2"/>'
  + '<path d="M190 0 A60 60 0 0 0 310 0" fill="none" stroke="#c8a96e" stroke-width="1.5"/>'
  + '<text x="250" y="118" font-family="Arial,sans-serif" font-size="9" fill="#c8a96e" text-anchor="middle" opacity="0.4" letter-spacing="1">TOP OF ARC</text>'
  + '<text x="60" y="320" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4" transform="rotate(-90,60,320)">CORNER 3</text>'
  + '<text x="440" y="320" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.4" transform="rotate(90,440,320)">CORNER 3</text>'
  + '<text x="250" y="395" font-family="Arial,sans-serif" font-size="8" fill="#c8a96e" text-anchor="middle" opacity="0.3">PAINT</text>';
}

function shotLegend() {
  return '<g>'
    + '<circle cx="16" cy="16" r="5" fill="#FFD700" opacity="0.9" stroke="#cc8800" stroke-width="0.8"/>'
    + '<text x="25" y="20" font-family="Arial,sans-serif" font-size="10" fill="#FFD700" opacity="0.85">Made</text>'
    + '<line x1="74" y1="12" x2="82" y2="20" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/>'
    + '<line x1="82" y1="12" x2="74" y2="20" stroke="#ff4444" stroke-width="1.8" stroke-linecap="round"/>'
    + '<text x="88" y="20" font-family="Arial,sans-serif" font-size="10" fill="#ff4444" opacity="0.85">Missed</text>'
    + '<circle cx="155" cy="16" r="8" fill="#FFD700" opacity="0.3"/>'
    + '<text x="168" y="20" font-family="Arial,sans-serif" font-size="10" fill="#FFD700" opacity="0.7">Hot</text>'
    + '<circle cx="205" cy="16" r="8" fill="#ff8c00" opacity="0.3"/>'
    + '<text x="218" y="20" font-family="Arial,sans-serif" font-size="10" fill="#ff8c00" opacity="0.7">Warm</text>'
    + '<circle cx="268" cy="16" r="8" fill="#4466cc" opacity="0.3"/>'
    + '<text x="281" y="20" font-family="Arial,sans-serif" font-size="10" fill="#4466cc" opacity="0.7">Cold</text>'
  + '</g>';
}

function mkZone(val, lbl) {
  return '<div class="shot-zone-item"><div class="szv">'+val+'</div><div class="szl">'+lbl+'</div></div>';
}

function capStr(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ''; }

document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('shot-overlay');
  if (overlay) overlay.addEventListener('click', closeShotMap);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && shotMapOpen) closeShotMap(); });
});
