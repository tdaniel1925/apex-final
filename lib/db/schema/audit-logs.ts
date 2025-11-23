import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core'
import { users } from './users'

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Who performed the action
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  userEmail: varchar('user_email', { length: 255 }),
  userRole: varchar('user_role', { length: 50 }),

  // What action was performed
  action: varchar('action', { length: 100 }).notNull(), // create, update, delete, approve, reject
  entity: varchar('entity', { length: 100 }).notNull(), // commission, payout, tax_form, user, etc.
  entityId: varchar('entity_id', { length: 255 }),

  // Action details
  description: text('description').notNull(),
  metadata: json('metadata').$type<{
    oldValue?: any
    newValue?: any
    ipAddress?: string
    userAgent?: string
    [key: string]: any
  }>(),

  // Context
  severity: varchar('severity', { length: 20 }).notNull().default('info'), // info, warning, critical
  category: varchar('category', { length: 50 }).notNull(), // financial, security, administrative, user_action

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
