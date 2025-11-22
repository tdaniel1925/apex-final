'use client'

import { useEnrollment } from '@/lib/store/enrollment'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Upload, FileText, CheckCircle2, CreditCard, Loader2 } from 'lucide-react'

export function PaymentTaxStep() {
  const { data, updateData } = useEnrollment()
  const [uploadingTax, setUploadingTax] = useState(false)
  const [settingUpPayment, setSettingUpPayment] = useState(false)

  const handleTaxFormUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingTax(true)

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, upload to S3 or similar
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload/tax-form', { method: 'POST', body: formData })
      // const { url } = await response.json()

      updateData({
        taxFormUploaded: true,
        taxFormUrl: 'https://example.com/tax-forms/w9-12345.pdf', // Mock URL
      })
    } catch (error) {
      alert('Failed to upload tax form. Please try again.')
    } finally {
      setUploadingTax(false)
    }
  }

  const setupPaymentMethod = async () => {
    setSettingUpPayment(true)

    try {
      // Simulate Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, create Stripe checkout session
      // const response = await fetch('/api/stripe/create-setup-intent')
      // const { clientSecret } = await response.json()
      // Redirect to Stripe or use Elements

      updateData({
        paymentMethodId: 'pm_mock_1234567890', // Mock payment method ID
      })
    } catch (error) {
      alert('Failed to set up payment method. Please try again.')
    } finally {
      setSettingUpPayment(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tax Form Upload */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">W-9 Tax Form</h3>
            <p className="text-sm text-muted-foreground mb-4">
              As an independent contractor, you need to provide a completed W-9 form for tax purposes.
              Download the form, fill it out, and upload it here.
            </p>

            {!data.taxFormUploaded ? (
              <div className="space-y-3">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://www.irs.gov/pub/irs-pdf/fw9.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download W-9 Form
                  </a>
                </Button>

                <div>
                  <Label htmlFor="tax-form-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors inline-flex">
                      {uploadingTax ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload Completed W-9</span>
                        </>
                      )}
                    </div>
                  </Label>
                  <input
                    id="tax-form-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleTaxFormUpload}
                    className="hidden"
                    disabled={uploadingTax}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">W-9 Form Uploaded Successfully</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Setup */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set up your payment method for your monthly autoship. We use Stripe for secure payment processing.
            </p>

            {!data.paymentMethodId ? (
              <Button
                onClick={setupPaymentMethod}
                disabled={settingUpPayment}
              >
                {settingUpPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Set Up Payment Method
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Payment Method Added</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-6 bg-muted/50">
        <h3 className="font-semibold text-lg mb-4">Enrollment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>First Autoship Order</span>
            <span className="font-medium">${data.autoshipTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Enrollment Fee</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Starter Kit</span>
            <span className="font-medium">FREE</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Due Today</span>
              <span className="text-primary">${data.autoshipTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={data.agreedToTerms}
            onCheckedChange={(checked) =>
              updateData({ agreedToTerms: checked as boolean })
            }
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I agree to the{' '}
            <a href="/policies/terms" target="_blank" className="text-primary hover:underline">
              Terms of Service
            </a>
            ,{' '}
            <a href="/policies/distributor-agreement" target="_blank" className="text-primary hover:underline">
              Distributor Agreement
            </a>
            , and{' '}
            <a href="/policies/privacy" target="_blank" className="text-primary hover:underline">
              Privacy Policy
            </a>
            . I understand I am enrolling as an independent distributor and will receive monthly autoship
            products.
          </Label>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-900 dark:text-green-100">
          <strong>You're almost done!</strong> Click "Complete Enrollment" below to finish your registration
          and start building your business!
        </p>
      </div>
    </div>
  )
}
