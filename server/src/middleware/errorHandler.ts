import { Request, Response, NextFunction } from 'express';

/**
 * Middleware centralizado de manejo de errores para Express.
 * Reemplaza los bloques try/catch duplicados en cada ruta.
 *
 * Uso en rutas:
 *   router.get('/', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Error handler global — registrar como último middleware en index.ts.
 * Captura errores no manejados y responde con formato consistente.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  intentos = 2,
  delayMs = 500
): Promise<T> {
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const esTimeout = err?.message?.includes('timed out') || err?.message?.includes('ETIMEDOUT');
      const esUltimoIntento = i === intentos - 1;
      if (!esTimeout || esUltimoIntento) throw err;
      console.warn(`[withRetry] Timeout detectado, reintentando (${i + 1}/${intentos})...`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw new Error('withRetry: no debería llegar aquí');
}
export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error en ruta:', err.message);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
}
