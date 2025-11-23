import { pgTable, uuid, varchar, integer, decimal, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'

export const ranks = pgTable('ranks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  level: integer('level').notNull().unique(), // 1-10 (Bronze to Diamond Ambassador)
  displayOrder: integer('display_order').notNull(),

  // Requirements
  personalSalesRequired: decimal('personal_sales_required', { precision: 10, scale: 2 }).notNull(),
  teamSalesRequired: decimal('team_sales_required', { precision: 10, scale: 2 }).notNull(),
  activeDistributorsRequired: integer('active_distributors_required').notNull(),

  // Benefits
  bonusAmount: decimal('bonus_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  matchingBonusPercentage: decimal('matching_bonus_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  matchingBonusLevels: integer('matching_bonus_levels').notNull().default(0),

  // Display
  color: varchar('color', { length: 7 }), // Hex color code
  icon: varchar('icon', { length: 50 }), // Icon name
  description: text('description'),

  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userRanks = pgTable('user_ranks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rankId: uuid('rank_id')
    .notNull()
    .references(() => ranks.id),

  achievedAt: timestamp('achieved_at').notNull().defaultNow(),
  currentRank: boolean('current_rank').notNull().default(true),

  // Tracking
  personalSales: decimal('personal_sales', { precision: 10, scale: 2 }).notNull(),
  teamSales: decimal('team_sales', { precision: 10, scale: 2 }).notNull(),
  activeDistributors: integer('active_distributors').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Alias for backwards compatibility
export const rankAchievements = pgTable('rank_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rankName: varchar('rank_name', { length: 100 }).notNull(),
  achievedAt: timestamp('achieved_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
