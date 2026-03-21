'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const isSuccess = toast.type === 'success'

  return (
    <div
      className={cn(
        'card flex items-center gap-3 px-4 py-3 shadow-lg animate-in slide-in-from-right-full duration-300',
        isSuccess
          ? 'border-green-200 dark:border-green-800'
          : 'border-red-200 dark:border-red-800'
      )}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      )}
      <p className="text-sm text-ardoise dark:text-blanc-ecume flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-granit hover:text-ardoise dark:hover:text-blanc-ecume transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
