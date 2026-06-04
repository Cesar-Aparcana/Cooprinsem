/**
 * Script de instalación - Cooprinsem POS
 * 
 * Este script crea las tablas y columnas necesarias en la base de datos
 * sin afectar las tablas existentes.
 * 
 * Uso: node createTables.js
 */

require('dotenv/config');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
  -- Crear tabla roles si no existe
  CREATE TABLE IF NOT EXISTS roles (
    codigo INTEGER PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    usuario_actualizacion VARCHAR(100) DEFAULT 'system'
  );

  -- Crear tabla usuarios si no existe
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    rol_cod INTEGER DEFAULT 2,
    sucursal_id VARCHAR(10) DEFAULT 'D190',
    estado INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    usuario_actualizacion VARCHAR(100) DEFAULT 'system'
  );

  -- Agregar columnas de auditoría a clientes si no existen
  ALTER TABLE clientes 
    ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS usuario_actualizacion VARCHAR(100) DEFAULT 'system';

  -- Agregar columnas de auditoría a materiales si no existen
  ALTER TABLE materiales 
    ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS usuario_actualizacion VARCHAR(100) DEFAULT 'system';
`;

async function main() {
  console.log('Iniciando script de instalación Cooprinsem POS...');
  console.log(`Conectando a: ${process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')}`);
  
  try {
    await pool.query(sql);
    console.log('✓ Tabla roles creada o ya existía');
    console.log('✓ Tabla usuarios creada o ya existía');
    console.log('✓ Columnas de auditoría en clientes OK');
    console.log('✓ Columnas de auditoría en materiales OK');
    console.log('');
    console.log('Instalación completada exitosamente.');
  } catch (e) {
    console.error('Error durante la instalación:', e.message);
  } finally {
    pool.end();
  }
}

main();