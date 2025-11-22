import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OpportunityPage({
  params,
}: {
  params: { username: string }
}) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              The Apex Opportunity
            </h1>
            <p className="text-xl text-muted-foreground">
              A proven system designed to help you achieve financial freedom
            </p>
          </div>
        </div>
      </section>

      {/* Compensation Plan Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Compensation Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retail Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">25%</div>
                <p className="text-sm text-muted-foreground">
                  Earn 25% commission on all personal retail sales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matrix Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">9 Levels</div>
                <p className="text-sm text-muted-foreground">
                  Earn from 9 levels deep in your 5x9 forced matrix
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rank Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">$50K+</div>
                <p className="text-sm text-muted-foreground">
                  Earn up to $50,000 in one-time rank advancement bonuses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matching Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">Up to 10%</div>
                <p className="text-sm text-muted-foreground">
                  Earn matching bonuses on your team's earnings
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5x9 Matrix Explanation */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Understanding the 5x9 Forced Matrix
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">What is a Forced Matrix?</h3>
                    <p className="text-muted-foreground">
                      A forced matrix limits the number of distributors you can sponsor on your first level (5 in our case).
                      Any additional people you sponsor "spill over" to the next available position in your downline,
                      helping your entire team grow.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Spillover Benefits</h3>
                    <p className="text-muted-foreground">
                      When your upline sponsors more than 5 people, the extras are placed under you automatically.
                      This means you can benefit from the work of successful leaders above you.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">9 Levels of Depth</h3>
                    <p className="text-muted-foreground">
                      You earn commissions from 9 levels deep. With 5 on each level, your potential downline is massive:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                      <li>Level 1: 5 positions</li>
                      <li>Level 2: 25 positions</li>
                      <li>Level 3: 125 positions</li>
                      <li>Level 4: 625 positions</li>
                      <li>Level 5: 3,125 positions</li>
                      <li>Level 6: 15,625 positions</li>
                      <li>Level 7: 78,125 positions</li>
                      <li>Level 8: 390,625 positions</li>
                      <li>Level 9: 1,953,125 positions</li>
                    </ul>
                    <p className="text-sm font-semibold mt-2">
                      Total Potential: 2,441,406 positions!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rank Advancement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Rank Advancement Path</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { rank: 'Bronze', bonus: '$0', requirements: 'Get started' },
              { rank: 'Silver', bonus: '$500', requirements: '5 personal, $1,000 team sales' },
              { rank: 'Gold', bonus: '$1,000', requirements: '10 personal, $5,000 team sales' },
              { rank: 'Platinum', bonus: '$2,500', requirements: '15 personal, $15,000 team sales' },
              { rank: 'Ruby', bonus: '$5,000', requirements: '20 personal, $35,000 team sales' },
              { rank: 'Emerald', bonus: '$10,000', requirements: '25 personal, $75,000 team sales' },
              { rank: 'Diamond', bonus: '$15,000', requirements: '30 personal, $150,000 team sales' },
              { rank: 'Executive', bonus: '$25,000', requirements: '40 personal, $300,000 team sales' },
              { rank: 'Director', bonus: '$35,000', requirements: '50 personal, $600,000 team sales' },
              { rank: 'Ambassador', bonus: '$50,000', requirements: '75 personal, $1,200,000 team sales' },
            ].map((rank) => (
              <Card key={rank.rank}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{rank.rank}</CardTitle>
                      <CardDescription>{rank.requirements}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{rank.bonus}</div>
                      <div className="text-sm text-muted-foreground">Rank Bonus</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Income Calculator */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Income Potential Calculator
            </h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-center text-muted-foreground mb-6">
                  Example: If you have just 100 active customers in your matrix spending $100/month
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded">
                    <span>Matrix Commissions (5% avg)</span>
                    <span className="font-bold">$500/month</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded">
                    <span>Personal Sales (25%)</span>
                    <span className="font-bold">$250/month</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded">
                    <span>Matching Bonuses (10%)</span>
                    <span className="font-bold">$100/month</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded font-bold text-lg">
                    <span>Total Monthly Income</span>
                    <span>$850/month</span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  * Results may vary. Actual earnings depend on effort and market conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of successful distributors building their financial future with Apex Affinity Group.
            </p>
            <a href={`/${params.username}/enroll`}>
              <Button size="lg">Enroll Now</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
