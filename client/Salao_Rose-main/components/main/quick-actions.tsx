'use client'

import { Clock, MapPin, Phone, Share2 } from 'lucide-react'
import { mapsUrl, salonConfig } from '@/lib/salon-data'
import { useToast } from '@/components/toast'

type Props = {
  onScheduleNow: () => void
}

export function QuickActions({ onScheduleNow }: Props) {
  const { showToast } = useToast()

  async function handleShare() {
    const shareData = {
      title: salonConfig.name,
      text: `Agende seus serviços no ${salonConfig.name} — ${salonConfig.city}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        showToast('Link copiado para a área de transferência!', 'success')
      }
    } catch {
      /* usuário cancelou o compartilhamento */
    }
  }

  return (
    <div className="border-b border-border bg-card px-4 py-4">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        <a
          href={`tel:${salonConfig.phone}`}
          className="flex flex-1 flex-col items-center gap-1 text-salon-green-dark"
        >
          <Phone className="size-5" />
          <span className="text-xs font-medium">Ligar</span>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center gap-1 text-salon-green-dark"
        >
          <MapPin className="size-5" />
          <span className="text-xs font-medium">Endereço</span>
        </a>

        <button
          onClick={handleShare}
          className="flex flex-1 flex-col items-center gap-1 text-salon-green-dark"
        >
          <Share2 className="size-5" />
          <span className="text-xs font-medium">Compartilhar</span>
        </button>

        <button
          onClick={onScheduleNow}
          className="flex flex-[1.4] flex-col items-center gap-0.5 rounded-xl bg-salon-green px-3 py-2.5 text-salon-green-foreground transition-colors hover:bg-salon-green-dark"
        >
          <span className="flex items-center gap-1.5 text-sm font-bold">
            <Clock className="size-4" />
            AGENDAR AGORA
          </span>
          <span className="text-[10px] font-medium opacity-90">Horários Disponíveis</span>
        </button>
      </div>
    </div>
  )
}
