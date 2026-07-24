import { useRef } from 'react'
import {
  Dialog,
  Button,
  Bar,
  FlexBox,
} from '@ui5/webcomponents-react'

interface ComprobanteEgresoProps {
  open: boolean
  onCerrar: () => void
  datos: {
    nroDocumento: string
    fecha: string
    sociedad: string
    sucursal: string
    nombreSucursal: string
    clienteNombre: string
    clienteRut: string
    clienteCodigo: string
    monto: number
    moneda: string
    usuario: string
    concepto: string
  } | null
}

export function ComprobanteEgresoDialog({ open, onCerrar, datos }: ComprobanteEgresoProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (!datos) return null

  const montoFormateado = `$ ${datos.monto.toLocaleString('es-CL')}`
  const fechaHoy = datos.fecha || new Date().toLocaleDateString('es-CL')

  const handleImprimir = () => {
    if (!printRef.current) return
    const contenido = printRef.current.innerHTML
    const ventana = window.open('', '_blank', 'width=800,height=600')
    if (!ventana) return
    ventana.document.write(`
      <!DOCTYPE html>
      <html><head><title>Comprobante de Egreso</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; margin: 40px; color: #000; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0; font-size: 14px; }
        .header p { margin: 2px 0; font-size: 11px; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; }
        .titulo-doc { text-align: center; margin: 20px 0; font-weight: bold; font-size: 13px; }
        .cuerpo { margin: 20px 0; line-height: 1.8; }
        .cuerpo p { margin: 5px 0; }
        .firmas { margin-top: 60px; }
        .firma-linea { display: flex; justify-content: space-between; margin-top: 40px; }
        .firma-bloque { text-align: center; width: 45%; }
        .firma-bloque .linea { border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; }
        .separador { border-top: 1px dashed #000; margin: 30px 0; }
        @media print { body { margin: 20px; } }
      </style>
      </head><body>${contenido}</body></html>
    `)
    ventana.document.close()
    ventana.print()
  }

  const contenidoComprobante = `
    <div class="header">
      <h2>Cooperativa Agrícola y de Servicios Ltda.</h2>
      <p>Manuel Rodríguez 1040</p>
      <p>Vta.de Insumos y Serv.Agropecuarios, Cría de Ganado y</p>
      <p>${datos.nombreSucursal}</p>
      <p>82.392.600-6</p>
    </div>

    <div class="info-grid">
      <div>
        <p>Nº: ${datos.nroDocumento || '(pendiente SAP)'}</p>
        <p>Fecha registro: ${fechaHoy}</p>
        <p>Fecha Contable: ${fechaHoy}</p>
        <p>Fecha Documento: ${fechaHoy}</p>
      </div>
      <div style="text-align: right;">
        <p>Tipo: </p>
        <p>Estado: VIGENTE</p>
      </div>
    </div>

    <div class="titulo-doc">
      DA-Documento de deudor<br/>
      COMPROBANTE DE EGRESO<br/>
      Nro.${datos.nroDocumento || '(pendiente)'}
    </div>

    <div class="cuerpo">
      <p>Solicito devolución de dinero por concepto de ${datos.concepto || 'DEVOL NC'}</p>
      <p>Por un monto de ${montoFormateado}</p>
      <p><strong>Nombre Cliente:</strong> ${datos.clienteNombre}</p>
      <p><strong>Rut:</strong> ${datos.clienteRut}</p>
      <p><strong>Observaciones:</strong> _______________________________________________</p>
    </div>

    <div class="firmas">
      <p>AUTORIZADO POR: ${datos.usuario}</p>

      <div class="firma-linea">
        <div class="firma-bloque">
          <div class="linea">RECIBI CONFORME</div>
        </div>
        <div class="firma-bloque">
          <div class="linea">RUT QUIEN RETIRA</div>
        </div>
      </div>
    </div>

    <div class="separador"></div>

    <div class="header">
      <h2>Cooperativa Agrícola y de Servicios Ltda.</h2>
      <p>${datos.nombreSucursal}</p>
      <p>82.392.600-6</p>
    </div>

    <div class="titulo-doc">
      DA-Documento de deudor<br/>
      COMPROBANTE DE EGRESO<br/>
      Nro.${datos.nroDocumento || '(pendiente)'}
    </div>

    <div class="cuerpo">
      <p>Solicito devolución de dinero por concepto de ${datos.concepto || 'DEVOL NC'}</p>
      <p>Por un monto de ${montoFormateado}</p>
      <p><strong>Nombre Cliente:</strong> ${datos.clienteNombre}</p>
      <p><strong>Rut:</strong> ${datos.clienteRut}</p>
    </div>
  `

  return (
    <Dialog
      open={open}
      headerText="Comprobante de Egreso"
      style={{ width: '700px', maxHeight: '90vh' }}
      footer={
        <Bar
          endContent={
            <FlexBox style={{ gap: '0.5rem' }}>
              <Button design="Emphasized" icon="print" onClick={handleImprimir}>
                Imprimir
              </Button>
              <Button design="Transparent" onClick={onCerrar}>
                Cerrar
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <div
        ref={printRef}
        style={{
          padding: '1.5rem',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px',
          lineHeight: '1.6',
          color: '#000',
          background: '#fff',
        }}
        dangerouslySetInnerHTML={{ __html: contenidoComprobante }}
      />
    </Dialog>
  )
}