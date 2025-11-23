/**
 * CMS Content Management Utilities
 * CRUD operations for testimonials, videos, page content, and FAQs
 */

import { db } from '@/lib/db'
import { testimonials, videos, pageContent, faqs } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { sanitizeHtml, sanitizeText, sanitizeUrl } from '@/lib/security/sanitize'

// ==================== TESTIMONIALS ====================

export interface TestimonialInput {
  authorName: string
  authorRole?: string
  authorPhoto?: string
  userId?: string
  content: string
  rating: number
  featured?: boolean
  displayOrder?: number
  status?: 'draft' | 'published' | 'archived'
}

export async function createTestimonial(
  data: TestimonialInput,
  createdBy: string
) {
  const sanitized = {
    ...data,
    authorName: sanitizeText(data.authorName),
    authorRole: data.authorRole ? sanitizeText(data.authorRole) : undefined,
    authorPhoto: data.authorPhoto ? sanitizeUrl(data.authorPhoto) : undefined,
    content: sanitizeHtml(data.content),
  }

  const [testimonial] = await db
    .insert(testimonials)
    .values({
      ...sanitized,
      featured: sanitized.featured ? 1 : 0,
      displayOrder: sanitized.displayOrder || 0,
      status: sanitized.status || 'draft',
      createdBy,
      updatedBy: createdBy,
      publishedAt: sanitized.status === 'published' ? new Date() : null,
    })
    .returning()

  return testimonial
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>,
  updatedBy: string
) {
  const sanitized: Record<string, any> = {}

  if (data.authorName) sanitized.authorName = sanitizeText(data.authorName)
  if (data.authorRole) sanitized.authorRole = sanitizeText(data.authorRole)
  if (data.authorPhoto) sanitized.authorPhoto = sanitizeUrl(data.authorPhoto)
  if (data.content) sanitized.content = sanitizeHtml(data.content)
  if (data.rating !== undefined) sanitized.rating = data.rating
  if (data.featured !== undefined) sanitized.featured = data.featured ? 1 : 0
  if (data.displayOrder !== undefined) sanitized.displayOrder = data.displayOrder
  if (data.status !== undefined) {
    sanitized.status = data.status
    if (data.status === 'published') {
      sanitized.publishedAt = new Date()
    }
  }

  sanitized.updatedBy = updatedBy
  sanitized.updatedAt = new Date()

  const [testimonial] = await db
    .update(testimonials)
    .set(sanitized)
    .where(eq(testimonials.id, id))
    .returning()

  return testimonial
}

export async function deleteTestimonial(id: string) {
  await db.delete(testimonials).where(eq(testimonials.id, id))
  return { success: true }
}

export async function getPublishedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, 'published'))
    .orderBy(desc(testimonials.displayOrder), desc(testimonials.publishedAt))
}

export async function getFeaturedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.status, 'published'), eq(testimonials.featured, 1)))
    .orderBy(desc(testimonials.displayOrder))
}

// ==================== VIDEOS ====================

export interface VideoInput {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  category?: string
  tags?: string
  featured?: boolean
  displayOrder?: number
  status?: 'draft' | 'published' | 'archived'
}

export async function createVideo(data: VideoInput, createdBy: string) {
  const sanitizedVideoUrl = sanitizeUrl(data.videoUrl)
  if (!sanitizedVideoUrl) {
    throw new Error('Invalid video URL')
  }

  const sanitized = {
    ...data,
    title: sanitizeText(data.title),
    description: data.description ? sanitizeHtml(data.description) : undefined,
    videoUrl: sanitizedVideoUrl,
    thumbnailUrl: data.thumbnailUrl ? sanitizeUrl(data.thumbnailUrl) : undefined,
    tags: data.tags ? sanitizeText(data.tags) : undefined,
  }

  const [video] = await db
    .insert(videos)
    .values({
      ...sanitized,
      category: sanitized.category || 'training',
      featured: sanitized.featured ? 1 : 0,
      displayOrder: sanitized.displayOrder || 0,
      status: sanitized.status || 'draft',
      createdBy,
      updatedBy: createdBy,
      publishedAt: sanitized.status === 'published' ? new Date() : null,
    })
    .returning()

  return video
}

export async function updateVideo(
  id: string,
  data: Partial<VideoInput>,
  updatedBy: string
) {
  const sanitized: Record<string, any> = {}

  if (data.title) sanitized.title = sanitizeText(data.title)
  if (data.description) sanitized.description = sanitizeHtml(data.description)
  if (data.videoUrl) sanitized.videoUrl = sanitizeUrl(data.videoUrl)
  if (data.thumbnailUrl) sanitized.thumbnailUrl = sanitizeUrl(data.thumbnailUrl)
  if (data.duration !== undefined) sanitized.duration = data.duration
  if (data.category) sanitized.category = data.category
  if (data.tags) sanitized.tags = sanitizeText(data.tags)
  if (data.featured !== undefined) sanitized.featured = data.featured ? 1 : 0
  if (data.displayOrder !== undefined) sanitized.displayOrder = data.displayOrder
  if (data.status !== undefined) {
    sanitized.status = data.status
    if (data.status === 'published') {
      sanitized.publishedAt = new Date()
    }
  }

  sanitized.updatedBy = updatedBy
  sanitized.updatedAt = new Date()

  const [video] = await db.update(videos).set(sanitized).where(eq(videos.id, id)).returning()

  return video
}

export async function deleteVideo(id: string) {
  await db.delete(videos).where(eq(videos.id, id))
  return { success: true }
}

export async function getPublishedVideos(category?: string) {
  const conditions = [eq(videos.status, 'published')]

  if (category) {
    conditions.push(eq(videos.category, category))
  }

  return db
    .select()
    .from(videos)
    .where(and(...conditions))
    .orderBy(desc(videos.displayOrder), desc(videos.publishedAt))
}

export async function getFeaturedVideos() {
  return db
    .select()
    .from(videos)
    .where(and(eq(videos.status, 'published'), eq(videos.featured, 1)))
    .orderBy(desc(videos.displayOrder))
}

// ==================== PAGE CONTENT ====================

export interface PageContentInput {
  pageSlug: string
  section: string
  title?: string
  subtitle?: string
  content?: string
  htmlContent?: string
  imageUrl?: string
  buttonText?: string
  buttonUrl?: string
  metadata?: Record<string, any>
}

export async function upsertPageContent(data: PageContentInput, userId: string) {
  const sanitized = {
    ...data,
    title: data.title ? sanitizeText(data.title) : undefined,
    subtitle: data.subtitle ? sanitizeText(data.subtitle) : undefined,
    content: data.content ? sanitizeText(data.content) : undefined,
    htmlContent: data.htmlContent ? sanitizeHtml(data.htmlContent) : undefined,
    imageUrl: data.imageUrl ? sanitizeUrl(data.imageUrl) : undefined,
    buttonText: data.buttonText ? sanitizeText(data.buttonText) : undefined,
    buttonUrl: data.buttonUrl ? sanitizeUrl(data.buttonUrl) : undefined,
    metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
  }

  // Check if content already exists
  const existing = await db
    .select()
    .from(pageContent)
    .where(eq(pageContent.pageSlug, data.pageSlug))
    .limit(1)

  if (existing.length > 0) {
    // Update existing
    const [updated] = await db
      .update(pageContent)
      .set({
        ...sanitized,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(pageContent.pageSlug, data.pageSlug))
      .returning()

    return updated
  } else {
    // Create new
    const [created] = await db
      .insert(pageContent)
      .values({
        ...sanitized,
        createdBy: userId,
        updatedBy: userId,
      })
      .returning()

    return created
  }
}

export async function getPageContent(pageSlug: string) {
  const [content] = await db
    .select()
    .from(pageContent)
    .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.status, 'published')))
    .limit(1)

  if (content && content.metadata) {
    try {
      content.metadata = JSON.parse(content.metadata as string)
    } catch {
      content.metadata = null
    }
  }

  return content
}

// ==================== FAQs ====================

export interface FAQInput {
  question: string
  answer: string
  category?: string
  displayOrder?: number
  status?: 'draft' | 'published'
}

export async function createFAQ(data: FAQInput, createdBy: string) {
  const sanitized = {
    ...data,
    question: sanitizeText(data.question),
    answer: sanitizeHtml(data.answer),
  }

  const [faq] = await db
    .insert(faqs)
    .values({
      ...sanitized,
      category: sanitized.category || 'general',
      displayOrder: sanitized.displayOrder || 0,
      status: sanitized.status || 'published',
      createdBy,
      updatedBy: createdBy,
    })
    .returning()

  return faq
}

export async function updateFAQ(id: string, data: Partial<FAQInput>, updatedBy: string) {
  const sanitized: Record<string, any> = {}

  if (data.question) sanitized.question = sanitizeText(data.question)
  if (data.answer) sanitized.answer = sanitizeHtml(data.answer)
  if (data.category) sanitized.category = data.category
  if (data.displayOrder !== undefined) sanitized.displayOrder = data.displayOrder
  if (data.status) sanitized.status = data.status

  sanitized.updatedBy = updatedBy
  sanitized.updatedAt = new Date()

  const [faq] = await db.update(faqs).set(sanitized).where(eq(faqs.id, id)).returning()

  return faq
}

export async function deleteFAQ(id: string) {
  await db.delete(faqs).where(eq(faqs.id, id))
  return { success: true }
}

export async function getPublishedFAQs(category?: string) {
  const conditions = [eq(faqs.status, 'published')]

  if (category) {
    conditions.push(eq(faqs.category, category))
  }

  return db
    .select()
    .from(faqs)
    .where(and(...conditions))
    .orderBy(desc(faqs.displayOrder))
}

export async function getFAQsByCategory() {
  const allFAQs = await getPublishedFAQs()

  const grouped: Record<string, typeof allFAQs> = {}

  for (const faq of allFAQs) {
    const cat = faq.category || 'general'
    if (!grouped[cat]) {
      grouped[cat] = []
    }
    grouped[cat].push(faq)
  }

  return grouped
}
