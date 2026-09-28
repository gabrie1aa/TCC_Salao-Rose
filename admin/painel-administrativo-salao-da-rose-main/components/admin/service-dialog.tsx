'use client'

import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from './modal'
import { Switch } from './switch'
import type { Service } from '@/lib/salon-types'

interface ServiceDialogProps {
  open: boolean
  onClose: () => void
  initial: Service | null
  onSave: (service: Service) => void
}

const empty = {
  name: '',
  description: '',
  durationMinutes: 30,
  price: 0,
  active: true,
  image: '' as string | undefined,
}

const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'
const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'

export function ServiceDialog({
  open,
  onClose,
  initial,
  onSave,
}: ServiceDialogProps) {
  const [form, setForm] = useState(empty)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              description: initial.description,
              durationMinutes: initial.durationMinutes,
              price: initial.price,
              active: initial.active,
              image: initial.image,
            }
          : empty,
      )
    }
  }, [open, initial])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      id: initial?.id ?? `svc-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      durationMinutes: Number(form.durationMinutes) || 0,
      price: Number(form.price) || 0,
      active: form.active,
      image: form.image,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Editar serviço' : 'Novo serviço'}
      description="Preencha os campos abaixo para cadastrar ou atualizar o serviço."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="svc-name">
            Nome do serviço <span className="text-primary">*</span>
          </label>
          <input
            id="svc-name"
            className={inputClass}
            placeholder="Ex: Corte feminino"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="svc-desc">
            Descrição
          </label>
          <textarea
            id="svc-desc"
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="Descreva o serviço oferecido..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="svc-duration">
              Duração (minutos) <span className="text-primary">*</span>
            </label>
            <input
              id="svc-duration"
              type="number"
              min={5}
              step={5}
              className={inputClass}
              placeholder="Ex: 45"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  durationMinutes: Number(e.target.value),
                }))
              }
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="svc-price">
              Valor (R$) <span className="text-primary">*</span>
            </label>
            <input
              id="svc-price"
              type="number"
              min={0}
              step={0.5}
              className={inputClass}
              placeholder="Ex: 60,00"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Imagem do serviço</label>
          <div className="flex items-center gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image || '/placeholder.svg'}
                  alt="Prévia do serviço"
                  className="size-full object-cover"
                />
              ) : (
                <ImagePlus className="size-5 text-muted-foreground" />
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => fileRef.current?.click()}
            >
              Selecionar imagem
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">
              Serviço ativo
            </p>
            <p className="text-xs text-muted-foreground">
              Serviços ativos ficam disponíveis para agendamento.
            </p>
          </div>
          <Switch
            checked={form.active}
            onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            label="Serviço ativo"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="lg">
            Salvar serviço
          </Button>
        </div>
      </form>
    </Modal>
  )
}
