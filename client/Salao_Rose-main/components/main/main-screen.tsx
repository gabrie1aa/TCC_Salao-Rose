'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronRight, LogOut, Menu, Search } from 'lucide-react'
import { salonConfig, type Service } from '@/lib/salon-data'
import { QuickActions } from './quick-actions'
import { ServiceCard } from './service-card'
import { MenuDrawer } from './menu-drawer'
import { supabase } from '@/lib/supabase'

type Props = {
  selectedService: Service | null
  onSelectService: (service: Service | null) => void
  onFinish: () => void
  onMyAppointments: () => void
  onLogout: () => void
}

export function MainScreen({
  selectedService,
  onSelectService,
  onFinish,
  onMyAppointments,
  onLogout,
}: Props) {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Busca os serviços dinamicamente do Supabase cadastrados pelo Admin
  useEffect(() => {
    async function fetchServices() {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'Ativo') // Traz apenas os serviços ativos para o cliente
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao buscar serviços:', error)
      } else if (data) {
        const formatted: Service[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          durationMin: item.duration_min, // Puxa a duração real do banco
          image: '/images/hero-salon.png', // Imagem padrão exigida pelo tipo Service
        }))
        setServices(formatted)
      }
      setLoading(false)
    }

    fetchServices()
  }, [])

  const filtered = useMemo(
    () => services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [services, query],
  )

  function toggle(service: Service) {
    onSelectService(selectedService?.id === service.id ? null : service)
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onMyAppointments={() => {
          setMenuOpen(false)
          onMyAppointments()
        }}
        onLogout={onLogout}
      />

      {/* Hero */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src="/images/hero-salon.png"
          alt="Cabelo sendo finalizado com escova no Salão da Rose"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            <Menu className="size-5" />
          </button>
          <button
            onClick={onLogout}
            aria-label="Sair"
            className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          >
            <LogOut className="size-5" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-4 px-4 text-white">
          <span className="inline-flex items-center rounded-md bg-salon-green px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-salon-green-foreground">
            {salonConfig.isOpen ? 'Aberto' : 'Fechado'}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold">{salonConfig.name}</h1>
          <p className="text-sm text-white/90">{salonConfig.city}</p>
        </div>
      </div>

      <QuickActions onScheduleNow={onFinish} />

      {/* Serviços */}
      <div className="mx-auto max-w-md px-4 py-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Serviços <span className="text-muted-foreground">({services.length})</span>
        </h2>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise um serviço..."
            className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Carregando serviços...
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService?.id === service.id}
                onToggle={() => toggle(service)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum serviço encontrado.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Barra flutuante de finalizar */}
      {selectedService && (
        <button
          onClick={onFinish}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
        >
          <div className="text-left">
            <p className="flex items-center gap-2 font-display font-semibold">
              Finalizar Agendamento
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs">
                1 - R$ {selectedService.price.toFixed(2).replace('.', ',')}
              </span>
            </p>
            <p className="text-xs text-primary-foreground/80">
              Escolha um horário e método de pagamento.
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <ChevronRight className="size-5" />
          </span>
        </button>
      )}
    </div>
  )
}