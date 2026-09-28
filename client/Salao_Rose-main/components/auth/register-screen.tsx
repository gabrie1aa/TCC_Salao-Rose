'use client'

import { useState } from 'react'
import { Lock, Phone, ShieldCheck, User, UserPlus } from 'lucide-react'
import { AuthHero } from './auth-hero'
import { useToast } from '@/components/toast'
import { supabase } from '@/lib/supabase'

type Props = {
  onRegister: (name: string, phone: string) => void
  onGoLogin: () => void
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

export function RegisterScreen({ onRegister, onGoLogin }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !password || !confirm) {
      showToast('Preencha todos os campos.', 'error')
      return
    }
    if (password.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres.', 'error')
      return
    }
    if (password !== confirm) {
      showToast('As senhas não coincidem.', 'error')
      return
    }

    setLoading(true)

    // Salva apenas os números limpos do telefone no banco de dados
    const cleanPhone = phone.replace(/\D/g, '')

    const { error } = await supabase.from('clients').insert([
      {
        name: name.trim(),
        phone: cleanPhone,
        password: password,
      },
    ])

    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        showToast('Este telefone já está cadastrado.', 'error')
      } else {
        showToast('Erro ao realizar o cadastro. Tente novamente.', 'error')
      }
      return
    }

    // Salva os dados no navegador para o agendamento usar
    localStorage.setItem('salon_client_name', name.trim())
    localStorage.setItem('salon_client_phone', cleanPhone)

    showToast('Conta criada com sucesso!', 'success')
    onRegister(name.trim(), cleanPhone)
  }

  return (
    <div className="min-h-dvh bg-primary">
      <AuthHero />
      <div className="-mt-6 rounded-t-3xl bg-card px-6 pb-10 pt-7">
        <div className="mx-auto max-w-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Criar conta
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Preencha seus dados para se cadastrar.
              </p>
            </div>
            <UserPlus className="size-6 text-primary" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field
              icon={<User className="size-4" />}
              label="Nome completo"
              value={name}
              onChange={setName}
              placeholder="Digite seu nome completo"
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
              placeholder="Mínimo 6 caracteres"
              type="password"
            />
            <Field
              icon={<Lock className="size-4" />}
              label="Confirmar senha"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repita sua senha"
              type="password"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <UserPlus className="size-4" />
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Seus dados estão seguros conosco
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <button onClick={onGoLogin} className="font-semibold text-primary">
              Entrar
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
      <span className="text-sm font-semibold text-card-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-accent/40 px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-card">
        <span className="text-primary">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  )
}