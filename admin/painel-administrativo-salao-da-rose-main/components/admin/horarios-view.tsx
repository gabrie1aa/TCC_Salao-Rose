'use client'

import { useState, useEffect } from 'react'
import { CalendarPlus, Info, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDateShort } from '@/lib/format'
import type { BlockedDate, DaySchedule } from '@/lib/salon-types'
import { Modal } from './modal'
import { Switch } from './switch'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface HorariosViewProps {
  schedule: DaySchedule[]
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>
  blockedDates: BlockedDate[]
  setBlockedDates: React.Dispatch<React.SetStateAction<BlockedDate[]>>
}

const timeInputClass =
  'rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-40'

export function HorariosView({
  schedule,
  setSchedule,
  blockedDates,
  setBlockedDates,
}: HorariosViewProps) {
  const [blockOpen, setBlockOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')

  // Busca o funcionamento e as datas bloqueadas do Supabase ao carregar
  useEffect(() => {
    async function fetchSettings() {
      // 1. Buscar Horários de Funcionamento
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('salon_schedule')
        .select('*')

      if (!scheduleError && scheduleData && scheduleData.length > 0) {
        setSchedule((prev) =>
          prev.map((day) => {
            const found = scheduleData.find((s: any) => s.day_key === day.key)
            if (found) {
              return {
                ...day,
                open: found.is_open,
                start: found.start_time,
                end: found.end_time,
                hasBreak: found.has_break,
                breakStart: found.break_start,
                breakEnd: found.break_end,
              }
            }
            return day
          })
        )
      }

      // 2. Buscar Datas Bloqueadas
      const { data: blockedData, error: blockedError } = await supabase
        .from('salon_blocked_dates')
        .select('*')
        .order('date_key', { ascending: true })

      if (!blockedError && blockedData) {
        const formatted: BlockedDate[] = blockedData.map((item: any) => ({
          id: item.id,
          date: item.date_key,
          reason: item.reason || 'Folga',
        }))
        setBlockedDates(formatted)
      }
    }

    fetchSettings()
  }, [setSchedule, setBlockedDates])

  function patchDay(key: string, patch: Partial<DaySchedule>) {
    setSchedule((prev) =>
      prev.map((d) => (d.key === key ? { ...d, ...patch } : d)),
    )
  }

  // Salva os horários de funcionamento no Supabase com rastreio de erro
  async function handleSaveSchedule() {
    // 1. Tenta apagar os horários antigos
    const { error: deleteError } = await supabase
      .from('salon_schedule')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('Erro detalhado no delete:', deleteError)
      alert('Erro ao limpar horários antigos: ' + deleteError.message)
      return
    }

    // 2. Prepara os dados atuais da tela
    const payload = schedule.map((day) => ({
      day_key: day.key,
      label: day.label,
      is_open: day.open,
      start_time: day.start,
      end_time: day.end,
      has_break: day.hasBreak,
      break_start: day.breakStart,
      break_end: day.breakEnd,
    }))

    // 3. Insere os novos dados
    const { error: insertError } = await supabase.from('salon_schedule').insert(payload)

    if (insertError) {
      console.error('Erro detalhado no insert:', insertError)
      alert('Erro ao inserir horários: ' + insertError.message)
      return
    }

    alert('Horários de funcionamento salvos com sucesso!')
  }

  async function addBlocked(e: React.FormEvent) {
    e.preventDefault()
    if (!newDate) return

    const reasonText = newReason.trim() || 'Folga'

    const { data, error } = await supabase
      .from('salon_blocked_dates')
      .insert([{ date_key: newDate, reason: reasonText }])
      .select()

    if (error) {
      console.error('Erro ao bloquear data:', error)
      alert('Erro ao bloquear data. Verifique se já não está bloqueada.')
      return
    }

    if (data && data[0]) {
      setBlockedDates((prev) =>
        [
          ...prev,
          { id: data[0].id, date: data[0].date_key, reason: data[0].reason },
        ].sort((a, b) => a.date.localeCompare(b.date)),
      )
    }

    setNewDate('')
    setNewReason('')
    setBlockOpen(false)
    alert('Data bloqueada com sucesso!')
  }

  async function removeBlocked(id: string) {
    const { error } = await supabase
      .from('salon_blocked_dates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao remover bloqueio:', error)
      alert('Erro ao remover bloqueio.')
      return
    }

    setBlockedDates((prev) => prev.filter((b) => b.id !== id))
    alert('Bloqueio removido com sucesso!')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Horários & Folgas
        </h2>
        <p className="text-sm text-muted-foreground">
          Defina o funcionamento semanal, pausas e datas bloqueadas para
          agendamento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Working hours */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Horário de funcionamento
            </h3>
            <div className="mt-4 space-y-2">
              {schedule.map((day) => (
                <div
                  key={day.key}
                  className={cn(
                    'rounded-lg border p-3 transition-colors',
                    day.open
                      ? 'border-border bg-background'
                      : 'border-dashed border-border bg-muted/40',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={day.open}
                        onChange={(v) => patchDay(day.key, { open: v })}
                        label={`Abrir ${day.label}`}
                      />
                      <span className="w-20 text-sm font-medium text-foreground">
                        {day.label}
                      </span>
                    </div>
                    {day.open ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) =>
                            patchDay(day.key, { start: e.target.value })
                          }
                          className={timeInputClass}
                          aria-label={`Abertura ${day.label}`}
                        />
                        <span className="text-muted-foreground">—</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) =>
                            patchDay(day.key, { end: e.target.value })
                          }
                          className={timeInputClass}
                          aria-label={`Fechamento ${day.label}`}
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        Fechado
                      </span>
                    )}
                  </div>

                  {day.open ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={day.hasBreak}
                          onChange={(v) => patchDay(day.key, { hasBreak: v })}
                          label={`Pausa ${day.label}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          Pausa / almoço
                        </span>
                      </div>
                      {day.hasBreak ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={day.breakStart}
                            onChange={(e) =>
                              patchDay(day.key, { breakStart: e.target.value })
                            }
                            className={timeInputClass}
                            aria-label={`Início da pausa ${day.label}`}
                          />
                          <span className="text-muted-foreground">—</span>
                          <input
                            type="time"
                            value={day.breakEnd}
                            onChange={(e) =>
                              patchDay(day.key, { breakEnd: e.target.value })
                            }
                            className={timeInputClass}
                            aria-label={`Fim da pausa ${day.label}`}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="lg" onClick={handleSaveSchedule}>
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>

        {/* Blocked dates */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold text-foreground">
                Datas bloqueadas
              </h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Nesses dias, os clientes não poderão agendar.
            </p>
            <Button
              size="lg"
              className="mt-3 w-full"
              onClick={() => setBlockOpen(true)}
            >
              <CalendarPlus className="size-4" />
              Bloquear uma data
            </Button>

            <div className="mt-4 space-y-2">
              {blockedDates.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                  Nenhuma data bloqueada.
                </p>
              ) : (
                blockedDates.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDateShort(b.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">{b.reason}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remover bloqueio"
                      onClick={() => removeBlocked(b.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-secondary p-4 text-primary">
            <div className="flex items-center gap-2">
              <Info className="size-4" />
              <h4 className="font-heading text-sm font-semibold">
                Como funciona
              </h4>
            </div>
            <p className="mt-2 text-sm text-primary/80">
              As configurações desta tela afetam diretamente o agendamento. Os
              clientes só conseguem marcar horários dentro do funcionamento e
              fora das datas bloqueadas.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Bloquear data"
        description="Selecione um dia em que o salão não estará disponível."
        className="max-w-md"
      >
        <form onSubmit={addBlocked} className="space-y-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-foreground"
              htmlFor="block-date"
            >
              Data <span className="text-primary">*</span>
            </label>
            <input
              id="block-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-foreground"
              htmlFor="block-reason"
            >
              Motivo
            </label>
            <input
              id="block-reason"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Ex: Feriado, férias, evento..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setBlockOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg">
              Bloquear data
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}