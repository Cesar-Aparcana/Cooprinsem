require('dotenv/config');
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL });
p.query("SELECT kunnr, nombre FROM clientes WHERE nombre ILIKE '%roble%'")
  .then(r => console.log(r.rows))
  .catch(e => console.error(e.message))
  .finally(() => p.end());