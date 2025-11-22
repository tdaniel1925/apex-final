import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Users, DollarSign, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6 border-b border-primary-foreground/10">
          <h1 className="text-2xl font-bold">Apex Affinity</h1>
          <p className="text-sm opacity-80 mt-1">Distributor Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/team"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>My Team</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/commissions"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                <span>Commissions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-primary-foreground/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
