'use client'

import { LogOut, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title: string
  subtitle: string
  isOpen: boolean
  onToggleOpen: () => void
  onOpenMenu: () => void
}

export function Topbar({
  title,
  subtitle,
  isOpen,
  onToggleOpen,
  onOpenMenu,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-lg font-semibold text-foreground sm:text-xl">
            {title}
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground sm:block">
            {subtitle}
          </p>
        </div>

        {/* Status toggle */}
        <button
          type="button"
          onClick={onToggleOpen}
          aria-pressed={isOpen}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm',
            isOpen
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-stone-200 bg-stone-100 text-stone-600',
          )}
        >
          <span
            className={cn(
              'size-2 rounded-full',
              isOpen ? 'bg-emerald-500' : 'bg-stone-400',
            )}
          />
          {isOpen ? 'Aberto agora' : 'Fechado'}
        </button>

        {/* Admin profile */}
        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-foreground">
              Rose
            </p>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Administradora
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            R
          </div>
          <button
            type="button"
            aria-label="Sair"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-[18px]" />
          </button>
        </div>
      </div>
    </header>
  )
}
