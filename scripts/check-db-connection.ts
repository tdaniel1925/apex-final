/**
 * Quick script to verify database connection and tables
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

async function checkDatabase() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env.local')
    process.exit(1)
  }

  console.log('🔍 Verifying database connection...')
  console.log('DATABASE_URL:', connectionString.substring(0, 50) + '...')

  try {
    const client = postgres(connectionString)
    const db = drizzle(client)

    // Check if users table exists
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    `)

    console.log('Result:', result)

    if (result && result.length > 0) {
      console.log('✅ Users table exists!')

      // Count users
      const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`)
      console.log(`   Found ${countResult[0].count} user(s)`)

      // Get test user
      const testUser = await db.execute(sql`SELECT * FROM users WHERE email = 'testsponsor@example.com'`)
      if (testUser && testUser.length > 0) {
        console.log(`   ✅ Test user found: ${testUser[0].first_name} ${testUser[0].last_name}`)
        console.log(`   🌐 Site: http://localhost:3003/${testUser[0].replicated_site_url}`)
      }

      // List all tables
      const allTables = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)

      console.log('\n📋 All tables in public schema:')
      allTables.forEach((row: any) => {
        console.log(`   - ${row.table_name}`)
      })

    } else {
      console.log('❌ Users table does NOT exist!')
      console.log('\n💡 Please run the migration SQL in Supabase SQL Editor')
      console.log('   File: drizzle/manual-migration-ultra-safe.sql')
    }

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Database error:', error)
    process.exit(1)
  }
}

checkDatabase()
