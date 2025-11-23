'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SitePhoto {
  id: string
  userId: string
  photoUrl: string
  photoType: string
  caption: string | null
  fileName: string
  status: string
  createdAt: Date
}

export default function PhotoApprovalsPage() {
  const [photos, setPhotos] = useState<SitePhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/site-photos?status=pending')
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

  const handleApprove = async (photoId: string) => {
    try {
      const response = await fetch('/api/site-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, status: 'approved' }),
      })
      if (response.ok) {
        await fetchPhotos()
      }
    } catch (error) {
      console.error('Error approving photo:', error)
    }
  }

  const handleReject = async () => {
    if (!selectedPhoto) return
    try {
      const response = await fetch('/api/site-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: selectedPhoto.id,
          status: 'rejected',
          rejectionReason,
        }),
      })
      if (response.ok) {
        await fetchPhotos()
        setRejectDialogOpen(false)
        setRejectionReason('')
        setSelectedPhoto(null)
      }
    } catch (error) {
      console.error('Error rejecting photo:', error)
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Photo Approvals</h1>
        <p className="text-muted-foreground">Review and approve distributor photos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {photos.length} Pending Approval{photos.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos pending approval</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={photo.photoUrl}
                      alt={photo.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <Badge variant="outline">{photo.photoType}</Badge>
                      </div>
                      {photo.caption && (
                        <p className="text-sm text-muted-foreground">{photo.caption}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Uploaded {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleApprove(photo.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            setSelectedPhoto(photo)
                            setRejectDialogOpen(true)
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
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

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Photo</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this photo
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
              Reject Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
