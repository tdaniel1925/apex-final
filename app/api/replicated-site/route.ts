import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { replicatedSites } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET - Fetch replicated site settings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const siteUrl = searchParams.get('siteUrl')

    if (!userId && !siteUrl) {
      return NextResponse.json(
        { error: 'userId or siteUrl is required' },
        { status: 400 }
      )
    }

    let site

    if (siteUrl) {
      // Fetch by custom domain or site URL
      const [foundSite] = await db
        .select()
        .from(replicatedSites)
        .where(eq(replicatedSites.siteUrl, siteUrl))
        .limit(1)

      site = foundSite
    } else if (userId) {
      // Fetch by user ID
      const [foundSite] = await db
        .select()
        .from(replicatedSites)
        .where(eq(replicatedSites.userId, userId))
        .limit(1)

      site = foundSite
    }

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error('Error fetching replicated site:', error)
    return NextResponse.json(
      { error: 'Failed to fetch replicated site' },
      { status: 500 }
    )
  }
}

// POST - Create new replicated site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, siteUrl } = body

    if (!userId || !siteUrl) {
      return NextResponse.json(
        { error: 'userId and siteUrl are required' },
        { status: 400 }
      )
    }

    // Check if site already exists for this user
    const [existingSite] = await db
      .select()
      .from(replicatedSites)
      .where(eq(replicatedSites.userId, userId))
      .limit(1)

    if (existingSite) {
      return NextResponse.json(
        { error: 'Site already exists for this user' },
        { status: 400 }
      )
    }

    // Check if siteUrl is already taken
    const [existingUrl] = await db
      .select()
      .from(replicatedSites)
      .where(eq(replicatedSites.siteUrl, siteUrl))
      .limit(1)

    if (existingUrl) {
      return NextResponse.json(
        { error: 'This site URL is already taken' },
        { status: 400 }
      )
    }

    // Create new site with defaults
    const [newSite] = await db
      .insert(replicatedSites)
      .values({
        userId,
        siteUrl,
        headline: body.headline || 'Welcome to my site',
        bio: body.bio || '',
        primaryColor: body.primaryColor || '#3b82f6',
        secondaryColor: body.secondaryColor || '#10b981',
        theme: body.theme || 'light',
        isActive: true,
        isPublished: false,
      })
      .returning()

    return NextResponse.json(newSite, { status: 201 })
  } catch (error) {
    console.error('Error creating replicated site:', error)
    return NextResponse.json(
      { error: 'Failed to create replicated site' },
      { status: 500 }
    )
  }
}

// PUT - Update replicated site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Find the site
    const [existingSite] = await db
      .select()
      .from(replicatedSites)
      .where(eq(replicatedSites.userId, userId))
      .limit(1)

    if (!existingSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Update site
    const [updatedSite] = await db
      .update(replicatedSites)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(replicatedSites.userId, userId))
      .returning()

    return NextResponse.json(updatedSite)
  } catch (error) {
    console.error('Error updating replicated site:', error)
    return NextResponse.json(
      { error: 'Failed to update replicated site' },
      { status: 500 }
    )
  }
}

// DELETE - Delete replicated site
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    await db.delete(replicatedSites).where(eq(replicatedSites.userId, userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting replicated site:', error)
    return NextResponse.json(
      { error: 'Failed to delete replicated site' },
      { status: 500 }
    )
  }
}
