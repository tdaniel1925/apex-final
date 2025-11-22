'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ExternalLink, Download, Mail, Video, BookOpen } from 'lucide-react'
import confetti from 'canvas-confetti'

type SuccessPageProps = {
  params: { username: string }
}

export default function EnrollmentSuccessPage({ params }: SuccessPageProps) {
  const [email] = useState('user@example.com')

  useEffect(() => {
    // Fire confetti on page load
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      })
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-primary/5 to-secondary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Apex Affinity Group!</h1>
            <p className="text-xl text-muted-foreground">
              Congratulations! Your enrollment is complete.
            </p>
          </div>

          {/* Confirmation Card */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-primary/5 dark:from-green-950 dark:to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Enrollment Confirmed
              </CardTitle>
              <CardDescription>
                You're officially part of the Apex family!
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Welcome Email Sent</p>
                    <p className="text-sm text-muted-foreground">
                      Check your inbox at <strong>{email}</strong> for your login credentials and
                      getting started guide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">First Autoship Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      Your products will ship within 24-48 hours. You'll receive tracking information via email.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Replicated Website Created</p>
                    <p className="text-sm text-muted-foreground">
                      Your personal business website is ready at{' '}
                      <a href="/" className="text-primary hover:underline">
                        apexaffinitygroup.com/yourusername
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Next Steps</CardTitle>
              <CardDescription>
                Follow these steps to get your business up and running
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Access Your Back Office</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Log in to your dashboard to explore your tools, track commissions, and manage your team.
                    </p>
                    <Button size="sm">
                      Go to Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Complete New Distributor Training</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Watch our comprehensive training videos to learn the compensation plan, product knowledge, and
                      recruiting strategies.
                    </p>
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Start Training
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Download Your Starter Kit</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get marketing materials, social media templates, and recruiting scripts to kickstart your business.
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Materials
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Connect with Your Sponsor</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Schedule a call with your sponsor to create your action plan and get personalized guidance.
                    </p>
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Sponsor
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Make Your First 3 Sales</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Start sharing products with friends and family. Your first 3 sales qualify you for fast-start bonuses!
                    </p>
                    <Button size="sm" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Sales Training
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">$0</div>
                <p className="text-sm text-muted-foreground">Lifetime Commissions</p>
                <p className="text-xs text-muted-foreground mt-1">Let's change this!</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-xs text-muted-foreground mt-1">Build your empire</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Bronze</div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <p className="text-xs text-muted-foreground mt-1">Next: Silver ($500)</p>
              </CardContent>
            </Card>
          </div>

          {/* Support Section */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                We're here to support your success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Search our comprehensive help center for answers to common questions.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Browse Articles
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Live Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Chat with our support team Monday-Friday, 9 AM - 6 PM EST.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Start Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <a href={`/${params.username}`}>
                Visit Your Replicated Website
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
