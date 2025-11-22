'use client'

import { useEnrollment } from '@/lib/store/enrollment'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'

export function AccountSetupStep() {
  const { data, updateData } = useEnrollment()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordRequirements = [
    { test: data.password.length >= 8, label: 'At least 8 characters' },
    { test: /[A-Z]/.test(data.password), label: 'One uppercase letter' },
    { test: /[a-z]/.test(data.password), label: 'One lowercase letter' },
    { test: /[0-9]/.test(data.password), label: 'One number' },
  ]

  const passwordsMatch = data.password && data.password === data.confirmPassword

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username *</Label>
        <Input
          id="username"
          value={data.username}
          onChange={(e) => updateData({ username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
          placeholder="johndoe"
          required
        />
        <p className="text-xs text-muted-foreground">
          Your replicated website will be: apexaffinitygroup.com/{data.username || 'yourusername'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
            placeholder="Create a strong password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="space-y-1 mt-2">
          {passwordRequirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.test ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={req.test ? 'text-green-600' : 'text-muted-foreground'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={data.confirmPassword}
            onChange={(e) => updateData({ confirmPassword: e.target.value })}
            placeholder="Re-enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {data.confirmPassword && (
          <div className="flex items-center gap-2 text-xs mt-2">
            {passwordsMatch ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-destructive">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Security Tip:</strong> Use a unique password you don't use anywhere else.
          Consider using a password manager to generate and store strong passwords.
        </p>
      </div>
    </div>
  )
}
