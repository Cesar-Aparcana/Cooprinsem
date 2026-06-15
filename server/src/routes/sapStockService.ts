import axios from 'axios';
import https from 'https';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Representa un registro de stock tal como lo devuelve la API de SAP.
 * Campos basados en la entidad A_MatlStkInAcctMod de API_MATERIAL_STOCK_SRV.
 */
export interface SapStockRecord {
  Material:                     string;
  Plant:                        string;
  StorageLocation:              string;
  Batch:                        string;
  InventoryStockType:           string;
  MaterialBaseUnit:             string;
  MatlWrhsStkQtyInMatlBaseUnit: string;
}

/**
 * Parámetros de filtro que puede enviar el frontend al consultar stock.
 */
export interface StockQueryParams {
  material?:           string;
  plant?:              string;
  storageLocation?:    string;
  inventoryStockType?: string;
  top?:                number;
}

// ─── Agente HTTPS ─────────────────────────────────────────────────────────────

/**
 * Agente que permite certificados autofirmados.
 * Necesario en entornos SAP S/4HANA private on-premise.
 */
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Consulta el stock de materiales en SAP usando la API estándar API_MATERIAL_STOCK_SRV.
 * Actúa como proxy seguro: las credenciales SAP nunca se exponen al frontend.
 *
 * @param params - Filtros opcionales para la consulta (material, centro, almacén, etc.)
 * @returns Lista de registros de stock devueltos por SAP
 */
export async function consultarStock(params: StockQueryParams): Promise<SapStockRecord[]> {
  const { SAP_BASE_URL, SAP_USER, SAP_PASSWORD } = process.env;

  if (!SAP_BASE_URL || !SAP_USER || !SAP_PASSWORD) {
    throw new Error('Faltan variables de entorno SAP (SAP_BASE_URL, SAP_USER, SAP_PASSWORD)');
  }

  // Construir los filtros OData según los parámetros recibidos
  const filtros: string[] = [];

  if (params.material) {
    filtros.push(`Material eq '${params.material}'`);
  }
  if (params.plant) {
    filtros.push(`Plant eq '${params.plant}'`);
  }
  if (params.storageLocation) {
    filtros.push(`StorageLocation eq '${params.storageLocation}'`);
  }
  if (params.inventoryStockType) {
    filtros.push(`InventoryStockType eq '${params.inventoryStockType}'`);
  }

  // Parámetros de la consulta OData
  const queryParams: Record<string, string> = {
    $select: 'Material,Plant,StorageLocation,Batch,InventoryStockType,MaterialBaseUnit,MatlWrhsStkQtyInMatlBaseUnit',
    $top:    String(params.top ?? 100),
    $format: 'json',
  };

  if (filtros.length > 0) {
    queryParams['$filter'] = filtros.join(' and ');
  }

  // Construir el header Authorization en Base64.
  // IMPORTANTE: en el .env la contraseña debe ir entre comillas si contiene
  // caracteres especiales como #, ya que de lo contrario dotenv los interpreta
  // como inicio de comentario y trunca el valor.
  const credenciales = Buffer.from(`${SAP_USER}:${SAP_PASSWORD}`).toString('base64');

  const response = await axios.get(
    `${SAP_BASE_URL}/A_MatlStkInAcctMod`,
    {
      params: queryParams,
      headers: {
        Accept:        'application/json',
        'sap-client':  '100',
        Authorization: `Basic ${credenciales}`,
      },
      // Permitir certificados autofirmados en entornos SAP privados on-premise
      httpsAgent,
    }
  );

  // La API OData de SAP envuelve los resultados en d.results
  const resultados: SapStockRecord[] = response.data?.d?.results ?? [];
  return resultados;
}