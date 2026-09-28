'use client'

import { CalendarDays, ChevronRight, Heart, LogOut } from 'lucide-react'
import { salonConfig } from '@/lib/salon-data'

type Props = {
  open: boolean
  onClose: () => void
  onMyAppointments: () => void
  onLogout: () => void
}

export function MenuDrawer({ open, onClose, onMyAppointments, onLogout }: Props) {
  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[80%] max-w-xs flex-col bg-card shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-primary px-6 pb-8 pt-10 text-center text-primary-foreground">
          <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full bg-white shadow">
            <Heart className="size-9 fill-primary text-primary" />
          </div>
          <h2 className="font-display text-xl font-semibold">{salonConfig.name}</h2>
          <p className="mt-1 text-xs text-primary-foreground/85">{salonConfig.city}</p>
        </div>

        <nav className="flex-1 px-4 py-4">
          <button
            onClick={onMyAppointments}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-4 text-left transition-colors hover:bg-accent"
          >
            <CalendarDays className="size-5 text-primary" />
            <span className="flex-1 font-medium text-card-foreground">Meus agendamentos</span>
            <ChevronRight className="size-5 text-primary" />
          </button>
        </nav>

        <div className="border-t border-border px-4 py-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-4 text-left text-primary transition-colors hover:bg-accent"
          >
            <LogOut className="size-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
