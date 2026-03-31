// BeepBopStats — browser-side NBA stats engine
// Calls NBA Stats API directly from browser to avoid server blocks

const PLAYER_DB = {
  'stephen curry':    { id:201939,  team:'GSW', photoId:'201939'  },
  'steph curry':      { id:201939,  team:'GSW', photoId:'201939'  },
  'lebron james':     { id:2544,    team:'LAL', photoId:'2544'    },
  'lebron':           { id:2544,    team:'LAL', photoId:'2544'    },
  'kevin durant':     { id:201142,  team:'HOU', photoId:'201142'  },
  'kd':               { id:201142,  team:'HOU', photoId:'201142'  },
  'giannis antetokounmpo': { id:203507, team:'MIL', photoId:'203507' },
  'giannis':          { id:203507,  team:'MIL', photoId:'203507'  },
  'nikola jokic':     { id:203999,  team:'DEN', photoId:'203999'  },
  'jokic':            { id:203999,  team:'DEN', photoId:'203999'  },
  'jayson tatum':     { id:1628369, team:'BOS', photoId:'1628369' },
  'tatum':            { id:1628369, team:'BOS', photoId:'1628369' },
  'luka doncic':      { id:1629029, team:'LAL', photoId:'1629029' },
  'luka':             { id:1629029, team:'LAL', photoId:'1629029' },
  'shai gilgeous-alexander': { id:1628983, team:'OKC', photoId:'1628983' },
  'sga':              { id:1628983, team:'OKC', photoId:'1628983' },
  'donovan mitchell': { id:1628378, team:'CLE', photoId:'1628378' },
  'mitchell':         { id:1628378, team:'CLE', photoId:'1628378' },
  'tyrese maxey':     { id:1630178, team:'PHI', photoId:'1630178' },
  'maxey':            { id:1630178, team:'PHI', photoId:'1630178' },
  'victor wembanyama':{ id:1641705, team:'SAS', photoId:'1641705' },
  'wemby':            { id:1641705, team:'SAS', photoId:'1641705' },
  'devin booker':     { id:1626164, team:'PHX', photoId:'1626164' },
  'booker':           { id:1626164, team:'PHX', photoId:'1626164' },
  'klay thompson':    { id:202691,  team:'DAL', photoId:'202691'  },
  'klay':             { id:202691,  team:'DAL', photoId:'202691'  },
  'austin reaves':    { id:1631244, team:'LAL', photoId:'1631244' },
  'reaves':           { id:1631244, team:'LAL', photoId:'1631244' },
  'anthony edwards':  { id:1630162, team:'MIN', photoId:'1630162' },
  'ant':              { id:1630162, team:'MIN', photoId:'1630162' },
  'jaylen brown':     { id:1627759, team:'BOS', photoId:'1627759' },
  'joel embiid':      { id:203954,  team:'PHI', photoId:'203954'  },
  'embiid':           { id:203954,  team:'PHI', photoId:'203954'  },
  'bam adebayo':      { id:1628389, team:'MIA', photoId:'1628389' },
  'bam':              { id:1628389, team:'MIA', photoId:'1628389' },
  'trae young':       { id:1629027, team:'WAS', photoId:'1629027' },
  'trae':             { id:1629027, team:'WAS', photoId:'1629027' },
  'darius garland':   { id:1629636, team:'LAC', photoId:'1629636' },
  'garland':          { id:1629636, team:'LAC', photoId:'1629636' },
  'james harden':     { id:201935,  team:'CLE', photoId:'201935'  },
  'harden':           { id:201935,  team:'CLE', photoId:'201935'  },
  'damian lillard':   { id:203081,  team:'MIL', photoId:'203081'  },
  'dame':             { id:203081,  team:'MIL', photoId:'203081'  },
  'cooper flagg':     { id:1642366, team:'DAL', photoId:'1642366' },
  'flagg':            { id:1642366, team:'DAL', photoId:'1642366' },
  'chet holmgren':    { id:1631096, team:'OKC', photoId:'1631096' },
  'chet':             { id:1631096, team:'OKC', photoId:'1631096' },
  'evan mobley':      { id:1630596, team:'CLE', photoId:'1630596' },
  'mobley':           { id:1630596, team:'CLE', photoId:'1630596' },
  'jalen brunson':    { id:1628386, team:'NYK', photoId:'1628386' },
  'brunson':          { id:1628386, team:'NYK', photoId:'1628386' },
  'alperen sengun':   { id:1630578, team:'HOU', photoId:'1630578' },
  'sengun':           { id:1630578, team:'HOU', photoId:'1630578' },
  'tyler herro':      { id:1629639, team:'MIA', photoId:'1629639' },
  'herro':            { id:1629639, team:'MIA', photoId:'1629639' },
  'lamelo ball':      { id:1630163, team:'CHA', photoId:'1630163' },
  'lamelo':           { id:1630163, team:'CHA', photoId:'1630163' },
  'kawhi leonard':    { id:202695,  team:'LAC', photoId:'202695'  },
  'kawhi':            { id:202695,  team:'LAC', photoId:'202695'  },
  'mikal bridges':    { id:1628969, team:'NYK', photoId:'1628969' },
  'de\'aaron fox':    { id:1628368, team:'SAC', photoId:'1628368' },
  'fox':              { id:1628368, team:'SAC', photoId:'1628368' },
  'dyson daniels':    { id:1631107, team:'ATL', photoId:'1631107' },
  'daniels':          { id:1631107, team:'ATL', photoId:'1631107' },
  'amen thompson':    { id:1641734, team:'HOU', photoId:'1641734' },
  'jalen johnson':    { id:1630552, team:'ATL', photoId:'1630552' },
  'anthony davis':    { id:203076,  team:'WAS', photoId:'203076'  },
  'ad':               { id:203076,  team:'WAS', photoId:'203076'  },
  'jonathan kuminga': { id:1630557, team:'ATL', photoId:'1630557' },
  'kuminga':          { id:1630557, team:'ATL', photoId:'1630557' },
  'cade cunningham':  { id:1630595, team:'DET', photoId:'1630595' },
  'cade':             { id:1630595, team:'DET', photoId:'1630595' },
  'paolo banchero':   { id:1631094, team:'ORL', photoId:'1631094' },
  'banchero':         { id:1631094, team:'ORL', photoId:'1631094' },
  'ja morant':        { id:1629630, team:'MEM', photoId:'1629630' },
  'ja':               { id:1629630, team:'MEM', photoId:'1629630' },
  'jamal murray':     { id:1627750, team:'DEN', photoId:'1627750' },
  'murray':           { id:1627750, team:'DEN', photoId:'1627750' },
  'draymond green':   { id:203110,  team:'GSW', photoId:'203110'  },
  'draymond':         { id:203110,  team:'GSW', photoId:'203110'  },
  'kyrie irving':     { id:202681,  team:'DAL', photoId:'202681'  },
  'kyrie':            { id:202681,  team:'DAL', photoId:'202681'  },
  'jaren jackson jr': { id:1628386, team:'UTA', photoId:'1628386' },
  'jjj':              { id:1628386, team:'UTA', photoId:'1628386' },
  'matas buzelis':    { id:1642267, team:'CHI', photoId:'1642267' },
  'buzelis':          { id:1642267, team:'CHI', photoId:'1642267' },
  'norm powell':      { id:1626181, team:'MIA', photoId:'1626181' },
  'norman powell':    { id:1626181, team:'MIA', photoId:'1626181' },
  'josh giddey':      { id:1630581, team:'CHI', photoId:'1630581' },
  'giddey':           { id:1630581, team:'CHI', photoId:'1630581' },
  'scottie barnes':   { id:1630567, team:'TOR', photoId:'1630567' },
  'zion williamson':  { id:1629627, team:'NOP', photoId:'1629627' },
  'zion':             { id:1629627, team:'NOP', photoId:'1629627' },
  'desmond bane':     { id:1630217, team:'MEM', photoId:'1630217' },
  'lauri markkanen':  { id:1628374, team:'UTA', photoId:'1628374' },
  'rob dillingham':   { id:1642363, team:'CHI', photoId:'1642363' },
  'dillingham':       { id:1642363, team:'CHI', photoId:'1642363' },
};

const TEAM_DB = {
  'hawks':'1610612737','celtics':'1610612738','nets':'1610612751','hornets':'1610612766',
  'bulls':'1610612741','cavaliers':'1610612739','mavericks':'1610612742','nuggets':'1610612743',
  'pistons':'1610612765','warriors':'1610612744','rockets':'1610612745','pacers':'1610612754',
  'clippers':'1610612746','lakers':'1610612747','grizzlies':'1610612763','heat':'1610612748',
  'bucks':'1610612749','timberwolves':'1610612750','pelicans':'1610612740','knicks':'1610612752',
  'thunder':'1610612760','magic':'1610612753','76ers':'1610612755','sixers':'1610612755',
  'suns':'1610612756','blazers':'1610612757','trail blazers':'1610612757','kings':'1610612758',
  'spurs':'1610612759','raptors':'1610612761','jazz':'1610612762','wizards':'1610612764',
  'atl':'1610612737','bos':'1610612738','bkn':'1610612751','cha':'1610612766',
  'chi':'1610612741','cle':'1610612739','dal':'1610612742','den':'1610612743',
  'det':'1610612765','gsw':'1610612744','hou':'1610612745','ind':'1610612754',
  'lac':'1610612746','lal':'1610612747','mem':'1610612763','mia':'1610612748',
  'mil':'1610612749','min':'1610612750','nop':'1610612740','nyk':'1610612752',
  'okc':'1610612760','orl':'1610612753','phi':'1610612755','phx':'1610612756',
  'por':'1610612757','sac':'1610612758','sas':'1610612759','tor':'1610612761',
  'uta':'1610612762','was':'1610612764',
};

const NBA_PROXY = 'https://stats.nba.com/stats/';

function parseQuery(q) {
  var lower = q.toLowerCase().trim();
  var player1 = null, player2 = null, team = null;
  var players = [];

  // Find all players mentioned
  for (var [name, data] of Object.entries(PLAYER_DB)) {
    if (lower.includes(name)) {
      if (!players.find(function(p){ return p.id === data.id; })) {
        players.push({ name: name, ...data });
      }
    }
  }

  // Find team mentioned
  for (var [name, id] of Object.entries(TEAM_DB)) {
    if (lower.includes(name)) { team = { name: name, id: id }; break; }
  }

  // Determine query type
  if (players.length >= 2) return { type: 'player_vs_player', players };
  if (players.length === 1 && team) return { type: 'player_vs_team', player: players[0], team };
  if (players.length === 1) return { type: 'player_season', player: players[0] };
  return { type: 'unknown' };
}

async function fetchNBA(endpoint, params) {
  var url = NBA_PROXY + endpoint + '?';
  var pairs = Object.entries(params).map(function([k,v]){ return k+'='+encodeURIComponent(v); });
  url += pairs.join('&');

  var response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'https://www.nba.com',
      'Origin': 'https://www.nba.com',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'x-nba-stats-origin': 'stats',
      'x-nba-stats-token': 'true',
    },
    mode: 'cors',
  });

  if (!response.ok) throw new Error('NBA API returned ' + response.status);
  return response.json();
}

function formatDate(d) {
  if (!d) return '';
  // Format: 2025-11-01T00:00:00 → Nov 1
  var parts = d.split('T')[0].split('-');
  var months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(parts[1])] + ' ' + parseInt(parts[2]);
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function titleCase(s) {
  return (s||'').split(' ').map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(' ');
}

async function getPlayerGameLog(playerId, oppTeamId) {
  var params = {
    PlayerID: playerId,
    Season: '2025-26',
    SeasonType: 'Regular Season',
    PerMode: 'Totals',
    LeagueID: '00',
  };
  if (oppTeamId) params.OppTeamID = oppTeamId;

  var data = await fetchNBA('playergamelogs', params);
  var headers = data.resultSets[0].headers;
  var rows = data.resultSets[0].rowSet.slice(0, 10);

  var idx = function(k) { return headers.indexOf(k); };
  return rows.map(function(r) {
    return {
      date:   formatDate(r[idx('GAME_DATE')]),
      matchup: r[idx('MATCHUP')] || '',
      result: r[idx('WL')] || '',
      pts:    r[idx('PTS')],
      reb:    r[idx('REB')],
      ast:    r[idx('AST')],
      stl:    r[idx('STL')],
      blk:    r[idx('BLK')],
      min:    r[idx('MIN')],
      fgm:    r[idx('FGM')],
      fga:    r[idx('FGA')],
      fg3m:   r[idx('FG3M')],
      fg3a:   r[idx('FG3A')],
      ftm:    r[idx('FTM')],
      fta:    r[idx('FTA')],
    };
  });
}

async function getPlayerSeasonAverages(playerId) {
  var data = await fetchNBA('playercareerstats', {
    PlayerID: playerId,
    PerMode: 'PerGame',
    LeagueID: '00',
  });
  var headers = data.resultSets[0].headers;
  var rows = data.resultSets[0].rowSet;
  var idx = function(k) { return headers.indexOf(k); };
  var current = rows.find(function(r){ return r[idx('SEASON_ID')] === '2025-26'; }) || rows[rows.length-1];
  if (!current) return null;
  return {
    season: current[idx('SEASON_ID')],
    team:   current[idx('TEAM_ABBREVIATION')],
    gp:     current[idx('GP')],
    min:    current[idx('MIN')]?.toFixed(1),
    pts:    current[idx('PTS')]?.toFixed(1),
    reb:    current[idx('REB')]?.toFixed(1),
    ast:    current[idx('AST')]?.toFixed(1),
    stl:    current[idx('STL')]?.toFixed(1),
    blk:    current[idx('BLK')]?.toFixed(1),
    fg:     current[idx('FG_PCT')] != null ? (current[idx('FG_PCT')]*100).toFixed(1)+'%' : '--',
    three:  current[idx('FG3_PCT')] != null ? (current[idx('FG3_PCT')]*100).toFixed(1)+'%' : '--',
    ft:     current[idx('FT_PCT')] != null ? (current[idx('FT_PCT')]*100).toFixed(1)+'%' : '--',
  };
}

function renderGameLog(games, title, subtitle, photoId) {
  if (!games.length) {
    return '<div class="stats-suggestion-box"><h3>No Games Found</h3><p>No matchup data this season yet.</p></div>';
  }

  var avgPts = (games.reduce(function(a,g){ return a+(g.pts||0); }, 0)/games.length).toFixed(1);
  var avgReb = (games.reduce(function(a,g){ return a+(g.reb||0); }, 0)/games.length).toFixed(1);
  var avgAst = (games.reduce(function(a,g){ return a+(g.ast||0); }, 0)/games.length).toFixed(1);

  var html = '<div class="stats-result-card">'
    + '<div class="stats-result-head">'
      + (photoId ? '<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+photoId+'.png" onerror="this.style.display=\'none\'" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.3);margin-right:12px;vertical-align:middle">' : '')
      + '<div style="display:inline-block;vertical-align:middle"><div class="stats-result-title">'+title+'</div><div class="stats-result-sub">'+subtitle+'</div></div>'
    + '</div>'
    + '<div class="stats-avgs">'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+avgPts+'</div><div class="stats-avg-lbl">PPG Avg</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+avgReb+'</div><div class="stats-avg-lbl">RPG Avg</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+avgAst+'</div><div class="stats-avg-lbl">APG Avg</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+games.length+'</div><div class="stats-avg-lbl">Games</div></div>'
    + '</div>'
    + '<div style="overflow-x:auto;padding:0 4px 12px">'
      + '<table style="width:100%;border-collapse:collapse;font-size:11px;min-width:520px">'
        + '<thead><tr style="background:var(--surf2)">'
          + '<th style="padding:7px 10px;text-align:left;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">Date</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">Matchup</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">W/L</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--gold);font-size:10px;border-bottom:1px solid var(--bord)">PTS</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">REB</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">AST</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">STL</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">BLK</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">FG</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">3PT</th>'
          + '<th style="padding:7px 10px;text-align:center;color:var(--muted);font-size:10px;border-bottom:1px solid var(--bord)">MIN</th>'
        + '</tr></thead>'
        + '<tbody>'
        + games.map(function(g, i) {
            var highPts = g.pts >= 30;
            var isWin   = g.result === 'W';
            return '<tr style="border-bottom:1px solid rgba(255,255,255,.04)'+(i%2===0?';background:rgba(255,255,255,.01)':'')+'">'
              + '<td style="padding:7px 10px;color:var(--muted);font-size:10px">'+g.date+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-size:10px;color:var(--txt)">'+g.matchup+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-weight:700;color:'+(isWin?'var(--green)':'var(--fade)')+'">'+g.result+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-weight:700;color:'+(highPts?'var(--gold)':'var(--txt)')+'">'+g.pts+'</td>'
              + '<td style="padding:7px 10px;text-align:center;color:var(--txt)">'+g.reb+'</td>'
              + '<td style="padding:7px 10px;text-align:center;color:var(--txt)">'+g.ast+'</td>'
              + '<td style="padding:7px 10px;text-align:center;color:var(--txt)">'+g.stl+'</td>'
              + '<td style="padding:7px 10px;text-align:center;color:var(--txt)">'+g.blk+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-size:10px;color:var(--muted)">'+g.fgm+'/'+g.fga+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-size:10px;color:var(--muted)">'+g.fg3m+'/'+g.fg3a+'</td>'
              + '<td style="padding:7px 10px;text-align:center;font-size:10px;color:var(--muted)">'+g.min+'</td>'
            + '</tr>';
          }).join('')
        + '</tbody>'
      + '</table>'
    + '</div>'
  + '</div>';

  return html;
}

function renderSeasonStats(stats, player) {
  var name = titleCase(player.name);
  return '<div class="stats-result-card">'
    + '<div class="stats-result-head" style="display:flex;align-items:center;gap:12px">'
      + '<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+player.photoId+'.png" onerror="this.style.display=\'none\'" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.3)">'
      + '<div><div class="stats-result-title">'+name+' ('+player.team+')</div><div class="stats-result-sub">2025-26 Season Averages · '+stats.gp+' games played</div></div>'
    + '</div>'
    + '<div class="stats-avgs">'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.pts+'</div><div class="stats-avg-lbl">Points</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.reb+'</div><div class="stats-avg-lbl">Rebounds</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.ast+'</div><div class="stats-avg-lbl">Assists</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.stl+'</div><div class="stats-avg-lbl">Steals</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.blk+'</div><div class="stats-avg-lbl">Blocks</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.fg+'</div><div class="stats-avg-lbl">FG%</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.three+'</div><div class="stats-avg-lbl">3P%</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.ft+'</div><div class="stats-avg-lbl">FT%</div></div>'
      + '<div class="stats-avg-box"><div class="stats-avg-val">'+stats.min+'</div><div class="stats-avg-lbl">Minutes</div></div>'
    + '</div>'
    + '<div style="padding:10px 14px;font-size:11px;color:var(--muted)">💡 Try: "'+name+' vs Lakers" or "'+name+' vs Celtics" to see game logs vs specific teams</div>'
  + '</div>';
}

window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q   = inp ? inp.value.trim() : '';
  if (!q) { if(window.showToast) showToast('Type something to search!'); return; }

  var res = document.getElementById('stats-result');
  res.innerHTML = '<div class="loader-box" style="padding:40px"><div class="sp" style="font-size:32px">🔍</div><div class="lt">Searching NBA Stats...</div><div class="lb-w"><div class="lb"></div></div></div>';

  var parsed = parseQuery(q);

  try {
    if (parsed.type === 'player_vs_team') {
      var games = await getPlayerGameLog(parsed.player.id, parsed.team.id);
      var title = titleCase(parsed.player.name) + ' ('+parsed.player.team+') vs ' + titleCase(parsed.team.name).toUpperCase();
      var sub   = 'Last ' + games.length + ' games this season · 2025-26';
      res.innerHTML = renderGameLog(games, title, sub, parsed.player.photoId);

    } else if (parsed.type === 'player_vs_player') {
      // Show game log for first player, note about second player
      var p1 = parsed.players[0];
      var p2 = parsed.players[1];
      var games = await getPlayerGameLog(p1.id);
      var title = titleCase(p1.name) + ' ('+p1.team+') — Last 10 Games';
      var sub   = '2025-26 Season · Tap "'+titleCase(p2.name)+'" below to see their stats';
      res.innerHTML = renderGameLog(games, title, sub, p1.photoId)
        + '<div style="text-align:center;margin-top:10px">'
        + '<div class="stats-chip" onclick="runSearch(\''+p2.name+'\')">🔄 Show '+titleCase(p2.name)+' stats instead</div>'
        + '</div>';

    } else if (parsed.type === 'player_season') {
      var stats = await getPlayerSeasonAverages(parsed.player.id);
      if (stats) {
        res.innerHTML = renderSeasonStats(stats, parsed.player);
        // Also load last 10 games below
        var games = await getPlayerGameLog(parsed.player.id);
        if (games.length) {
          res.innerHTML += '<div style="margin-top:12px">'
            + renderGameLog(games, 'Last '+games.length+' Games', '2025-26 Regular Season', null)
            + '</div>';
        }
      } else {
        res.innerHTML = '<div class="stats-suggestion-box"><h3>No Stats</h3><p>Could not find stats for '+titleCase(parsed.player.name)+'.</p></div>';
      }

    } else {
      res.innerHTML = '<div class="stats-suggestion-box">'
        + '<h3>🕷️ BeepBopStats</h3>'
        + '<p>Try searching like:<br><strong>"LeBron James vs Celtics"</strong> — game log<br><strong>"Curry last 10"</strong> — recent games<br><strong>"Giannis stats"</strong> — season averages</p>'
        + '<div class="stats-sugg-grid">'
        + ['LaMelo Ball','Jalen Brunson vs Rockets','Giannis vs Mavericks','Donovan Mitchell vs Lakers','Kawhi Leonard stats','Curry vs Lakers','LeBron vs Celtics','Trae Young stats'].map(function(s){
            return '<div class="stats-chip" onclick="runSearch(\''+s+'\')">'+s+'</div>';
          }).join('')
        + '</div></div>';
    }
  } catch(e) {
    // NBA API blocked — show helpful message
    res.innerHTML = '<div class="stats-suggestion-box">'
      + '<h3>⚠️ NBA Stats Temporarily Unavailable</h3>'
      + '<p>The NBA Stats API occasionally blocks browser requests. This is a known limitation. Try again in a moment, or search a different player.</p>'
      + '<div class="stats-sugg-grid">'
      + ['LaMelo Ball','Jalen Brunson','Giannis Antetokounmpo','Donovan Mitchell','Kawhi Leonard'].map(function(s){
          return '<div class="stats-chip" onclick="runSearch(\''+s+'\')">'+s+'</div>';
        }).join('')
      + '</div></div>';
    console.log('NBA API error:', e.message);
  }
};

window.runSearch = function(q) {
  var inp = document.getElementById('stats-input');
  if (inp) inp.value = q;
  window.searchStats();
};

window.initStats = async function() {
  var el = document.getElementById('stats-suggestions');
  if (!el) return;
  var popular = ['LaMelo Ball vs Celtics','Jalen Brunson vs Rockets','Giannis stats','Donovan Mitchell vs Lakers','Kawhi Leonard stats','LeBron James vs Celtics','Stephen Curry vs Lakers','Trae Young stats (WAS)','Anthony Davis stats (WAS)','Cooper Flagg stats'];
  el.innerHTML = popular.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s+'\')">'+s+'</div>';
  }).join('');
};

// Init on load
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 500);
  // Enter key support
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if (inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 600);
});
