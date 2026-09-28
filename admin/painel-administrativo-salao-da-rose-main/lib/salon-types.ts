export type AppointmentStatus =
  | 'confirmado'
  | 'pendente'
  | 'cancelado'
  | 'concluido'

export interface Service {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
  active: boolean
  image?: string
}

export interface Appointment {
  id: string
  clientName: string
  phone: string
  serviceId: string
  serviceName: string
  /** ISO date string (yyyy-mm-dd) */
  date: string
  /** 24h time, e.g. "09:30" */
  time: string
  price: number
  status: AppointmentStatus
}

export interface DaySchedule {
  key: string
  label: string
  open: boolean
  start: string
  end: string
  /** lunch / pause */
  breakStart: string
  breakEnd: string
  hasBreak: boolean
}

export interface BlockedDate {
  id: string
  /** ISO date string (yyyy-mm-dd) */
  date: string
  reason: string
}

export interface SalonInfo {
  name: string
  phone: string
  address: string
  description: string
}
