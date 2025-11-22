/**
 * Quick script to verify database connection and tables
 */

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { db } from '../lib/db'
import { sql } from 'drizzle-orm'

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

    // Check if users table exists
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    `)

    if (result.rows.length > 0) {
      console.log('✅ Users table exists!')

      // Count users
      const countResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`)
      console.log(`   Found ${countResult.rows[0].count} user(s)`)

      // List all tables
      const allTables = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)

      console.log('\n📋 All tables in public schema:')
      allTables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })

    } else {
      console.log('❌ Users table does NOT exist!')
      console.log('\n💡 Please run the migration SQL in Supabase SQL Editor')
      console.log('   File: drizzle/manual-migration-ultra-safe.sql')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Database error:', error)
    process.exit(1)
  }
}

verifyDatabase()
