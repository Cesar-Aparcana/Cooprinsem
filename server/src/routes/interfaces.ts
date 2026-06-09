import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/interfaces — listar interfaces SAP con filtros
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { tipo, estado, desde, hasta } = req.query;

  const where: Record<string, unknown> = {};

  if (tipo) {
    where['IntTip'] = Number(tipo);
  }

  if (estado) {
    where['IntEstado'] = String(estado);
  }

  if (desde || hasta) {
    where['IntFecInicio'] = {
      ...(desde ? { gte: new Date(String(desde)) } : {}),
      ...(hasta ? { lte: new Date(String(hasta)) } : {}),
    };
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