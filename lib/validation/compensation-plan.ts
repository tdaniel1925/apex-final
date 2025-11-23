/**
 * Validation rules for compensation plan settings
 * Ensures all settings are within acceptable ranges and consistent
 */

export interface MatrixSettings {
  width: number
  depth: number
}

export interface CommissionRates {
  retail: number // Percentage 0-100
  matrixLevels: number[] // Array of percentages for each level
  rankBonuses: Record<string, number> // Rank name to bonus amount
  matchingLevels: number // Number of levels for matching bonuses
  matchingPercentage: number // Percentage for matching bonuses
}

export interface CompensationPlanSettings {
  matrix: MatrixSettings
  commissions: CommissionRates
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate matrix configuration
 */
export function validateMatrixSettings(settings: MatrixSettings): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Width validation
  if (!Number.isInteger(settings.width)) {
    errors.push('Matrix width must be a whole number')
  } else if (settings.width < 2) {
    errors.push('Matrix width must be at least 2')
  } else if (settings.width > 10) {
    errors.push('Matrix width cannot exceed 10')
  } else if (settings.width > 5) {
    warnings.push('Large matrix widths may slow down spillover calculations')
  }

  // Depth validation
  if (!Number.isInteger(settings.depth)) {
    errors.push('Matrix depth must be a whole number')
  } else if (settings.depth < 1) {
    errors.push('Matrix depth must be at least 1')
  } else if (settings.depth > 15) {
    errors.push('Matrix depth cannot exceed 15 levels')
  } else if (settings.depth > 9) {
    warnings.push('Deep matrices may have very large downlines')
  }

  // Calculate total possible positions
  const totalPositions = calculateTotalPositions(settings.width, settings.depth)
  if (totalPositions > 1000000) {
    warnings.push(
      `This matrix can hold up to ${totalPositions.toLocaleString()} distributors. Consider reducing width or depth.`
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate commission rates
 */
export function validateCommissionRates(rates: CommissionRates): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Retail commission validation
  if (typeof rates.retail !== 'number') {
    errors.push('Retail commission must be a number')
  } else if (rates.retail < 0) {
    errors.push('Retail commission cannot be negative')
  } else if (rates.retail > 100) {
    errors.push('Retail commission cannot exceed 100%')
  } else if (rates.retail < 10) {
    warnings.push('Low retail commission may not motivate distributors')
  } else if (rates.retail > 50) {
    warnings.push('High retail commission may impact profitability')
  }

  // Matrix levels validation
  if (!Array.isArray(rates.matrixLevels)) {
    errors.push('Matrix levels must be an array')
  } else {
    if (rates.matrixLevels.length === 0) {
      errors.push('At least one matrix level is required')
    }

    if (rates.matrixLevels.length > 15) {
      errors.push('Cannot have more than 15 matrix levels')
    }

    rates.matrixLevels.forEach((percentage, index) => {
      if (typeof percentage !== 'number') {
        errors.push(`Matrix level ${index + 1} percentage must be a number`)
      } else if (percentage < 0) {
        errors.push(`Matrix level ${index + 1} percentage cannot be negative`)
      } else if (percentage > 50) {
        errors.push(`Matrix level ${index + 1} percentage cannot exceed 50%`)
      }
    })

    // Calculate total matrix payout percentage
    const totalMatrixPayout = rates.matrixLevels.reduce((sum, p) => sum + p, 0)
    if (totalMatrixPayout > 100) {
      errors.push(
        `Total matrix payout (${totalMatrixPayout}%) exceeds 100% - this is unsustainable`
      )
    } else if (totalMatrixPayout > 75) {
      warnings.push(
        `High total matrix payout (${totalMatrixPayout}%) may impact profitability`
      )
    }
  }

  // Matching bonuses validation
  if (typeof rates.matchingLevels !== 'number') {
    errors.push('Matching levels must be a number')
  } else if (rates.matchingLevels < 0) {
    errors.push('Matching levels cannot be negative')
  } else if (rates.matchingLevels > 10) {
    errors.push('Matching levels cannot exceed 10')
  }

  if (typeof rates.matchingPercentage !== 'number') {
    errors.push('Matching percentage must be a number')
  } else if (rates.matchingPercentage < 0) {
    errors.push('Matching percentage cannot be negative')
  } else if (rates.matchingPercentage > 100) {
    errors.push('Matching percentage cannot exceed 100%')
  } else if (rates.matchingPercentage > 50) {
    warnings.push('High matching percentage may impact profitability')
  }

  // Rank bonuses validation
  if (typeof rates.rankBonuses !== 'object' || rates.rankBonuses === null) {
    errors.push('Rank bonuses must be an object')
  } else {
    Object.entries(rates.rankBonuses).forEach(([rank, amount]) => {
      if (typeof amount !== 'number') {
        errors.push(`Rank bonus for ${rank} must be a number`)
      } else if (amount < 0) {
        errors.push(`Rank bonus for ${rank} cannot be negative`)
      } else if (amount > 100000) {
        warnings.push(`Very high rank bonus for ${rank} ($${amount.toLocaleString()})`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate complete compensation plan
 */
export function validateCompensationPlan(
  settings: CompensationPlanSettings
): ValidationResult {
  const matrixValidation = validateMatrixSettings(settings.matrix)
  const commissionValidation = validateCommissionRates(settings.commissions)

  // Check for consistency between matrix depth and commission levels
  const warnings: string[] = [
    ...matrixValidation.warnings,
    ...commissionValidation.warnings,
  ]
  const errors: string[] = [...matrixValidation.errors, ...commissionValidation.errors]

  if (settings.commissions.matrixLevels.length !== settings.matrix.depth) {
    warnings.push(
      `Matrix depth (${settings.matrix.depth}) doesn't match number of commission levels (${settings.commissions.matrixLevels.length})`
    )
  }

  // Calculate total payout percentage
  const retailPayout = settings.commissions.retail
  const matrixPayout = settings.commissions.matrixLevels.reduce((sum, p) => sum + p, 0)
  const matchingPayout =
    settings.commissions.matchingPercentage * settings.commissions.matchingLevels
  const totalPayout = retailPayout + matrixPayout + matchingPayout

  if (totalPayout > 100) {
    errors.push(
      `Total potential payout (${totalPayout.toFixed(
        2
      )}%) exceeds 100% - this plan is mathematically impossible`
    )
  } else if (totalPayout > 75) {
    warnings.push(
      `High total payout percentage (${totalPayout.toFixed(2)}%) may not be sustainable`
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Calculate total positions in matrix
 */
function calculateTotalPositions(width: number, depth: number): number {
  let total = 0
  for (let level = 1; level <= depth; level++) {
    total += Math.pow(width, level)
  }
  return total
}

/**
 * Calculate maximum theoretical payout
 */
export function calculateMaxPayout(settings: CompensationPlanSettings): number {
  const retail = settings.commissions.retail
  const matrix = settings.commissions.matrixLevels.reduce((sum, p) => sum + p, 0)
  const matching =
    settings.commissions.matchingPercentage * settings.commissions.matchingLevels

  return retail + matrix + matching
}

/**
 * Get suggested compensation plan limits
 */
export const COMPENSATION_LIMITS = {
  matrix: {
    minWidth: 2,
    maxWidth: 10,
    minDepth: 1,
    maxDepth: 15,
    recommendedWidth: 5,
    recommendedDepth: 9,
  },
  commissions: {
    minRetail: 0,
    maxRetail: 100,
    recommendedRetail: 25,
    minMatrixLevel: 0,
    maxMatrixLevel: 50,
    minMatchingPercentage: 0,
    maxMatchingPercentage: 100,
    recommendedMatchingPercentage: 10,
    maxMatchingLevels: 10,
    recommendedMatchingLevels: 5,
  },
  maxTotalPayout: 100,
  recommendedMaxPayout: 75,
}
