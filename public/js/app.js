// BeepBopProps$ app.js v4.1 — rebuilt 2026-04-04 09:26
// BeepBopProps$ — app.js — complete clean rewrite

var allProps = [];
var slipPicks = [];
var _propFilterType = 'all';
var _propSearchText = '';
var _propGameFilter = 'all';
var slipPanelOpen = true;
var bankrollAmount = 0;

// ── INIT ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  setDate();
  loadAllData();
  setInterval(loadLive, 60000);
  setInterval(animateMeters, 3500);

  // Props tab default: show slip on right
  var layout = document.querySelector('.main-layout');
  var slip   = document.querySelector('.slip-panel');
  if (layout) layout.style.gridTemplateColumns = '1fr 330px';
  if (slip)   { slip.style.display = 'block'; }

  // Restore bankroll
  try {
    var saved = localStorage.getItem('bbp_bankroll');
    if (saved) {
      bankrollAmount = parseFloat(saved) || 0;
      var inp = document.getElementById('bankroll-input');
      if (inp) inp.value = saved;
    }
  } catch(e) {}
});

function setDate() {
  var d = new Date();
  var days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var el = document.getElementById('date-display');
  if (el) el.textContent = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate();
}

async function loadAllData() {
  var btn = document.getElementById('refresh-btn');
  if (btn) { btn.disabled = true; btn.classList.add('loading'); }
  await Promise.allSettled([loadGames(), loadProps(), loadInjuries(), loadLive(), loadParlays()]);
  if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
  var el = document.getElementById('last-updated-txt');
  if (el) el.textContent = 'Updated ' + new Date().toLocaleTimeString();
}

// ── GAMES ────────────────────────────────────────
async function loadGames() {
  try {
    var r = await fetch('/api/games');
    var d = await r.json();
    if (!d.success) { showErr('games','Could not load games.'); return; }
    window._liveGames = d.games || [];
    renderGames(d.games || []);
    updateTicker(d.games || []);
  } catch(e) { showErr('games', e.message); }
}

function renderGames(games) {
  window._liveGames = games;
  var html = '<div class="games-grid">';
  games.forEach(function(g) {
    var hp = Math.round(g.homeWinProb || 50);
    var ap = 100 - hp;
    var isLive  = g.status === 'live';
    var isFinal = g.status === 'final';
    var tc = 'b-' + (g.tier || 'neutral');
    var awayLogoId = NBA_TEAM_IDS[g.awayTeam] || '';
    var homeLogoId = NBA_TEAM_IDS[g.homeTeam] || '';
    var awayLogo = awayLogoId
      ? '<img src="https://cdn.nba.com/logos/nba/'+awayLogoId+'/global/L/logo.svg" class="team-logo-img" onerror="this.style.display=\'none\'">'
      : '<span style="font-size:28px">🏀</span>';
    var homeLogo = homeLogoId
      ? '<img src="https://cdn.nba.com/logos/nba/'+homeLogoId+'/global/L/logo.svg" class="team-logo-img" onerror="this.style.display=\'none\'">'
      : '<span style="font-size:28px">🏀</span>';

    html += '<div class="game-card' + (isLive?' live-game':'') + '">'
      + '<div class="gc-head">'
        + '<span class="gc-time">' + (isFinal ? '✅ FINAL' : isLive ? g.quarter+' '+g.clock : g.tipoff) + (g.arena?' · '+g.arena:'') + '</span>'
        + (isLive ? '<span class="gc-live">● LIVE</span>' : '<span class="badge '+tc+'">'+(g.tier||'neutral').toUpperCase()+'</span>')
      + '</div>'
      + '<div class="matchup">'
        + '<div class="team"><div class="team-logo-wrap">'+awayLogo+'</div><div class="team-abbr">'+g.awayTeam+'</div>'+(isLive||isFinal?'<div class="team-score">'+g.awayScore+'</div>':'')+'<div class="team-rec">'+g.awayRecord+'</div></div>'
        + '<div class="vs-mid"><div class="vs-at">@</div><div class="gspread">'+g.spread+'</div><div class="gtotal">O/U '+g.total+'</div></div>'
        + '<div class="team"><div class="team-logo-wrap">'+homeLogo+'</div><div class="team-abbr">'+g.homeTeam+'</div>'+(isLive||isFinal?'<div class="team-score">'+g.homeScore+'</div>':'')+'<div class="team-rec">'+g.homeRecord+'</div></div>'
      + '</div>'
      + '<div class="prob-row"><span class="plabel">'+g.awayTeam+' '+ap+'%</span><div class="pbar"><div class="pfill" style="width:'+ap+'%"></div></div><span class="plabel">'+g.homeTeam+' '+hp+'%</span></div>'
      + '<div class="gc-foot">'+(g.topPicks||[]).map(function(p){return'<span class="badge b-strong">'+p+'</span>';}).join('')+'</div>'
    + '</div>';
  });
  var el = document.getElementById('games-content');
  if (el) el.innerHTML = html + '</div>';
}

// ── PROPS ────────────────────────────────────────
async function loadProps() {
  try {
    var r = await fetch('/api/props');
    var d = await r.json();
    if (!d.success) { showErr('props','Could not load props.'); return; }
    if (d.source === 'loading' || (d.count === 0 && d.source !== 'live')) {
      var el = document.getElementById('props-content');
      if (el) el.innerHTML = '<div class="loader-box"><div class="sp">🤖</div><div class="lt">Odds API is fetching props...</div><div class="lb-w"><div class="lb"></div></div><div style="font-size:11px;color:var(--muted);margin-top:8px">Auto-retrying in 15 seconds</div></div>';
      setTimeout(loadProps, 15000);
      return;
    }
    allProps = d.props || [];
    renderProps(allProps);
    renderAltLines(allProps);
  } catch(e) { showErr('props', e.message); }
}

function renderProps(props) {
  if (!props.length) {
    var el = document.getElementById('props-content');
    if (el) el.innerHTML = '<div class="err-box"><h3>No Props Loaded</h3><p>Hit Refresh or check your Odds API key.</p></div>';
    return;
  }

  // Split live vs upcoming
  var liveTeams = [];
  (window._liveGames || []).forEach(function(g) {
    if (g.status === 'live' || g.status === 'final') {
      liveTeams.push(g.homeTeam);
      liveTeams.push(g.awayTeam);
    }
  });

  var startedProps  = liveTeams.length ? props.filter(function(p){ return liveTeams.includes(p.team)||liveTeams.includes(p.opponent); }) : [];
  var upcomingProps = startedProps.length ? props.filter(function(p){ return !liveTeams.includes(p.team)&&!liveTeams.includes(p.opponent); }) : props;

  var html = '';
  if (upcomingProps.length) {
    html += '<div class="props-section-title">🎯 Upcoming Props</div><div class="props-grid">';
    upcomingProps.forEach(function(p){ html += buildPropCard(p); });
    html += '</div>';
  }
  if (startedProps.length) {
    html += '<div class="props-section-title started-title">⚡ Game Started</div><div class="props-grid">';
    startedProps.forEach(function(p){ html += buildPropCard(p); });
    html += '</div>';
  }

  var el = document.getElementById('props-content');
  if (el) el.innerHTML = html;
  buildPropsGameFilter(props);
}

function buildPropCard(p) {
  var conf = p.confidence || 60;
  var t    = p.tier || 'neutral';
  var da   = Math.round((conf/100)*88);
  var rc   = t==='elite'?'#FFD700':t==='strong'?'#00D4AA':t==='neutral'?'#60a5fa':'#ff5555';
  var pid  = p.nbaPhotoId || '0';
  var bookLines = [
    { key:'dk',  name:'DraftKings', line:p.dkLine,    odds:p.dkOdds   },
    { key:'fd',  name:'FanDuel',    line:p.fdLine,    odds:p.fdOdds   },
    { key:'mgm', name:'BetMGM',     line:p.mgmLine,   odds:p.mgmOdds  },
    { key:'czr', name:'Caesars',    line:p.czrLine,   odds:p.czrOdds  },
    { key:'pp',  name:'PrizePicks', line:p.ppLine,    odds:'More'     },
    { key:'ud',  name:'Underdog',   line:p.udLine,    odds:p.udOdds   },
    { key:'reb', name:'Rebet',      line:p.rebetLine, odds:p.rebetOdds},
  ];
  var validLines = bookLines.filter(function(b){ return b.line != null; });
  var bestLine   = validLines.length ? Math.min.apply(null, validLines.map(function(b){ return b.line; })) : p.line;

  var booksHtml = '<div class="books7">';
  bookLines.forEach(function(b) {
    var isBest = b.line != null && b.line === bestLine && p.direction === 'over';
    booksHtml += '<div class="bk'+(isBest?' best-line':'')+'"><div class="bkname '+b.key+'">'+b.name+'</div><div class="bknum">'+(b.line!=null?b.line:'--')+'</div><div class="bkodds">'+(b.odds||'--')+'</div></div>';
  });
  booksHtml += '</div>';

  // Projected line
  var projHtml = '';
  if (p.projectedLine != null) {
    var baseL = parseFloat(p.dkLine||p.line||0);
    var projL = parseFloat(p.projectedLine);
    var diffV = projL - baseL;
    var projCls = diffV > 0 ? 'proj-over' : diffV < 0 ? 'proj-under' : '';
    var arrow   = diffV > 0 ? '▲ +' : diffV < 0 ? '▼ ' : '→ ';
    var absDiff = Math.abs(diffV).toFixed(1);
    projHtml = '<div class="proj-line-row">'
      + '<span class="proj-lbl">📊 BeepBot Projection</span>'
      + '<span class="proj-val '+projCls+'">'+projL+'</span>'
      + '<span class="proj-diff '+projCls+'">'+arrow+absDiff+' vs line</span>'
      + '</div>';
  }

  var pickId  = (pid+'_'+p.statType+'_'+(p.team||'')).replace(/[^a-z0-9_]/gi,'_');
  var safeLabel = esc(p.playerName+' '+cap(p.statType)+' '+(p.direction||'over').toUpperCase()+' '+(p.line||p.dkLine||'?'));
  var safeName  = esc(p.playerName||'');
  var safeGame  = esc((p.team||'')+(p.opponent?' vs '+p.opponent:''));

  // Season avg row
  var baseL = parseFloat(p.dkLine||p.line||0);
  var avgHtml = '';
  if (p.seasonAvg != null) {
    var ad = p.seasonAvg - baseL;
    var ac = ad > 0 ? 'proj-over' : ad < 0 ? 'proj-under' : '';
    avgHtml = '<div class="proj-line-row"><span class="proj-lbl">📈 Season Avg</span><span class="proj-val '+ac+'">'+p.seasonAvg+'</span><span class="proj-diff '+ac+'">'+(ad>0?'▲ +':'▼ ')+Math.abs(ad).toFixed(1)+' vs line</span></div>';
  }
  // Add edge % to projection
  if (p.projectedLine != null) {
    var pjL = parseFloat(p.projectedLine);
    var edg = baseL > 0 ? (((pjL - baseL) / baseL) * 100).toFixed(1) : '0';
    projHtml += '<div style="font-size:9px;font-weight:700;color:'+(pjL>baseL?'var(--green)':'var(--fade)')+';margin-top:2px">'+(pjL>baseL?'+':'')+edg+'% edge vs line</div>';
  }
  // Probability bars
  var mainOdds = p.dkOdds || p.fdOdds || '';
  var overI = parseInt(calcImplied(mainOdds)) || 50;
  var underI = 100 - overI;
  var probHtml = '<div style="margin:6px 0;padding:6px 0;border-top:1px solid rgba(255,255,255,.06)">'
    + '<div style="font-size:9px;color:var(--muted);font-weight:700;letter-spacing:.5px;margin-bottom:4px">PROBABILITY</div>'
    + '<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="font-size:8px;font-weight:700;color:var(--green);width:36px;text-align:right">OVER</span><div style="flex:1;height:5px;background:var(--surf2);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+overI+'%;background:var(--green);border-radius:3px"></div></div><span style="font-size:10px;font-weight:700;color:var(--green)">'+overI+'%</span></div>'
    + '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:8px;font-weight:700;color:var(--fade);width:36px;text-align:right">UNDER</span><div style="flex:1;height:5px;background:var(--surf2);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+underI+'%;background:var(--fade);border-radius:3px"></div></div><span style="font-size:10px;font-weight:700;color:var(--fade)">'+underI+'%</span></div>'
  + '</div>';
  // NBA ID
  var nbaIdBadge = '<span style="display:inline-block;font-size:8px;color:var(--muted);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:4px;padding:0 4px;margin-left:4px">ID:'+pid+'</span>';
  var cardId = 'pc-'+pickId;

  return '<div class="prop-card '+t+'" id="'+cardId+'" data-type="'+p.statType+'" data-tier="'+t+'" data-player="'+(p.playerName||'').toLowerCase()+'" data-team="'+(p.team||'').toLowerCase()+'_'+(p.opponent||'').toLowerCase()+'">'
    + '<div class="pp-head">'
      + '<div class="av"><img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" onerror="this.style.display=\'none\'"></div>'
      + '<div class="pinfo"><div class="pname">'+p.playerName+'</div><div class="pteam">'+(p.team||'')+(p.opponent?' · vs '+p.opponent:'')+nbaIdBadge+'</div></div>'
      + '<div class="cr"><svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="#1a1a2e" stroke-width="4"/><circle cx="18" cy="18" r="14" fill="none" stroke="'+rc+'" stroke-width="4" stroke-dasharray="'+da+' '+(88-da)+'" stroke-linecap="round"/></svg><div class="ct">'+conf+'%</div></div>'
    + '</div>'
    + '<div class="pp-body">'
      + '<div class="ps-lbl">'+cap(p.statType)+' · '+t.toUpperCase()+' PICK</div>'
      + '<div class="pline-row"><span class="stat-num">'+(p.line||p.dkLine||'?')+'</span><span class="ou '+(p.direction||'over')+'">'+(p.direction||'over').toUpperCase()+'</span></div>'
      + avgHtml
      + projHtml
      + probHtml
      + booksHtml
      + '<div class="pp-foot"><div class="hr">L10: <span>'+(p.hitRateLast10||'?/10')+'</span></div><span class="badge b-'+t+'">'+t.toUpperCase()+'</span></div>'
      + (p.reasoning?'<div class="reason-text">'+p.reasoning+'</div>':'')
      + '<div style="display:flex;gap:6px;margin-top:8px">'
        + '<button class="btn-add-pick" style="flex:1" onclick="addPick(this,\''+safeLabel+'\',\''+safeName+'\',\''+safeGame+'\','+conf+',\''+p.statType+'\',\''+pid+'\',\''+pickId+'\')">＋ Add to Slip</button>'
        + '<button class="btn-shot-map" data-name="'+safeName+'" data-pid="'+pid+'" data-team="'+(p.team||'')+'" data-opp="'+(p.opponent||'')+'" data-stat="'+p.statType+'" onclick="openShotMapFromCard(this)" title="Shot Map" style="padding:7px 10px;background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.25);border-radius:7px;color:var(--neutral);font-size:10px;font-weight:600;cursor:pointer">📍</button>'
        + '<button onclick="toggleDeepDive(\''+cardId+'\',\''+esc(p.playerName)+'\',\''+pid+'\',\''+(p.team||'')+'\',\''+(p.opponent||'')+'\',\''+p.statType+'\')" style="padding:7px 10px;background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.2);border-radius:7px;color:var(--gold);font-size:10px;font-weight:600;cursor:pointer">🔍 Intel</button>'
      + '</div>'
      + '<div id="dd-'+cardId+'" style="display:none"></div>'
    + '</div>'
  + '</div>';
}

// ── ALT LINES ────────────────────────────────────
var _altStatFilter = 'all';
var _altGameFilter = 'all';
var _altTierFilter = 'all';
var _altSearchText = '';

function renderAltLines(props) {
  if (!props.length) { var e=document.getElementById('altlines-content'); if(e)e.innerHTML='<div class="err-box"><h3>No Props Available</h3><p>Alt lines appear when Odds API has live data.</p></div>'; return; }
  buildAltGameFilter(props);
  window._altProps = props;
  renderAltFiltered();
}

function buildAltGameFilter(props) {
  var row = document.getElementById('alt-game-filter-row');
  if (!row) return;
  var seen={}, games=[];
  props.forEach(function(p){
    if(!p.team||!p.opponent)return;
    var key=p.team.toLowerCase()+'_'+p.opponent.toLowerCase();
    if(seen[key])return; seen[key]=1;
    games.push({key:key,away:p.team.toUpperCase(),home:p.opponent.toUpperCase()});
  });
  var btns='<button class="pgame-btn active" onclick="filterAltGame(\'all\',this)">🏀 All</button>';
  games.forEach(function(g){
    var aId=NBA_TEAM_IDS[g.away]||'', hId=NBA_TEAM_IDS[g.home]||'';
    var aL=aId?'<img src="https://cdn.nba.com/logos/nba/'+aId+'/global/L/logo.svg" style="width:16px;height:16px;vertical-align:middle;margin-right:2px">':'';
    var hL=hId?'<img src="https://cdn.nba.com/logos/nba/'+hId+'/global/L/logo.svg" style="width:16px;height:16px;vertical-align:middle;margin-right:2px">':'';
    btns+='<button class="pgame-btn" onclick="filterAltGame(\''+g.key+'\',this)">'+aL+g.away+' @ '+hL+g.home+'</button>';
  });
  row.innerHTML=btns;
}

function filterAltGame(key, btn) { _altGameFilter=key; document.querySelectorAll('#alt-game-filter-row .pgame-btn').forEach(function(b){b.classList.remove('active');}); if(btn)btn.classList.add('active'); renderAltFiltered(); }
function filterAlt(type, btn) { _altStatFilter=type; document.querySelectorAll('#alt-stat-filters .fbtn').forEach(function(b){b.classList.remove('active');}); if(btn)btn.classList.add('active'); renderAltFiltered(); }
function filterAltTier(tier, btn) { _altTierFilter=tier; document.querySelectorAll('#alt-tier-filters .fbtn').forEach(function(b){b.classList.remove('active');}); if(btn)btn.classList.add('active'); renderAltFiltered(); }
function searchAltLines(val) { _altSearchText=(val||'').toLowerCase().trim(); renderAltFiltered(); }

function renderAltFiltered() {
  var props = window._altProps || [];
  var filtered = props.filter(function(p) {
    var statOk = _altStatFilter==='all' || p.statType===_altStatFilter;
    var tierOk = _altTierFilter==='all' || p.tier===_altTierFilter;
    var gameOk = _altGameFilter==='all';
    if (!gameOk) {
      var pk=(p.team||'').toLowerCase()+'_'+(p.opponent||'').toLowerCase();
      var rk=(p.opponent||'').toLowerCase()+'_'+(p.team||'').toLowerCase();
      gameOk = pk===_altGameFilter || rk===_altGameFilter;
    }
    var srchOk = !_altSearchText || (p.playerName||'').toLowerCase().includes(_altSearchText) || (p.team||'').toLowerCase().includes(_altSearchText);
    return statOk && tierOk && gameOk && srchOk;
  });

  var countEl = document.getElementById('alt-count');
  if (countEl) countEl.textContent = filtered.length + ' of ' + props.length + ' props';

  var html = '';
  filtered.forEach(function(p) {
    var pid = p.nbaPhotoId || '0';
    var mainLine = p.dkLine || p.line || 0;
    var tc = p.tier==='elite'?'var(--gold)':p.tier==='strong'?'var(--strong)':p.tier==='neutral'?'var(--neutral)':'var(--fade)';
    var seasonAvg = p.seasonAvg;

    // Book comparison row — show all 7 books with lines + odds
    var books = [
      {n:'DK',l:p.dkLine,o:p.dkOdds,c:'dk'},{n:'FD',l:p.fdLine,o:p.fdOdds,c:'fd'},
      {n:'MGM',l:p.mgmLine,o:p.mgmOdds,c:'mgm'},{n:'CZR',l:p.czrLine,o:p.czrOdds,c:'czr'},
      {n:'PP',l:p.ppLine,o:'—',c:'pp'},{n:'UD',l:p.udLine,o:p.udOdds,c:'ud'},
      {n:'Rebet',l:p.rebetLine,o:p.rebetOdds,c:'reb'}
    ];
    var valid = books.filter(function(b){return b.l!=null;});
    var best = valid.length ? valid.reduce(function(bst,b){return b.l<bst.l?b:bst;},valid[0]) : null;
    var bkHtml='<div class="alt-books-row">';
    books.forEach(function(b){
      var isBest=best&&b.l===best.l&&b.n===best.n;
      bkHtml+='<div class="alt-bk'+(isBest?' alt-bk-best':'')+'"><div class="alt-bk-name '+b.c+'">'+b.n+'</div><div class="alt-bk-line">'+(b.l!=null?b.l:'—')+'</div><div class="alt-bk-odds">'+(b.o||'—')+'</div>'+(isBest?'<div class="alt-bk-best-tag">BEST</div>':'')+'</div>';
    });
    bkHtml+='</div>';

    // Alt lines with hit percentages — use the built-in alt lines but show cleaner
    var alts = p.altLines || [];
    var altRows = '';
    alts.forEach(function(a) {
      var isMain = a.line === mainLine;
      var overPct = parseInt(calcImplied(a.overOdds)) || 50;
      // Color code by probability
      var pctColor = overPct >= 75 ? 'var(--green)' : overPct >= 55 ? 'var(--strong)' : overPct >= 45 ? 'var(--gold)' : overPct >= 30 ? '#f59e0b' : 'var(--fade)';
      var barW = Math.max(4, Math.min(overPct, 100));
      var isBelow = seasonAvg && a.line < seasonAvg;
      altRows += '<div class="alt-row'+(isMain?' alt-row-main':'')+'">'
        +'<div class="alt-row-line">'+a.line+(isMain?' <span class="alt-main-tag">MAIN</span>':'')+'</div>'
        +'<div class="alt-row-bar-wrap"><div class="alt-row-bar" style="width:'+barW+'%;background:'+pctColor+'"></div></div>'
        +'<div class="alt-row-pct" style="color:'+pctColor+'">'+overPct+'%</div>'
        +'<div class="alt-row-odds">'+a.overOdds+'</div>'
        +(isBelow?'<div class="alt-row-tag">↓AVG</div>':'<div class="alt-row-tag"></div>')
      +'</div>';
    });

    html += '<div class="alt-card" data-type="'+p.statType+'" data-tier="'+p.tier+'">'
      // Header
      +'<div class="alt-head">'
        +'<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" onerror="this.style.display=\'none\'" class="alt-head-img">'
        +'<div class="alt-head-info"><div class="alt-head-name">'+p.playerName+'</div><div class="alt-head-meta">'+cap(p.statType)+' · '+(p.team||'')+' vs '+(p.opponent||'')+' · <span style="color:'+tc+'">'+((p.tier||'').toUpperCase())+'</span></div></div>'
        +'<div class="alt-head-right"><div class="alt-head-line">'+mainLine+'</div>'+(seasonAvg?'<div class="alt-head-avg">Avg: '+seasonAvg+'</div>':'')+'</div>'
      +'</div>'
      // Books
      +bkHtml
      // Column headers
      +'<div class="alt-row alt-row-header"><div class="alt-row-line">Line</div><div class="alt-row-bar-wrap">Chance to Hit</div><div class="alt-row-pct">%</div><div class="alt-row-odds">Odds</div><div class="alt-row-tag"></div></div>'
      // Alt line rows
      +altRows
      // Load real data button
      +'<div class="alt-real-btn-wrap"><button class="alt-real-btn" onclick="loadRealHitRates(this,\''+esc(p.playerName)+'\',\''+p.statType+'\','+mainLine+')">📊 Load Real Hit Rates from Game Log</button></div>'
    +'</div>';
  });

  var el = document.getElementById('altlines-content');
  if (el) el.innerHTML = html || '<div class="err-box"><h3>No matching props</h3><p>Try adjusting your filters.</p></div>';
}

// Fetch REAL hit rates from BDL game log data
async function loadRealHitRates(btn, playerName, statType, mainLine) {
  btn.disabled = true;
  btn.textContent = '🤖 Fetching game log data...';
  try {
    var r = await fetch('/api/hit-rates?playerName='+encodeURIComponent(playerName)+'&statType='+encodeURIComponent(statType));
    var d = await r.json();
    if (!d.success || !d.lines) { btn.textContent = '❌ No data available'; return; }

    // Replace the button with real data
    var wrap = btn.parentElement;
    var card = wrap.parentElement;

    // Find the alt rows area and replace it
    var headerEl = card.querySelector('.alt-row-header');
    var rows = card.querySelectorAll('.alt-row:not(.alt-row-header)');
    rows.forEach(function(r){ r.remove(); });

    // Update header
    if (headerEl) {
      headerEl.innerHTML = '<div class="alt-row-line">Line</div><div class="alt-row-bar-wrap">Hit Rate ('+d.gamesPlayed+' games)</div><div class="alt-row-pct">%</div><div class="alt-row-odds">Games Over</div><div class="alt-row-tag"></div>';
    }

    // Filter lines to reasonable range around the main line
    var relevantLines = d.lines.filter(function(l) {
      return l.line >= mainLine - 4 && l.line <= mainLine + 4 && l.line % 0.5 === 0;
    });

    // Insert real rows
    var insertBefore = wrap;
    relevantLines.forEach(function(l) {
      var isMain = l.line === mainLine;
      var pctColor = l.pct >= 75 ? 'var(--green)' : l.pct >= 55 ? 'var(--strong)' : l.pct >= 45 ? 'var(--gold)' : l.pct >= 30 ? '#f59e0b' : 'var(--fade)';
      var barW = Math.max(4, Math.min(l.pct, 100));
      var isBelow = d.seasonAvg && l.line < d.seasonAvg;
      var rowEl = document.createElement('div');
      rowEl.className = 'alt-row' + (isMain ? ' alt-row-main' : '');
      rowEl.innerHTML = '<div class="alt-row-line">'+l.line+(isMain?' <span class="alt-main-tag">MAIN</span>':'')+'</div>'
        +'<div class="alt-row-bar-wrap"><div class="alt-row-bar" style="width:'+barW+'%;background:'+pctColor+'"></div></div>'
        +'<div class="alt-row-pct" style="color:'+pctColor+'">'+l.pct+'%</div>'
        +'<div class="alt-row-odds">'+l.hits+'/'+l.gp+'</div>'
        +(isBelow?'<div class="alt-row-tag">↓AVG</div>':'<div class="alt-row-tag"></div>');
      card.insertBefore(rowEl, insertBefore);
    });

    // Replace button with summary
    wrap.innerHTML = '<div class="alt-real-summary">'
      +'<span>📊 Season Avg: <strong style="color:var(--gold)">'+d.seasonAvg+'</strong></span>'
      +'<span>L10 Avg: <strong style="color:var(--green)">'+d.last10Avg+'</strong></span>'
      +'<span>Median: <strong>'+d.median+'</strong></span>'
      +'<span style="color:var(--muted)">'+d.gamesPlayed+' games</span>'
    +'</div>';

  } catch(e) {
    btn.textContent = '❌ Error loading data';
    btn.disabled = false;
  }
}

// ── LIVE ─────────────────────────────────────────
async function loadLive() {
  try {
    var r = await fetch('/api/games');
    var d = await r.json();
    if (!d.success) return;
    var live = (d.games||[]).filter(function(g){ return g.status==='live'; });
    var el = document.getElementById('live-content');
    if (!el) return;
    var html = '';
    if (live.length) {
      html += '<div style="font-family:\'Bebas Neue\',cursive;font-size:16px;color:var(--green);margin-bottom:8px">● Live Now</div><div class="games-grid">';
      live.forEach(function(g){
        var aL=NBA_TEAM_IDS[g.awayTeam]?'<img src="https://cdn.nba.com/logos/nba/'+NBA_TEAM_IDS[g.awayTeam]+'/global/L/logo.svg" class="team-logo-img" onerror="this.style.display=\'none\'">':'';
        var hL=NBA_TEAM_IDS[g.homeTeam]?'<img src="https://cdn.nba.com/logos/nba/'+NBA_TEAM_IDS[g.homeTeam]+'/global/L/logo.svg" class="team-logo-img" onerror="this.style.display=\'none\'">':'';
        html += '<div class="game-card live-game"><div class="gc-head"><span class="gc-time">'+g.quarter+' '+g.clock+'</span><span class="gc-live">● LIVE</span></div><div class="matchup"><div class="team"><div class="team-logo-wrap">'+aL+'</div><div class="team-abbr">'+g.awayTeam+'</div><div class="team-score">'+g.awayScore+'</div></div><div class="vs-mid"><div class="vs-at">@</div></div><div class="team"><div class="team-logo-wrap">'+hL+'</div><div class="team-abbr">'+g.homeTeam+'</div><div class="team-score">'+g.homeScore+'</div></div></div></div>';
      });
      html += '</div>';
    }
    var sched = (d.games||[]).filter(function(g){return g.status==='scheduled';});
    if (sched.length) {
      html += '<div style="font-family:\'Bebas Neue\',cursive;font-size:16px;color:var(--red);margin:12px 0 8px">🗓 Upcoming</div><div class="games-grid">';
      sched.forEach(function(g){
        var hp=g.homeWinProb||50;
        html += '<div class="game-card"><div class="gc-head"><span class="gc-time">'+g.tipoff+'</span><span class="badge b-'+(g.tier||'neutral')+'">'+(g.tier||'').toUpperCase()+'</span></div><div class="matchup"><div class="team"><div class="team-abbr">'+g.awayTeam+'</div><div class="team-rec">'+(g.awayRecord||'')+'</div></div><div class="vs-mid"><div class="vs-at">@</div><div class="gspread">'+g.spread+'</div><div class="gtotal">O/U '+g.total+'</div></div><div class="team"><div class="team-abbr">'+g.homeTeam+'</div><div class="team-rec">'+(g.homeRecord||'')+'</div></div></div><div class="prob-row"><span class="plabel">'+g.awayTeam+' '+(100-hp)+'%</span><div class="pbar"><div class="pfill" style="width:'+(100-hp)+'%"></div></div><span class="plabel">'+g.homeTeam+' '+hp+'%</span></div></div>';
      });
      html += '</div>';
    }
    if (!html) html = '<div class="err-box"><h3>No Games Today</h3><p>Check back on game day.</p></div>';
    el.innerHTML = html;
  } catch(e) {}
}

// ── H2H ──────────────────────────────────────────
function populateH2H() {
  var t1 = document.getElementById('h2h-t1');
  var t2 = document.getElementById('h2h-t2');
  if (!t1 || !t2) return;
  t1.addEventListener('keydown', function(e){ if(e.key==='Enter') loadH2H(); });
  t2.addEventListener('keydown', function(e){ if(e.key==='Enter') loadH2H(); });
}

async function loadH2H() {
  var t1 = (document.getElementById('h2h-t1')||{}).value || '';
  var t2 = (document.getElementById('h2h-t2')||{}).value || '';
  if (!t1||!t2) { showToast('Enter both team abbreviations'); return; }
  var el = document.getElementById('h2h-content');
  if (el) el.innerHTML = '<div class="loader-box"><div class="sp">⚔️</div><div class="lt">Loading H2H...</div></div>';
  try {
    var r = await fetch('/api/h2h/'+t1.toUpperCase()+'/'+t2.toUpperCase());
    var d = await r.json();
    if (!d.success||!d.h2h) { if(el)el.innerHTML='<div class="err-box"><h3>Not Found</h3><p>Check team abbreviations (e.g. LAL, BOS)</p></div>'; return; }
    var h = d.h2h;
    var html = '<div class="h2h-result">'
      +'<div class="h2h-score-row"><span class="h2h-team">'+h.team1+'</span><span class="h2h-vs">vs</span><span class="h2h-team">'+h.team2+'</span></div>'
      +'<div class="h2h-record"><span>'+h.team1Wins+' W</span><span class="h2h-dash">—</span><span>'+h.team2Wins+' W</span></div>'
      +'<div class="h2h-games">';
    (h.last5Games||[]).forEach(function(g){
      html += '<div class="h2h-row"><span>'+g.date+'</span><span>'+g.matchup+'</span><span class="badge '+(g.winner===h.team1?'b-elite':'b-fade')+'">'+g.winner+'</span><span>'+g.score+'</span></div>';
    });
    html += '</div></div>';
    if (el) el.innerHTML = html;
  } catch(e) { if(el)el.innerHTML='<div class="err-box"><h3>Error</h3><p>'+e.message+'</p></div>'; }
}

// ── PARLAYS ──────────────────────────────────────
async function loadParlays() {
  var el = document.getElementById('parlays-content');
  if (!el) return;
  if (!allProps.length) { await loadProps(); }
  var elite = allProps.filter(function(p){ return p.tier==='elite'; }).slice(0,8);
  var strong = allProps.filter(function(p){ return p.tier==='strong'; }).slice(0,8);
  var pool = elite.concat(strong).slice(0,12);
  if (pool.length < 2) { el.innerHTML='<div class="err-box"><h3>Not enough picks for parlays</h3><p>Wait for more props to be posted.</p></div>'; return; }

  // Build 2-leg combos from different games
  var combos2 = [];
  for (var i=0;i<pool.length;i++) for(var j=i+1;j<pool.length;j++) {
    var sameGame = pool[i].team===pool[j].team || pool[i].team===pool[j].opponent || pool[i].opponent===pool[j].team;
    var p = (pool[i].confidence/100)*(pool[j].confidence/100);
    combos2.push({ legs:[pool[i],pool[j]], prob:Math.round(p*100), sameGame:sameGame });
  }
  combos2.sort(function(a,b){ return b.prob-a.prob; });

  // Build 3-leg combos
  var combos3 = [];
  for (var i=0;i<Math.min(pool.length,8);i++) for(var j=i+1;j<Math.min(pool.length,8);j++) for(var k=j+1;k<Math.min(pool.length,8);k++) {
    var legs = [pool[i],pool[j],pool[k]];
    var teams = legs.map(function(l){return l.team+'/'+l.opponent;});
    var hasSG = teams.some(function(t,idx){return teams.indexOf(t)!==idx;});
    var p = legs.reduce(function(a,l){return a*l.confidence/100;},1);
    combos3.push({ legs:legs, prob:Math.round(p*100), sameGame:hasSG });
  }
  combos3.sort(function(a,b){ return b.prob-a.prob; });

  var html = '';

  // 2-Leg Section
  html += '<div class="parlay-section-title">🔥 Best 2-Leg Parlays</div><div class="parlay-grid">';
  combos2.slice(0,6).forEach(function(c){
    var payout = Math.round(((1/(c.prob/100))-1)*100);
    var tierCls = c.prob>=55?'parl-elite':c.prob>=40?'parl-strong':'parl-neutral';
    html += '<div class="parl-card '+tierCls+'">'
      +'<div class="parl-header"><span class="parl-legs-count">2-LEG</span><span class="parl-prob-badge">'+(c.prob>=50?'🔥':'⚡')+' '+c.prob+'%</span></div>'
      +c.legs.map(function(l,li){
        var pid = l.nbaPhotoId||'0';
        var tc = l.tier==='elite'?'var(--gold)':l.tier==='strong'?'var(--strong)':'var(--neutral)';
        return '<div class="parl-leg">'
          +'<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" class="parl-leg-img" onerror="this.style.display=\'none\'">'
          +'<div class="parl-leg-info"><div class="parl-leg-name">'+l.playerName+'</div><div class="parl-leg-detail">'+cap(l.statType)+' O'+(l.dkLine||l.line)+' · '+(l.team||'')+' vs '+(l.opponent||'')+'</div></div>'
          +'<span class="parl-leg-conf" style="color:'+tc+'">'+l.confidence+'%</span>'
        +'</div>';
      }).join('')
      +(c.sameGame?'<div class="parl-sgp-warn">⚠️ Same-game — correlation risk</div>':'')
      +'<div class="parl-foot">'
        +'<div class="parl-foot-item"><div class="parl-foot-lbl">Combined</div><div class="parl-foot-val" style="color:var(--gold)">'+c.prob+'%</div></div>'
        +'<div class="parl-foot-item"><div class="parl-foot-lbl">$100 Payout</div><div class="parl-foot-val" style="color:var(--green)">+$'+payout+'</div></div>'
        +'<div class="parl-foot-item"><div class="parl-foot-lbl">PP Type</div><div class="parl-foot-val">Power Play</div></div>'
      +'</div>'
      +'<button class="parl-add-btn" onclick="addParlayToSlip(this)" data-legs=\''+JSON.stringify(c.legs.map(function(l){return{label:l.playerName+' '+cap(l.statType)+' OVER '+(l.dkLine||l.line),name:l.playerName,game:(l.team||'')+' vs '+(l.opponent||''),conf:l.confidence,type:l.statType,nbaId:l.nbaPhotoId||'0'};})).replace(/'/g,"&#39;")+'\'>＋ Add All to Slip</button>'
    +'</div>';
  });
  html += '</div>';

  // 3-Leg Section
  if (combos3.length) {
    html += '<div class="parlay-section-title" style="margin-top:18px">💰 Best 3-Leg Parlays</div><div class="parlay-grid">';
    combos3.slice(0,4).forEach(function(c){
      var payout = Math.round(((1/(c.prob/100))-1)*100);
      var tierCls = c.prob>=40?'parl-elite':c.prob>=25?'parl-strong':'parl-neutral';
      html += '<div class="parl-card '+tierCls+'">'
        +'<div class="parl-header"><span class="parl-legs-count">3-LEG</span><span class="parl-prob-badge">'+(c.prob>=40?'🔥':'⚡')+' '+c.prob+'%</span></div>'
        +c.legs.map(function(l,li){
          var pid = l.nbaPhotoId||'0';
          var tc = l.tier==='elite'?'var(--gold)':l.tier==='strong'?'var(--strong)':'var(--neutral)';
          return '<div class="parl-leg">'
            +'<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" class="parl-leg-img" onerror="this.style.display=\'none\'">'
            +'<div class="parl-leg-info"><div class="parl-leg-name">'+l.playerName+'</div><div class="parl-leg-detail">'+cap(l.statType)+' O'+(l.dkLine||l.line)+' · '+(l.team||'')+' vs '+(l.opponent||'')+'</div></div>'
            +'<span class="parl-leg-conf" style="color:'+tc+'">'+l.confidence+'%</span>'
          +'</div>';
        }).join('')
        +(c.sameGame?'<div class="parl-sgp-warn">⚠️ Contains same-game picks</div>':'')
        +'<div class="parl-foot">'
          +'<div class="parl-foot-item"><div class="parl-foot-lbl">Combined</div><div class="parl-foot-val" style="color:var(--gold)">'+c.prob+'%</div></div>'
          +'<div class="parl-foot-item"><div class="parl-foot-lbl">$100 Payout</div><div class="parl-foot-val" style="color:var(--green)">+$'+payout+'</div></div>'
          +'<div class="parl-foot-item"><div class="parl-foot-lbl">PP Type</div><div class="parl-foot-val">Flex Play</div></div>'
        +'</div>'
        +'<button class="parl-add-btn" onclick="addParlayToSlip(this)" data-legs=\''+JSON.stringify(c.legs.map(function(l){return{label:l.playerName+' '+cap(l.statType)+' OVER '+(l.dkLine||l.line),name:l.playerName,game:(l.team||'')+' vs '+(l.opponent||''),conf:l.confidence,type:l.statType,nbaId:l.nbaPhotoId||'0'};})).replace(/'/g,"&#39;")+'\'>＋ Add All to Slip</button>'
      +'</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

function addParlayToSlip(btn) {
  try {
    var legs = JSON.parse(btn.dataset.legs);
    legs.forEach(function(l) {
      var pid = (l.nbaId+'_'+l.type).replace(/[^a-z0-9_]/gi,'_');
      if (slipPicks.find(function(p){return p.pickId===pid;})) return;
      if (slipPicks.length >= 8) return;
      slipPicks.push({pickId:pid, label:l.label, name:l.name, game:l.game, conf:l.conf, type:l.type, nbaId:l.nbaId});
    });
    renderSlip();
    updateBankrollUI();
    btn.textContent = '✓ Added to Slip';
    btn.disabled = true;
    btn.classList.add('added');
    showToast('✓ Parlay added to slip!');
  } catch(e) { showToast('Error adding parlay'); }
}

// ── INJURIES ─────────────────────────────────────
async function loadInjuries() {
  try {
    var r = await fetch('/api/injuries');
    var d = await r.json();
    var el = document.getElementById('injuries-content');
    if (!el) return;
    var injuries = d.injuries || [];

    // Build game filter buttons
    var games = window._liveGames || [];
    var gameFilterEl = document.getElementById('injury-game-filters');
    if (gameFilterEl && games.length) {
      var btns = '<button class="fbtn active" style="font-size:10px;padding:5px 10px" onclick="filterInjuryGame(\'all\',this)">All Games</button>';
      games.forEach(function(g) {
        var key = (g.awayTeam+'_'+g.homeTeam).toLowerCase();
        btns += '<button class="fbtn" style="font-size:10px;padding:5px 10px" onclick="filterInjuryGame(\''+key+'\',this)">'+g.awayTeam+' @ '+g.homeTeam+'</button>';
      });
      gameFilterEl.innerHTML = btns;
    }

    if (!injuries.length) { el.innerHTML='<div class="err-box"><h3>No Injuries</h3><p>Injury data updates throughout the day.</p></div>'; return; }
    var html = '<div class="inj-grid">';
    injuries.forEach(function(inj) {
      var s = (inj.status||'').toLowerCase();
      var ic = s.includes('out')?'ic-out':s.includes('quest')?'ic-q':'ic-dtd';
      var playerTeam = (inj.team||'').toUpperCase();
      var gameKey = 'all';
      games.forEach(function(g) {
        if (g.awayTeam===playerTeam||g.homeTeam===playerTeam) gameKey=(g.awayTeam+'_'+g.homeTeam).toLowerCase();
      });
      html += '<div class="inj-card '+(s.includes('quest')?'q':s.includes('prob')?'pr':s.includes('out')?'out':'')+'" data-status="'+s+'" data-game="'+gameKey+'">'
        +'<div class="inj-name">'+inj.playerName+'<span class="inj-chip '+ic+'">'+inj.status+'</span></div>'
        +'<div class="inj-team">'+inj.team+' · '+(inj.injury||'')+'</div>'
        +'<div class="inj-imp">'+(inj.bettingImpact||'Monitor situation.')+'</div>'
      +'</div>';
    });
    el.innerHTML = html + '</div>';
  } catch(e) { showErr('injuries', e.message); }
}

// ── TICKER ───────────────────────────────────────
function updateTicker(games) {
  var items = [];
  games.forEach(function(g) {
    if (g.status==='live') items.push('<div class="tick"><span class="dot"></span>LIVE: '+g.awayTeam+' '+g.awayScore+' – '+g.homeTeam+' '+g.homeScore+' · '+g.quarter+' '+g.clock+'</div>');
    else if (g.status==='scheduled') items.push('<div class="tick"><span class="dot"></span>'+g.awayTeam+' @ '+g.homeTeam+' · '+g.tipoff+' · Spread: '+g.spread+'</div>');
    else if (g.status==='final') items.push('<div class="tick"><span class="dot"></span>FINAL: '+g.awayTeam+' '+g.awayScore+' – '+g.homeTeam+' '+g.homeScore+'</div>');
  });
  var el = document.getElementById('ticker-inner');
  if (el && items.length) el.innerHTML = items.concat(items).join('');
}

// ── PICK SLIP ────────────────────────────────────
function addPick(btn, label, name, game, conf, type, nbaId, pickId) {
  if (slipPicks.length >= 8) { showToast('Max 8 picks!'); return; }
  var pid = pickId || (nbaId+'_'+type);
  if (slipPicks.find(function(p){ return p.pickId===pid; })) { showToast('Already added!'); return; }
  slipPicks.push({ pickId:pid, label:label, name:name, game:game, conf:parseInt(conf), type:type, nbaId:nbaId });
  btn.classList.add('added');
  btn.textContent = '✓ Added';
  btn.disabled = true;
  renderSlip();
  updateBankrollUI();
  showToast('✓ '+name+' added!');
  // Show mini badge on non-props tabs
  var active = document.querySelector('.tab-content.active');
  if (active && active.id !== 'tab-props') {
    var mini = document.getElementById('mini-slip-btn');
    if (mini) { mini.style.display='flex'; }
    var badge = document.getElementById('mini-slip-count');
    if (badge) badge.textContent = slipPicks.length;
  }
}

function removePick(pid) {
  slipPicks = slipPicks.filter(function(p){ return p.pickId!==pid; });
  document.querySelectorAll('.btn-add-pick').forEach(function(b){
    if (b.dataset && b.dataset.pickId===pid) { b.classList.remove('added'); b.textContent='＋ Add to Slip'; b.disabled=false; }
  });
  renderSlip();
  updateBankrollUI();
}

function renderSlip() {
  ['','mobile'].forEach(function(sfx) {
    var pfx = sfx ? '-'+sfx : '';
    var emEl = document.getElementById('slip-empty'+pfx);
    var liEl = document.getElementById('slip-list'+pfx);
    var caEl = document.getElementById('slip-calc'+pfx);
    if (!emEl||!liEl||!caEl) return;
    if (!slipPicks.length) {
      emEl.style.display='block'; liEl.style.display='none'; liEl.innerHTML=''; caEl.style.display='none'; return;
    }
    emEl.style.display='none'; liEl.style.display='block'; caEl.style.display='block';
    var html='';
    slipPicks.forEach(function(p) {
      var col=p.conf>=80?'#FFD700':p.conf>=65?'#00D4AA':p.conf>=50?'#60a5fa':'#ff5555';
      html+='<div class="slip-leg">'
        +'<div class="slip-av"><img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+p.nbaId+'.png" onerror="this.style.display=\'none\'" style="width:32px;height:32px;border-radius:50%;object-fit:cover"></div>'
        +'<div class="slip-li"><div class="slip-ln">'+p.name+'</div><div class="slip-ll" style="font-size:10px;color:var(--muted)">'+p.label+'</div></div>'
        +'<div class="slip-lc" style="color:'+col+';font-weight:700;font-size:12px">'+p.conf+'%</div>'
        +'<button class="slip-rm" onclick="removePick(\''+p.pickId+'\')">✕</button>'
      +'</div>';
    });
    liEl.innerHTML=html;
    updateCalc(pfx);
  });
}

function updateCalc(pfx) {
  pfx = pfx||'';
  var n=slipPicks.length; if(!n)return;
  var raw=slipPicks.reduce(function(a,p){return a*p.conf/100;},1);
  var games=slipPicks.map(function(p){return p.game;});
  var dupe=games.some(function(g,i){return games.indexOf(g)!==i;});
  var warn=document.getElementById('slip-warn'+pfx);
  if(warn)warn.style.display=dupe?'block':'none';
  var prob=dupe?raw*0.92:raw;
  var pct=Math.max(1,Math.round(prob*100));
  var pctEl=document.getElementById('slip-pct'+pfx);
  var barEl=document.getElementById('slip-bar'+pfx);
  var tierEl=document.getElementById('slip-tier'+pfx);
  var dkEl=document.getElementById('slip-dk'+pfx);
  var ppEl=document.getElementById('slip-pp'+pfx);
  var frmEl=document.getElementById('slip-formula'+pfx);
  if(pctEl)pctEl.textContent=pct+'%';
  if(barEl)barEl.style.width=Math.min(pct,100)+'%';
  if(tierEl){
    tierEl.className='slip-tier';
    if(pct>=65){tierEl.textContent='🔥 ELITE SLIP';tierEl.classList.add('elite');}
    else if(pct>=45){tierEl.textContent='✅ STRONG SLIP';tierEl.classList.add('strong');}
    else if(pct>=25){tierEl.textContent='⚡ NEUTRAL';tierEl.classList.add('neutral');}
    else{tierEl.textContent='⚠️ FADE RISK';tierEl.classList.add('fade');}
  }
  if(dkEl)dkEl.textContent='+$'+Math.round(((1/prob)-1)*100).toLocaleString();
  if(ppEl)ppEl.textContent=n+'-Leg '+(n<=4?'Power':'Flex');
  if(frmEl)frmEl.textContent=slipPicks.map(function(p){return p.name.split(' ').slice(-1)[0]+'('+p.conf+'%)';}).join(' × ')+' = '+pct+'%';
}

async function analyzeSlip(prefix) {
  prefix = prefix||'';
  if(!slipPicks.length){showToast('Add picks first!');return;}
  var btn = document.querySelector('.slip-ai-btn');
  if(btn){btn.disabled=true;btn.textContent='🕷️ Analyzing...';}
  try {
    var r = await fetch('/api/analysis/slip',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ picks:slipPicks.map(function(p){ return {playerName:p.name,confidence:p.conf,statType:p.type,label:p.label}; }) })
    });
    var d = await r.json();
    var el = document.getElementById('slip-ai'+prefix);
    if(el){el.textContent=d.analysis||'Analysis unavailable.';el.style.display='block';}
  } catch(e){showToast('AI error');}
  if(btn){btn.disabled=false;btn.textContent='🤖 AI Analyze Slip';}
}

function clearSlip(prefix) {
  prefix=prefix||'';
  slipPicks=[];
  document.querySelectorAll('.btn-add-pick.added').forEach(function(b){
    b.classList.remove('added');b.textContent='＋ Add to Slip';b.disabled=false;
  });
  renderSlip();
  updateBankrollUI();
}

function openSlip(){  document.getElementById('mobile-slip-overlay').style.display='flex'; document.body.style.overflow='hidden'; }
function closeSlip(){ document.getElementById('mobile-slip-overlay').style.display='none'; document.body.style.overflow=''; }

// ── BANKROLL SYSTEM ──────────────────────────────
function setBankroll(val) {
  bankrollAmount = parseFloat(val)||0;
  try { localStorage.setItem('bbp_bankroll', bankrollAmount); } catch(e){}
  updateBankrollUI();
}

function updateBankrollUI() {
  var el = document.getElementById('bankroll-recommendation');
  if (!el || !bankrollAmount) return;
  var raw = slipPicks.reduce(function(a,p){return a*p.conf/100;},1);
  var pct = slipPicks.length ? Math.round(raw*100) : 0;
  var betPct, betLabel;
  if(pct>=70){betPct=0.04;betLabel='4% — Strong Edge';}
  else if(pct>=60){betPct=0.03;betLabel='3% — Moderate Edge';}
  else if(pct>=50){betPct=0.02;betLabel='2% — Lean';}
  else if(pct>=35){betPct=0.01;betLabel='1% — Parlay Risk';}
  else{betPct=0;betLabel='Skip — below threshold';}
  var bet = Math.max(1,Math.round(bankrollAmount*betPct));
  var p2 = Math.max(1,Math.round(bankrollAmount*0.03));
  var p3 = Math.max(1,Math.round(bankrollAmount*0.02));
  el.innerHTML = '<div class="br-box">'
    +'<div class="br-title">💰 Bankroll: $'+bankrollAmount.toFixed(0)+'</div>'
    +(pct>0?'<div class="br-rec"><div class="br-rec-lbl">Current slip ('+slipPicks.length+' legs · '+pct+'%)</div>'
      +'<div class="br-bet-main">Bet $<strong>'+bet+'</strong> · '+betLabel+'</div></div>':'')
    +'<div class="br-parlays"><div class="br-parlays-title">📋 Suggested by leg count</div>'
      +'<div class="br-parlay-row"><span class="br-legs">2-Leg</span><span class="br-bet">$'+p2+' · 3% stake</span></div>'
      +'<div class="br-parlay-row"><span class="br-legs">3-Leg</span><span class="br-bet">$'+p3+' · 2% stake</span></div>'
      +'<div class="br-parlay-row"><span class="br-legs">4-Leg+</span><span class="br-bet">$'+Math.max(1,Math.round(bankrollAmount*0.01))+' · 1% stake</span></div>'
    +'</div></div>';
}

// ── TAB SWITCHING ────────────────────────────────
function showTab(id, el) {
  event.preventDefault();
  document.querySelectorAll('.tab-content').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('nav a').forEach(function(a){a.classList.remove('active');});
  if (!id||!document.getElementById(id)) return;
  document.getElementById(id).classList.add('active');
  if (el) el.classList.add('active');

  var layout  = document.querySelector('.main-layout');
  var slip    = document.querySelector('.slip-panel');
  var miniBtn = document.getElementById('mini-slip-btn');

  if (id === 'tab-props') {
    if (layout) layout.style.gridTemplateColumns = '1fr 330px';
    if (slip)   { slip.style.display = 'block'; }
    if (miniBtn) miniBtn.style.display = 'none';
    if (allProps.length) buildPropsGameFilter(allProps);
  } else {
    if (layout) layout.style.gridTemplateColumns = '1fr';
    if (slip)   slip.style.display = 'none';
    var count = slipPicks.length;
    if (miniBtn) {
      miniBtn.style.display = count > 0 ? 'flex' : 'none';
      var badge = document.getElementById('mini-slip-count');
      if (badge) badge.textContent = count;
    }
  }
}

var slipPanelCollapsed = false;
function toggleSlipPanel() {
  slipPanelCollapsed = !slipPanelCollapsed;
  var body = document.getElementById('slip-body-collapsible');
  var icon = document.getElementById('slip-toggle-icon');
  if (body) body.style.display = slipPanelCollapsed ? 'none' : '';
  if (icon) icon.style.transform = slipPanelCollapsed ? 'rotate(-90deg)' : '';
}

// ── FILTERS ──────────────────────────────────────
function filterProps(type, btn) {
  document.querySelectorAll('.filter-bar .fbtn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  _propFilterType = type;
  applyPropsFilter();
}

// filterAlt is defined in alt lines section above

function searchProps(val) { _propSearchText=(val||'').toLowerCase().trim(); applyPropsFilter(); }
function clearPropsSearch() { var i=document.getElementById('props-search'); if(i)i.value=''; _propSearchText=''; applyPropsFilter(); }

function applyPropsFilter() {
  var cards = document.querySelectorAll('.prop-card');
  var visible = 0;
  cards.forEach(function(c) {
    var typeOk = _propFilterType==='all'||c.dataset.type===_propFilterType||c.dataset.tier===_propFilterType;
    var srchOk = !_propSearchText||(c.dataset.player||'').includes(_propSearchText)||(c.dataset.team||'').includes(_propSearchText);
    var gameOk = _propGameFilter==='all';
    if (!gameOk) {
      var ct = (c.dataset.team||'').toLowerCase();
      var gf = _propGameFilter.toLowerCase();
      var cp = ct.split('_'), gp = gf.split('_');
      gameOk = ct===gf||(cp[0]===gp[1]&&cp[1]===gp[0]);
    }
    var show = typeOk&&srchOk&&gameOk;
    c.style.display = show?'':'none';
    if(show) visible++;
  });
  var info = document.getElementById('props-search-info');
  if (info) { info.style.display = _propSearchText?'':'none'; if(_propSearchText)info.textContent=visible+' props found'; }
}

function filterPropsByGame(key, btn) {
  _propGameFilter = key;
  document.querySelectorAll('.pgame-btn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  applyPropsFilter();
}

function filterInjuries(status, btn) {
  document.querySelectorAll('.filter-bar .fbtn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.inj-card').forEach(function(c){
    var s=(c.dataset.status||'').toLowerCase();
    c.style.display=(status==='all'||s.includes(status))?'':'none';
  });
}

function searchInjuries(val) {
  val=(val||'').toLowerCase();
  document.querySelectorAll('.inj-card').forEach(function(c){
    c.style.display=c.textContent.toLowerCase().includes(val)?'':'none';
  });
}

function filterInjuryGame(key, btn) {
  document.querySelectorAll('#injury-game-filters .fbtn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.inj-card').forEach(function(c){
    var g=(c.dataset.game||'').toLowerCase();
    c.style.display=(key==='all'||g===key||g.includes(key))?'':'none';
  });
}

// ── GAME FILTER FOR PROPS ────────────────────────
function buildPropsGameFilter(props) {
  var row = document.getElementById('props-game-filter-row');
  if (!row) return;
  var seen={}, games=[];
  props.forEach(function(p){
    if(!p.team||!p.opponent)return;
    var key=p.team.toLowerCase()+'_'+p.opponent.toLowerCase();
    if(seen[key])return;
    seen[key]=1;
    games.push({key:key,away:p.team.toUpperCase(),home:p.opponent.toUpperCase()});
  });
  var btns='<button class="pgame-btn active" data-game="all" onclick="filterPropsByGame(\'all\',this)">🏀 All</button>';
  games.forEach(function(g){
    var aId=NBA_TEAM_IDS[g.away]||'';
    var hId=NBA_TEAM_IDS[g.home]||'';
    var aLogo=aId?'<img src="https://cdn.nba.com/logos/nba/'+aId+'/global/L/logo.svg" style="width:18px;height:18px;vertical-align:middle;margin-right:3px">':'';
    var hLogo=hId?'<img src="https://cdn.nba.com/logos/nba/'+hId+'/global/L/logo.svg" style="width:18px;height:18px;vertical-align:middle;margin-right:3px">':'';
    btns+='<button class="pgame-btn" data-game="'+g.key+'" onclick="filterPropsByGame(\''+g.key+'\',this)">'+aLogo+g.away+' vs '+hLogo+g.home+'</button>';
  });
  row.innerHTML=btns;
}

// ── UTILS ────────────────────────────────────────
function showErr(id,msg){ var e=document.getElementById(id+'-content'); if(e)e.innerHTML='<div class="err-box"><div style="font-size:32px;margin-bottom:8px">🕸️</div><h3>Could not load</h3><p>'+msg+'</p><button class="refresh-btn" onclick="loadAllData()">Retry</button></div>'; }
function showToast(msg){ var t=document.getElementById('toast'); if(!t)return; t.textContent=msg;t.classList.add('show'); setTimeout(function(){t.classList.remove('show');},2400); }
function cap(s){ return s?(s.charAt(0).toUpperCase()+s.slice(1)):''; }
function esc(s){ return (s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
function animateMeters(){ document.querySelectorAll('.lfill').forEach(function(el){ var cur=parseFloat(el.style.width)||50; el.style.width=Math.max(8,Math.min(97,cur+(Math.random()-.38)*5)).toFixed(1)+'%'; }); }

function calcImplied(odds) {
  if(!odds)return 50;
  var n=parseInt((odds+'').replace('+',''));
  if(isNaN(n))return 50;
  return (n>0?100/(n+100):Math.abs(n)/(Math.abs(n)+100)*100).toFixed(0);
}

// ── SHOT MAP ─────────────────────────────────────
function openShotMapFromCard(btn) {
  var name=btn.dataset.name, pid=btn.dataset.pid, team=btn.dataset.team, opp=btn.dataset.opp, stat=btn.dataset.stat;
  if(typeof openShotMap==='function') openShotMap(name,pid,team,opp,stat);
}

// ── STATS (legacy) ───────────────────────────────
function runSearch(q){ var i=document.getElementById('stats-input'); if(i)i.value=q; if(typeof window.searchStats==='function')window.searchStats(); }

// ── DEEP DIVE ─────────────────────────────────────
async function toggleDeepDive(cardId, playerName, pid, team, opponent, statType) {
  var panel = document.getElementById('dd-'+cardId);
  if (!panel) return;
  if (panel.style.display !== 'none') { panel.style.display='none'; return; }
  panel.style.display='block';
  panel.innerHTML='<div style="text-align:center;padding:14px;color:var(--muted);font-size:11px"><div class="sp" style="font-size:20px;display:inline-block">🤖</div> Loading deep dive intel...</div>';
  try {
    var res = await Promise.allSettled([
      fetch('/api/prop-detail?player='+encodeURIComponent(playerName)+'&team='+team+'&opponent='+opponent+'&statType='+statType).then(function(r){return r.json();}),
      fetch('/api/nba/gamelog?playerName='+encodeURIComponent(playerName)+'&playerId='+pid).then(function(r){return r.json();}),
      fetch('/api/projections?playerName='+encodeURIComponent(playerName)+'&statType='+statType).then(function(r){return r.json();})
    ]);
    var detail = res[0].status==='fulfilled'?res[0].value:{};
    var logData = res[1].status==='fulfilled'?res[1].value:{};
    var projData = res[2].status==='fulfilled'?res[2].value:{};
    var html = '<div class="dd-panel">';

    // Real projections from BDL data
    var proj = projData.projection;
    if (proj) {
      var propLine = parseFloat((allProps.find(function(pp){return pp.playerName===playerName&&pp.statType===statType;})||{}).dkLine||0);
      var edgeAvg10 = proj.avg10 ? (proj.avg10 - propLine).toFixed(1) : null;
      var edgeAvg5 = proj.avg5 ? (proj.avg5 - propLine).toFixed(1) : null;
      html += '<div class="dd-section dd-proj">'
        +'<div class="dd-section-title">📊 REAL DATA PROJECTION</div>'
        +'<div class="dd-proj-grid">'
          +'<div class="dd-proj-item"><div class="dd-proj-val'+(proj.avg10>propLine?' dd-over':' dd-under')+'">'+proj.avg10+'</div><div class="dd-proj-lbl">L10 Avg</div>'+(edgeAvg10?'<div class="dd-proj-edge'+(parseFloat(edgeAvg10)>0?' dd-over':' dd-under')+'">'+(parseFloat(edgeAvg10)>0?'+':'')+edgeAvg10+'</div>':'')+'</div>'
          +'<div class="dd-proj-item"><div class="dd-proj-val'+(proj.avg5>propLine?' dd-over':' dd-under')+'">'+proj.avg5+'</div><div class="dd-proj-lbl">L5 Avg</div>'+(edgeAvg5?'<div class="dd-proj-edge'+(parseFloat(edgeAvg5)>0?' dd-over':' dd-under')+'">'+(parseFloat(edgeAvg5)>0?'+':'')+edgeAvg5+'</div>':'')+'</div>'
          +'<div class="dd-proj-item"><div class="dd-proj-val">'+proj.median10+'</div><div class="dd-proj-lbl">Median</div></div>'
          +'<div class="dd-proj-item"><div class="dd-proj-val">'+propLine+'</div><div class="dd-proj-lbl">Line</div></div>'
        +'</div>'
        +'<div class="dd-trend">Trend: <span class="dd-trend-'+(proj.trending||'flat')+'">'+(proj.trending==='up'?'📈 Trending UP':proj.trending==='down'?'📉 Trending DOWN':'➡️ Flat')+'</span> (L5 vs L10)</div>'
      +'</div>';
    }

    // Opponent injuries
    var oppInj = detail.oppInjuries||[];
    if (oppInj.length) {
      html += '<div class="dd-section"><div class="dd-section-title">🏥 '+opponent+' INJURIES</div>';
      oppInj.forEach(function(inj){ var sc=inj.status.toLowerCase().includes('out')?'ic-out':'ic-q'; html+='<div style="display:flex;align-items:center;gap:6px;padding:2px 0;font-size:11px"><span style="font-weight:700">'+inj.playerName+'</span><span class="inj-chip '+sc+'">'+inj.status+'</span><span style="color:var(--muted);font-size:9px;margin-left:auto">'+inj.injury+'</span></div>'; });
      if (detail.matchupNotes&&detail.matchupNotes.length) html+='<div style="font-size:10px;color:var(--gold);margin-top:4px;padding:3px 6px;background:rgba(255,215,0,.06);border-radius:4px">💡 '+detail.matchupNotes.join(' · ')+'</div>';
      html += '</div>';
    }
    // Player stats
    if (detail.playerStats) {
      var ps=detail.playerStats;
      html+='<div class="dd-section"><div class="dd-section-title">📊 '+playerName+' SEASON</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px">';
      [['PPG',ps.pts],['RPG',ps.reb],['APG',ps.ast],['FG%',ps.fg],['3P%',ps.three],['SPG',ps.stl],['BPG',ps.blk],['GP',ps.gp],['MIN',ps.min]].forEach(function(s){ html+='<div style="background:rgba(255,255,255,.03);border-radius:4px;padding:4px;text-align:center"><div style="font-size:13px;font-weight:700;color:#fff">'+(s[1]||'--')+'</div><div style="font-size:7px;color:var(--muted)">'+s[0]+'</div></div>'; });
      html+='</div>';
      if(ps.note)html+='<div style="font-size:9px;color:var(--muted);margin-top:4px;font-style:italic">'+ps.note+'</div>';
      html+='</div>';
    }
    // Last 5 game log
    var rows=(detail.realGameLog||logData.rows||[]).slice(0,5);
    if (rows.length) {
      var sk=statType==='points'?'pts':statType==='rebounds'?'reb':statType==='assists'?'ast':statType==='steals'?'stl':statType==='blocks'?'blk':'pts';
      var propLine=parseFloat((allProps.find(function(pp){return pp.playerName===playerName&&pp.statType===statType;})||{}).dkLine||0);
      var hitC=0;
      html+='<div class="dd-section" style="padding:0"><div style="padding:8px 10px;font-size:9px;font-weight:700;color:var(--gold);letter-spacing:.5px">📋 LAST 5 GAMES</div><table class="sm-table"><thead><tr><th style="text-align:left">Date</th><th>Opp</th><th class="gold">'+cap(statType)+'</th><th>PTS</th><th>REB</th><th>AST</th><th>MIN</th></tr></thead><tbody>';
      rows.forEach(function(g,i){ var val=parseFloat(g[sk])||0; var hit=val>propLine; if(hit)hitC++; html+='<tr class="'+(i%2===0?'sm-even':'')+'"><td class="sm-date">'+(g.date||'')+'</td><td class="sm-matchup">'+(g.matchup||'')+'</td><td style="font-weight:700;color:'+(hit?'var(--green)':'var(--fade)')+'">'+val+'</td><td>'+(g.pts||0)+'</td><td>'+(g.reb||0)+'</td><td>'+(g.ast||0)+'</td><td class="sm-small">'+(g.min||0)+'</td></tr>'; });
      html+='</tbody></table><div style="padding:6px 10px;font-size:11px;color:var(--muted);text-align:center;border-top:1px solid var(--bord)">Hit Rate: <strong style="color:'+(hitC>=3?'var(--green)':'var(--fade)')+'">'+hitC+'/5</strong> over '+propLine+'</div></div>';
    }
    // Other game props
    var gp=(detail.gameProps||[]).filter(function(x){return x.playerName!==playerName;}).slice(0,6);
    if (gp.length) {
      html+='<div class="dd-section"><div class="dd-section-title">🏀 OTHER PROPS THIS GAME</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">';
      gp.forEach(function(x){ var col=x.tier==='elite'?'var(--gold)':x.tier==='strong'?'var(--strong)':'var(--muted)'; html+='<div style="display:flex;align-items:center;gap:4px;padding:3px 6px;background:rgba(255,255,255,.03);border-radius:4px;font-size:10px"><span style="font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+x.playerName+'</span><span style="color:var(--muted);font-size:9px">'+cap(x.statType)+' O'+x.line+'</span><span style="font-weight:700;color:'+col+'">'+x.confidence+'%</span></div>'; });
      html+='</div></div>';
    }

    // AI Analysis section — fires async
    html += '<div class="dd-section dd-ai-section" id="dd-ai-'+cardId+'"><div class="dd-section-title">🤖 AI ANALYSIS</div><div class="dd-ai-loading"><div class="sp" style="font-size:16px;display:inline-block">🤖</div> Analyzing matchup...</div></div>';

    html+='</div>';
    panel.innerHTML=html;

    // Fire AI analysis asynchronously
    fetchDeepDiveAI(cardId, playerName, team, opponent, statType, 
      parseFloat((allProps.find(function(pp){return pp.playerName===playerName&&pp.statType===statType;})||{}).dkLine||0),
      detail.playerStats ? (statType==='points'?detail.playerStats.pts:statType==='rebounds'?detail.playerStats.reb:statType==='assists'?detail.playerStats.ast:null) : null,
      rows, oppInj
    );
  } catch(e) { panel.innerHTML='<div style="text-align:center;padding:10px;color:var(--fade);font-size:11px">Error: '+e.message+'</div>'; }
}

async function fetchDeepDiveAI(cardId, playerName, team, opponent, statType, line, seasonAvg, last5, oppInjuries) {
  var aiEl = document.getElementById('dd-ai-'+cardId);
  if (!aiEl) return;
  try {
    var r = await fetch('/api/deep-dive', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ playerName:playerName, team:team, opponent:opponent, statType:statType, line:line, seasonAvg:seasonAvg, last5:(last5||[]).slice(0,5), oppInjuries:oppInjuries })
    });
    var d = await r.json();
    if (d.success && d.analysis) {
      var formatted = d.analysis.replace(/\n/g,'<br>').replace(/•/g,'<span style="color:var(--gold)">•</span>').replace(/OVER/g,'<span style="color:var(--green);font-weight:700">OVER</span>').replace(/UNDER/g,'<span style="color:var(--fade);font-weight:700">UNDER</span>').replace(/SKIP/g,'<span style="color:var(--muted);font-weight:700">SKIP</span>');
      aiEl.innerHTML = '<div class="dd-section-title">🤖 AI ANALYSIS</div><div class="dd-ai-text">'+formatted+'</div>';
    } else {
      aiEl.innerHTML = '<div class="dd-section-title">🤖 AI ANALYSIS</div><div class="dd-ai-text" style="color:var(--muted)">Add ANTHROPIC_API_KEY in Railway to unlock AI deep dive.</div>';
    }
  } catch(e) {
    aiEl.innerHTML = '<div class="dd-section-title">🤖 AI ANALYSIS</div><div class="dd-ai-text" style="color:var(--muted)">AI analysis temporarily unavailable.</div>';
  }
}

// ── TEAM LOOKUP TABLES ───────────────────────────
var NBA_TEAM_IDS = {
  'ATL':'1610612737','BOS':'1610612738','BKN':'1610612751','CHA':'1610612766',
  'CHI':'1610612741','CLE':'1610612739','DAL':'1610612742','DEN':'1610612743',
  'DET':'1610612765','GSW':'1610612744','HOU':'1610612745','IND':'1610612754',
  'LAC':'1610612746','LAL':'1610612747','MEM':'1610612763','MIA':'1610612748',
  'MIL':'1610612749','MIN':'1610612750','NOP':'1610612740','NYK':'1610612752',
  'OKC':'1610612760','ORL':'1610612753','PHI':'1610612755','PHX':'1610612756',
  'POR':'1610612757','SAC':'1610612758','SAS':'1610612759','TOR':'1610612761',
  'UTA':'1610612762','WAS':'1610612764',
};

var NBA_TEAM_NAMES = {
  ATL:'Hawks',BOS:'Celtics',BKN:'Nets',CHA:'Hornets',CHI:'Bulls',
  CLE:'Cavaliers',DAL:'Mavericks',DEN:'Nuggets',DET:'Pistons',GSW:'Warriors',
  HOU:'Rockets',IND:'Pacers',LAC:'Clippers',LAL:'Lakers',MEM:'Grizzlies',
  MIA:'Heat',MIL:'Bucks',MIN:'Timberwolves',NOP:'Pelicans',NYK:'Knicks',
  OKC:'Thunder',ORL:'Magic',PHI:'76ers',PHX:'Suns',POR:'Blazers',
  SAC:'Kings',SAS:'Spurs',TOR:'Raptors',UTA:'Jazz',WAS:'Wizards',
};
