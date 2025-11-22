/**
 * Quick seed script to create a test distributor
 * Run this AFTER you've approved the database migration
 */

import { db } from '../lib/db'
import { users } from '../lib/db/schema'

async function seedTestUser() {
  try {
    console.log('🌱 Seeding test distributor...')

    const testUser = await db.insert(users).values({
      email: 'testsponsor@example.com',
      firstName: 'Test',
      lastName: 'Sponsor',
      phone: '555-123-4567',
      status: 'active',
      role: 'distributor',
      replicatedSiteUrl: 'testsponsor',
      address: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    }).returning()

    console.log('✅ Test distributor created!')
    console.log(`   Email: testsponsor@example.com`)
    console.log(`   Site URL: http://localhost:3003/testsponsor`)
    console.log(`   ID: ${testUser[0].id}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding test user:', error)
    process.exit(1)
  }
}

seedTestUser()
