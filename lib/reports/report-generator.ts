/**
 * Pre-configured Report Generator
 * Generates growth, revenue, commissions, and rank reports with export to CSV/JSON
 */

import { db } from '@/lib/db'
import { users, commissions, orders, payments, rankAchievements } from '@/lib/db/schema'
import { sql, desc, asc, eq, and, lte, between } from 'drizzle-orm'

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface ReportExportOptions {
  format: 'csv' | 'json'
  includeHeaders?: boolean
}

// ==================== GROWTH REPORT ====================

export interface GrowthReportData {
  period: string
  newDistributors: number
  activeDistributors: number
  totalDistributors: number
  retentionRate: number
  growthRate: number
}

export async function generateGrowthReport(
  dateRange: DateRange
): Promise<GrowthReportData[]> {
  const { startDate, endDate } = dateRange

  // Get new distributors in the period
  const newDistributors = await db
    .select({
      count: sql<number>`count(*)::int`,
      date: sql<string>`date_trunc('day', ${users.createdAt})`,
    })
    .from(users)
    .where(
      and(
        eq(users.role, 'distributor'),
        between(users.createdAt, startDate, endDate)
      )
    )
    .groupBy(sql`date_trunc('day', ${users.createdAt})`)
    .orderBy(asc(sql`date_trunc('day', ${users.createdAt})`))

  // Get total distributors count at end of period
  const totalDistributorsResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.role, 'distributor'), lte(users.createdAt, endDate)))

  const totalDistributors = totalDistributorsResult[0]?.count || 0

  // Calculate metrics for each day
  const report: GrowthReportData[] = []
  let runningTotal = totalDistributors

  for (const day of newDistributors) {
    const newCount = day.count
    const activeCount = Math.round(runningTotal * 0.85) // Estimate: 85% active (can be refined)

    report.push({
      period: day.date,
      newDistributors: newCount,
      activeDistributors: activeCount,
      totalDistributors: runningTotal,
      retentionRate: runningTotal > 0 ? (activeCount / runningTotal) * 100 : 0,
      growthRate: newCount > 0 && runningTotal > 0 ? (newCount / (runningTotal - newCount)) * 100 : 0,
    })
  }

  return report
}

// ==================== REVENUE REPORT ====================

export interface RevenueReportData {
  period: string
  totalRevenue: number
  productRevenue: number
  enrollmentRevenue: number
  orderCount: number
  averageOrderValue: number
}

export async function generateRevenueReport(
  dateRange: DateRange
): Promise<RevenueReportData[]> {
  const { startDate, endDate } = dateRange

  const revenueData = await db
    .select({
      date: sql<string>`date_trunc('day', ${orders.createdAt})`,
      totalRevenue: sql<number>`sum(${orders.total})::numeric`,
      orderCount: sql<number>`count(*)::int`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.status, 'completed'),
        between(orders.createdAt, startDate, endDate)
      )
    )
    .groupBy(sql`date_trunc('day', ${orders.createdAt})`)
    .orderBy(asc(sql`date_trunc('day', ${orders.createdAt})`))

  const report: RevenueReportData[] = revenueData.map((day) => ({
    period: day.date,
    totalRevenue: Number(day.totalRevenue) || 0,
    productRevenue: Number(day.totalRevenue) * 0.7 || 0, // Estimate: 70% products (can be refined)
    enrollmentRevenue: Number(day.totalRevenue) * 0.3 || 0, // Estimate: 30% enrollments
    orderCount: day.orderCount || 0,
    averageOrderValue:
      day.orderCount > 0 ? Number(day.totalRevenue) / day.orderCount : 0,
  }))

  return report
}

// ==================== COMMISSION REPORT ====================

export interface CommissionReportData {
  period: string
  totalCommissions: number
  retailCommissions: number
  matrixCommissions: number
  rankBonuses: number
  matchingBonuses: number
  commissionCount: number
  averageCommission: number
}

export async function generateCommissionReport(
  dateRange: DateRange
): Promise<CommissionReportData[]> {
  const { startDate, endDate } = dateRange

  const commissionData = await db
    .select({
      date: sql<string>`date_trunc('day', ${commissions.createdAt})`,
      type: commissions.type,
      totalAmount: sql<number>`sum(${commissions.amount})::numeric`,
      count: sql<number>`count(*)::int`,
    })
    .from(commissions)
    .where(
      and(
        eq(commissions.status, 'approved'),
        between(commissions.createdAt, startDate, endDate)
      )
    )
    .groupBy(sql`date_trunc('day', ${commissions.createdAt})`, commissions.type)
    .orderBy(asc(sql`date_trunc('day', ${commissions.createdAt})`))

  // Group by date
  const grouped: Record<string, CommissionReportData> = {}

  for (const row of commissionData) {
    if (!grouped[row.date]) {
      grouped[row.date] = {
        period: row.date,
        totalCommissions: 0,
        retailCommissions: 0,
        matrixCommissions: 0,
        rankBonuses: 0,
        matchingBonuses: 0,
        commissionCount: 0,
        averageCommission: 0,
      }
    }

    const amount = Number(row.totalAmount) || 0
    const count = row.count || 0

    grouped[row.date].totalCommissions += amount
    grouped[row.date].commissionCount += count

    switch (row.type) {
      case 'retail':
        grouped[row.date].retailCommissions += amount
        break
      case 'matrix':
        grouped[row.date].matrixCommissions += amount
        break
      case 'rank_bonus':
        grouped[row.date].rankBonuses += amount
        break
      case 'matching':
        grouped[row.date].matchingBonuses += amount
        break
    }
  }

  // Calculate averages
  const report: CommissionReportData[] = Object.values(grouped).map((day) => ({
    ...day,
    averageCommission:
      day.commissionCount > 0 ? day.totalCommissions / day.commissionCount : 0,
  }))

  return report
}

// ==================== RANK ACHIEVEMENT REPORT ====================

export interface RankReportData {
  rankName: string
  achievementCount: number
  totalDistributorsAtRank: number
  averageTimeToAchieve: number // in days
  topEarners: Array<{
    userName: string
    userEmail: string
    totalEarnings: number
  }>
}

export async function generateRankReport(dateRange: DateRange): Promise<RankReportData[]> {
  const { startDate, endDate } = dateRange

  const rankData = await db
    .select({
      rankName: rankAchievements.rankName,
      achievementCount: sql<number>`count(distinct ${rankAchievements.userId})::int`,
      avgDays: sql<number>`avg(extract(epoch from ${rankAchievements.achievedAt} - ${users.createdAt}) / 86400)::numeric`,
    })
    .from(rankAchievements)
    .leftJoin(users, eq(rankAchievements.userId, users.id))
    .where(between(rankAchievements.achievedAt, startDate, endDate))
    .groupBy(rankAchievements.rankName)
    .orderBy(desc(sql`count(*)`))

  const report: RankReportData[] = []

  for (const rank of rankData) {
    // Get top earners for this rank
    const topEarners = await db
      .select({
        userName: users.firstName,
        userEmail: users.email,
        totalEarnings: sql<number>`sum(${commissions.amount})::numeric`,
      })
      .from(commissions)
      .leftJoin(users, eq(commissions.userId, users.id))
      .leftJoin(rankAchievements, eq(users.id, rankAchievements.userId))
      .where(
        and(
          eq(rankAchievements.rankName, rank.rankName),
          eq(commissions.status, 'approved'),
          between(commissions.createdAt, startDate, endDate)
        )
      )
      .groupBy(users.firstName, users.email)
      .orderBy(desc(sql`sum(${commissions.amount})`))
      .limit(5)

    report.push({
      rankName: rank.rankName,
      achievementCount: rank.achievementCount || 0,
      totalDistributorsAtRank: rank.achievementCount || 0,
      averageTimeToAchieve: Number(rank.avgDays) || 0,
      topEarners: topEarners.map((e) => ({
        userName: e.userName || 'Unknown',
        userEmail: e.userEmail || 'Unknown',
        totalEarnings: Number(e.totalEarnings) || 0,
      })),
    })
  }

  return report
}

// ==================== PAYOUT REPORT ====================

export interface PayoutReportData {
  period: string
  totalPaidOut: number
  paymentCount: number
  averagePayment: number
  successfulPayments: number
  failedPayments: number
  successRate: number
}

export async function generatePayoutReport(
  dateRange: DateRange
): Promise<PayoutReportData[]> {
  const { startDate, endDate } = dateRange

  const payoutData = await db
    .select({
      date: sql<string>`date_trunc('day', ${payments.processedAt})`,
      status: payments.status,
      totalAmount: sql<number>`sum(${payments.amount})::numeric`,
      count: sql<number>`count(*)::int`,
    })
    .from(payments)
    .where(between(payments.processedAt, startDate, endDate))
    .groupBy(sql`date_trunc('day', ${payments.processedAt})`, payments.status)
    .orderBy(asc(sql`date_trunc('day', ${payments.processedAt})`))

  // Group by date
  const grouped: Record<string, PayoutReportData> = {}

  for (const row of payoutData) {
    if (!grouped[row.date]) {
      grouped[row.date] = {
        period: row.date,
        totalPaidOut: 0,
        paymentCount: 0,
        averagePayment: 0,
        successfulPayments: 0,
        failedPayments: 0,
        successRate: 0,
      }
    }

    const amount = Number(row.totalAmount) || 0
    const count = row.count || 0

    grouped[row.date].paymentCount += count

    if (row.status === 'completed') {
      grouped[row.date].totalPaidOut += amount
      grouped[row.date].successfulPayments += count
    } else if (row.status === 'failed') {
      grouped[row.date].failedPayments += count
    }
  }

  // Calculate averages and success rates
  const report: PayoutReportData[] = Object.values(grouped).map((day) => ({
    ...day,
    averagePayment: day.successfulPayments > 0 ? day.totalPaidOut / day.successfulPayments : 0,
    successRate:
      day.paymentCount > 0 ? (day.successfulPayments / day.paymentCount) * 100 : 0,
  }))

  return report
}

// ==================== EXPORT FUNCTIONS ====================

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  includeHeaders = true
): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const rows: string[] = []

  if (includeHeaders) {
    rows.push(headers.join(','))
  }

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]

      // Handle nested objects/arrays
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }

      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }

      return value
    })

    rows.push(values.join(','))
  }

  return rows.join('\n')
}

export function exportToJSON<T>(data: T[]): string {
  return JSON.stringify(data, null, 2)
}

export function exportReport<T extends Record<string, any>>(
  data: T[],
  options: ReportExportOptions
): string {
  if (options.format === 'csv') {
    return exportToCSV(data, options.includeHeaders !== false)
  } else {
    return exportToJSON(data)
  }
}

// ==================== COMBINED DASHBOARD REPORT ====================

export interface DashboardReportData {
  dateRange: DateRange
  summary: {
    totalDistributors: number
    activeDistributors: number
    totalRevenue: number
    totalCommissions: number
    totalPayouts: number
    newDistributors: number
    revenueGrowth: number
  }
  growth: GrowthReportData[]
  revenue: RevenueReportData[]
  commissions: CommissionReportData[]
  ranks: RankReportData[]
  payouts: PayoutReportData[]
}

export async function generateDashboardReport(
  dateRange: DateRange
): Promise<DashboardReportData> {
  const [growth, revenue, commissionReport, ranks, payouts] = await Promise.all([
    generateGrowthReport(dateRange),
    generateRevenueReport(dateRange),
    generateCommissionReport(dateRange),
    generateRankReport(dateRange),
    generatePayoutReport(dateRange),
  ])

  // Calculate summary metrics
  const totalDistributors = growth[growth.length - 1]?.totalDistributors || 0
  const activeDistributors = growth[growth.length - 1]?.activeDistributors || 0
  const totalRevenue = revenue.reduce((sum, r) => sum + r.totalRevenue, 0)
  const totalCommissions = commissionReport.reduce((sum, c) => sum + c.totalCommissions, 0)
  const totalPayouts = payouts.reduce((sum, p) => sum + p.totalPaidOut, 0)
  const newDistributors = growth.reduce((sum, g) => sum + g.newDistributors, 0)

  // Calculate revenue growth (compare first and last periods)
  const revenueGrowth =
    revenue.length > 1 && revenue[0].totalRevenue > 0
      ? ((revenue[revenue.length - 1].totalRevenue - revenue[0].totalRevenue) /
          revenue[0].totalRevenue) *
        100
      : 0

  return {
    dateRange,
    summary: {
      totalDistributors,
      activeDistributors,
      totalRevenue,
      totalCommissions,
      totalPayouts,
      newDistributors,
      revenueGrowth,
    },
    growth,
    revenue,
    commissions: commissionReport,
    ranks,
    payouts,
  }
}
