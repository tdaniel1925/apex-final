import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Users, TrendingUp, Award, DollarSign, CheckCircle } from 'lucide-react'

export default function DemoReplicatedSitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Apex Affinity</h1>
              <p className="text-sm text-muted-foreground">Your Success Partner: John Smith</p>
            </div>
            <div className="flex gap-4">
              <Link href="/demo">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/demo/opportunity">
                <Button variant="ghost">Opportunity</Button>
              </Link>
              <Link href="/demo/products">
                <Button variant="ghost">Products</Button>
              </Link>
              <Link href="/demo/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/demo/enroll">
                <Button>Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Build Your Financial Freedom with Apex Affinity
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of successful entrepreneurs earning unlimited income through our proven business model
            </p>
            <div className="flex gap-4">
              <Link href="/demo/opportunity">
                <Button size="lg">
                  View Opportunity
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo/products">
                <Button size="lg" variant="outline">
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Users className="h-24 w-24 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/80">Active Distributors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$50M+</div>
              <div className="text-primary-foreground/80">Paid in Commissions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-primary-foreground/80">Years in Business</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Join Apex Affinity?</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to succeed in network marketing
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Earning Potential</h3>
              <p className="text-muted-foreground">
                No income cap - earn as much as you want with our generous compensation plan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Build Your Team</h3>
              <p className="text-muted-foreground">
                Recruit and train your own team of distributors to multiply your income
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Training</h3>
              <p className="text-muted-foreground">
                Access world-class training materials, mentorship, and ongoing support
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Income Examples */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Real Income Potential</h2>
            <p className="text-xl text-muted-foreground">
              See what you could earn at different rank levels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-700 mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Bronze</h3>
                  <p className="text-3xl font-bold text-primary mb-4">$2,000/mo</p>
                  <ul className="text-sm text-left space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Retail commissions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Level 1 bonuses
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 text-gray-700 mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Silver</h3>
                  <p className="text-3xl font-bold text-primary mb-4">$5,000/mo</p>
                  <ul className="text-sm text-left space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      All Bronze benefits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Level 2-3 bonuses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Matching bonus
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-700 mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Gold</h3>
                  <p className="text-3xl font-bold text-primary mb-4">$15,000+/mo</p>
                  <ul className="text-sm text-left space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      All Silver benefits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Level 4-5 bonuses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Leadership pool
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join my team today and let me help you achieve your financial goals
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/demo/opportunity">
                <Button size="lg" variant="secondary">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo/enroll">
                <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Join Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Apex Affinity</h3>
              <p className="text-sm text-muted-foreground">
                Building financial freedom through network marketing excellence
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/demo" className="text-muted-foreground hover:text-primary">Home</Link></li>
                <li><Link href="/demo/opportunity" className="text-muted-foreground hover:text-primary">Opportunity</Link></li>
                <li><Link href="/demo/products" className="text-muted-foreground hover:text-primary">Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/demo/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/demo/testimonials" className="text-muted-foreground hover:text-primary">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Your Sponsor: John Smith<br />
                Email: john@example.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Apex Affinity. All rights reserved. This is a replicated site for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
