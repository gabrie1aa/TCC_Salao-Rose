'use client'

import { useMemo, useState, useEffect } from 'react'
import { ToastProvider, useToast } from '@/components/toast'
import { LoginScreen } from '@/components/auth/login-screen'
import { RegisterScreen } from '@/components/auth/register-screen'
import { ForgotPasswordScreen } from '@/components/auth/forgot-password-screen'
import { MainScreen } from '@/components/main/main-screen'
import { MyAppointments } from '@/components/main/my-appointments'
import { BookingScreen } from '@/components/booking/booking-screen'
import { supabase } from '@/lib/supabase'
import type { Appointment, Service } from '@/lib/salon-data'

type View = 'login' | 'register' | 'forgot' | 'main' | 'booking' | 'appointments'

function SalonApp() {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { showToast } = useToast()

  function handleAuth(name: string, phone: string) {
    setUser({ name, phone })
    setView('main')
  }

  function handleLogout() {
    setUser(null)
    setSelectedService(null)
    setView('login')
  }

  function handleFinish() {
    if (!selectedService) {
      showToast('Selecione um serviço para agendar.', 'error')
      return
    }
    setView('booking')
  }

  function handleConfirmBooking(data: Omit<Appointment, 'id'>) {
    setAppointments((prev) => [{ ...data, id: `${Date.now()}` }, ...prev])
    setSelectedService(null)
    setView('main')
    showToast('Agendado com sucesso!!', 'success')
  }

  if (view === 'login') {
    return (
      <LoginScreen
        onLogin={handleAuth}
        onGoRegister={() => setView('register')}
        onGoForgot={() => setView('forgot')}
      />
    )
  }

  if (view === 'register') {
    return <RegisterScreen onRegister={handleAuth} onGoLogin={() => setView('login')} />
  }

  if (view === 'forgot') {
    return <ForgotPasswordScreen onBack={() => setView('login')} />
  }

  if (view === 'booking' && selectedService) {
    return (
      <BookingScreen
        service={selectedService}
        onBack={() => setView('main')}
        onConfirm={handleConfirmBooking}
      />
    )
  }

  if (view === 'appointments') {
    return <MyAppointments appointments={appointments} onBack={() => setView('main')} />
  }

  return (
    <MainScreen
      selectedService={selectedService}
      onSelectService={setSelectedService}
      onFinish={handleFinish}
      onMyAppointments={() => setView('appointments')}
      onLogout={handleLogout}
    />
  )
}

export default function Page() {
  return (
    <ToastProvider>
      <SalonApp />
    </ToastProvider>
  )
}