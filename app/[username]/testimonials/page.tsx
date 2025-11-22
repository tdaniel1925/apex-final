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

export default async function TestimonialsPage({
  params,
}: {
  params: { username: string }
}) {
  const distributor = await getDistributor(params.username)

  if (!distributor) {
    notFound()
  }

  // Testimonials will be loaded from database in next iteration
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      rank: 'Gold Director',
      location: 'Austin, TX',
      joinDate: 'January 2023',
      monthlyIncome: '$8,500',
      image: null,
      quote: 'I was skeptical at first, but the products sell themselves and the compensation plan is incredibly generous. Within 6 months, I was earning more than my corporate job.',
      beforeIncome: '$3,200/month',
      afterIncome: '$8,500/month',
      timeframe: '9 months',
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      rank: 'Platinum Executive',
      location: 'Miami, FL',
      joinDate: 'March 2022',
      monthlyIncome: '$15,200',
      image: null,
      quote: 'This opportunity changed my life. I went from working 60-hour weeks to having complete time freedom while earning significantly more. The matrix system creates passive income that keeps growing.',
      beforeIncome: '$4,800/month',
      afterIncome: '$15,200/month',
      timeframe: '18 months',
    },
    {
      id: 3,
      name: 'Jennifer Lee',
      rank: 'Diamond Leader',
      location: 'Seattle, WA',
      joinDate: 'August 2021',
      monthlyIncome: '$32,000',
      image: null,
      quote: 'I hit Diamond in just 2 years. The training and support from my upline was incredible, and the forced matrix means I benefit from the entire team\'s growth. This is the real deal.',
      beforeIncome: '$5,500/month',
      afterIncome: '$32,000/month',
      timeframe: '2 years',
    },
    {
      id: 4,
      name: 'David Rodriguez',
      rank: 'Silver Associate',
      location: 'Phoenix, AZ',
      joinDate: 'September 2024',
      monthlyIncome: '$2,800',
      image: null,
      quote: 'Just started 3 months ago and already earning part-time income. The products are fantastic and my customers love them. Excited to see where this goes!',
      beforeIncome: '$0/month',
      afterIncome: '$2,800/month',
      timeframe: '3 months',
    },
    {
      id: 5,
      name: 'Amanda Chen',
      rank: 'Gold Director',
      location: 'San Francisco, CA',
      joinDate: 'May 2023',
      monthlyIncome: '$9,200',
      image: null,
      quote: 'As a busy mom, I needed something flexible. This business lets me work around my family\'s schedule while building real wealth. The residual income is life-changing.',
      beforeIncome: '$0/month',
      afterIncome: '$9,200/month',
      timeframe: '12 months',
    },
    {
      id: 6,
      name: 'Robert Thompson',
      rank: 'Platinum Executive',
      location: 'Chicago, IL',
      joinDate: 'November 2022',
      monthlyIncome: '$18,500',
      image: null,
      quote: 'I\'ve tried other MLMs and this is by far the best. The 5x9 matrix creates spillover that accelerates growth, and the rank bonuses are substantial. Highly recommend.',
      beforeIncome: '$6,000/month',
      afterIncome: '$18,500/month',
      timeframe: '20 months',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground">
              Real people, real results. See how Apex Affinity Group has transformed lives across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Success Story */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-primary mb-2">FEATURED SUCCESS STORY</div>
                  <h2 className="text-3xl font-bold mb-2">Jennifer Lee</h2>
                  <div className="text-lg text-muted-foreground mb-4">
                    Diamond Leader • Seattle, WA • Member since August 2021
                  </div>
                  <blockquote className="text-lg italic mb-6 border-l-4 border-primary pl-4">
                    "I hit Diamond in just 2 years. The training and support from my upline was incredible, and the forced matrix means I benefit from the entire team's growth. This is the real deal."
                  </blockquote>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">$5,500</div>
                      <div className="text-sm text-muted-foreground">Before</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl">→</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">$32,000</div>
                      <div className="text-sm text-muted-foreground">After (Monthly)</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Timeframe: 2 years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">More Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col">
                <CardHeader>
                  <div className="w-20 h-20 bg-muted rounded-full mb-4" />
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>
                    {testimonial.rank} • {testimonial.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <blockquote className="text-sm italic mb-4 flex-1 text-muted-foreground">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Before:</span>
                      <span className="font-semibold">{testimonial.beforeIncome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">After:</span>
                      <span className="font-semibold text-primary">{testimonial.afterIncome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Timeframe:</span>
                      <span className="text-sm">{testimonial.timeframe}</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      Member since {testimonial.joinDate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Video Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((video) => (
              <div key={video} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-8 border-l-primary border-y-6 border-y-transparent ml-1" />
                  </div>
                  <div className="text-sm text-muted-foreground">Video testimonial coming soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Progression Chart */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Average Income Progression</h2>
            <Card>
              <CardHeader>
                <CardTitle>Typical Income Growth Over 24 Months</CardTitle>
                <CardDescription>
                  Based on active distributors who follow the recommended action plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'Month 1-3', income: '$500-$1,500', description: 'Getting started, learning products' },
                    { month: 'Month 4-6', income: '$1,500-$3,500', description: 'Building customer base, first team members' },
                    { month: 'Month 7-12', income: '$3,500-$7,000', description: 'Team growth, matrix filling, rank advancement' },
                    { month: 'Month 13-18', income: '$7,000-$15,000', description: 'Leadership development, residual income building' },
                    { month: 'Month 19-24', income: '$15,000-$30,000+', description: 'Established team, multiple income streams, high ranks' },
                  ].map((stage, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-32">
                        <div className="font-semibold">{stage.month}</div>
                      </div>
                      <div className="flex-shrink-0 w-40">
                        <div className="text-xl font-bold text-primary">{stage.income}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> These results are not typical and should not be considered average earnings. Individual results vary based on effort, commitment, and market conditions. Your success depends on your individual effort, business skills, and personal circumstances.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-primary text-primary-foreground rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of successful distributors building wealth and freedom with Apex Affinity Group.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`/${params.username}/enroll`}>
                <Button size="lg" variant="secondary">
                  Start Your Journey Today
                </Button>
              </a>
              <a href={`/${params.username}/opportunity`}>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Learn About the Opportunity
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
