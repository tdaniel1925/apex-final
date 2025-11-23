'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  FileText,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Shield,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface TaxForm {
  id: string
  userId: string
  formType: string
  taxYear: string
  legalName: string
  businessName: string | null
  taxClassification: string
  taxIdType: string
  taxIdEncrypted: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  exemptPayeeCode: string | null
  exemptionFromFatca: string | null
  signatureName: string
  signatureDate: Date
  certifiedCorrect: boolean
  documentUrl: string | null
  status: string
  approvedBy: string | null
  approvedAt: Date | null
  rejectionReason: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date | null
}

export default function TaxFormsPage() {
  const [forms, setForms] = useState<TaxForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    formType: 'w9',
    taxYear: new Date().getFullYear().toString(),
    legalName: '',
    businessName: '',
    taxClassification: 'individual',
    taxIdType: 'ssn',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    exemptPayeeCode: '',
    exemptionFromFatca: '',
    certifyCorrect: false,
  })

  // TODO: Replace with actual user ID from auth
  const userId = '00000000-0000-0000-0000-000000000001'

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tax-forms?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setForms(data)
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.legalName || !formData.taxId || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.certifyCorrect) {
      alert('You must certify that the information is correct')
      return
    }

    // Validate tax ID format
    const cleanTaxId = formData.taxId.replace(/[-\s]/g, '')
    if (formData.taxIdType === 'ssn' && cleanTaxId.length !== 9) {
      alert('Please enter a valid 9-digit SSN')
      return
    }
    if (formData.taxIdType === 'ein' && cleanTaxId.length !== 9) {
      alert('Please enter a valid 9-digit EIN')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/tax-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          signatureName: formData.legalName,
          signatureDate: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        await fetchForms()
        setFormDialogOpen(false)
        resetForm()
        alert('W-9 form submitted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while submitting the form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      formType: 'w9',
      taxYear: new Date().getFullYear().toString(),
      legalName: '',
      businessName: '',
      taxClassification: 'individual',
      taxIdType: 'ssn',
      taxId: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      exemptPayeeCode: '',
      exemptionFromFatca: '',
      certifyCorrect: false,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatTaxId = (value: string) => {
    const clean = value.replace(/\D/g, '')
    if (formData.taxIdType === 'ssn') {
      if (clean.length <= 3) return clean
      if (clean.length <= 5) return `${clean.slice(0, 3)}-${clean.slice(3)}`
      return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5, 9)}`
    } else {
      // EIN format: XX-XXXXXXX
      if (clean.length <= 2) return clean
      return `${clean.slice(0, 2)}-${clean.slice(2, 9)}`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const currentYearForm = forms.find((f) => f.taxYear === new Date().getFullYear().toString())
  const approvedForms = forms.filter((f) => f.status === 'approved')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tax Forms</h1>
          <p className="text-muted-foreground">
            Manage your W-9 tax information for commission payments
          </p>
        </div>
        {!currentYearForm && (
          <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit W-9
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit W-9 Form</DialogTitle>
                <DialogDescription>
                  Required for tax reporting on commission payments over $600/year
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-700 rounded-lg flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Your information is secure</p>
                    <p>
                      Tax IDs are encrypted and stored securely. This information is only used for
                      IRS reporting purposes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Legal Name *</Label>
                    <Input
                      placeholder="Full legal name"
                      value={formData.legalName}
                      onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Business Name (if applicable)</Label>
                    <Input
                      placeholder="DBA or business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Tax Classification *</Label>
                    <Select
                      value={formData.taxClassification}
                      onValueChange={(value) => setFormData({ ...formData, taxClassification: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual/Sole Proprietor</SelectItem>
                        <SelectItem value="c-corp">C Corporation</SelectItem>
                        <SelectItem value="s-corp">S Corporation</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="trust-estate">Trust/Estate</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tax ID Type *</Label>
                    <Select
                      value={formData.taxIdType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, taxIdType: value, taxId: '' })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssn">SSN (Social Security Number)</SelectItem>
                        <SelectItem value="ein">EIN (Employer ID Number)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label>{formData.taxIdType === 'ssn' ? 'SSN' : 'EIN'} *</Label>
                    <Input
                      placeholder={formData.taxIdType === 'ssn' ? 'XXX-XX-XXXX' : 'XX-XXXXXXX'}
                      value={formData.taxId}
                      onChange={(e) =>
                        setFormData({ ...formData, taxId: formatTaxId(e.target.value) })
                      }
                      maxLength={formData.taxIdType === 'ssn' ? 11 : 10}
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Address *</Label>
                    <Input
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>City *</Label>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>State *</Label>
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Zip Code *</Label>
                    <Input
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Country *</Label>
                    <Input value={formData.country} disabled className="mt-1" />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-4">
                  <Checkbox
                    id="certify"
                    checked={formData.certifyCorrect}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, certifyCorrect: checked as boolean })
                    }
                  />
                  <Label htmlFor="certify" className="text-sm font-normal leading-relaxed">
                    Under penalties of perjury, I certify that the information provided is true,
                    correct, and complete. I understand this form will be used for tax reporting
                    purposes.
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || !formData.certifyCorrect}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit W-9'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Warning if no approved form */}
      {approvedForms.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">W-9 Form Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You must submit and have an approved W-9 form on file to receive commission
                  payments. This is required by the IRS for tax reporting purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forms List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your W-9 Forms
          </CardTitle>
          <CardDescription>
            {forms.length} {forms.length === 1 ? 'form' : 'forms'} on file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tax forms submitted yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setFormDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First W-9
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <Card key={form.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {form.formType.toUpperCase()} - Tax Year {form.taxYear}
                          </h3>
                          {getStatusBadge(form.status)}
                        </div>

                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Name:</span>{' '}
                            <span className="font-medium">{form.legalName}</span>
                          </p>
                          {form.businessName && (
                            <p>
                              <span className="text-muted-foreground">Business:</span>{' '}
                              {form.businessName}
                            </p>
                          )}
                          <p>
                            <span className="text-muted-foreground">Tax ID:</span>{' '}
                            {form.taxIdEncrypted}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Address:</span> {form.city},{' '}
                            {form.state} {form.zipCode}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Submitted:</span>{' '}
                            {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                          {form.expiresAt && (
                            <p>
                              <span className="text-muted-foreground">Expires:</span>{' '}
                              {new Date(form.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {form.status === 'rejected' && form.rejectionReason && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm max-w-md mt-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Form rejected</p>
                              <p>{form.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
