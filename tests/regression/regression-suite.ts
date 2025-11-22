/**
 * Automated Regression Test Suite
 *
 * Runs comprehensive tests to ensure no existing functionality breaks
 */

import { featureTestRunner } from '../features/feature-test-suite'

export interface RegressionTestConfig {
  runCriticalOnly: boolean
  failFast: boolean
  timeout: number
  retries: number
}

export class RegressionSuite {
  private config: RegressionTestConfig

  constructor(config?: Partial<RegressionTestConfig>) {
    this.config = {
      runCriticalOnly: false,
      failFast: false,
      timeout: 300000, // 5 minutes
      retries: 2,
      ...config,
    }
  }

  /**
   * Run full regression test suite
   */
  async run() {
    console.log('\n🔄 Starting Regression Test Suite...\n')
    console.log('=' + '='.repeat(60))

    const startTime = Date.now()

    try {
      // Run feature tests
      const featureReport = this.config.runCriticalOnly
        ? await featureTestRunner.runCritical()
        : await featureTestRunner.runAll()

      const duration = Date.now() - startTime

      // Print results
      console.log('\n' + '='.repeat(60))
      console.log('\n📊 REGRESSION TEST RESULTS\n')
      console.log(`Total Tests: ${featureReport.totalTests}`)
      console.log(`✅ Passed: ${featureReport.passed}`)
      console.log(`❌ Failed: ${featureReport.failed}`)
      console.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`)

      if (featureReport.failed > 0) {
        console.log('\n🚨 Failed Tests:')
        featureReport.failedTests.forEach((test, index) => {
          console.log(`   ${index + 1}. ${test}`)
        })
      }

      console.log('\n' + '='.repeat(60))

      // Determine pass/fail
      if (featureReport.failed === 0) {
        console.log('\n✅ ALL REGRESSION TESTS PASSED!\n')
        return {
          success: true,
          report: featureReport,
        }
      } else {
        console.log('\n❌ REGRESSION TESTS FAILED!\n')
        return {
          success: false,
          report: featureReport,
        }
      }
    } catch (error) {
      console.error('\n❌ Regression suite error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Export default regression suite
export const regressionSuite = new RegressionSuite()
