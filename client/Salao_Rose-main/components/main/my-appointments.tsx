'use client'

import { ArrowLeft, CalendarDays, Clock, CreditCard, User } from 'lucide-react'
import type { Appointment } from '@/lib/salon-data'

type Props = {
  appointments: Appointment[]
  onBack: () => void
}

export function MyAppointments({ appointments, onBack }: Props) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="flex size-9 items-center justify-center rounded-full bg-white/15"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="font-display text-lg font-semibold">Meus agendamentos</h1>
      </header>

      <div className="mx-auto max-w-md px-4 py-5">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <CalendarDays className="size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Você ainda não tem agendamentos.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-card-foreground">
                    {a.serviceName}
                  </h2>
                  <span className="font-semibold text-salon-green-dark">
                    R$ {a.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    {a.dateLabel} às {a.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    {a.professional}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard className="size-4 text-primary" />
                    {a.payment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
