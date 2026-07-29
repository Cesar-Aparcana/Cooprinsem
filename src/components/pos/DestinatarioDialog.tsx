import { useState } from 'react'
import { Dialog, FlexBox, Label, Input, Select, Option, Button, Bar, MessageStrip } from '@ui5/webcomponents-react'
import type { ISapRegion } from '@/types/sapMaestro'

export interface IDestinatario {
  tratamiento: string
  rut: string
  nombre1: string
  nombre2: string
  direccion: string
  region: string
  comuna: string
  ciudad: string
  zonaTransporte: string
  correo: string
}

interface Props {
  open: boolean
  onGuardar: (d: IDestinatario) => void
  onCancelar: () => void
  regiones: ISapRegion[]
}

export function DestinatarioDialog({ open, onGuardar, onCancelar, regiones }: Props) {
  const [form, setForm] = useState<IDestinatario>({
    tratamiento: 'Señor', rut: '', nombre1: '', nombre2: '', direccion: '',
    region: '', comuna: '', ciudad: '', zonaTransporte: 'TIENDA', correo: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleGuardar = () => {
    if (!form.rut || !form.nombre1 || !form.region || !form.comuna || !form.ciudad || !form.zonaTransporte) {
      setError('Complete los campos obligatorios (*)'); return
    }
    onGuardar(form)
    setForm({ tratamiento: 'Señor', rut: '', nombre1: '', nombre2: '', direccion: '', region: '', comuna: '', ciudad: '', zonaTransporte: 'TIENDA', correo: '' })
    setError(null)
  }

  const handleCerrar = () => {
    setForm({ tratamiento: 'Señor', rut: '', nombre1: '', nombre2: '', direccion: '', region: '', comuna: '', ciudad: '', zonaTransporte: 'TIENDA', correo: '' })
    setError(null)
    onCancelar()
  }

  const u = (field: keyof IDestinatario, val: string) => setForm(p => ({ ...p, [field]: val }))

  return (
    <Dialog open={open} headerText="Creación destinatario de mercancía" style={{ width: '500px' }}
      footer={<Bar endContent={<FlexBox style={{ gap: '0.5rem' }}><Button design="Transparent" onClick={handleCerrar}>Cancelar</Button><Button design="Emphasized" onClick={handleGuardar}>Crear</Button></FlexBox>} />}>
      <div style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        {error && <MessageStrip design="Negative" hideCloseButton>{error}</MessageStrip>}
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Tratamiento:</Label>
          <Select onChange={(e) => u('tratamiento', (e.detail?.selectedOption as any)?.dataset?.value ?? 'Señor')} style={{ flex: 1 }}>
            <Option data-value="Señora">Señora</Option>
            <Option data-value="Señor" selected>Señor</Option>
            <Option data-value="Empresa">Empresa</Option>
          </Select>
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* RUT:</Label>
          <Input value={form.rut} onInput={(e) => u('rut', (e.target as any).value)} style={{ flex: 1 }} placeholder="Ej: 12.345.678-9" />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Nombre 1:</Label>
          <Input value={form.nombre1} onInput={(e) => u('nombre1', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px' }}>Nombre 2:</Label>
          <Input value={form.nombre2} onInput={(e) => u('nombre2', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px' }}>Dirección:</Label>
          <Input value={form.direccion} onInput={(e) => u('direccion', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Región:</Label>
          <Select onChange={(e) => u('region', (e.detail?.selectedOption as any)?.dataset?.value ?? '')} style={{ flex: 1 }}>
            <Option data-value="">Seleccione...</Option>
            {regiones.map(r => <Option key={r.Codigo} data-value={r.Codigo} selected={form.region === r.Codigo}>{r.Descripcion}</Option>)}
          </Select>
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Comuna:</Label>
          <Input value={form.comuna} onInput={(e) => u('comuna', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Ciudad:</Label>
          <Input value={form.ciudad} onInput={(e) => u('ciudad', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px', color: 'var(--sapNegativeColor)' }}>* Zona transporte:</Label>
          <Input value={form.zonaTransporte} onInput={(e) => u('zonaTransporte', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '130px' }}>Correo:</Label>
          <Input value={form.correo} onInput={(e) => u('correo', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
      </div>
    </Dialog>
  )
}