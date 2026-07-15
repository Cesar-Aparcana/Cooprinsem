import { Router, Request, Response } from 'express';

const router = Router();

// Helper para obtener Pool de pg
async function getPool() {
  const { Pool } = await import('pg');
  return new Pool({ connectionString: process.env['DATABASE_URL'] });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTOS DE VENTA
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/pos-maestros/documentos-venta — Listar todos
router.get('/documentos-venta', async (_req: Request, res: Response) => {
  const pool = await getPool();
  try {
    const result = await pool.query('SELECT * FROM pos_documento_venta ORDER BY clase_documento');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// POST /api/pos-maestros/documentos-venta — Crear
router.post('/documentos-venta', async (req: Request, res: Response) => {
  const { clase_documento, descripcion, tipo_documento, tipo_documento_desc, api_relacionada, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `INSERT INTO pos_documento_venta (clase_documento, descripcion, tipo_documento, tipo_documento_desc, api_relacionada, org_ventas, canal_distribucion, sector)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [clase_documento, descripcion, tipo_documento, tipo_documento_desc, api_relacionada ?? '', org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// PUT /api/pos-maestros/documentos-venta/:id — Editar
router.put('/documentos-venta/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { clase_documento, descripcion, tipo_documento, tipo_documento_desc, api_relacionada, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `UPDATE pos_documento_venta SET clase_documento=$1, descripcion=$2, tipo_documento=$3, tipo_documento_desc=$4, api_relacionada=$5, org_ventas=$6, canal_distribucion=$7, sector=$8
       WHERE id=$9 RETURNING *`,
      [clase_documento, descripcion, tipo_documento, tipo_documento_desc, api_relacionada ?? '', org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00', id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Documento no encontrado' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// DELETE /api/pos-maestros/documentos-venta/:id — Eliminar
router.delete('/documentos-venta/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const pool = await getPool();
  try {
    const result = await pool.query('DELETE FROM pos_documento_venta WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Documento no encontrado' });
      return;
    }
    res.json({ success: true, message: 'Eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// OFICINAS DE VENTAS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/pos-maestros/oficinas-venta — Listar todos
router.get('/oficinas-venta', async (_req: Request, res: Response) => {
  const pool = await getPool();
  try {
    const result = await pool.query('SELECT * FROM pos_oficina_venta ORDER BY codigo');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// POST /api/pos-maestros/oficinas-venta — Crear
router.post('/oficinas-venta', async (req: Request, res: Response) => {
  const { codigo, nombre, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `INSERT INTO pos_oficina_venta (codigo, nombre, org_ventas, canal_distribucion, sector)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo, nombre, org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// PUT /api/pos-maestros/oficinas-venta/:id — Editar
router.put('/oficinas-venta/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { codigo, nombre, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `UPDATE pos_oficina_venta SET codigo=$1, nombre=$2, org_ventas=$3, canal_distribucion=$4, sector=$5
       WHERE id=$6 RETURNING *`,
      [codigo, nombre, org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00', id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Oficina no encontrada' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// DELETE /api/pos-maestros/oficinas-venta/:id — Eliminar
router.delete('/oficinas-venta/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const pool = await getPool();
  try {
    const result = await pool.query('DELETE FROM pos_oficina_venta WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Oficina no encontrada' });
      return;
    }
    res.json({ success: true, message: 'Eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CENTROS SUMINISTRADOR
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/pos-maestros/centros-suministrador — Listar todos
router.get('/centros-suministrador', async (_req: Request, res: Response) => {
  const pool = await getPool();
  try {
    const result = await pool.query('SELECT * FROM pos_centro_suministrador ORDER BY codigo');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// POST /api/pos-maestros/centros-suministrador — Crear
router.post('/centros-suministrador', async (req: Request, res: Response) => {
  const { codigo, nombre, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `INSERT INTO pos_centro_suministrador (codigo, nombre, org_ventas, canal_distribucion, sector)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [codigo, nombre, org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// PUT /api/pos-maestros/centros-suministrador/:id — Editar
router.put('/centros-suministrador/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { codigo, nombre, org_ventas, canal_distribucion, sector } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `UPDATE pos_centro_suministrador SET codigo=$1, nombre=$2, org_ventas=$3, canal_distribucion=$4, sector=$5
       WHERE id=$6 RETURNING *`,
      [codigo, nombre, org_ventas ?? 'COOP', canal_distribucion ?? 'VM', sector ?? '00', id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Centro no encontrado' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// DELETE /api/pos-maestros/centros-suministrador/:id — Eliminar
router.delete('/centros-suministrador/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const pool = await getPool();
  try {
    const result = await pool.query('DELETE FROM pos_centro_suministrador WHERE id=$1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Centro no encontrado' });
      return;
    }
    res.json({ success: true, message: 'Eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL DISTRIBUCIÓN
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/canales-distribucion', async (_req: Request, res: Response) => {
  const pool = await getPool();
  try {
    const result = await pool.query('SELECT * FROM pos_canal_distribucion ORDER BY codigo');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

router.post('/canales-distribucion', async (req: Request, res: Response) => {
  const { codigo, descripcion } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `INSERT INTO pos_canal_distribucion (codigo, descripcion) VALUES ($1, $2) RETURNING *`,
      [codigo, descripcion]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

router.put('/canales-distribucion/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { codigo, descripcion } = req.body;
  const pool = await getPool();
  try {
    const result = await pool.query(
      `UPDATE pos_canal_distribucion SET codigo=$1, descripcion=$2 WHERE id=$3 RETURNING *`,
      [codigo, descripcion, id]
    );
    if (result.rowCount === 0) { res.status(404).json({ success: false, message: 'No encontrado' }); return; }
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

router.delete('/canales-distribucion/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const pool = await getPool();
  try {
    const result = await pool.query('DELETE FROM pos_canal_distribucion WHERE id=$1', [id]);
    if (result.rowCount === 0) { res.status(404).json({ success: false, message: 'No encontrado' }); return; }
    res.json({ success: true, message: 'Eliminado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
});

export default router;
