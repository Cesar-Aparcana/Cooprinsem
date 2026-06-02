import { prisma } from '../lib/prisma';
import db from './localDb';

// Verificar si hay conexión a internet/red
async function hayConexion(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Obtener última fecha de sincronización de una tabla
function getUltimaSincronizacion(tabla: string): string {
  const row = db
    .prepare('SELECT ultima_sincronizacion FROM sync_control WHERE tabla = ?')
    .get(tabla) as { ultima_sincronizacion: string } | undefined;
  return row?.ultima_sincronizacion ?? '1970-01-01T00:00:00.000Z';
}

// Actualizar fecha de sincronización
function actualizarSincronizacion(tabla: string): void {
  db.prepare(
    'UPDATE sync_control SET ultima_sincronizacion = ? WHERE tabla = ?'
  ).run(new Date().toISOString(), tabla);
}

// Sincronizar roles
async function sincronizarRoles(): Promise<void> {
  const ultimaSync = getUltimaSincronizacion('roles');
  const roles = await prisma.rol.findMany({
    where: { fecha_actualizacion: { gt: new Date(ultimaSync) } },
  });

  if (roles.length === 0) {
    console.log('Roles: sin novedades');
    return;
  }

  const upsert = db.prepare(`
    INSERT INTO roles (codigo, nombre, descripcion, fecha_actualizacion, usuario_actualizacion)
    VALUES (@codigo, @nombre, @descripcion, @fecha_actualizacion, @usuario_actualizacion)
    ON CONFLICT(codigo) DO UPDATE SET
      nombre = excluded.nombre,
      descripcion = excluded.descripcion,
      fecha_actualizacion = excluded.fecha_actualizacion,
      usuario_actualizacion = excluded.usuario_actualizacion
  `);

  const transaction = db.transaction(() => {
    for (const rol of roles) {
      upsert.run({
        codigo: rol.codigo,
        nombre: rol.nombre,
        descripcion: rol.descripcion ?? '',
        fecha_actualizacion: rol.fecha_actualizacion.toISOString(),
        usuario_actualizacion: rol.usuario_actualizacion,
      });
    }
  });

  transaction();
  actualizarSincronizacion('roles');
  console.log(`Roles: ${roles.length} registros sincronizados`);
}

// Sincronizar usuarios
async function sincronizarUsuarios(): Promise<void> {
  const ultimaSync = getUltimaSincronizacion('usuarios');
  const usuarios = await prisma.usuario.findMany({
    where: { fecha_actualizacion: { gt: new Date(ultimaSync) } },
  });

  if (usuarios.length === 0) {
    console.log('Usuarios: sin novedades');
    return;
  }

  const upsert = db.prepare(`
    INSERT INTO usuarios (username, password, nombre_completo, email, rol_cod, sucursal_id, estado, fecha_actualizacion, usuario_actualizacion)
    VALUES (@username, @password, @nombre_completo, @email, @rol_cod, @sucursal_id, @estado, @fecha_actualizacion, @usuario_actualizacion)
    ON CONFLICT(username) DO UPDATE SET
      password = excluded.password,
      nombre_completo = excluded.nombre_completo,
      email = excluded.email,
      rol_cod = excluded.rol_cod,
      sucursal_id = excluded.sucursal_id,
      estado = excluded.estado,
      fecha_actualizacion = excluded.fecha_actualizacion,
      usuario_actualizacion = excluded.usuario_actualizacion
  `);

  const transaction = db.transaction(() => {
    for (const usuario of usuarios) {
      upsert.run({
        username: usuario.username,
        password: usuario.password,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email ?? '',
        rol_cod: usuario.rol_cod,
        sucursal_id: usuario.sucursal_id,
        estado: usuario.estado,
        fecha_actualizacion: usuario.fecha_actualizacion.toISOString(),
        usuario_actualizacion: usuario.usuario_actualizacion,
      });
    }
  });

  transaction();
  actualizarSincronizacion('usuarios');
  console.log(`Usuarios: ${usuarios.length} registros sincronizados`);
}

// Sincronizar clientes
async function sincronizarClientes(): Promise<void> {
  const ultimaSync = getUltimaSincronizacion('clientes');
  const clientes = await prisma.cliente.findMany({
    where: { fecha_actualizacion: { gt: new Date(ultimaSync) } },
  });

  if (clientes.length === 0) {
    console.log('Clientes: sin novedades');
    return;
  }

  const upsert = db.prepare(`
    INSERT INTO clientes (kunnr, nombre, rut, condicion_pago, estado_credito, credito_asignado, credito_utilizado, sucursal, fecha_actualizacion, usuario_actualizacion)
    VALUES (@kunnr, @nombre, @rut, @condicion_pago, @estado_credito, @credito_asignado, @credito_utilizado, @sucursal, @fecha_actualizacion, @usuario_actualizacion)
    ON CONFLICT(kunnr) DO UPDATE SET
      nombre = excluded.nombre,
      rut = excluded.rut,
      condicion_pago = excluded.condicion_pago,
      estado_credito = excluded.estado_credito,
      credito_asignado = excluded.credito_asignado,
      credito_utilizado = excluded.credito_utilizado,
      sucursal = excluded.sucursal,
      fecha_actualizacion = excluded.fecha_actualizacion,
      usuario_actualizacion = excluded.usuario_actualizacion
  `);

  const transaction = db.transaction(() => {
    for (const cliente of clientes) {
      upsert.run({
        kunnr: cliente.kunnr,
        nombre: cliente.nombre,
        rut: cliente.rut,
        condicion_pago: cliente.condicion_pago,
        estado_credito: cliente.estado_credito,
        credito_asignado: cliente.credito_asignado,
        credito_utilizado: cliente.credito_utilizado,
        sucursal: cliente.sucursal,
        fecha_actualizacion: cliente.fecha_actualizacion.toISOString(),
        usuario_actualizacion: cliente.usuario_actualizacion,
      });
    }
  });

  transaction();
  actualizarSincronizacion('clientes');
  console.log(`Clientes: ${clientes.length} registros sincronizados`);
}

// Sincronizar materiales
async function sincronizarMateriales(): Promise<void> {
  const ultimaSync = getUltimaSincronizacion('materiales');
  const materiales = await prisma.material.findMany({
    where: { fecha_actualizacion: { gt: new Date(ultimaSync) } },
  });

  if (materiales.length === 0) {
    console.log('Materiales: sin novedades');
    return;
  }

  const upsert = db.prepare(`
    INSERT INTO materiales (matnr, descripcion, precio_unitario, unidad_medida, bloqueado, fecha_actualizacion, usuario_actualizacion)
    VALUES (@matnr, @descripcion, @precio_unitario, @unidad_medida, @bloqueado, @fecha_actualizacion, @usuario_actualizacion)
    ON CONFLICT(matnr) DO UPDATE SET
      descripcion = excluded.descripcion,
      precio_unitario = excluded.precio_unitario,
      unidad_medida = excluded.unidad_medida,
      bloqueado = excluded.bloqueado,
      fecha_actualizacion = excluded.fecha_actualizacion,
      usuario_actualizacion = excluded.usuario_actualizacion
  `);

  const transaction = db.transaction(() => {
    for (const material of materiales) {
      upsert.run({
        matnr: material.matnr,
        descripcion: material.descripcion,
        precio_unitario: material.precio_unitario,
        unidad_medida: material.unidad_medida,
        bloqueado: material.bloqueado ? 1 : 0,
        fecha_actualizacion: material.fecha_actualizacion.toISOString(),
        usuario_actualizacion: material.usuario_actualizacion,
      });
    }
  });

  transaction();
  actualizarSincronizacion('materiales');
  console.log(`Materiales: ${materiales.length} registros sincronizados`);
}

// Función principal de sincronización
export async function sincronizar(): Promise<boolean> {
  console.log('Iniciando sincronización...');
  const conectado = await hayConexion();

  if (!conectado) {
    console.log('Sin conexión — trabajando en modo offline');
    return false;
  }

  console.log('Conexión verificada — sincronizando con base central...');

  try {
    await sincronizarRoles();
    await sincronizarUsuarios();
    await sincronizarClientes();
    await sincronizarMateriales();
    console.log('Sincronización completada exitosamente');
    return true;
  } catch (error) {
    console.error('Error durante sincronización:', error);
    return false;
  }
}

export { hayConexion };