const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

export interface IDocumentoVenta {
  id: number
  org_ventas: string
  canal_distribucion: string
  sector: string
  clase_documento: string
  descripcion: string
  tipo_documento: string
  tipo_documento_desc: string
  api_relacionada: string
}

export interface IOficinaVenta {
  id: number
  org_ventas: string
  canal_distribucion: string
  sector: string
  codigo: string
  nombre: string
}

export interface ICentroSuministrador {
  id: number
  org_ventas: string
  canal_distribucion: string
  sector: string
  codigo: string
  nombre: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTOS DE VENTA
// ═══════════════════════════════════════════════════════════════════════════════

export async function getDocumentosVenta(): Promise<IDocumentoVenta[]> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/documentos-venta`)
  if (!res.ok) throw new Error(`Error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function createDocumentoVenta(data: Partial<IDocumentoVenta>): Promise<IDocumentoVenta> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/documentos-venta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function updateDocumentoVenta(id: number, data: Partial<IDocumentoVenta>): Promise<IDocumentoVenta> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/documentos-venta/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function deleteDocumentoVenta(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/documentos-venta/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error: ${res.status}`)
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFICINAS DE VENTAS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getOficinasVenta(): Promise<IOficinaVenta[]> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/oficinas-venta`)
  if (!res.ok) throw new Error(`Error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function createOficinaVenta(data: Partial<IOficinaVenta>): Promise<IOficinaVenta> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/oficinas-venta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function updateOficinaVenta(id: number, data: Partial<IOficinaVenta>): Promise<IOficinaVenta> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/oficinas-venta/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function deleteOficinaVenta(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/oficinas-venta/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error: ${res.status}`)
}

// ═══════════════════════════════════════════════════════════════════════════════
// CENTROS SUMINISTRADOR
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCentrosSuministrador(): Promise<ICentroSuministrador[]> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/centros-suministrador`)
  if (!res.ok) throw new Error(`Error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function createCentroSuministrador(data: Partial<ICentroSuministrador>): Promise<ICentroSuministrador> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/centros-suministrador`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function updateCentroSuministrador(id: number, data: Partial<ICentroSuministrador>): Promise<ICentroSuministrador> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/centros-suministrador/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function deleteCentroSuministrador(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/centros-suministrador/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error: ${res.status}`)
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL DISTRIBUCIÓN
// ═══════════════════════════════════════════════════════════════════════════════

export interface ICanalDistribucion {
  id: number
  codigo: string
  descripcion: string
}

export async function getCanalesDistribucion(): Promise<ICanalDistribucion[]> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/canales-distribucion`)
  if (!res.ok) throw new Error(`Error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function createCanalDistribucion(data: Partial<ICanalDistribucion>): Promise<ICanalDistribucion> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/canales-distribucion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function updateCanalDistribucion(id: number, data: Partial<ICanalDistribucion>): Promise<ICanalDistribucion> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/canales-distribucion/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function deleteCanalDistribucion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/pos-maestros/canales-distribucion/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Error: ${res.status}`)
}