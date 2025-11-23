'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Globe,
  Palette,
  Image as ImageIcon,
  Save,
  Eye,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ReplicatedSite {
  id: string
  userId: string
  siteUrl: string
  customDomain: string | null
  customDomainVerified: boolean
  logoUrl: string | null
  bannerImageUrl: string | null
  profilePhotoUrl: string | null
  headline: string | null
  bio: string | null
  welcomeMessage: string | null
  primaryColor: string
  secondaryColor: string
  theme: string
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  } | null
  showContactForm: boolean
  showProducts: boolean
  showTestimonials: boolean
  showTeamStats: boolean
  metaTitle: string | null
  metaDescription: string | null
  isActive: boolean
  isPublished: boolean
}

export default function ReplicatedSitePage() {
  const [site, setSite] = useState<ReplicatedSite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // TODO: Replace with actual user ID from auth
  const userId = '00000000-0000-0000-0000-000000000001'

  useEffect(() => {
    fetchSite()
  }, [])

  const fetchSite = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/replicated-site?userId=${userId}`)

      if (response.ok) {
        const data = await response.json()
        setSite(data)
      } else if (response.status === 404) {
        // Site doesn't exist, create one
        await createSite()
      }
    } catch (error) {
      console.error('Error fetching site:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createSite = async () => {
    try {
      // Generate default site URL from user name or email
      const defaultUrl = `user${userId.substring(0, 8)}.apexmlm.com`

      const response = await fetch('/api/replicated-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          siteUrl: defaultUrl,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSite(data)
      }
    } catch (error) {
      console.error('Error creating site:', error)
    }
  }

  const handleSave = async () => {
    if (!site) return

    try {
      setIsSaving(true)
      setSaveMessage(null)

      const response = await fetch('/api/replicated-site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      })

      if (response.ok) {
        const updated = await response.json()
        setSite(updated)
        setSaveMessage({ type: 'success', text: 'Site settings saved successfully!' })
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to save settings' })
      }
    } catch (error) {
      console.error('Error saving site:', error)
      setSaveMessage({ type: 'error', text: 'An error occurred while saving' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 5000)
    }
  }

  const handlePublish = async () => {
    if (!site) return

    const updatedSite = { ...site, isPublished: !site.isPublished }
    setSite(updatedSite)

    await fetch('/api/replicated-site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSite),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load site settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Replicated Site</h1>
          <p className="text-muted-foreground">
            Customize your personal website to promote products and build your team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={site.isPublished ? 'default' : 'secondary'}>
            {site.isPublished ? 'Published' : 'Draft'}
          </Badge>
          <Button variant="outline" onClick={handlePublish}>
            {site.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Site URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site URL
          </CardTitle>
          <CardDescription>Your unique website address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site URL</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={site.siteUrl} disabled className="flex-1" />
              <Button variant="outline" size="icon" asChild>
                <a href={`https://${site.siteUrl}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <Label>Custom Domain (Optional)</Label>
            <Input
              placeholder="www.yourdomain.com"
              value={site.customDomain || ''}
              onChange={(e) => setSite({ ...site, customDomain: e.target.value || null })}
              className="mt-1"
            />
            {site.customDomain && (
              <p className="text-sm text-muted-foreground mt-1">
                {site.customDomainVerified ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="text-yellow-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Pending verification
                  </span>
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Content
          </CardTitle>
          <CardDescription>Customize your site content and messaging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Input
              placeholder="Welcome to my site"
              value={site.headline || ''}
              onChange={(e) => setSite({ ...site, headline: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell visitors about yourself..."
              value={site.bio || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSite({ ...site, bio: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Welcome Message</Label>
            <Textarea
              placeholder="Welcome message for new visitors..."
              value={site.welcomeMessage || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSite({ ...site, welcomeMessage: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme & Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Colors
          </CardTitle>
          <CardDescription>Customize your site appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Primary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={site.primaryColor}
                  onChange={(e) => setSite({ ...site, primaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={site.primaryColor}
                  onChange={(e) => setSite({ ...site, primaryColor: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={site.secondaryColor}
                  onChange={(e) => setSite({ ...site, secondaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={site.secondaryColor}
                  onChange={(e) => setSite({ ...site, secondaryColor: e.target.value })}
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Facebook</Label>
              <Input
                placeholder="https://facebook.com/yourpage"
                value={site.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    socialLinks: { ...site.socialLinks, facebook: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Instagram</Label>
              <Input
                placeholder="https://instagram.com/youraccount"
                value={site.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    socialLinks: { ...site.socialLinks, instagram: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>Twitter</Label>
              <Input
                placeholder="https://twitter.com/youraccount"
                value={site.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    socialLinks: { ...site.socialLinks, twitter: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>LinkedIn</Label>
              <Input
                placeholder="https://linkedin.com/in/yourprofile"
                value={site.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setSite({
                    ...site,
                    socialLinks: { ...site.socialLinks, linkedin: e.target.value },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Choose which sections to show on your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Contact Form</Label>
              <p className="text-sm text-muted-foreground">
                Allow visitors to contact you directly
              </p>
            </div>
            <Switch
              checked={site.showContactForm}
              onCheckedChange={(checked: boolean) => setSite({ ...site, showContactForm: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Products</Label>
              <p className="text-sm text-muted-foreground">Display product catalog</p>
            </div>
            <Switch
              checked={site.showProducts}
              onCheckedChange={(checked: boolean) => setSite({ ...site, showProducts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Testimonials</Label>
              <p className="text-sm text-muted-foreground">Display customer testimonials</p>
            </div>
            <Switch
              checked={site.showTestimonials}
              onCheckedChange={(checked: boolean) => setSite({ ...site, showTestimonials: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Team Stats</Label>
              <p className="text-sm text-muted-foreground">Display your team metrics</p>
            </div>
            <Switch
              checked={site.showTeamStats}
              onCheckedChange={(checked: boolean) => setSite({ ...site, showTeamStats: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Optimize your site for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Meta Title</Label>
            <Input
              placeholder="Page title for search engines (60 characters max)"
              value={site.metaTitle || ''}
              onChange={(e) => setSite({ ...site, metaTitle: e.target.value })}
              maxLength={60}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Meta Description</Label>
            <Textarea
              placeholder="Page description for search engines (160 characters max)"
              value={site.metaDescription || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSite({ ...site, metaDescription: e.target.value })}
              maxLength={160}
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview Your Site
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full">
            <a href={`https://${site.siteUrl}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open {site.siteUrl}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
