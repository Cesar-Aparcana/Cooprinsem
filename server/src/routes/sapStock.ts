import { Router, Request, Response } from 'express';
import { consultarStock, StockQueryParams } from './sapStockService';

const router = Router();

/**
 * GET /api/sap-stock
 *
 * Consulta el stock de materiales directamente en SAP
 * usando la API estándar API_MATERIAL_STOCK_SRV.
 *
 * Todos los parámetros son opcionales — si no se envía ninguno,
 * devuelve los primeros 100 registros.
 *
 * Query params:
 *   - material           → código de material  (ej: "D2C_C_106")
 *   - plant              → código de centro    (ej: "1010")
 *   - storageLocation    → código de almacén   (ej: "101C")
 *   - inventoryStockType → tipo de stock       (ej: "01" = libre utilización)
 *   - top                → límite de registros (por defecto 100)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const params: StockQueryParams = {
      material:            req.query.material           as string | undefined,
      plant:               req.query.plant              as string | undefined,
      storageLocation:     req.query.storageLocation    as string | undefined,
      inventoryStockType:  req.query.inventoryStockType as string | undefined,
      top:                 req.query.top ? Number(req.query.top) : undefined,
    };

    const stock = await consultarStock(params);

    res.json({
      success: true,
      total:   stock.length,
      data:    stock,
    });
  } catch (error: any) {
    console.error('[GET /api/sap-stock] Error al consultar SAP:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error al consultar el stock en SAP',
      detail:  error.message,
    });
  }
});

export default router;