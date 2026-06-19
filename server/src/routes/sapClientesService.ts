import axios, { AxiosInstance } from 'axios';
import https from 'https';

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Datos de un cliente tal como los devuelve SAP desde A_BusinessPartner.
 */
export interface SapCliente {
  BusinessPartner:          string;  // Número de cliente SAP
  BusinessPartnerFullName:  string;  // Nombre completo
  BusinessPartnerName:      string;  // Nombre 1
  BusinessPartnerName2:     string;  // Nombre 2
  SearchTerm1:              string;  // Concepto búsqueda
  SearchTerm2:              string;  // Concepto búsqueda 2
  BusinessPartnerGrouping:  string;  // Agrupación
  Industry:                 string;  // Giro
}

/**
 * Datos de dirección de un cliente desde A_BusinessPartnerAddress.
 */
export interface SapDireccionCliente {
  BusinessPartner:  string;
  AddressID:        string;
  StreetName:       string;   // Dirección
  CityName:         string;   // Ciudad
  Region:           string;   // Región (código)
  PostalCode:       string;   // Código postal
  Country:          string;   // País
  PhoneNumber:      string;   // Teléfono
  MobilePhoneNumber: string;  // Celular
  FaxNumber:        string;   // Fax
  EmailAddress:     string;   // Correo
}

/**
 * Campos para crear un cliente nuevo en SAP.
 */
export interface SapCrearClienteParams {
  tratamiento:      string;
  rut:              string;
  nombre:           string;
  nombre2?:         string;
  conceptoBusqueda: string;
  giro:             string;
  direccion:        string;
  region:           string;
  ciudad:           string;
  comuna:           string;
  zonaTransporte:   string;
  telefono?:        string;
  celular?:         string;
  fax?:             string;
  direccionPostal?: string;
  ciudadPostal?:    string;
  casilla?:         string;
  correoContacto?:  string;
  correoFactura?:   string;
}

// ─── Agente HTTPS ─────────────────────────────────────────────────────────────

/**
 * Agente que permite certificados autofirmados.
 * Necesario en entornos SAP S/4HANA private on-premise.
 */
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// ─── Cliente Axios base ───────────────────────────────────────────────────────

/**
 * Crea una instancia de axios configurada con las credenciales SAP.
 * Se instancia en cada llamada para leer siempre las variables de entorno actuales.
 */
function crearClienteAxios(): AxiosInstance {
  const { SAP_BASE_URL, SAP_USER, SAP_PASSWORD } = process.env;

  if (!SAP_BASE_URL || !SAP_USER || !SAP_PASSWORD) {
    throw new Error('Faltan variables de entorno SAP (SAP_BASE_URL, SAP_USER, SAP_PASSWORD)');
  }

  // Extraer la URL base sin el path de API_MATERIAL_STOCK_SRV
  const sapHost = SAP_BASE_URL.replace('/API_MATERIAL_STOCK_SRV', '');
  const credenciales = Buffer.from(`${SAP_USER}:${SAP_PASSWORD}`).toString('base64');

  return axios.create({
    baseURL:    `${sapHost}/API_BUSINESS_PARTNER`,
    httpsAgent,
    headers: {
      Accept:        'application/json',
      'sap-client':  '100',
      Authorization: `Basic ${credenciales}`,
    },
  });
}

// ─── Funciones principales ────────────────────────────────────────────────────

/**
 * Busca un cliente en SAP por su número de Business Partner.
 *
 * @param numeroCliente - Número de cliente SAP (ej: "1000000")
 * @returns Datos del cliente encontrado
 */
export async function buscarClientePorNumero(numeroCliente: string): Promise<SapCliente> {
  const cliente = crearClienteAxios();

  const response = await cliente.get(
    `/A_BusinessPartner('${numeroCliente}')`,
    { params: { $format: 'json' } }
  );

  return response.data?.d as SapCliente;
}

/**
 * Busca un cliente en SAP por su RUT (número de identificación fiscal).
 *
 * @param rut - RUT del cliente (ej: "12345678-9")
 * @returns Lista de clientes que coinciden con el RUT
 */
export async function buscarClientePorRut(rut: string): Promise<SapCliente[]> {
  const cliente = crearClienteAxios();

  // Primero buscar el BusinessPartner por RUT en la entidad de impuestos
  const responseTax = await cliente.get('/A_BusinessPartnerTaxNumber', {
    params: {
      $filter:  `BPTaxNumber eq '${rut}'`,
      $format:  'json',
    },
  });

  const resultadosImpuesto = responseTax.data?.d?.results ?? [];

  if (resultadosImpuesto.length === 0) {
    return [];
  }

  // Con los BusinessPartner encontrados, obtener sus datos completos
  const clientes: SapCliente[] = [];
  for (const item of resultadosImpuesto) {
    try {
      const bp = await buscarClientePorNumero(item.BusinessPartner);
      clientes.push(bp);
    } catch {
      // Si un BP no se puede obtener, continuamos con los demás
    }
  }

  return clientes;
}

/**
 * Obtiene el token CSRF necesario para operaciones de escritura en SAP OData.
 * SAP requiere este token antes de cualquier POST, PUT o DELETE.
 *
 * @returns Token CSRF y cookies de sesión
 */
export async function obtenerCsrfToken(): Promise<{ token: string; cookies: string }> {
  const cliente = crearClienteAxios();

  const response = await cliente.get('/', {
    params:  { $format: 'json' },
    headers: { 'X-CSRF-Token': 'Fetch' },
  });

  const token   = response.headers['x-csrf-token'] as string;
  const cookies = (response.headers['set-cookie'] ?? []).join('; ');

  if (!token) {
    throw new Error('SAP no devolvió el token CSRF');
  }

  return { token, cookies };
}

/**
 * Crea un nuevo cliente (Business Partner) en SAP.
 * Requiere obtener un token CSRF antes de enviar el POST.
 *
 * @param params - Datos del cliente a crear
 * @returns Número de BusinessPartner creado
 */
export async function crearClienteSap(params: SapCrearClienteParams): Promise<string> {
  const { token, cookies } = await obtenerCsrfToken();
  const cliente = crearClienteAxios();

  // Mapear los campos del formulario al formato SAP API_BUSINESS_PARTNER
  const body = {
    BusinessPartnerCategory: '1',           // 1 = Persona natural
    BusinessPartnerGrouping: 'DEUD',        // Grupo deudor Cooprinsem
    FirstName:               params.nombre,
    LastName:                params.nombre2 ?? '',
    SearchTerm1:             params.conceptoBusqueda,
    Industry:                params.giro,
    to_BusinessPartnerAddress: {
      results: [
        {
          StreetName:        params.direccion,
          CityName:          params.ciudad,
          Region:            params.region,
          PostalCode:        params.casilla ?? '',
          Country:           'CL',
          PhoneNumber:       params.telefono ?? '',
          MobilePhoneNumber: params.celular  ?? '',
          FaxNumber:         params.fax      ?? '',
          EmailAddress:      params.correoFactura ?? params.correoContacto ?? '',
        },
      ],
    },
    to_BusinessPartnerTaxNumber: {
      results: [
        {
          BPTaxType:   'CL1',  // Tipo impuesto Chile: RUT
          BPTaxNumber: params.rut,
        },
      ],
    },
  };

  const response = await cliente.post('/A_BusinessPartner', body, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
      Cookie:         cookies,
    },
  });

  const businessPartner = response.data?.d?.BusinessPartner as string;
  return businessPartner;
}