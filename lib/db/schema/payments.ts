import { pgTable, uuid, varchar, decimal, timestamp, text, integer } from 'drizzle-orm/pg-core'
import { users } from './users'

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Payment details
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  type: varchar('type', { length: 20 }).notNull(), // commission_payout, refund, adjustment

  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed, cancelled

  // Stripe
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),
  stripePayoutId: varchar('stripe_payout_id', { length: 255 }),
  stripeFailureReason: text('stripe_failure_reason'),

  // Tracking
  batchId: uuid('batch_id'), // Group payments together
  commissionIds: text('commission_ids'), // JSON array of commission IDs included
  notes: text('notes'),

  // Retry logic
  retryCount: integer('retry_count').notNull().default(0),
  lastRetryAt: timestamp('last_retry_at'),
  nextRetryAt: timestamp('next_retry_at'),
  maxRetries: integer('max_retries').notNull().default(3),
  requiresManualReview: integer('requires_manual_review').notNull().default(0), // 0 = false, 1 = true (using integer for PostgreSQL compatibility)

  // Timestamps
  processedAt: timestamp('processed_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const paymentBatches = pgTable('payment_batches', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  paymentCount: integer('payment_count').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
  processedBy: uuid('processed_by').references(() => users.id),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
