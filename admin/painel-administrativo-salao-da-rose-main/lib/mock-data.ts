import type {
  Appointment,
  BlockedDate,
  DaySchedule,
  SalonInfo,
  Service,
} from './salon-types'

/** Data base usada pela agenda mock (hoje). */
export const TODAY = new Date().toISOString().slice(0, 10)

function offsetDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const salonInfo: SalonInfo = {
  name: 'Salão da Rose',
  phone: '(34) 99663-8899',
  address: 'Rua Maria A. G. Franco, 438, Jerônimo Mendonça, Ituiutaba - MG',
  description: 'Cortes, coloração, manicure e muito mais.',
}

export const initialServices: Service[] = [
  {
    id: 'svc-1',
    name: 'Corte Feminino',
    description: 'Corte personalizado de acordo com o estilo e formato do seu rosto.',
    durationMinutes: 30,
    price: 25,
    active: true,
  },
  {
    id: 'svc-2',
    name: 'Hidratação Premium',
    description: 'Restaura a saúde dos fios, deixando os cabelos mais fortes e brilhosos.',
    durationMinutes: 60,
    price: 50,
    active: true,
  },
  {
    id: 'svc-3',
    name: 'Progressiva Premium S/ Formol',
    description: 'Cabelos mais alinhados, macios e com brilho, sem química agressiva.',
    durationMinutes: 75,
    price: 80,
    active: true,
  },
  {
    id: 'svc-4',
    name: 'Progressiva Premium C/ Formol',
    description: 'Cabelos mais alinhados, macios e com brilho.',
    durationMinutes: 120,
    price: 150,
    active: true,
  },
  {
    id: 'svc-5',
    name: 'Escova Modeladora',
    description: 'Cabelos mais alinhados, macios e com brilho.',
    durationMinutes: 30,
    price: 25,
    active: true,
  },
  {
    id: 'svc-6',
    name: 'Coloração',
    description: 'Coloração completa com produtos de alta qualidade e proteção dos fios.',
    durationMinutes: 90,
    price: 120,
    active: false,
  },
]

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    clientName: 'Gabriela Silva',
    phone: '5534998664537',
    serviceId: 'svc-1',
    serviceName: 'Corte Feminino',
    date: TODAY,
    time: '08:00',
    price: 25,
    status: 'confirmado',
  },
  {
    id: 'apt-2',
    clientName: 'Fernanda Ferreira',
    phone: '5534984454563',
    serviceId: 'svc-3',
    serviceName: 'Progressiva Premium S/ Formol',
    date: TODAY,
    time: '09:00',
    price: 80,
    status: 'confirmado',
  },
  {
    id: 'apt-3',
    clientName: 'Camilla Rodrigues',
    phone: '5534975884123',
    serviceId: 'svc-1',
    serviceName: 'Corte Feminino',
    date: TODAY,
    time: '10:00',
    price: 25,
    status: 'pendente',
  },
  {
    id: 'apt-4',
    clientName: 'Alice Andrade',
    phone: '5534991234567',
    serviceId: 'svc-4',
    serviceName: 'Progressiva Premium C/ Formol',
    date: TODAY,
    time: '12:00',
    price: 150,
    status: 'confirmado',
  },
  {
    id: 'apt-5',
    clientName: 'Julene Freitas',
    phone: '5534987651234',
    serviceId: 'svc-5',
    serviceName: 'Escova Modeladora',
    date: TODAY,
    time: '13:00',
    price: 25,
    status: 'concluido',
  },
  {
    id: 'apt-6',
    clientName: 'Cláudia Rala',
    phone: '5534996657788',
    serviceId: 'svc-5',
    serviceName: 'Escova Modeladora',
    date: TODAY,
    time: '15:00',
    price: 25,
    status: 'cancelado',
  },
  {
    id: 'apt-7',
    clientName: 'Yasmin Barbosa',
    phone: '5534991112233',
    serviceId: 'svc-1',
    serviceName: 'Corte Feminino',
    date: offsetDate(1),
    time: '15:00',
    price: 25,
    status: 'confirmado',
  },
  {
    id: 'apt-8',
    clientName: 'Eduarda Magalhães',
    phone: '5534994445566',
    serviceId: 'svc-5',
    serviceName: 'Escova Modeladora',
    date: offsetDate(1),
    time: '12:00',
    price: 25,
    status: 'pendente',
  },
  {
    id: 'apt-9',
    clientName: 'Regina Reis',
    phone: '5534993334455',
    serviceId: 'svc-4',
    serviceName: 'Progressiva Premium C/ Formol',
    date: offsetDate(2),
    time: '14:00',
    price: 150,
    status: 'confirmado',
  },
  {
    id: 'apt-10',
    clientName: 'Tatiana Menezes',
    phone: '5534992223344',
    serviceId: 'svc-1',
    serviceName: 'Corte Feminino',
    date: offsetDate(-1),
    time: '13:00',
    price: 25,
    status: 'concluido',
  },
]

export const initialSchedule: DaySchedule[] = [
  { key: 'seg', label: 'Segunda', open: false, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'ter', label: 'Terça', open: true, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'qua', label: 'Quarta', open: true, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'qui', label: 'Quinta', open: true, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'sex', label: 'Sexta', open: true, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'sab', label: 'Sábado', open: true, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: true },
  { key: 'dom', label: 'Domingo', open: false, start: '08:00', end: '18:00', breakStart: '11:00', breakEnd: '13:00', hasBreak: false },
]

export const initialBlockedDates: BlockedDate[] = [
  { id: 'blk-1', date: offsetDate(3), reason: 'Férias' },
  { id: 'blk-2', date: offsetDate(11), reason: 'Evento interno' },
]
