// BeepBopStats — Pure NBA API game logs, StatMuse-style. No AI fluff.

var PLAYER_IDS = {
  // 2025 Draft class — all verified from nba.com/player/ID URLs
  'kon knueppel':1642851,'kon':1642851,'knueppel':1642851,
  'dylan harper':1642844,'harper':1642844,
  'vj edgecombe':1642845,'edgecombe':1642845,'vj':1642845,
  'ace bailey':1642846,'ace':1642846,'bailey':1642846,
  'jeremiah fears':1642847,'fears':1642847,
  'tre johnson':1642848,
  'nolan traore':1642849,'traore':1642849,
  'derik queen':1642852,'queen':1642852,
  'devin carter':1642853,'carter':1642853,
  'egor demin':1642856,'demin':1642856,
  'maxime raynaud':1642857,'raynaud':1642857,
  'cooper flagg':1642843,'flagg':1642843,
  // 2024 Draft class
  'reed sheppard':1641844,'sheppard':1641844,
  'cody williams':1642262,
  'taylor hendricks':1642269,'hendricks':1642269,
  'ja\'kobe walter':1642270,'jakobe walter':1642270,'walter':1642270,
  'kyle filipowski':1642271,'filipowski':1642271,
  'walter clayton':1642383,'walter clayton':1642383,
  'zaccharie risacher':1642262,
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
  'de\'aaron fox':1628368,'fox':1628368,
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
  'nick richards':1630236,'richards':1630236,
  'kobe brown':1641843,
  'ryan rollins':1631115,'rollins':1631115,
  'dominick barlow':1631116,'barlow':1631116,
  'ousmane dieng':1631117,'dieng':1631117,
  'cade cunningham':1630595,'cade':1630595,
  'josh giddey':1630581,'giddey':1630581,
  'nikola vucevic':202696,'vucevic':202696,
  'lauri markkanen':1628374,'markkanen':1628374,
  'josh hart':1628404,'hart':1628404,
  'og anunoby':1628384,'og':1628384,
  'immanuel quickley':1630193,'quickley':1630193,
  'draymond green':203110,'draymond':203110,
  'andrew wiggins':203952,'wiggins':203952,
  'tyrese haliburton':1630169,
  'matas buzelis':1642267,'buzelis':1642267,
  'cam thomas':1631105,
  'scoot henderson':1641706,'scoot':1641706,
  'jalen williams':1631112,
  'aaron gordon':203932,'gordon':203932,
  'kelly oubre':1626162,'oubre':1626162,
  'tobias harris':202699,
  'tari eason':1631107,'eason':1631107,
};

function findPlayer(q) {
  q = q.toLowerCase().trim();
  // Try progressively shorter matches
  for (var name in PLAYER_IDS) {
    if (q.includes(name)) return {id: PLAYER_IDS[name], name: name};
  }
  return null;
}

function parseLastN(q) {
  var m = q.toLowerCase().match(/last\s*(\d+)/);
  return m ? Math.min(parseInt(m[1]), 25) : 10;
}

// Format date from NBA API
function fmtDate(d) {
  if (!d) return '';
  return d.substring(0, 10);
}

function avg(games, key) {
  if (!games.length) return '0.0';
  var sum = games.reduce(function(s, g) { return s + (parseFloat(g[key]) || 0); }, 0);
  return (sum / games.length).toFixed(1);
}

function fgPctStr(games) {
  var fgm = games.reduce(function(s,g){ return s+(parseFloat(g.fgm)||0); }, 0);
  var fga = games.reduce(function(s,g){ return s+(parseFloat(g.fga)||0); }, 0);
  return fga > 0 ? ((fgm/fga)*100).toFixed(1)+'%' : '--';
}

function renderTable(games, playerName, subtitle) {
  if (!games.length) return '<div class="sm-empty">No games found in NBA stats API.</div>';
  var wins = games.filter(function(g){ return g.result === 'W'; }).length;
  var aPts = avg(games,'pts'), aReb = avg(games,'reb'), aAst = avg(games,'ast');
  var aStl = avg(games,'stl'), aBlk = avg(games,'blk'), aTov = avg(games,'tov');
  var fg = fgPctStr(games);

  var html = '<div class="sm-card">';
  html += '<div class="sm-header"><div class="sm-player-name">' + cap(playerName) + '</div>';
  html += '<div class="sm-subtitle">' + subtitle + '</div></div>';
  // Averages
  html += '<div class="sm-avgs">'
    + smA(aPts,'PTS','#FFD700') + smA(aReb,'REB','#22d3ee') + smA(aAst,'AST','#a855f7')
    + smA(aStl,'STL','#22c55e') + smA(aBlk,'BLK','#f97316') + smA(aTov,'TOV','#e52222')
    + smA(fg,'FG%','#94a3b8') + smA(wins+'-'+(games.length-wins),'W-L','#fff')
    + '</div>';
  // Table
  html += '<div class="sm-table-wrap"><table class="sm-table"><thead><tr>'
    + '<th style="text-align:left">Date</th><th>Opp</th><th>W/L</th>'
    + '<th class="gold">PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th>'
    + '<th>TO</th><th>FG</th><th>3PT</th><th>FT</th><th>+/-</th><th>MIN</th>'
    + '</tr></thead><tbody>';
  games.forEach(function(g, i) {
    var hi30 = parseFloat(g.pts) >= 30;
    var hi10r = parseFloat(g.reb) >= 10;
    var hi10a = parseFloat(g.ast) >= 10;
    var pm = parseFloat(g.plusMinus)||0;
    html += '<tr class="'+(i%2===0?'sm-even':'')+'">'
      + '<td class="sm-date">'+(g.date||'')+'</td>'
      + '<td class="sm-matchup">'+(g.matchup||'').replace(/[A-Z]+\s+vs\.\s+/,'vs ')+'</td>'
      + '<td class="'+(g.result==='W'?'sm-win':'sm-loss')+'">'+(g.result||'')+'</td>'
      + '<td class="sm-pts'+(hi30?' sm-hi':'')+'">'+(g.pts||0)+'</td>'
      + '<td class="'+(hi10r?'sm-hi':'sm-stat')+'">'+(g.reb||0)+'</td>'
      + '<td class="'+(hi10a?'sm-hi':'sm-stat')+'">'+(g.ast||0)+'</td>'
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

function smA(v, l, c) {
  return '<div class="sm-avg-item"><div class="sm-avg-val" style="color:'+c+'">'+v+'</div><div class="sm-avg-lbl">'+l+'</div></div>';
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
  var tid = addTyping();

  var found = findPlayer(q);
  var lastN = parseLastN(q);

  if (!found) {
    removeTyping(tid);
    addMsg('<div class="sm-empty">Player not recognized. Try: "LeBron last 10", "Giannis last 5", "Kon Knueppel stats", "Suggs last 10"</div>');
    return;
  }

  try {
    var url = '/api/nba/gamelog?playerId=' + found.id;
    var r = await fetch(url);
    var d = await r.json();
    removeTyping(tid);

    if (!d.success || !d.data || !d.data.resultSets || !d.data.resultSets[0]) {
      addMsg('<div class="sm-empty">NBA API returned no data for ' + cap(found.name) + '. Player may be injured/inactive this season.</div>');
      return;
    }

    var headers = d.data.resultSets[0].headers;
    var rows = d.data.resultSets[0].rowSet;
    var idx = function(k){ return headers.indexOf(k); };

    if (!rows.length) {
      addMsg('<div class="sm-empty">No game log found for ' + cap(found.name) + ' in 2025-26.</div>');
      return;
    }

    var games = rows.slice(0, lastN).map(function(r) {
      return {
        date:      fmtDate(r[idx('GAME_DATE')]),
        matchup:   r[idx('MATCHUP')]||'',
        result:    r[idx('WL')]||'',
        pts:       r[idx('PTS')]||0,
        reb:       r[idx('REB')]||0,
        ast:       r[idx('AST')]||0,
        stl:       r[idx('STL')]||0,
        blk:       r[idx('BLK')]||0,
        tov:       r[idx('TOV')]||0,
        min:       r[idx('MIN')]||0,
        fgm:       r[idx('FGM')]||0,
        fga:       r[idx('FGA')]||0,
        fg3m:      r[idx('FG3M')]||0,
        fg3a:      r[idx('FG3A')]||0,
        ftm:       r[idx('FTM')]||0,
        fta:       r[idx('FTA')]||0,
        plusMinus: r[idx('PLUS_MINUS')]||0,
      };
    });

    var sub = 'Last ' + games.length + ' games · 2025-26 season';
    addMsg(renderTable(games, found.name, sub));

  } catch(e) {
    removeTyping(tid);
    addMsg('<div class="sm-empty">Connection error — try again. (' + e.message + ')</div>');
  }
};

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
    'LeBron last 10','Giannis last 5','Curry last 10',
    'Kon Knueppel last 10','Banchero last 5','Jokic last 10',
    'Mitchell last 10','Brunson last 5','Wemby last 10',
    'Derik Queen last 10','Trae Young last 5','SGA last 10',
    'Ace Bailey last 10','Dylan Harper last 5','Suggs last 10',
    'Jeremiah Fears last 10','Flagg last 10','Sengun last 5',
  ];
  el.innerHTML = chips.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s+'\')">' + s + '</div>';
  }).join('');
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 300);
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if(inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 400);
});
