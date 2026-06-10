require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
  ALTER TABLE usuario_centros 
  DROP CONSTRAINT IF EXISTS fk_usuario;
`;

pool.query(sql)
  .then(() => {
    console.log('Restricción eliminada OK');
    pool.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    pool.end();
  });