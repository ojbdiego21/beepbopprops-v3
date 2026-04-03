// Natural language → SQL query engine for BeepBopStats
// All queries hit your local Postgres DB — instant, no API calls

const { Pool } = require('pg');
let pool = null;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

// Team name → abbreviation
const TEAM_MAP = {
  'celtics':'BOS','lakers':'LAL','warriors':'GSW','bucks':'MIL','knicks':'NYK',
  'heat':'MIA','nuggets':'DEN','cavaliers':'CLE','cavs':'CLE','clippers':'LAC',
  'suns':'PHX','mavericks':'DAL','mavs':'DAL','76ers':'PHI','sixers':'PHI',
  'thunder':'OKC','spurs':'SAS','rockets':'HOU','timberwolves':'MIN','wolves':'MIN',
  'raptors':'TOR','jazz':'UTA','hawks':'ATL','magic':'ORL','pacers':'IND',
  'pistons':'DET','bulls':'CHI','nets':'BKN','hornets':'CHA','grizzlies':'MEM',
  'pelicans':'NOP','blazers':'POR','trail blazers':'POR','kings':'SAC','wizards':'WAS',
};

// Player name → BDL player ID (BDL uses their own IDs, not NBA.com IDs)
// These get populated from the database dynamically
const PLAYER_SEARCH_NAMES = {
  'lebron':['lebron','james'],'curry':['curry','stephen'],'giannis':['giannis','antetokounmpo'],
  'jokic':['jokic','nikola'],'tatum':['tatum','jayson'],'luka':['luka','doncic'],
  'sga':['shai','gilgeous'],'mitchell':['mitchell','donovan'],'embiid':['embiid','joel'],
  'brunson':['brunson','jalen'],'booker':['booker','devin'],'durant':['durant','kevin'],
  'wemby':['wembanyama','victor'],'wembanyama':['wembanyama','victor'],
  'lamelo':['lamelo','ball'],'banchero':['banchero','paolo'],'flagg':['flagg','cooper'],
  'kon':['knueppel','kon'],'knueppel':['knueppel'],'harper':['harper','dylan'],
  'suggs':['suggs','jalen'],'fears':['fears','jeremiah'],'queen':['queen','derik'],
};

function extractTeam(q) {
  q = q.toLowerCase();
  for (const [name, abbr] of Object.entries(TEAM_MAP)) {
    if (q.includes(name)) return abbr;
  }
  // Direct abbrev
  const m = q.match(/\b(atl|bos|bkn|cha|chi|cle|dal|den|det|gsw|hou|ind|lac|lal|mem|mia|mil|min|nop|nyk|okc|orl|phi|phx|por|sac|sas|tor|uta|was)\b/);
  return m ? m[1].toUpperCase() : null;
}

function extractN(q) {
  const m = q.toLowerCase().match(/last\s*(\d+)/);
  return m ? Math.min(parseInt(m[1]), 82) : 10;
}

function extractStat(q) {
  q = q.toLowerCase();
  if (q.includes('point') || q.includes(' pts') || q.includes('scor')) return 'pts';
  if (q.includes('rebound') || q.includes(' reb')) return 'reb';
  if (q.includes('assist') || q.includes(' ast')) return 'ast';
  if (q.includes('steal') || q.includes(' stl')) return 'stl';
  if (q.includes('block') || q.includes(' blk')) return 'blk';
  if (q.includes('turnover') || q.includes(' tov')) return 'tov';
  if (q.includes('foul') || q.includes(' pf')) return 'fouls';
  if (q.includes('three') || q.includes('3pt') || q.includes('3-pt')) return 'fg3m';
  return 'pts';
}

function extractPosition(q) {
  q = q.toLowerCase();
  if (q.includes('point guard') || q.includes(' pg') || q.match(/\bpg\b/)) return 'G';
  if (q.includes('shooting guard') || q.match(/\bsg\b/) || q.includes('2 guard')) return 'G';
  if (q.includes('small forward') || q.match(/\bsf\b/)) return 'F';
  if (q.includes('power forward') || q.match(/\bpf\b/)) return 'F';
  if (q.includes('center') || q.match(/\bc\b/)) return 'C';
  if (q.includes('guard') || q.includes('backcourt')) return 'G';
  if (q.includes('forward')) return 'F';
  if (q.includes('big') || q.includes('bigs') || q.includes('frontcourt')) return 'C';
  return null;
}

// Main query router
async function queryDB(question) {
  const db = getPool();
  if (!db) return null; // No DB configured

  const q = question.toLowerCase();

  try {
    // ── PLAYER GAME LOG: "curry last 10" ──
    if (/last\s*\d+/.test(q) && !/(team|position|guard|forward|center|scoring|fouls|foul|rank|best|worst|top|most|least|which)/.test(q)) {
      return await playerGameLog(db, question);
    }

    // ── PLAYER vs TEAM: "lebron vs celtics" ──
    if (extractTeam(q) && !/(top|rank|best|worst|most|least|which team|position|guard|forward|center|foul)/.test(q)) {
      const team = extractTeam(q);
      if (team) return await playerVsTeam(db, question, team);
    }

    // ── TOP SCORING/FOULING/REBOUNDING TEAMS: "top fouling teams" ──
    if (/(top|rank|best|worst|most|least)\s.*(team|franchise)/.test(q) || /(team|franchise)\s.*(most|least|top|rank)/.test(q)) {
      return await teamRankings(db, question);
    }

    // ── POSITION vs TEAM: "shooting guards vs bulls" ──
    const pos = extractPosition(q);
    const team = extractTeam(q);
    if (pos && team) {
      return await positionVsTeam(db, pos, team, question);
    }

    // ── TEAM WEAKNESSES: "warriors weakness on defense" ──
    if (/(weakness|struggle|bad at|worst position|allow|give up)/.test(q)) {
      const t = extractTeam(q);
      if (t) return await teamWeakness(db, t);
    }

    return null; // Let AI handle it
  } catch(e) {
    console.error('DB query error:', e.message);
    return null;
  }
}

async function findPlayerInDB(db, q) {
  // Search by name fragments
  const parts = q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  for (const part of parts) {
    const r = await db.query(
      `SELECT id, first_name, last_name, position, team_abbr FROM players
       WHERE LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1
       LIMIT 1`,
      ['%' + part + '%']
    );
    if (r.rows.length) return r.rows[0];
  }
  return null;
}

async function playerGameLog(db, question) {
  const player = await findPlayerInDB(db, question);
  if (!player) return null;
  const n = extractN(question);
  const opp = extractTeam(question);

  let sql = `SELECT game_date, opponent, home, result, pts, reb, ast, stl, blk, tov,
                    fgm, fga, fg3m, fg3a, ftm, fta, minutes, plus_minus
             FROM game_logs WHERE player_id = $1 AND season = '2025-26'`;
  const params = [player.id];

  if (opp) { sql += ` AND opponent = $2`; params.push(opp); }
  sql += ` ORDER BY game_date DESC LIMIT $${params.length + 1}`;
  params.push(n);

  const r = await db.query(sql, params);
  return { type: 'game_log', player, rows: r.rows, opponent: opp, n };
}

async function playerVsTeam(db, question, opp) {
  const player = await findPlayerInDB(db, question);
  if (!player) return null;
  const n = extractN(question) || 20;

  const r = await db.query(`
    SELECT game_date, opponent, home, result, pts, reb, ast, stl, blk, tov,
           fgm, fga, fg3m, fg3a, ftm, fta, minutes, plus_minus
    FROM game_logs WHERE player_id=$1 AND opponent=$2 AND season='2025-26'
    ORDER BY game_date DESC LIMIT $3
  `, [player.id, opp, n]);

  return { type: 'game_log', player, rows: r.rows, opponent: opp, n };
}

async function teamRankings(db, question) {
  const stat = extractStat(question);
  const isWorst = /(worst|least|lowest|fewest)/.test(question.toLowerCase());
  const order = isWorst ? 'ASC' : 'DESC';

  let col = stat, label = stat.toUpperCase();
  if (stat === 'fouls') { col = 'tov'; label = 'TOV'; } // approximate

  const r = await db.query(`
    SELECT opponent as team,
           ROUND(AVG(pts)::numeric,1) as avg_pts_allowed,
           ROUND(AVG(reb)::numeric,1) as avg_reb_allowed,
           ROUND(AVG(ast)::numeric,1) as avg_ast_allowed,
           ROUND(AVG(tov)::numeric,1) as avg_tov,
           ROUND(AVG(fg3m)::numeric,1) as avg_3pm_allowed,
           COUNT(DISTINCT game_id) as games
    FROM game_logs WHERE season='2025-26' AND opponent IS NOT NULL
    GROUP BY opponent HAVING COUNT(DISTINCT game_id) >= 10
    ORDER BY avg_pts_allowed ${order}
    LIMIT 10
  `);

  return { type: 'team_rankings', stat, order, rows: r.rows, question };
}

async function positionVsTeam(db, pos, team, question) {
  const r = await db.query(`
    SELECT p.first_name || ' ' || p.last_name as player_name,
           p.team_abbr as team,
           ROUND(AVG(g.pts)::numeric,1) as avg_pts,
           ROUND(AVG(g.reb)::numeric,1) as avg_reb,
           ROUND(AVG(g.ast)::numeric,1) as avg_ast,
           COUNT(*) as games
    FROM game_logs g
    JOIN players p ON p.id = g.player_id
    WHERE g.opponent = $1 AND g.season = '2025-26'
      AND p.position ILIKE $2
    GROUP BY p.id, p.first_name, p.last_name, p.team_abbr
    HAVING COUNT(*) >= 1
    ORDER BY avg_pts DESC
    LIMIT 15
  `, [team, '%' + pos + '%']);

  return { type: 'position_vs_team', pos, team, rows: r.rows, question };
}

async function teamWeakness(db, team) {
  // Find which positions score most against this team
  const r = await db.query(`
    SELECT
      CASE
        WHEN p.position ILIKE '%C%' THEN 'Center'
        WHEN p.position ILIKE '%F%' THEN 'Forward'
        WHEN p.position ILIKE '%G%' THEN 'Guard'
        ELSE 'Other'
      END as position_group,
      ROUND(AVG(g.pts)::numeric,1) as avg_pts,
      ROUND(AVG(g.reb)::numeric,1) as avg_reb,
      ROUND(AVG(g.ast)::numeric,1) as avg_ast,
      ROUND(AVG(g.fg3m)::numeric,1) as avg_3pm,
      COUNT(*) as games
    FROM game_logs g
    JOIN players p ON p.id = g.player_id
    WHERE g.opponent = $1 AND g.season = '2025-26'
      AND p.position IS NOT NULL AND p.position != ''
    GROUP BY position_group
    ORDER BY avg_pts DESC
  `, [team]);

  return { type: 'team_weakness', team, rows: r.rows };
}

module.exports = { queryDB };
