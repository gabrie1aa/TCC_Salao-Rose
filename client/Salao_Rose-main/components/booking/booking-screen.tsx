'use client'

import { useMemo, useState, useEffect } from 'react'
import { ArrowLeft, Banknote, CreditCard, QrCode } from 'lucide-react'
import {
  getUpcomingDates,
  paymentMethods,
  timeSlots,
  type Appointment,
  type Service,
} from '@/lib/salon-data'
import { ConfirmModal } from './confirm-modal'
import { useToast } from '@/components/toast'
import { supabase } from '@/lib/supabase'

type Props = {
  service: Service
  onBack: () => void
  onConfirm: (appointment: Omit<Appointment, 'id'>) => void
}

const paymentIcons: Record<string, React.ReactNode> = {
  cartao: <CreditCard className="size-5" />,
  dinheiro: <Banknote className="size-5" />,
  pix: <QrCode className="size-5" />,
}

export function BookingScreen({ service, onBack, onConfirm }: Props) {
  const dates = useMemo(() => getUpcomingDates(14), [])
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [payment, setPayment] = useState('dinheiro')
  const [showConfirm, setShowConfirm] = useState(false)
  const { showToast } = useToast()

  const [bookedSlotsForDate, setBookedSlotsForDate] = useState<string[]>([])
  const [blockedDatesList, setBlockedDatesList] = useState<string[]>([])
  const [closedDaysOfWeek, setClosedDaysOfWeek] = useState<string[]>([])

  // Busca as datas bloqueadas e os dias da semana fechados direto do Supabase
  useEffect(() => {
    async function fetchSettings() {
      // 1. Buscar datas bloqueadas específicas (férias, feriados)
      const { data: blockedData, error: blockedError } = await supabase
        .from('salon_blocked_dates')
        .select('date_key')

      if (!blockedError && blockedData) {
        const blockedKeys = blockedData.map((item: any) => item.date_key)
        setBlockedDatesList(blockedKeys)
      }

      // 2. Buscar horários/dias de funcionamento (ex: dias fechados na semana)
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('salon_schedule')
        .select('day_key, is_open')

      if (!scheduleError && scheduleData) {
        const closed = scheduleData
          .filter((item: any) => !item.is_open)
          .map((item: any) => item.day_key)
        setClosedDaysOfWeek(closed)
      }
    }

    fetchSettings()
  }, [])

  // Busca os agendamentos do Supabase para a data e calcula o bloqueio por duração
  useEffect(() => {
    async function fetchBookedSlots() {
      const { data, error } = await supabase
        .from('appointments')
        .select('time, duration_min, status')
        .eq('date_key', selectedDate.key)

      if (error || !data) return

      const blocked: string[] = []

      data.forEach((appt) => {
        if (appt.status === 'Cancelado') return

        const startTime = appt.time // Ex: '08:00'
        const duration = appt.duration_min || 30 // Padrão de 30 min se não vier
        const slotsCount = Math.ceil(duration / 30) // Quantos blocos de 30 min o serviço ocupa

        const startIndex = timeSlots.indexOf(startTime)
        if (startIndex !== -1) {
          // Bloqueia o horário de início e os horários seguintes baseados na duração
          for (let i = 0; i < slotsCount; i++) {
            const slotToBlock = timeSlots[startIndex + i]
            if (slotToBlock && !blocked.includes(slotToBlock)) {
              blocked.push(slotToBlock)
            }
          }
        }
      })

      setBookedSlotsForDate(blocked)
    }

    fetchBookedSlots()
  }, [selectedDate])

  function isBooked(time: string) {
    return bookedSlotsForDate.includes(time)
  }

  function handleSelectTime(time: string) {
    if (isBooked(time)) {
      showToast('Este horário já foi agendado por outra cliente.', 'error')
      return
    }
    setSelectedTime(time)
  }

  function handleFinish() {
    if (!selectedTime) {
      showToast('Selecione um horário disponível.', 'error')
      return
    }
    if (isBooked(selectedTime)) {
      showToast('Este horário acabou de ser ocupado. Escolha outro.', 'error')
      setSelectedTime(null)
      return
    }
    setShowConfirm(true)
  }

  async function confirmBooking() {
    const paymentLabel = paymentMethods.find((p) => p.id === payment)?.label ?? ''
    
    const clientName = localStorage.getItem('salon_client_name') || 'Cliente'
    const clientPhone = localStorage.getItem('salon_client_phone') || 'Não informado'

    const newAppointment = {
      service_id: service.id,
      service_name: service.name,
      price: service.price,
      duration_min: service.durationMin || 30,
      date_key: selectedDate.key,
      time: selectedTime!,
      payment: paymentLabel,
      client_name: clientName,
      client_phone: clientPhone,
      status: 'Confirmado',
      professional: 'Rose',
    }

    const { error } = await supabase.from('appointments').insert([newAppointment])

    if (error) {
      showToast('Erro ao realizar o agendamento. Tente novamente.', 'error')
      return
    }

    onConfirm({
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      dateKey: selectedDate.key,
      dateLabel: selectedDate.fullLabel,
      time: selectedTime!,
      payment: paymentLabel,
      professional: 'Rose',
    })
  }

  return (
    <div className="min-h-dvh bg-background pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="flex size-9 items-center justify-center rounded-full bg-white/15"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="font-display text-lg font-semibold">Finalizar Agendamento</h1>
          <p className="text-xs text-primary-foreground/80">
            Escolha um horário e método de pagamento.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-5">
        {/* Resumo */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-display font-semibold text-card-foreground">{service.name}</h2>
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-salon-green-dark">
              R$ {service.price.toFixed(2).replace('.', ',')}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Duração aproximada: {service.durationMin} minutos
          </p>
        </div>

        {/* Datas */}
        <h3 className="mt-6 font-display font-semibold text-foreground">
          Pra quando você gostaria de agendar?
        </h3>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {dates.map((d, index) => {
            const active = d.key === selectedDate.key
            const isBlockedByDate = blockedDatesList.includes(d.key)

            // Calcula matematicamente o índice do dia da semana (0 = Dom, 1 = Seg, ..., 6 = Sáb)
            const today = new Date()
            const targetDate = new Date(today)
            targetDate.setDate(today.getDate() + index)
            const dayOfWeekIndex = targetDate.getDay()

            const keysMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
            const currentDayKey = keysMap[dayOfWeekIndex]

            const isClosedDay = closedDaysOfWeek.includes(currentDayKey)
            const isFullyBlocked = isBlockedByDate || isClosedDay

            return (
              <button
                key={d.key}
                disabled={isFullyBlocked}
                onClick={() => {
                  if (isFullyBlocked) return
                  setSelectedDate(d)
                  setSelectedTime(null)
                }}
                className={`flex min-w-16 shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                  isFullyBlocked
                    ? 'cursor-not-allowed border-border bg-muted/60 text-muted-foreground/40 line-through'
                    : active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-card-foreground'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase">{d.weekday}</span>
                <span className="font-display text-lg font-bold leading-none">{d.day}</span>
                <span
                  className={`text-[10px] ${active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
                >
                  {isFullyBlocked ? 'Fechado' : d.month}
                </span>
              </button>
            )
          })}
        </div>

        {/* Horários */}
        <h3 className="mt-6 font-display font-semibold text-foreground">Que horas?</h3>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {timeSlots.map((time) => {
            const booked = isBooked(time)
            const active = selectedTime === time
            return (
              <button
                key={time}
                onClick={() => handleSelectTime(time)}
                disabled={booked}
                title={booked ? 'Indisponível (ocupado)' : undefined}
                className={`rounded-xl border py-3 text-sm font-medium transition-colors ${
                  booked
                    ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through'
                    : active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-card-foreground hover:border-primary'
                }`}
              >
                {time}
              </button>
            )
          })}
        </div>

        {/* Pagamento */}
        <h3 className="mt-6 font-display font-semibold text-foreground">
          Como você gostaria de pagar?
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {paymentMethods.map((method) => {
            const active = payment === method.id
            return (
              <button
                key={method.id}
                onClick={() => setPayment(method.id)}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-colors ${
                  active
                    ? 'border-primary bg-accent text-primary'
                    : 'border-border bg-card text-card-foreground'
                }`}
              >
                {active && (
                  <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    ✓
                  </span>
                )}
                {paymentIcons[method.id]}
                <span className="text-xs font-medium">{method.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          O pagamento será feito presencialmente no salão.
        </p>
      </div>

      <button
        onClick={handleFinish}
        className="fixed inset-x-0 bottom-0 z-40 bg-primary py-4 text-center text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-opacity hover:opacity-90"
      >
        Confirmar meu agendamento
      </button>

      {showConfirm && selectedTime && (
        <ConfirmModal
          serviceName={service.name}
          price={service.price}
          dateLabel={selectedDate.fullLabel}
          time={selectedTime}
          payment={paymentMethods.find((p) => p.id === payment)?.label ?? ''}
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmBooking}
        />
      )}
    </div>
  )
}