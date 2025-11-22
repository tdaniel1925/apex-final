import { pgTable, uuid, decimal, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core'
import { users } from './users'

export const commissions = pgTable('commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fromUserId: uuid('from_user_id')
    .notNull()
    .references(() => users.id), // Who generated this commission

  // Commission details
  type: varchar('type', { length: 50 }).notNull(), // retail, matrix, rank_bonus, matching
  level: integer('level'), // For matrix commissions
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),

  // Payment tracking
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, paid, cancelled
  paymentId: uuid('payment_id'), // Reference to payment batch
  paidAt: timestamp('paid_at'),

  // Source tracking
  orderId: uuid('order_id'), // If from a product sale
  description: text('description'),
  metadata: text('metadata'), // JSON string for additional data

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
