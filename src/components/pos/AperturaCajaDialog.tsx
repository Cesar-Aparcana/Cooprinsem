import { useState } from 'react'
import {
  Dialog,
  FlexBox,
  Label,
  Input,
  Button,
  Bar,
  Title,
  MessageStrip,
} from '@ui5/webcomponents-react'

interface AperturaCajaDialogProps {
  open: boolean
  usuario: string
  sociedad: string
  nombreSociedad: string
  sucursal: string
  nombreSucursal: string
  onAceptar: (monto: number, fecha: string) => void
  onCancelar: () => void
  isGrabando: boolean
  error: string | null
}

export function AperturaCajaDialog({
  open,
  usuario,
  sociedad,
  nombreSociedad,
  sucursal,
  nombreSucursal,
  onAceptar,
  onCancelar,
  isGrabando,
  error,
}: AperturaCajaDialogProps) {
  const hoy = new Date().toISOString().split('T')[0]
  const [fecha, setFecha] = useState(hoy)
  const [monto, setMonto] = useState('')

  const handleAceptar = () => {
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) return
    onAceptar(montoNum, fecha)
  }

  return (
    <Dialog
      open={open}
      headerText="Apertura de Caja"
      style={{ width: '450px' }}
      footer={
        <Bar
          endContent={
            <FlexBox style={{ gap: '0.5rem' }}>
              <Button design="Emphasized" onClick={handleAceptar} disabled={isGrabando || !monto}>
                {isGrabando ? 'Grabando...' : 'Aceptar'}
              </Button>
              <Button design="Transparent" onClick={onCancelar} disabled={isGrabando}>
                Cancelar
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <div style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
        <Title level="H5">Datos Generales</Title>

        {error && (
          <MessageStrip design="Negative">{error}</MessageStrip>
        )}

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Usuario</Label>
            <Input value={usuario} readonly />
          </div>
        </FlexBox>

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Sociedad</Label>
            <Input value={`${sociedad} — ${nombreSociedad}`} readonly />
          </div>
        </FlexBox>

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Sucursal</Label>
            <Input value={`${sucursal} — ${nombreSucursal}`} readonly />
          </div>
        </FlexBox>

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Fecha</Label>
            <Input
              type="Date"
              value={fecha}
              onInput={(e: { target: { value: string } }) => setFecha(e.target.value)}
            />
          </div>
        </FlexBox>

        <FlexBox style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Label>Monto</Label>
            <Input
              type="Number"
              value={monto}
              onInput={(e: { target: { value: string } }) => setMonto(e.target.value)}
              placeholder="200000"
            />
          </div>
          <div>
            <Label>Moneda</Label>
            <Input value="CLP" readonly />
          </div>
        </FlexBox>
      </div>
    </Dialog>
  )
}