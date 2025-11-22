'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCart } from '@/lib/store/cart'
import { useToast } from '@/hooks/use-toast'

type Product = {
  id: number
  name: string
  price: number
  category: string
  description: string
  commissionValue: number
}

type ProductCatalogProps = {
  products: Product[]
  username: string
}

export function ProductCatalog({ products, username: _username }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { addItem } = useCart()
  const { toast } = useToast()

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return ['all', ...Array.from(cats)]
  }, [products])

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory

      // Search filter
      const searchMatch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())

      return categoryMatch && searchMatch
    })
  }, [products, selectedCategory, searchQuery])

  return (
    <div className="flex flex-col">
      {/* Filters & Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Products' : category}
                </Button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-6">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <div className="aspect-square bg-muted relative">
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        25% Commission
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>{product.category}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${product.price}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => {
                            addItem(product)
                            toast({
                              title: 'Added to cart',
                              description: `${product.name} has been added to your cart.`,
                            })
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
