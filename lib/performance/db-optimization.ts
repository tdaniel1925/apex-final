/**
 * Database Query Optimization Utilities
 * Pagination, batching, and query performance helpers
 */

// Note: Drizzle ORM sql builder can be imported when needed for complex queries
// import { sql } from 'drizzle-orm'

/**
 * Pagination configuration
 */
export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Calculate pagination offset and limit
 */
export function getPaginationParams(options: PaginationOptions) {
  const { page, pageSize } = options
  const offset = (page - 1) * pageSize
  const limit = pageSize

  return { offset, limit }
}

/**
 * Create paginated result
 */
export function createPaginatedResult<T>(
  data: T[],
  totalItems: number,
  options: PaginationOptions
): PaginationResult<T> {
  const { page, pageSize } = options
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

/**
 * Cursor-based pagination (more efficient for large datasets)
 */
export interface CursorPaginationOptions {
  cursor?: string
  limit: number
}

export interface CursorPaginationResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export function createCursorPaginatedResult<T extends { id: string }>(
  data: T[],
  limit: number
): CursorPaginationResult<T> {
  const hasMore = data.length > limit
  const items = hasMore ? data.slice(0, limit) : data
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null

  return {
    data: items,
    nextCursor,
    hasMore,
  }
}

/**
 * Batch operation helper
 */
export async function batchOperation<T, R>(
  items: T[],
  operation: (batch: T[]) => Promise<R[]>,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await operation(batch)
    results.push(...batchResults)
  }

  return results
}

/**
 * Query performance monitoring
 */
export class QueryMonitor {
  private startTime: number

  constructor(private queryName: string) {
    this.startTime = Date.now()
  }

  end(): void {
    const duration = Date.now() - this.startTime

    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`[SLOW QUERY] ${this.queryName} took ${duration}ms`)
    } else if (duration > 500) {
      console.log(`[QUERY] ${this.queryName} took ${duration}ms`)
    }
  }

  static async measure<T>(queryName: string, operation: () => Promise<T>): Promise<T> {
    const monitor = new QueryMonitor(queryName)
    try {
      const result = await operation()
      monitor.end()
      return result
    } catch (error) {
      monitor.end()
      throw error
    }
  }
}

/**
 * Database index recommendations
 */
export const INDEX_RECOMMENDATIONS = {
  users: [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_users_sponsor ON users(sponsor_id)',
    'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)',
  ],
  commissions: [
    'CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON commissions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status)',
    'CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON commissions(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_commissions_user_status ON commissions(user_id, status)',
    'CREATE INDEX IF NOT EXISTS idx_commissions_type ON commissions(type)',
  ],
  orders: [
    'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
    'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status)',
  ],
  payments: [
    'CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)',
    'CREATE INDEX IF NOT EXISTS idx_payments_batch_id ON payments(batch_id)',
    'CREATE INDEX IF NOT EXISTS idx_payments_next_retry ON payments(next_retry_at)',
    'CREATE INDEX IF NOT EXISTS idx_payments_manual_review ON payments(requires_manual_review)',
  ],
  matrixPositions: [
    'CREATE INDEX IF NOT EXISTS idx_matrix_user_id ON matrix_positions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_matrix_sponsor ON matrix_positions(sponsor_id)',
    'CREATE INDEX IF NOT EXISTS idx_matrix_level ON matrix_positions(level)',
    'CREATE INDEX IF NOT EXISTS idx_matrix_parent ON matrix_positions(parent_id)',
  ],
  rankAchievements: [
    'CREATE INDEX IF NOT EXISTS idx_rank_achievements_user ON rank_achievements(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_rank_achievements_rank ON rank_achievements(rank_name)',
    'CREATE INDEX IF NOT EXISTS idx_rank_achievements_achieved ON rank_achievements(achieved_at DESC)',
  ],
  auditLogs: [
    'CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id)',
    'CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_audit_severity ON audit_logs(severity)',
  ],
}

/**
 * Query optimization tips
 */
export const QUERY_OPTIMIZATION_TIPS = {
  selectOnlyNeeded: {
    bad: 'SELECT * FROM users',
    good: 'SELECT id, email, first_name FROM users',
    reason: 'Only select the columns you need to reduce data transfer',
  },
  useIndexes: {
    bad: 'WHERE LOWER(email) = ?',
    good: 'WHERE email = ? (with index on email)',
    reason: 'Functions on indexed columns prevent index usage',
  },
  avoidNPlusOne: {
    bad: 'Query users, then loop and query orders for each user',
    good: 'Use JOIN or batch queries with WHERE user_id IN (?)',
    reason: 'N+1 queries multiply database round trips',
  },
  limitResults: {
    bad: 'SELECT * FROM orders',
    good: 'SELECT * FROM orders LIMIT 100',
    reason: 'Always paginate or limit large result sets',
  },
  useExplain: {
    example: 'EXPLAIN ANALYZE SELECT ...',
    reason: 'Use EXPLAIN to understand query execution plan',
  },
}

/**
 * Connection pool configuration recommendations
 */
export const CONNECTION_POOL_CONFIG = {
  development: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  production: {
    min: 5,
    max: 50,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  },
}

/**
 * Generate parameterized query safely
 */
export function safeQuery(
  template: TemplateStringsArray,
  ...values: any[]
): { text: string; values: any[] } {
  let text = template[0]
  const params: any[] = []

  for (let i = 0; i < values.length; i++) {
    params.push(values[i])
    text += `$${i + 1}${template[i + 1]}`
  }

  return { text, values: params }
}

/**
 * Prefetch related data to avoid N+1 queries
 */
export async function prefetchRelations<T extends { id: string }, R>(
  items: T[],
  relationKey: keyof T,
  fetcher: (ids: string[]) => Promise<Map<string, R>>
): Promise<(T & { [K in keyof T]: R })[]> {
  if (items.length === 0) return []

  const ids = items.map((item) => String(item[relationKey]))
  const relationsMap = await fetcher(ids)

  return items.map((item) => ({
    ...item,
    [relationKey]: relationsMap.get(String(item[relationKey])),
  })) as any
}
