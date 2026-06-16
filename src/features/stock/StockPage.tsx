import { useState } from 'react'
import {
  Title,
  FlexBox,
  Button,
  Input,
  Label,
  BusyIndicator,
  MessageStrip,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/search.js'
import '@ui5/webcomponents-icons/dist/clear-all.js'
import '@ui5/webcomponents-icons/dist/inventory.js'
import { getSapStock, SapStockRecord, SapStockQueryParams } from '@/services/api/sapStock'

// ─── Tipos locales ─────────────────────────────────────────────────────────────

type EstadoBusqueda = 'inicial' | 'cargando' | 'con-resultados' | 'sin-resultados' | 'error'

// ─── Componente principal ──────────────────────────────────────────────────────

/**
 * Página de Consulta de Stock SAP.
 * Permite filtrar por material, centro y almacén, y muestra los resultados
 * obtenidos en tiempo real desde la API SAP API_MATERIAL_STOCK_SRV.
 */
export function StockPage() {
  // ── Estado de filtros ──────────────────────────────────────────────────────
  const [filtroMaterial,  setFiltroMaterial]  = useState('')
  const [filtroCentro,    setFiltroCentro]    = useState('')
  const [filtroAlmacen,   setFiltroAlmacen]   = useState('')
  const [filtroTipoStock, setFiltroTipoStock] = useState('')

  // ── Estado de resultados ───────────────────────────────────────────────────
  const [registros,      setRegistros]      = useState<SapStockRecord[]>([])
  const [estadoBusqueda, setEstadoBusqueda] = useState<EstadoBusqueda>('inicial')
  const [mensajeError,   setMensajeError]   = useState('')

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Ejecuta la búsqueda de stock en SAP con los filtros actuales.
   */
  async function handleBuscar() {
    const params: SapStockQueryParams = {
      material:           filtroMaterial.trim()  || undefined,
      plant:              filtroCentro.trim()    || undefined,
      storageLocation:    filtroAlmacen.trim()   || undefined,
      inventoryStockType: filtroTipoStock.trim() || undefined,
      top:                200,
    }

    setEstadoBusqueda('cargando')
    setRegistros([])
    setMensajeError('')

    try {
      const data = await getSapStock(params)
      setRegistros(data)
      setEstadoBusqueda(data.length === 0 ? 'sin-resultados' : 'con-resultados')
    } catch (error: any) {
      setMensajeError(error.message ?? 'Error desconocido al consultar SAP')
      setEstadoBusqueda('error')
    }
  }

  /**
   * Limpia todos los filtros y vuelve al estado inicial.
   */
  function handleLimpiar() {
    setFiltroMaterial('')
    setFiltroCentro('')
    setFiltroAlmacen('')
    setFiltroTipoStock('')
    setRegistros([])
    setEstadoBusqueda('inicial')
    setMensajeError('')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <FlexBox direction="Column" style={{ padding: '1rem', gap: '1rem', height: '100%' }}>

      {/* Encabezado */}
      <Title>Consulta de Stock</Title>

      {/* Panel de filtros */}
      <FlexBox
        wrap="Wrap"
        alignItems="End"
        style={{
          gap: '1rem',
          padding: '1rem',
          background: '#f5f6f7',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <FlexBox direction="Column" style={{ gap: '0.25rem', minWidth: '180px' }}>
          <Label>Material</Label>
          <Input
            placeholder="Ej: D2C_C_106"
            value={filtroMaterial}
            onInput={e => setFiltroMaterial(e.target.value)}
          />
        </FlexBox>

        <FlexBox direction="Column" style={{ gap: '0.25rem', minWidth: '180px' }}>
          <Label>Centro (Plant)</Label>
          <Input
            placeholder="Ej: 1010"
            value={filtroCentro}
            onInput={e => setFiltroCentro(e.target.value)}
          />
        </FlexBox>

        <FlexBox direction="Column" style={{ gap: '0.25rem', minWidth: '180px' }}>
          <Label>Almacén (Storage Location)</Label>
          <Input
            placeholder="Ej: 101C"
            value={filtroAlmacen}
            onInput={e => setFiltroAlmacen(e.target.value)}
          />
        </FlexBox>

        <FlexBox direction="Column" style={{ gap: '0.25rem', minWidth: '180px' }}>
          <Label>Tipo de Stock</Label>
          <Input
            placeholder="Ej: 01"
            value={filtroTipoStock}
            onInput={e => setFiltroTipoStock(e.target.value)}
          />
        </FlexBox>

        {/* Botones */}
        <FlexBox style={{ gap: '0.5rem' }}>
          <Button
            design="Emphasized"
            icon="search"
            onClick={handleBuscar}
            disabled={estadoBusqueda === 'cargando'}
          >
            Buscar
          </Button>
          <Button
            design="Default"
            icon="clear-all"
            onClick={handleLimpiar}
            disabled={estadoBusqueda === 'cargando'}
          >
            Limpiar
          </Button>
        </FlexBox>
      </FlexBox>

      {/* Estado: error */}
      {estadoBusqueda === 'error' && (
        <MessageStrip design="Negative" hideCloseButton>
          {mensajeError}
        </MessageStrip>
      )}

      {/* Estado: cargando */}
      {estadoBusqueda === 'cargando' && (
        <FlexBox justifyContent="Center" style={{ padding: '3rem' }}>
          <BusyIndicator active />
        </FlexBox>
      )}

      {/* Estado: inicial */}
      {estadoBusqueda === 'inicial' && (
        <FlexBox
          justifyContent="Center"
          alignItems="Center"
          style={{
            flex: 1,
            padding: '3rem',
            color: '#6a6d70',
            fontSize: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            background: '#fafafa',
          }}
        >
          Para comenzar, ingrese al menos un filtro y presione Buscar.
        </FlexBox>
      )}

      {/* Estado: sin resultados */}
      {estadoBusqueda === 'sin-resultados' && (
        <FlexBox
          justifyContent="Center"
          alignItems="Center"
          style={{
            flex: 1,
            padding: '3rem',
            color: '#6a6d70',
            fontSize: '0.9rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            background: '#fafafa',
          }}
        >
          No se encontraron registros. Intente ajustar los filtros.
        </FlexBox>
      )}

      {/* Estado: con resultados — tabla */}
      {estadoBusqueda === 'con-resultados' && (
        <FlexBox direction="Column" style={{ gap: '0.5rem', flex: 1 }}>
          <Title level="H5">Materiales ({registros.length})</Title>

          <Table
            headerRow={
              <TableHeaderRow>
                <TableHeaderCell>Material</TableHeaderCell>
                <TableHeaderCell>Centro</TableHeaderCell>
                <TableHeaderCell>Almacén</TableHeaderCell>
                <TableHeaderCell>Lote</TableHeaderCell>
                <TableHeaderCell>Tipo Stock</TableHeaderCell>
                <TableHeaderCell>Cantidad</TableHeaderCell>
                <TableHeaderCell>Unidad</TableHeaderCell>
              </TableHeaderRow>
            }
          >
            {registros.map((registro, index) => (
              <TableRow key={index}>
                <TableCell>{registro.Material}</TableCell>
                <TableCell>{registro.Plant}</TableCell>
                <TableCell>{registro.StorageLocation}</TableCell>
                <TableCell>{registro.Batch || '—'}</TableCell>
                <TableCell>{registro.InventoryStockType}</TableCell>
                <TableCell>
                  {Number(registro.MatlWrhsStkQtyInMatlBaseUnit).toLocaleString('es-CL')}
                </TableCell>
                <TableCell>{registro.MaterialBaseUnit}</TableCell>
              </TableRow>
            ))}
          </Table>
        </FlexBox>
      )}

    </FlexBox>
  )
}