import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Carpeta donde vivirá el archivo SQLite
const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'cooprinsem_local.db');

// Crear carpeta data si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Crear conexión a SQLite
const db: Database.Database = new Database(DB_PATH);

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS roles (
    codigo INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    fecha_actualizacion TEXT DEFAULT (datetime('now')),
    usuario_actualizacion TEXT DEFAULT 'system'
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    email TEXT,
    rol_cod INTEGER DEFAULT 2,
    sucursal_id TEXT DEFAULT 'D190',
    estado INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT (datetime('now')),
    fecha_actualizacion TEXT DEFAULT (datetime('now')),
    usuario_actualizacion TEXT DEFAULT 'system',
    FOREIGN KEY (rol_cod) REFERENCES roles(codigo)
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kunnr TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    rut TEXT,
    condicion_pago TEXT DEFAULT 'CONT',
    estado_credito TEXT DEFAULT 'AL_DIA',
    credito_asignado INTEGER DEFAULT 0,
    credito_utilizado INTEGER DEFAULT 0,
    sucursal TEXT DEFAULT 'D190',
    createdAt TEXT DEFAULT (datetime('now')),
    fecha_actualizacion TEXT DEFAULT (datetime('now')),
    usuario_actualizacion TEXT DEFAULT 'system'
  );

  CREATE TABLE IF NOT EXISTS materiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matnr TEXT UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    precio_unitario INTEGER,
    unidad_medida TEXT DEFAULT 'UN',
    bloqueado INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    fecha_actualizacion TEXT DEFAULT (datetime('now')),
    usuario_actualizacion TEXT DEFAULT 'system'
  );

  CREATE TABLE IF NOT EXISTS sync_control (
    tabla TEXT PRIMARY KEY,
    ultima_sincronizacion TEXT DEFAULT '1970-01-01T00:00:00.000Z'
  );
`);

// Inicializar tabla de control de sincronización
const initSync = db.prepare(
  `INSERT OR IGNORE INTO sync_control (tabla) VALUES (?)`
);
['roles', 'usuarios', 'clientes', 'materiales'].forEach((tabla) => {
  initSync.run(tabla);
});

console.log(`SQLite local iniciado en: ${DB_PATH}`);

export default db;