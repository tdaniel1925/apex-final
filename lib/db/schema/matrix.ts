import { pgTable, uuid, integer, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from './users'

export const matrixPositions = pgTable('matrix_positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sponsorId: uuid('sponsor_id')
    .notNull()
    .references(() => users.id),
  level: integer('level').notNull(), // 1-9
  position: integer('position').notNull(), // 1-5 per level
  parentId: uuid('parent_id'),
  legPosition: integer('leg_position'), // 1-5 (which leg under sponsor)

  // Matrix status
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, spilled, cycled

  // Placement tracking
  placedAt: timestamp('placed_at').notNull().defaultNow(),
  placedBy: uuid('placed_by')
    .notNull()
    .references(() => users.id), // Who placed them

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
