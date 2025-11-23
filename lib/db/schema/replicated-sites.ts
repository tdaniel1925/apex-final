import { pgTable, uuid, varchar, text, boolean, timestamp, json } from 'drizzle-orm/pg-core'

export const replicatedSites = pgTable('replicated_sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // References users table

  // URL Configuration
  siteUrl: varchar('site_url', { length: 255 }).notNull().unique(), // e.g., johndoe.apexmlm.com
  customDomain: varchar('custom_domain', { length: 255 }).unique(), // e.g., www.johndoe.com
  customDomainVerified: boolean('custom_domain_verified').notNull().default(false),

  // Site Customization
  logoUrl: text('logo_url'),
  bannerImageUrl: text('banner_image_url'),
  profilePhotoUrl: text('profile_photo_url'),

  // Content
  headline: varchar('headline', { length: 200 }),
  bio: text('bio'),
  welcomeMessage: text('welcome_message'),

  // Theme/Styling
  primaryColor: varchar('primary_color', { length: 7 }).default('#3b82f6'), // Hex color
  secondaryColor: varchar('secondary_color', { length: 7 }).default('#10b981'),
  theme: varchar('theme', { length: 20 }).notNull().default('light'), // light, dark

  // Social Media Links
  socialLinks: json('social_links').$type<{
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }>(),

  // Settings
  showContactForm: boolean('show_contact_form').notNull().default(true),
  showProducts: boolean('show_products').notNull().default(true),
  showTestimonials: boolean('show_testimonials').notNull().default(true),
  showTeamStats: boolean('show_team_stats').notNull().default(false),

  // SEO
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  metaKeywords: varchar('meta_keywords', { length: 255 }),

  // Status
  isActive: boolean('is_active').notNull().default(true),
  isPublished: boolean('is_published').notNull().default(false),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  publishedAt: timestamp('published_at'),
})

export const sitePhotos = pgTable('site_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  siteId: uuid('site_id').notNull(), // References replicated_sites

  // Photo Details
  photoUrl: text('photo_url').notNull(),
  photoType: varchar('photo_type', { length: 50 }).notNull(), // logo, banner, profile, gallery, product
  caption: text('caption'),
  altText: varchar('alt_text', { length: 255 }),

  // File Info
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: varchar('file_size', { length: 50 }), // in bytes
  mimeType: varchar('mime_type', { length: 100 }),

  // Approval Workflow
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected
  approvedBy: uuid('approved_by'), // References users (admin who approved)
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),

  // Ordering
  displayOrder: varchar('display_order', { length: 10 }).default('0'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const autoshipSubscriptions = pgTable('autoship_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),

  // Subscription Details
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, paused, cancelled

  // Frequency
  frequency: varchar('frequency', { length: 20 }).notNull().default('monthly'), // weekly, biweekly, monthly, quarterly
  dayOfMonth: varchar('day_of_month', { length: 2 }), // 1-28 for monthly
  dayOfWeek: varchar('day_of_week', { length: 10 }), // Monday-Sunday for weekly

  // Products (stored as JSON array of product IDs and quantities)
  products: json('products').$type<Array<{
    productId: string
    quantity: number
    price: string
  }>>().notNull(),

  // Pricing
  subtotal: varchar('subtotal', { length: 20 }).notNull(),
  tax: varchar('tax', { length: 20 }).notNull().default('0.00'),
  shipping: varchar('shipping', { length: 20 }).notNull().default('0.00'),
  total: varchar('total', { length: 20 }).notNull(),

  // Payment
  paymentMethodId: varchar('payment_method_id', { length: 255 }), // Stripe payment method

  // Shipping Address
  shippingAddress: json('shipping_address').$type<{
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }>().notNull(),

  // Execution Tracking
  nextRunDate: timestamp('next_run_date').notNull(),
  lastRunDate: timestamp('last_run_date'),
  failedAttempts: varchar('failed_attempts', { length: 10 }).notNull().default('0'),
  lastFailureReason: text('last_failure_reason'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  cancelledAt: timestamp('cancelled_at'),
})

export const autoshipExecutions = pgTable('autoship_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscriptionId: uuid('subscription_id').notNull(),

  // Execution Details
  executedAt: timestamp('executed_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull(), // success, failed, skipped

  // Order Reference
  orderId: uuid('order_id'), // References orders table if successful

  // Error Details
  errorMessage: text('error_message'),
  errorCode: varchar('error_code', { length: 50 }),

  // Financial Details
  amount: varchar('amount', { length: 20 }),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }), // Stripe payment intent

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const taxForms = pgTable('tax_forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),

  // Form Type
  formType: varchar('form_type', { length: 20 }).notNull().default('w9'), // w9, w8ben
  taxYear: varchar('tax_year', { length: 4 }).notNull(),

  // W-9 Information
  legalName: varchar('legal_name', { length: 255 }).notNull(),
  businessName: varchar('business_name', { length: 255 }),
  taxClassification: varchar('tax_classification', { length: 50 }).notNull(), // individual, c-corp, s-corp, partnership, llc, etc.

  // Tax ID (encrypted)
  taxIdType: varchar('tax_id_type', { length: 20 }).notNull(), // ssn, ein
  taxIdEncrypted: text('tax_id_encrypted').notNull(), // Encrypted SSN or EIN

  // Address
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 50 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull().default('USA'),

  // Exemptions
  exemptPayeeCode: varchar('exempt_payee_code', { length: 10 }),
  exemptionFromFatca: varchar('exemption_from_fatca', { length: 10 }),

  // Signature & Certification
  signatureName: varchar('signature_name', { length: 255 }).notNull(),
  signatureDate: timestamp('signature_date').notNull(),
  certifiedCorrect: boolean('certified_correct').notNull().default(true),

  // Document Storage
  documentUrl: text('document_url'), // URL to signed PDF

  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected, expired
  approvedBy: uuid('approved_by'),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'), // W-9s should be updated every 3 years
})
