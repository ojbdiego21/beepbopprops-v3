// Database setup + backfill script
// Run once: node db_setup.js
// Requires DATABASE_URL and BALLDONTLIE_API_KEY env vars

require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const BDL = 'https://api.balldontlie.io/v1';
const BDL_KEY = process.env.BALLDONTLIE_API_KEY || '';
const hdrs = { Authorization: BDL_KEY };

async function setup() {
  console.log('🏗️  Creating schema...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      first_name TEXT, last_name TEXT,
      position TEXT, team_abbr TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS game_logs (
      id SERIAL PRIMARY KEY,
      player_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      game_date DATE NOT NULL,
      season TEXT NOT NULL,
      home BOOLEAN,
      opponent TEXT,
      result CHAR(1),
      pts INTEGER DEFAULT 0, reb INTEGER DEFAULT 0, ast INTEGER DEFAULT 0,
      stl INTEGER DEFAULT 0, blk INTEGER DEFAULT 0, tov INTEGER DEFAULT 0,
      fgm INTEGER DEFAULT 0, fga INTEGER DEFAULT 0,
      fg3m INTEGER DEFAULT 0, fg3a INTEGER DEFAULT 0,
      ftm INTEGER DEFAULT 0, fta INTEGER DEFAULT 0,
      minutes INTEGER DEFAULT 0, plus_minus INTEGER DEFAULT 0,
      UNIQUE(player_id, game_id)
    );

    CREATE INDEX IF NOT EXISTS idx_gl_player ON game_logs(player_id);
    CREATE INDEX IF NOT EXISTS idx_gl_opponent ON game_logs(opponent);
    CREATE INDEX IF NOT EXISTS idx_gl_date ON game_logs(game_date);
    CREATE INDEX IF NOT EXISTS idx_gl_season ON game_logs(season);
    CREATE INDEX IF NOT EXISTS idx_gl_player_opp ON game_logs(player_id, opponent);

    CREATE TABLE IF NOT EXISTS sync_log (
      id SERIAL PRIMARY KEY,
      ran_at TIMESTAMPTZ DEFAULT NOW(),
      games_synced INTEGER DEFAULT 0,
      stats_synced INTEGER DEFAULT 0,
      notes TEXT
    );
  `);
  console.log('✅ Schema created');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function bdlGet(path, params) {
  await sleep(400); // respect rate limit
  const r = await axios.get(BDL + path, { headers: hdrs, params, timeout: 15000 });
  return r.data;
}

async function backfill() {
  console.log('📥 Starting 2025-26 season backfill...');
  let cursor = null;
  let totalStats = 0;
  let page = 1;

  do {
    try {
      const params = {
        'seasons[]': 2025,
        per_page: 100,
        ...(cursor ? { cursor } : {})
      };
      const data = await bdlGet('/stats', params);
      const rows = data.data || [];
      if (!rows.length) break;

      for (const s of rows) {
        const g = s.game || {};
        const t = s.team || {};
        const p = s.player || {};

        // Upsert player
        await pool.query(`
          INSERT INTO players (id, first_name, last_name, position, team_abbr)
          VALUES ($1,$2,$3,$4,$5)
          ON CONFLICT (id) DO UPDATE SET team_abbr=$5, updated_at=NOW()
        `, [p.id, p.first_name, p.last_name, p.position || '', t.abbreviation || '']);

        // Determine home/away, opponent, result
        const homeAbbr = g.home_team?.abbreviation || '';
        const visAbbr  = g.visitor_team?.abbreviation || '';
        const myAbbr   = t.abbreviation || '';
        const isHome   = myAbbr === homeAbbr;
        const opp      = isHome ? visAbbr : homeAbbr;
        const myScore  = isHome ? g.home_team_score : g.visitor_team_score;
        const oppScore = isHome ? g.visitor_team_score : g.home_team_score;
        const result   = g.status === 'Final' ? (myScore > oppScore ? 'W' : 'L') : null;

        await pool.query(`
          INSERT INTO game_logs
            (player_id, game_id, game_date, season, home, opponent, result,
             pts, reb, ast, stl, blk, tov, fgm, fga, fg3m, fg3a, ftm, fta, minutes, plus_minus)
          VALUES ($1,$2,$3,'2025-26',$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
          ON CONFLICT (player_id, game_id) DO NOTHING
        `, [
          p.id, g.id,
          g.date ? g.date.split('T')[0] : null,
          isHome, opp, result,
          s.pts||0, s.reb||0, s.ast||0, s.stl||0, s.blk||0, s.turnover||0,
          s.fgm||0, s.fga||0, s.fg3m||0, s.fg3a||0, s.ftm||0, s.fta||0,
          s.min ? parseInt(s.min) : 0, 0
        ]);
        totalStats++;
      }

      cursor = data.meta?.next_cursor;
      console.log(`Page ${page++}: ${rows.length} stats inserted (total: ${totalStats})`);
    } catch(e) {
      console.error('Error on page', page, e.message);
      await sleep(2000);
    }
  } while (cursor);

  await pool.query(`INSERT INTO sync_log (games_synced, stats_synced, notes) VALUES (0, $1, 'Initial backfill')`, [totalStats]);
  console.log(`✅ Backfill complete: ${totalStats} stat rows`);
}

async function main() {
  await setup();
  if (BDL_KEY) {
    await backfill();
  } else {
    console.log('⚠️  No BALLDONTLIE_API_KEY set — skipping backfill. Set key and re-run.');
  }
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
