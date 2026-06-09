import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/interfaces — listar interfaces SAP con filtros
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { tipo, estado, desde, hasta } = req.query;

  const where: Record<string, unknown> = {};

  if (tipo && tipo !== '') {
    where['IntTip'] = Number(tipo);
  }

  if (estado && estado !== '') {
    where['IntEstado'] = String(estado);
  }

  if (desde || hasta) {
    const fechaFiltro: Record<string, Date> = {};

    if (desde) {
      // Inicio del día en Chile (UTC-4 = +4 horas en UTC)
      const d = new Date(String(desde));
      d.setUTCHours(4, 0, 0, 0);
      fechaFiltro['gte'] = d;
    }

    if (hasta) {
      // Fin del día en Chile (UTC-4 = +28 horas = día siguiente 04:00 UTC)
      const h = new Date(String(hasta));
      h.setUTCDate(h.getUTCDate() + 1);
      h.setUTCHours(3, 59, 59, 999);
      fechaFiltro['lte'] = h;
    }

    where['IntFecInicio'] = fechaFiltro;
  }

  const interfaces = await prisma.interfaz.findMany({
    where,
    orderBy: { IntFecInicio: 'desc' },
    take: 200,
  });

  const result = interfaces.map((i) => ({
    id: i.IntID.toString(),
    fechaInicio: i.IntFecInicio,
    tipo: i.IntTip,
    nombre: i.IntNom,
    fechaTermino: i.IntFecTermino,
    cantActualiza: i.IntCantActualiza,
    estado: i.IntEstado,
    observacion: i.IntObs,
  }));

  res.json({ d: { results: result } });
}));

export default router;