'use client'

import { useMemo } from 'react'
import {
  CalendarCheck,
  Crown,
  DollarSign,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { formatCurrency, statusMeta } from '@/lib/format'
import { TODAY } from '@/lib/mock-data'
import type { Appointment, AppointmentStatus } from '@/lib/salon-types'
import { cn } from '@/lib/utils'

interface ResumoViewProps {
  appointments: Appointment[]
}

function withinWeek(iso: string) {
  const start = new Date(TODAY)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date >= start && date <= end
}

export function ResumoView({ appointments }: ResumoViewProps) {
  const stats = useMemo(() => {
    const today = appointments.filter((a) => a.date === TODAY)
    const week = appointments.filter(
      (a) => withinWeek(a.date) && a.status !== 'cancelado',
    )
    const weekRevenue = week.reduce((sum, a) => sum + a.price, 0)

    const counts = new Map<string, number>()
    for (const a of appointments) {
      if (a.status === 'cancelado') continue
      counts.set(a.serviceName, (counts.get(a.serviceName) ?? 0) + 1)
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const topService = top[0]?.[0] ?? '—'

    const statusCount = { confirmado: 0, pendente: 0, concluido: 0, cancelado: 0 } as Record<
      AppointmentStatus,
      number
    >
    for (const a of today) statusCount[a.status] += 1

    return {
      todayCount: today.length,
      weekRevenue,
      topService,
      topServices: top.slice(0, 5),
      statusCount,
    }
  }, [appointments])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Resumo geral
        </h2>
        <p className="text-sm text-muted-foreground">
          Um panorama rápido do movimento do salão.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={CalendarCheck}
          label="Agendamentos hoje"
          value={String(stats.todayCount)}
          hint="Total do dia (todos os status)"
        />
        <MetricCard
          icon={DollarSign}
          label="Faturamento da semana"
          value={formatCurrency(stats.weekRevenue)}
          hint="Estimativa (exclui cancelados)"
        />
        <MetricCard
          icon={Crown}
          label="Serviço mais procurado"
          value={stats.topService}
          hint="Baseado nos agendamentos"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Status breakdown */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Status de hoje
          </h3>
          <div className="mt-4 space-y-3">
            {(Object.keys(stats.statusCount) as AppointmentStatus[]).map(
              (status) => {
                const total = stats.todayCount || 1
                const value = stats.statusCount[status]
                const pct = Math.round((value / total) * 100)
                const meta = statusMeta[status]
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className={cn('size-2 rounded-full', meta.dot)} />
                        {meta.label}
                      </span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full', meta.dot)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* Top services */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h3 className="font-heading text-base font-semibold text-foreground">
              Serviços mais procurados
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {stats.topServices.map(([name, count], i) => {
              const max = stats.topServices[0]?.[1] || 1
              const pct = Math.round((count / max) * 100)
              return (
                <div key={name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      {name}
                    </span>
                    <span className="text-muted-foreground">{count}x</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="size-[18px]" />
        </div>
      </div>
      <p className="mt-3 font-heading text-2xl font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
