import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

async function getDistributor(username: string) {
  const distributor = await db.query.users.findFirst({
    where: eq(users.replicatedSiteUrl, username),
  })
  return distributor
}

export default async function AboutPage({
  params,
}: {
  params: { username: string }
}) {
  const distributor = await getDistributor(params.username)

  if (!distributor) {
    notFound()
  }

  const values = [
    {
      title: 'Integrity',
      description: 'We operate with complete transparency and honesty in all our business practices.',
      icon: '🤝',
    },
    {
      title: 'Excellence',
      description: 'We are committed to providing the highest quality products and business opportunity.',
      icon: '⭐',
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our products, compensation plan, and distributor tools.',
      icon: '💡',
    },
    {
      title: 'Community',
      description: 'We build lasting relationships and support each other\'s success.',
      icon: '🤗',
    },
    {
      title: 'Empowerment',
      description: 'We provide the training, tools, and support to help everyone succeed.',
      icon: '🚀',
    },
    {
      title: 'Sustainability',
      description: 'We focus on long-term growth and residual income, not quick fixes.',
      icon: '🌱',
    },
  ]

  const leadership = [
    {
      name: 'Michael Stevens',
      title: 'Founder & CEO',
      bio: '20+ years in network marketing, built multiple 7-figure organizations',
      image: null,
    },
    {
      name: 'Sarah Martinez',
      title: 'Chief Product Officer',
      bio: 'Former pharmaceutical executive, passionate about wellness innovation',
      image: null,
    },
    {
      name: 'David Chen',
      title: 'VP of Distributor Success',
      bio: 'Top field leader turned corporate, dedicated to distributor training',
      image: null,
    },
    {
      name: 'Jennifer Washington',
      title: 'Chief Financial Officer',
      bio: 'Ensures timely commission payments and financial stability',
      image: null,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              About Apex Affinity Group
            </h1>
            <p className="text-xl text-muted-foreground">
              Building wealth, health, and freedom through proven products and a revolutionary compensation plan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                To empower individuals and families to achieve financial freedom and optimal wellness through premium products, a fair compensation plan, and a supportive community of like-minded entrepreneurs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
                <p className="text-muted-foreground">
                  Science-backed formulations that deliver real results
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Fair Compensation</h3>
                <p className="text-muted-foreground">
                  Industry-leading payouts with multiple income streams
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold mb-2">Proven System</h3>
                <p className="text-muted-foreground">
                  Turn-key business with training and support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>2018 - The Beginning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Founded by network marketing veteran Michael Stevens with a vision to create a company that truly puts distributors first. After years of seeing unfair compensation plans and subpar products in the industry, Michael assembled a team of experts to build something better.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2019 - Product Launch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Launched our first line of premium wellness products after 18 months of research and development. Our flagship Premium Wellness Pack quickly became a bestseller, with customers reporting incredible results.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2020 - Revolutionary Comp Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Introduced the 5x9 Forced Matrix compensation plan, designed to create spillover and help new distributors succeed faster. This innovation set us apart from traditional MLM companies and created unprecedented team growth.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2021-2023 - Rapid Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Expanded product line to 25+ items across health, wellness, and beauty categories. Grew to over 50,000 active distributors across all 50 states. Paid out over $100 million in commissions to our field.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2024 - Recognition & Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recognized as one of the fastest-growing direct sales companies. Launched advanced distributor tools and mobile app. Introduced enhanced rank bonuses and matching levels. Welcomed our first Ambassador-rank distributors.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2025 - The Future</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Expanding internationally with launches planned in Canada, UK, and Australia. Developing next-generation wellness products with cutting-edge technology. Committed to creating 1,000+ six-figure earners by 2026.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardHeader>
                    <div className="text-4xl mb-2">{value.icon}</div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadership.map((leader) => (
                <Card key={leader.name}>
                  <CardHeader>
                    <div className="w-24 h-24 bg-muted rounded-full mb-4" />
                    <CardTitle>{leader.name}</CardTitle>
                    <CardDescription>{leader.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{leader.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Apex */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Apex Affinity Group?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Proven Track Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 7+ years in business</li>
                    <li>• 50,000+ active distributors</li>
                    <li>• $100M+ in commissions paid</li>
                    <li>• A+ BBB rating</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry-Leading Compensation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 25% retail commission</li>
                    <li>• 9-level matrix bonuses</li>
                    <li>• Up to $50K rank bonuses</li>
                    <li>• 3 levels of matching bonuses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Science-backed formulations</li>
                    <li>• Third-party tested</li>
                    <li>• Money-back guarantee</li>
                    <li>• High customer retention (78%)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free training & certification</li>
                    <li>• Marketing materials provided</li>
                    <li>• Replicated website included</li>
                    <li>• 24/7 support team</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forced Matrix System</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Spillover from upline</li>
                    <li>• Faster team building</li>
                    <li>• Everyone benefits from growth</li>
                    <li>• Fair and transparent</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Stability</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Debt-free company</li>
                    <li>• On-time commission payments</li>
                    <li>• Strong leadership team</li>
                    <li>• Long-term growth focus</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Apex by the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-sm opacity-90">Active Distributors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$100M+</div>
                <div className="text-sm opacity-90">Commissions Paid</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">7+</div>
                <div className="text-sm opacity-90">Years in Business</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">78%</div>
                <div className="text-sm opacity-90">Customer Retention</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-sm opacity-90">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50</div>
                <div className="text-sm opacity-90">States Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-sm opacity-90">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-90">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Join a Company You Can Believe In</h2>
            <p className="text-lg text-muted-foreground mb-8">
              With proven products, fair compensation, and unwavering support, Apex Affinity Group is the opportunity you've been looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`/${params.username}/enroll`}>
                <Button size="lg">
                  Get Started Today
                </Button>
              </a>
              <a href={`/${params.username}/opportunity`}>
                <Button size="lg" variant="outline">
                  Learn More About the Opportunity
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
