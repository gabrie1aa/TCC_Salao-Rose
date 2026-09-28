'use client'

import { Flower2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, type TabKey } from './nav'

interface SidebarProps {
  active: TabKey
  onSelect: (tab: TabKey) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Flower2 className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="font-heading text-base font-semibold text-white">
          Salão da <span className="text-primary-foreground">Rose</span>
        </p>
        <p className="text-[11px] text-sidebar-foreground/70">
          Painel Administrativo
        </p>
      </div>
    </div>
  )
}

function NavList({
  active,
  onSelect,
}: {
  active: TabKey
  onSelect: (tab: TabKey) => void
}) {
  return (
    <nav className="mt-6 flex flex-col gap-1 px-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white',
            )}
          >
            <Icon className="size-[18px]" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export function Sidebar({
  active,
  onSelect,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar py-6 lg:flex">
        <Brand />
        <NavList active={active} onSelect={onSelect} />
        <div className="mt-auto px-4">
          <p className="text-[11px] leading-relaxed text-sidebar-foreground/50">
            Salão da Rose © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
            role="presentation"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar py-6">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Fechar menu"
                className="rounded-md p-1 text-sidebar-foreground/70 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavList
              active={active}
              onSelect={(tab) => {
                onSelect(tab)
                onMobileClose()
              }}
            />
          </aside>
        </div>
      ) : null}
    </>
  )
}
