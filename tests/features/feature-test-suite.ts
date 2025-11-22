/**
 * Feature Testing Framework
 *
 * This module provides a comprehensive testing framework for validating
 * all features of the MLM platform after each deployment.
 */

export interface FeatureTest {
  id: string
  name: string
  category: FeatureCategory
  description: string
  tests: TestCase[]
  dependencies: string[]
  criticalPath: boolean
}

export interface TestCase {
  name: string
  execute: () => Promise<TestResult>
  timeout?: number
  retries?: number
}

export interface TestResult {
  passed: boolean
  duration: number
  error?: Error
  message?: string
}

export type FeatureCategory =
  | 'authentication'
  | 'matrix'
  | 'commissions'
  | 'payments'
  | 'dashboard'
  | 'genealogy'
  | 'admin'
  | 'replicated-site'

export class FeatureTestRunner {
  private tests: FeatureTest[] = []
  private results: Map<string, TestResult> = new Map()

  /**
   * Register a feature test
   */
  registerTest(test: FeatureTest) {
    this.tests.push(test)
  }

  /**
   * Run all feature tests
   */
  async runAll(): Promise<FeatureTestReport> {
    const startTime = Date.now()
    let passed = 0
    let failed = 0
    const failedTests: string[] = []

    for (const feature of this.tests) {
      console.log(`\n🧪 Testing: ${feature.name}`)

      for (const testCase of feature.tests) {
        try {
          const result = await this.runTestCase(testCase)
          this.results.set(`${feature.id}:${testCase.name}`, result)

          if (result.passed) {
            passed++
            console.log(`  ✅ ${testCase.name} (${result.duration}ms)`)
          } else {
            failed++
            failedTests.push(`${feature.name} - ${testCase.name}`)
            console.log(`  ❌ ${testCase.name}: ${result.error?.message}`)
          }
        } catch (error) {
          failed++
          failedTests.push(`${feature.name} - ${testCase.name}`)
          console.log(`  ❌ ${testCase.name}: ${error}`)
        }
      }
    }

    const duration = Date.now() - startTime

    return {
      totalTests: passed + failed,
      passed,
      failed,
      failedTests,
      duration,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Run only critical path tests
   */
  async runCritical(): Promise<FeatureTestReport> {
    const criticalTests = this.tests.filter((t) => t.criticalPath)
    const tempTests = this.tests
    this.tests = criticalTests
    const result = await this.runAll()
    this.tests = tempTests
    return result
  }

  /**
   * Run tests for a specific category
   */
  async runCategory(category: FeatureCategory): Promise<FeatureTestReport> {
    const categoryTests = this.tests.filter((t) => t.category === category)
    const tempTests = this.tests
    this.tests = categoryTests
    const result = await this.runAll()
    this.tests = tempTests
    return result
  }

  /**
   * Run a single test case with retries
   */
  private async runTestCase(testCase: TestCase): Promise<TestResult> {
    const retries = testCase.retries ?? 0
    const timeout = testCase.timeout ?? 30000

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now()

        const result = await Promise.race([
          testCase.execute(),
          new Promise<TestResult>((_, reject) =>
            setTimeout(() => reject(new Error('Test timeout')), timeout)
          ),
        ])

        return {
          ...result,
          duration: Date.now() - startTime,
        }
      } catch (error) {
        if (attempt === retries) {
          return {
            passed: false,
            duration: 0,
            error: error as Error,
          }
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return {
      passed: false,
      duration: 0,
      error: new Error('Test failed after retries'),
    }
  }

  /**
   * Get test results
   */
  getResults(): Map<string, TestResult> {
    return this.results
  }

  /**
   * Clear all results
   */
  clearResults() {
    this.results.clear()
  }
}

export interface FeatureTestReport {
  totalTests: number
  passed: number
  failed: number
  failedTests: string[]
  duration: number
  timestamp: string
}

// Global test runner instance
export const featureTestRunner = new FeatureTestRunner()
