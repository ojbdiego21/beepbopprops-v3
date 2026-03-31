// BeepBopStats — AI-powered NBA stats chat
var statsHistory = [];

window.initStats = function() {
  var el = document.getElementById('stats-suggestions');
  if (!el) return;
  var examples = [
    'LeBron vs Cavs last 10 games',
    'Who leads the NBA in scoring?',
    'Curry 3-point stats this season',
    'Giannis vs Tatum head to head',
    'Best props for tonight',
    'Wembanyama blocks this season',
    'Trae Young stats on Wizards',
    'Garland stats with Clippers',
    'Is Cade Cunningham playing?',
    'Harden assists with Cavs',
  ];
  el.innerHTML = examples.map(function(s){
    return '<div class="stats-chip" onclick="runSearch(\''+s.replace(/'/g, "\\'")+'\')">' + s + '</div>';
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

  // Add user message to chat
  addMessage('user', q);
  if (inp) inp.value = '';

  // Show typing indicator
  var typingId = 'typing-' + Date.now();
  addTyping(typingId);

  try {
    var r = await fetch('/api/stats/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    var d = await r.json();
    removeTyping(typingId);
    if (d.success) {
      addMessage('ai', d.answer);
    } else {
      addMessage('ai', 'Sorry, I couldn\'t answer that right now. Try again!');
    }
  } catch(e) {
    removeTyping(typingId);
    addMessage('ai', 'Connection error — check your internet and try again.');
  }
};

function addMessage(role, text) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;

  // Remove empty state if present
  var empty = document.getElementById('stats-empty');
  if (empty) empty.style.display = 'none';

  var div = document.createElement('div');
  div.className = 'stats-msg stats-msg-' + role;

  if (role === 'user') {
    div.innerHTML = '<div class="stats-bubble stats-bubble-user">' + escHtml(text) + '</div>';
  } else {
    div.innerHTML = '<div class="stats-bubble stats-bubble-ai">'
      + '<div class="stats-ai-label">🕷️ BeepBopStats</div>'
      + '<div class="stats-ai-text">' + escHtml(text) + '</div>'
    + '</div>';
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addTyping(id) {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  var div = document.createElement('div');
  div.id = id;
  div.className = 'stats-msg stats-msg-ai';
  div.innerHTML = '<div class="stats-bubble stats-bubble-ai"><div class="stats-typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

function clearChat() {
  var chat = document.getElementById('stats-chat');
  if (!chat) return;
  chat.innerHTML = '';
  var empty = document.getElementById('stats-empty');
  if (empty) empty.style.display = 'block';
}

// Init on load
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(window.initStats, 500);
  setTimeout(function(){
    var inp = document.getElementById('stats-input');
    if (inp) inp.addEventListener('keydown', function(e){ if(e.key==='Enter') window.searchStats(); });
  }, 600);
});
