// BeepBopStats — StatMuse-style search + AI parlay analyst
// The only place where AI knows your actual picks

var statsMessages = [];
var statsMode = 'search'; // 'search' or 'chat'

// ── PLAYER DATABASE ──
var PLAYER_DB = {
  'stephen curry':    { id:'201939', team:'GSW', pos:'PG' },
  'steph curry':      { id:'201939', team:'GSW', pos:'PG' },
  'lebron james':     { id:'2544',   team:'LAL', pos:'SF' },
  'lebron':           { id:'2544',   team:'LAL', pos:'SF' },
  'kevin durant':     { id:'201142', team:'HOU', pos:'SF' },
  'kd':               { id:'201142', team:'HOU', pos:'SF' },
  'giannis':          { id:'203507', team:'MIL', pos:'PF' },
  'giannis antetokounmpo': { id:'203507', team:'MIL', pos:'PF' },
  'nikola jokic':     { id:'203999', team:'DEN', pos:'C'  },
  'jokic':            { id:'203999', team:'DEN', pos:'C'  },
  'jayson tatum':     { id:'1628369',team:'BOS', pos:'SF' },
  'tatum':            { id:'1628369',team:'BOS', pos:'SF' },
  'luka doncic':      { id:'1629029',team:'LAL', pos:'PG' },
  'luka':             { id:'1629029',team:'LAL', pos:'PG' },
  'shai gilgeous-alexander': { id:'1628983',team:'OKC', pos:'PG' },
  'sga':              { id:'1628983',team:'OKC', pos:'PG' },
  'donovan mitchell': { id:'1628378',team:'CLE', pos:'SG' },
  'mitchell':         { id:'1628378',team:'CLE', pos:'SG' },
  'tyrese maxey':     { id:'1630178',team:'PHI', pos:'PG' },
  'maxey':            { id:'1630178',team:'PHI', pos:'PG' },
  'victor wembanyama':{ id:'1641705',team:'SAS', pos:'C'  },
  'wemby':            { id:'1641705',team:'SAS', pos:'C'  },
  'devin booker':     { id:'1626164',team:'PHX', pos:'SG' },
  'booker':           { id:'1626164',team:'PHX', pos:'SG' },
  'austin reaves':    { id:'1630559',team:'LAL', pos:'SG' },
  'reaves':           { id:'1630559',team:'LAL', pos:'SG' },
  'anthony edwards':  { id:'1630162',team:'MIN', pos:'SG' },
  'ant edwards':      { id:'1630162',team:'MIN', pos:'SG' },
  'ant':              { id:'1630162',team:'MIN', pos:'SG' },
  'jaylen brown':     { id:'1627759',team:'BOS', pos:'SG' },
  'joel embiid':      { id:'203954', team:'PHI', pos:'C'  },
  'embiid':           { id:'203954', team:'PHI', pos:'C'  },
  'bam adebayo':      { id:'1628389',team:'MIA', pos:'C'  },
  'trae young':       { id:'1629027',team:'WAS', pos:'PG' },
  'trae':             { id:'1629027',team:'WAS', pos:'PG' },
  'darius garland':   { id:'1629636',team:'LAC', pos:'PG' },
  'garland':          { id:'1629636',team:'LAC', pos:'PG' },
  'james harden':     { id:'201935', team:'CLE', pos:'PG' },
  'harden':           { id:'201935', team:'CLE', pos:'PG' },
  'damian lillard':   { id:'203081', team:'MIL', pos:'PG' },
  'dame':             { id:'203081', team:'MIL', pos:'PG' },
  'cooper flagg':     { id:'1642843',team:'DAL', pos:'SF' },
  'flagg':            { id:'1642843',team:'DAL', pos:'SF' },
  'evan mobley':      { id:'1630596',team:'CLE', pos:'PF' },
  'mobley':           { id:'1630596',team:'CLE', pos:'PF' },
  'jalen brunson':    { id:'1628973',team:'NYK', pos:'PG' },
  'brunson':          { id:'1628973',team:'NYK', pos:'PG' },
  'alperen sengun':   { id:'1630578',team:'HOU', pos:'C'  },
  'sengun':           { id:'1630578',team:'HOU', pos:'C'  },
  'lamelo ball':      { id:'1630163',team:'CHA', pos:'PG' },
  'lamelo':           { id:'1630163',team:'CHA', pos:'PG' },
  'kawhi leonard':    { id:'202695', team:'LAC', pos:'SF' },
  'kawhi':            { id:'202695', team:'LAC', pos:'SF' },
  'mikal bridges':    { id:'1628969',team:'NYK', pos:'SF' },
  'paolo banchero':   { id:'1631094',team:'ORL', pos:'PF' },
  'banchero':         { id:'1631094',team:'ORL', pos:'PF' },
  'chet holmgren':    { id:'1631096',team:'OKC', pos:'C'  },
  'chet':             { id:'1631096',team:'OKC', pos:'C'  },
  'de\'aaron fox':    { id:'1628368',team:'SAC', pos:'PG' },
  'fox':              { id:'1628368',team:'SAC', pos:'PG' },
  'anthony davis':    { id:'203076', team:'WAS', pos:'PF' },
  'ad':               { id:'203076', team:'WAS', pos:'PF' },
  'jamal murray':     { id:'1627750',team:'DEN', pos:'PG' },
  'ja morant':        { id:'1629630',team:'MEM', pos:'PG' },
  'ja':               { id:'1629630',team:'MEM', pos:'PG' },
  'draymond green':   { id:'203110', team:'GSW', pos:'PF' },
  'draymond':         { id:'203110', team:'GSW', pos:'PF' },
  'tyler herro':      { id:'1629639',team:'MIA', pos:'SG' },
  'herro':            { id:'1629639',team:'MIA', pos:'SG' },
  'matas buzelis':    { id:'1642267',team:'CHI', pos:'SF' },
  'buzelis':          { id:'1642267',team:'CHI', pos:'SF' },
};

var TEAM_DB = {
  'celtics':'1610612738','lakers':'1610612747','warriors':'1610612744',
  'bucks':'1610612749','knicks':'1610612752','heat':'1610612748',
  'nuggets':'1610612743','cavaliers':'1610612739','cavs':'1610612739',
  'clippers':'1610612746','suns':'1610612756','mavericks':'1610612742',
  'mavs':'1610612742','76ers':'1610612755','sixers':'1610612755',
  'thunder':'1610612760','spurs':'1610612759','rockets':'1610612745',
  'timberwolves':'1610612750','wolves':'1610612750','raptors':'1610612761',
  'jazz':'1610612762','hawks':'1610612737','magic':'1610612753',
  'pacers':'1610612754','pistons':'1610612765','bulls':'1610612741',
  'nets':'1610612751','hornets':'1610612766','grizzlies':'1610612763',
  'pelicans':'1610612740','blazers':'1610612757','kings':'1610612758',
  'wizards':'1610612764',
};

// ── PARSE QUERY ──
function parseQuery(q) {
  var lower = q.toLowerCase().trim();
  var players = [];
  var team = null;
  var lastN = null;

  // Extract last N
  var lastMatch = lower.match(/last\s+(\d+)/);
  if (lastMatch) lastN = parseInt(lastMatch[1]);
  if (lower.includes('last 5')) lastN = 5;
  if (lower.includes('last 10')) lastN = 10;
  if (lower.includes('last 3')) lastN = 3;

  // Find players
  Object.entries(PLAYER_DB).forEach(function(e) {
    var name = e[0], data = e[1];
    if (lower.includes(name) && !players.find(function(p){ return p.id === data.id; })) {
      players.push(Object.assign({ name: name }, data));
    }
  });

  // Find team
  Object.entries(TEAM_DB).forEach(function(e) {
    var name = e[0], id = e[1];
    if (lower.includes(name)) { team = { name: name, id: id }; }
  });

  // Determine type
  if (players.length === 0 && !team) return { type: 'ai_only', query: q };
  if (players.length >= 1) {
    return { type: team ? 'player_vs_team' : 'player_stats',
             player: players[0], player2: players[1]||null, team, lastN, query: q };
  }
  return { type: 'ai_only', query: q };
}

// ── FETCH GAME LOG ──
async function fetchGameLog(playerId, oppTeamId, lastN) {
  var url = '/api/nba/gamelog?playerId=' + playerId;
  if (oppTeamId) url += '&oppTeamId=' + oppTeamId;
  var r = await fetch(url);
  var d = await r.json();
  if (!d.success || !d.data) throw new Error('No data');
  var headers = d.data.resultSets[0].headers;
  var rows = d.data.resultSets[0].rowSet;
  var idx = function(k){ return headers.indexOf(k); };
  var games = rows.map(function(r) {
    return {
      date:    (r[idx('GAME_DATE')]||'').split('T')[0],
      matchup: r[idx('MATCHUP')]||'',
      result:  r[idx('WL')]||'',
      pts:     r[idx('PTS')],
      reb:     r[idx('REB')],
      ast:     r[idx('AST')],
      stl:     r[idx('STL')],
      blk:     r[idx('BLK')],
      min:     r[idx('MIN')],
      fgm:     r[idx('FGM')], fga: r[idx('FGA')],
      fg3m:    r[idx('FG3M')], fg3a: r[idx('FG3A')],
      ftm:     r[idx('FTM')], fta: r[idx('FTA')],
    };
  });
  if (lastN) games = games.slice(0, lastN);
  return games;
}

// ── RENDER GAME LOG TABLE ──
function renderGameLog(games, title, subtitle, photoId) {
  if (!games.length) return '<div class="stats-no-data">No games found</div>';
  var avgPts = (games.reduce(function(a,g){ return a+(parseFloat(g.pts)||0); },0)/games.length).toFixed(1);
  var avgReb = (games.reduce(function(a,g){ return a+(parseFloat(g.reb)||0); },0)/games.length).toFixed(1);
  var avgAst = (games.reduce(function(a,g){ return a+(parseFloat(g.ast)||0); },0)/games.length).toFixed(1);
  var wins   = games.filter(function(g){ return g.result==='W'; }).length;

  var html = '<div class="sl-card">';
  // Header
  html += '<div class="sl-head">';
  if (photoId) html += '<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+photoId+'.png" onerror="this.style.display=\'none\'" class="sl-photo">';
  html += '<div><div class="sl-title">'+escHtml(title)+'</div><div class="sl-sub">'+escHtml(subtitle)+'</div></div></div>';
  // Averages
  html += '<div class="sl-avgs">'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgPts+'</div><div class="sl-avg-l">PPG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgReb+'</div><div class="sl-avg-l">RPG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgAst+'</div><div class="sl-avg-l">APG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+wins+'-'+(games.length-wins)+'</div><div class="sl-avg-l">W-L</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+games.length+'</div><div class="sl-avg-l">Games</div></div>'
  + '</div>';
  // Table
  html += '<div class="sl-table-wrap"><table class="sl-table">';
  html += '<thead><tr><th>Date</th><th>Matchup</th><th>W/L</th><th class="gold">PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG</th><th>3PT</th><th>FT</th><th>MIN</th></tr></thead><tbody>';
  games.forEach(function(g, i) {
    var hi = parseFloat(g.pts) >= 30;
    var win = g.result === 'W';
    html += '<tr class="'+(i%2===0?'even':'')+'">'
      + '<td class="muted small">'+g.date+'</td>'
      + '<td class="small">'+g.matchup+'</td>'
      + '<td class="'+(win?'win':'loss')+' bold">'+g.result+'</td>'
      + '<td class="'+(hi?'gold':'')+ ' bold">'+g.pts+'</td>'
      + '<td>'+g.reb+'</td><td>'+g.ast+'</td><td>'+g.stl+'</td><td>'+g.blk+'</td>'
      + '<td class="muted small">'+g.fgm+'/'+g.fga+'</td>'
      + '<td class="muted small">'+g.fg3m+'/'+g.fg3a+'</td>'
      + '<td class="muted small">'+g.ftm+'/'+g.fta+'</td>'
      + '<td class="muted small">'+g.min+'</td>'
    + '</tr>';
  });
  html += '</tbody></table></div></div>';
  return html;
}

// ── MAIN SEARCH HANDLER ──
window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q = inp ? inp.value.trim() : '';
  if (!q) return;
  inp.value = '';

  addStatsMsg('user', q);
  var parsed = parseQuery(q);
  var typingId = addStatsTyping();

  // Safety timeout — always resolves in 15s max
  var resolved = false;
  var safetyTimer = setTimeout(function() {
    if (!resolved) {
      resolved = true;
      removeStatsTyping(typingId);
      addStatsResult('', 'Request timed out. The NBA Stats API may be slow. Try again!');
    }
  }, 15000);

  try {
    var gameLogHtml = '';
    var aiContext = '';

    // 1. If player mentioned — try game log with its own timeout
    if (parsed.player) {
      try {
        var oppId = parsed.team ? parsed.team.id : null;
        var glPromise = fetchGameLog(parsed.player.id, oppId, parsed.lastN);
        var glTimeout = new Promise(function(_, rej){ setTimeout(function(){ rej(new Error('timeout')); }, 6000); });
        var games = await Promise.race([glPromise, glTimeout]);
        var title = titleCase(parsed.player.name) + ' (' + parsed.player.team + ')';
        var sub = parsed.team
          ? 'vs ' + titleCase(parsed.team.name) + ' · ' + games.length + ' games · 2025-26'
          : (parsed.lastN ? 'Last ' + games.length + ' games' : 'Full season') + ' · 2025-26';
        gameLogHtml = renderGameLog(games, title, sub, parsed.player.id);
        if (games.length) {
          var avgPts = (games.reduce(function(a,g){ return a+(parseFloat(g.pts)||0); },0)/games.length).toFixed(1);
          var avgReb = (games.reduce(function(a,g){ return a+(parseFloat(g.reb)||0); },0)/games.length).toFixed(1);
          var avgAst = (games.reduce(function(a,g){ return a+(parseFloat(g.ast)||0); },0)/games.length).toFixed(1);
          aiContext = titleCase(parsed.player.name) + ' averages ' + avgPts + ' pts, ' + avgReb + ' reb, ' + avgAst + ' ast in these ' + games.length + ' games.';
          var recent3 = games.slice(0,3).map(function(g){ return g.pts+'pts'; }).join(', ');
          aiContext += ' Last 3 outings: ' + recent3 + '.';
        }
      } catch(e) {
        gameLogHtml = '<div class="stats-api-note">📊 Live game log unavailable — using AI knowledge instead.</div>';
      }
    }

    // 2. AI answer with 10s timeout
    var slipContext = buildSlipContext();
    var aiPromise = fetch('/api/stats/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, slipContext: slipContext, gameLogContext: aiContext })
    }).then(function(r){ return r.json(); });
    var aiTimeout = new Promise(function(res){ setTimeout(function(){ res({success:true,answer:'Taking longer than usual — try again in a moment.'}); }, 10000); });
    var d = await Promise.race([aiPromise, aiTimeout]);

    if (!resolved) {
      resolved = true;
      clearTimeout(safetyTimer);
      removeStatsTyping(typingId);
      addStatsResult(gameLogHtml, d.success ? d.answer : 'Unable to answer right now.');
    }

  } catch(e) {
    if (!resolved) {
      resolved = true;
      clearTimeout(safetyTimer);
      removeStatsTyping(typingId);
      addStatsResult('', 'Connection error — check your internet and try again.');
    }
  }
};

function buildSlipContext() {
  var picks = window.slipPicks || [];
  if (!picks.length) return 'The user has no picks on their slip yet.';
  return 'The user\'s current pick slip: ' + picks.map(function(p){
    return p.label + ' (' + p.conf + '% confidence)';
  }).join(', ') + '. Combined probability: ' + Math.round(picks.reduce(function(a,p){ return a*(p.conf/100); },1)*100) + '%.';
}

// ── CHAT UI ──
function addStatsMsg(role, text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  document.getElementById('stats-empty').style.display = 'none';
  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-' + role;
  div.innerHTML = '<div class="stats-bubble stats-bubble-'+role+'">'+escHtml(text)+'</div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addStatsResult(tableHtml, aiText) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-ai';
  div.innerHTML = '<div class="stats-result-wrap">'
    + (tableHtml ? tableHtml : '')
    + '<div class="stats-ai-bubble">'
    + '<div class="stats-ai-label">🤖 BeepBopStats</div>'
    + '<div class="stats-ai-text">'+escHtml(aiText)+'</div>'
    + '</div>'
  + '</div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addStatsTyping(id) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return 'typing';
  var tid = 'typing-' + Date.now();
  var div = document.createElement('div');
  div.id = tid; div.className = 'stats-msg stats-msg-ai';
  div.innerHTML = '<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return tid;
}

function removeStatsTyping(id) { var el = document.getElementById(id); if(el) el.remove(); }
function escHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>'); }
function titleCase(s){ return (s||'').split(' ').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' '); }

window.clearChat = function() {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  chat.innerHTML = '';
  document.getElementById('stats-empty').style.display = 'flex';
};

window.runSearch = function(q) {
  var inp = document.getElementById('stats-input');
  if (inp) inp.value = q;
  window.searchStats();
};

window.initStats = function() {
  var el = document.getElementById('stats-suggestions');
  if (!el) return;
  var examples = [
    'LeBron last 10 games','Mitchell vs Lakers','Curry vs Warriors last 5',
    'Giannis stats','Brunson vs Rockets','Best parlay tonight',
    'Who should I add to my slip?','Analyze my current picks',
    'Trae Young stats on Wizards','Garland with Clippers',
    'Is Cade Cunningham playing?','Wembanyama blocks this season',
  ];
  el.innerHTML = examples.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s.replace(/'/g,"\\'")+'\')">'+s+'</div>';
  }).join('');
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 400);
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if (inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 500);
});
