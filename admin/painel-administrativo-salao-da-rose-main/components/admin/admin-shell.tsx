'use client'

import { useState } from 'react'
import {
  initialAppointments,
  initialBlockedDates,
  initialSchedule,
  initialServices,
} from '@/lib/mock-data'
import type {
  Appointment,
  BlockedDate,
  DaySchedule,
  Service,
} from '@/lib/salon-types'
import { AgendaView } from './agenda-view'
import { HorariosView } from './horarios-view'
import { NAV_ITEMS, type TabKey } from './nav'
import { ResumoView } from './resumo-view'
import { ServicosView } from './servicos-view'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { cn } from '@/lib/utils'

const SUBTITLES: Record<TabKey, string> = {
  agenda: 'Acompanhe e gerencie os agendamentos do salão.',
  servicos: 'Cadastre e gerencie os serviços oferecidos.',
  horarios: 'Configure o funcionamento e as folgas.',
  resumo: 'Métricas e desempenho do salão.',
}

export function AdminShell() {
  const [tab, setTab] = useState<TabKey>('agenda')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const [services, setServices] = useState<Service[]>(initialServices)
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments)
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule)
  const [blockedDates, setBlockedDates] =
    useState<BlockedDate[]>(initialBlockedDates)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        active={tab}
        onSelect={setTab}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title="Salão da Rose"
          subtitle={SUBTITLES[tab]}
          isOpen={isOpen}
          onToggleOpen={() => setIsOpen((v) => !v)}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 px-4 py-5 pb-24 sm:px-6 lg:pb-6">
          {tab === 'agenda' ? (
            <AgendaView
              appointments={appointments}
              setAppointments={setAppointments}
            />
          ) : null}
          {tab === 'servicos' ? (
            <ServicosView services={services} setServices={setServices} />
          ) : null}
          {tab === 'horarios' ? (
            <HorariosView
              schedule={schedule}
              setSchedule={setSchedule}
              blockedDates={blockedDates}
              setBlockedDates={setBlockedDates}
            />
          ) : null}
          {tab === 'resumo' ? <ResumoView appointments={appointments} /> : null}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = item.key === tab
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-5" />
              {item.label.split(' ')[0]}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
