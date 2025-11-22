#!/usr/bin/env tsx
/**
 * Quick Database Status Check
 *
 * Shows a quick overview of database migration status
 * Usage: npm run db:status
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkTableStatus() {
  const tables = [
    'users',
    'matrix_positions',
    'products',
    'orders',
    'order_items',
    'commissions',
    'payout_batches',
    'rank_achievements',
    'ranks',
    'compensation_plan_settings',
    'tax_forms',
    'replicated_site_settings',
  ];

  console.log('\n📊 DATABASE STATUS\n');
  console.log('┌─────────────────────────────────┬────────┬─────────┐');
  console.log('│ Table                           │ Status │ Rows    │');
  console.log('├─────────────────────────────────┼────────┼─────────┤');

  let existingTables = 0;
  let totalRows = 0;

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`│ ${table.padEnd(31)} │ ❌     │ -       │`);
      } else {
        const rowCount = count || 0;
        existingTables++;
        totalRows += rowCount;
        console.log(`│ ${table.padEnd(31)} │ ✅     │ ${String(rowCount).padStart(7)} │`);
      }
    } catch (error) {
      console.log(`│ ${table.padEnd(31)} │ ❌     │ -       │`);
    }
  }

  console.log('└─────────────────────────────────┴────────┴─────────┘');
  console.log(`\nTables: ${existingTables}/${tables.length} exist`);
  console.log(`Total Rows: ${totalRows}\n`);

  if (existingTables === 0) {
    console.log('⚠️  No tables found - run migrations:');
    console.log('   npm run db:migrate\n');
  } else if (existingTables < tables.length) {
    console.log('⚠️  Some tables missing - run migrations:');
    console.log('   npm run db:migrate\n');
  } else {
    console.log('✅ All tables created!\n');
  }
}

checkTableStatus().catch((error) => {
  console.error('❌ Status check failed:', error);
  process.exit(1);
});
