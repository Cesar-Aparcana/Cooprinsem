const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export interface IValidarPedidoParams {
  cliente: string
  items: { codigoMaterial: string; cantidad: number }[]
  centro?: string
}

export interface IValidarPedidoResult {
  success: boolean
  message: string
  data?: any
}

export async function validarPedidoSap(params: IValidarPedidoParams): Promise<IValidarPedidoResult> {
  const res = await fetch(`${API_BASE_URL}/api/sap-pedidos/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message ?? 'Error al validar pedido en SAP')
  }

  return json
}