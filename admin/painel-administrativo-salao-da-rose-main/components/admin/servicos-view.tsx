'use client'

import { useState, useEffect } from 'react'
import { Pencil, Plus, Scissors, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDuration } from '@/lib/format'
import type { Service } from '@/lib/salon-types'
import { ServiceDialog } from './service-dialog'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export function ServicosView() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  // Função para buscar os serviços do Supabase
  async function fetchServices() {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar serviços:', error)
    } else if (data) {
      const formatted: Service[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        durationMinutes: item.duration_min,
        active: item.status === 'Ativo',
      }))
      setServices(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(service: Service) {
    setEditing(service)
    setDialogOpen(true)
  }

  // Função para salvar (criar ou editar) no Supabase
  async function handleSave(service: Service) {
    const payload = {
      id: service.id || service.name.toLowerCase().replace(/\s+/g, '-'),
      name: service.name,
      description: service.description,
      price: service.price,
      duration_min: service.durationMinutes,
      status: service.active ? 'Ativo' : 'Inativo',
    }

    const { error } = await supabase.from('services').upsert([payload])

    if (error) {
      console.error('Erro ao salvar serviço:', error)
      alert('Erro ao salvar serviço.')
    } else {
      fetchServices() // Recarrega a lista do banco
    }
  }

  // Função para excluir no Supabase
  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return

    const { error } = await supabase.from('services').delete().eq('id', id)

    if (error) {
      console.error('Erro ao excluir serviço:', error)
      alert('Erro ao excluir serviço.')
    } else {
      setServices((prev) => prev.filter((s) => s.id !== id))
    }
  }

  // Função para alternar o status ativo/inativo no Supabase
  async function toggleActive(id: string) {
    const service = services.find((s) => s.id === id)
    if (!service) return

    const newActiveState = !service.active
    const newStatus = newActiveState ? 'Ativo' : 'Inativo'

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: newActiveState } : s)),
    )

    await supabase
      .from('services')
      .update({ status: newStatus })
      .eq('id', id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Serviços
          </h2>
          <p className="text-sm text-muted-foreground">
            Cadastre e gerencie os serviços oferecidos pelo salão.
          </p>
        </div>
        <Button size="lg" onClick={openNew}>
          <Plus className="size-4" />
          Novo serviço
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Carregando serviços...
        </div>
      ) : (
        <>
          {/* Table (desktop) */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Serviço</th>
                  <th className="px-4 py-3 font-medium">Duração</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{service.name}</p>
                      <p className="max-w-md text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDuration(service.durationMinutes)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatCurrency(service.price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        active={service.active}
                        onClick={() => toggleActive(service.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Editar ${service.name}`}
                          onClick={() => openEdit(service)}
                          className="rounded-lg border border-border bg-background p-2 text-primary transition-colors hover:bg-secondary"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Excluir ${service.name}`}
                          onClick={() => handleDelete(service.id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Scissors className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {formatDuration(service.durationMinutes)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <StatusPill
                    active={service.active}
                    onClick={() => toggleActive(service.id)}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => openEdit(service)}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ServiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  )
}

function StatusPill({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-stone-200 bg-stone-100 text-stone-500',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          active ? 'bg-emerald-500' : 'bg-stone-400',
        )}
      />
      {active ? 'Ativo' : 'Inativo'}
    </button>
  )
}