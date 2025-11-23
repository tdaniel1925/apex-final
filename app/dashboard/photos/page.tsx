'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
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

interface SitePhoto {
  id: string
  userId: string
  siteId: string
  photoUrl: string
  photoType: string
  caption: string | null
  altText: string | null
  fileName: string
  fileSize: string | null
  mimeType: string | null
  status: string
  approvedBy: string | null
  approvedAt: Date | null
  rejectionReason: string | null
  displayOrder: string
  createdAt: Date
  updatedAt: Date
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Upload form state
  const [uploadData, setUploadData] = useState({
    photoType: 'gallery',
    caption: '',
    altText: '',
    photoUrl: '', // In production, this would be set after upload to cloud storage
  })

  // TODO: Replace with actual user ID and site ID from auth
  const userId = '00000000-0000-0000-0000-000000000001'
  const siteId = '00000000-0000-0000-0000-000000000002'

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/site-photos?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // TODO: In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll use a placeholder URL
    const mockUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.name)}`

    setUploadData({
      ...uploadData,
      photoUrl: mockUrl,
    })
  }

  const handleUpload = async () => {
    if (!uploadData.photoUrl) {
      alert('Please select a file first')
      return
    }

    try {
      setIsUploading(true)

      const response = await fetch('/api/site-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          siteId,
          photoUrl: uploadData.photoUrl,
          photoType: uploadData.photoType,
          caption: uploadData.caption || null,
          altText: uploadData.altText || null,
          fileName: 'uploaded-file.jpg', // TODO: Get from actual file
          fileSize: '0', // TODO: Get from actual file
          mimeType: 'image/jpeg', // TODO: Get from actual file
        }),
      })

      if (response.ok) {
        await fetchPhotos()
        setUploadDialogOpen(false)
        setUploadData({
          photoType: 'gallery',
          caption: '',
          altText: '',
          photoUrl: '',
        })
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/site-photos?photoId=${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPhotos()
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
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
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case 'logo':
        return 'Logo'
      case 'banner':
        return 'Banner'
      case 'profile':
        return 'Profile Photo'
      case 'gallery':
        return 'Gallery'
      case 'product':
        return 'Product Image'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const pendingPhotos = photos.filter((p) => p.status === 'pending')
  const approvedPhotos = photos.filter((p) => p.status === 'approved')
  const rejectedPhotos = photos.filter((p) => p.status === 'rejected')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Photo Gallery</h1>
          <p className="text-muted-foreground">
            Upload and manage photos for your replicated site
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Photo</DialogTitle>
              <DialogDescription>
                Photos must be approved by an admin before appearing on your site
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Photo Type</Label>
                <Select
                  value={uploadData.photoType}
                  onValueChange={(value) => setUploadData({ ...uploadData, photoType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">Logo</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="profile">Profile Photo</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="product">Product Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select File</Label>
                <Input type="file" accept="image/*" onChange={handleFileSelect} className="mt-1" />
              </div>

              <div>
                <Label>Caption (Optional)</Label>
                <Input
                  placeholder="Photo caption"
                  value={uploadData.caption}
                  onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Alt Text (Optional)</Label>
                <Textarea
                  placeholder="Describe the image for accessibility"
                  value={uploadData.altText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadData({ ...uploadData, altText: e.target.value })}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !uploadData.photoUrl}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPhotos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedPhotos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedPhotos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            All Photos
          </CardTitle>
          <CardDescription>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} uploaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
              <Button variant="outline" className="mt-4" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={photo.photoUrl}
                      alt={photo.altText || photo.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(photo.status)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{getPhotoTypeLabel(photo.photoType)}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {photo.caption && (
                        <p className="text-sm text-muted-foreground">{photo.caption}</p>
                      )}

                      {photo.status === 'rejected' && photo.rejectionReason && (
                        <div className="flex items-start gap-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{photo.rejectionReason}</span>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
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
