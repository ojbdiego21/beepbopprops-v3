// BeepBop's Kryptonite — Team weakness cheat sheet
// Data based on 2025-26 season defensive tendencies

var KRYPTONITE_DATA = [
  { team:'ATL', name:'Hawks',    color:'#C1002B',
    weakness:'Point Guards feast vs ATL — 2nd most PG pts allowed',
    pts:{PG:28.4,SG:22.1,SF:21.8,PF:18.2,C:14.1},
    reb:{PG:4.1,SG:4.8,SF:6.2,PF:9.1,C:12.4},
    ast:{PG:8.2,SG:4.1,SF:3.8,PF:2.9,C:2.1},
    threes:{PG:4.2,SG:3.8,SF:2.9,PF:1.8,C:0.4},
    tags:['PG Scorer','Open 3s','Weak Paint D'],
    bestBet:'PG Points Over, SG Threes Over' },

  { team:'BOS', name:'Celtics',  color:'#007A33',
    weakness:'Centers dominate — elite at stopping guards',
    pts:{PG:19.2,SG:18.4,SF:20.1,PF:17.8,C:18.9},
    reb:{PG:3.2,SG:3.9,SF:5.8,PF:10.2,C:14.1},
    ast:{PG:6.1,SG:3.2,SF:3.1,PF:2.4,C:2.8},
    threes:{PG:2.8,SG:2.6,SF:2.2,PF:1.1,C:0.3},
    tags:['C Rebounder','SF Scorer','Lockdown PGs'],
    bestBet:'C Rebounds Over, SF Points Over' },

  { team:'BKN', name:'Nets',     color:'#000000',
    weakness:'EVERYONE scores — league worst defense',
    pts:{PG:28.1,SG:24.8,SF:23.4,PF:20.1,C:16.8},
    reb:{PG:4.8,SG:5.2,SF:7.1,PF:10.8,C:13.9},
    ast:{PG:9.1,SG:4.8,SF:4.2,PF:3.1,C:2.4},
    threes:{PG:4.8,SG:4.2,SF:3.4,PF:2.1,C:0.6},
    tags:['All Positions','Open Everything','No Resistance'],
    bestBet:'Any Points Over, Any Threes Over' },

  { team:'CHA', name:'Hornets',  color:'#1D1160',
    weakness:'SGs get buckets — weak on ball defense in backcourt',
    pts:{PG:22.8,SG:26.1,SF:20.4,PF:17.2,C:15.1},
    reb:{PG:3.8,SG:4.2,SF:6.1,PF:9.8,C:12.8},
    ast:{PG:7.2,SG:3.9,SF:3.4,PF:2.6,C:1.9},
    threes:{PG:3.4,SG:4.1,SF:2.8,PF:1.4,C:0.3},
    tags:['SG Heaven','Soft Perimeter D','Open Pull-Ups'],
    bestBet:'SG Points Over, SG Threes Over' },

  { team:'CHI', name:'Bulls',    color:'#CE1141',
    weakness:'PFs dominate in the post — weak at blocking shots',
    pts:{PG:21.4,SG:20.8,SF:21.1,PF:22.8,C:15.4},
    reb:{PG:3.6,SG:4.1,SF:6.4,PF:11.2,C:13.1},
    ast:{PG:7.4,SG:3.8,SF:3.6,PF:2.8,C:2.2},
    threes:{PG:3.1,SG:3.4,SF:2.6,PF:1.6,C:0.4},
    tags:['PF Scorer','Mid-Range Heaven','No Shot Blocking'],
    bestBet:'PF Points Over, PF Rebounds Over' },

  { team:'CLE', name:'Cavaliers',color:'#860038',
    weakness:'Elite D overall — SFs get the most looks',
    pts:{PG:18.9,SG:19.2,SF:21.8,PF:16.4,C:14.2},
    reb:{PG:3.1,SG:3.8,SF:6.8,PF:9.6,C:12.4},
    ast:{PG:5.8,SG:3.1,SF:3.8,PF:2.2,C:1.8},
    threes:{PG:2.6,SG:2.9,SF:2.8,PF:1.2,C:0.2},
    tags:['Tough D','SF Only Option','Shutdown PGs'],
    bestBet:'SF Points Over, SF Rebounds Over' },

  { team:'DAL', name:'Mavericks',color:'#00538C',
    weakness:'PGs explode — Kyrie OUT all season hurts D rotations',
    pts:{PG:27.2,SG:22.4,SF:20.8,PF:18.1,C:15.2},
    reb:{PG:4.2,SG:4.6,SF:6.2,PF:9.8,C:12.9},
    ast:{PG:8.8,SG:4.2,SF:3.4,PF:2.6,C:1.9},
    threes:{PG:4.4,SG:3.8,SF:2.8,PF:1.4,C:0.3},
    tags:['PG Paradise','Open 3s','Help D Gaps'],
    bestBet:'PG Points Over, PG Assists Over' },

  { team:'DEN', name:'Nuggets',  color:'#0E2240',
    weakness:'Cs and PFs struggle — perimeter D is elite',
    pts:{PG:19.8,SG:20.1,SF:21.2,PF:22.4,C:17.8},
    reb:{PG:3.4,SG:4.1,SF:6.4,PF:11.4,C:14.2},
    ast:{PG:6.2,SG:3.4,SF:3.6,PF:3.1,C:2.4},
    threes:{PG:2.8,SG:3.1,SF:2.4,PF:1.2,C:0.3},
    tags:['Big Man Heaven','Jokic Effect','Perimeter Lockdown'],
    bestBet:'C Rebounds Over, PF Points Over' },

  { team:'DET', name:'Pistons',  color:'#C8102E',
    weakness:'Everyone scores — historically bad defense this decade',
    pts:{PG:26.8,SG:23.4,SF:22.1,PF:19.8,C:16.4},
    reb:{PG:4.4,SG:4.9,SF:6.8,PF:10.4,C:13.6},
    ast:{PG:8.4,SG:4.4,SF:3.9,PF:2.8,C:2.1},
    threes:{PG:4.1,SG:3.9,SF:3.1,PF:1.8,C:0.5},
    tags:['All Positions','Historic Bad D','Easy Games'],
    bestBet:'Any Points Over, Assists Over' },

  { team:'GSW', name:'Warriors', color:'#1D428A',
    weakness:'SGs and SFs — switch heavy creates mismatches',
    pts:{PG:21.2,SG:25.4,SF:24.1,PF:17.8,C:14.2},
    reb:{PG:3.6,SG:4.8,SF:6.8,PF:9.4,C:11.8},
    ast:{PG:6.8,SG:4.2,SF:4.1,PF:2.4,C:1.8},
    threes:{PG:3.2,SG:4.4,SF:3.6,PF:1.6,C:0.3},
    tags:['Wing Scorer','Switch Issues','SG Threes'],
    bestBet:'SG/SF Points Over, SG Threes Over' },

  { team:'HOU', name:'Rockets',  color:'#CE1141',
    weakness:'Physical big men — smaller Rockets struggle vs size',
    pts:{PG:20.4,SG:21.2,SF:21.8,PF:21.4,C:17.2},
    reb:{PG:3.8,SG:4.2,SF:7.1,PF:11.8,C:14.8},
    ast:{PG:6.8,SG:3.6,SF:3.8,PF:2.6,C:2.1},
    threes:{PG:3.1,SG:3.4,SF:2.8,PF:1.4,C:0.3},
    tags:['C Rebounder','Physical Bigs','Even Match'],
    bestBet:'C Rebounds Over, PF+C Pts Over' },

  { team:'IND', name:'Pacers',   color:'#002D62',
    weakness:'Fastest pace in NBA — all assist numbers go up',
    pts:{PG:24.8,SG:22.4,SF:21.2,PF:18.4,C:15.8},
    reb:{PG:4.1,SG:4.6,SF:6.4,PF:10.2,C:13.2},
    ast:{PG:9.8,SG:5.1,SF:4.4,PG:3.4,C:2.8},
    threes:{PG:3.8,SG:3.6,SF:2.9,PF:1.6,C:0.4},
    tags:['Fast Pace','Assists Explode','Easy Transition'],
    bestBet:'PG Assists Over, Any Points Over' },

  { team:'LAC', name:'Clippers', color:'#C8102E',
    weakness:'PFs exploit Zubac-less D — wing defense solid',
    pts:{PG:20.8,SG:21.4,SF:20.8,PF:23.2,C:16.8},
    reb:{PG:3.6,SG:4.2,SF:6.1,PF:11.8,C:13.4},
    ast:{PG:6.8,SG:3.8,SF:3.6,PF:2.8,C:2.1},
    threes:{PG:3.1,SG:3.4,SF:2.6,PF:1.4,C:0.3},
    tags:['PF Scorer','Post Mismatch','Solid Wings'],
    bestBet:'PF Points Over, PF Rebounds Over' },

  { team:'LAL', name:'Lakers',   color:'#552583',
    weakness:'SGs torched — perimeter D lacks athleticism',
    pts:{PG:22.4,SG:26.8,SF:21.4,PF:17.8,C:14.9},
    reb:{PG:3.8,SG:4.9,SF:6.2,PF:9.8,C:12.6},
    ast:{PG:7.4,SG:4.8,SF:3.8,PF:2.4,C:1.9},
    threes:{PG:3.4,SG:4.6,SF:2.8,PF:1.4,C:0.3},
    tags:['SG Paradise','3PT Fest','Perimeter Soft'],
    bestBet:'SG Points Over, SG Threes Over' },

  { team:'MEM', name:'Grizzlies',color:'#5D76A9',
    weakness:'Physical SFs — Memphis good in transition D',
    pts:{PG:21.2,SG:21.8,SF:24.2,PF:18.8,C:15.4},
    reb:{PG:3.8,SG:4.4,SF:7.4,PF:10.6,C:13.2},
    ast:{PG:7.1,SG:3.8,SF:4.1,PF:2.6,C:2.0},
    threes:{PG:3.2,SG:3.4,SF:2.9,PF:1.4,C:0.3},
    tags:['SF Scorer','Wing Mismatch','Physical Paint'],
    bestBet:'SF Points Over, SF Rebounds Over' },

  { team:'MIA', name:'Heat',     color:'#98002E',
    weakness:'Zone D breaks down vs patient ball movement — PFs find gaps',
    pts:{PG:20.4,SG:21.2,SF:20.8,PF:22.4,C:15.8},
    reb:{PG:3.6,SG:4.2,SF:6.4,PF:11.4,C:13.8},
    ast:{PG:7.2,SG:3.8,SF:3.8,PF:2.8,C:2.2},
    threes:{PG:3.1,SG:3.4,SF:2.6,PF:1.6,C:0.4},
    tags:['Zone Beater','PF Gaps','Patient Offense'],
    bestBet:'PF Points Over, PF Rebounds Over' },

  { team:'MIL', name:'Bucks',    color:'#00471B',
    weakness:'PGs and SGs — Giannis help D leaves perimeter open',
    pts:{PG:25.8,SG:24.2,SF:20.4,PF:16.8,C:13.9},
    reb:{PG:4.2,SG:4.8,SF:6.1,PF:9.4,C:12.1},
    ast:{PG:8.6,SG:4.4,SF:3.4,PF:2.4,C:1.8},
    threes:{PG:4.2,SG:4.0,SF:2.6,PF:1.2,C:0.2},
    tags:['Perimeter Bust','PG Scorer','SG Threes'],
    bestBet:'PG/SG Points Over, Threes Over' },

  { team:'MIN', name:'T-Wolves', color:'#0C2340',
    weakness:'Elite D overall — only PFs sneak through',
    pts:{PG:18.4,SG:19.2,SF:19.8,PF:21.2,C:14.1},
    reb:{PG:3.1,SG:3.8,SF:6.1,PF:10.8,C:12.4},
    ast:{PG:5.8,SG:3.1,SF:3.2,PF:2.4,C:1.8},
    threes:{PG:2.4,SG:2.8,SF:2.2,PF:1.1,C:0.2},
    tags:['Best D','PF Only Bet','Shutdown D'],
    bestBet:'PF Points Only, Fade Most Props' },

  { team:'NOP', name:'Pelicans', color:'#002B5C',
    weakness:'SGs and SFs light them up — undermanned roster',
    pts:{PG:22.8,SG:25.4,SF:24.1,PF:18.4,C:15.2},
    reb:{PG:4.1,SG:5.1,SF:7.2,PF:10.4,C:13.4},
    ast:{PG:7.8,SG:4.6,SF:4.2,PF:2.8,C:2.1},
    threes:{PG:3.6,SG:4.2,SF:3.2,PF:1.6,C:0.4},
    tags:['Wing Fest','SG/SF Paradise','Soft Perimeter'],
    bestBet:'SG/SF Points Over, SF Rebounds Over' },

  { team:'NYK', name:'Knicks',   color:'#006BB6',
    weakness:'Physical D — but Cs dominate the glass vs them',
    pts:{PG:20.8,SG:21.2,SF:20.4,PF:18.8,C:18.2},
    reb:{PG:3.4,SG:4.1,SF:6.2,PF:10.4,C:15.2},
    ast:{PG:6.8,SG:3.6,SF:3.4,PF:2.4,C:2.4},
    threes:{PG:2.9,SG:3.2,SF:2.4,PF:1.2,C:0.3},
    tags:['C Rebounder','Physical D','Big Board'],
    bestBet:'C Rebounds Over, C Points Over' },

  { team:'OKC', name:'Thunder',  color:'#007AC1',
    weakness:'Best D in NBA — only elite SFs beat them',
    pts:{PG:18.1,SG:18.8,SF:21.4,PF:16.2,C:13.4},
    reb:{PG:2.9,SG:3.6,SF:6.4,PF:9.2,C:11.8},
    ast:{PG:5.4,SG:2.9,SF:3.4,PF:2.1,C:1.6},
    threes:{PG:2.2,SG:2.6,SF:2.4,PF:0.9,C:0.2},
    tags:['Toughest D','SF Only Bet','Fade Most'],
    bestBet:'SF Points Only, Fade Threes' },

  { team:'ORL', name:'Magic',    color:'#0077C0',
    weakness:'PGs exposed — young guards struggle against speed',
    pts:{PG:25.4,SG:21.8,SF:20.2,PF:17.4,C:14.8},
    reb:{PG:4.4,SG:4.6,SF:6.2,PF:9.8,C:13.1},
    ast:{PG:8.4,SG:3.8,SF:3.6,PF:2.4,C:2.0},
    threes:{PG:4.0,SG:3.4,SF:2.6,PF:1.2,C:0.3},
    tags:['PG Scorer','Assists Rack Up','Young D'],
    bestBet:'PG Points Over, PG Assists Over' },

  { team:'PHI', name:'76ers',    color:'#006BB6',
    weakness:'Cs and PFs — Embiid OUT leaves massive hole inside',
    pts:{PG:21.4,SG:22.1,SF:21.2,PF:22.8,C:19.4},
    reb:{PG:3.8,SG:4.4,SF:6.8,PF:11.8,C:15.4},
    ast:{PG:7.2,SG:3.9,SF:3.8,PF:2.8,C:2.4},
    threes:{PG:3.4,SG:3.6,SF:2.8,PF:1.4,C:0.4},
    tags:['C Rebounder','PF Scorer','No Paint D'],
    bestBet:'C Rebounds Over, PF/C Points Over' },

  { team:'PHX', name:'Suns',     color:'#1D1160',
    weakness:'SFs and PFs — Durant gone leaves wing gaps',
    pts:{PG:21.8,SG:22.4,SF:24.8,PF:21.4,C:15.2},
    reb:{PG:3.8,SG:4.4,SF:7.2,PF:10.8,C:13.4},
    ast:{PG:7.4,SG:4.1,SF:4.2,PF:2.8,C:2.1},
    threes:{PG:3.4,SG:3.8,SF:3.2,PF:1.6,C:0.3},
    tags:['SF Scorer','Wing Gaps','PF Boards'],
    bestBet:'SF Points Over, SF Rebounds Over' },

  { team:'POR', name:'Blazers',  color:'#E03A3E',
    weakness:'Everyone — rebuilding team with bottom-5 defense',
    pts:{PG:27.4,SG:24.8,SF:23.2,PF:20.4,C:17.2},
    reb:{PG:4.6,SG:5.2,SF:7.4,PF:11.2,C:14.4},
    ast:{PG:9.2,SG:4.8,SF:4.4,PF:3.1,C:2.4},
    threes:{PG:4.8,SG:4.4,SF:3.4,PF:2.0,C:0.6},
    tags:['Easiest Game','All Props Hit','No Defense'],
    bestBet:'All Points/Threes/Assists Over' },

  { team:'SAC', name:'Kings',    color:'#5A2D81',
    weakness:'Fast pace — PGs and SGs both benefit',
    pts:{PG:25.1,SG:24.4,SF:21.2,PF:18.4,C:15.8},
    reb:{PG:4.2,SG:4.8,SF:6.4,PF:10.2,C:13.2},
    ast:{PG:8.8,SG:4.6,SF:3.9,PF:2.6,C:2.1},
    threes:{PG:4.2,SG:4.0,SF:2.9,PF:1.6,C:0.4},
    tags:['Fast Pace','PG/SG Scorer','Uptempo D'],
    bestBet:'PG/SG Points Over, PG Assists Over' },

  { team:'SAS', name:'Spurs',    color:'#C4CED4',
    weakness:'Wemby protects paint — SGs and SFs on perimeter',
    pts:{PG:21.4,SG:24.2,SF:23.8,PF:17.4,C:12.8},
    reb:{PG:3.6,SG:4.6,SF:6.8,PF:9.4,C:11.2},
    ast:{PG:7.1,SG:4.2,SF:4.0,PF:2.4,C:1.8},
    threes:{PG:3.4,SG:4.2,SF:3.2,PF:1.2,C:0.2},
    tags:['Perimeter Open','SG/SF Scorer','Paint Protected'],
    bestBet:'SG Points Over, SF Threes Over' },

  { team:'TOR', name:'Raptors',  color:'#CE1141',
    weakness:'Physical wings — PGs handle the ball more vs Toronto',
    pts:{PG:23.8,SG:22.4,SF:22.8,PF:18.4,C:15.2},
    reb:{PG:4.0,SG:4.6,SF:7.1,PF:10.4,C:13.2},
    ast:{PG:8.2,SG:4.2,SF:4.1,PF:2.6,C:2.0},
    threes:{PG:3.6,SG:3.8,SF:3.1,PF:1.4,C:0.3},
    tags:['SF Scorer','PG Playmaker','Wing Soft'],
    bestBet:'PG Assists Over, SF Points Over' },

  { team:'UTA', name:'Jazz',     color:'#002B5C',
    weakness:'Fully rebuilding — every big scores inside',
    pts:{PG:24.2,SG:22.8,SF:21.8,PF:22.4,C:18.4},
    reb:{PG:4.2,SG:4.8,SF:7.2,PF:11.8,C:15.4},
    ast:{PG:8.1,SG:4.2,SF:4.0,PF:2.8,C:2.2},
    threes:{PG:3.8,SG:3.6,SF:3.0,PF:1.6,C:0.4},
    tags:['Tank Mode','All Bigs Score','Easy Props'],
    bestBet:'C/PF Rebounds Over, All Points Over' },

  { team:'WAS', name:'Wizards',  color:'#002B5C',
    weakness:'Worst defense in East — PGs and SGs run wild',
    pts:{PG:28.8,SG:25.4,SF:22.8,PF:19.4,C:16.2},
    reb:{PG:4.8,SG:5.2,SF:7.4,PF:11.2,C:14.2},
    ast:{PG:9.4,SG:5.1,SF:4.2,PF:2.8,C:2.2},
    threes:{PG:5.0,SG:4.4,SF:3.2,PF:1.8,C:0.5},
    tags:['PG Scorer','Assists Galore','Open Everything'],
    bestBet:'PG Points Over, PG Assists Over, Threes Over' },
];

function renderKryptonite() {
  var el = document.getElementById('kryptonite-content');
  if (!el) return;

  var html = '<div class="kryp-grid">';

  KRYPTONITE_DATA.forEach(function(t) {
    // Find best position for each stat
    var bestPts  = bestPos(t.pts);
    var bestReb  = bestPos(t.reb);
    var bestAst  = bestPos(t.ast);
    var best3    = bestPos(t.threes);

    html += '<div class="kryp-card">'
      + '<div class="kryp-head" style="border-left:4px solid '+t.color+'">'
        + '<div class="kryp-team">'+t.team+'</div>'
        + '<div class="kryp-name">'+t.name+'</div>'
        + '<div class="kryp-weakness">'+t.weakness+'</div>'
      + '</div>'
      + '<div class="kryp-stats">'
        + krypStat('🏀 PTS', bestPts.pos, bestPts.val.toFixed(1), t.color)
        + krypStat('🏋️ REB', bestReb.pos, bestReb.val.toFixed(1), t.color)
        + krypStat('🎯 AST', bestAst.pos, bestAst.val.toFixed(1), t.color)
        + krypStat('🌐 3PT', best3.pos,  best3.val.toFixed(1),  t.color)
      + '</div>'
      + '<div class="kryp-tags">'
        + t.tags.map(function(tag){ return '<span class="kryp-tag">'+tag+'</span>'; }).join('')
      + '</div>'
      + '<div class="kryp-best-bet">💡 '+t.bestBet+'</div>'
    + '</div>';
  });

  html += '</div>';
  el.innerHTML = html;
}

function bestPos(obj) {
  var best = { pos: 'PG', val: 0 };
  Object.entries(obj).forEach(function(e) {
    if (e[1] > best.val) { best.pos = e[0]; best.val = e[1]; }
  });
  return best;
}

function krypStat(label, pos, val, color) {
  return '<div class="kryp-stat">'
    + '<div class="kryp-stat-lbl">'+label+'</div>'
    + '<div class="kryp-stat-pos" style="color:'+color+'">'+pos+'</div>'
    + '<div class="kryp-stat-val">'+val+'</div>'
  + '</div>';
}

// Init when tab is shown
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var orig = window.showTab;
    window.showTab = function(id, el) {
      orig(id, el);
      if (id === 'tab-kryptonite') renderKryptonite();
    };
  }, 500);
});
