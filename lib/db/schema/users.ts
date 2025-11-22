import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, inactive, suspended
  role: varchar('role', { length: 20 }).notNull().default('distributor'), // admin, distributor, customer
  sponsorId: uuid('sponsor_id'),
  enrollmentDate: timestamp('enrollment_date').notNull().defaultNow(),

  // MLM Rank
  rankId: varchar('rank_id', { length: 50 }).default('distributor'), // distributor, bronze, silver, gold, platinum, diamond, presidential

  // Replicated website
  replicatedSiteUrl: varchar('replicated_site_url', { length: 255 }).unique(),
  customDomain: varchar('custom_domain', { length: 255 }).unique(),

  // Profile
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }).notNull().default('USA'),

  // Tax information (encrypted)
  taxId: varchar('tax_id', { length: 255 }), // SSN or EIN (encrypted)
  w9FormUrl: text('w9_form_url'),

  // Stripe
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
  stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }).unique(),

  // Preferences
  emailNotifications: boolean('email_notifications').notNull().default(true),
  smsNotifications: boolean('sms_notifications').notNull().default(false),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
})
