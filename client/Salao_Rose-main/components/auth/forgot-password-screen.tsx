'use client'

import { useState } from 'react'
import { ArrowLeft, KeyRound, Phone } from 'lucide-react'
import { AuthHero } from './auth-hero'
import { useToast } from '@/components/toast'

type Props = {
  onBack: () => void
}

export function ForgotPasswordScreen({ onBack }: Props) {
  const [phone, setPhone] = useState('')
  const { showToast } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) {
      showToast('Informe seu telefone.', 'error')
      return
    }
    showToast('Código enviado por SMS!', 'success')
    setTimeout(onBack, 1200)
  }

  return (
    <div className="min-h-dvh bg-primary">
      <AuthHero />
      <div className="-mt-6 rounded-t-3xl bg-card px-6 pb-10 pt-7">
        <div className="mx-auto max-w-md">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <ArrowLeft className="size-4" />
            Voltar para login
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Recuperar senha
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe seu telefone para receber o código por SMS.
              </p>
            </div>
            <KeyRound className="size-6 text-primary" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-card-foreground">Telefone</span>
              <div className="flex items-center gap-2 rounded-xl border border-input bg-accent/40 px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-card">
                <Phone className="size-4 text-primary" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(34) 99999-9999"
                  className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Enviar código
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
