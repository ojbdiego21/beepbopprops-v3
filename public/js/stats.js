// BeepBopStats — Game logs via BDL API + AI analysis for StatMuse-style questions

var PLAYER_IDS = {
  // 2025 Draft class
  'kon knueppel':1642851,'kon':1642851,'knueppel':1642851,
  'dylan harper':1642844,'harper':1642844,
  'vj edgecombe':1642845,'edgecombe':1642845,'vj':1642845,
  'ace bailey':1642846,'ace':1642846,'bailey':1642846,
  'jeremiah fears':1642847,'fears':1642847,
  'tre johnson':1642848,
  'nolan traore':1642849,'traore':1642849,
  'derik queen':1642852,'queen':1642852,
  'devin carter':1642853,
  'egor demin':1642856,'demin':1642856,
  'maxime raynaud':1642857,'raynaud':1642857,
  'cooper flagg':1642843,'flagg':1642843,
  'reed sheppard':1641844,'sheppard':1641844,
  'cody williams':1642262,
  'taylor hendricks':1642269,'hendricks':1642269,
  "ja'kobe walter":1642270,'jakobe walter':1642270,
  'kyle filipowski':1642271,'filipowski':1642271,
  'walter clayton':1642383,
  // Stars
  'lebron james':2544,'lebron':2544,
  'stephen curry':201939,'steph curry':201939,'curry':201939,
  'giannis antetokounmpo':203507,'giannis':203507,
  'nikola jokic':203999,'jokic':203999,
  'jayson tatum':1628369,'tatum':1628369,
  'luka doncic':1629029,'luka':1629029,
  'shai gilgeous-alexander':1628983,'sga':1628983,'shai':1628983,
  'donovan mitchell':1628378,'mitchell':1628378,
  'tyrese maxey':1630178,'maxey':1630178,
  'victor wembanyama':1641705,'wembanyama':1641705,'wemby':1641705,
  'devin booker':1626164,'booker':1626164,
  'austin reaves':1630559,'reaves':1630559,
  'anthony edwards':1630162,'ant edwards':1630162,'ant':1630162,
  'jaylen brown':1627759,
  'joel embiid':203954,'embiid':203954,
  'jalen brunson':1628973,'brunson':1628973,
  'alperen sengun':1630578,'sengun':1630578,
  'kevin durant':201142,'kd':201142,'durant':201142,
  'lamelo ball':1630163,'lamelo':1630163,
  'trae young':1629027,'trae':1629027,
  'darius garland':1629636,'garland':1629636,
  'james harden':201935,'harden':201935,
  'damian lillard':203081,'dame':203081,'lillard':203081,
  'evan mobley':1630596,'mobley':1630596,
  'bam adebayo':1628389,'bam':1628389,
  'tyrese haliburton':1630169,'haliburton':1630169,
  'anthony davis':203076,'ad':203076,'davis':203076,
  'kawhi leonard':202695,'kawhi':202695,
  'ja morant':1629630,'ja':1629630,'morant':1629630,
  "de'aaron fox":1628368,'fox':1628368,
  'karl-anthony towns':1626157,'towns':1626157,'kat':1626157,
  'zion williamson':1629627,'zion':1629627,
  'paolo banchero':1631094,'banchero':1631094,
  'jalen johnson':1630552,
  'dyson daniels':1630700,'dyson':1630700,
  'onyeka okongwu':1630168,'okongwu':1630168,
  'jonathan kuminga':1630228,'kuminga':1630228,
  'cj mccollum':203468,'mccollum':203468,
  'desmond bane':1630217,'bane':1630217,
  'jalen suggs':1630591,'suggs':1630591,
  'franz wagner':1630532,'franz':1630532,
  'chet holmgren':1631096,'chet':1631096,
  'tyler herro':1629639,'herro':1629639,
  'scottie barnes':1630567,'barnes':1630567,
  'mikal bridges':1628969,'bridges':1628969,
  'pascal siakam':1627783,'siakam':1627783,
  'julius randle':203944,'randle':203944,
  'jakob poeltl':1627751,'poeltl':1627751,
  'payton pritchard':1630202,'pritchard':1630202,
  'brice sensabaugh':1641729,'sensabaugh':1641729,
  'brandon ingram':1627742,'ingram':1627742,
  'ayo dosunmu':1630245,'dosunmu':1630245,
  'nic claxton':1629651,'claxton':1629651,
  'rudy gobert':203497,'gobert':203497,
  'derrick white':1628401,
  'myles turner':1626167,'turner':1626167,
  'donte divincenzo':1628978,'divincenzo':1628978,
  'naji marshall':1630230,'marshall':1630230,
  'neemias queta':1629674,'queta':1629674,
  'quentin grimes':1629656,'grimes':1629656,
  'jabari smith jr':1631095,'jabari':1631095,
  'rj barrett':1629628,'barrett':1629628,
  'saddiq bey':1630218,'bey':1630218,
  'ziaire williams':1630533,'ziaire':1630533,
  'nick richards':1630236,'nick richards':1630236,
  'kobe brown':1641843,
  'dominick barlow':1631116,'barlow':1631116,
  'ousmane dieng':1631117,'dieng':1631117,
  'josh giddey':1630581,'giddey':1630581,
  'nikola vucevic':202696,'vucevic':202696,
  'lauri markkanen':1628374,'markkanen':1628374,
  'josh hart':1628404,'hart':1628404,
  'og anunoby':1628384,'og':1628384,
  'immanuel quickley':1630193,'quickley':1630193,
  'draymond green':203110,'draymond':203110,
  'matas buzelis':1642267,'buzelis':1642267,
  'cam thomas':1631105,
  'scoot henderson':1641706,'scoot':1641706,
  'jalen williams':1631112,
  'aaron gordon':203932,'gordon':203932,
  'tari eason':1631107,'eason':1631107,
};

// Detect if query is a game log request or an analytical question
function isGameLogQuery(q) {
  var q2 = q.toLowerCase();
  // Game log signals: player name + "last N" or "stats" or "game log"
  var hasN = /last\s*\d+/.test(q2);
  var hasLog = /game.?log|this season|season stats/.test(q2);
  var hasPlayer = !!findPlayer(q2);
  return hasPlayer && (hasN || hasLog);
}

function findPlayer(q) {
  q = q.toLowerCase();
  for (var name in PLAYER_IDS) {
    if (q.includes(name)) return {id: PLAYER_IDS[name], name: name};
  }
  return null;
}

function parseLastN(q) {
  var m = q.toLowerCase().match(/last\s*(\d+)/);
  return m ? Math.min(parseInt(m[1]), 25) : 10;
}

// ── GAME LOG FETCH ──
async function fetchGameLog(playerId, playerName, lastN) {
  var url = '/api/nba/gamelog?playerId=' + playerId + '&playerName=' + encodeURIComponent(playerName);
  var r = await fetch(url);
  var d = await r.json();
  if (!d.success) throw new Error(d.error || 'API error');

  var rows = d.rows || [];

  // Handle NBA Stats API format
  if (!rows.length && d.data && d.data.resultSets) {
    var headers = d.data.resultSets[0].headers;
    var rowSet = d.data.resultSets[0].rowSet;
    var idx = function(k){ return headers.indexOf(k); };
    rows = rowSet.map(function(r) {
      return {
        date: (r[idx('GAME_DATE')]||'').split('T')[0],
        matchup: r[idx('MATCHUP')]||'',
        result: r[idx('WL')]||'',
        pts: r[idx('PTS')]||0, reb: r[idx('REB')]||0, ast: r[idx('AST')]||0,
        stl: r[idx('STL')]||0, blk: r[idx('BLK')]||0, tov: r[idx('TOV')]||0,
        fgm: r[idx('FGM')]||0, fga: r[idx('FGA')]||0,
        fg3m: r[idx('FG3M')]||0, fg3a: r[idx('FG3A')]||0,
        ftm: r[idx('FTM')]||0, fta: r[idx('FTA')]||0,
        min: r[idx('MIN')]||0, plusMinus: r[idx('PLUS_MINUS')]||0,
      };
    });
  }

  return rows.slice(0, lastN);
}

// ── RENDER STATMUSE TABLE ──
function renderTable(games, playerName, subtitle, oppFilter) {
  // Client-side opponent filter
  if (oppFilter) {
    games = games.filter(function(g) {
      return (g.matchup||'').toLowerCase().includes(oppFilter.toLowerCase());
    });
  }

  if (!games.length) {
    var msg = oppFilter ? 'No games found vs ' + oppFilter + ' in this range.' : 'No games found.';
    return '<div class="sm-empty">' + msg + '</div>';
  }

  function avg(key) {
    return (games.reduce(function(s,g){ return s+(parseFloat(g[key])||0); },0)/games.length).toFixed(1);
  }
  function fgPct() {
    var m = games.reduce(function(s,g){ return s+(parseFloat(g.fgm)||0); },0);
    var a = games.reduce(function(s,g){ return s+(parseFloat(g.fga)||0); },0);
    return a>0 ? ((m/a)*100).toFixed(1)+'%' : '--';
  }
  var wins = games.filter(function(g){ return g.result==='W'; }).length;

  var html = '<div class="sm-card">';
  html += '<div class="sm-header"><div class="sm-player-name">' + cap(playerName) + '</div>';
  html += '<div class="sm-subtitle">' + subtitle + (oppFilter?' · vs '+oppFilter.toUpperCase():'') + '</div></div>';
  html += '<div class="sm-avgs">'
    + smA(avg('pts'),'PTS','#FFD700') + smA(avg('reb'),'REB','#22d3ee')
    + smA(avg('ast'),'AST','#a855f7') + smA(avg('stl'),'STL','#22c55e')
    + smA(avg('blk'),'BLK','#f97316') + smA(avg('tov'),'TOV','#e52222')
    + smA(fgPct(),'FG%','#94a3b8') + smA(wins+'-'+(games.length-wins),'W-L','#fff')
    + '</div>';
  html += '<div class="sm-table-wrap"><table class="sm-table"><thead><tr>'
    + '<th style="text-align:left">Date</th><th>Opp</th><th>W/L</th>'
    + '<th class="gold">PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th>'
    + '<th>TO</th><th>FG</th><th>3PT</th><th>FT</th><th>+/-</th><th>MIN</th>'
    + '</tr></thead><tbody>';

  games.forEach(function(g, i) {
    var pm = parseFloat(g.plusMinus)||0;
    html += '<tr class="'+(i%2===0?'sm-even':'')+'">'
      + '<td class="sm-date">'+(g.date||'')+'</td>'
      + '<td class="sm-matchup">'+(g.matchup||'')+'</td>'
      + '<td class="'+(g.result==='W'?'sm-win':'sm-loss')+'">'+(g.result||'-')+'</td>'
      + '<td class="sm-pts'+(parseFloat(g.pts)>=30?' sm-hi':'')+'">'+(g.pts||0)+'</td>'
      + '<td class="'+(parseFloat(g.reb)>=10?'sm-hi':'')+'">'+(g.reb||0)+'</td>'
      + '<td class="'+(parseFloat(g.ast)>=10?'sm-hi':'')+'">'+(g.ast||0)+'</td>'
      + '<td>'+(g.stl||0)+'</td><td>'+(g.blk||0)+'</td>'
      + '<td class="sm-tov">'+(g.tov||0)+'</td>'
      + '<td class="sm-small">'+(g.fgm||0)+'/'+(g.fga||0)+'</td>'
      + '<td class="sm-small">'+(g.fg3m||0)+'/'+(g.fg3a||0)+'</td>'
      + '<td class="sm-small">'+(g.ftm||0)+'/'+(g.fta||0)+'</td>'
      + '<td class="sm-pm '+(pm>0?'sm-pm-pos':pm<0?'sm-pm-neg':'')+'">'+(pm>0?'+':'')+pm+'</td>'
      + '<td class="sm-small">'+(g.min||0)+'</td>'
      + '</tr>';
  });
  html += '</tbody></table></div></div>';
  return html;
}

function smA(v,l,c){ return '<div class="sm-avg-item"><div class="sm-avg-val" style="color:'+c+'">'+v+'</div><div class="sm-avg-lbl">'+l+'</div></div>'; }
function cap(s){ return (s||'').split(' ').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' '); }

// ── PARSE OPPONENT FROM QUERY ──
var TEAM_ABBRS = {
  'celtics':'BOS','lakers':'LAL','warriors':'GSW','bucks':'MIL','knicks':'NYK',
  'heat':'MIA','nuggets':'DEN','cavaliers':'CLE','cavs':'CLE','clippers':'LAC',
  'suns':'PHX','mavericks':'DAL','mavs':'DAL','76ers':'PHI','sixers':'PHI',
  'thunder':'OKC','spurs':'SAS','rockets':'HOU','timberwolves':'MIN','wolves':'MIN',
  'raptors':'TOR','jazz':'UTA','hawks':'ATL','magic':'ORL','pacers':'IND',
  'pistons':'DET','bulls':'CHI','nets':'BKN','hornets':'CHA','grizzlies':'MEM',
  'pelicans':'NOP','blazers':'POR','trail blazers':'POR','kings':'SAC','wizards':'WAS',
};

function parseOpp(q) {
  var q2 = q.toLowerCase();
  // Check "vs X" or "against X" or "@ X"
  for (var name in TEAM_ABBRS) {
    if (q2.includes(name)) return TEAM_ABBRS[name];
  }
  // Check direct abbrevs
  var m = q2.match(/\bvs\.?\s+([a-z]{2,3})\b/) || q2.match(/\bagainst\s+([a-z]{2,3})\b/);
  if (m) return m[1].toUpperCase();
  return null;
}

// ── MAIN SEARCH ──
window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q = inp ? inp.value.trim() : '';
  if (!q) return;
  inp.value = '';
  addUserMsg(q);
  var tid = addTyping();

  // Route: game log or analytical question?
  if (isGameLogQuery(q)) {
    // GAME LOG via API
    var found = findPlayer(q);
    var lastN = parseLastN(q);
    var oppFilter = parseOpp(q);

    try {
      // Fetch more if filtering by opponent so we have enough after filter
      var fetchN = oppFilter ? Math.min(lastN * 5, 82) : lastN;
      var games = await fetchGameLog(found.id, found.name, fetchN);
      removeTyping(tid);
      if (!games.length) {
        addMsg('<div class="sm-empty">No games found for ' + cap(found.name) + ' in 2025-26. Player may be inactive.</div>');
        return;
      }
      var subtitle = 'Last ' + games.length + ' games · 2025-26';
      addMsg(renderTable(games, found.name, subtitle, oppFilter));
    } catch(e) {
      removeTyping(tid);
      addMsg('<div class="sm-empty">Could not load game log — try again. (' + e.message + ')</div>');
    }

  } else {
    // ANALYTICAL QUESTION via AI
    try {
      var r = await fetch('/api/stats/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: q})
      });
      var d = await r.json();
      removeTyping(tid);
      var answer = d.success ? d.answer : 'Could not answer that — try rephrasing.';
      addMsg('<div class="sm-ai-card"><div class="sm-ai-label">🤖 BeepBopStats</div><div class="sm-ai-body">' + esc(answer) + '</div></div>');
    } catch(e) {
      removeTyping(tid);
      addMsg('<div class="sm-empty">Connection error — try again.</div>');
    }
  }
};

// ── UI HELPERS ──
function addUserMsg(text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  document.getElementById('stats-empty').style.display = 'none';
  var d = document.createElement('div');
  d.className = 'stats-msg stats-msg-user';
  d.innerHTML = '<div class="stats-bubble stats-bubble-user">' + esc(text) + '</div>';
  chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
}

function addMsg(html) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  document.getElementById('stats-empty').style.display = 'none';
  var d = document.createElement('div');
  d.className = 'stats-msg stats-msg-ai';
  d.innerHTML = html;
  chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
}

function addTyping() {
  var chat = document.getElementById('stats-chat');
  if (!chat) return 'ty';
  var id = 'ty-' + Date.now();
  var d = document.createElement('div');
  d.id = id; d.className = 'stats-msg stats-msg-ai';
  d.innerHTML = '<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
  return id;
}

function removeTyping(id) { var e = document.getElementById(id); if(e) e.remove(); }
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }

window.clearChat = function() {
  var c = document.getElementById('stats-chat');
  if(c) c.innerHTML = '';
  document.getElementById('stats-empty').style.display = 'flex';
};

window.runSearch = function(q) {
  var inp = document.getElementById('stats-input');
  if(inp) inp.value = q;
  window.searchStats();
};

window.initStats = function() {
  var el = document.getElementById('stats-suggestions');
  if(!el) return;
  var chips = [
    // Game log queries
    'LeBron last 10','Giannis last 5','Curry last 10',
    'Kon Knueppel last 10','Banchero last 5','Jokic last 10',
    'LeBron last 10 vs Celtics','Mitchell last 5 vs Lakers',
    // Analytical queries
    'What positions do the Bulls struggle to guard?',
    'Top fouling teams in the NBA',
    'Best defensive teams this season',
    'Shooting guards vs Bulls this season',
    'Which team allows the most points to centers?',
    'Warriors weaknesses on defense',
  ];
  el.innerHTML = chips.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\'' + s.replace(/'/g,"\\'") + '\')">' + s + '</div>';
  }).join('');
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 300);
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if(inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 400);
});
