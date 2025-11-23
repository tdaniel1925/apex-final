import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sitePhotos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET - Fetch photos for a site
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const siteId = searchParams.get('siteId')
    const status = searchParams.get('status') // pending, approved, rejected

    if (!userId && !siteId) {
      return NextResponse.json(
        { error: 'userId or siteId is required' },
        { status: 400 }
      )
    }

    let photos

    if (siteId) {
      if (status) {
        photos = await db
          .select()
          .from(sitePhotos)
          .where(
            and(eq(sitePhotos.siteId, siteId), eq(sitePhotos.status, status))
          )
      } else {
        photos = await db
          .select()
          .from(sitePhotos)
          .where(eq(sitePhotos.siteId, siteId))
      }
    } else if (userId) {
      if (status) {
        photos = await db
          .select()
          .from(sitePhotos)
          .where(
            and(eq(sitePhotos.userId, userId), eq(sitePhotos.status, status))
          )
      } else {
        photos = await db
          .select()
          .from(sitePhotos)
          .where(eq(sitePhotos.userId, userId))
      }
    }

    return NextResponse.json(photos || [])
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, siteId, photoUrl, photoType, caption, altText, fileName, fileSize, mimeType } = body

    if (!userId || !siteId || !photoUrl || !photoType || !fileName) {
      return NextResponse.json(
        { error: 'Required fields: userId, siteId, photoUrl, photoType, fileName' },
        { status: 400 }
      )
    }

    // Create photo entry with pending status
    const [newPhoto] = await db
      .insert(sitePhotos)
      .values({
        userId,
        siteId,
        photoUrl,
        photoType,
        caption: caption || null,
        altText: altText || null,
        fileName,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        status: 'pending', // All photos start as pending
        displayOrder: '0',
      })
      .returning()

    return NextResponse.json(newPhoto, { status: 201 })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
  }
}

// PUT - Update photo or approve/reject
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { photoId, status, approvedBy, rejectionReason, ...updates } = body

    if (!photoId) {
      return NextResponse.json({ error: 'photoId is required' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { ...updates, updatedAt: new Date() }

    // Handle approval workflow
    if (status === 'approved') {
      updateData.status = 'approved'
      updateData.approvedBy = approvedBy
      updateData.approvedAt = new Date()
      updateData.rejectionReason = null
    } else if (status === 'rejected') {
      updateData.status = 'rejected'
      updateData.rejectionReason = rejectionReason || 'Not specified'
      updateData.approvedAt = null
      updateData.approvedBy = null
    } else if (status) {
      updateData.status = status
    }

    const [updatedPhoto] = await db
      .update(sitePhotos)
      .set(updateData)
      .where(eq(sitePhotos.id, photoId))
      .returning()

    if (!updatedPhoto) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json(updatedPhoto)
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

// DELETE - Delete photo
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const photoId = searchParams.get('photoId')

    if (!photoId) {
      return NextResponse.json({ error: 'photoId is required' }, { status: 400 })
    }

    await db.delete(sitePhotos).where(eq(sitePhotos.id, photoId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
