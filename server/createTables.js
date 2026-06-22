require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Este script crea las tablas adicionales que no maneja Prisma.
// Es seguro ejecutarlo múltiples veces — usa IF NOT EXISTS.

const sql = `
  -- Tabla de centros asignados a usuarios
  CREATE TABLE IF NOT EXISTS usuario_centros (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) NOT NULL,
    plant_code  VARCHAR(10)  NOT NULL,
    UNIQUE (username, plant_code)
  );

  -- Eliminar restricción antigua si existe (de versiones anteriores)
  ALTER TABLE usuario_centros 
  DROP CONSTRAINT IF EXISTS fk_usuario;
`;

pool.query(sql)
  .then(() => {
    console.log('✅ Tablas creadas/verificadas correctamente');
    pool.end();
  })
  .catch(e => {
    console.error('❌ Error:', e.message);
    pool.end();
  });