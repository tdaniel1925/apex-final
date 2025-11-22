import { test, expect } from '@playwright/test'

test.describe('Enrollment Flow', () => {
  const sponsorUsername = 'testsp onsor'

  test('complete enrollment flow from homepage to success', async ({ page }) => {
    // Start on sponsor's homepage
    await page.goto(`/${sponsorUsername}`)
    await expect(page).toHaveTitle(/Apex Affinity Group/)

    // Click "Join Now" button
    await page.click('text=Join Now')
    await expect(page).toHaveURL(new RegExp(`/${sponsorUsername}/enroll`))

    // Step 1: Personal Information
    await expect(page.locator('h2')).toContainText('Step 1: Personal Info')
    await page.fill('#firstName', 'John')
    await page.fill('#lastName', 'Doe')
    await page.fill('#email', 'john.doe@example.com')
    await page.fill('#phone', '5551234567')
    await page.fill('#dateOfBirth', '1990-01-15')
    await page.click('button:has-text("Next Step")')

    // Step 2: Address
    await expect(page.locator('h2')).toContainText('Step 2: Address')
    await page.fill('#address', '123 Main Street')
    await page.fill('#city', 'Los Angeles')
    await page.selectOption('#state', 'CA')
    await page.fill('#zipCode', '90210')
    await page.click('button:has-text("Next Step")')

    // Step 3: Account Setup
    await expect(page.locator('h2')).toContainText('Step 3: Account Setup')
    await page.fill('#username', 'johndoe123')
    await page.fill('#password', 'SecurePass123!')
    await page.fill('#confirmPassword', 'SecurePass123!')
    await page.click('button:has-text("Next Step")')

    // Step 4: Sponsor Verification
    await expect(page.locator('h2')).toContainText('Step 4: Sponsor')
    // Sponsor should be pre-filled from URL
    await expect(page.locator('#sponsorUsername')).toHaveValue(sponsorUsername)
    await page.click('button:has-text("Verify")')
    // Wait for verification
    await page.waitForSelector('text=Sponsor Verified', { timeout: 5000 })
    await page.click('button:has-text("Next Step")')

    // Step 5: Autoship Selection
    await expect(page.locator('h2')).toContainText('Step 5: Autoship')
    // Select popular pack to meet minimum
    await page.click('button:has-text("Select Popular Pack")')
    await page.waitForSelector('text=Meets $100 minimum')
    await page.click('button:has-text("Next Step")')

    // Step 6: Payment & Tax
    await expect(page.locator('h2')).toContainText('Step 6: Payment & Tax')

    // Upload tax form (mock)
    const taxFormInput = page.locator('#tax-form-upload')
    await taxFormInput.setInputFiles({
      name: 'w9-form.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('mock pdf content'),
    })
    await page.waitForSelector('text=W-9 Form Uploaded Successfully', { timeout: 5000 })

    // Set up payment method
    await page.click('button:has-text("Set Up Payment Method")')
    await page.waitForSelector('text=Payment Method Added', { timeout: 5000 })

    // Agree to terms
    await page.click('#terms')

    // Complete enrollment
    await page.click('button:has-text("Complete Enrollment")')

    // Should redirect to success page
    await expect(page).toHaveURL(new RegExp(`/${sponsorUsername}/enroll/success`), {
      timeout: 10000,
    })
    await expect(page.locator('h1')).toContainText('Welcome to Apex Affinity Group')
    await expect(page.locator('text=Enrollment Confirmed')).toBeVisible()
  })

  test('cannot proceed without required fields', async ({ page }) => {
    await page.goto(`/${sponsorUsername}/enroll`)

    // Try to click Next without filling fields
    const nextButton = page.locator('button:has-text("Next Step")')
    await expect(nextButton).toBeDisabled()

    // Fill one field
    await page.fill('#firstName', 'John')
    await expect(nextButton).toBeDisabled()

    // Fill all required fields
    await page.fill('#lastName', 'Doe')
    await page.fill('#email', 'john@example.com')
    await page.fill('#phone', '5551234567')
    await page.fill('#dateOfBirth', '1990-01-15')

    // Now should be enabled
    await expect(nextButton).toBeEnabled()
  })

  test('password validation works correctly', async ({ page }) => {
    await page.goto(`/${sponsorUsername}/enroll`)

    // Navigate to account setup step
    // Fill step 1
    await page.fill('#firstName', 'John')
    await page.fill('#lastName', 'Doe')
    await page.fill('#email', 'john@example.com')
    await page.fill('#phone', '5551234567')
    await page.fill('#dateOfBirth', '1990-01-15')
    await page.click('button:has-text("Next Step")')

    // Fill step 2
    await page.fill('#address', '123 Main St')
    await page.fill('#city', 'Los Angeles')
    await page.selectOption('#state', 'CA')
    await page.fill('#zipCode', '90210')
    await page.click('button:has-text("Next Step")')

    // Step 3: Test password validation
    await page.fill('#username', 'johndoe')

    // Weak password
    await page.fill('#password', 'weak')
    const nextButton = page.locator('button:has-text("Next Step")')
    await expect(nextButton).toBeDisabled()

    // Strong password
    await page.fill('#password', 'StrongPass123!')
    await page.fill('#confirmPassword', 'StrongPass123!')
    await expect(nextButton).toBeEnabled()

    // Mismatched passwords
    await page.fill('#confirmPassword', 'DifferentPass123!')
    await expect(nextButton).toBeDisabled()
  })

  test('autoship minimum requirement enforced', async ({ page }) => {
    await page.goto(`/${sponsorUsername}/enroll`)

    // Navigate to autoship step (skip previous steps)
    // ... fill required fields for steps 1-4 ...

    // On step 5, verify minimum is enforced
    const nextButton = page.locator('button:has-text("Next Step")')

    // Should see minimum not met message
    await expect(page.locator('text=Minimum $100 required')).toBeVisible()
    await expect(nextButton).toBeDisabled()

    // Select products to meet minimum
    await page.click('button:has-text("Select Popular Pack")')
    await expect(page.locator('text=Meets $100 minimum')).toBeVisible()
    await expect(nextButton).toBeEnabled()
  })

  test('can navigate back through steps', async ({ page }) => {
    await page.goto(`/${sponsorUsername}/enroll`)

    // Fill step 1 and proceed
    await page.fill('#firstName', 'John')
    await page.fill('#lastName', 'Doe')
    await page.fill('#email', 'john@example.com')
    await page.fill('#phone', '5551234567')
    await page.fill('#dateOfBirth', '1990-01-15')
    await page.click('button:has-text("Next Step")')

    // Verify on step 2
    await expect(page.locator('h2')).toContainText('Step 2')

    // Click previous
    await page.click('button:has-text("Previous")')

    // Should be back on step 1 with data preserved
    await expect(page.locator('h2')).toContainText('Step 1')
    await expect(page.locator('#firstName')).toHaveValue('John')
    await expect(page.locator('#lastName')).toHaveValue('Doe')
  })
})
