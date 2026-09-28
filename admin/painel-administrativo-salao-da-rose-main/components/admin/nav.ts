import { BarChart3, CalendarDays, Clock, Scissors, type LucideIcon } from 'lucide-react'

export type TabKey = 'agenda' | 'servicos' | 'horarios' | 'resumo'

export interface NavItem {
  key: TabKey
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'agenda', label: 'Agenda', icon: CalendarDays },
  { key: 'servicos', label: 'Serviços', icon: Scissors },
  { key: 'horarios', label: 'Horários & Folgas', icon: Clock },
  { key: 'resumo', label: 'Resumo', icon: BarChart3 },
]
