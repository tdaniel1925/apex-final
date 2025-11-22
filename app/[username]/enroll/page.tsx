'use client'

import { useEnrollment } from '@/lib/store/enrollment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PersonalInfoStep } from '@/components/enrollment/personal-info-step'
import { AddressStep } from '@/components/enrollment/address-step'
import { AccountSetupStep } from '@/components/enrollment/account-setup-step'
import { SponsorStep } from '@/components/enrollment/sponsor-step'
import { AutoshipStep } from '@/components/enrollment/autoship-step'
import { PaymentTaxStep } from '@/components/enrollment/payment-tax-step'
import { CheckCircle2 } from 'lucide-react'

type EnrollPageProps = {
  params: { username: string }
}

export default function EnrollPage({ params }: EnrollPageProps) {
  const { currentStep, nextStep, prevStep, canProceed, reset } = useEnrollment()

  const handleComplete = async () => {
    if (currentStep === 6 && canProceed(6)) {
      // In real implementation, submit enrollment data to API
      // const response = await fetch('/api/enrollment', {
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset enrollment state
      reset()

      // Redirect to success page
      window.location.href = `/${params.username}/enroll/success`
    }
  }

  const steps = [
    { number: 1, title: 'Personal Info', component: PersonalInfoStep },
    { number: 2, title: 'Address', component: AddressStep },
    { number: 3, title: 'Account Setup', component: AccountSetupStep },
    { number: 4, title: 'Sponsor', component: SponsorStep },
    { number: 5, title: 'Autoship', component: AutoshipStep },
    { number: 6, title: 'Payment & Tax', component: PaymentTaxStep },
  ]

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Join Apex Affinity Group</h1>
            <p className="text-xl text-muted-foreground">
              Complete your enrollment to start earning today
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step.number < currentStep
                          ? 'bg-green-500 text-white'
                          : step.number === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="text-xs mt-2 text-center hidden sm:block">
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 transition-colors ${
                        step.number < currentStep ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Tell us about yourself'}
                {currentStep === 2 && 'Where should we send your commissions?'}
                {currentStep === 3 && 'Create your distributor account'}
                {currentStep === 4 && 'Who referred you to Apex?'}
                {currentStep === 5 && 'Select your monthly autoship products (minimum $100)'}
                {currentStep === 6 && 'Complete payment and tax information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Step Component */}
              <CurrentStepComponent sponsorUsername={params.username} />

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel enrollment?')) {
                        window.location.href = `/${params.username}`
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={currentStep === 6 ? handleComplete : nextStep}
                    disabled={!canProceed(currentStep)}
                  >
                    {currentStep === 6 ? 'Complete Enrollment' : 'Next Step'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Need help? Contact your sponsor or email{' '}
              <a href="mailto:support@apexaffinitygroup.com" className="text-primary hover:underline">
                support@apexaffinitygroup.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
