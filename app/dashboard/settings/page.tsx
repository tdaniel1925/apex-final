'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  DollarSign,
  User,
  Bell,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'

interface ConnectAccountStatus {
  hasAccount: boolean
  accountId: string | null
  detailsSubmitted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requiresAction: boolean
  requirements?: {
    currentlyDue: string[]
    eventuallyDue: string[]
    pastDue: string[]
    disabled_reason: string | null
  }
  email?: string
  businessType?: string
  country?: string
}

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('payouts')
  const [accountStatus, setAccountStatus] = useState<ConnectAccountStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const [isOpeningDashboard, setIsOpeningDashboard] = useState(false)

  useEffect(() => {
    // Check for tab parameter
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }

    // Check for success/refresh parameters
    const success = searchParams.get('success')
    const refresh = searchParams.get('refresh')

    if (success === 'true') {
      toast({
        title: 'Onboarding Complete',
        description: 'Your payout account has been set up successfully.',
      })
    } else if (refresh === 'true') {
      toast({
        title: 'Session Expired',
        description: 'Please try setting up your account again.',
        variant: 'destructive',
      })
    }

    fetchAccountStatus()
  }, [searchParams])

  const fetchAccountStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/stripe/connect/account-status')

      if (!response.ok) {
        throw new Error('Failed to fetch account status')
      }

      const data = await response.json()
      setAccountStatus(data)
    } catch (error) {
      console.error('Error fetching account status:', error)
      toast({
        title: 'Error',
        description: 'Failed to load account status',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async () => {
    try {
      setIsCreatingAccount(true)
      const response = await fetch('/api/stripe/connect/create-account', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      await response.json()
      toast({
        title: 'Account Created',
        description: 'Your payout account has been created. Complete the onboarding to start receiving payouts.',
      })

      // Refresh status
      await fetchAccountStatus()

      // Automatically start onboarding
      handleStartOnboarding()
    } catch (error) {
      console.error('Error creating account:', error)
      toast({
        title: 'Error',
        description: 'Failed to create payout account',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingAccount(false)
    }
  }

  const handleStartOnboarding = async () => {
    try {
      setIsCreatingLink(true)
      const response = await fetch('/api/stripe/connect/create-onboarding-link', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create onboarding link')
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating onboarding link:', error)
      toast({
        title: 'Error',
        description: 'Failed to start onboarding',
        variant: 'destructive',
      })
      setIsCreatingLink(false)
    }
  }

  const handleOpenDashboard = async () => {
    try {
      setIsOpeningDashboard(true)
      const response = await fetch('/api/stripe/connect/dashboard-link', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create dashboard link')
      }

      const data = await response.json()

      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
      console.error('Error opening dashboard:', error)
      toast({
        title: 'Error',
        description: 'Failed to open Stripe dashboard',
        variant: 'destructive',
      })
    } finally {
      setIsOpeningDashboard(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and payout settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="payouts">
            <DollarSign className="h-4 w-4 mr-2" />
            Payouts
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payout Account
              </CardTitle>
              <CardDescription>
                Set up your payout account to receive commission payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !accountStatus?.hasAccount ? (
                // No account - show create button
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Payout Account</AlertTitle>
                    <AlertDescription>
                      You need to set up a payout account to receive your commission payments.
                      This process is secure and handled by Stripe.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleCreateAccount}
                    disabled={isCreatingAccount}
                    size="lg"
                  >
                    {isCreatingAccount ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Set Up Payout Account
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // Has account - show status
                <div className="space-y-6">
                  {/* Account Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Account Status</h3>
                        <p className="text-sm text-muted-foreground">
                          {accountStatus.email || 'No email on file'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {accountStatus.detailsSubmitted ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {accountStatus.chargesEnabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">Charges</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {accountStatus.chargesEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>

                      <div className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {accountStatus.payoutsEnabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">Payouts</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {accountStatus.payoutsEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {accountStatus.requiresAction && accountStatus.requirements && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Action Required</AlertTitle>
                      <AlertDescription>
                        {accountStatus.requirements.pastDue.length > 0 && (
                          <p className="mb-2">
                            You have {accountStatus.requirements.pastDue.length} past due requirement(s).
                          </p>
                        )}
                        {accountStatus.requirements.currentlyDue.length > 0 && (
                          <p>
                            You have {accountStatus.requirements.currentlyDue.length} requirement(s) that need attention.
                          </p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!accountStatus.detailsSubmitted || accountStatus.requiresAction ? (
                      <Button
                        onClick={handleStartOnboarding}
                        disabled={isCreatingLink}
                        size="lg"
                      >
                        {isCreatingLink ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            {accountStatus.detailsSubmitted ? 'Update Information' : 'Complete Setup'}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : null}

                    {accountStatus.detailsSubmitted && (
                      <Button
                        onClick={handleOpenDashboard}
                        disabled={isOpeningDashboard}
                        variant="outline"
                        size="lg"
                      >
                        {isOpeningDashboard ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Opening...
                          </>
                        ) : (
                          <>
                            View Stripe Dashboard
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      onClick={fetchAccountStatus}
                      variant="ghost"
                      size="lg"
                    >
                      Refresh Status
                    </Button>
                  </div>

                  {/* Account Info */}
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-semibold text-sm">Account Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Account ID:</span>
                      </div>
                      <div className="font-mono text-xs">{accountStatus.accountId}</div>
                      <div>
                        <span className="text-muted-foreground">Country:</span>
                      </div>
                      <div>{accountStatus.country || 'N/A'}</div>
                      <div>
                        <span className="text-muted-foreground">Business Type:</span>
                      </div>
                      <div className="capitalize">{accountStatus.businessType || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payout Information */}
          <Card>
            <CardHeader>
              <CardTitle>How Payouts Work</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Your commissions are automatically calculated when customers complete their purchases.
                </p>
                <p>
                  Payouts are processed on a regular schedule once your account is fully verified.
                </p>
                <p>
                  You can view your payout history and manage your bank account details through the Stripe Dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Profile settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
