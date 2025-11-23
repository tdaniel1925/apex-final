'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, XCircle, Loader2, FileText, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface TaxForm {
  id: string
  userId: string
  formType: string
  taxYear: string
  legalName: string
  businessName: string | null
  taxClassification: string
  taxIdType: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  status: string
  signatureDate: Date
  createdAt: Date
  user?: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function TaxFormsPage() {
  const [taxForms, setTaxForms] = useState<TaxForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<TaxForm | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    fetchTaxForms()
  }, [statusFilter])

  const fetchTaxForms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tax-forms?status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setTaxForms(data)
      }
    } catch (error) {
      console.error('Error fetching tax forms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (formId: string) => {
    try {
      const response = await fetch('/api/admin/tax-forms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, status: 'approved' }),
      })
      if (response.ok) {
        await fetchTaxForms()
      }
    } catch (error) {
      console.error('Error approving tax form:', error)
    }
  }

  const handleReject = async () => {
    if (!selectedForm) return
    try {
      const response = await fetch('/api/admin/tax-forms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedForm.id,
          status: 'rejected',
          rejectionReason,
        }),
      })
      if (response.ok) {
        await fetchTaxForms()
        setRejectDialogOpen(false)
        setRejectionReason('')
        setSelectedForm(null)
      }
    } catch (error) {
      console.error('Error rejecting tax form:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tax Forms Management</h1>
        <p className="text-muted-foreground">Review and approve distributor W-9 forms</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'approved' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('approved')}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected
        </Button>
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
      </div>

      {/* Tax Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {taxForms.length} Form{taxForms.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {taxForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No tax forms found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distributor</TableHead>
                  <TableHead>Legal Name</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      {form.user ? `${form.user.firstName} ${form.user.lastName}` : 'Unknown'}
                    </TableCell>
                    <TableCell>{form.legalName}</TableCell>
                    <TableCell>{form.taxYear}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{form.formType.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{form.taxClassification}</TableCell>
                    <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedForm(form)
                            setDetailsDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {form.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(form.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedForm(form)
                                setRejectDialogOpen(true)
                              }}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tax Form Details</DialogTitle>
            <DialogDescription>
              {selectedForm?.formType.toUpperCase()} for {selectedForm?.taxYear}
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Legal Name</label>
                  <p>{selectedForm.legalName}</p>
                </div>
                {selectedForm.businessName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Name
                    </label>
                    <p>{selectedForm.businessName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tax Classification
                  </label>
                  <p>{selectedForm.taxClassification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tax ID Type</label>
                  <p>{selectedForm.taxIdType}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>
                    {selectedForm.address}, {selectedForm.city}, {selectedForm.state}{' '}
                    {selectedForm.zipCode}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Signature Date
                  </label>
                  <p>{new Date(selectedForm.signatureDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedForm.status)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedForm?.status === 'pending' && (
              <>
                <Button onClick={() => {
                  if (selectedForm) handleApprove(selectedForm.id)
                  setDetailsDialogOpen(false)
                }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false)
                    setRejectDialogOpen(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Tax Form</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this tax form
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectionReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false)
                setRejectionReason('')
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
