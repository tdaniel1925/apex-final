# 🗄️ Database Migration Guide

This guide explains how to run and verify database migrations for the Apex Affinity Group MLM Platform.

---

## 📋 Quick Start

### 1. Check Current Database Status
```bash
npm run db:status
```

This shows you which tables exist and how many rows they contain.

### 2. Run Interactive Migration Checklist (Recommended)
```bash
npm run db:checklist
```

This will guide you through each migration step interactively and confirm completion.

### 3. Run All Migrations at Once
```bash
npm run db:migrate
```

### 4. Verify Migrations
```bash
npm run db:verify
```

This verifies that all migrations completed successfully.

---

## 🎯 Available Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run db:status` | Quick status check of all tables | Anytime - see what's created |
| `npm run db:checklist` | Interactive migration wizard | First time setup |
| `npm run db:migrate` | Run all pending migrations | Initial setup |
| `npm run db:verify` | Comprehensive verification | After each migration |
| `npm run db:push` | Push schema changes to database | During development |
| `npm run db:generate` | Generate migration files | After schema changes |
| `npm run db:seed` | Load test data | Development/testing |
| `npm run db:seed-settings` | Initialize compensation settings | Phase 1.3 |
| `npm run db:seed-ranks` | Create rank definitions | Phase 1.3 |
| `npm run db:apply-rls` | Apply Row Level Security policies | Phase 1.4 |
| `npm run db:verify-rls` | Verify RLS policies | After applying RLS |
| `npm run db:studio` | Open Drizzle Studio (GUI) | Visual database management |

---

## 🔄 Migration Workflow

### Phase 1.2: Create Database Tables

```bash
# Step 1: Check current status
npm run db:status

# Step 2: Generate migration files (if schema changed)
npm run db:generate

# Step 3: Push schema to database
npm run db:push

# Step 4: Verify tables were created
npm run db:verify
```

**Expected Output:**
```
✅ Table 'users' exists (0 rows)
✅ Table 'matrix_positions' exists (0 rows)
✅ Table 'products' exists (0 rows)
... (13 total tables)
```

---

### Phase 1.3: Initialize Settings & Ranks

```bash
# Initialize compensation plan settings
npm run db:seed-settings

# Verify settings
npm run db:verify

# Initialize rank definitions
npm run db:seed-ranks

# Verify ranks
npm run db:verify
```

**Expected Output:**
```
✅ Compensation plan settings initialized
   - Matrix Width: 5
   - Matrix Depth: 9
   - Retail Commission: 25%

✅ Ranks initialized:
   - Level 1: Associate
   - Level 2: Builder
   - Level 3: Leader
   - Level 4: Director
   - Level 5: Executive
   - Level 6: Diamond
```

---

### Phase 1.4: Apply Row Level Security

```bash
# Apply RLS policies
npm run db:apply-rls

# Verify RLS policies
npm run db:verify-rls
```

**Expected Output:**
```
✅ RLS policy applied: Users can view own record
✅ RLS policy applied: Distributors can view downline
✅ RLS policy applied: Only admins can update products
✅ RLS policy applied: Users view own commissions
```

---

### Phase 11.1: Seed Test Data (Optional)

```bash
# Load 500 distributors, 2000 orders, commissions
npm run db:seed

# Check status
npm run db:status
```

**Expected Output:**
```
✅ Table 'users' exists (500 rows)
✅ Table 'orders' exists (2000 rows)
✅ Table 'commissions' exists (8500 rows)
```

---

## ✅ Verification Details

The `npm run db:verify` command checks:

### 1. Database Connection
- ✅ Can connect to Supabase
- ✅ Credentials are valid

### 2. Required Tables (13 total)
- ✅ users
- ✅ matrix_positions
- ✅ products
- ✅ orders
- ✅ order_items
- ✅ commissions
- ✅ payout_batches
- ✅ rank_achievements
- ✅ ranks
- ✅ compensation_plan_settings
- ✅ tax_forms
- ✅ replicated_site_settings
- ✅ audit_logs

### 3. Critical Columns
- ✅ Users table has: id, email, username, role, status, sponsor_id
- ✅ Matrix positions has: user_id, parent_id, level, position_in_level
- ✅ Commissions has: user_id, order_id, commission_type, amount

### 4. Initial Data
- ✅ Compensation plan settings (4+ required settings)
- ✅ Rank definitions (6 ranks)

### 5. Indexes
- ✅ idx_users_sponsor
- ✅ idx_users_username
- ✅ idx_users_email
- ✅ idx_matrix_user
- ✅ idx_matrix_parent
- ✅ (and more...)

### 6. Row Level Security Policies
- ✅ Users can view own record
- ✅ Distributors can view downline
- ✅ Admins can manage products
- ✅ Users view own commissions

---

## 🚨 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is running
3. Check your internet connection

```bash
# Test connection
npm run db:status
```

---

### Issue: "Table missing (CRITICAL)"

**Solution:**
```bash
# Re-run migrations
npm run db:migrate

# Verify
npm run db:verify
```

---

### Issue: "Compensation plan settings not fully initialized"

**Solution:**
```bash
# Run settings seed script
npm run db:seed-settings

# Verify
npm run db:verify
```

---

### Issue: "Ranks not fully initialized"

**Solution:**
```bash
# Run ranks seed script
npm run db:seed-ranks

# Verify
npm run db:verify
```

---

### Issue: Migration stuck or hanging

**Solution:**
1. Cancel with `Ctrl+C`
2. Check Supabase dashboard for errors
3. Run `npm run db:status` to see what was created
4. Re-run specific migration step

---

## 📊 Migration Verification Output Examples

### ✅ Successful Migration
```
🔍 Starting Database Migration Verification...

============================================================

📡 Step 1: Verifying Database Connection...
✅ Database connection successful

📊 Step 2: Verifying Required Tables...
✅ Table 'users' exists (0 rows)
✅ Table 'matrix_positions' exists (0 rows)
✅ Table 'products' exists (0 rows)
✅ Table 'orders' exists (0 rows)
✅ Table 'order_items' exists (0 rows)
✅ Table 'commissions' exists (0 rows)
✅ Table 'payout_batches' exists (0 rows)
✅ Table 'rank_achievements' exists (0 rows)
✅ Table 'ranks' exists (6 rows)
✅ Table 'compensation_plan_settings' exists (6 rows)
✅ Table 'tax_forms' exists (0 rows)
✅ Table 'replicated_site_settings' exists (0 rows)
✅ Table 'audit_logs' exists (0 rows)

🔑 Step 3: Verifying Critical Columns...
✅ Users table has all critical columns

⚙️  Step 4: Verifying Compensation Plan Settings...
✅ Compensation plan settings initialized
   - Matrix Width: 5
   - Matrix Depth: 9
   - Retail Commission: 25%

🏆 Step 5: Verifying Ranks...
✅ Ranks initialized:
   - Level 1: Associate
   - Level 2: Builder
   - Level 3: Leader
   - Level 4: Director
   - Level 5: Executive
   - Level 6: Diamond

============================================================

📋 MIGRATION VERIFICATION SUMMARY

✅ Passed Checks: 17
❌ Failed Checks: 0

============================================================

✅ ALL MIGRATIONS VERIFIED SUCCESSFULLY!

Database is ready for development.
```

---

### ⚠️ Partial Migration (Tables Missing)
```
📊 Step 2: Verifying Required Tables...
✅ Table 'users' exists (0 rows)
❌ Table 'matrix_positions' missing (CRITICAL)
❌ Table 'products' missing (CRITICAL)

🚨 CRITICAL FAILURES:
   1. Critical table missing: matrix_positions
   2. Critical table missing: products

❌ CRITICAL MIGRATION FAILURES DETECTED!

Please run migrations before proceeding:
  npm run db:migrate
```

---

## 🔄 Rollback Migrations

If you need to undo a migration:

```bash
# Manual rollback (requires SQL)
# Connect to Supabase SQL Editor and run:
DROP TABLE IF EXISTS table_name CASCADE;

# Or use Drizzle Studio
npm run db:studio
```

**⚠️ Warning:** Rollback will delete all data in the dropped tables!

---

## 📈 Migration Progress Tracking

Migrations are tracked in [BUILD-CHECKLIST.md](./BUILD-CHECKLIST.md):

- [ ] **1.2** Database Schema - Set up Supabase project
- [ ] **1.3** Database Migrations - Set up migration system
- [ ] **1.4** Authentication - Configure RLS policies

After each successful migration, the checklist is automatically updated.

---

## 🎯 Best Practices

### 1. Always Verify After Migration
```bash
npm run db:migrate && npm run db:verify
```

### 2. Check Status Before Starting Work
```bash
npm run db:status
```

### 3. Use Interactive Checklist for First-Time Setup
```bash
npm run db:checklist
```

### 4. Backup Before Major Changes
```bash
# Export data from Supabase dashboard before major migrations
```

### 5. Test Migrations Locally First
```bash
# Run migrations in development environment
# Verify everything works
# Then run in production
```

---

## 📅 Migration Schedule

| Phase | Step | Migration | Command |
|-------|------|-----------|---------|
| 1.2 | 1 | Create all 13 tables | `npm run db:push` |
| 1.3 | 2 | Initialize comp plan settings | `npm run db:seed-settings` |
| 1.3 | 3 | Initialize ranks | `npm run db:seed-ranks` |
| 1.4 | 4 | Apply RLS policies | `npm run db:apply-rls` |
| 11.1 | 5 | Seed test data (optional) | `npm run db:seed` |

---

## 🔍 Monitoring Migration Health

### Daily Health Check
```bash
npm run db:status
```

### Weekly Verification
```bash
npm run db:verify
```

### Before Deployment
```bash
npm run db:verify && npm run test:integration
```

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Run `npm run db:status` to diagnose
3. Review Supabase dashboard logs
4. Check `.env.local` credentials
5. Try `npm run db:verify` for detailed error messages

---

**Document Version:** 1.0
**Last Updated:** [Auto-generated]
**Related Docs:** [BUILD-CHECKLIST.md](./BUILD-CHECKLIST.md)
