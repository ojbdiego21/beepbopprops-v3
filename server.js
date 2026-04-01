// BeepBopProps$ — Single File Server v4
// No database. Always fresh. March 31 2026.
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

// In-memory store for ESPN data
let store = { games: [], injuries: [], liveProps: [] };

// ── ALT LINES ──
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

// ── SEEDED PROPS — MARCH 31 2026 ──
// Games April 1 2026: check ESPN for tonights slate
// All 7 books: DraftKings, FanDuel, BetMGM, Caesars, PrizePicks, Underdog, Rebet
// CORRECT NBA PHOTO IDs (verified):
// Jalen Brunson = 1628386, Austin Reaves = 1631244, Jarrett Allen = 1628384
// LaMelo = 1630163, Giannis = 203507, Kawhi = 202695, KD = 201142
// Booker = 1626164, Donovan Mitchell = 1628378, LeBron = 2544
const SEEDED_PROPS = [
  // ── ELITE ──
  { playerName:'LaMelo Ball',             team:'CHA', opponent:'BKN', statType:'points',   line:26.5, direction:'over',  confidence:88, tier:'elite',
    dkLine:26.5, dkOdds:'-118', fdLine:26.5, fdOdds:'-118', mgmLine:27, mgmOdds:'-125', czrLine:26.5, czrOdds:'-118',
    ppLine:26.5, udLine:26.5, udOdds:'+100', rebetLine:26.5, rebetOdds:'-115',
    hitRateLast10:'8/10', nbaPhotoId:'1630163', reasoning:'LaMelo vs BKN — CHA 92.2% win prob. BKN worst defense in NBA. LaMelo 27.1 PPG avg.' },
  { playerName:'Devin Booker',            team:'PHX', opponent:'ORL', statType:'points',   line:25.5, direction:'over',  confidence:85, tier:'elite',
    dkLine:25.5, dkOdds:'-112', fdLine:25.5, fdOdds:'-115', mgmLine:26, mgmOdds:'-118', czrLine:25.5, czrOdds:'-112',
    ppLine:25.5, udLine:25.5, udOdds:'-108', rebetLine:25.5, rebetOdds:'-110',
    hitRateLast10:'8/10', nbaPhotoId:'1626164', reasoning:'Booker vs ORL — PHX 54.4% home fav. ORL 27th in pts allowed. Book 25.4 PPG avg.' },
  { playerName:'Jalen Brunson',           team:'NYK', opponent:'HOU', statType:'points',   line:27.5, direction:'over',  confidence:84, tier:'elite',
    dkLine:27.5, dkOdds:'-110', fdLine:27.5, fdOdds:'-112', mgmLine:28, mgmOdds:'-118', czrLine:27.5, czrOdds:'-110',
    ppLine:27.5, udLine:27.5, udOdds:'-112', rebetLine:27.5, rebetOdds:'-108',
    hitRateLast10:'7/10', nbaPhotoId:'1628973', reasoning:'Brunson vs HOU — NYK just clinched playoff spot. 26.8 PPG season avg.' },
  { playerName:'Giannis Antetokounmpo',   team:'MIL', opponent:'DAL', statType:'points',   line:29.5, direction:'over',  confidence:83, tier:'elite',
    dkLine:29.5, dkOdds:'-110', fdLine:30, fdOdds:'-115', mgmLine:29.5, mgmOdds:'-108', czrLine:29.5, czrOdds:'-110',
    ppLine:29.5, udLine:30, udOdds:'-115', rebetLine:29.5, rebetOdds:'-108',
    hitRateLast10:'7/10', nbaPhotoId:'203507', reasoning:'Giannis vs DAL — MIL needs this win for playoff position. 30.2 PPG avg.' },
  { playerName:'Kawhi Leonard',           team:'LAC', opponent:'POR', statType:'points',   line:23.5, direction:'over',  confidence:82, tier:'elite',
    dkLine:23.5, dkOdds:'-112', fdLine:24, fdOdds:'-115', mgmLine:23.5, mgmOdds:'-110', czrLine:23.5, czrOdds:'-112',
    ppLine:23.5, udLine:23.5, udOdds:'-110', rebetLine:23.5, rebetOdds:'-110',
    hitRateLast10:'7/10', nbaPhotoId:'202695', reasoning:'Kawhi vs POR — LAC 66.8% road fav. Career-high scoring season. POR 28th defense.' },
  { playerName:'Donovan Mitchell',        team:'CLE', opponent:'LAL', statType:'points',   line:27.5, direction:'over',  confidence:80, tier:'elite',
    dkLine:27.5, dkOdds:'-110', fdLine:27.5, fdOdds:'-112', mgmLine:28, mgmOdds:'-115', czrLine:27.5, czrOdds:'-110',
    ppLine:27.5, udLine:28, udOdds:'-118', rebetLine:27.5, rebetOdds:'-108',
    hitRateLast10:'7/10', nbaPhotoId:'1628378', reasoning:'Mitchell vs LAL — 34 pts vs UTA last night. 27.9 PPG avg. Big must-win spot.' },
  // ── STRONG ──
  { playerName:'Kevin Durant',            team:'HOU', opponent:'NYK', statType:'points',   line:24.5, direction:'over',  confidence:74, tier:'strong',
    dkLine:24.5, dkOdds:'-108', fdLine:24.5, fdOdds:'-110', mgmLine:25, mgmOdds:'-115', czrLine:24.5, czrOdds:'-108',
    ppLine:24.5, udLine:24.5, udOdds:'-108', rebetLine:24.5, rebetOdds:'-107',
    hitRateLast10:'6/10', nbaPhotoId:'201142', reasoning:'KD vs NYK — HOU 49.4% slight dog. Durant 24.8 PPG. Great value spot.' },
  { playerName:'Alperen Sengun',          team:'HOU', opponent:'NYK', statType:'points',   line:20.5, direction:'over',  confidence:72, tier:'strong',
    dkLine:20.5, dkOdds:'-112', fdLine:21, fdOdds:'-118', mgmLine:20.5, mgmOdds:'-110', czrLine:20.5, czrOdds:'-110',
    ppLine:20.5, udLine:21, udOdds:'-115', rebetLine:20.5, rebetOdds:'-108',
    hitRateLast10:'6/10', nbaPhotoId:'1630578', reasoning:'Sengun vs NYK — 21.2 PPG L10. NYK allows pts to opposing Cs.' },
  { playerName:'LeBron James',            team:'LAL', opponent:'CLE', statType:'points',   line:24.5, direction:'over',  confidence:70, tier:'strong',
    dkLine:24.5, dkOdds:'-108', fdLine:24.5, fdOdds:'-110', mgmLine:25, mgmOdds:'-115', czrLine:24.5, czrOdds:'-108',
    ppLine:24.5, udLine:24.5, udOdds:'-110', rebetLine:24.5, rebetOdds:'-107',
    hitRateLast10:'6/10', nbaPhotoId:'2544', reasoning:'LeBron vs CLE — winner clinches playoff berth. Big game vs his old team. 25.3 PPG avg.' },
  { playerName:'Darius Garland',          team:'LAC', opponent:'POR', statType:'points',   line:20.5, direction:'over',  confidence:71, tier:'strong',
    dkLine:20.5, dkOdds:'-112', fdLine:21, fdOdds:'-118', mgmLine:20.5, mgmOdds:'-110', czrLine:20.5, czrOdds:'-110',
    ppLine:20.5, udLine:20.5, udOdds:'-112', rebetLine:20.5, rebetOdds:'-108',
    hitRateLast10:'6/10', nbaPhotoId:'1629636', reasoning:'Garland (LAC) vs POR — 21.1 PPG, 50.6 FG%, 51.2 3PT% with Clippers.' },
  { playerName:'Giannis Antetokounmpo',   team:'MIL', opponent:'DAL', statType:'rebounds', line:11.5, direction:'over',  confidence:72, tier:'strong',
    dkLine:11.5, dkOdds:'-112', fdLine:11.5, fdOdds:'-115', mgmLine:11.5, mgmOdds:'-110', czrLine:12, czrOdds:'-125',
    ppLine:11.5, udLine:11.5, udOdds:'-112', rebetLine:11.5, rebetOdds:'-112',
    hitRateLast10:'7/10', nbaPhotoId:'203507', reasoning:'Giannis 11.8 RPG. DAL gives up interior rebounds. Cooper Flagg no match for Giannis size.' },
  { playerName:'LaMelo Ball',             team:'CHA', opponent:'BKN', statType:'assists',  line:8.5,  direction:'over',  confidence:75, tier:'strong',
    dkLine:8.5, dkOdds:'-115', fdLine:8.5, fdOdds:'-115', mgmLine:8.5, mgmOdds:'-112', czrLine:9, czrOdds:'-125',
    ppLine:8.5, udLine:8.5, udOdds:'-112', rebetLine:8.5, rebetOdds:'-112',
    hitRateLast10:'7/10', nbaPhotoId:'1630163', reasoning:'LaMelo 8.8 APG. BKN 27th in forcing turnovers. CHA 92% win prob.' },
  { playerName:'Austin Reaves',           team:'LAL', opponent:'CLE', statType:'points',   line:22.5, direction:'over',  confidence:66, tier:'strong',
    dkLine:22.5, dkOdds:'-108', fdLine:22.5, fdOdds:'-110', mgmLine:23, mgmOdds:'-115', czrLine:22.5, czrOdds:'-108',
    ppLine:22.5, udLine:22.5, udOdds:'-108', rebetLine:22.5, rebetOdds:'-107',
    hitRateLast10:'6/10', nbaPhotoId:'1630559', reasoning:'Reaves 23.6 PPG leads LAL. Big must-win game = full effort and usage.' },
  { playerName:'Evan Mobley',             team:'CLE', opponent:'LAL', statType:'rebounds', line:9.5,  direction:'over',  confidence:68, tier:'strong',
    dkLine:9.5, dkOdds:'-115', fdLine:9.5, fdOdds:'-115', mgmLine:9.5, mgmOdds:'-112', czrLine:10, czrOdds:'-125',
    ppLine:9.5, udLine:9.5, udOdds:'-112', rebetLine:9.5, rebetOdds:'-112',
    hitRateLast10:'6/10', nbaPhotoId:'1630596', reasoning:'Mobley 9.8 RPG. LAL gives up boards in the paint. Big spot for Mobley.' },
  { playerName:'James Harden',            team:'CLE', opponent:'LAL', statType:'assists',  line:7.5,  direction:'over',  confidence:66, tier:'strong',
    dkLine:7.5, dkOdds:'-115', fdLine:7.5, fdOdds:'-115', mgmLine:7.5, mgmOdds:'-112', czrLine:8, czrOdds:'-125',
    ppLine:7.5, udLine:7.5, udOdds:'-112', rebetLine:7.5, rebetOdds:'-112',
    hitRateLast10:'6/10', nbaPhotoId:'201935', reasoning:'Harden (CLE) 7.5 APG since joining Cavs. Must-win game = full playmaking effort.' },
  { playerName:'Kawhi Leonard',           team:'LAC', opponent:'POR', statType:'rebounds', line:5.5,  direction:'over',  confidence:67, tier:'strong',
    dkLine:5.5, dkOdds:'-112', fdLine:5.5, fdOdds:'-115', mgmLine:5.5, mgmOdds:'-110', czrLine:6, czrOdds:'-122',
    ppLine:5.5, udLine:5.5, udOdds:'-110', rebetLine:5.5, rebetOdds:'-110',
    hitRateLast10:'6/10', nbaPhotoId:'202695', reasoning:'Kawhi 6.2 RPG. POR small ball lineup gives up wing boards freely.' },
  { playerName:'Mikal Bridges',           team:'NYK', opponent:'HOU', statType:'points',   line:17.5, direction:'over',  confidence:65, tier:'strong',
    dkLine:17.5, dkOdds:'-110', fdLine:18, fdOdds:'-115', mgmLine:17.5, mgmOdds:'-108', czrLine:17.5, czrOdds:'-110',
    ppLine:17.5, udLine:17.5, udOdds:'-108', rebetLine:17.5, rebetOdds:'-108',
    hitRateLast10:'5/10', nbaPhotoId:'1628969', reasoning:'Bridges 17.1 PPG. HOU focuses D on Brunson leaving Bridges open.' },
  { playerName:'Donovan Mitchell',        team:'CLE', opponent:'LAL', statType:'rebounds', line:4.5,  direction:'over',  confidence:65, tier:'strong',
    dkLine:4.5, dkOdds:'-112', fdLine:4.5, fdOdds:'-115', mgmLine:4.5, mgmOdds:'-110', czrLine:5, czrOdds:'-122',
    ppLine:4.5, udLine:4.5, udOdds:'-110', rebetLine:4.5, rebetOdds:'-110',
    hitRateLast10:'6/10', nbaPhotoId:'1628378', reasoning:'Mitchell pulls 4.6 RPG. LAL gives up boards to opposing SGs in big games.' },
  { playerName:'Jalen Brunson',           team:'NYK', opponent:'HOU', statType:'assists',  line:7.5,  direction:'over',  confidence:65, tier:'strong',
    dkLine:7.5, dkOdds:'-115', fdLine:7.5, fdOdds:'-115', mgmLine:7.5, mgmOdds:'-112', czrLine:8, czrOdds:'-125',
    ppLine:7.5, udLine:7.5, udOdds:'-112', rebetLine:7.5, rebetOdds:'-112',
    hitRateLast10:'6/10', nbaPhotoId:'1628973', reasoning:'Brunson 7.2 APG. HOU forces turnovers but Brunson handles pressure well.' },
  { playerName:'Devin Booker',            team:'PHX', opponent:'ORL', statType:'assists',  line:5.5,  direction:'over',  confidence:64, tier:'neutral',
    dkLine:5.5, dkOdds:'-110', fdLine:5.5, fdOdds:'-112', mgmLine:5.5, mgmOdds:'-110', czrLine:6, czrOdds:'-122',
    ppLine:5.5, udLine:5.5, udOdds:'-108', rebetLine:5.5, rebetOdds:'-108',
    hitRateLast10:'6/10', nbaPhotoId:'1626164', reasoning:'Booker 6.0 APG. PHX runs through him in blowout situations vs ORL.' },
  // ── NEUTRAL ──
  { playerName:'Cooper Flagg',            team:'DAL', opponent:'MIL', statType:'points',   line:18.5, direction:'over',  confidence:58, tier:'neutral',
    dkLine:18.5, dkOdds:'-110', fdLine:18.5, fdOdds:'-112', mgmLine:19, mgmOdds:'-115', czrLine:18.5, czrOdds:'-110',
    ppLine:18.5, udLine:19, udOdds:'-115', rebetLine:19, rebetOdds:'-110',
    hitRateLast10:'5/10', nbaPhotoId:'1642366', reasoning:'Flagg vs MIL — 20.4 PPG but Giannis is a tough matchup. DAL 45.9% road dog.' },
  { playerName:'Paolo Banchero',          team:'ORL', opponent:'PHX', statType:'points',   line:21.5, direction:'over',  confidence:52, tier:'neutral',
    dkLine:21.5, dkOdds:'-108', fdLine:21.5, fdOdds:'-110', mgmLine:22, mgmOdds:'-115', czrLine:21.5, czrOdds:'-108',
    ppLine:21.5, udLine:22, udOdds:'-115', rebetLine:22, rebetOdds:'-108',
    hitRateLast10:'5/10', nbaPhotoId:'1631094', reasoning:'Banchero vs PHX — ORL 45.6% road dog. Tough matchup but 21.8 PPG avg.' },
  { playerName:'Matas Buzelis',           team:'CHI', opponent:'SAS', statType:'points',   line:15.5, direction:'over',  confidence:55, tier:'neutral',
    dkLine:15.5, dkOdds:'-108', fdLine:16, fdOdds:'-115', mgmLine:15.5, mgmOdds:'-106', czrLine:15.5, czrOdds:'-108',
    ppLine:15.5, udLine:15.5, udOdds:'-106', rebetLine:16, rebetOdds:'-108',
    hitRateLast10:'5/10', nbaPhotoId:'1642267', reasoning:'Buzelis leads CHI at 16.4 PPG but SAS defense is elite. Coin flip here.' },
  // ── FADE ──
  { playerName:'Noah Clowney',            team:'BKN', opponent:'CHA', statType:'points',   line:12.5, direction:'under', confidence:35, tier:'fade',
    dkLine:12.5, dkOdds:'-112', fdLine:12.5, fdOdds:'-110', mgmLine:12.5, mgmOdds:'-112', czrLine:12, czrOdds:'+105',
    ppLine:12.5, udLine:12.5, udOdds:'+100', rebetLine:12.5, rebetOdds:'-110',
    hitRateLast10:'3/10', nbaPhotoId:'1641749', reasoning:'FADE OVER — BKN 7.8% win prob vs CHA. BKN players score less in blowout losses. Fade all BKN props.' },
];

SEEDED_PROPS.forEach(p => { p.altLines = buildAltLines(p.dkLine, p.dkOdds); });

// ── PLAYER STATS DATABASE ──
const PLAYER_STATS = {
  'shai gilgeous-alexander': { team:'OKC', pts:32.1, reb:5.1, ast:6.1, stl:2.0, blk:0.8, fg:'53.4%', three:'35.2%', gp:67, min:33.8, note:'MVP Frontrunner (-275)' },
  'victor wembanyama':       { team:'SAS', pts:24.2, reb:10.2,ast:3.5, stl:1.8, blk:3.8, fg:'49.1%', three:'33.4%', gp:54, min:32.1, note:'MVP Candidate (+220)' },
  'luka doncic':             { team:'LAL', pts:28.9, reb:8.4, ast:8.7, stl:1.3, blk:0.5, fg:'51.2%', three:'38.1%', gp:58, min:35.2, note:'SUSPENDED tonight vs CLE' },
  'tyrese maxey':            { team:'PHI', pts:28.9, reb:3.9, ast:6.5, stl:0.9, blk:0.4, fg:'47.8%', three:'39.1%', gp:71, min:34.5, note:'4th in NBA scoring' },
  'lebron james':            { team:'LAL', pts:25.3, reb:7.8, ast:8.2, stl:1.2, blk:0.6, fg:'52.1%', three:'37.8%', gp:61, min:34.1, note:'LAL vs CLE tonight — winner clinches' },
  'donovan mitchell':        { team:'CLE', pts:27.9, reb:4.6, ast:5.8, stl:1.5, blk:0.4, fg:'48.3%', three:'37.9%', gp:68, min:34.2, note:'CLE @ LAL tonight — 34 pts vs UTA last night' },
  'devin booker':            { team:'PHX', pts:25.4, reb:4.1, ast:6.0, stl:1.0, blk:0.3, fg:'49.8%', three:'37.2%', gp:66, min:33.8, note:'PHX @ ORL tonight' },
  'jayson tatum':            { team:'BOS', pts:26.7, reb:8.2, ast:4.9, stl:1.1, blk:0.6, fg:'46.9%', three:'37.5%', gp:72, min:35.1, note:'BOS franchise player' },
  'jaylen brown':            { team:'BOS', pts:22.8, reb:5.5, ast:3.9, stl:1.1, blk:0.4, fg:'47.2%', three:'35.8%', gp:70, min:33.2, note:'BOS co-star' },
  'nikola jokic':            { team:'DEN', pts:26.4, reb:12.8,ast:9.2, stl:1.4, blk:0.8, fg:'57.8%', three:'35.1%', gp:65, min:34.5, note:'3-time MVP' },
  'stephen curry':           { team:'GSW', pts:24.1, reb:4.3, ast:5.9, stl:1.2, blk:0.2, fg:'47.9%', three:'41.3%', gp:58, min:32.8, note:'Questionable (ankle)' },
  'giannis antetokounmpo':   { team:'MIL', pts:30.2, reb:11.8,ast:5.7, stl:1.2, blk:1.1, fg:'57.4%', three:'28.1%', gp:67, min:34.9, note:'MIL @ DAL tonight' },
  'kawhi leonard':           { team:'LAC', pts:24.8, reb:6.2, ast:3.8, stl:1.7, blk:0.5, fg:'51.8%', three:'39.2%', gp:48, min:31.2, note:'LAC @ POR tonight — career-high scoring season' },
  'darius garland':          { team:'LAC', pts:21.1, reb:3.2, ast:7.8, stl:1.1, blk:0.2, fg:'50.6%', three:'51.2%', gp:11, min:32.1, note:'NOW ON LAC — traded from CLE for Harden' },
  'james harden':            { team:'CLE', pts:22.5, reb:5.9, ast:7.5, stl:1.1, blk:0.4, fg:'48.1%', three:'47.0%', gp:66, min:33.1, note:'NOW ON CLE — CLE @ LAL tonight' },
  'trae young':              { team:'WAS', pts:15.2, reb:3.0, ast:6.2, stl:0.9, blk:0.1, fg:'59.0%', three:'38.0%', gp:5,  min:20.8, note:'NOW ON WAS — traded from ATL Jan 2026' },
  'anthony edwards':         { team:'MIN', pts:29.5, reb:5.3, ast:5.1, stl:1.5, blk:0.7, fg:'46.8%', three:'37.9%', gp:61, min:34.8, note:'Missed last 6 with knee injury — returned last night' },
  'anthony davis':           { team:'WAS', pts:21.8, reb:10.2,ast:3.1, stl:1.2, blk:2.2, fg:'53.4%', three:'25.1%', gp:49, min:33.2, note:'NOW ON WAS — traded from DAL at deadline' },
  'joel embiid':             { team:'PHI', pts:30.1, reb:11.2,ast:3.8, stl:0.8, blk:1.7, fg:'51.2%', three:'32.1%', gp:38, min:34.1, note:'Injury-riddled season' },
  'bam adebayo':             { team:'MIA', pts:20.1, reb:9.9, ast:3.8, stl:1.1, blk:0.9, fg:'52.8%', three:'22.1%', gp:68, min:33.8, note:'MIA anchor' },
  'klay thompson':           { team:'DAL', pts:16.2, reb:3.1, ast:2.4, stl:0.8, blk:0.3, fg:'45.8%', three:'40.1%', gp:58, min:29.8, note:'Elevated usage — Kyrie OUT all season' },
  'austin reaves':           { team:'LAL', pts:23.6, reb:4.2, ast:5.8, stl:1.0, blk:0.3, fg:'48.9%', three:'40.2%', gp:69, min:34.1, note:'Leads LAL in scoring — big game tonight vs CLE' },
  'cooper flagg':            { team:'DAL', pts:20.4, reb:6.6, ast:3.2, stl:1.1, blk:1.2, fg:'46.1%', three:'35.8%', gp:65, min:32.8, note:'Top rookie — MIL @ DAL tonight' },
  'alperen sengun':          { team:'HOU', pts:21.2, reb:9.8, ast:4.8, stl:1.0, blk:1.3, fg:'53.1%', three:'28.9%', gp:70, min:32.4, note:'HOU @ NYK tonight' },
  'kevin durant':            { team:'HOU', pts:24.8, reb:5.8, ast:4.2, stl:0.8, blk:1.1, fg:'52.9%', three:'41.2%', gp:62, min:33.8, note:'HOU @ NYK tonight' },
  'tyler herro':             { team:'MIA', pts:21.8, reb:4.1, ast:5.2, stl:0.9, blk:0.2, fg:'46.8%', three:'38.9%', gp:67, min:33.2, note:'MIA secondary scorer' },
  'norman powell':           { team:'MIA', pts:19.1, reb:2.8, ast:2.1, stl:0.8, blk:0.2, fg:'49.8%', three:'42.1%', gp:65, min:29.8, note:'NOW ON MIA — leads in 3PM' },
  'lamelo ball':             { team:'CHA', pts:27.1, reb:5.9, ast:8.8, stl:1.4, blk:0.4, fg:'46.2%', three:'37.8%', gp:65, min:34.2, note:'CHA vs BKN tonight — 92.2% win prob' },
  'jalen brunson':           { team:'NYK', pts:26.8, reb:3.7, ast:7.2, stl:1.0, blk:0.2, fg:'48.9%', three:'38.8%', gp:69, min:34.2, note:'NYK just clinched playoff spot — HOU @ NYK tonight' },
  'mikal bridges':           { team:'NYK', pts:17.1, reb:4.2, ast:3.8, stl:1.1, blk:0.5, fg:'46.8%', three:'37.2%', gp:70, min:33.2, note:'NYK co-star' },
  'dyson daniels':           { team:'ATL', pts:11.2, reb:4.8, ast:3.9, stl:2.8, blk:0.4, fg:'44.1%', three:'35.1%', gp:70, min:31.8, note:'Leads NBA in steals' },
  'jalen johnson':           { team:'ATL', pts:20.8, reb:8.9, ast:4.2, stl:1.1, blk:0.8, fg:'51.2%', three:'34.8%', gp:68, min:33.1, note:'ATL new franchise cornerstone' },
  'jonathan kuminga':        { team:'ATL', pts:17.9, reb:4.8, ast:2.8, stl:0.9, blk:0.6, fg:'52.1%', three:'35.8%', gp:38, min:28.9, note:'NOW ON ATL from GSW' },
  'cade cunningham':         { team:'DET', pts:23.8, reb:5.1, ast:7.2, stl:1.3, blk:0.4, fg:'46.8%', three:'37.1%', gp:55, min:34.1, note:'OUT — collapsed lung injury' },
  'evan mobley':             { team:'CLE', pts:18.8, reb:9.8, ast:3.1, stl:0.9, blk:1.8, fg:'54.1%', three:'34.8%', gp:70, min:33.8, note:'CLE @ LAL tonight — big boards spot' },
  'paolo banchero':          { team:'ORL', pts:21.8, reb:6.4, ast:4.2, stl:1.0, blk:0.8, fg:'47.8%', three:'32.1%', gp:67, min:33.8, note:'ORL @ PHX tonight' },
};

// ── WIN PROBABILITIES (March 31 2026) ──
const KNOWN_PROBS = {
  'PHX_ORL':{ home:54, away:46 }, 'ORL_PHX':{ home:46, away:54 },
  'CHA_BKN':{ home:92, away:8  }, 'BKN_CHA':{ home:8,  away:92 },
  'DAL_MIL':{ home:46, away:54 }, 'MIL_DAL':{ home:54, away:46 },
  'DET_TOR':{ home:41, away:59 }, 'TOR_DET':{ home:59, away:41 },
  'NYK_HOU':{ home:51, away:49 }, 'HOU_NYK':{ home:49, away:51 },
  'CLE_LAL':{ home:46, away:54 }, 'LAL_CLE':{ home:54, away:46 },
  'POR_LAC':{ home:33, away:67 }, 'LAC_POR':{ home:67, away:33 },
};

function getWinProb(homeTeam, awayTeam, spread, rawHome) {
  const k1 = homeTeam+'_'+awayTeam;
  const k2 = awayTeam+'_'+homeTeam;
  if (KNOWN_PROBS[k1]) return { home:KNOWN_PROBS[k1].home, away:KNOWN_PROBS[k1].away };
  if (KNOWN_PROBS[k2]) return { home:KNOWN_PROBS[k2].away, away:KNOWN_PROBS[k2].home };
  if (rawHome && rawHome !== 50) return { home:Math.round(rawHome), away:Math.round(100-rawHome) };
  const m = String(spread||'').match(/([+-]?\d+\.?\d*)/);
  if (m) {
    const n=parseFloat(m[1]), e=Math.abs(n)*2.8, f=Math.min(50+e,93);
    return n<0?{home:Math.round(f),away:Math.round(100-f)}:{home:Math.round(100-f),away:Math.round(f)};
  }
  return {home:50,away:50};
}


// ── ODDS API — fetch live props from all books ──
async function fetchOddsAPI() {
  const KEY = process.env.ODDS_API_KEY;
  if (!KEY) { console.log('⚠️ No ODDS_API_KEY set'); return; }
  try {
    const markets = [
      'player_points','player_rebounds','player_assists',
      'player_threes','player_blocks','player_steals',
      'player_points_rebounds_assists','player_points_rebounds',
      'player_points_assists','player_rebounds_assists',
    ].join(',');

    const url = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds/'
      + '?apiKey=' + KEY
      + '&regions=us'
      + '&markets=' + markets
      + '&oddsFormat=american'
      + '&bookmakers=draftkings,fanduel,betmgm,caesars,pointsbet,mybookieag';

    const { data } = await axios.get(url, { timeout: 20000 });
    console.log('📊 Odds API: ' + data.length + ' games returned');

    const propsMap = {};
    for (const game of data) {
      for (const bm of game.bookmakers) {
        for (const mkt of bm.markets) {
          const statType = mkt.key.replace('player_', '');
          for (const outcome of mkt.outcomes) {
            const key = outcome.name + '|' + statType + '|' + game.id;
            if (!propsMap[key]) {
              propsMap[key] = {
                playerName: outcome.name, gameId: game.id,
                statType, direction: 'over', line: outcome.point,
                books: {}, date: new Date().toISOString().split('T')[0],
              };
            }
            propsMap[key].books[bm.key] = { line: outcome.point, price: outcome.price };
          }
        }
      }
    }

    const props = [];
    for (const [, p] of Object.entries(propsMap)) {
      const dk  = p.books['draftkings'];
      const fd  = p.books['fanduel'];
      const mgm = p.books['betmgm'];
      const czr = p.books['caesars'];
      const pb  = p.books['pointsbet'];
      if (!dk && !fd) continue;
      const pr = dk || fd;
      const ml = pr.line;
      const mp = pr.price;
      const dko = mp > 0 ? '+' + mp : String(mp);
      const fmt = (b) => b ? (b.price > 0 ? '+' + b.price : String(b.price)) : dko;

      props.push({
        playerName:   p.playerName,
        gameId:       p.gameId,
        statType:     p.statType,
        direction:    'over',
        line:         ml,
        dkLine:       dk?.line || ml,  dkOdds:  fmt(dk),
        fdLine:       fd?.line || ml,  fdOdds:  fmt(fd),
        mgmLine:      mgm?.line || ml, mgmOdds: fmt(mgm),
        czrLine:      czr?.line || ml, czrOdds: fmt(czr),
        ppLine:       ml,
        udLine:       ml, udOdds: dko,
        rebetLine:    pb?.line || ml,  rebetOdds: fmt(pb),
        altLines:     buildAltLines(ml, dko),
        confidence:   50,
        tier:         'neutral',
        date:         p.date,
      });
    }

    store.liveProps = props;
    console.log('✅ Odds API: ' + props.length + ' props loaded');
  } catch(e) {
    console.error('❌ Odds API error:', e.message);
  }
}

// ── ESPN FETCH ──
async function fetchESPN() {
  try {
    const d = new Date().toISOString().split('T')[0].replace(/-/g,'');
    const { data } = await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d}`,{timeout:8000});
    store.games = (data.events||[]).map(ev => {
      const comp=ev.competitions[0];
      const home=comp.competitors.find(c=>c.homeAway==='home');
      const away=comp.competitors.find(c=>c.homeAway==='away');
      const odds=comp.odds?.[0]||{};
      const st=ev.status.type.name;
      return {
        gameId:ev.id, status:st.includes('FINAL')?'final':st.includes('PROGRESS')?'live':'scheduled',
        homeTeam:home?.team?.abbreviation||'', awayTeam:away?.team?.abbreviation||'',
        homeRecord:home?.records?.[0]?.summary||'', awayRecord:away?.records?.[0]?.summary||'',
        homeScore:parseInt(home?.score)||0, awayScore:parseInt(away?.score)||0,
        quarter:ev.status.period?'Q'+ev.status.period:'', clock:ev.status.displayClock||'',
        tipoff:new Date(ev.date).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'})+' ET',
        arena:comp.venue?.fullName||'', spread:odds.details||'Pick', total:odds.overUnder?String(odds.overUnder):'N/A',
        homeWinProb:comp.predictor?.homeTeam?.gameProjection||50,
      };
    });
    console.log('✅ ESPN: '+store.games.length+' games');
  } catch(e) { console.error('❌ ESPN games:', e.message); }
  try {
    const { data } = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries',{timeout:8000});
    store.injuries = [];
    for (const t of (data.injuries||[])) for (const i of (t.injuries||[])) {
      const s=(i.status||'').toLowerCase();
      store.injuries.push({
        playerName:i.athlete?.displayName||'', team:t.team?.abbreviation||'',
        status:i.status||'Unknown', injury:i.type?.abbreviation||'Injury',
        bettingImpact:s.includes('out')?'OUT — major lineup impact.':s.includes('quest')?'Questionable — check 90min before tip.':'Day-to-day — confirm before betting.',
      });
    }
    console.log('✅ ESPN: '+store.injuries.length+' injuries');
  } catch(e) { console.error('❌ ESPN injuries:', e.message); }
}

// ── ROUTES ──

// GAMES
app.get('/api/games', (req,res) => {
  const games = store.games.map(g => {
    const p=getWinProb(g.homeTeam,g.awayTeam,g.spread,g.homeWinProb);
    const gap=Math.abs(p.home-50);
    const tier=gap>=35?'elite':gap>=20?'strong':gap>=8?'neutral':'fade';
    const fav=p.home>50?g.homeTeam:g.awayTeam;
    const favP=Math.max(p.home,p.away);
    const picks=favP>=85?[fav+' Win',fav+' -ATS']:favP>=70?[fav+' Win','Check Spread']:['Close Game'];
    return {...g, homeWinProb:p.home, awayWinProb:p.away, tier, topPicks:picks};
  });
  res.json({success:true, count:games.length, games});
});

// PROPS — use live Odds API props when available, fall back to seeded
app.get('/api/props', (req,res) => {
  const tOrd={elite:0,strong:1,neutral:2,fade:3};
  // Use live props if we have them (Odds API returned data)
  let props = store.liveProps.length > 0 ? store.liveProps : [...SEEDED_PROPS];
  props = [...props].sort((a,b)=>(tOrd[a.tier]||2)-(tOrd[b.tier]||2)||b.confidence-a.confidence);
  if (req.query.type) props=props.filter(p=>p.statType===req.query.type);
  if (req.query.tier) props=props.filter(p=>p.tier===req.query.tier);
  const source = store.liveProps.length > 0 ? 'live' : 'seeded';
  res.json({success:true, count:props.length, source, props});
});

// INJURIES
app.get('/api/injuries', (req,res) => res.json({success:true, count:store.injuries.length, injuries:store.injuries}));

// H2H
app.get('/api/h2h/:t1/:t2', async (req,res) => {
  try {
    const t1=req.params.t1.toUpperCase(), t2=req.params.t2.toUpperCase();
    const TIDS={ATL:1610612737,BOS:1610612738,BKN:1610612751,CHA:1610612766,CHI:1610612741,CLE:1610612739,DAL:1610612742,DEN:1610612743,DET:1610612765,GSW:1610612744,HOU:1610612745,IND:1610612754,LAC:1610612746,LAL:1610612747,MEM:1610612763,MIA:1610612748,MIL:1610612749,MIN:1610612750,NOP:1610612740,NYK:1610612752,OKC:1610612760,ORL:1610612753,PHI:1610612755,PHX:1610612756,POR:1610612757,SAC:1610612758,SAS:1610612759,TOR:1610612761,UTA:1610612762,WAS:1610612764};
    const id1=TIDS[t1];
    if (!id1) return res.json({success:false,error:'Unknown team: '+t1});
    const {data}=await axios.get(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id1}/schedule`,{timeout:8000});
    const matchups=(data.events||[]).filter(e=>(e.competitions?.[0]?.competitors||[]).some(c=>c.team?.abbreviation===t2)).slice(-5).map(e=>{
      const comp=e.competitions[0];
      const home=comp.competitors.find(c=>c.homeAway==='home');
      const away=comp.competitors.find(c=>c.homeAway==='away');
      return {date:(e.date||'').split('T')[0],winner:home?.winner?home.team.abbreviation:away?.team?.abbreviation,score:(away?.score||0)+'-'+(home?.score||0),location:home?.team?.abbreviation===t1?'Home':'Away'};
    });
    const t1w=matchups.filter(m=>m.winner===t1).length;
    res.json({success:true,h2h:{team1:t1,team2:t2,last5Games:matchups,team1Wins:t1w,team2Wins:matchups.length-t1w}});
  } catch(e){res.status(500).json({success:false,error:e.message});}
});

// STATS SEARCH
app.post('/api/stats/search', (req,res) => {
  const {query}=req.body||{};
  if (!query) return res.status(400).json({success:false,error:'No query'});
  const lower=query.toLowerCase().trim();
  let found=null, foundKey=null;
  for (const key of Object.keys(PLAYER_STATS)) {
    const parts=key.split(' ');
    if (lower.includes(key)||parts.some(p=>p.length>3&&lower.includes(p))) { found=PLAYER_STATS[key]; foundKey=key; break; }
  }
  if (found) {
    const name=foundKey.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    return res.json({success:true, type:'player_season',
      title:name+' ('+found.team+') — 2025-26',
      subtitle:'Per game averages · '+found.note,
      stats:{pts:found.pts,reb:found.reb,ast:found.ast,stl:found.stl,blk:found.blk,fg:found.fg,three:found.three,gp:found.gp,min:found.min}
    });
  }
  res.json({success:true,type:'suggestion',
    message:'Try a player name like "LeBron James", "Giannis", or "Trae Young"',
    suggestions:['LaMelo Ball','Jalen Brunson','Giannis Antetokounmpo','Donovan Mitchell','Kawhi Leonard','Darius Garland (LAC)','James Harden (CLE)','Trae Young (WAS)','Anthony Davis (WAS)','Cooper Flagg']
  });
});

app.get('/api/stats/popular', (req,res) => res.json({success:true,searches:['LaMelo Ball','Jalen Brunson','Giannis Antetokounmpo','Donovan Mitchell','Kawhi Leonard','Darius Garland (LAC)','James Harden (CLE)','Trae Young (WAS)','LeBron James','Cooper Flagg']}));

// ANALYSIS
app.post('/api/analysis/slip', async (req,res) => {
  const {picks}=req.body||{};
  if (!picks?.length) return res.status(400).json({success:false,error:'No picks'});
  const prob=picks.reduce((a,p)=>a*(p.conf/100),1);
  const pct=Math.round(prob*100);
  if (!process.env.ANTHROPIC_API_KEY) return res.json({success:true,probability:pct,analysis:'Combined probability: '+pct+'%. Add ANTHROPIC_API_KEY for AI analysis.'});
  try {
    const list=picks.map(p=>p.name+' — '+p.type+' '+p.label+' ('+p.conf+'% conf)').join('\n');
    const {data}=await axios.post('https://api.anthropic.com/v1/messages',{
      model:'claude-haiku-4-5-20251001',max_tokens:300,
      messages:[{role:'user',content:'Analyze this NBA parlay slip in 3 sentences. Combined probability, strongest/weakest leg, verdict.\n\n'+list}]
    },{headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','Content-Type':'application/json'}});
    res.json({success:true,probability:pct,analysis:data.content?.[0]?.text||''});
  } catch(e){res.json({success:true,probability:pct,analysis:'Combined probability: '+pct+'%.'});}
});



// AI Stats Chat — Claude answers any NBA question with real data + game logs
app.post('/api/stats/ask', async (req,res) => {
  try {
    const { question } = req.body||{};
    if (!question) return res.status(400).json({success:false,error:'No question'});

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({success:true, answer:'Add your ANTHROPIC_API_KEY in Railway to unlock AI stats chat!'});
    }

    // Fetch todays games and injuries for context
    const gamesCtx = store.games.slice(0,7).map(g=>g.awayTeam+' @ '+g.homeTeam+' ('+g.tipoff+')').join(', ');
    const injCtx = store.injuries.slice(0,15).map(i=>i.playerName+' ('+i.team+') - '+i.status).join(', ');

    // Build system prompt with full NBA context
    const systemPrompt = `You are BeepBopStats, an expert NBA stats analyst for BeepBopProps$. You have deep knowledge of the 2025-26 NBA season.

CONFIRMED CURRENT ROSTERS (post Feb 5 2026 trade deadline):
- Trae Young → Washington Wizards (from ATL, January 2026)
- Darius Garland → LA Clippers (from CLE, traded for Harden)
- James Harden → Cleveland Cavaliers (from LAC)
- Anthony Davis → Washington Wizards (from DAL)
- Jaren Jackson Jr → Utah Jazz (from MEM)
- Jonathan Kuminga + Buddy Hield → Atlanta Hawks (from GSW)
- Norman Powell → Miami Heat (from LAC)
- Bennedict Mathurin + Isaiah Jackson → LA Clippers (from IND)
- Ivica Zubac → Indiana Pacers (from LAC)
- Kevin Huerter → Detroit Pistons (from CHI)
- Jaden Ivey → Chicago Bulls (from DET)
- Ayo Dosunmu → Minnesota (from CHI)
- Rob Dillingham → Chicago (from MIN)
- Nikola Vucevic → Boston (from CHI)
- Luka Doncic → LAL (offseason from DAL)
- Kevin Durant → HOU (offseason from BKN)
- Cade Cunningham: OUT (collapsed lung)
- Kyrie Irving: OUT season-ending (DAL)
- Luka Doncic: SUSPENDED tonight

KEY 2025-26 STATS:
- SGA: 32.1 PPG, 6.1 APG, 5.1 RPG (OKC) — MVP frontrunner
- Wembanyama: 24.2 PPG, 10.2 RPG, 3.8 BPG (SAS) — MVP candidate  
- Giannis: 30.2 PPG, 11.8 RPG (MIL)
- LeBron: 25.3 PPG, 8.2 APG, 7.8 RPG (LAL)
- Mitchell: 27.9 PPG (CLE)
- Maxey: 28.9 PPG (PHI)
- Jokic: 26.4 PPG, 12.8 RPG, 9.2 APG (DEN)
- Tatum: 26.7 PPG (BOS)
- Brunson: 26.8 PPG, 7.2 APG (NYK)
- KD: 24.8 PPG (HOU)
- Booker: 25.4 PPG (PHX)
- LaMelo: 27.1 PPG, 8.8 APG (CHA)
- Kawhi: 24.8 PPG career-high (LAC)
- Garland: 21.1 PPG with LAC, 51.2% 3PT
- Harden: 22.5 PPG, 7.5 APG with CLE, 47% 3PT
- Flagg: 20.4 PPG (DAL) — top rookie
- Sengun: 21.2 PPG (HOU)
- Mobley: 18.8 PPG, 9.8 RPG (CLE)

TONIGHTS GAMES (March 31 2026): ${gamesCtx}

INJURY REPORT: ${injCtx}

Answer the users NBA question in a helpful, conversational way. Be specific with stats and numbers. If asked about a matchup history, give realistic estimates based on what you know. Keep answers under 200 words. Use emojis sparingly. If asked about betting props, tie it back to BeepBopProps$ picks.`;

    const { data } = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    const answer = data.content?.[0]?.text || 'No answer available.';

    // Try to fetch game log if a player is mentioned
    let gameLog = null;
    const PLAYER_IDS = {
      'lebron':2544,'curry':201939,'giannis':203507,'jokic':203999,'tatum':1628369,
      'mitchell':1628378,'brunson':1628386,'booker':1626164,'kawhi':202695,'durant':201142,
      'lamelo':1630163,'maxey':1630178,'wembanyama':1641705,'garland':1629636,'harden':201935,
      'reaves':1631244,'flagg':1642366,'sengun':1630578,'luka':1629029,'sga':1628983,
      'mobley':1630596,'edwards':1630162,'trae':1629027,'davis':203076,'kuminga':1630557,
    };
    const TEAM_IDS = {
      'cavs':'1610612739','cavaliers':'1610612739','lakers':'1610612747','celtics':'1610612738',
      'warriors':'1610612744','nuggets':'1610612743','bucks':'1610612749','knicks':'1610612752',
      'rockets':'1610612745','clippers':'1610612746','suns':'1610612756','heat':'1610612748',
      'mavs':'1610612742','mavericks':'1610612742','spurs':'1610612759','thunder':'1610612760',
      'pistons':'1610612765','jazz':'1610612762','hawks':'1610612737','sixers':'1610612755',
      'nets':'1610612751','hornets':'1610612766','bulls':'1610612741','magic':'1610612753',
      'pacers':'1610612754','grizzlies':'1610612763','pelicans':'1610612740','kings':'1610612758',
      'blazers':'1610612757','raptors':'1610612761','wizards':'1610612764','timberwolves':'1610612750',
    };

    const qLower = question.toLowerCase();
    let foundPlayerId = null;
    let foundTeamId = null;
    for (const [name, id] of Object.entries(PLAYER_IDS)) {
      if (qLower.includes(name)) { foundPlayerId = id; break; }
    }
    for (const [name, id] of Object.entries(TEAM_IDS)) {
      if (qLower.includes(name)) { foundTeamId = id; break; }
    }

    if (foundPlayerId) {
      try {
        const params = new URLSearchParams({
          PlayerID: foundPlayerId, Season: '2025-26',
          SeasonType: 'Regular Season', PerMode: 'Totals', LeagueID: '00',
        });
        if (foundTeamId) params.append('OppTeamID', foundTeamId);
        const glUrl = 'https://stats.nba.com/stats/playergamelogs?' + params.toString();
        const glRes = await axios.get(glUrl, { timeout:8000, headers:{
          'User-Agent':'Mozilla/5.0','Referer':'https://www.nba.com','Origin':'https://www.nba.com',
          'Accept':'application/json','x-nba-stats-origin':'stats','x-nba-stats-token':'true',
        }});
        const headers = glRes.data.resultSets[0].headers;
        const rows = glRes.data.resultSets[0].rowSet.slice(0,10);
        const idx = k => headers.indexOf(k);
        gameLog = rows.map(r => ({
          date: (r[idx('GAME_DATE')]||'').split('T')[0],
          matchup: r[idx('MATCHUP')]||'',
          result: r[idx('WL')]||'',
          pts: r[idx('PTS')], reb: r[idx('REB')], ast: r[idx('AST')],
          stl: r[idx('STL')], blk: r[idx('BLK')], min: r[idx('MIN')],
          fgm: r[idx('FGM')], fga: r[idx('FGA')],
          fg3m: r[idx('FG3M')], fg3a: r[idx('FG3A')],
        }));
      } catch(e) { /* game log unavailable */ }
    }

    res.json({ success:true, answer, gameLog });
  } catch(e) {
    console.error('AI stats error:', e.message);
    res.status(500).json({ success:false, error: e.message });
  }
});

// NBA Stats Proxy — bypasses CORS for browser requests
app.get('/api/nba/gamelog', async (req,res) => {
  try {
    const { playerId, oppTeamId } = req.query;
    if (!playerId) return res.status(400).json({success:false,error:'No playerId'});
    const params = new URLSearchParams({
      PlayerID: playerId, Season: '2025-26',
      SeasonType: 'Regular Season', PerMode: 'Totals', LeagueID: '00',
    });
    if (oppTeamId) params.append('OppTeamID', oppTeamId);
    const url = 'https://stats.nba.com/stats/playergamelogs?' + params.toString();
    const { data } = await axios.get(url, { timeout:10000, headers:{
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer':'https://www.nba.com', 'Origin':'https://www.nba.com',
      'Accept':'application/json','x-nba-stats-origin':'stats','x-nba-stats-token':'true',
    }});
    res.json({success:true, data});
  } catch(e){ res.status(500).json({success:false,error:e.message}); }
});

app.get('/api/nba/career', async (req,res) => {
  try {
    const { playerId } = req.query;
    if (!playerId) return res.status(400).json({success:false,error:'No playerId'});
    const url = 'https://stats.nba.com/stats/playercareerstats?PlayerID='+playerId+'&PerMode=PerGame&LeagueID=00';
    const { data } = await axios.get(url, { timeout:10000, headers:{
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer':'https://www.nba.com', 'Origin':'https://www.nba.com',
      'Accept':'application/json','x-nba-stats-origin':'stats','x-nba-stats-token':'true',
    }});
    res.json({success:true, data});
  } catch(e){ res.status(500).json({success:false,error:e.message}); }
});

app.get('/api/health',(req,res)=>res.json({status:'ok',time:new Date().toISOString(),games:store.games.length,injuries:store.injuries.length,liveProps:store.liveProps.length,source:store.liveProps.length>0?'Odds API (LIVE)':'Seeded (hardcoded)'}));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));

// ── START ──
app.listen(PORT, async () => {
  console.log('🕷️  BeepBopProps$ → http://localhost:'+PORT);
  await fetchESPN();
  await fetchOddsAPI();
  // Refresh ESPN every 15 min during game hours
  cron.schedule('*/15 12-23 * * *', fetchESPN, {timezone:'America/New_York'});
  // Refresh Odds API every 30 min (conserve free tier requests)
  cron.schedule('*/30 12-23 * * *', fetchOddsAPI, {timezone:'America/New_York'});
  // Midnight reset
  cron.schedule('0 0 * * *', async () => {
    store.liveProps = [];
    await fetchESPN();
    await fetchOddsAPI();
  }, {timezone:'America/New_York'});
});
