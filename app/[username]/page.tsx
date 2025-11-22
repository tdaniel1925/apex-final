import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getDistributor(username: string) {
  const distributor = await db.query.users.findFirst({
    where: eq(users.replicatedSiteUrl, username),
  })
  return distributor
}

export default async function ReplicatedSiteHome({
  params,
}: {
  params: { username: string }
}) {
  const distributor = await getDistributor(params.username)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Financial Future
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of successful distributors building wealth through our proven 5x9 matrix compensation plan.
            </p>
            <div className="flex gap-4 justify-center">
              <a href={`/${params.username}/enroll`}>
                <Button size="lg">Get Started Today</Button>
              </a>
              <a href={`/${params.username}/opportunity`}>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Sponsored by {distributor?.firstName} {distributor?.lastName}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Apex Affinity Group?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Proven System</CardTitle>
                <CardDescription>5x9 Forced Matrix</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our forced matrix ensures spillover from your upline, helping you build your team faster.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multiple Income Streams</CardTitle>
                <CardDescription>9 Ways to Earn</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Earn from retail sales, matrix commissions, rank bonuses, matching bonuses, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Products</CardTitle>
                <CardDescription>Premium Selection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Market high-quality products people actually want, making sales easier and more rewarding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Income Potential Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Unlimited Income Potential</h2>
            <p className="text-lg text-muted-foreground mb-8">
              With our 5x9 forced matrix, you can earn commissions from up to 3,906,250 positions in your downline.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">25%</div>
                <div className="text-sm text-muted-foreground">Retail Commission</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">9</div>
                <div className="text-sm text-muted-foreground">Matrix Levels</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">10</div>
                <div className="text-sm text-muted-foreground">Rank Levels</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Matching Levels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product placeholders - will be replaced with real products */}
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="aspect-square bg-muted" />
                <CardHeader>
                  <CardTitle>Product {i}</CardTitle>
                  <CardDescription>$99.99</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-quality product description goes here.
                  </p>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href={`/${params.username}/products`}>
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>Diamond Ambassador</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  "In just 18 months, I went from struggling to pay bills to earning a six-figure income.
                  The forced matrix and spillover system is real!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>Executive Director</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  "I finally found a company with products I believe in and a compensation plan that actually works.
                  Best decision I ever made."
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <a href={`/${params.username}/testimonials`}>
              <Button variant="outline" size="lg">
                Read More Stories
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join {distributor?.firstName}'s team today and start building your financial freedom.
            </p>
            <a href={`/${params.username}/enroll`}>
              <Button size="lg" variant="secondary">
                Enroll Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
