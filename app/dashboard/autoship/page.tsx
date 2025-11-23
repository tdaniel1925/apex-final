'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Repeat,
  Plus,
  Trash2,
  Pause,
  Play,
  Calendar,
  Package,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

interface AutoshipSubscription {
  id: string
  userId: string
  name: string
  status: string
  frequency: string
  dayOfMonth: string | null
  dayOfWeek: string | null
  products: Array<{
    productId: string
    quantity: number
    price: string
  }>
  subtotal: string
  tax: string
  shipping: string
  total: string
  paymentMethodId: string | null
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  nextRunDate: Date
  lastRunDate: Date | null
  failedAttempts: string
  lastFailureReason: string | null
  createdAt: Date
  updatedAt: Date
  cancelledAt: Date | null
}

export default function AutoshipPage() {
  const [subscriptions, setSubscriptions] = useState<AutoshipSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // TODO: Replace with actual user ID from auth
  const userId = '00000000-0000-0000-0000-000000000001'

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/autoship?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseResume = async (subscriptionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'

    try {
      const response = await fetch('/api/autoship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        await fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
    }
  }

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return

    try {
      const response = await fetch('/api/autoship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          status: 'cancelled',
        }),
      })

      if (response.ok) {
        await fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    }
  }

  const handleDelete = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return

    try {
      const response = await fetch(`/api/autoship?subscriptionId=${subscriptionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case 'paused':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly'
      case 'biweekly':
        return 'Bi-weekly'
      case 'monthly':
        return 'Monthly'
      case 'quarterly':
        return 'Quarterly'
      default:
        return frequency
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active')
  const pausedSubscriptions = subscriptions.filter((s) => s.status === 'paused')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Autoship Management</h1>
          <p className="text-muted-foreground">
            Manage recurring orders and never run out of your favorite products
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Autoship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Autoship</DialogTitle>
              <DialogDescription>
                Set up a recurring order for automatic delivery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subscription Name</Label>
                <Input placeholder="e.g., Monthly Wellness Pack" className="mt-1" />
              </div>

              <div>
                <Label>Frequency</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Day of Month</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TODO: Add product selection */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Product selection interface will be added here
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setCreateDialogOpen(false)}>Create Autoship</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pausedSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {activeSubscriptions
                .reduce((sum, sub) => {
                  if (sub.frequency === 'monthly') {
                    return sum + parseFloat(sub.total)
                  }
                  return sum
                }, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Your Subscriptions
          </CardTitle>
          <CardDescription>
            {subscriptions.length} {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Repeat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No autoship subscriptions yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Autoship
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{sub.name}</h3>
                          {getStatusBadge(sub.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {getFrequencyLabel(sub.frequency)}
                            {sub.dayOfMonth && ` on day ${sub.dayOfMonth}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {sub.products.length} {sub.products.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Next delivery: </span>
                          <span className="font-medium">
                            {new Date(sub.nextRunDate).toLocaleDateString()}
                          </span>
                        </div>

                        {sub.lastFailureReason && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm max-w-md">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Last execution failed</p>
                              <p>{sub.lastFailureReason}</p>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <span className="text-2xl font-bold">${parseFloat(sub.total).toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            per {sub.frequency === 'monthly' ? 'month' : sub.frequency === 'weekly' ? 'week' : 'delivery'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status !== 'cancelled' && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePauseResume(sub.id, sub.status)}
                              title={sub.status === 'active' ? 'Pause subscription' : 'Resume subscription'}
                            >
                              {sub.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCancel(sub.id)}
                              title="Cancel subscription"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(sub.id)}
                          title="Delete subscription"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
