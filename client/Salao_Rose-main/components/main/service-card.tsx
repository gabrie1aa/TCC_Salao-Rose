'use client'

import Image from 'next/image'
import { CalendarCheck, Check } from 'lucide-react'
import type { Service } from '@/lib/salon-data'

type Props = {
  service: Service
  selected: boolean
  onToggle: () => void
}

export function ServiceCard({ service, selected, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={service.image || '/placeholder.svg'}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-sm font-semibold text-card-foreground">
          {service.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          R$ {service.price.toFixed(2).replace('.', ',')} · {service.durationMin}mins
        </p>
      </div>

      <button
        onClick={onToggle}
        aria-pressed={selected}
        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-salon-green text-salon-green-foreground hover:bg-salon-green-dark'
        }`}
      >
        {selected ? (
          <>
            <Check className="size-3.5" />
            SELECIONADO
          </>
        ) : (
          <>
            <CalendarCheck className="size-3.5" />
            AGENDAR
          </>
        )}
      </button>
    </div>
  )
}
