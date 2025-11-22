import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutCancelPage({
  params,
}: {
  params: { username: string }
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <XCircle className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-3xl">Checkout Cancelled</CardTitle>
            <CardDescription className="text-lg">
              Your order was not completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                No payment was processed. Your cart items are still saved and waiting for you.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Need help?</h3>
              <p className="text-sm text-muted-foreground">
                If you encountered any issues during checkout or have questions about our products,
                please don't hesitate to contact your distributor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href={`/${params.username}/products`}>
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/${params.username}`}>
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
