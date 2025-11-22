import { NextResponse } from 'next/server'
import { healthChecker } from '@/lib/health-check'

export async function GET() {
  try {
    const health = await healthChecker.checkAll()

    const statusCode = health.overall === 'healthy' ? 200 : health.overall === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        overall: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
