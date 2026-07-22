const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface IAperturaCaja {
  Usuario: string
  Sociedad: string
  NombreSociedad: string
  Sucursal: string
  NombreSucursal: string
  Fecha: string
  Monto: string
  Moneda: string
  Estado: string
  NombreEstado: string
  FolioCaja: string
  FechaCreacion: string
  HoraCreacion: string
}

export interface IConsultaAperturaResponse {
  encontrada: boolean
  apertura: IAperturaCaja | null
}

export async function consultarAperturaCaja(usuario: string, sucursal: string): Promise<IConsultaAperturaResponse> {
  const hoy = new Date().toISOString().split('T')[0]
  const res = await fetch(`${API_BASE_URL}/api/sap-caja/apertura?usuario=${encodeURIComponent(usuario)}&sucursal=${encodeURIComponent(sucursal)}&fecha=${hoy}`)
  if (!res.ok) throw new Error(`Error: ${res.status}`)
  return res.json()
}

export async function grabarAperturaCaja(datos: {
  usuario: string
  sociedad: string
  sucursal: string
  fecha: string
  monto: number
  moneda: string
}): Promise<IAperturaCaja> {
  const res = await fetch(`${API_BASE_URL}/api/sap-caja/apertura`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Error: ${res.status}`)
  return json.data
}