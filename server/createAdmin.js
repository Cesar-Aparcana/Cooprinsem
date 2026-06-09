require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  INSERT INTO usuarios (username, password, nombre_completo, rol_cod, sucursal_id, estado)
  VALUES ('admin', 'admin123', 'Administrador Sistema', 1, 'D190', 1)
  ON CONFLICT (username) DO NOTHING
`)
.then(() => {
  console.log('Usuario admin creado OK');
  pool.end();
})
.catch(e => {
  console.error('Error:', e.message);
  pool.end();
});