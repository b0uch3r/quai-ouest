import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardClientWrapper } from '@/components/layout/DashboardClientWrapper'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-blanc-ecume dark:bg-ardoise">
      <Sidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <DashboardClientWrapper>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </DashboardClientWrapper>
      </main>
    </div>
  )
}
