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
    allProps = d.props || [];
    renderProps(allProps);
    renderAltLines(allProps);
  } catch(e) { showErr('props', e.message); }
}

function renderProps(props) {
  if (!props.length) {
    var el = document.getElementById('props-content');
    if (el) el.innerHTML = '<div class="err-box"><h3>No Props</h3><p>Props appear when lines are posted.</p></div>';
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
    var implPct = calcImplied(b.odds);
    booksHtml += '<div class="bk'+(isBest?' best-line':'')+'"><div class="bkname '+b.key+'">'+b.name+'</div><div class="bknum">'+(b.line!=null?b.line:'--')+'</div><div class="bkodds">'+(b.odds||'--')+'</div>'
      + (b.odds && b.odds !== 'More' ? '<div class="bk-impl">'+implPct+'%</div>' : '')
      + '</div>';
  });
  booksHtml += '</div>';

  // ── PROJECTION + EDGE SECTION ──
  var projHtml = '';
  var baseL = parseFloat(p.dkLine||p.line||0);
  var projL = p.projectedLine != null ? parseFloat(p.projectedLine) : null;
  var seasonAvg = p.seasonAvg || null;

  if (projL != null) {
    var diffV = projL - baseL;
    var projCls = diffV > 0 ? 'proj-over' : diffV < 0 ? 'proj-under' : '';
    var arrow   = diffV > 0 ? '▲ +' : diffV < 0 ? '▼ ' : '→ ';
    var absDiff = Math.abs(diffV).toFixed(1);
    var edgePct = baseL > 0 ? ((diffV / baseL) * 100).toFixed(1) : '0.0';
    var edgeSign = diffV > 0 ? '+' : '';

    projHtml = '<div class="proj-line-row">'
      + '<span class="proj-lbl">📊 Projection</span>'
      + '<span class="proj-val '+projCls+'">'+projL+'</span>'
      + '<span class="proj-diff '+projCls+'">'+arrow+absDiff+'</span>'
      + '<span class="proj-edge '+projCls+'">'+edgeSign+edgePct+'% edge</span>'
      + '</div>';
  }

  // ── SEASON AVG ROW ──
  var avgHtml = '';
  if (seasonAvg != null) {
    var avgDiff = seasonAvg - baseL;
    var avgCls = avgDiff > 0 ? 'proj-over' : avgDiff < 0 ? 'proj-under' : '';
    avgHtml = '<div class="season-avg-row">'
      + '<span class="avg-lbl">📈 Season Avg</span>'
      + '<span class="avg-val '+avgCls+'">'+seasonAvg+'</span>'
      + '<span class="avg-diff '+avgCls+'">'+(avgDiff>0?'▲ +':'▼ ')+Math.abs(avgDiff).toFixed(1)+' vs line</span>'
      + '</div>';
  }

  // ── PROBABILITY SECTION ──
  var mainOdds = p.dkOdds || p.fdOdds || '';
  var overImpl  = calcImplied(mainOdds);
  var underImpl = 100 - parseInt(overImpl);
  var fairOver  = calcFairOdds(parseInt(overImpl));
  var fairUnder = calcFairOdds(underImpl);

  var probHtml = '<div class="prob-section">'
    + '<div class="prob-header">Probability</div>'
    + '<div class="prob-bars">'
      + '<div class="prob-item over-prob">'
        + '<span class="prob-side">OVER</span>'
        + '<div class="prob-meter"><div class="prob-fill over-fill" style="width:'+overImpl+'%"></div></div>'
        + '<span class="prob-pct over-pct">'+overImpl+'%</span>'
        + '<span class="prob-fair">'+fairOver+'</span>'
      + '</div>'
      + '<div class="prob-item under-prob">'
        + '<span class="prob-side">UNDER</span>'
        + '<div class="prob-meter"><div class="prob-fill under-fill" style="width:'+underImpl+'%"></div></div>'
        + '<span class="prob-pct under-pct">'+underImpl+'%</span>'
        + '<span class="prob-fair">'+fairUnder+'</span>'
      + '</div>'
    + '</div>'
  + '</div>';

  // ── NBA ID BADGE ──
  var nbaIdHtml = '<div class="nba-id-badge">ID: '+pid+'</div>';

  var pickId  = (pid+'_'+p.statType+'_'+(p.team||'')).replace(/[^a-z0-9_]/gi,'_');
  var safeLabel = esc(p.playerName+' '+cap(p.statType)+' '+(p.direction||'over').toUpperCase()+' '+(p.line||p.dkLine||'?'));
  var safeName  = esc(p.playerName||'');
  var safeGame  = esc((p.team||'')+(p.opponent?' vs '+p.opponent:''));

  return '<div class="prop-card '+t+'" data-type="'+p.statType+'" data-tier="'+t+'" data-player="'+(p.playerName||'').toLowerCase()+'" data-team="'+(p.team||'').toLowerCase()+'_'+(p.opponent||'').toLowerCase()+'">'
    + '<div class="pp-head">'
      + '<div class="av"><img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" onerror="this.style.display=\'none\'"></div>'
      + '<div class="pinfo"><div class="pname">'+p.playerName+'</div><div class="pteam">'+(p.team||'')+(p.opponent?' · vs '+p.opponent:'')+' '+nbaIdHtml+'</div></div>'
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
      + '<div class="prop-actions">'
        + '<button class="btn-add-pick" onclick="addPick(this,\''+safeLabel+'\',\''+safeName+'\',\''+safeGame+'\','+conf+',\''+p.statType+'\',\''+pid+'\',\''+pickId+'\')">＋ Add to Slip</button>'
        + '<button class="btn-shot-map" data-name="'+safeName+'" data-pid="'+pid+'" data-team="'+(p.team||'')+'" data-opp="'+(p.opponent||'')+'" data-stat="'+p.statType+'" onclick="openShotMapFromCard(this)" title="Shot Map">📍 Shot Map</button>'
      + '</div>'
    + '</div>'
  + '</div>';
}

// ── FAIR ODDS CALCULATOR ──
function calcFairOdds(impliedPct) {
  var p = parseInt(impliedPct) || 50;
  if (p <= 0) p = 1; if (p >= 100) p = 99;
  if (p >= 50) {
    return '-' + Math.round((p / (100 - p)) * 100);
  } else {
    return '+' + Math.round(((100 - p) / p) * 100);
  }
}

// ── ALT LINES ────────────────────────────────────
function renderAltLines(props) {
  if (!props.length) { var e=document.getElementById('altlines-content'); if(e)e.innerHTML='<div class="err-box"><h3>No Alt Lines</h3></div>'; return; }
  var html = '';
  props.forEach(function(p) {
    var pid  = p.nbaPhotoId || '0';
    var alts = p.altLines || [];
    var mainLine = p.dkLine || p.line || 0;
    var mainOdds = p.dkOdds || '-110';

    html += '<div class="alt-card" data-type="'+p.statType+'">'
      + '<div class="alt-head">'
        + '<img src="https://cdn.nba.com/headshots/nba/latest/1040x760/'+pid+'.png" onerror="this.style.display=\'none\'" style="width:36px;height:36px;border-radius:50%;object-fit:cover">'
        + '<div><div class="pname" style="font-size:12px">'+p.playerName+'</div><div class="pteam" style="font-size:10px">'+cap(p.statType)+' · '+(p.team||'')+' vs '+(p.opponent||'')+'</div></div>'
        + '<div style="margin-left:auto;text-align:right">'
          + '<div style="font-size:13px;font-weight:700;color:var(--gold)">'+mainLine+'</div>'
          + '<div style="font-size:9px;color:var(--muted)">ID: '+pid+'</div>'
        + '</div>'
      + '</div>'
      + '<div class="alt-lines-table-wrap"><table class="alt-lines-table">'
        + '<thead><tr><th>Line</th><th class="over-col">Over Odds</th><th class="over-col">Over %</th><th class="under-col">Under Odds</th><th class="under-col">Under %</th></tr></thead>'
        + '<tbody>'
      + alts.map(function(a){
          var isMain = a.line === mainLine;
          var overPct  = calcImplied(a.overOdds);
          var underPct = calcImplied(a.underOdds);
          return '<tr class="'+(isMain?'main-line':'')+'">'
            +'<td class="alt-line-num">'+a.line+(isMain?' <span class="alt-tag main">MAIN</span>':'')+'</td>'
            +'<td class="alt-odds over-cell">'+a.overOdds+'</td>'
            +'<td class="alt-prob over-cell">'+overPct+'%</td>'
            +'<td class="alt-odds under-cell">'+a.underOdds+'</td>'
            +'<td class="alt-prob under-cell">'+underPct+'%</td>'
          +'</tr>';
        }).join('')
      + '</tbody></table></div>'
    + '</div>';
  });
  var el = document.getElementById('altlines-content');
  if (el) el.innerHTML = '<div class="alt-grid">'+html+'</div>';
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
    if (!live.length) { el.innerHTML='<div class="err-box"><h3>No Live Games</h3><p>Check back when games tip off.</p></div>'; return; }
    var html = '<div class="games-grid">';
    live.forEach(function(g){
      html += '<div class="game-card live-game">'
        +'<div class="gc-head"><span class="gc-time">'+g.quarter+' '+g.clock+'</span><span class="gc-live">● LIVE</span></div>'
        +'<div class="matchup">'
          +'<div class="team"><div class="team-abbr">'+g.awayTeam+'</div><div class="team-score">'+g.awayScore+'</div></div>'
          +'<div class="vs-mid"><div class="vs-at">@</div></div>'
          +'<div class="team"><div class="team-abbr">'+g.homeTeam+'</div><div class="team-score">'+g.homeScore+'</div></div>'
        +'</div>'
      +'</div>';
    });
    el.innerHTML = html + '</div>';
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
  var elite = allProps.filter(function(p){ return p.tier==='elite'; }).slice(0,6);
  if (!elite.length) { el.innerHTML='<div class="err-box"><h3>Add picks to build parlays</h3></div>'; return; }
  var combos = [];
  for (var i=0;i<elite.length;i++) for(var j=i+1;j<elite.length;j++) {
    var p = (elite[i].confidence/100)*(elite[j].confidence/100);
    combos.push({ legs:[elite[i],elite[j]], prob:Math.round(p*100) });
  }
  combos.sort(function(a,b){ return b.prob-a.prob; });
  var html = '<div class="parlay-grid">';
  combos.slice(0,6).forEach(function(c){
    var payout = Math.round(((1/(c.prob/100))-1)*100);
    html += '<div class="parlay-card">'
      +'<div class="parlay-legs">'+c.legs.map(function(l){ return '<div class="parlay-leg">'+l.playerName+' '+cap(l.statType)+' O'+l.dkLine+'</div>'; }).join('')+'</div>'
      +'<div class="parlay-foot"><span class="parlay-prob">'+c.prob+'%</span><span class="parlay-pay">+$'+payout+' on $100</span></div>'
    +'</div>';
  });
  el.innerHTML = html + '</div>';
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

function filterAlt(type, btn) {
  document.querySelectorAll('.fbtn').forEach(function(b){b.classList.remove('active');});
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.alt-card').forEach(function(c){
    c.style.display = (type==='all'||c.dataset.type===type)?'':'none';
  });
}

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
