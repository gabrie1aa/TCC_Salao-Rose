'use client'

import { useState } from 'react'
import { ArrowRight, Heart, KeyRound, Lock, Phone, User } from 'lucide-react'
import { AuthHero } from './auth-hero'
import { useToast } from '@/components/toast'
import { supabase } from '@/lib/supabase'

type Props = {
  onLogin: (name: string, phone: string) => void
  onGoRegister: () => void
  onGoForgot: () => void
}

function formatPhone(value: string) {
  const nums = value.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 2) {
    return nums.length ? `(${nums}` : ''
  }
  if (nums.length <= 7) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2)}`
  }
  return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
}

export function LoginScreen({ onLogin, onGoRegister, onGoForgot }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !password.trim()) {
      showToast('Preencha nome, telefone e senha.', 'error')
      return
    }

    setLoading(true)

    // Consulta no Supabase usando o telefone limpo (apenas números) para garantir a busca correta
    const cleanPhone = phone.replace(/\D/g, '')

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', cleanPhone)
      .eq('name', name.trim())
      .eq('password', password)
      .single()

    setLoading(false)

    if (error || !data) {
      showToast('Dados incorretos ou conta não encontrada.', 'error')
      return
    }
    
    // Salva os dados no navegador para o agendamento usar
    localStorage.setItem('salon_client_name', data.name)
    localStorage.setItem('salon_client_phone', data.phone)

    showToast('Login realizado com sucesso!', 'success')
    onLogin(data.name, data.phone)
  }

  return (
    <div className="min-h-dvh bg-primary">
      <AuthHero />
      <div className="-mt-6 rounded-t-3xl bg-card px-6 pb-10 pt-7">
        <div className="mx-auto max-w-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Bem-vinda!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Acesse sua conta para agendar seus serviços
              </p>
            </div>
            <Heart className="size-6 text-primary" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field
              icon={<User className="size-4" />}
              label="Nome"
              value={name}
              onChange={setName}
              placeholder="Seu nome"
            />
            <Field
              icon={<Phone className="size-4" />}
              label="Telefone"
              value={phone}
              onChange={(val) => setPhone(formatPhone(val))}
              placeholder="(34) 99999-9999"
              type="tel"
            />
            <Field
              icon={<Lock className="size-4" />}
              label="Senha"
              value={password}
              onChange={setPassword}
              placeholder="Sua senha"
              type="password"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'} <ArrowRight className="size-4" />
            </button>
          </form>

          <button
            onClick={onGoForgot}
            className="mx-auto mt-5 flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <KeyRound className="size-4" />
            Esqueci minha senha
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{' '}
            <button onClick={onGoRegister} className="font-semibold text-primary">
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-input bg-accent/40 px-4 py-3 text-sm text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card"
      />
    </label>
  )
}