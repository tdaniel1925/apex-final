import Link from 'next/link'
import { LayoutDashboard, Users, Package, Settings, Image, FileText, DollarSign } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Distributors', href: '/admin/distributors', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Photo Approvals', href: '/admin/photos', icon: Image },
    { name: 'Tax Forms', href: '/admin/tax-forms', icon: FileText },
    { name: 'Commissions', href: '/admin/commissions', icon: DollarSign },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Apex MLM</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-400"
          >
            ← Back to User Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
