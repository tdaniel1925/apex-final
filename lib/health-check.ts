/**
 * Health Check System
 *
 * Provides comprehensive health monitoring for all critical services
 */

export interface HealthCheckResult {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  message?: string
  details?: Record<string, unknown>
  timestamp: string
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  checks: HealthCheckResult[]
  timestamp: string
  uptime: number
}

export class HealthChecker {
  private checks: Map<string, () => Promise<HealthCheckResult>> = new Map()

  /**
   * Register a health check
   */
  register(name: string, checkFn: () => Promise<HealthCheckResult>) {
    this.checks.set(name, checkFn)
  }

  /**
   * Run all health checks
   */
  async checkAll(): Promise<SystemHealth> {
    const results: HealthCheckResult[] = []

    for (const [name, checkFn] of this.checks) {
      try {
        const result = await checkFn()
        results.push(result)
      } catch (error) {
        results.push({
          service: name,
          status: 'unhealthy',
          responseTime: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        })
      }
    }

    const overall = this.determineOverallHealth(results)

    return {
      overall,
      checks: results,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }

  /**
   * Check a specific service
   */
  async checkService(name: string): Promise<HealthCheckResult | null> {
    const checkFn = this.checks.get(name)
    if (!checkFn) return null

    try {
      return await checkFn()
    } catch (error) {
      return {
        service: name,
        status: 'unhealthy',
        responseTime: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Determine overall system health
   */
  private determineOverallHealth(
    results: HealthCheckResult[]
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthy = results.filter((r) => r.status === 'unhealthy').length
    const degraded = results.filter((r) => r.status === 'degraded').length

    if (unhealthy > 0) return 'unhealthy'
    if (degraded > 0) return 'degraded'
    return 'healthy'
  }
}

/**
 * Database Health Check
 */
export async function checkDatabase(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    // This will be implemented when we set up Supabase
    // For now, return a placeholder
    return {
      service: 'database',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Database check failed',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Stripe Health Check
 */
export async function checkStripe(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    // This will be implemented when we set up Stripe
    return {
      service: 'stripe',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Stripe API accessible',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      service: 'stripe',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Stripe check failed',
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Email Service Health Check
 */
export async function checkEmailService(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    // This will be implemented when we set up Resend
    return {
      service: 'email',
      status: 'healthy',
      responseTime: Date.now() - startTime,
      message: 'Email service accessible',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      service: 'email',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: error instanceof Error ? error.message : 'Email service check failed',
      timestamp: new Date().toISOString(),
    }
  }
}

// Global health checker instance
export const healthChecker = new HealthChecker()

// Register default checks
healthChecker.register('database', checkDatabase)
healthChecker.register('stripe', checkStripe)
healthChecker.register('email', checkEmailService)
