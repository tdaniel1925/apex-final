import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  const username = 'testsponsor'

  test.beforeEach(async ({ page }) => {
    // Clear local storage to reset cart
    await page.goto(`/${username}/products`)
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('can add products to cart', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Cart should be empty initially
    const cartButton = page.locator('button:has-text("Cart")')
    await expect(cartButton).not.toContainText(/\d/)

    // Add first product
    await page.locator('button:has-text("Add to Cart")').first().click()

    // Should see toast notification
    await expect(page.locator('text=Added to cart')).toBeVisible({ timeout: 2000 })

    // Cart badge should show 1
    await expect(page.locator('button:has-text("Cart")')).toContainText('1')

    // Add another product
    await page.locator('button:has-text("Add to Cart")').nth(1).click()

    // Cart badge should show 2
    await expect(page.locator('button:has-text("Cart")')).toContainText('2')
  })

  test('cart persists across page navigation', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add product to cart
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(500)

    // Navigate away
    await page.click('nav a:has-text("Home")')

    // Cart badge should still show 1
    await expect(page.locator('button:has-text("Cart")')).toContainText('1')

    // Navigate back to products
    await page.click('nav a:has-text("Products")')

    // Cart badge should still show 1
    await expect(page.locator('button:has-text("Cart")')).toContainText('1')
  })

  test('can open and close cart', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add a product
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(1000)

    // Open cart
    await page.click('button:has-text("Cart")')

    // Cart should be visible
    await expect(page.locator('h2:has-text("Shopping Cart")')).toBeVisible()

    // Should see product in cart
    await expect(page.locator('text=Premium Wellness Pack')).toBeVisible()

    // Close cart (click X button or overlay)
    await page.locator('button').filter({ hasText: /^$/ }).first().click() // X button
    await page.waitForTimeout(500)

    // Cart should be closed
    await expect(page.locator('h2:has-text("Shopping Cart")')).not.toBeVisible()
  })

  test('can update product quantity in cart', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add product
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(1000)

    // Open cart
    await page.click('button:has-text("Cart")')

    // Check initial quantity is 1
    await expect(page.locator('.cart-item'). first().locator('text=1')).toBeVisible()

    // Click plus button to increase quantity
    await page.locator('button').filter({ has: page.locator('svg') }).nth(2).click() // Plus icon
    await page.waitForTimeout(500)

    // Quantity should be 2
    await expect(page.locator('text=2')).toBeVisible()

    // Total should update
    // (Specific assertion depends on product price)
  })

  test('can remove product from cart', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add product
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(1000)

    // Open cart
    await page.click('button:has-text("Cart")')

    // Click remove button
    await page.click('button:has-text("Remove")')
    await page.waitForTimeout(500)

    // Cart should be empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible()

    // Cart badge should not show number
    await expect(page.locator('button:has-text("Cart")')).not.toContainText(/\d/)
  })

  test('displays correct totals and commission', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add a product with known price (Premium Wellness Pack - $99.99)
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(1000)

    // Open cart
    await page.click('button:has-text("Cart")')

    // Check subtotal
    await expect(page.locator('text=Subtotal')).toBeVisible()
    await expect(page.locator('text=$99.99')).toBeVisible()

    // Check commission (25% of $99.99 = $24.99)
    await expect(page.locator('text=Your Commission (25%)')).toBeVisible()
    await expect(page.locator('text=+$25.00')).toBeVisible()

    // Check total
    await expect(page.locator('text=Total')).toBeVisible()
  })

  test('empty cart shows correct message', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Open cart without adding products
    await page.click('button:has-text("Cart")')

    // Should show empty state
    await expect(page.locator('text=Your cart is empty')).toBeVisible()
    await expect(page.locator('text=Add products to get started')).toBeVisible()
    await expect(page.locator('button:has-text("Continue Shopping")')).toBeVisible()
  })

  test('proceed to checkout button is visible when cart has items', async ({ page }) => {
    await page.goto(`/${username}/products`)

    // Add product
    await page.locator('button:has-text("Add to Cart")').first().click()
    await page.waitForTimeout(1000)

    // Open cart
    await page.click('button:has-text("Cart")')

    // Checkout button should be visible
    await expect(page.locator('button:has-text("Proceed to Checkout")')).toBeVisible()
  })
})
