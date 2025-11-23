import { db } from '@/lib/db'
import { auditLogs } from '@/lib/db/schema/audit-logs'

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'activate'
  | 'process'
  | 'cancel'
  | 'retry'
  | 'flag_for_review'

export type AuditEntity =
  | 'commission'
  | 'payout_batch'
  | 'tax_form'
  | 'user'
  | 'product'
  | 'order'
  | 'site_photo'
  | 'settings'
  | 'replicated_site'
  | 'payment'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export type AuditCategory = 'financial' | 'security' | 'administrative' | 'user_action'

interface AuditLogParams {
  userId?: string
  userEmail?: string
  userRole?: string
  action: AuditAction
  entity: AuditEntity
  entityId?: string
  description: string
  metadata?: Record<string, any>
  severity?: AuditSeverity
  category: AuditCategory
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    const metadata = params.metadata || {}

    if (params.ipAddress) {
      metadata.ipAddress = params.ipAddress
    }

    if (params.userAgent) {
      metadata.userAgent = params.userAgent
    }

    await db.insert(auditLogs).values({
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      description: params.description,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
      severity: params.severity || 'info',
      category: params.category,
      createdAt: new Date(),
    })

    console.log(`[AUDIT] ${params.action} ${params.entity} by ${params.userEmail || 'system'}`)
  } catch (error) {
    console.error('Error creating audit log:', error)
    // Don't throw - audit logging should never break the main flow
  }
}

// Convenience functions for common audit actions
export async function auditCommissionApproval(params: {
  userId: string
  userEmail: string
  commissionId: string
  amount: string
  recipientId: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'approve',
    entity: 'commission',
    entityId: params.commissionId,
    description: `Approved commission of ${params.amount} for user ${params.recipientId}`,
    severity: 'info',
    category: 'financial',
  })
}

export async function auditCommissionRejection(params: {
  userId: string
  userEmail: string
  commissionId: string
  amount: string
  recipientId: string
  reason?: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'reject',
    entity: 'commission',
    entityId: params.commissionId,
    description: `Rejected commission of ${params.amount} for user ${params.recipientId}${
      params.reason ? `: ${params.reason}` : ''
    }`,
    severity: 'warning',
    category: 'financial',
    metadata: { reason: params.reason },
  })
}

export async function auditPayoutBatchCreation(params: {
  userId: string
  userEmail: string
  batchId: string
  batchName: string
  totalAmount: string
  commissionCount: number
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'create',
    entity: 'payout_batch',
    entityId: params.batchId,
    description: `Created payout batch "${params.batchName}" with ${params.commissionCount} commissions totaling ${params.totalAmount}`,
    severity: 'critical',
    category: 'financial',
    metadata: {
      batchName: params.batchName,
      totalAmount: params.totalAmount,
      commissionCount: params.commissionCount,
    },
  })
}

export async function auditPayoutBatchProcessing(params: {
  userId: string
  userEmail: string
  batchId: string
  batchName: string
  totalAmount: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'process',
    entity: 'payout_batch',
    entityId: params.batchId,
    description: `Processed payout batch "${params.batchName}" for ${params.totalAmount}`,
    severity: 'critical',
    category: 'financial',
    metadata: {
      batchName: params.batchName,
      totalAmount: params.totalAmount,
    },
  })
}

export async function auditTaxFormApproval(params: {
  userId: string
  userEmail: string
  formId: string
  distributorId: string
  distributorEmail: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'approve',
    entity: 'tax_form',
    entityId: params.formId,
    description: `Approved tax form for ${params.distributorEmail}`,
    severity: 'info',
    category: 'administrative',
    metadata: { distributorId: params.distributorId },
  })
}

export async function auditUserSuspension(params: {
  userId: string
  userEmail: string
  targetUserId: string
  targetUserEmail: string
  reason: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'suspend',
    entity: 'user',
    entityId: params.targetUserId,
    description: `Suspended user ${params.targetUserEmail}: ${params.reason}`,
    severity: 'warning',
    category: 'security',
    metadata: { reason: params.reason, targetUserEmail: params.targetUserEmail },
  })
}

export async function auditSettingsChange(params: {
  userId: string
  userEmail: string
  settingName: string
  oldValue: any
  newValue: any
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: 'admin',
    action: 'update',
    entity: 'settings',
    description: `Changed ${params.settingName} setting`,
    severity: 'warning',
    category: 'administrative',
    metadata: {
      settingName: params.settingName,
      oldValue: params.oldValue,
      newValue: params.newValue,
    },
  })
}

export async function auditPayoutRetry(params: {
  userId?: string
  paymentId: string
  retryCount: number
  nextRetryAt?: string
  reason: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userId ? undefined : 'system',
    userRole: params.userId ? 'admin' : 'system',
    action: 'retry',
    entity: 'payment',
    entityId: params.paymentId,
    description: `Payout retry attempt ${params.retryCount}: ${params.reason}`,
    severity: 'warning',
    category: 'financial',
    metadata: {
      retryCount: params.retryCount,
      nextRetryAt: params.nextRetryAt,
      reason: params.reason,
    },
  })
}

export async function auditPayoutManualReview(params: {
  userId?: string
  paymentId: string
  reason: string
}) {
  await createAuditLog({
    userId: params.userId,
    userEmail: params.userId ? undefined : 'system',
    userRole: params.userId ? 'admin' : 'system',
    action: 'flag_for_review',
    entity: 'payment',
    entityId: params.paymentId,
    description: `Payment flagged for manual review: ${params.reason}`,
    severity: 'critical',
    category: 'financial',
    metadata: {
      reason: params.reason,
    },
  })
}
