import { useState, useCallback } from 'react'
import {
  Dialog,
  FlexBox,
  Label,
  Input,
  Button,
  Bar,
  Title,
  MessageStrip,
  BusyIndicator,
} from '@ui5/webcomponents-react'
import { buscarSapClientePorRut } from '@/services/api/sapClientes'
import { SAP_SOCIEDAD } from '@/config/sap'

interface EgresoCajaDialogProps {
  open: boolean
  sucursal: string
  onAceptar: (datos: {
    rut: string
    nombre: string
    clienteCodigo: string
    monto: number
  }) => void
  onCancelar: () => void
  isGrabando: boolean
  error: string | null
}

export function EgresoCajaDialog({
  open,
  sucursal,
  onAceptar,
  onCancelar,
  isGrabando,
  error,
}: EgresoCajaDialogProps) {
  const ejercicio = new Date().getFullYear().toString()
  const [rut, setRut] = useState('')
  const [nombre, setNombre] = useState('')
  const [clienteCodigo, setClienteCodigo] = useState('')
  const [monto, setMonto] = useState('')
  const [buscandoCliente, setBuscandoCliente] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null)

  const handleBuscarCliente = useCallback(async () => {
    if (!rut.trim()) return
    setBuscandoCliente(true)
    setErrorBusqueda(null)
    setNombre('')
    setClienteCodigo('')

    try {
      const rutNormalizado = rut.replace(/\./g, '').replace(/[^0-9kK-]/gi, '')
      const resultados = await buscarSapClientePorRut(rutNormalizado)
      if (resultados.length > 0) {
        const sap = resultados[0]
        setNombre(sap.BusinessPartnerFullName || sap.BusinessPartnerName)
        setClienteCodigo(sap.BusinessPartner)
      } else {
        setErrorBusqueda('Cliente no encontrado en SAP')
      }
    } catch {
      setErrorBusqueda('Error al buscar cliente en SAP')
    } finally {
      setBuscandoCliente(false)
    }
  }, [rut])

  const handleAceptar = () => {
    const montoNum = Number(monto)
    if (!clienteCodigo) return
    if (!montoNum || montoNum <= 0) return
    onAceptar({ rut, nombre, clienteCodigo, monto: montoNum })
  }

  const handleCerrar = () => {
    setRut('')
    setNombre('')
    setClienteCodigo('')
    setMonto('')
    setErrorBusqueda(null)
    onCancelar()
  }

  return (
    <Dialog
      open={open}
      headerText="Egreso Caja"
      style={{ width: '500px' }}
      footer={
        <Bar
          endContent={
            <FlexBox style={{ gap: '0.5rem' }}>
              <Button design="Transparent" onClick={handleCerrar} disabled={isGrabando}>
                Cancelar
              </Button>
              <Button design="Emphasized" onClick={handleAceptar} disabled={isGrabando || !clienteCodigo || !monto}>
                {isGrabando ? 'Contabilizando...' : 'Aceptar'}
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <div style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        {error && <MessageStrip design="Negative">{error}</MessageStrip>}
        {errorBusqueda && <MessageStrip design="Warning">{errorBusqueda}</MessageStrip>}

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Sociedad</Label>
            <Input value={SAP_SOCIEDAD} readonly />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Ejercicio</Label>
            <Input value={ejercicio} readonly />
          </div>
        </FlexBox>

        <div>
          <Label>Nº documento</Label>
          <Input value="(generado por SAP)" readonly style={{ color: '#999' }} />
        </div>

        <FlexBox style={{ gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Label style={{ color: 'var(--sapNegativeColor)' }}>* Rut</Label>
            <Input
              value={rut}
              onInput={(e: { target: { value: string } }) => {
                setRut(e.target.value)
                setNombre('')
                setClienteCodigo('')
                setErrorBusqueda(null)
              }}
              placeholder="Ej: 96719960-5"
              onKeyDown={(e: any) => { if (e.key === 'Enter') handleBuscarCliente() }}
            />
          </div>
          <Button design="Default" onClick={handleBuscarCliente} disabled={buscandoCliente || !rut.trim()}>
            {buscandoCliente ? 'Buscando...' : 'Buscar'}
          </Button>
        </FlexBox>

        <BusyIndicator active={buscandoCliente} size="S">
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} readonly />
          </div>
        </BusyIndicator>

        <div>
          <Label>Cliente</Label>
          <Input value={clienteCodigo} readonly />
        </div>

        <div>
          <Label style={{ color: 'var(--sapNegativeColor)' }}>* Monto</Label>
          <Input
            type="Number"
            value={monto}
            onInput={(e: { target: { value: string } }) => setMonto(e.target.value)}
            placeholder="Ej: 4023"
          />
        </div>
      </div>
    </Dialog>
  )
}