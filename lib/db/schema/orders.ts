import { pgTable, uuid, varchar, decimal, integer, timestamp, text } from 'drizzle-orm/pg-core'
import { users } from './users'
import { products } from './products'

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  distributorId: uuid('distributor_id')
    .notNull()
    .references(() => users.id), // Who gets credit for the sale

  // Order details
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0'),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),

  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, shipped, delivered, cancelled, refunded
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'), // pending, paid, failed, refunded

  // Payment
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),

  // Shipping
  shippingAddress: text('shipping_address'), // JSON object
  trackingNumber: varchar('tracking_number', { length: 255 }),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),

  // Notes
  customerNotes: text('customer_notes'),
  adminNotes: text('admin_notes'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),

  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Price at time of purchase
  commissionableValue: decimal('commissionable_value', { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
})
