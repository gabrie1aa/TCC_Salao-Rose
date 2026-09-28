'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error'
type ToastItem = { id: number; message: string; type: ToastType }

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 ${
              t.type === 'success'
                ? 'border-salon-green/30 bg-white text-salon-green-dark'
                : 'border-destructive/30 bg-white text-destructive'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="size-5 shrink-0 text-salon-green" />
            ) : (
              <XCircle className="size-5 shrink-0 text-destructive" />
            )}
            <span className="text-pretty">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
