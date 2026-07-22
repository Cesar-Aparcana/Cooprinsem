import { Router, Request, Response } from 'express';
import axios from 'axios';
import https from 'https';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function crearClienteZpos() {
  const sapUrl = process.env.SAP_ZPOS_URL;
  const sapClient = process.env.SAP_ZPOS_CLIENT || '724';
  const sapUser = process.env.SAP_USER;
  const sapPassword = process.env.SAP_PASSWORD;

  if (!sapUrl || !sapUser || !sapPassword) {
    throw new Error('Faltan variables de entorno SAP ZPOS (SAP_ZPOS_URL, SAP_USER, SAP_PASSWORD)');
  }

  const credenciales = Buffer.from(`${sapUser}:${sapPassword}`).toString('base64');

  return axios.create({
    baseURL: `${sapUrl}/sap/opu/odata/sap/ZPOS_CAJA_SRV`,
    httpsAgent,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'sap-client': sapClient,
      'sap-language': 'ES',
      Authorization: `Basic ${credenciales}`,
    },
  });
}

// GET /api/sap-caja/apertura?usuario=MOYARZUN&sucursal=D190&fecha=2026-07-22
router.get('/apertura', asyncHandler(async (req: Request, res: Response) => {
  const { usuario, sucursal, fecha } = req.query;

  if (!usuario || !sucursal) {
    res.status(400).json({ error: 'Parámetros usuario y sucursal son requeridos' });
    return;
  }

  // Fecha: si no viene, usar hoy
  const fechaStr = fecha ? String(fecha) : new Date().toISOString().split('T')[0];
  const fechaOdata = `datetime'${fechaStr}T00:00:00'`;

  const cliente = crearClienteZpos();
  const filter = `Usuario eq '${usuario}' and Sucursal eq '${sucursal}' and Fecha eq ${fechaOdata}`;

  const response = await cliente.get('/AperturaCajaSet', {
    params: {
      $filter: filter,
      $top: '1',
    },
  });

  const results = response.data?.d?.results ?? [];
  res.json({ encontrada: results.length > 0, apertura: results[0] ?? null });
}));

// POST /api/sap-caja/apertura
router.post('/apertura', asyncHandler(async (req: Request, res: Response) => {
  const { usuario, sociedad, sucursal, fecha, monto, moneda } = req.body;

  if (!usuario || !sociedad || !sucursal || !fecha || !monto) {
    res.status(400).json({ error: 'Faltan campos obligatorios (usuario, sociedad, sucursal, fecha, monto)' });
    return;
  }

  const cliente = crearClienteZpos();

  // Paso 1: Obtener CSRF token
  const tokenRes = await cliente.get('/$metadata', {
    headers: { 'x-csrf-token': 'Fetch', Accept: '*/*' },
  });
  const token = tokenRes.headers['x-csrf-token'] as string;
  const cookies = (tokenRes.headers['set-cookie'] ?? []).join('; ');

  // Convertir fecha a formato OData /Date(ms)/
  const fechaMs = new Date(fecha + 'T00:00:00Z').getTime();
  const fechaOdata = `/Date(${fechaMs})/`;

  // Paso 2: POST apertura
  const body = {
    Usuario: usuario,
    Sociedad: sociedad,
    Sucursal: sucursal,
    Fecha: fechaOdata,
    Monto: String(Number(monto).toFixed(2)),
    Moneda: moneda || 'CLP',
  };

  try {
    const response = await cliente.post('/AperturaCajaSet', body, {
      headers: { 'x-csrf-token': token, Cookie: cookies },
    });

    res.status(201).json({ success: true, data: response.data?.d });
  } catch (sapError: any) {
    const errorMsg = sapError?.response?.data?.error?.message?.value ?? sapError.message;
    const status = sapError?.response?.status ?? 500;
    res.status(status).json({ success: false, message: errorMsg });
  }
}));

export default router;