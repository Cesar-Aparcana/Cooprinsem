import { API_BASE_URL } from './config';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Representa un registro de stock tal como lo devuelve nuestro backend,
 * que a su vez lo obtiene de la API SAP API_MATERIAL_STOCK_SRV.
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
 * Parámetros de filtro para la consulta de stock SAP.
 * Todos son opcionales — si no se envía ninguno devuelve los primeros 100 registros.
 */
export interface SapStockQueryParams {
  material?:           string;
  plant?:              string;
  storageLocation?:    string;
  inventoryStockType?: string;
  top?:                number;
}

/**
 * Respuesta del endpoint /api/sap-stock.
 */
interface SapStockResponse {
  success: boolean;
  total:   number;
  data:    SapStockRecord[];
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Consulta el stock de materiales en SAP a través del backend proxy.
 * Las credenciales SAP nunca se exponen al frontend — el backend las maneja.
 *
 * @param params - Filtros opcionales para la consulta
 * @returns Lista de registros de stock devueltos por SAP
 */
export async function getSapStock(params: SapStockQueryParams = {}): Promise<SapStockRecord[]> {
  // Construir los query params solo con los valores que fueron proporcionados
  const queryParams = new URLSearchParams();

  if (params.material)           queryParams.set('material',           params.material);
  if (params.plant)              queryParams.set('plant',              params.plant);
  if (params.storageLocation)    queryParams.set('storageLocation',    params.storageLocation);
  if (params.inventoryStockType) queryParams.set('inventoryStockType', params.inventoryStockType);
  if (params.top)                queryParams.set('top',                String(params.top));

  const url = `${API_BASE_URL}/api/sap-stock?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al consultar stock SAP: ${response.status}`);
  }

  const json: SapStockResponse = await response.json();
  return json.data;
}