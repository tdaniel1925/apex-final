'use client'

import { useEnrollment } from '@/lib/store/enrollment'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'


export function AutoshipStep() {
  const { data, updateData } = useEnrollment()

  // Sample products (would come from database)
  const products = [
    { id: 1, name: 'Premium Wellness Pack', price: 99.99, popular: true },
    { id: 2, name: 'Energy Boost Formula', price: 49.99 },
    { id: 3, name: 'Immunity Support', price: 59.99, popular: true },
    { id: 4, name: 'Weight Management System', price: 129.99 },
    { id: 5, name: 'Sleep & Recovery', price: 44.99 },
    { id: 6, name: 'Joint Support Plus', price: 69.99 },
  ]

  const toggleProduct = (productId: number, price: number) => {
    const currentIds = data.autoshipProductIds
    const isSelected = currentIds.includes(productId)

    if (isSelected) {
      const newIds = currentIds.filter((id) => id !== productId)
      const newTotal = data.autoshipTotal - price
      updateData({
        autoshipProductIds: newIds,
        autoshipTotal: newTotal,
      })
    } else {
      updateData({
        autoshipProductIds: [...currentIds, productId],
        autoshipTotal: data.autoshipTotal + price,
      })
    }
  }

  const selectPopularPack = () => {
    const popularProducts = products.filter((p) => p.popular)
    const total = popularProducts.reduce((sum, p) => sum + p.price, 0)
    updateData({
      autoshipProductIds: popularProducts.map((p) => p.id),
      autoshipTotal: total,
    })
  }

  const meetsMinimum = data.autoshipTotal >= 100

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm mb-2">
          <strong>What is Autoship?</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Autoship is a monthly product subscription that keeps you qualified for commissions and ensures you
          always have products on hand. You can modify or cancel your autoship at any time.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
        <div>
          <p className="font-semibold">Autoship Total</p>
          <p className="text-2xl font-bold text-primary">${data.autoshipTotal.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {meetsMinimum ? (
              <span className="text-green-600 font-medium">✓ Meets $100 minimum</span>
            ) : (
              <span className="text-destructive">Minimum $100 required</span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={selectPopularPack}
        >
          Select Popular Pack
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => {
          const isSelected = data.autoshipProductIds.includes(product.id)

          return (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => toggleProduct(product.id, product.price)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(product.id, product.price)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {product.name}
                          {product.popular && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              Popular
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Ships monthly</p>
                      </div>
                      <p className="font-semibold text-lg whitespace-nowrap ml-2">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Commission Qualified:</strong> Maintain an active autoship of at least $100/month to remain
          eligible for all commission levels and bonuses.
        </p>
      </div>
    </div>
  )
}
