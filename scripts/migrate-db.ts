import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as dotenv from 'dotenv'
import { sql } from 'drizzle-orm'

// Load environment variables
dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL!

async function migrate() {
  console.log('🚀 Starting database migration...\n')

  const client = postgres(connectionString, { max: 1 })
  const db = drizzle(client)

  try {
    // Create autoship_executions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "autoship_executions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "subscription_id" uuid NOT NULL,
        "executed_at" timestamp DEFAULT now() NOT NULL,
        "status" varchar(20) NOT NULL,
        "order_id" uuid,
        "error_message" text,
        "error_code" varchar(50),
        "amount" varchar(20),
        "payment_intent_id" varchar(255),
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `)
    console.log('✅ Created autoship_executions table')

    // Create autoship_subscriptions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "autoship_subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "frequency" varchar(20) DEFAULT 'monthly' NOT NULL,
        "day_of_month" varchar(2),
        "day_of_week" varchar(10),
        "products" json NOT NULL,
        "subtotal" varchar(20) NOT NULL,
        "tax" varchar(20) DEFAULT '0.00' NOT NULL,
        "shipping" varchar(20) DEFAULT '0.00' NOT NULL,
        "total" varchar(20) NOT NULL,
        "payment_method_id" varchar(255),
        "shipping_address" json NOT NULL,
        "next_run_date" timestamp NOT NULL,
        "last_run_date" timestamp,
        "failed_attempts" varchar(10) DEFAULT '0' NOT NULL,
        "last_failure_reason" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "cancelled_at" timestamp
      );
    `)
    console.log('✅ Created autoship_subscriptions table')

    // Create replicated_sites table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "replicated_sites" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "site_url" varchar(255) NOT NULL,
        "custom_domain" varchar(255),
        "custom_domain_verified" boolean DEFAULT false NOT NULL,
        "logo_url" text,
        "banner_image_url" text,
        "profile_photo_url" text,
        "headline" varchar(200),
        "bio" text,
        "welcome_message" text,
        "primary_color" varchar(7) DEFAULT '#3b82f6',
        "secondary_color" varchar(7) DEFAULT '#10b981',
        "theme" varchar(20) DEFAULT 'light' NOT NULL,
        "social_links" json,
        "show_contact_form" boolean DEFAULT true NOT NULL,
        "show_products" boolean DEFAULT true NOT NULL,
        "show_testimonials" boolean DEFAULT true NOT NULL,
        "show_team_stats" boolean DEFAULT false NOT NULL,
        "meta_title" varchar(60),
        "meta_description" varchar(160),
        "meta_keywords" varchar(255),
        "is_active" boolean DEFAULT true NOT NULL,
        "is_published" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "published_at" timestamp,
        CONSTRAINT "replicated_sites_site_url_unique" UNIQUE("site_url"),
        CONSTRAINT "replicated_sites_custom_domain_unique" UNIQUE("custom_domain")
      );
    `)
    console.log('✅ Created replicated_sites table')

    // Create site_photos table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "site_photos" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "site_id" uuid NOT NULL,
        "photo_url" text NOT NULL,
        "photo_type" varchar(50) NOT NULL,
        "caption" text,
        "alt_text" varchar(255),
        "file_name" varchar(255) NOT NULL,
        "file_size" varchar(50),
        "mime_type" varchar(100),
        "status" varchar(20) DEFAULT 'pending' NOT NULL,
        "approved_by" uuid,
        "approved_at" timestamp,
        "rejection_reason" text,
        "display_order" varchar(10) DEFAULT '0',
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `)
    console.log('✅ Created site_photos table')

    // Create tax_forms table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "tax_forms" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "form_type" varchar(20) DEFAULT 'w9' NOT NULL,
        "tax_year" varchar(4) NOT NULL,
        "legal_name" varchar(255) NOT NULL,
        "business_name" varchar(255),
        "tax_classification" varchar(50) NOT NULL,
        "tax_id_type" varchar(20) NOT NULL,
        "tax_id_encrypted" text NOT NULL,
        "address" text NOT NULL,
        "city" varchar(100) NOT NULL,
        "state" varchar(50) NOT NULL,
        "zip_code" varchar(20) NOT NULL,
        "country" varchar(100) DEFAULT 'USA' NOT NULL,
        "exempt_payee_code" varchar(10),
        "exemption_from_fatca" varchar(10),
        "signature_name" varchar(255) NOT NULL,
        "signature_date" timestamp NOT NULL,
        "certified_correct" boolean DEFAULT true NOT NULL,
        "document_url" text,
        "status" varchar(20) DEFAULT 'pending' NOT NULL,
        "approved_by" uuid,
        "approved_at" timestamp,
        "rejection_reason" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "expires_at" timestamp
      );
    `)
    console.log('✅ Created tax_forms table')

    // Add rank_id column to users table if it doesn't exist
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='users' AND column_name='rank_id'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "rank_id" varchar(50) DEFAULT 'distributor';
        END IF;
      END $$;
    `)
    console.log('✅ Added rank_id column to users table')

    // Update default values
    await db.execute(sql`
      ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active';
    `)
    await db.execute(sql`
      ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'distributor';
    `)
    await db.execute(sql`
      ALTER TABLE "users" ALTER COLUMN "country" SET DEFAULT 'USA';
    `)
    await db.execute(sql`
      ALTER TABLE "commissions" ALTER COLUMN "status" SET DEFAULT 'pending';
    `)
    await db.execute(sql`
      ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending';
    `)
    await db.execute(sql`
      ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'pending';
    `)
    await db.execute(sql`
      ALTER TABLE "payment_batches" ALTER COLUMN "status" SET DEFAULT 'pending';
    `)
    await db.execute(sql`
      ALTER TABLE "matrix_positions" ALTER COLUMN "status" SET DEFAULT 'active';
    `)
    await db.execute(sql`
      ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'USD';
    `)
    await db.execute(sql`
      ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending';
    `)
    console.log('✅ Updated default values for existing tables')

    console.log('\n🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
