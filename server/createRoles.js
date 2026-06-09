require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  INSERT INTO roles (codigo, nombre, descripcion, fecha_actualizacion, usuario_actualizacion) VALUES
  (1, 'Administrador', 'Jefe de sucursal. Acceso total incluyendo mantenedores.', NOW(), 'system'),
  (2, 'Ventas', 'Vendedor de meson o terreno. Crea y gestiona pedidos.', NOW(), 'system'),
  (3, 'Caja', 'Cajero. Cobros, pagos, arqueo.', NOW(), 'system'),
  (4, 'Consultas', 'Reportes y consultas sin escritura.', NOW(), 'system')
  ON CONFLICT (codigo) DO UPDATE SET
    fecha_actualizacion = NOW(),
    usuario_actualizacion = 'system'
`)
.then(() => {
  console.log('Roles actualizados OK');
  pool.end();
})
.catch(e => {
  console.error('Error:', e.message);
  pool.end();
});