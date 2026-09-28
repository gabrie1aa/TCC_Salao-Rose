'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Phone,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatCurrency,
  formatDateLong,
  formatDateShort,
  statusMeta,
} from '@/lib/format'
import { TODAY } from '@/lib/mock-data'
import type { Appointment, AppointmentStatus } from '@/lib/salon-types'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const STATUS_FILTERS: { key: AppointmentStatus | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'concluido', label: 'Concluídos' },
  { key: 'cancelado', label: 'Cancelados' },
]

const STATUS_ORDER: AppointmentStatus[] = [
  'pendente',
  'confirmado',
  'concluido',
  'cancelado',
]

function shiftDate(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'todos'>(
    'todos',
  )
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  // Função para buscar os agendamentos direto do Supabase
  async function fetchAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('time', { ascending: true })

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
    } else if (data) {
      const formatted: Appointment[] = data.map((item: any) => ({
        id: item.id,
        serviceId: item.service_id,
        serviceName: item.service_name,
        clientName: item.client_name,
        phone: item.client_phone,
        date: item.date_key,
        time: item.time,
        status: item.status.toLowerCase() as AppointmentStatus,
        price: Number(item.price),
        payment: item.payment,
        professional: item.professional,
      }))
      setAppointments(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Função para atualizar o status no Supabase e na tela
  async function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    )

    const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1)
    await supabase
      .from('appointments')
      .update({ status: statusCapitalized })
      .eq('id', id)
  }

  function cancelAppointment(id: string) {
    updateStatus(id, 'cancelado')
  }

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === selectedDate)
      .filter((a) => statusFilter === 'todos' || a.status === statusFilter)
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [appointments, selectedDate, statusFilter])

  const dayTotal = useMemo(
    () =>
      dayAppointments
        .filter((a) => a.status !== 'cancelado')
        .reduce((sum, a) => sum + a.price, 0),
    [dayAppointments],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Agenda
          </h2>
          <p className="text-sm capitalize text-muted-foreground">
            {formatDateLong(selectedDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Dia anterior"
            onClick={() => setSelectedDate((d) => shiftDate(d, -1))}
            className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>
          <Button
            variant={selectedDate === TODAY ? 'default' : 'outline'}
            size="lg"
            onClick={() => setSelectedDate(TODAY)}
          >
            Hoje
          </Button>
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Selecionar data"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="rounded-lg border border-input bg-card px-3.5 py-2 text-sm font-medium text-foreground flex items-center gap-2 pointer-events-none">
              <span>{formatDateShort(selectedDate)}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Próximo dia"
            onClick={() => setSelectedDate((d) => shiftDate(d, 1))}
            className="rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <span className="text-muted-foreground">
          <strong className="font-semibold text-foreground">
            {dayAppointments.length}
          </strong>{' '}
          agendamento(s)
        </span>
        <span className="hidden text-border sm:inline">|</span>
        <span className="text-muted-foreground">
          Faturamento previsto:{' '}
          <strong className="font-semibold text-primary">
            {formatCurrency(dayTotal)}
          </strong>
        </span>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setStatusFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              statusFilter === f.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-muted',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Carregando agendamentos...
        </div>
      ) : dayAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <CalendarX2 className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">
            Nenhum agendamento
          </p>
          <p className="text-sm text-muted-foreground">
            Não há agendamentos para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {dayAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onChangeStatus={updateStatus}
              onCancel={cancelAppointment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AppointmentCard({
  appointment,
  onChangeStatus,
  onCancel,
}: {
  appointment: Appointment
  onChangeStatus: (id: string, status: AppointmentStatus) => void
  onCancel: (id: string) => void
}) {
  const meta = statusMeta[appointment.status]
  const isCancelled = appointment.status === 'cancelado'
  const waLink = `https://wa.me/${appointment.phone}?text=${encodeURIComponent(
    `Olá ${appointment.clientName}! Tudo bem? Sobre o seu horário no Salão da Rose às ${appointment.time}...`,
  )}`

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 transition-colors',
        isCancelled ? 'border-rose-200 opacity-80' : 'border-border',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center rounded-lg bg-secondary px-3 py-2 text-primary">
            <Clock className="size-4" />
            <span className="mt-1 text-sm font-semibold">
              {appointment.time}
            </span>
          </div>
          <div>
            <p
              className={cn(
                'font-medium text-foreground',
                isCancelled && 'line-through',
              )}
            >
              {appointment.clientName}
            </p>
            <p className="text-sm text-muted-foreground">
              {appointment.serviceName}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" />
              {appointment.phone.replace(/^55/, '')}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
              meta.badge,
            )}
          >
            <span className={cn('size-1.5 rounded-full', meta.dot)} />
            {meta.label}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(appointment.price)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <label className="sr-only" htmlFor={`status-${appointment.id}`}>
          Alterar status
        </label>
        <select
          id={`status-${appointment.id}`}
          value={appointment.status}
          onChange={(e) =>
            onChangeStatus(
              appointment.id,
              e.target.value as AppointmentStatus,
            )
          }
          className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {statusMeta[s].label}
            </option>
          ))}
        </select>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>

        {!isCancelled ? (
          <button
            type="button"
            onClick={() => onCancel(appointment.id)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
          >
            <XCircle className="size-4" />
            Cancelar
          </button>
        ) : null}
      </div>
    </div>
  )
}