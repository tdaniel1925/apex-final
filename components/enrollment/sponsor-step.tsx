'use client'

import { useEnrollment } from '@/lib/store/enrollment'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2, User } from 'lucide-react'

type SponsorStepProps = {
  sponsorUsername: string
}

export function SponsorStep({ sponsorUsername }: SponsorStepProps) {
  const { data, updateData } = useEnrollment()
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  const verifySponsor = async () => {
    setVerifying(true)
    setError('')

    try {
      // Simulate API call to verify sponsor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real implementation, this would call the API
      // const response = await fetch(`/api/users/verify-sponsor?username=${data.sponsorUsername}`)
      // const sponsorData = await response.json()

      // Mock verification - accept any non-empty username
      if (data.sponsorUsername) {
        updateData({
          sponsorId: '12345', // Would come from API
          sponsorName: 'John Smith', // Would come from API
        })
      } else {
        setError('Please enter a sponsor username')
      }
    } catch (err) {
      setError('Unable to verify sponsor. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  // Pre-fill sponsor from URL if available
  if (!data.sponsorUsername && sponsorUsername) {
    updateData({ sponsorUsername })
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm">
          Every distributor in Apex Affinity Group has a sponsor - the person who introduced you to this opportunity.
          Your sponsor will help train you and support your success.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sponsorUsername">Sponsor Username *</Label>
        <div className="flex gap-2">
          <Input
            id="sponsorUsername"
            value={data.sponsorUsername}
            onChange={(e) => {
              updateData({
                sponsorUsername: e.target.value.toLowerCase(),
                sponsorId: null,
                sponsorName: ''
              })
              setError('')
            }}
            placeholder="Enter sponsor's username"
            required
            disabled={verifying}
          />
          <Button
            type="button"
            onClick={verifySponsor}
            disabled={!data.sponsorUsername || verifying || !!data.sponsorId}
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive mt-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {data.sponsorId && data.sponsorName && (
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-green-900 dark:text-green-100">Sponsor Verified</h3>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                <strong>{data.sponsorName}</strong> (@{data.sponsorUsername})
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                You will be placed in {data.sponsorName}'s organization
              </p>
            </div>
          </div>
        </div>
      )}

      {!data.sponsorId && (
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Don't have a sponsor?</strong> Contact us at{' '}
            <a href="mailto:support@apexaffinitygroup.com" className="underline">
              support@apexaffinitygroup.com
            </a>{' '}
            and we'll assign you to an experienced mentor.
          </p>
        </div>
      )}
    </div>
  )
}
