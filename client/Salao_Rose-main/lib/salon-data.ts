export type Service = {
  id: string
  name: string
  price: number
  durationMin: number
  image: string
}

export type Appointment = {
  id: string
  serviceId: string
  serviceName: string
  price: number
  dateKey: string
  dateLabel: string
  time: string
  payment: string
  professional: string
}

// Configurações carregadas do perfil/admin do salão.
// Em produção viriam do banco (Supabase).
export const salonConfig = {
  name: 'Salão da Rose',
  city: 'Ituiutaba - Minas Gerais',
  phone: '+5534998073363',
  phoneLabel: '(34) 99999-9999',
  address: 'R. Maria Anália G. Franco, 428 - Jerônimo Mendonça, Ituiutaba - MG, 38305-066',
  isOpen: true,
  professional: 'Rose',
}

export const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(salonConfig.address)}`

export const services: Service[] = [
  {
    id: 'corte-feminino',
    name: 'Corte de cabelo feminino',
    price: 25,
    durationMin: 30,
    image: '/images/corte-feminino.png',
  },
  {
    id: 'hidratacao-premium',
    name: 'Hidratação premium',
    price: 25,
    durationMin: 30,
    image: '/images/hidratacao.png',
  },
  {
    id: 'progressiva-sem-formol',
    name: 'Progressiva premium S/ formol',
    price: 25,
    durationMin: 30,
    image: '/images/progressiva.png',
  },
  {
    id: 'progressiva-com-formol',
    name: 'Progressiva premium C/ formol',
    price: 25,
    durationMin: 30,
    image: '/images/coloracao.png',
  },
  {
    id: 'escova-modeladora',
    name: 'Escova modeladora',
    price: 25,
    durationMin: 30,
    image: '/images/escova.png',
  },
]

export const timeSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
]

export const paymentMethods = [
  { id: 'cartao', label: 'Cartão' },
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'pix', label: 'Pix' },
]

const WEEKDAYS = ['DOM','SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

export type DateOption = {
  key: string
  weekday: string
  day: string
  month: string
  fullLabel: string
}

export function getUpcomingDates(count = 14): DateOption[] {
  const dates: DateOption[] = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const key = d.toISOString().split('T')[0]
    dates.push({
      key,
      weekday: WEEKDAYS[d.getDay()],
      day: String(d.getDate()).padStart(2, '0'),
      month: MONTHS[d.getMonth()],
      fullLabel: `${WEEKDAYS[d.getDay()].charAt(0)}${WEEKDAYS[d.getDay()]
        .slice(1)
        .toLowerCase()}, ${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}/${d.getFullYear()}`,
    })
  }
  return dates
}

// Horários já ocupados por outras clientes (simula dados vindos do Supabase).
export function getInitialBookedSlots(dates: DateOption[]): Record<string, string[]> {
  const booked: Record<string, string[]> = {}
  if (dates[0]) booked[dates[0].key] = ['09:00', '11:30', '15:00']
  if (dates[1]) booked[dates[1].key] = ['08:30', '10:00', '14:00', '16:30']
  if (dates[2]) booked[dates[2].key] = ['09:30', '12:00']
  if (dates[3]) booked[dates[3].key] = ['08:00', '10:30', '11:00', '15:30', '17:00']
  return booked
}
