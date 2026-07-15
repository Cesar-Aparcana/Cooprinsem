import { useState, useEffect, useCallback } from 'react'
import {
  Title,
  Button,
  Input,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  Dialog,
  Label,
  Select,
  Option,
  MessageStrip,
  BusyIndicator,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/edit.js'
import '@ui5/webcomponents-icons/dist/delete.js'
import type { InputDomRef } from '@ui5/webcomponents-react'
import {
  getDocumentosVenta, createDocumentoVenta, updateDocumentoVenta, deleteDocumentoVenta,
  getOficinasVenta, createOficinaVenta, updateOficinaVenta, deleteOficinaVenta,
  getCentrosSuministrador, createCentroSuministrador, updateCentroSuministrador, deleteCentroSuministrador,
  getCanalesDistribucion, createCanalDistribucion, updateCanalDistribucion, deleteCanalDistribucion,
  type IDocumentoVenta, type IOficinaVenta, type ICentroSuministrador, type ICanalDistribucion,
} from '@/services/api/posMaestros'

type SubTab = 'documentos' | 'oficinas' | 'centros' | 'canales'

export function PosMaestrosPanel() {
  const [subTab, setSubTab] = useState<SubTab>('documentos')

  return (
    <div>
      <Title level="H3" style={{ marginBottom: '1rem' }}>Maestros POS</Title>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <Button design={subTab === 'documentos' ? 'Emphasized' : 'Default'} onClick={() => setSubTab('documentos')}>Documentos de Venta</Button>
        <Button design={subTab === 'oficinas' ? 'Emphasized' : 'Default'} onClick={() => setSubTab('oficinas')}>Oficinas de Ventas</Button>
        <Button design={subTab === 'centros' ? 'Emphasized' : 'Default'} onClick={() => setSubTab('centros')}>Centros Suministrador</Button>
        <Button design={subTab === 'canales' ? 'Emphasized' : 'Default'} onClick={() => setSubTab('canales')}>Canal Distribución</Button>
      </div>
      {subTab === 'documentos' && <DocumentosVentaTab />}
      {subTab === 'oficinas' && <OficinasVentaTab />}
      {subTab === 'centros' && <CentrosSuministradorTab />}
      {subTab === 'canales' && <CanalesDistribucionTab />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTOS DE VENTA
// ═══════════════════════════════════════════════════════════════════════════════

function DocumentosVentaTab() {
  const [datos, setDatos] = useState<IDocumentoVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<IDocumentoVenta | null>(null)

  // Form fields
  const [fClase, setFClase] = useState('')
  const [fDesc, setFDesc] = useState('')
  const [fTipo, setFTipo] = useState('C')
  const [fTipoDesc, setFTipoDesc] = useState('Pedido')
  const [fApi, setFApi] = useState('API_SALES_ORDER_SRV')
  const [formError, setFormError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      setDatos(await getDocumentosVenta())
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleNuevo = () => {
    setEditando(null); setFClase(''); setFDesc(''); setFTipo('C'); setFTipoDesc('Pedido'); setFApi('API_SALES_ORDER_SRV'); setFormError(null)
    setShowModal(true)
  }

  const handleEditar = (item: IDocumentoVenta) => {
    setEditando(item); setFClase(item.clase_documento); setFDesc(item.descripcion); setFTipo(item.tipo_documento); setFTipoDesc(item.tipo_documento_desc); setFApi(item.api_relacionada); setFormError(null)
    setShowModal(true)
  }

  const handleEliminar = async (item: IDocumentoVenta) => {
    if (!confirm(`¿Eliminar ${item.clase_documento} - ${item.descripcion}?`)) return
    try {
      await deleteDocumentoVenta(item.id)
      cargar()
    } catch (e: any) { setError(e.message) }
  }

  const handleGuardar = async () => {
    if (!fClase.trim() || !fDesc.trim()) { setFormError('Clase y descripción son obligatorios'); return }
    try {
      const data = { clase_documento: fClase.trim(), descripcion: fDesc.trim(), tipo_documento: fTipo, tipo_documento_desc: fTipoDesc, api_relacionada: fApi }
      if (editando) {
        await updateDocumentoVenta(editando.id, data)
      } else {
        await createDocumentoVenta(data)
      }
      setShowModal(false)
      cargar()
    } catch (e: any) { setFormError(e.message) }
  }

  if (loading) return <BusyIndicator active size="M" />

  return (
    <div>
      {error && <MessageStrip design="Negative" hideCloseButton style={{ marginBottom: '1rem' }}>{error}</MessageStrip>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <Button icon="add" design="Emphasized" onClick={handleNuevo}>Nuevo Documento</Button>
      </div>
      <Table headerRow={<TableHeaderRow><TableHeaderCell>Clase Doc</TableHeaderCell><TableHeaderCell>Descripción</TableHeaderCell><TableHeaderCell>Tipo</TableHeaderCell><TableHeaderCell>Categoría</TableHeaderCell><TableHeaderCell>API Relacionada</TableHeaderCell><TableHeaderCell>Org. Ventas</TableHeaderCell><TableHeaderCell>Canal</TableHeaderCell><TableHeaderCell>Sector</TableHeaderCell><TableHeaderCell>Acciones</TableHeaderCell></TableHeaderRow>}>
        {datos.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.clase_documento}</TableCell>
            <TableCell>{d.descripcion}</TableCell>
            <TableCell>{d.tipo_documento}</TableCell>
            <TableCell>{d.tipo_documento_desc}</TableCell>
            <TableCell style={{ fontSize: '0.75rem' }}>{d.api_relacionada}</TableCell>
            <TableCell>{d.org_ventas}</TableCell>
            <TableCell>{d.canal_distribucion}</TableCell>
            <TableCell>{d.sector}</TableCell>
            <TableCell>
              <Button icon="edit" design="Transparent" onClick={() => handleEditar(d)} tooltip="Editar" />
              <Button icon="delete" design="Transparent" onClick={() => handleEliminar(d)} tooltip="Eliminar" />
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Dialog open={showModal} headerText={editando ? 'Editar Documento' : 'Nuevo Documento'} onClose={() => setShowModal(false)} style={{ width: '500px' }}
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '0.5rem' }}><Button design="Transparent" onClick={() => setShowModal(false)}>Cancelar</Button><Button design="Emphasized" onClick={handleGuardar}>Guardar</Button></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
          {formError && <MessageStrip design="Negative" hideCloseButton>{formError}</MessageStrip>}
          <div><Label>Clase Documento *</Label><Input value={fClase} onInput={(e) => setFClase((e.target as unknown as InputDomRef).value)} style={{ width: '100%' }} placeholder="ZV01" /></div>
          <div><Label>Descripción *</Label><Input value={fDesc} onInput={(e) => setFDesc((e.target as unknown as InputDomRef).value)} style={{ width: '100%' }} placeholder="Venta normal" /></div>
          <div><Label>Tipo Documento</Label>
            <Select value={fTipo} onChange={(e) => {
              const val = (e.detail?.selectedOption as HTMLElement)?.dataset?.id ?? 'C'
              setFTipo(val)
              const map: Record<string, string> = { B: 'Oferta', C: 'Pedido', H: 'Devolución', K: 'Abonos', L: 'Nota de cargo' }
              setFTipoDesc(map[val] ?? val)
              const apiMap: Record<string, string> = { B: 'API_SALES_QUOTATION_SRV', C: 'API_SALES_ORDER_SRV', H: 'API_CREDIT_MEMO_REQUEST_SRV', K: 'API_CREDIT_MEMO_REQUEST_SRV', L: 'API_DEBIT_MEMO_REQUEST_SRV' }
              setFApi(apiMap[val] ?? '')
            }} style={{ width: '100%' }}>
              <Option data-id="B" selected={fTipo === 'B'}>B — Oferta</Option>
              <Option data-id="C" selected={fTipo === 'C'}>C — Pedido</Option>
              <Option data-id="H" selected={fTipo === 'H'}>H — Devolución</Option>
              <Option data-id="K" selected={fTipo === 'K'}>K — Abonos</Option>
              <Option data-id="L" selected={fTipo === 'L'}>L — Nota de cargo</Option>
            </Select>
          </div>
          <div><Label>API Relacionada</Label><Input value={fApi} onInput={(e) => setFApi((e.target as unknown as InputDomRef).value)} style={{ width: '100%' }} /></div>
        </div>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFICINAS DE VENTAS (reutilizable con Centros)
// ═══════════════════════════════════════════════════════════════════════════════

function TablaCodigoNombre({
  titulo,
  getData,
  createData,
  updateData,
  deleteData,
}: {
  titulo: string
  getData: () => Promise<{ id: number; codigo: string; nombre: string; org_ventas: string; canal_distribucion: string; sector: string }[]>
  createData: (data: any) => Promise<any>
  updateData: (id: number, data: any) => Promise<any>
  deleteData: (id: number) => Promise<void>
}) {
  const [datos, setDatos] = useState<{ id: number; codigo: string; nombre: string; org_ventas: string; canal_distribucion: string; sector: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<any | null>(null)
  const [fCodigo, setFCodigo] = useState('')
  const [fNombre, setFNombre] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try { setDatos(await getData()); setError(null) } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }, [getData])

  useEffect(() => { cargar() }, [cargar])

  const handleNuevo = () => { setEditando(null); setFCodigo(''); setFNombre(''); setFormError(null); setShowModal(true) }
  const handleEditar = (item: any) => { setEditando(item); setFCodigo(item.codigo); setFNombre(item.nombre); setFormError(null); setShowModal(true) }
  const handleEliminar = async (item: any) => {
    if (!confirm(`¿Eliminar ${item.codigo} - ${item.nombre}?`)) return
    try { await deleteData(item.id); cargar() } catch (e: any) { setError(e.message) }
  }

  const handleGuardar = async () => {
    if (!fCodigo.trim() || !fNombre.trim()) { setFormError('Código y nombre son obligatorios'); return }
    try {
      const data = { codigo: fCodigo.trim(), nombre: fNombre.trim() }
      if (editando) { await updateData(editando.id, data) } else { await createData(data) }
      setShowModal(false); cargar()
    } catch (e: any) { setFormError(e.message) }
  }

  if (loading) return <BusyIndicator active size="M" />

  return (
    <div>
      {error && <MessageStrip design="Negative" hideCloseButton style={{ marginBottom: '1rem' }}>{error}</MessageStrip>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <Button icon="add" design="Emphasized" onClick={handleNuevo}>Nuevo</Button>
      </div>
      <Table headerRow={<TableHeaderRow><TableHeaderCell>Código</TableHeaderCell><TableHeaderCell>Nombre</TableHeaderCell><TableHeaderCell>Org. Ventas</TableHeaderCell><TableHeaderCell>Canal</TableHeaderCell><TableHeaderCell>Sector</TableHeaderCell><TableHeaderCell>Acciones</TableHeaderCell></TableHeaderRow>}>
        {datos.map((d) => (
          <TableRow key={d.id}>
            <TableCell>{d.codigo}</TableCell>
            <TableCell>{d.nombre}</TableCell>
            <TableCell>{d.org_ventas}</TableCell>
            <TableCell>{d.canal_distribucion}</TableCell>
            <TableCell>{d.sector}</TableCell>
            <TableCell>
              <Button icon="edit" design="Transparent" onClick={() => handleEditar(d)} tooltip="Editar" />
              <Button icon="delete" design="Transparent" onClick={() => handleEliminar(d)} tooltip="Eliminar" />
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Dialog open={showModal} headerText={editando ? `Editar ${titulo}` : `Nuevo ${titulo}`} onClose={() => setShowModal(false)} style={{ width: '400px' }}
        footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '0.5rem' }}><Button design="Transparent" onClick={() => setShowModal(false)}>Cancelar</Button><Button design="Emphasized" onClick={handleGuardar}>Guardar</Button></div>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
          {formError && <MessageStrip design="Negative" hideCloseButton>{formError}</MessageStrip>}
          <div><Label>Código *</Label><Input value={fCodigo} onInput={(e) => setFCodigo((e.target as unknown as InputDomRef).value)} style={{ width: '100%' }} placeholder="D190" /></div>
          <div><Label>Nombre *</Label><Input value={fNombre} onInput={(e) => setFNombre((e.target as unknown as InputDomRef).value)} style={{ width: '100%' }} placeholder="Osorno" /></div>
        </div>
      </Dialog>
    </div>
  )
}

function OficinasVentaTab() {
  return <TablaCodigoNombre titulo="Oficina" getData={getOficinasVenta} createData={createOficinaVenta} updateData={updateOficinaVenta} deleteData={deleteOficinaVenta} />
}

function CentrosSuministradorTab() {
  return <TablaCodigoNombre titulo="Centro" getData={getCentrosSuministrador} createData={createCentroSuministrador} updateData={updateCentroSuministrador} deleteData={deleteCentroSuministrador} />
}

function CanalesDistribucionTab() {
  return <TablaCodigoNombre
    titulo="Canal"
    getData={async () => {
      const data = await getCanalesDistribucion()
      return data.map(d => ({ id: d.id, codigo: d.codigo, nombre: d.descripcion, org_ventas: '', canal_distribucion: '', sector: '' }))
    }}
    createData={(data: any) => createCanalDistribucion({ codigo: data.codigo, descripcion: data.nombre })}
    updateData={(id: number, data: any) => updateCanalDistribucion(id, { codigo: data.codigo, descripcion: data.nombre })}
    deleteData={deleteCanalDistribucion}
  />
}
