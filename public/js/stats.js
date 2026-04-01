// BeepBopStats — AI chat + real game logs
var statsHistory = [];

window.initStats = function() {
  var el = document.getElementById('stats-suggestions');
  if (!el) return;
  var examples = [
    'Donovan Mitchell vs Lakers',
    'LeBron last 10 games',
    'Curry vs Lakers this season',
    'Giannis stats tonight',
    'Best props for tonight',
    'Wembanyama blocks this season',
    'Trae Young stats on Wizards',
    'Garland with Clippers',
    'Is Cade Cunningham playing?',
    'Harden assists with Cavs',
    'LaMelo vs Celtics',
    'Brunson last 5 games',
  ];
  el.innerHTML = examples.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s.replace(/'/g,"\\'")+'\')">'+s+'</div>';
  }).join('');
};

window.runSearch = function(q) {
  var inp = document.getElementById('stats-input');
  if (inp) inp.value = q;
  window.searchStats();
};

window.searchStats = async function() {
  var inp = document.getElementById('stats-input');
  var q   = inp ? inp.value.trim() : '';
  if (!q) { if(window.showToast) showToast('Ask a question!'); return; }
  addMessage('user', q);
  if (inp) inp.value = '';

  var typingId = 'typing-' + Date.now();
  addTyping(typingId);

  try {
    var r = await fetch('/api/stats/ask', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ question: q })
    });
    var d = await r.json();
    removeTyping(typingId);

    if (d.success) {
      // Show game log TABLE first if we have it, then AI context below
      if (d.gameLog && d.gameLog.length > 0) {
        addGameLogMessage(d.gameLog, q, d.answer);
      } else {
        // No game log — just show AI answer
        addMessage('ai', d.answer, null);
      }
    } else {
      addMessage('ai', 'Sorry, could not answer that. Try again!');
    }
  } catch(e) {
    removeTyping(typingId);
    addMessage('ai', 'Connection error — check your internet and try again.');
  }
};

function addGameLogMessage(gameLog, query, aiContext) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var empty = document.getElementById('stats-empty');
  if (empty) empty.style.display = 'none';

  // Calculate averages
  var avgPts = (gameLog.reduce(function(a,g){return a+(parseFloat(g.pts)||0);},0)/gameLog.length).toFixed(1);
  var avgReb = (gameLog.reduce(function(a,g){return a+(parseFloat(g.reb)||0);},0)/gameLog.length).toFixed(1);
  var avgAst = (gameLog.reduce(function(a,g){return a+(parseFloat(g.ast)||0);},0)/gameLog.length).toFixed(1);

  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-ai';
  div.innerHTML = '<div class="stats-bubble stats-bubble-ai" style="width:100%;max-width:100%">'
    + '<div class="stats-ai-label">🕷️ BeepBopStats — Game Log</div>'
    // Averages row
    + '<div class="stats-log-avgs">'
      + '<div class="stats-log-avg"><div class="sla-val">'+avgPts+'</div><div class="sla-lbl">PPG</div></div>'
      + '<div class="stats-log-avg"><div class="sla-val">'+avgReb+'</div><div class="sla-lbl">RPG</div></div>'
      + '<div class="stats-log-avg"><div class="sla-val">'+avgAst+'</div><div class="sla-lbl">APG</div></div>'
      + '<div class="stats-log-avg"><div class="sla-val">'+gameLog.length+'</div><div class="sla-lbl">Games</div></div>'
    + '</div>'
    // Game log table
    + '<div style="overflow-x:auto;margin-top:8px">'
    + '<table class="stats-log-table">'
      + '<thead><tr>'
        + '<th style="text-align:left">Date</th>'
        + '<th>Matchup</th>'
        + '<th>W/L</th>'
        + '<th style="color:var(--gold)">PTS</th>'
        + '<th>REB</th>'
        + '<th>AST</th>'
        + '<th>STL</th>'
        + '<th>BLK</th>'
        + '<th>FG</th>'
        + '<th>3PT</th>'
        + '<th>MIN</th>'
      + '</tr></thead>'
      + '<tbody>'
      + gameLog.map(function(g, i) {
          var highPts = parseFloat(g.pts) >= 30;
          var isWin   = g.result === 'W';
          return '<tr style="'+(i%2===0?'background:rgba(255,255,255,.01)':'')+'">'
            + '<td style="text-align:left;color:var(--muted);font-size:9px;white-space:nowrap">'+g.date+'</td>'
            + '<td style="font-size:9px;white-space:nowrap">'+g.matchup+'</td>'
            + '<td style="font-weight:700;color:'+(isWin?'var(--green)':'var(--fade)')+'">'+g.result+'</td>'
            + '<td style="font-weight:700;color:'+(highPts?'var(--gold)':'var(--txt)')+'">'+g.pts+'</td>'
            + '<td>'+g.reb+'</td>'
            + '<td>'+g.ast+'</td>'
            + '<td>'+g.stl+'</td>'
            + '<td>'+g.blk+'</td>'
            + '<td style="font-size:9px;color:var(--muted)">'+g.fgm+'/'+g.fga+'</td>'
            + '<td style="font-size:9px;color:var(--muted)">'+g.fg3m+'/'+g.fg3a+'</td>'
            + '<td style="font-size:9px;color:var(--muted)">'+g.min+'</td>'
          + '</tr>';
        }).join('')
      + '</tbody>'
    + '</table>'
    + '</div>'
    // AI context below the table
    + (aiContext ? '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:var(--muted);line-height:1.7">'+escHtml(aiContext)+'</div>' : '')
  + '</div>';

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addMessage(role, text, gameLog) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var empty = document.getElementById('stats-empty');
  if (empty) empty.style.display = 'none';

  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-' + role;

  if (role === 'user') {
    div.innerHTML = '<div class="stats-bubble stats-bubble-user">'+escHtml(text)+'</div>';
  } else {
    div.innerHTML = '<div class="stats-bubble stats-bubble-ai">'
      + '<div class="stats-ai-label">🕷️ BeepBopStats</div>'
      + '<div class="stats-ai-text">'+escHtml(text)+'</div>'
    + '</div>';
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addTyping(id) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var div = document.createElement('div');
  div.id = id; div.className = 'stats-msg stats-msg-ai';
  div.innerHTML = '<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping(id){ var el=document.getElementById(id); if(el)el.remove(); }

function escHtml(s){
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

window.clearChat = function(){
  var chat=document.getElementById('stats-chat');
  if(!chat)return;
  chat.innerHTML='';
  var empty=document.getElementById('stats-empty');
  if(empty)empty.style.display='flex';
};

document.addEventListener('DOMContentLoaded',function(){
  setTimeout(window.initStats,500);
  setTimeout(function(){
    var inp=document.getElementById('stats-input');
    if(inp)inp.addEventListener('keydown',function(e){if(e.key==='Enter')window.searchStats();});
  },600);
});
