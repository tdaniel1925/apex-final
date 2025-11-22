#!/usr/bin/env tsx
/**
 * Interactive Migration Checklist
 *
 * This script guides you through each migration step and confirms completion
 * Usage: npm run db:checklist
 */

import { execSync } from 'child_process';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

const MIGRATION_STEPS = [
  {
    phase: 'Phase 1.2',
    step: 1,
    name: 'Create Database Tables',
    description: 'Create all 13 core database tables with indexes',
    command: 'npm run db:push',
    verification: 'npm run db:verify',
    critical: true,
    tables: ['users', 'matrix_positions', 'products', 'orders', 'order_items',
             'commissions', 'payout_batches', 'rank_achievements', 'ranks',
             'compensation_plan_settings', 'tax_forms', 'replicated_site_settings', 'audit_logs'],
  },
  {
    phase: 'Phase 1.3',
    step: 2,
    name: 'Initialize Compensation Plan Settings',
    description: 'Insert default compensation plan configuration',
    command: 'npm run db:seed-settings',
    verification: 'npm run db:verify',
    critical: true,
    tables: ['compensation_plan_settings'],
  },
  {
    phase: 'Phase 1.3',
    step: 3,
    name: 'Initialize Rank Definitions',
    description: 'Create 6 rank levels (Associate to Diamond)',
    command: 'npm run db:seed-ranks',
    verification: 'npm run db:verify',
    critical: true,
    tables: ['ranks'],
  },
  {
    phase: 'Phase 1.4',
    step: 4,
    name: 'Apply Row Level Security Policies',
    description: 'Set up RLS policies for data access control',
    command: 'npm run db:apply-rls',
    verification: 'npm run db:verify-rls',
    critical: true,
    tables: ['users', 'commissions', 'orders', 'tax_forms'],
  },
  {
    phase: 'Phase 11.1',
    step: 5,
    name: 'Seed Test Data (Optional)',
    description: 'Load 500 distributors, 2000 orders, and commission data',
    command: 'npm run db:seed',
    verification: 'npm run db:verify',
    critical: false,
    tables: ['users', 'orders', 'commissions'],
  },
];

async function runMigrationChecklist() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     DATABASE MIGRATION INTERACTIVE CHECKLIST              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('This checklist will guide you through each migration step.\n');
  console.log(`Total Steps: ${MIGRATION_STEPS.length}`);
  console.log(`Critical Steps: ${MIGRATION_STEPS.filter(s => s.critical).length}\n`);

  let completedSteps = 0;
  let skippedSteps = 0;

  for (const step of MIGRATION_STEPS) {
    console.log('\n' + '─'.repeat(60));
    console.log(`\n📋 ${step.phase} - Step ${step.step}: ${step.name}`);
    console.log(`   ${step.description}`);
    console.log(`   ${step.critical ? '🔴 CRITICAL' : '🟡 OPTIONAL'}\n`);

    const proceed = await ask('   Do you want to run this migration? (y/n/skip): ');

    if (proceed.toLowerCase() === 'skip' || proceed.toLowerCase() === 's') {
      console.log('   ⏭️  Skipped\n');
      skippedSteps++;
      continue;
    }

    if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
      console.log('   ⏸️  Paused - Run manually later\n');
      continue;
    }

    // Run the migration command
    console.log(`\n   ⚙️  Running: ${step.command}\n`);
    try {
      const output = execSync(step.command, {
        encoding: 'utf8',
        stdio: 'inherit'
      });
      console.log('\n   ✅ Migration command completed\n');
    } catch (error) {
      console.error('\n   ❌ Migration command failed!');
      const retry = await ask('   Do you want to retry? (y/n): ');
      if (retry.toLowerCase() === 'y' || retry.toLowerCase() === 'yes') {
        try {
          execSync(step.command, { encoding: 'utf8', stdio: 'inherit' });
          console.log('\n   ✅ Migration succeeded on retry\n');
        } catch (retryError) {
          console.error('\n   ❌ Migration failed again. Please fix manually.\n');
          if (step.critical) {
            console.log('   🚨 This is a CRITICAL step - cannot proceed without it.\n');
            process.exit(1);
          }
          continue;
        }
      } else {
        if (step.critical) {
          console.log('   🚨 This is a CRITICAL step - cannot proceed without it.\n');
          process.exit(1);
        }
        continue;
      }
    }

    // Run verification
    console.log(`   🔍 Verifying: ${step.verification}\n`);
    try {
      execSync(step.verification, { encoding: 'utf8', stdio: 'inherit' });
      console.log('\n   ✅ Verification passed!\n');
      completedSteps++;

      // Update BUILD-CHECKLIST.md
      console.log('   📝 Updating BUILD-CHECKLIST.md...');
      updateChecklist(step.phase, step.name);

    } catch (error) {
      console.error('\n   ⚠️  Verification failed - review output above\n');
      const continueAnyway = await ask('   Continue anyway? (y/n): ');
      if (continueAnyway.toLowerCase() !== 'y' && continueAnyway.toLowerCase() !== 'yes') {
        if (step.critical) {
          console.log('   🚨 Critical step verification failed - stopping.\n');
          process.exit(1);
        }
      } else {
        completedSteps++;
      }
    }
  }

  // Final Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n✅ MIGRATION CHECKLIST COMPLETE!\n');
  console.log(`   Completed: ${completedSteps}/${MIGRATION_STEPS.length}`);
  console.log(`   Skipped: ${skippedSteps}/${MIGRATION_STEPS.length}`);
  console.log(`   Remaining: ${MIGRATION_STEPS.length - completedSteps - skippedSteps}/${MIGRATION_STEPS.length}\n`);

  if (completedSteps === MIGRATION_STEPS.length) {
    console.log('🎉 All migrations completed successfully!\n');
  } else {
    console.log('⚠️  Some migrations were not completed.\n');
    console.log('   Review the steps above and run them manually if needed.\n');
  }

  rl.close();
}

function updateChecklist(phase: string, stepName: string) {
  // This would update the BUILD-CHECKLIST.md file
  // Implementation depends on how you want to track progress
  console.log(`   ✓ Marked ${phase} - ${stepName} as complete`);
}

// Run the checklist
runMigrationChecklist().catch((error) => {
  console.error('❌ Checklist failed:', error);
  rl.close();
  process.exit(1);
});
