import { useState } from 'react'
import { Dialog, FlexBox, Label, Input, Select, Option, Button, Bar, MessageStrip } from '@ui5/webcomponents-react'

export interface IPersonaRetira {
  tratamiento: string
  rut: string
  nombre1: string
  telefono: string
}

interface Props {
  open: boolean
  onGuardar: (p: IPersonaRetira) => void
  onCancelar: () => void
}

export function PersonaRetiraDialog({ open, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<IPersonaRetira>({ tratamiento: 'Señor', rut: '', nombre1: '', telefono: '' })
  const [error, setError] = useState<string | null>(null)

  const handleGuardar = () => {
    if (!form.rut || !form.nombre1) { setError('Complete los campos obligatorios (*)'); return }
    onGuardar(form)
    setForm({ tratamiento: 'Señor', rut: '', nombre1: '', telefono: '' })
    setError(null)
  }

  const handleCerrar = () => {
    setForm({ tratamiento: 'Señor', rut: '', nombre1: '', telefono: '' })
    setError(null)
    onCancelar()
  }

  const u = (field: keyof IPersonaRetira, val: string) => setForm(p => ({ ...p, [field]: val }))

  return (
    <Dialog open={open} headerText="Creación Persona Retira" style={{ width: '400px' }}
      footer={<Bar endContent={<FlexBox style={{ gap: '0.5rem' }}><Button design="Transparent" onClick={handleCerrar}>Cancelar</Button><Button design="Emphasized" onClick={handleGuardar}>Crear</Button></FlexBox>} />}>
      <div style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        {error && <MessageStrip design="Negative" hideCloseButton>{error}</MessageStrip>}
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '110px', color: 'var(--sapNegativeColor)' }}>* Tratamiento:</Label>
          <Select onChange={(e) => u('tratamiento', (e.detail?.selectedOption as any)?.dataset?.value ?? 'Señor')} style={{ flex: 1 }}>
            <Option data-value="Señora">Señora</Option>
            <Option data-value="Señor" selected>Señor</Option>
            <Option data-value="Empresa">Empresa</Option>
          </Select>
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '110px', color: 'var(--sapNegativeColor)' }}>* RUT:</Label>
          <Input value={form.rut} onInput={(e) => u('rut', (e.target as any).value)} style={{ flex: 1 }} placeholder="Ej: 11.544.836" />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '110px', color: 'var(--sapNegativeColor)' }}>* Nombre 1:</Label>
          <Input value={form.nombre1} onInput={(e) => u('nombre1', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
        <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
          <Label style={{ width: '110px' }}>Teléfono:</Label>
          <Input value={form.telefono} onInput={(e) => u('telefono', (e.target as any).value)} style={{ flex: 1 }} />
        </FlexBox>
      </div>
    </Dialog>
  )
}