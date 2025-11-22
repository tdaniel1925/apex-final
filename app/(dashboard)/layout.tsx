import { Toaster } from '@/components/ui/toaster'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation will be added in Phase 2 */}
      <main className="container mx-auto p-6">{children}</main>
      <Toaster />
    </div>
  )
}
