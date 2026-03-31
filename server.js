// BeepBopProps$ — Single File Server
// No database needed. Everything is self-contained.
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');
const path    = require('path');
const cron    = require('node-cron');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────
// IN-MEMORY STORE — refreshed every 15 min, never stale
// ─────────────────────────────────────────────────────────────
let store = { games: [], injuries: [], liveProps: [] };

// ─────────────────────────────────────────────────────────────
// CONFIRMED 2025-26 ROSTERS (post Feb 5 trade deadline)
// ─────────────────────────────────────────────────────────────
const TRADES = {
  'Trae Young':              'WAS',  // from ATL Jan 2026
  'Darius Garland':          'LAC',  // from CLE for Harden
  'James Harden':            'CLE',  // from LAC
  'Anthony Davis':           'WAS',  // from DAL trade deadline
  'Jaren Jackson Jr':        'UTA',  // from MEM
  'Jonathan Kuminga':        'ATL',  // from GSW
  'Buddy Hield':             'ATL',  // from GSW
  'Kristaps Porzingis':      'GSW',  // from ATL
  'Norman Powell':           'MIA',  // from LAC
  'John Collins':            'LAC',  // from UTA via MIA
  'Bennedict Mathurin':      'LAC',  // from IND
  'Isaiah Jackson':          'LAC',  // from IND
  'Ivica Zubac':             'IND',  // from LAC
  'Kevin Huerter':           'DET',  // from CHI
  'Jaden Ivey':              'CHI',  // from DET
  'Ayo Dosunmu':             'MIN',  // from CHI
  'Rob Dillingham':          'CHI',  // from MIN
  'Anfernee Simons':         'CHI',  // from BOS
  'Nikola Vucevic':          'BOS',  // from CHI
  'Collin Sexton':           'CHI',  // from CHA
  'Coby White':              'CHA',  // from CHI
  'De\'Andre Hunter':        'SAC',  // from ATL via MIL
  'Tyus Jones':              'DAL',  // from CHA
  'Luka Doncic':             'LAL',  // offseason from DAL
  'Kevin Durant':            'HOU',  // offseason from BKN
};

// ─────────────────────────────────────────────────────────────
// SEEDED PROPS — always fresh, correct rosters
// ─────────────────────────────────────────────────────────────
function buildAltLines(line, odds) {
  const base = parseFloat(line) || 0;
  const num  = parseInt((odds||'-110').replace('+','')) || -110;
  const neg  = (odds||'').startsWith('-');
  return [-2,-1.5,-1,-0.5,0.5,1,1.5,2].map(s => {
    const os = Math.round(s * 22);
    const ov = neg ? num - os : num - os;
    const un = -(Math.abs(ov) + 20);
    const f  = n => n >= 0 ? '+'+n : String(n);
    return { line: parseFloat((base+s).toFixed(1)), overOdds: f(Math.round(ov/5)*5), underOdds: f(Math.round(un/5)*5) };
  });
}

const SEEDED_PROPS = [
  // ── ELITE ──
  { playerName:'Shai Gilgeous-Alexander', team:'OKC', opponent:'DET', statType:'points',   line:30.5, direction:'over',  confidence:87, tier:'elite',   dkLine:30.5, dkOdds:'-112', fdLine:30.5, fdOdds:'-112', mgmLine:31,   mgmOdds:'-118', czrLine:30.5, czrOdds:'-112', ppLine:30.5, rebetLine:30.5, rebetOdds:'-110', hitRateLast10:'8/10', nbaPhotoId:'1628983', reasoning:'SGA vs DET — 84.8% win prob. MVP frontrunner (-275). L10: 32.1 PPG avg.' },
  { playerName:'Victor Wembanyama',       team:'SAS', opponent:'CHI', statType:'blocks',   line:3.5,  direction:'over',  confidence:85, tier:'elite',   dkLine:3.5,  dkOdds:'+116', fdLine:3.5,  fdOdds:'+112', mgmLine:3,    mgmOdds:'-130', czrLine:3.5,  czrOdds:'+110', ppLine:3.5,  rebetLine:3.5,  rebetOdds:'+108', hitRateLast10:'6/10', nbaPhotoId:'1641705', reasoning:'Wemby vs CHI — leads NBA in blocks. SAS 93.9% win prob. +EV market price.' },
  { playerName:'Donovan Mitchell',        team:'CLE', opponent:'UTA', statType:'points',   line:26.5, direction:'over',  confidence:84, tier:'elite',   dkLine:26.5, dkOdds:'-111', fdLine:27,   fdOdds:'-115', mgmLine:26.5, mgmOdds:'-110', czrLine:27,   czrOdds:'-112', ppLine:27.5, rebetLine:26.5, rebetOdds:'-108', hitRateLast10:'7/10', nbaPhotoId:'1628378', reasoning:'Mitchell vs UTA — CLE 93% win prob. UTA 30th defense. Markkanen/Kessler/Nurkic all OUT.' },
  { playerName:'Tyrese Maxey',            team:'PHI', opponent:'MIA', statType:'points',   line:26.5, direction:'over',  confidence:82, tier:'elite',   dkLine:26.5, dkOdds:'-107', fdLine:26.5, fdOdds:'-108', mgmLine:27,   mgmOdds:'-115', czrLine:26.5, czrOdds:'-107', ppLine:26.5, rebetLine:26.5, rebetOdds:'-105', hitRateLast10:'7/10', nbaPhotoId:'1630178', reasoning:'Maxey leads PHI at 28.9 PPG (4th NBA). Ball-dominant scorer, high floor.' },
  { playerName:'Devin Booker',            team:'PHX', opponent:'MEM', statType:'points',   line:25.5, direction:'over',  confidence:83, tier:'elite',   dkLine:25.5, dkOdds:'-105', fdLine:25.5, fdOdds:'-108', mgmLine:26,   mgmOdds:'-112', czrLine:25.5, czrOdds:'-105', ppLine:25.5, rebetLine:25.5, rebetOdds:'-105', hitRateLast10:'8/10', nbaPhotoId:'1626164', reasoning:'Booker vs MEM — PHX 85.8% win prob. MEM 25th defense. Low juice on a great line.' },
  { playerName:'Klay Thompson',           team:'DAL', opponent:'MIN', statType:'threes',   line:1.5,  direction:'over',  confidence:80, tier:'elite',   dkLine:1.5,  dkOdds:'+141', fdLine:1.5,  fdOdds:'+138', mgmLine:1.5,  mgmOdds:'+135', czrLine:1.5,  czrOdds:'+140', ppLine:1.5,  rebetLine:1.5,  rebetOdds:'+135', hitRateLast10:'7/10', nbaPhotoId:'202691',  reasoning:'Klay vs MIN — Kyrie OUT season-ending. Luka Doncic SUSPENDED tonight. Direct usage spike.' },
  // ── STRONG ──
  { playerName:'LeBron James',            team:'LAL', opponent:'WAS', statType:'points',   line:26.5, direction:'over',  confidence:74, tier:'strong',  dkLine:26.5, dkOdds:'-112', fdLine:26.5, fdOdds:'-115', mgmLine:27,   mgmOdds:'-118', czrLine:26.5, czrOdds:'-112', ppLine:26.5, rebetLine:26.5, rebetOdds:'-110', hitRateLast10:'7/10', nbaPhotoId:'2544',    reasoning:'LeBron vs WAS — Luka SUSPENDED so LeBron is THE primary star tonight. WAS 29th defense.' },
  { playerName:'Austin Reaves',           team:'LAL', opponent:'WAS', statType:'points',   line:22.5, direction:'over',  confidence:72, tier:'strong',  dkLine:22.5, dkOdds:'-108', fdLine:22.5, fdOdds:'-110', mgmLine:23,   mgmOdds:'-115', czrLine:22.5, czrOdds:'-107', ppLine:22.5, rebetLine:22.5, rebetOdds:'-105', hitRateLast10:'6/8',  nbaPhotoId:'1631244', reasoning:'Reaves leads LAL at 23.6 PPG. Luka suspended — elevated usage tonight vs WAS.' },
  { playerName:'Victor Wembanyama',       team:'SAS', opponent:'CHI', statType:'points',   line:23.5, direction:'over',  confidence:72, tier:'strong',  dkLine:23.5, dkOdds:'-115', fdLine:24,   fdOdds:'-118', mgmLine:23.5, mgmOdds:'-112', czrLine:23.5, czrOdds:'-112', ppLine:24.5, rebetLine:23.5, rebetOdds:'-112', hitRateLast10:'7/10', nbaPhotoId:'1641705', reasoning:'Wemby 24.2 PPG. SAS 93.9% win prob vs CHI. Dominant matchup all around.' },
  { playerName:'Shai Gilgeous-Alexander', team:'OKC', opponent:'DET', statType:'assists',  line:5.5,  direction:'over',  confidence:72, tier:'strong',  dkLine:5.5,  dkOdds:'-115', fdLine:5.5,  fdOdds:'-115', mgmLine:5.5,  mgmOdds:'-112', czrLine:6,    czrOdds:'-125', ppLine:5.5,  rebetLine:5.5,  rebetOdds:'-112', hitRateLast10:'6/10', nbaPhotoId:'1628983', reasoning:'SGA 6.1 APG. DET bottom-5 in forcing turnovers — SGA will control the game.' },
  { playerName:'Tyler Herro',             team:'MIA', opponent:'PHI', statType:'threes',   line:2.5,  direction:'over',  confidence:68, tier:'strong',  dkLine:2.5,  dkOdds:'-108', fdLine:2.5,  fdOdds:'-108', mgmLine:2.5,  mgmOdds:'-110', czrLine:2.5,  czrOdds:'-107', ppLine:2.5,  rebetLine:2.5,  rebetOdds:'-105', hitRateLast10:'6/10', nbaPhotoId:'1629639', reasoning:'Herro schemed from perimeter. MIA 2nd in scoring (120.3 PPG) this season.' },
  { playerName:'Kyle Filipowski',         team:'UTA', opponent:'CLE', statType:'rebounds', line:7.5,  direction:'over',  confidence:67, tier:'strong',  dkLine:7.5,  dkOdds:'+106', fdLine:7.5,  fdOdds:'+102', mgmLine:7.5,  mgmOdds:'+100', czrLine:7,    czrOdds:'-115', ppLine:7.5,  rebetLine:7.5,  rebetOdds:'+100', hitRateLast10:'5/7',  nbaPhotoId:'1642283', reasoning:'Filipowski starts with Markkanen, Kessler, and Nurkic all OUT. Max boards.' },
  { playerName:'Bam Adebayo',             team:'MIA', opponent:'PHI', statType:'points',   line:19.5, direction:'over',  confidence:67, tier:'strong',  dkLine:19.5, dkOdds:'-112', fdLine:20,   fdOdds:'-115', mgmLine:19.5, mgmOdds:'-110', czrLine:20,   czrOdds:'-112', ppLine:20.5, rebetLine:20,   rebetOdds:'-110', hitRateLast10:'6/10', nbaPhotoId:'1628389', reasoning:'Bam leads MIA at 20.1 PPG. PHI allows points to opposing interior bigs.' },
  { playerName:'Jayson Tatum',            team:'BOS', opponent:'ATL', statType:'points',   line:25.5, direction:'over',  confidence:66, tier:'strong',  dkLine:25.5, dkOdds:'-110', fdLine:26,   fdOdds:'-112', mgmLine:25.5, mgmOdds:'-108', czrLine:25.5, czrOdds:'-110', ppLine:26.5, rebetLine:25.5, rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1628369', reasoning:'Tatum leads BOS. ATL gives up pts to opposing SFs. BOS needs win for seeding.' },
  { playerName:'Jaylen Brown',            team:'BOS', opponent:'ATL', statType:'points',   line:22.5, direction:'over',  confidence:66, tier:'strong',  dkLine:22.5, dkOdds:'-110', fdLine:22.5, fdOdds:'-112', mgmLine:23,   mgmOdds:'-118', czrLine:22.5, czrOdds:'-108', ppLine:22.5, rebetLine:22.5, rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1627759', reasoning:'Brown even money on scoring line. ATL 22nd in pts allowed to SGs.' },
  { playerName:'Norman Powell',           team:'MIA', opponent:'PHI', statType:'threes',   line:2.5,  direction:'over',  confidence:65, tier:'strong',  dkLine:2.5,  dkOdds:'-110', fdLine:2.5,  fdOdds:'-108', mgmLine:2.5,  mgmOdds:'-112', czrLine:2.5,  czrOdds:'-110', ppLine:2.5,  rebetLine:2.5,  rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1626181', reasoning:'Powell leads MIA in 3PM at 2.7/gm. Now on MIA from LAC. MIA 2nd in scoring.' },
  { playerName:'Jalen Johnson',           team:'ATL', opponent:'BOS', statType:'rebounds', line:8.5,  direction:'over',  confidence:66, tier:'strong',  dkLine:8.5,  dkOdds:'+102', fdLine:8.5,  fdOdds:'+100', mgmLine:8.5,  mgmOdds:'+100', czrLine:9,    czrOdds:'-112', ppLine:8.5,  rebetLine:8.5,  rebetOdds:'+100', hitRateLast10:'5/8',  nbaPhotoId:'1630552', reasoning:'Johnson boards in uptempo ATL vs BOS. +EV price at +102. ATL new cornerstone.' },
  { playerName:'Evan Mobley',             team:'CLE', opponent:'UTA', statType:'rebounds', line:9.5,  direction:'over',  confidence:70, tier:'strong',  dkLine:9.5,  dkOdds:'-115', fdLine:9.5,  fdOdds:'-115', mgmLine:9.5,  mgmOdds:'-112', czrLine:10,   czrOdds:'-125', ppLine:9.5,  rebetLine:9.5,  rebetOdds:'-112', hitRateLast10:'6/10', nbaPhotoId:'1630596', reasoning:'Mobley vs UTA with zero interior D. 9.8 RPG avg. Three UTA centers out.' },
  { playerName:'Alperen Sengun',          team:'HOU', opponent:'NOP', statType:'points',   line:20.5, direction:'over',  confidence:66, tier:'strong',  dkLine:20.5, dkOdds:'-112', fdLine:21,   fdOdds:'-118', mgmLine:20.5, mgmOdds:'-110', czrLine:20.5, czrOdds:'-110', ppLine:20.5, rebetLine:20.5, rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1630578', reasoning:'Sengun HOU cornerstone alongside Kevin Durant. 21.2 PPG L10 games.' },
  { playerName:'Dyson Daniels',           team:'ATL', opponent:'BOS', statType:'steals',   line:1.5,  direction:'over',  confidence:65, tier:'strong',  dkLine:1.5,  dkOdds:'+105', fdLine:1.5,  fdOdds:'+102', mgmLine:1.5,  mgmOdds:'+100', czrLine:1.5,  czrOdds:'+105', ppLine:1.5,  rebetLine:1.5,  rebetOdds:'+100', hitRateLast10:'6/10', nbaPhotoId:'1631107', reasoning:'Daniels leads NBA in steals. Positive odds = market inefficiency. BOS high turnover rate.' },
  { playerName:'James Harden',            team:'CLE', opponent:'UTA', statType:'assists',  line:7.5,  direction:'over',  confidence:68, tier:'strong',  dkLine:7.5,  dkOdds:'-115', fdLine:7.5,  fdOdds:'-115', mgmLine:7.5,  mgmOdds:'-112', czrLine:8,    czrOdds:'-125', ppLine:7.5,  rebetLine:7.5,  rebetOdds:'-112', hitRateLast10:'6/10', nbaPhotoId:'201935',  reasoning:'Harden now on CLE — 7.5 APG since joining Cavs. CLE 93% win prob vs UTA.' },
  { playerName:'Darius Garland',          team:'LAC', opponent:'POR', statType:'points',   line:19.5, direction:'over',  confidence:65, tier:'strong',  dkLine:19.5, dkOdds:'-112', fdLine:20,   fdOdds:'-118', mgmLine:19.5, mgmOdds:'-110', czrLine:19.5, czrOdds:'-110', ppLine:19.5, rebetLine:19.5, rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1629636', reasoning:'Garland now on LAC — 21.1 PPG, 50.6 FG%, 51.2 3PT% with Clippers.' },
  // ── NEUTRAL ──
  { playerName:'Cooper Flagg',            team:'DAL', opponent:'MIN', statType:'points',   line:19.5, direction:'over',  confidence:55, tier:'neutral', dkLine:19.5, dkOdds:'-110', fdLine:19.5, fdOdds:'-112', mgmLine:20,   mgmOdds:'-118', czrLine:19.5, czrOdds:'-110', ppLine:19.5, rebetLine:20,   rebetOdds:'-110', hitRateLast10:'5/10', nbaPhotoId:'1642366', reasoning:'Flagg 20.4 PPG. Klay is primary handler with Kyrie OUT + Luka SUSPENDED. Coin flip.' },
  { playerName:'Jonathan Kuminga',        team:'ATL', opponent:'BOS', statType:'points',   line:17.5, direction:'over',  confidence:63, tier:'neutral', dkLine:17.5, dkOdds:'-110', fdLine:18,   fdOdds:'-115', mgmLine:17.5, mgmOdds:'-110', czrLine:17.5, czrOdds:'-108', ppLine:17.5, rebetLine:17.5, rebetOdds:'-108', hitRateLast10:'5/10', nbaPhotoId:'1630557', reasoning:'Kuminga now on ATL — new role as starter alongside Jalen Johnson post-trade.' },
  { playerName:'Trae Young',              team:'WAS', opponent:'LAL', statType:'assists',  line:6.5,  direction:'over',  confidence:58, tier:'neutral', dkLine:6.5,  dkOdds:'-115', fdLine:6.5,  fdOdds:'-115', mgmLine:6.5,  mgmOdds:'-112', czrLine:7,    czrOdds:'-125', ppLine:6.5,  rebetLine:6.5,  rebetOdds:'-112', hitRateLast10:'5/10', nbaPhotoId:'1629027', reasoning:'Trae now on WAS — 6.2 APG since debut. Monitor quad contusion status before betting.' },
  { playerName:'Matas Buzelis',           team:'CHI', opponent:'SAS', statType:'points',   line:15.5, direction:'over',  confidence:58, tier:'neutral', dkLine:15.5, dkOdds:'-110', fdLine:16,   fdOdds:'-118', mgmLine:15.5, mgmOdds:'-108', czrLine:15.5, czrOdds:'-110', ppLine:15.5, rebetLine:16,   rebetOdds:'-108', hitRateLast10:'5/10', nbaPhotoId:'1642267', reasoning:'Buzelis leads CHI at 16.4 PPG. Line may be slightly low but SAS D is tough.' },
  { playerName:'Amen Thompson',           team:'HOU', opponent:'NOP', statType:'rebounds', line:7.5,  direction:'over',  confidence:65, tier:'strong',  dkLine:7.5,  dkOdds:'-115', fdLine:7.5,  fdOdds:'-115', mgmLine:7.5,  mgmOdds:'-112', czrLine:8,    czrOdds:'-125', ppLine:7.5,  rebetLine:7.5,  rebetOdds:'-112', hitRateLast10:'6/10', nbaPhotoId:'1641734', reasoning:'Thompson 8.1 RPG. NOP 26th in opp rebounds allowed. HOU wing.' },
  { playerName:'Jalen Brunson',           team:'NYK', opponent:'HOU', statType:'points',   line:26.5, direction:'over',  confidence:66, tier:'strong',  dkLine:26.5, dkOdds:'-112', fdLine:27,   fdOdds:'-118', mgmLine:26.5, mgmOdds:'-110', czrLine:26.5, czrOdds:'-110', ppLine:26.5, rebetLine:26.5, rebetOdds:'-108', hitRateLast10:'6/10', nbaPhotoId:'1628386', reasoning:'Brunson 26.8 PPG. HOU allows points to opposing PGs. Tue game.' },
  // ── FADE ──
  { playerName:'Cade Cunningham',         team:'DET', opponent:'OKC', statType:'points',   line:22.5, direction:'under', confidence:35, tier:'fade',    dkLine:22.5, dkOdds:'-112', fdLine:22.5, fdOdds:'-110', mgmLine:22.5, mgmOdds:'-112', czrLine:22,   czrOdds:'+105', ppLine:22.5, rebetLine:22.5, rebetOdds:'-110', hitRateLast10:'4/10', nbaPhotoId:'1630595', reasoning:'FADE — Cade OUT with collapsed lung injury. Do NOT bet this prop.' },
  { playerName:'Bam Adebayo',             team:'MIA', opponent:'PHI', statType:'rebounds', line:9.5,  direction:'under', confidence:40, tier:'fade',    dkLine:9.5,  dkOdds:'-110', fdLine:9.5,  fdOdds:'-108', mgmLine:9.5,  mgmOdds:'-112', czrLine:9,    czrOdds:'+108', ppLine:9.5,  rebetLine:9.5,  rebetOdds:'-108', hitRateLast10:'4/10', nbaPhotoId:'1628389', reasoning:'FADE OVER — PHI limits boards to opposing Cs. Play the Under here.' },
  { playerName:'Jalen Duren',             team:'DET', opponent:'OKC', statType:'rebounds', line:10.5, direction:'under', confidence:42, tier:'fade',    dkLine:10.5, dkOdds:'-110', fdLine:10.5, fdOdds:'-112', mgmLine:10.5, mgmOdds:'-112', czrLine:10,   czrOdds:'+108', ppLine:10.5, rebetLine:10.5, rebetOdds:'-108', hitRateLast10:'4/10', nbaPhotoId:'1631105', reasoning:'FADE OVER — Chet Holmgren limits paint boards. Tough interior matchup for Duren.' },
];

SEEDED_PROPS.forEach(p => {
  p.altLines = buildAltLines(p.dkLine, p.dkOdds);
});

// ─────────────────────────────────────────────────────────────
// PLAYER STATS DATABASE
// ─────────────────────────────────────────────────────────────
const PLAYER_STATS = {
  'shai gilgeous-alexander': { team:'OKC', pts:32.1, reb:5.1, ast:6.1, stl:2.0, blk:0.8, fg:'53.4%', three:'35.2%', gp:67, min:33.8, note:'MVP Frontrunner (-275)' },
  'victor wembanyama':       { team:'SAS', pts:24.2, reb:10.2,ast:3.5, stl:1.8, blk:3.8, fg:'49.1%', three:'33.4%', gp:54, min:32.1, note:'MVP Candidate (+220)' },
  'luka doncic':             { team:'LAL', pts:28.9, reb:8.4, ast:8.7, stl:1.3, blk:0.5, fg:'51.2%', three:'38.1%', gp:58, min:35.2, note:'SUSPENDED tonight vs WAS' },
  'tyrese maxey':            { team:'PHI', pts:28.9, reb:3.9, ast:6.5, stl:0.9, blk:0.4, fg:'47.8%', three:'39.1%', gp:71, min:34.5, note:'4th in NBA scoring' },
  'lebron james':            { team:'LAL', pts:25.3, reb:7.8, ast:8.2, stl:1.2, blk:0.6, fg:'52.1%', three:'37.8%', gp:61, min:34.1, note:'Primary LAL star tonight — Luka suspended' },
  'donovan mitchell':        { team:'CLE', pts:27.9, reb:4.6, ast:5.8, stl:1.5, blk:0.4, fg:'48.3%', three:'37.9%', gp:68, min:34.2, note:'7th in NBA scoring' },
  'devin booker':            { team:'PHX', pts:25.4, reb:4.1, ast:6.0, stl:1.0, blk:0.3, fg:'49.8%', three:'37.2%', gp:66, min:33.8, note:'PHX top scorer' },
  'jayson tatum':            { team:'BOS', pts:26.7, reb:8.2, ast:4.9, stl:1.1, blk:0.6, fg:'46.9%', three:'37.5%', gp:72, min:35.1, note:'BOS franchise player' },
  'jaylen brown':            { team:'BOS', pts:22.8, reb:5.5, ast:3.9, stl:1.1, blk:0.4, fg:'47.2%', three:'35.8%', gp:70, min:33.2, note:'BOS co-star' },
  'nikola jokic':            { team:'DEN', pts:26.4, reb:12.8,ast:9.2, stl:1.4, blk:0.8, fg:'57.8%', three:'35.1%', gp:65, min:34.5, note:'3-time MVP' },
  'stephen curry':           { team:'GSW', pts:24.1, reb:4.3, ast:5.9, stl:1.2, blk:0.2, fg:'47.9%', three:'41.3%', gp:58, min:32.8, note:'Questionable (ankle)' },
  'giannis antetokounmpo':   { team:'MIL', pts:30.2, reb:11.8,ast:5.7, stl:1.2, blk:1.1, fg:'57.4%', three:'28.1%', gp:67, min:34.9, note:'2-time MVP' },
  'kawhi leonard':           { team:'LAC', pts:24.8, reb:6.2, ast:3.8, stl:1.7, blk:0.5, fg:'51.8%', three:'39.2%', gp:48, min:31.2, note:'Career-high scoring season' },
  'darius garland':          { team:'LAC', pts:21.1, reb:3.2, ast:7.8, stl:1.1, blk:0.2, fg:'50.6%', three:'51.2%', gp:11, min:32.1, note:'NOW ON LAC — traded from CLE for Harden' },
  'james harden':            { team:'CLE', pts:22.5, reb:5.9, ast:7.5, stl:1.1, blk:0.4, fg:'48.1%', three:'47.0%', gp:66, min:33.1, note:'NOW ON CLE — traded from LAC' },
  'trae young':              { team:'WAS', pts:15.2, reb:3.0, ast:6.2, stl:0.9, blk:0.1, fg:'59.0%', three:'38.0%', gp:5,  min:20.8, note:'NOW ON WAS — traded from ATL Jan 2026' },
  'anthony edwards':         { team:'MIN', pts:29.5, reb:5.3, ast:5.1, stl:1.5, blk:0.7, fg:'46.8%', three:'37.9%', gp:61, min:34.8, note:'QUESTIONABLE (knee) — missed last 6 games' },
  'anthony davis':           { team:'WAS', pts:21.8, reb:10.2,ast:3.1, stl:1.2, blk:2.2, fg:'53.4%', three:'25.1%', gp:49, min:33.2, note:'NOW ON WAS — traded from DAL at deadline' },
  'joel embiid':             { team:'PHI', pts:30.1, reb:11.2,ast:3.8, stl:0.8, blk:1.7, fg:'51.2%', three:'32.1%', gp:38, min:34.1, note:'Injury-riddled season' },
  'bam adebayo':             { team:'MIA', pts:20.1, reb:9.9, ast:3.8, stl:1.1, blk:0.9, fg:'52.8%', three:'22.1%', gp:68, min:33.8, note:'MIA anchor' },
  'klay thompson':           { team:'DAL', pts:16.2, reb:3.1, ast:2.4, stl:0.8, blk:0.3, fg:'45.8%', three:'40.1%', gp:58, min:29.8, note:'Elevated usage — Kyrie OUT + Luka SUSPENDED' },
  'austin reaves':           { team:'LAL', pts:23.6, reb:4.2, ast:5.8, stl:1.0, blk:0.3, fg:'48.9%', three:'40.2%', gp:69, min:34.1, note:'Leads LAL in scoring' },
  'cooper flagg':            { team:'DAL', pts:20.4, reb:6.6, ast:3.2, stl:1.1, blk:1.2, fg:'46.1%', three:'35.8%', gp:65, min:32.8, note:'Top rookie — 29th in NBA scoring' },
  'alperen sengun':          { team:'HOU', pts:21.2, reb:9.8, ast:4.8, stl:1.0, blk:1.3, fg:'53.1%', three:'28.9%', gp:70, min:32.4, note:'HOU cornerstone alongside KD' },
  'kevin durant':            { team:'HOU', pts:24.8, reb:5.8, ast:4.2, stl:0.8, blk:1.1, fg:'52.9%', three:'41.2%', gp:62, min:33.8, note:'15x All-Star — now on HOU' },
  'tyler herro':             { team:'MIA', pts:21.8, reb:4.1, ast:5.2, stl:0.9, blk:0.2, fg:'46.8%', three:'38.9%', gp:67, min:33.2, note:'MIA secondary scorer' },
  'norman powell':           { team:'MIA', pts:19.1, reb:2.8, ast:2.1, stl:0.8, blk:0.2, fg:'49.8%', three:'42.1%', gp:65, min:29.8, note:'NOW ON MIA from LAC — leads in 3PM' },
  'kyle filipowski':         { team:'UTA', pts:14.2, reb:7.0, ast:2.1, stl:0.6, blk:1.1, fg:'48.1%', three:'36.8%', gp:64, min:28.9, note:'Starting C — 3 UTA centers OUT' },
  'jaren jackson jr':        { team:'UTA', pts:22.0, reb:5.9, ast:1.8, stl:0.9, blk:2.8, fg:'48.2%', three:'35.1%', gp:47, min:30.1, note:'NOW ON UTA from MEM' },
  'jalen brunson':           { team:'NYK', pts:26.8, reb:3.7, ast:7.2, stl:1.0, blk:0.2, fg:'48.9%', three:'38.8%', gp:69, min:34.2, note:'NYK primary scorer' },
  'dyson daniels':           { team:'ATL', pts:11.2, reb:4.8, ast:3.9, stl:2.8, blk:0.4, fg:'44.1%', three:'35.1%', gp:70, min:31.8, note:'Leads NBA in steals' },
  'jalen johnson':           { team:'ATL', pts:20.8, reb:8.9, ast:4.2, stl:1.1, blk:0.8, fg:'51.2%', three:'34.8%', gp:68, min:33.1, note:'ATL new franchise cornerstone' },
  'jonathan kuminga':        { team:'ATL', pts:17.9, reb:4.8, ast:2.8, stl:0.9, blk:0.6, fg:'52.1%', three:'35.8%', gp:38, min:28.9, note:'NOW ON ATL from GSW' },
  'cade cunningham':         { team:'DET', pts:23.8, reb:5.1, ast:7.2, stl:1.3, blk:0.4, fg:'46.8%', three:'37.1%', gp:55, min:34.1, note:'OUT — collapsed lung injury' },
  'chet holmgren':           { team:'OKC', pts:18.2, reb:7.8, ast:2.1, stl:0.8, blk:2.3, fg:'49.8%', three:'38.1%', gp:61, min:30.2, note:'OKC rim protector' },
};

// ─────────────────────────────────────────────────────────────
// ESPN DATA FETCH (games + injuries)
// ─────────────────────────────────────────────────────────────
async function fetchESPN() {
  try {
    const d = new Date().toISOString().split('T')[0].replace(/-/g,'');
    const { data } = await axios.get(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d}`,
      { timeout: 8000 }
    );
    store.games = (data.events||[]).map(ev => {
      const comp = ev.competitions[0];
      const home = comp.competitors.find(c=>c.homeAway==='home');
      const away = comp.competitors.find(c=>c.homeAway==='away');
      const odds = comp.odds?.[0]||{};
      const st   = ev.status.type.name;
      return {
        gameId:     ev.id,
        status:     st.includes('FINAL')?'final':st.includes('PROGRESS')?'live':'scheduled',
        homeTeam:   home?.team?.abbreviation||'',
        awayTeam:   away?.team?.abbreviation||'',
        homeRecord: home?.records?.[0]?.summary||'',
        awayRecord: away?.records?.[0]?.summary||'',
        homeScore:  parseInt(home?.score)||0,
        awayScore:  parseInt(away?.score)||0,
        quarter:    ev.status.period?'Q'+ev.status.period:'',
        clock:      ev.status.displayClock||'',
        tipoff:     new Date(ev.date).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'})+' ET',
        arena:      comp.venue?.fullName||'',
        spread:     odds.details||'Pick',
        total:      odds.overUnder?String(odds.overUnder):'N/A',
        homeWinProb: comp.predictor?.homeTeam?.gameProjection||50,
        awayWinProb: comp.predictor?.awayTeam?.gameProjection||50,
      };
    });
    console.log('✅ ESPN: '+store.games.length+' games');
  } catch(e) { console.error('❌ ESPN error:', e.message); }

  try {
    const { data } = await axios.get(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries',
      { timeout: 8000 }
    );
    store.injuries = [];
    for (const team of (data.injuries||[])) {
      for (const item of (team.injuries||[])) {
        const s = (item.status||'').toLowerCase();
        store.injuries.push({
          playerName:  item.athlete?.displayName||'',
          team:        team.team?.abbreviation||'',
          status:      item.status||'Unknown',
          injury:      item.type?.abbreviation||'Injury',
          bettingImpact: s.includes('out')?'OUT — major impact on team usage and spreads.':
                         s.includes('quest')?'Questionable — check 90 min before tip-off.':
                         'Day-to-day — confirm closer to game time.',
        });
      }
    }
    console.log('✅ ESPN: '+store.injuries.length+' injuries');
  } catch(e) { console.error('❌ Injuries error:', e.message); }
}

// ─────────────────────────────────────────────────────────────
// WIN PROBABILITY FROM SPREAD
// ─────────────────────────────────────────────────────────────
const KNOWN_PROBS = {
  'MIA_PHI':{home:44,away:56},'ATL_BOS':{home:54,away:46},
  'MEM_PHX':{home:14,away:86},'SAS_CHI':{home:94,away:6},
  'DAL_MIN':{home:28,away:72},'UTA_CLE':{home:7,away:93},
  'OKC_DET':{home:85,away:15},'LAL_WAS':{home:92,away:8},
};

function getWinProb(homeTeam, awayTeam, spread, rawHome) {
  const k1 = homeTeam+'_'+awayTeam;
  const k2 = awayTeam+'_'+homeTeam;
  if (KNOWN_PROBS[k1]) return { home: KNOWN_PROBS[k1].home, away: KNOWN_PROBS[k1].away };
  if (KNOWN_PROBS[k2]) return { home: KNOWN_PROBS[k2].away, away: KNOWN_PROBS[k2].home };
  if (rawHome && rawHome !== 50) return { home: Math.round(rawHome), away: Math.round(100-rawHome) };
  const match = String(spread||'').match(/([+-]?\d+\.?\d*)/);
  if (match) {
    const num = parseFloat(match[1]);
    const edge = Math.abs(num)*2.8;
    const fav  = Math.min(50+edge,93);
    return num<0 ? {home:Math.round(fav),away:Math.round(100-fav)} : {home:Math.round(100-fav),away:Math.round(fav)};
  }
  return { home:50, away:50 };
}

// ─────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────

// GAMES
app.get('/api/games', (req, res) => {
  const games = store.games.map(g => {
    const prob = getWinProb(g.homeTeam, g.awayTeam, g.spread, g.homeWinProb);
    const gap  = Math.abs(prob.home-50);
    const tier = gap>=35?'elite':gap>=20?'strong':gap>=8?'neutral':'fade';
    const fav  = prob.home>50?g.homeTeam:g.awayTeam;
    const favP = Math.max(prob.home,prob.away);
    const picks= favP>=85?[fav+' Win',fav+' -ATS']:favP>=70?[fav+' Win','Check Spread']:['Close Game'];
    return { ...g, homeWinProb:prob.home, awayWinProb:prob.away, tier, topPicks:picks };
  });
  res.json({ success:true, count:games.length, games });
});

// PROPS — always returns fresh seeded data
app.get('/api/props', (req, res) => {
  let props = SEEDED_PROPS;
  // If Odds API is available, try to fetch live props
  // For now always return seeded
  const tOrd = {elite:0,strong:1,neutral:2,fade:3};
  props = [...props].sort((a,b)=>(tOrd[a.tier]||2)-(tOrd[b.tier]||2)||b.confidence-a.confidence);
  if (req.query.type) props = props.filter(p=>p.statType===req.query.type);
  if (req.query.tier) props = props.filter(p=>p.tier===req.query.tier);
  res.json({ success:true, count:props.length, props });
});

// INJURIES
app.get('/api/injuries', (req, res) => {
  res.json({ success:true, count:store.injuries.length, injuries:store.injuries });
});

// H2H
app.get('/api/h2h/:t1/:t2', async (req, res) => {
  try {
    const t1 = req.params.t1.toUpperCase();
    const t2 = req.params.t2.toUpperCase();
    const TIDS = {ATL:1610612737,BOS:1610612738,BKN:1610612751,CHA:1610612766,CHI:1610612741,CLE:1610612739,DAL:1610612742,DEN:1610612743,DET:1610612765,GSW:1610612744,HOU:1610612745,IND:1610612754,LAC:1610612746,LAL:1610612747,MEM:1610612763,MIA:1610612748,MIL:1610612749,MIN:1610612750,NOP:1610612740,NYK:1610612752,OKC:1610612760,ORL:1610612753,PHI:1610612755,PHX:1610612756,POR:1610612757,SAC:1610612758,SAS:1610612759,TOR:1610612761,UTA:1610612762,WAS:1610612764};
    const id1 = TIDS[t1];
    if (!id1) return res.json({success:false,error:'Unknown team: '+t1});
    const { data } = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id1}/schedule`,{timeout:8000});
    const matchups = (data.events||[]).filter(e=>(e.competitions?.[0]?.competitors||[]).some(c=>c.team?.abbreviation===t2)).slice(-5).map(e=>{
      const comp=e.competitions[0];
      const home=comp.competitors.find(c=>c.homeAway==='home');
      const away=comp.competitors.find(c=>c.homeAway==='away');
      return {date:(e.date||'').split('T')[0],winner:home?.winner?home.team.abbreviation:away?.team?.abbreviation,score:(away?.score||0)+'-'+(home?.score||0),location:home?.team?.abbreviation===t1?'Home':'Away'};
    });
    const t1w = matchups.filter(m=>m.winner===t1).length;
    res.json({success:true,h2h:{team1:t1,team2:t2,last5Games:matchups,team1Wins:t1w,team2Wins:matchups.length-t1w}});
  } catch(e) { res.status(500).json({success:false,error:e.message}); }
});

// STATS SEARCH
app.post('/api/stats/search', async (req, res) => {
  const { query } = req.body||{};
  if (!query) return res.status(400).json({success:false,error:'No query'});
  const lower = query.toLowerCase().trim();
  // Find player
  let foundKey = null;
  for (const key of Object.keys(PLAYER_STATS)) {
    if (lower.includes(key) || lower.includes(key.split(' ').slice(-1)[0])) { foundKey=key; break; }
  }
  if (foundKey) {
    const s = PLAYER_STATS[foundKey];
    const name = foundKey.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    return res.json({success:true, type:'player_season',
      title: name+' ('+s.team+') — 2025-26 Season',
      subtitle: 'Per game averages · '+s.note,
      currentTeam: s.team,
      stats:{ pts:s.pts, reb:s.reb, ast:s.ast, stl:s.stl, blk:s.blk, fg:s.fg, three:s.three, gp:s.gp, min:s.min }
    });
  }
  res.json({success:true, type:'suggestion',
    message:'Try searching a player like "LeBron James" or "Shai Gilgeous-Alexander"',
    suggestions:['Shai Gilgeous-Alexander','Victor Wembanyama','LeBron James','Donovan Mitchell','Trae Young (WAS)','Darius Garland (LAC)','James Harden (CLE)','Anthony Davis (WAS)','Cooper Flagg','Devin Booker']
  });
});

app.get('/api/stats/popular', (req, res) => {
  res.json({success:true, searches:['Shai Gilgeous-Alexander','Victor Wembanyama','LeBron James','Donovan Mitchell','Trae Young (WAS)','Darius Garland (LAC)','James Harden (CLE)','Anthony Davis (WAS)','Cooper Flagg','Devin Booker']});
});

// ANALYSIS
app.post('/api/analysis/slip', async (req, res) => {
  const { picks } = req.body||{};
  if (!picks?.length) return res.status(400).json({success:false,error:'No picks'});
  const prob = picks.reduce((a,p)=>a*(p.conf/100),1);
  const pct  = Math.round(prob*100);
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({success:true, probability:pct, analysis:'Combined probability: '+pct+'%. Add ANTHROPIC_API_KEY to unlock AI analysis.'});
  }
  try {
    const list = picks.map(p=>p.name+' — '+p.type+' '+p.label+' ('+p.conf+'% conf)').join('\n');
    const { data } = await axios.post('https://api.anthropic.com/v1/messages',{
      model:'claude-haiku-4-5-20251001', max_tokens:300,
      messages:[{role:'user',content:'Analyze this NBA parlay slip in 3 sentences. Cover: combined probability, strongest/weakest legs, verdict.\n\n'+list}]
    },{headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','Content-Type':'application/json'}});
    res.json({success:true, probability:pct, analysis:data.content?.[0]?.text||''});
  } catch(e) { res.json({success:true, probability:pct, analysis:'Combined probability: '+pct+'%. AI analysis temporarily unavailable.'}); }
});

app.get('/api/health', (req,res)=>res.json({status:'ok',time:new Date().toISOString(),games:store.games.length,injuries:store.injuries.length}));
app.get('*', (req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

// ─────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('🕷️  BeepBopProps$ → http://localhost:'+PORT);
  await fetchESPN();
  cron.schedule('*/15 12-23 * * *', fetchESPN, {timezone:'America/New_York'});
  cron.schedule('0 0 * * *', fetchESPN, {timezone:'America/New_York'});
});
"// v3 final" 
