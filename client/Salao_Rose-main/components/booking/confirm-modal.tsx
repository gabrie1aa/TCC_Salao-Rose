'use client'

import { CheckCircle, X } from 'lucide-react'
import { salonConfig } from '@/lib/salon-data'

type Props = {
  serviceName: string
  price: number
  dateLabel: string
  time: string
  payment: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  serviceName,
  price,
  dateLabel,
  time,
  payment,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
          <h3 className="font-display text-lg font-semibold">Confirme seu Agendamento</h3>
          <button onClick={onCancel} aria-label="Fechar">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <Row label="Serviço" value={serviceName} />
          <Row label="Data e horário" value={`${dateLabel} às ${time}`} />
          <div className="flex gap-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Valor total
              </p>
              <p className="mt-0.5 font-semibold text-salon-green-dark">
                R$ {price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pagamento
              </p>
              <p className="mt-0.5 font-medium text-card-foreground">{payment}</p>
            </div>
          </div>
          <Row label="Profissional" value={salonConfig.professional} />

          <div className="mt-2 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
            >
              Voltar
            </button>
            <button
              onClick={onConfirm}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <CheckCircle className="size-4" />
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-card-foreground">{value}</p>
    </div>
  )
}
