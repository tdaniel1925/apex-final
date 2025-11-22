import { test, expect } from '@playwright/test'

test.describe('Marketing Pages', () => {
  const username = 'testsponsor'

  test('homepage loads correctly', async ({ page }) => {
    await page.goto(`/${username}`)

    // Check hero section
    await expect(page.locator('h1')).toContainText('Transform Your Financial Future')

    // Check navigation links
    await expect(page.locator('nav')).toContainText('Home')
    await expect(page.locator('nav')).toContainText('Opportunity')
    await expect(page.locator('nav')).toContainText('Products')
    await expect(page.locator('nav')).toContainText('Testimonials')
    await expect(page.locator('nav')).toContainText('About')

    // Check cart button exists
    await expect(page.locator('button:has-text("Cart")')).toBeVisible()

    // Check Join Now button
    await expect(page.locator('a:has-text("Join Now")')).toBeVisible()
  })

  test('opportunity page displays compensation plan', async ({ page }) => {
    await page.goto(`/${username}/opportunity`)

    await expect(page.locator('h1')).toContainText('Opportunity')

    // Check for compensation plan cards
    await expect(page.locator('text=Retail Commission')).toBeVisible()
    await expect(page.locator('text=25%')).toBeVisible()
    await expect(page.locator('text=Matrix Bonuses')).toBeVisible()

    // Check for rank information
    await expect(page.locator('text=Bronze')).toBeVisible()
    await expect(page.locator('text=Silver')).toBeVisible()
    await expect(page.locator('text=Gold')).toBeVisible()

    // Check for income calculator
    await expect(page.locator('text=Income Calculator')).toBeVisible()
  })

  test('products page displays product catalog', async ({ page }) => {
    await page.goto(`/${username}/products`)

    await expect(page.locator('h1')).toContainText('Premium Products')

    // Check for product cards
    await expect(page.locator('text=Premium Wellness Pack')).toBeVisible()
    await expect(page.locator('text=Energy Boost Formula')).toBeVisible()

    // Check for category filters
    await expect(page.locator('button:has-text("All Products")')).toBeVisible()
    await expect(page.locator('button:has-text("Health & Wellness")')).toBeVisible()
    await expect(page.locator('button:has-text("Beauty")')).toBeVisible()

    // Check for search input
    await expect(page.locator('input[placeholder="Search products..."]')).toBeVisible()
  })

  test('product filtering works correctly', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Get initial product count
    const allProducts = page.locator('text=Showing').first()
    await expect(allProducts).toContainText('12')

    // Filter by category
    await page.click('button:has-text("Beauty")')
    await page.waitForTimeout(500) // Wait for filter to apply

    // Should show fewer products
    await expect(page.locator('text=Beauty Essentials Kit')).toBeVisible()

    // Search for specific product
    await page.fill('input[placeholder="Search products..."]', 'immunity')
    await page.waitForTimeout(500)

    await expect(page.locator('text=Immunity Support')).toBeVisible()
  })

  test('testimonials page displays success stories', async ({ page }) => {
    await page.goto(`/${username}/testimonials`)

    await expect(page.locator('h1')).toContainText('Success Stories')

    // Check for featured testimonial
    await expect(page.locator('text=FEATURED SUCCESS STORY')).toBeVisible()

    // Check for multiple testimonials
    await expect(page.locator('text=Sarah Mitchell')).toBeVisible()
    await expect(page.locator('text=Marcus Johnson')).toBeVisible()

    // Check for income progression
    await expect(page.locator('text=Income Progression')).toBeVisible()
  })

  test('about page displays company information', async ({ page }) => {
    await page.goto(`/${username}/about`)

    await expect(page.locator('h1')).toContainText('About Apex Affinity Group')

    // Check for company mission
    await expect(page.locator('text=Our Mission')).toBeVisible()

    // Check for company history
    await expect(page.locator('text=2018 - The Beginning')).toBeVisible()

    // Check for core values
    await expect(page.locator('text=Integrity')).toBeVisible()
    await expect(page.locator('text=Excellence')).toBeVisible()

    // Check for leadership team
    await expect(page.locator('text=Leadership Team')).toBeVisible()
  })

  test('navigation between pages works', async ({ page }) => {
    await page.goto(`/${username}`)

    // Navigate to Products
    await page.click('nav a:has-text("Products")')
    await expect(page).toHaveURL(new RegExp(`/${username}/products`))

    // Navigate to Opportunity
    await page.click('nav a:has-text("Opportunity")')
    await expect(page).toHaveURL(new RegExp(`/${username}/opportunity`))

    // Navigate to Testimonials
    await page.click('nav a:has-text("Testimonials")')
    await expect(page).toHaveURL(new RegExp(`/${username}/testimonials`))

    // Navigate to About
    await page.click('nav a:has-text("About")')
    await expect(page).toHaveURL(new RegExp(`/${username}/about`))

    // Navigate back to Home
    await page.click('nav a:has-text("Home")')
    await expect(page).toHaveURL(new RegExp(`/${username}$`))
  })
})
