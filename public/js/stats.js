// BeepBopStats — StatMuse-style game logs + AI

// Full player ID map — every player we track
var PLAYER_IDS = {
  // Stars
  'lebron':2544,'lebron james':2544,
  'steph curry':201939,'stephen curry':201939,'curry':201939,
  'giannis':203507,'giannis antetokounmpo':203507,
  'nikola jokic':203999,'jokic':203999,
  'jayson tatum':1628369,'tatum':1628369,
  'luka doncic':1629029,'luka':1629029,
  'shai':1628983,'sga':1628983,'shai gilgeous-alexander':1628983,
  'donovan mitchell':1628378,'mitchell':1628378,
  'tyrese maxey':1630178,'maxey':1630178,
  'victor wembanyama':1641705,'wembanyama':1641705,'wemby':1641705,
  'devin booker':1626164,'booker':1626164,
  'austin reaves':1630559,'reaves':1630559,
  'anthony edwards':1630162,'ant edwards':1630162,'ant':1630162,
  'jaylen brown':1627759,'brown':1627759,
  'joel embiid':203954,'embiid':203954,
  'jalen brunson':1628973,'brunson':1628973,
  'alperen sengun':1630578,'sengun':1630578,
  'kevin durant':201142,'kd':201142,'durant':201142,
  'lamelo ball':1630163,'lamelo':1630163,
  'trae young':1629027,'trae':1629027,
  'darius garland':1629636,'garland':1629636,
  'james harden':201935,'harden':201935,
  'damian lillard':203081,'dame':203081,'lillard':203081,
  'cooper flagg':1642843,'flagg':1642843,
  'evan mobley':1630596,'mobley':1630596,
  'bam adebayo':1628389,'bam':1628389,
  'tyrese haliburton':1630169,'haliburton':1630169,
  'anthony davis':203076,'ad':203076,'davis':203076,
  'kawhi leonard':202695,'kawhi':202695,
  'ja morant':1629630,'ja':1629630,'morant':1629630,
  'de\'aaron fox':1628368,'fox':1628368,
  'karl-anthony towns':1626157,'towns':1626157,'kat':1626157,
  'zion williamson':1629627,'zion':1629627,
  'paolo banchero':1631094,'banchero':1631094,
  'jalen johnson':1630552,'jalen johnson':1630552,
  'dyson daniels':1630700,'dyson':1630700,
  'onyeka okongwu':1630168,'okongwu':1630168,
  'jonathan kuminga':1630228,'kuminga':1630228,
  'cj mccollum':203468,'mccollum':203468,
  'desmond bane':1630217,'bane':1630217,
  'jalen suggs':1630534,'suggs':1630534,
  'franz wagner':1630532,'franz':1630532,
  'chet holmgren':1631096,'chet':1631096,
  'tyler herro':1629639,'herro':1629639,
  'scottie barnes':1630567,'barnes':1630567,
  'mikal bridges':1628969,'bridges':1628969,
  'pascal siakam':1627783,'siakam':1627783,
  'julius randle':203944,'randle':203944,
  'jakob poeltl':1627751,'poeltl':1627751,
  'jeremiah fears':1642847,'fears':1642847,
  'payton pritchard':1630202,'pritchard':1630202,
  'brice sensabaugh':1641729,'sensabaugh':1641729,
  'brandon ingram':1627742,'ingram':1627742,
  'ayo dosunmu':1630245,'dosunmu':1630245,
  'nic claxton':1629651,'claxton':1629651,
  'rudy gobert':203497,'gobert':203497,
  'derrick white':1628401,'derrick white':1628401,
  'kyle filipowski':1642271,'filipowski':1642271,
  'myles turner':1626167,'turner':1626167,
  'donte divincenzo':1628978,'divincenzo':1628978,
  'naji marshall':1630230,'marshall':1630230,
  'neemias queta':1629674,'queta':1629674,
  'derik queen':1642852,'queen':1642852,
  'quentin grimes':1629656,'grimes':1629656,
  'jabari smith jr':1631095,'jabari':1631095,
  'reed sheppard':1642848,'sheppard':1642848,
  'rj barrett':1629628,'barrett':1629628,
  'devin carter':1642853,'carter':1642853,
  'saddiq bey':1630218,'bey':1630218,
  'taylor hendricks':1642269,'hendricks':1642269,
  'ziaire williams':1630533,'ziaire':1630533,
  'nick richards':1630236,'richards':1630236,
  'kobe brown':1641843,'kobe brown':1641843,
  'maxime raynaud':1642857,'raynaud':1642857,
  'ryan rollins':1631115,'rollins':1631115,
  'dominick barlow':1631116,'barlow':1631116,
  "ja'kobe walter":1642270,'jakobe walter':1642270,'walter':1642270,
  'cody williams':1642262,
  'ousmane dieng':1631117,'dieng':1631117,
  'zion williamson':1629627,
  'josh giddey':1630581,'giddey':1630581,
  'cade cunningham':1630595,'cade':1630595,
  'nikola vucevic':202696,'vucevic':202696,
  'lauri markkanen':1628374,'markkanen':1628374,
  'luguentz dort':1629631,'dort':1629631,
  'josh hart':1628404,'hart':1628404,
  'og anunoby':1628384,'og':1628384,
  'immanuel quickley':1630193,'quickley':1630193,
  'miles mcbride':1630540,'mcbride':1630540,
  'draymond green':203110,'draymond':203110,
  'andrew wiggins':203952,'wiggins':203952,
  'jonathan kuminga':1630228,
  'mike conley':1628382,'conley':1628382,
  'naz reid':1629675,'reid':1629675,
  'bennedict mathurin':1631119,'mathurin':1631119,
  'tyrese haliburton':1630169,
  'matas buzelis':1642267,'buzelis':1642267,
  'cam thomas':1631105,'cam thomas':1631105,
  'tari eason':1631107,'eason':1631107,
  'scoot henderson':1641706,'scoot':1641706,
  'cason wallace':1641730,'wallace':1641730,
  'keyonte george':1641727,'keyonte':1641727,
  'jalen williams':1631112,'jalen williams':1631112,
  'luguentz dort':1629631,
  'aaron gordon':203932,'gordon':203932,
  'reggie jackson':203114,
  'kelly oubre':1626162,'oubre':1626162,
  'tobias harris':202699,'harris':202699,
};

var statsHistory = [];

function findPlayerId(query) {
  var q = query.toLowerCase();
  // Exact matches first
  for (var name in PLAYER_IDS) {
    if (q.includes(name)) return { id: PLAYER_IDS[name], name: name };
  }
  return null;
}

function parseLastN(query) {
  var m = query.toLowerCase().match(/last\s*(\d+)/);
  return m ? parseInt(m[1]) : null;
}

async function fetchGameLog(playerId, lastN) {
  var url = '/api/nba/gamelog?playerId=' + playerId;
  var res = await fetch(url);
  var d = await res.json();
  if (!d.success || !d.data) throw new Error('No data');
  var headers = d.data.resultSets[0].headers;
  var rows = d.data.resultSets[0].rowSet;
  var idx = function(k){ return headers.indexOf(k); };
  var games = rows.map(function(r){
    return {
      date: (r[idx('GAME_DATE')]||'').substring(0,10),
      matchup: r[idx('MATCHUP')]||'',
      result: r[idx('WL')]||'',
      pts: r[idx('PTS')]||0, reb: r[idx('REB')]||0, ast: r[idx('AST')]||0,
      stl: r[idx('STL')]||0, blk: r[idx('BLK')]||0,
      min: r[idx('MIN')]||0, tov: r[idx('TOV')]||0,
      fgm: r[idx('FGM')]||0, fga: r[idx('FGA')]||0,
      fg3m: r[idx('FG3M')]||0, fg3a: r[idx('FG3A')]||0,
      ftm: r[idx('FTM')]||0, fta: r[idx('FTA')]||0,
      plusMinus: r[idx('PLUS_MINUS')]||0,
    };
  });
  if (lastN) games = games.slice(0, lastN);
  return games;
}

function avg(games, key) {
  if (!games.length) return '0.0';
  return (games.reduce(function(s,g){ return s + (parseFloat(g[key])||0); }, 0) / games.length).toFixed(1);
}

function renderStatMuseTable(games, playerName, subtitle) {
  if (!games.length) return '<div class="sm-empty">No games found.</div>';

  var avgPts = avg(games,'pts'), avgReb = avg(games,'reb'), avgAst = avg(games,'ast');
  var avgStl = avg(games,'stl'), avgBlk = avg(games,'blk'), avgMin = avg(games,'min');
  var wins = games.filter(function(g){ return g.result==='W'; }).length;
  var fgPct = games.reduce(function(s,g){ return s+(parseFloat(g.fga)||0); },0);
  var fgPctStr = fgPct > 0 ? ((games.reduce(function(s,g){ return s+(parseFloat(g.fgm)||0); },0)/fgPct)*100).toFixed(1)+'%' : '--';

  var html = '<div class="sm-card">';
  // Header
  html += '<div class="sm-header"><div class="sm-player-name">' + cap(playerName) + '</div><div class="sm-subtitle">' + subtitle + '</div></div>';
  // Avg bar
  html += '<div class="sm-avgs">'
    + smAvg(avgPts,'PTS','#FFD700')
    + smAvg(avgReb,'REB','#22d3ee')
    + smAvg(avgAst,'AST','#a855f7')
    + smAvg(avgStl,'STL','#22c55e')
    + smAvg(avgBlk,'BLK','#f97316')
    + smAvg(avgMin,'MIN','#94a3b8')
    + smAvg(fgPctStr,'FG%','#e52222')
    + '<div class="sm-avg-item"><div class="sm-avg-val">' + wins + '-' + (games.length-wins) + '</div><div class="sm-avg-lbl">W-L</div></div>'
    + '</div>';
  // Table
  html += '<div class="sm-table-wrap"><table class="sm-table">'
    + '<thead><tr><th>Date</th><th>Matchup</th><th>W/L</th>'
    + '<th class="gold">PTS</th><th>REB</th><th>AST</th>'
    + '<th>STL</th><th>BLK</th><th>TO</th><th>FG</th><th>3PT</th><th>FT</th><th>+/-</th><th>MIN</th>'
    + '</tr></thead><tbody>';

  games.forEach(function(g, i){
    var hiPts = parseFloat(g.pts) >= 30;
    var hiReb = parseFloat(g.reb) >= 10;
    var hiAst = parseFloat(g.ast) >= 10;
    var pm = parseFloat(g.plusMinus);
    var pmStr = pm > 0 ? '+'+pm : String(pm);
    var fgStr = g.fgm+'/'+g.fga;
    var tpStr = g.fg3m+'/'+g.fg3a;
    var ftStr = g.ftm+'/'+g.fta;
    html += '<tr class="'+(i%2===0?'sm-even':'')+'">'
      + '<td class="sm-date">' + g.date + '</td>'
      + '<td class="sm-matchup">' + g.matchup + '</td>'
      + '<td class="'+(g.result==='W'?'sm-win':'sm-loss')+'">' + g.result + '</td>'
      + '<td class="sm-pts'+(hiPts?' sm-hi':'')+'">' + g.pts + '</td>'
      + '<td class="'+(hiReb?'sm-hi':'sm-stat')+'">' + g.reb + '</td>'
      + '<td class="'+(hiAst?'sm-hi':'sm-stat')+'">' + g.ast + '</td>'
      + '<td class="sm-stat">' + g.stl + '</td>'
      + '<td class="sm-stat">' + g.blk + '</td>'
      + '<td class="sm-stat sm-tov">' + g.tov + '</td>'
      + '<td class="sm-small">' + fgStr + '</td>'
      + '<td class="sm-small">' + tpStr + '</td>'
      + '<td class="sm-small">' + ftStr + '</td>'
      + '<td class="sm-pm '+(pm>0?'sm-pm-pos':pm<0?'sm-pm-neg':'')+'">' + pmStr + '</td>'
      + '<td class="sm-small">' + g.min + '</td>'
      + '</tr>';
  });

  html += '</tbody></table></div></div>';
  return html;
}

function smAvg(val, lbl, color) {
  return '<div class="sm-avg-item"><div class="sm-avg-val" style="color:'+color+'">'+val+'</div><div class="sm-avg-lbl">'+lbl+'</div></div>';
}

function cap(s) {
  return (s||'').split(' ').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' ');
}

window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q = inp ? inp.value.trim() : '';
  if (!q) return;
  inp.value = '';
  addUserMsg(q);
  statsHistory.push({role:'user', content:q});
  var tid = addTyping();

  try {
    var found = findPlayerId(q);
    var lastN = parseLastN(q);
    var tableHtml = '';
    var aiContext = '';

    if (found) {
      try {
        var games = await fetchGameLog(found.id, lastN || 10);
        var subtitle = (lastN ? 'Last '+games.length+' games' : 'Last 10 games') + ' · 2025-26';
        tableHtml = renderStatMuseTable(games, found.name, subtitle);
        // Build context for AI
        var a = {pts: avg(games,'pts'), reb: avg(games,'reb'), ast: avg(games,'ast')};
        aiContext = cap(found.name) + ' averages ' + a.pts + ' pts, ' + a.reb + ' reb, ' + a.ast + ' ast over these ' + games.length + ' games. ';
        var last3 = games.slice(0,3).map(function(g){ return g.pts+'pts/'+g.reb+'reb/'+g.ast+'ast'; }).join(', ');
        aiContext += 'Recent: ' + last3 + '.';
      } catch(e) {
        tableHtml = '<div class="sm-api-note">📊 Live log unavailable — NBA API rate limited. AI using season knowledge.</div>';
      }
    }

    // Ask AI
    var r = await fetch('/api/stats/ask', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        question: q,
        history: statsHistory.slice(-8),
        gameLogContext: aiContext,
      })
    });
    var d = await r.json();
    if (d.success && d.answer) statsHistory.push({role:'assistant', content:d.answer});

    removeTyping(tid);
    addAiMsg(tableHtml, d.success ? d.answer : 'Try again!');
  } catch(e) {
    removeTyping(tid);
    addAiMsg('', 'Connection error — try again.');
  }
};

function addUserMsg(text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  document.getElementById('stats-empty').style.display = 'none';
  var d = document.createElement('div');
  d.className = 'stats-msg stats-msg-user';
  d.innerHTML = '<div class="stats-bubble stats-bubble-user">'+esc(text)+'</div>';
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function addAiMsg(tableHtml, text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var d = document.createElement('div');
  d.className = 'stats-msg stats-msg-ai';
  d.innerHTML = '<div class="stats-result-wrap">'
    + (tableHtml || '')
    + '<div class="stats-ai-bubble"><div class="stats-ai-label">🤖 BeepBopStats</div>'
    + '<div class="stats-ai-text">'+esc(text)+'</div></div>'
    + '</div>';
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

function addTyping() {
  var chat = document.getElementById('stats-chat');
  if (!chat) return 'typing';
  var id = 'ty-'+Date.now();
  var d = document.createElement('div');
  d.id = id; d.className = 'stats-msg stats-msg-ai';
  d.innerHTML = '<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return id;
}
function removeTyping(id){ var el=document.getElementById(id); if(el)el.remove(); }
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }

window.clearChat = function() {
  var c = document.getElementById('stats-chat');
  if(c) c.innerHTML='';
  document.getElementById('stats-empty').style.display='flex';
  statsHistory = [];
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
    'LeBron last 10 games','Giannis last 5','Curry this season',
    'Jalen Johnson last 10','Banchero last 5','Jokic stats',
    'Mitchell last 10','Brunson last 5','Wemby last 10',
    'Derik Queen last 10','Trae Young stats','SGA last 5',
  ];
  el.innerHTML = chips.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s.replace(/'/g,"\\'")+'\')">' + s + '</div>';
  }).join('');
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 400);
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if(inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 500);
});
