import { Button } from '@/components/ui/button'
import { ProductCatalog } from '@/components/products/product-catalog'

export default function ProductsPage({
  params,
}: {
  params: { username: string }
}) {
  // Products will be loaded from database in next iteration
  const products = [
    {
      id: 1,
      name: 'Premium Wellness Pack',
      price: 99.99,
      category: 'Health & Wellness',
      description: 'Complete daily wellness solution with vitamins and supplements',
      commissionValue: 99.99,
    },
    {
      id: 2,
      name: 'Energy Boost Formula',
      price: 49.99,
      category: 'Health & Wellness',
      description: 'Natural energy supplement for sustained performance',
      commissionValue: 49.99,
    },
    {
      id: 3,
      name: 'Beauty Essentials Kit',
      price: 79.99,
      category: 'Beauty',
      description: 'Premium skincare and beauty products',
      commissionValue: 79.99,
    },
    {
      id: 4,
      name: 'Immunity Support',
      price: 59.99,
      category: 'Health & Wellness',
      description: 'Boost your immune system naturally',
      commissionValue: 59.99,
    },
    {
      id: 5,
      name: 'Weight Management System',
      price: 129.99,
      category: 'Health & Wellness',
      description: 'Complete system for healthy weight management',
      commissionValue: 129.99,
    },
    {
      id: 6,
      name: 'Sleep & Recovery',
      price: 44.99,
      category: 'Health & Wellness',
      description: 'Natural sleep aid and recovery support',
      commissionValue: 44.99,
    },
    {
      id: 7,
      name: 'Anti-Aging Serum',
      price: 89.99,
      category: 'Beauty',
      description: 'Advanced anti-aging formula for youthful skin',
      commissionValue: 89.99,
    },
    {
      id: 8,
      name: 'Hair Growth Formula',
      price: 54.99,
      category: 'Beauty',
      description: 'Strengthen and grow healthier hair naturally',
      commissionValue: 54.99,
    },
    {
      id: 9,
      name: 'Joint Support Plus',
      price: 69.99,
      category: 'Health & Wellness',
      description: 'Maintain healthy joints and flexibility',
      commissionValue: 69.99,
    },
    {
      id: 10,
      name: 'Organic Face Cream',
      price: 64.99,
      category: 'Personal Care',
      description: 'Nourishing organic face moisturizer',
      commissionValue: 64.99,
    },
    {
      id: 11,
      name: 'Natural Deodorant',
      price: 19.99,
      category: 'Personal Care',
      description: 'Aluminum-free natural protection',
      commissionValue: 19.99,
    },
    {
      id: 12,
      name: 'Body Scrub Set',
      price: 39.99,
      category: 'Personal Care',
      description: 'Exfoliating body scrubs for smooth skin',
      commissionValue: 39.99,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Premium Products
            </h1>
            <p className="text-xl text-muted-foreground">
              High-quality products backed by science and trusted by thousands
            </p>
          </div>
        </div>
      </section>

      {/* Product Catalog with Filtering & Search */}
      <ProductCatalog products={products} username={params.username} />

      {/* Why Our Products */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Products?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-sm text-muted-foreground">
                  All products are tested and certified for quality and safety
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Orders ship within 24 hours with free shipping on orders over $100
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💯</div>
                <h3 className="font-semibold mb-2">Money-Back Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  30-day satisfaction guarantee on all products
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Want to Earn While You Shop?</h2>
            <p className="text-lg mb-8 opacity-90">
              Become a distributor and earn 25% commission on all your personal sales plus team bonuses.
            </p>
            <a href={`/${params.username}/enroll`}>
              <Button size="lg" variant="secondary">
                Join as a Distributor
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
