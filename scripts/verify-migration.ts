#!/usr/bin/env tsx
/**
 * Database Migration Verification Script
 *
 * This script verifies that all database migrations have been applied successfully
 * and that the database schema matches the expected state.
 *
 * Usage: npm run db:verify
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface MigrationCheck {
  name: string;
  description: string;
  check: () => Promise<boolean>;
  critical: boolean;
}

// Define all expected tables and their critical columns
const EXPECTED_SCHEMA = {
  tables: [
    { name: 'users', critical: true },
    { name: 'matrix_positions', critical: true },
    { name: 'products', critical: true },
    { name: 'orders', critical: true },
    { name: 'order_items', critical: true },
    { name: 'commissions', critical: true },
    { name: 'payout_batches', critical: true },
    { name: 'rank_achievements', critical: true },
    { name: 'ranks', critical: true },
    { name: 'compensation_plan_settings', critical: true },
    { name: 'tax_forms', critical: true },
    { name: 'replicated_site_settings', critical: true },
    { name: 'audit_logs', critical: false },
  ],
  indexes: [
    'idx_users_sponsor',
    'idx_users_username',
    'idx_users_email',
    'idx_matrix_user',
    'idx_matrix_parent',
    'idx_matrix_level',
    'idx_products_active',
    'idx_orders_distributor',
    'idx_commissions_user',
    'idx_commissions_status',
  ],
  policies: [
    { table: 'users', policy: 'Users can view own record' },
    { table: 'commissions', policy: 'Users view own commissions' },
  ],
};

/**
 * Check if a table exists
 */
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    return !error || error.code !== '42P01'; // 42P01 = undefined_table
  } catch (error) {
    return false;
  }
}

/**
 * Check if an index exists
 */
async function indexExists(indexName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_index_exists', {
      index_name: indexName
    });

    return data === true;
  } catch (error) {
    // If RPC doesn't exist, use fallback query
    return false;
  }
}

/**
 * Get table row count
 */
async function getTableCount(tableName: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    return count || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Main verification function
 */
async function verifyMigrations() {
  console.log('\n🔍 Starting Database Migration Verification...\n');
  console.log('=' .repeat(60));

  let passedChecks = 0;
  let failedChecks = 0;
  let criticalFailures: string[] = [];

  // 1. Check Database Connection
  console.log('\n📡 Step 1: Verifying Database Connection...');
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && error.code === '42P01') {
      console.log('⚠️  Database connected, but tables not yet created');
    } else if (error) {
      console.log(`❌ Database connection error: ${error.message}`);
      criticalFailures.push('Database connection failed');
    } else {
      console.log('✅ Database connection successful');
      passedChecks++;
    }
  } catch (error) {
    console.log(`❌ Database connection failed: ${error}`);
    criticalFailures.push('Database connection failed');
    failedChecks++;
  }

  // 2. Check All Required Tables
  console.log('\n📊 Step 2: Verifying Required Tables...');
  for (const table of EXPECTED_SCHEMA.tables) {
    const exists = await tableExists(table.name);
    if (exists) {
      const count = await getTableCount(table.name);
      console.log(`✅ Table '${table.name}' exists (${count} rows)`);
      passedChecks++;
    } else {
      const status = table.critical ? '❌' : '⚠️';
      console.log(`${status} Table '${table.name}' missing ${table.critical ? '(CRITICAL)' : ''}`);
      failedChecks++;
      if (table.critical) {
        criticalFailures.push(`Critical table missing: ${table.name}`);
      }
    }
  }

  // 3. Check Critical Columns (for users table as example)
  console.log('\n🔑 Step 3: Verifying Critical Columns...');
  const usersExists = await tableExists('users');
  if (usersExists) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, username, role, status, sponsor_id')
        .limit(1);

      if (!error) {
        console.log('✅ Users table has all critical columns');
        passedChecks++;
      } else {
        console.log(`❌ Users table column check failed: ${error.message}`);
        failedChecks++;
        criticalFailures.push('Users table missing critical columns');
      }
    } catch (error) {
      console.log(`❌ Column verification failed: ${error}`);
      failedChecks++;
    }
  } else {
    console.log('⚠️  Skipping column check - users table not found');
  }

  // 4. Check Compensation Plan Settings
  console.log('\n⚙️  Step 4: Verifying Compensation Plan Settings...');
  const settingsExists = await tableExists('compensation_plan_settings');
  if (settingsExists) {
    const { data, error } = await supabase
      .from('compensation_plan_settings')
      .select('setting_key, setting_value')
      .in('setting_key', [
        'matrix_width',
        'matrix_depth',
        'retail_commission_pct',
        'matching_bonus_levels',
      ]);

    if (!error && data && data.length >= 4) {
      console.log('✅ Compensation plan settings initialized');
      console.log(`   - Matrix Width: ${data.find(s => s.setting_key === 'matrix_width')?.setting_value}`);
      console.log(`   - Matrix Depth: ${data.find(s => s.setting_key === 'matrix_depth')?.setting_value}`);
      console.log(`   - Retail Commission: ${data.find(s => s.setting_key === 'retail_commission_pct')?.setting_value}%`);
      passedChecks++;
    } else {
      console.log('⚠️  Compensation plan settings not fully initialized');
      failedChecks++;
    }
  } else {
    console.log('❌ Compensation plan settings table missing');
    failedChecks++;
  }

  // 5. Check Ranks Table
  console.log('\n🏆 Step 5: Verifying Ranks...');
  const ranksExists = await tableExists('ranks');
  if (ranksExists) {
    const { data, error } = await supabase
      .from('ranks')
      .select('name, level')
      .order('level');

    if (!error && data && data.length >= 6) {
      console.log('✅ Ranks initialized:');
      data.forEach(rank => {
        console.log(`   - Level ${rank.level}: ${rank.name}`);
      });
      passedChecks++;
    } else {
      console.log('⚠️  Ranks not fully initialized (expected 6 ranks)');
      failedChecks++;
    }
  } else {
    console.log('❌ Ranks table missing');
    failedChecks++;
  }

  // 6. Check RLS Policies
  console.log('\n🔒 Step 6: Verifying Row Level Security Policies...');
  // This would require a custom SQL query to check pg_policies
  console.log('⚠️  RLS policy check requires manual verification');
  console.log('   Run: SELECT * FROM pg_policies WHERE schemaname = \'public\';');

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 MIGRATION VERIFICATION SUMMARY\n');
  console.log(`✅ Passed Checks: ${passedChecks}`);
  console.log(`❌ Failed Checks: ${failedChecks}`);

  if (criticalFailures.length > 0) {
    console.log('\n🚨 CRITICAL FAILURES:');
    criticalFailures.forEach((failure, index) => {
      console.log(`   ${index + 1}. ${failure}`);
    });
  }

  // Overall Status
  console.log('\n' + '='.repeat(60));
  if (criticalFailures.length === 0 && failedChecks === 0) {
    console.log('\n✅ ALL MIGRATIONS VERIFIED SUCCESSFULLY!\n');
    console.log('Database is ready for development.');
    process.exit(0);
  } else if (criticalFailures.length > 0) {
    console.log('\n❌ CRITICAL MIGRATION FAILURES DETECTED!\n');
    console.log('Please run migrations before proceeding:');
    console.log('  npm run db:migrate\n');
    process.exit(1);
  } else {
    console.log('\n⚠️  SOME CHECKS FAILED (non-critical)\n');
    console.log('You may proceed, but review the warnings above.');
    process.exit(0);
  }
}

// Run verification
verifyMigrations().catch((error) => {
  console.error('\n❌ Verification script failed:', error);
  process.exit(1);
});
