'use client'

import { ToastProvider } from '@/components/ui/Toast'

export function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
