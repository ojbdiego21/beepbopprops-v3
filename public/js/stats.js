// BeepBopStats — StatMuse search + AI with memory + real game logs

var statsHistory = []; // conversation memory
var PLAYER_DB = {
  'stephen curry':{'id':'201939','team':'GSW','pos':'PG'},
  'steph curry':{'id':'201939','team':'GSW','pos':'PG'},
  'lebron james':{'id':'2544','team':'LAL','pos':'SF'},
  'lebron':{'id':'2544','team':'LAL','pos':'SF'},
  'kevin durant':{'id':'201142','team':'HOU','pos':'SF'},
  'kd':{'id':'201142','team':'HOU','pos':'SF'},
  'giannis':{'id':'203507','team':'MIL','pos':'PF'},
  'giannis antetokounmpo':{'id':'203507','team':'MIL','pos':'PF'},
  'nikola jokic':{'id':'203999','team':'DEN','pos':'C'},
  'jokic':{'id':'203999','team':'DEN','pos':'C'},
  'jayson tatum':{'id':'1628369','team':'BOS','pos':'SF'},
  'tatum':{'id':'1628369','team':'BOS','pos':'SF'},
  'luka doncic':{'id':'1629029','team':'LAL','pos':'PG'},
  'luka':{'id':'1629029','team':'LAL','pos':'PG'},
  'shai gilgeous-alexander':{'id':'1628983','team':'OKC','pos':'PG'},
  'sga':{'id':'1628983','team':'OKC','pos':'PG'},
  'donovan mitchell':{'id':'1628378','team':'CLE','pos':'SG'},
  'mitchell':{'id':'1628378','team':'CLE','pos':'SG'},
  'tyrese maxey':{'id':'1630178','team':'PHI','pos':'PG'},
  'maxey':{'id':'1630178','team':'PHI','pos':'PG'},
  'victor wembanyama':{'id':'1641705','team':'SAS','pos':'C'},
  'wembanyama':{'id':'1641705','team':'SAS','pos':'C'},
  'wemby':{'id':'1641705','team':'SAS','pos':'C'},
  'devin booker':{'id':'1626164','team':'PHX','pos':'SG'},
  'booker':{'id':'1626164','team':'PHX','pos':'SG'},
  'austin reaves':{'id':'1630559','team':'LAL','pos':'SG'},
  'reaves':{'id':'1630559','team':'LAL','pos':'SG'},
  'anthony edwards':{'id':'1630162','team':'MIN','pos':'SG'},
  'ant edwards':{'id':'1630162','team':'MIN','pos':'SG'},
  'ant':{'id':'1630162','team':'MIN','pos':'SG'},
  'jaylen brown':{'id':'1627759','team':'BOS','pos':'SG'},
  'joel embiid':{'id':'203954','team':'PHI','pos':'C'},
  'embiid':{'id':'203954','team':'PHI','pos':'C'},
  'bam adebayo':{'id':'1628389','team':'MIA','pos':'C'},
  'trae young':{'id':'1629027','team':'WAS','pos':'PG'},
  'trae':{'id':'1629027','team':'WAS','pos':'PG'},
  'darius garland':{'id':'1629636','team':'LAC','pos':'PG'},
  'garland':{'id':'1629636','team':'LAC','pos':'PG'},
  'james harden':{'id':'201935','team':'CLE','pos':'PG'},
  'harden':{'id':'201935','team':'CLE','pos':'PG'},
  'damian lillard':{'id':'203081','team':'MIL','pos':'PG'},
  'dame':{'id':'203081','team':'MIL','pos':'PG'},
  'cooper flagg':{'id':'1642843','team':'DAL','pos':'SF'},
  'flagg':{'id':'1642843','team':'DAL','pos':'SF'},
  'evan mobley':{'id':'1630596','team':'CLE','pos':'PF'},
  'mobley':{'id':'1630596','team':'CLE','pos':'PF'},
  'jalen brunson':{'id':'1628973','team':'NYK','pos':'PG'},
  'brunson':{'id':'1628973','team':'NYK','pos':'PG'},
  'alperen sengun':{'id':'1630578','team':'HOU','pos':'C'},
  'sengun':{'id':'1630578','team':'HOU','pos':'C'},
  'lamelo ball':{'id':'1630163','team':'CHA','pos':'PG'},
  'lamelo':{'id':'1630163','team':'CHA','pos':'PG'},
  'anthony davis':{'id':'203076','team':'WAS','pos':'PF'},
  'ad':{'id':'203076','team':'WAS','pos':'PF'},
  'paolo banchero':{'id':'1631094','team':'ORL','pos':'PF'},
  'banchero':{'id':'1631094','team':'ORL','pos':'PF'},
  'jalen johnson':{'id':'1630552','team':'ATL','pos':'SF'},
  'dyson daniels':{'id':'1630700','team':'ATL','pos':'SG'},
  'dyson':{'id':'1630700','team':'ATL','pos':'SG'},
  'onyeka okongwu':{'id':'1630168','team':'ATL','pos':'C'},
  'okongwu':{'id':'1630168','team':'ATL','pos':'C'},
  'jonathan kuminga':{'id':'1630228','team':'ATL','pos':'SF'},
  'kuminga':{'id':'1630228','team':'ATL','pos':'SF'},
  'cj mccollum':{'id':'203468','team':'ATL','pos':'SG'},
  'mccollum':{'id':'203468','team':'ATL','pos':'SG'},
  'nickeil alexander-walker':{'id':'1629638','team':'ATL','pos':'SG'},
  'chet holmgren':{'id':'1631096','team':'OKC','pos':'C'},
  'chet':{'id':'1631096','team':'OKC','pos':'C'},
  'ja morant':{'id':'1629630','team':'MEM','pos':'PG'},
  'ja':{'id':'1629630','team':'MEM','pos':'PG'},
  'draymond green':{'id':'203110','team':'GSW','pos':'PF'},
  'tyler herro':{'id':'1629639','team':'MIA','pos':'SG'},
  'herro':{'id':'1629639','team':'MIA','pos':'SG'},
  'scottie barnes':{'id':'1630567','team':'TOR','pos':'PF'},
  'karl-anthony towns':{'id':'1626157','team':'NYK','pos':'C'},
  'towns':{'id':'1626157','team':'NYK','pos':'C'},
  'de\'aaron fox':{'id':'1628368','team':'SAC','pos':'PG'},
  'fox':{'id':'1628368','team':'SAC','pos':'PG'},
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

function parseQuery(q) {
  var lower = q.toLowerCase().trim();
  var players = [], team = null, lastN = null;
  var lastMatch = lower.match(/last\s*(\d+)/);
  if (lastMatch) lastN = parseInt(lastMatch[1]);
  Object.entries(PLAYER_DB).forEach(function(e) {
    var d = e[1];
    if (lower.includes(e[0]) && !players.find(function(p){ return p.id===d.id; }))
      players.push(Object.assign({name:e[0]},d));
  });
  Object.entries(TEAM_DB).forEach(function(e) {
    if (lower.includes(e[0])) team={name:e[0],id:e[1]};
  });
  if (!players.length && !team) return {type:'ai_only',query:q};
  return {type:'player_stats',player:players[0],player2:players[1]||null,team,lastN,query:q};
}

async function fetchGameLog(playerId, oppTeamId, lastN) {
  var url = '/api/nba/gamelog?playerId=' + playerId;
  if (oppTeamId) url += '&oppTeamId=' + oppTeamId;
  var r = await fetch(url);
  var d = await r.json();
  if (!d.success || !d.data) throw new Error('No data');
  var headers = d.data.resultSets[0].headers;
  var rows = d.data.resultSets[0].rowSet;
  var idx = function(k){ return headers.indexOf(k); };
  var games = rows.map(function(r){
    return {
      date:(r[idx('GAME_DATE')]||'').split('T')[0],
      matchup:r[idx('MATCHUP')]||'',result:r[idx('WL')]||'',
      pts:r[idx('PTS')],reb:r[idx('REB')],ast:r[idx('AST')],
      stl:r[idx('STL')],blk:r[idx('BLK')],min:r[idx('MIN')],
      fgm:r[idx('FGM')],fga:r[idx('FGA')],
      fg3m:r[idx('FG3M')],fg3a:r[idx('FG3A')],
      ftm:r[idx('FTM')],fta:r[idx('FTA')],
    };
  });
  if (lastN) games = games.slice(0,lastN);
  return games;
}

function renderGameLog(games, title, subtitle, photoId) {
  if (!games.length) return '<div class="stats-no-data">No games found</div>';
  var avgPts = (games.reduce(function(a,g){return a+(parseFloat(g.pts)||0);},0)/games.length).toFixed(1);
  var avgReb = (games.reduce(function(a,g){return a+(parseFloat(g.reb)||0);},0)/games.length).toFixed(1);
  var avgAst = (games.reduce(function(a,g){return a+(parseFloat(g.ast)||0);},0)/games.length).toFixed(1);
  var wins = games.filter(function(g){return g.result==='W';}).length;
  var html = '<div class="sl-card">';
  html += '<div class="sl-head">';
  if (photoId && photoId !== '0') html += '<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+photoId+'.png" onerror="this.style.display=\'none\'" class="sl-photo">';
  html += '<div><div class="sl-title">'+escHtml(title)+'</div><div class="sl-sub">'+escHtml(subtitle)+'</div></div></div>';
  html += '<div class="sl-avgs">'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgPts+'</div><div class="sl-avg-l">PPG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgReb+'</div><div class="sl-avg-l">RPG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+avgAst+'</div><div class="sl-avg-l">APG</div></div>'
    + '<div class="sl-avg"><div class="sl-avg-v">'+wins+'-'+(games.length-wins)+'</div><div class="sl-avg-l">W-L</div></div>'
    + '</div>';
  html += '<div class="sl-table-wrap"><table class="sl-table"><thead><tr>'
    + '<th>Date</th><th>Matchup</th><th>W/L</th><th class="gold">PTS</th>'
    + '<th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG</th><th>3PT</th><th>MIN</th>'
    + '</tr></thead><tbody>';
  games.forEach(function(g,i){
    var hi = parseFloat(g.pts) >= 30;
    html += '<tr class="'+(i%2===0?'even':'')+'">'
      + '<td class="muted small">'+g.date+'</td>'
      + '<td class="small">'+g.matchup+'</td>'
      + '<td class="'+(g.result==='W'?'win':'loss')+' bold">'+g.result+'</td>'
      + '<td class="'+(hi?'gold':'')+ ' bold">'+g.pts+'</td>'
      + '<td>'+g.reb+'</td><td>'+g.ast+'</td><td>'+g.stl+'</td><td>'+g.blk+'</td>'
      + '<td class="muted small">'+g.fgm+'/'+g.fga+'</td>'
      + '<td class="muted small">'+g.fg3m+'/'+g.fg3a+'</td>'
      + '<td class="muted small">'+g.min+'</td>'
    + '</tr>';
  });
  html += '</tbody></table></div></div>';
  return html;
}

window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q = inp ? inp.value.trim() : '';
  if (!q) return;
  inp.value = '';
  addStatsMsg('user', q);
  // Add to history for memory
  statsHistory.push({role:'user', content: q});
  var typingId = addStatsTyping();
  var resolved = false;
  var safetyTimer = setTimeout(function(){
    if (!resolved) { resolved=true; removeStatsTyping(typingId); addStatsResult('','Request timed out — try again!'); }
  }, 20000);
  try {
    var parsed = parseQuery(q);
    var gameLogHtml = '';
    var aiContext = '';
    if (parsed.player) {
      try {
        var oppId = parsed.team ? parsed.team.id : null;
        var glPromise = fetchGameLog(parsed.player.id, oppId, parsed.lastN);
        var glTimeout = new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout'));},7000);});
        var games = await Promise.race([glPromise, glTimeout]);
        var title = titleCase(parsed.player.name)+' ('+parsed.player.team+')';
        var sub = parsed.team
          ? 'vs '+titleCase(parsed.team.name)+' · '+games.length+' games'
          : (parsed.lastN ? 'Last '+games.length+' games' : 'Full season 2025-26');
        gameLogHtml = renderGameLog(games, title, sub, parsed.player.id);
        if (games.length) {
          var avgPts = (games.reduce(function(a,g){return a+(parseFloat(g.pts)||0);},0)/games.length).toFixed(1);
          var avgReb = (games.reduce(function(a,g){return a+(parseFloat(g.reb)||0);},0)/games.length).toFixed(1);
          var avgAst = (games.reduce(function(a,g){return a+(parseFloat(g.ast)||0);},0)/games.length).toFixed(1);
          aiContext = titleCase(parsed.player.name)+' averages '+avgPts+' pts, '+avgReb+' reb, '+avgAst+' ast in these '+games.length+' games.';
          var recent3 = games.slice(0,3).map(function(g){return g.pts+'pts';}).join(', ');
          aiContext += ' Recent: '+recent3+'.';
        }
      } catch(e) {
        // Don't show error — server will provide game log in response if available
        gameLogHtml = '';
      }
    }
    var slipContext = buildSlipContext();
    // Send full conversation history for memory
    var r = await fetch('/api/stats/ask', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        question: q,
        history: statsHistory.slice(-10), // last 10 messages for memory
        slipContext: slipContext,
        gameLogContext: aiContext
      })
    });
    var d = await r.json();
    // Add AI response to history
    if (d.success && d.answer) statsHistory.push({role:'assistant', content: d.answer});
    // Always prefer server game log (it has proper NBA headers)
    var serverGameLog = d.gameLog;
    if (serverGameLog && serverGameLog.length) {
      // Build game log from server data
      var glHtml = '<div class="sl-card"><div class="sl-head"><div><div class="sl-title">Game Log</div><div class="sl-sub">'+serverGameLog.length+' games · 2025-26</div></div></div>';
      glHtml += '<div class="sl-table-wrap"><table class="sl-table"><thead><tr><th>Date</th><th>Matchup</th><th>W/L</th><th class="gold">PTS</th><th>REB</th><th>AST</th><th>FG</th><th>3PT</th><th>MIN</th></tr></thead><tbody>';
      serverGameLog.forEach(function(g,i){
        glHtml += '<tr class="'+(i%2===0?'even':'')+'"><td class="muted small">'+g.date+'</td><td class="small">'+g.matchup+'</td><td class="'+(g.result==='W'?'win':'loss')+' bold">'+g.result+'</td><td class="'+(parseFloat(g.pts)>=30?'gold':'')+ ' bold">'+g.pts+'</td><td>'+g.reb+'</td><td>'+g.ast+'</td><td class="muted small">'+g.fgm+'/'+g.fga+'</td><td class="muted small">'+g.fg3m+'/'+g.fg3a+'</td><td class="muted small">'+g.min+'</td></tr>';
      });
      glHtml += '</tbody></table></div></div>';
      gameLogHtml = glHtml;
    }
    if (!resolved) {
      resolved = true; clearTimeout(safetyTimer); removeStatsTyping(typingId);
      addStatsResult(gameLogHtml, d.success ? d.answer : 'Unable to answer — try again.');
    }
  } catch(e) {
    if (!resolved) { resolved=true; clearTimeout(safetyTimer); removeStatsTyping(typingId); addStatsResult('','Connection error — try again.'); }
  }
};

function buildSlipContext() {
  var picks = window.slipPicks || [];
  if (!picks.length) return 'No picks on slip yet.';
  return 'Current slip: '+picks.map(function(p){return p.label+' ('+p.conf+'%)';}).join(', ')+'. Combined prob: '+Math.round(picks.reduce(function(a,p){return a*(p.conf/100);},1)*100)+'%.';
}

function addStatsMsg(role, text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  document.getElementById('stats-empty').style.display='none';
  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-'+role;
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
    + (tableHtml || '')
    + '<div class="stats-ai-bubble"><div class="stats-ai-label">🤖 BeepBopStats</div>'
    + '<div class="stats-ai-text">'+escHtml(aiText)+'</div></div>'
  + '</div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addStatsTyping() {
  var chat = document.getElementById('stats-chat');
  if (!chat) return 'typing';
  var tid = 'typing-'+Date.now();
  var div = document.createElement('div');
  div.id=tid; div.className='stats-msg stats-msg-ai';
  div.innerHTML='<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return tid;
}
function removeStatsTyping(id){var el=document.getElementById(id);if(el)el.remove();}
function escHtml(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');}
function titleCase(s){return(s||'').split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(' ');}

window.clearChat = function() {
  var chat = document.getElementById('stats-chat');
  if (chat) chat.innerHTML='';
  document.getElementById('stats-empty').style.display='flex';
  statsHistory = []; // clear memory too
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
    'LeBron last 10 games','Banchero vs Hawks','Curry vs Celtics last 5',
    'Jalen Johnson stats','Brunson vs Rockets','Analyze my current picks',
    'Who should I parlay tonight?','Wemby blocks this season',
    'Mitchell vs Cavaliers','Okongwu rebounds last 10',
    'Is Kyrie Irving playing?','Best pick for tonight',
  ];
  el.innerHTML = examples.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s.replace(/'/g,"\\'")+'\')">'+s+'</div>';
  }).join('');
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 400);
  setTimeout(function(){
    var inp=document.getElementById('stats-input');
    if(inp) inp.addEventListener('keydown',function(e){if(e.key==='Enter')window.searchStats();});
  },500);
});
