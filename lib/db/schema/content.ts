import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

/**
 * CMS Content Management
 * Allows admins to manage testimonials, videos, and editable page content
 */

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Author information
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorRole: varchar('author_role', { length: 255 }), // e.g., "Diamond Distributor"
  authorPhoto: varchar('author_photo', { length: 500 }), // URL or path
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // Link to actual user if exists

  // Content
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5), // 1-5 stars

  // Display settings
  featured: integer('featured').notNull().default(0), // 0 = false, 1 = true
  displayOrder: integer('display_order').notNull().default(0), // For sorting
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published, archived

  // Metadata
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),

  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Video information
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  videoUrl: varchar('video_url', { length: 500 }).notNull(), // YouTube, Vimeo, or direct link
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  duration: integer('duration'), // Duration in seconds

  // Categorization
  category: varchar('category', { length: 50 }).notNull().default('training'), // training, testimonial, product, company
  tags: text('tags'), // Comma-separated tags

  // Display settings
  featured: integer('featured').notNull().default(0),
  displayOrder: integer('display_order').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('draft'),

  // Metadata
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),

  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const pageContent = pgTable('page_content', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Page identification
  pageSlug: varchar('page_slug', { length: 255 }).notNull().unique(), // e.g., "homepage-hero", "about-mission"
  section: varchar('section', { length: 100 }).notNull(), // e.g., "hero", "features", "about"

  // Content
  title: varchar('title', { length: 255 }),
  subtitle: varchar('subtitle', { length: 500 }),
  content: text('content'),
  htmlContent: text('html_content'), // Sanitized HTML if needed
  imageUrl: varchar('image_url', { length: 500 }),
  buttonText: varchar('button_text', { length: 100 }),
  buttonUrl: varchar('button_url', { length: 500 }),

  // Metadata as JSON
  metadata: text('metadata'), // JSON string for flexible additional data

  // Status
  status: varchar('status', { length: 20 }).notNull().default('published'),

  // Metadata
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Content
  question: varchar('question', { length: 500 }).notNull(),
  answer: text('answer').notNull(),

  // Categorization
  category: varchar('category', { length: 50 }).notNull().default('general'), // general, compensation, products, technical

  // Display settings
  displayOrder: integer('display_order').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('published'),

  // Metadata
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
