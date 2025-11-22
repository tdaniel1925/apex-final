import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Toaster } from '@/components/ui/toaster'

async function getDistributor(username: string) {
  const distributor = await db.query.users.findFirst({
    where: eq(users.replicatedSiteUrl, username),
  })

  return distributor
}

export default async function ReplicatedSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const distributor = await getDistributor(params.username)

  if (!distributor) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href={`/${params.username}`} className="text-2xl font-bold text-primary">
                Apex Affinity Group
              </a>
              <div className="hidden md:flex gap-6">
                <a href={`/${params.username}`} className="text-sm hover:text-primary">
                  Home
                </a>
                <a href={`/${params.username}/opportunity`} className="text-sm hover:text-primary">
                  Opportunity
                </a>
                <a href={`/${params.username}/products`} className="text-sm hover:text-primary">
                  Products
                </a>
                <a href={`/${params.username}/testimonials`} className="text-sm hover:text-primary">
                  Testimonials
                </a>
                <a href={`/${params.username}/about`} className="text-sm hover:text-primary">
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CartSheet username={params.username} />
              <a
                href={`/${params.username}/enroll`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Toast Notifications */}
      <Toaster />

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Apex Affinity Group</h3>
              <p className="text-sm text-muted-foreground">
                Building wealth through community and opportunity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={`/${params.username}/opportunity`} className="text-muted-foreground hover:text-foreground">
                    Opportunity
                  </a>
                </li>
                <li>
                  <a href={`/${params.username}/products`} className="text-muted-foreground hover:text-foreground">
                    Products
                  </a>
                </li>
                <li>
                  <a href={`/${params.username}/enroll`} className="text-muted-foreground hover:text-foreground">
                    Join Now
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Your Distributor</h3>
              <p className="text-sm">
                <span className="font-medium">{distributor.firstName} {distributor.lastName}</span>
              </p>
              <p className="text-sm text-muted-foreground">{distributor.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/policies/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/policies/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/policies/income-disclaimer" className="text-muted-foreground hover:text-foreground">
                    Income Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Apex Affinity Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
