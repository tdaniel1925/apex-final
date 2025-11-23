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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, XCircle, Loader2, DollarSign, Download, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Commission {
  id: string
  userId: string
  fromUserId: string
  orderId: string
  amount: string
  commissionType: string
  level: number
  status: string
  calculatedAt: Date
  paidAt: Date | null
  user?: {
    firstName: string
    lastName: string
    email: string
  }
  fromUser?: {
    firstName: string
    lastName: string
  }
  order?: {
    orderNumber: string
    total: string
  }
}

interface PayoutBatch {
  id: string
  name: string
  totalAmount: string
  paymentCount: number
  status: string
  createdAt: Date
  processedAt: Date | null
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [payoutBatches, setPayoutBatches] = useState<PayoutBatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [batchDialogOpen, setBatchDialogOpen] = useState(false)
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([])
  const [batchName, setBatchName] = useState('')

  useEffect(() => {
    fetchCommissions()
    fetchPayoutBatches()
  }, [statusFilter])

  const fetchCommissions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/commissions?status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setCommissions(data)
      }
    } catch (error) {
      console.error('Error fetching commissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPayoutBatches = async () => {
    try {
      const response = await fetch('/api/admin/payout-batches')
      if (response.ok) {
        const data = await response.json()
        setPayoutBatches(data)
      }
    } catch (error) {
      console.error('Error fetching payout batches:', error)
    }
  }

  const handleApprove = async (commissionId: string) => {
    try {
      const response = await fetch('/api/admin/commissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionId, status: 'approved' }),
      })
      if (response.ok) {
        await fetchCommissions()
      }
    } catch (error) {
      console.error('Error approving commission:', error)
    }
  }

  const handleReject = async (commissionId: string) => {
    try {
      const response = await fetch('/api/admin/commissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionId, status: 'rejected' }),
      })
      if (response.ok) {
        await fetchCommissions()
      }
    } catch (error) {
      console.error('Error rejecting commission:', error)
    }
  }

  const handleCreateBatch = async () => {
    try {
      const response = await fetch('/api/admin/payout-batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchName,
          commissionIds: selectedCommissions.length > 0 ? selectedCommissions : undefined,
        }),
      })
      if (response.ok) {
        await fetchCommissions()
        await fetchPayoutBatches()
        setBatchDialogOpen(false)
        setBatchName('')
        setSelectedCommissions([])
      }
    } catch (error) {
      console.error('Error creating payout batch:', error)
    }
  }

  const handleProcessBatch = async (batchId: string) => {
    try {
      const response = await fetch('/api/admin/payout-batches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId, action: 'process' }),
      })
      if (response.ok) {
        await fetchPayoutBatches()
        await fetchCommissions()
      }
    } catch (error) {
      console.error('Error processing payout batch:', error)
    }
  }

  const handleToggleSelection = (commissionId: string) => {
    setSelectedCommissions((prev) =>
      prev.includes(commissionId)
        ? prev.filter((id) => id !== commissionId)
        : [...prev, commissionId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCommissions.length === commissions.length) {
      setSelectedCommissions([])
    } else {
      setSelectedCommissions(commissions.map((c) => c.id))
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
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-700">Paid</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalPending = commissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + parseFloat(c.amount), 0)

  const totalSelected = commissions
    .filter((c) => selectedCommissions.includes(c.id))
    .reduce((sum, c) => sum + parseFloat(c.amount), 0)

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Commission Management</h1>
          <p className="text-muted-foreground">Review and approve distributor commissions</p>
        </div>
        <Button onClick={() => setBatchDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Payout Batch
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {commissions.filter((c) => c.status === 'pending').length} commission
              {commissions.filter((c) => c.status === 'pending').length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selected for Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSelected.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedCommissions.length} commission
              {selectedCommissions.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutBatches.length}</div>
            <p className="text-xs text-muted-foreground">Total payout batches</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Status Filter:</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {statusFilter === 'pending' && commissions.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedCommissions.length === commissions.length ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {commissions.length} Commission{commissions.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No commissions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {statusFilter === 'pending' && <TableHead className="w-12"></TableHead>}
                  <TableHead>Distributor</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Calculated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    {statusFilter === 'pending' && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedCommissions.includes(commission.id)}
                          onChange={() => handleToggleSelection(commission.id)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {commission.user
                        ? `${commission.user.firstName} ${commission.user.lastName}`
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {commission.fromUser
                        ? `${commission.fromUser.firstName} ${commission.fromUser.lastName}`
                        : 'Direct'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{commission.commissionType}</Badge>
                    </TableCell>
                    <TableCell>Level {commission.level}</TableCell>
                    <TableCell className="font-bold">${parseFloat(commission.amount).toFixed(2)}</TableCell>
                    <TableCell>{new Date(commission.calculatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(commission.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {commission.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(commission.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(commission.id)}
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

      {/* Payout Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payout Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {payoutBatches.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payout batches created yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Commissions</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.paymentCount}</TableCell>
                    <TableCell className="font-bold">
                      ${parseFloat(batch.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(batch.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {batch.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProcessBatch(batch.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Batch Dialog */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payout Batch</DialogTitle>
            <DialogDescription>
              Create a new payout batch for approved commissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Batch Name</Label>
              <Input
                placeholder="e.g., November 2024 Payouts"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Summary</p>
              <p className="text-xs text-muted-foreground">
                {selectedCommissions.length > 0
                  ? `${selectedCommissions.length} selected commission${
                      selectedCommissions.length !== 1 ? 's' : ''
                    }`
                  : 'All approved commissions will be included'}
              </p>
              <p className="text-sm font-bold mt-2">
                Total: ${totalSelected > 0 ? totalSelected.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBatchDialogOpen(false)
                setBatchName('')
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBatch} disabled={!batchName.trim()}>
              Create Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
