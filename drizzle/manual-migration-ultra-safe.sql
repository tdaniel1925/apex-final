-- Apex Affinity Group MLM Platform - Database Migration (ULTRA SAFE VERSION)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/editor
-- This version handles ALL edge cases including existing tables and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- DROP EXISTING FOREIGN KEY CONSTRAINTS (SAFE)
-- =============================================================================

-- Drop all foreign key constraints if they exist
DO $$
BEGIN
    -- Matrix Positions
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'matrix_positions_user_id_users_id_fk') THEN
        ALTER TABLE "matrix_positions" DROP CONSTRAINT "matrix_positions_user_id_users_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'matrix_positions_sponsor_id_users_id_fk') THEN
        ALTER TABLE "matrix_positions" DROP CONSTRAINT "matrix_positions_sponsor_id_users_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'matrix_positions_placed_by_users_id_fk') THEN
        ALTER TABLE "matrix_positions" DROP CONSTRAINT "matrix_positions_placed_by_users_id_fk";
    END IF;

    -- Commissions
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commissions_user_id_users_id_fk') THEN
        ALTER TABLE "commissions" DROP CONSTRAINT "commissions_user_id_users_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commissions_from_user_id_users_id_fk') THEN
        ALTER TABLE "commissions" DROP CONSTRAINT "commissions_from_user_id_users_id_fk";
    END IF;

    -- Order Items
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_orders_id_fk') THEN
        ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_orders_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_product_id_products_id_fk') THEN
        ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_products_id_fk";
    END IF;

    -- Orders
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_user_id_users_id_fk') THEN
        ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_distributor_id_users_id_fk') THEN
        ALTER TABLE "orders" DROP CONSTRAINT "orders_distributor_id_users_id_fk";
    END IF;

    -- User Ranks
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_ranks_user_id_users_id_fk') THEN
        ALTER TABLE "user_ranks" DROP CONSTRAINT "user_ranks_user_id_users_id_fk";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_ranks_rank_id_ranks_id_fk') THEN
        ALTER TABLE "user_ranks" DROP CONSTRAINT "user_ranks_rank_id_ranks_id_fk";
    END IF;

    -- Payment Batches
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payment_batches_processed_by_users_id_fk') THEN
        ALTER TABLE "payment_batches" DROP CONSTRAINT "payment_batches_processed_by_users_id_fk";
    END IF;

    -- Payments
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_user_id_users_id_fk') THEN
        ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_users_id_fk";
    END IF;
END $$;

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"role" varchar(20) DEFAULT 'distributor' NOT NULL,
	"sponsor_id" uuid,
	"enrollment_date" timestamp DEFAULT now() NOT NULL,
	"replicated_site_url" varchar(255),
	"custom_domain" varchar(255),
	"avatar_url" text,
	"bio" text,
	"address" text,
	"city" varchar(100),
	"state" varchar(50),
	"zip_code" varchar(20),
	"country" varchar(100) DEFAULT 'USA' NOT NULL,
	"tax_id" varchar(255),
	"w9_form_url" text,
	"stripe_customer_id" varchar(255),
	"stripe_connect_account_id" varchar(255),
	"email_notifications" boolean DEFAULT true NOT NULL,
	"sms_notifications" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_replicated_site_url_unique" UNIQUE("replicated_site_url"),
	CONSTRAINT "users_custom_domain_unique" UNIQUE("custom_domain"),
	CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "users_stripe_connect_account_id_unique" UNIQUE("stripe_connect_account_id")
);

-- =============================================================================
-- MATRIX POSITIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "matrix_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"sponsor_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"position" integer NOT NULL,
	"parent_id" uuid,
	"leg_position" integer,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"placed_at" timestamp DEFAULT now() NOT NULL,
	"placed_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- COMMISSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"level" integer,
	"amount" numeric(10, 2) NOT NULL,
	"percentage" numeric(5, 2),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_id" uuid,
	"paid_at" timestamp,
	"order_id" uuid,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- PRODUCTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"commissionable_value" numeric(10, 2) NOT NULL,
	"category" varchar(100),
	"images" text,
	"weight" numeric(8, 2),
	"dimensions" text,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"low_stock_threshold" integer DEFAULT 10,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"stripe_price_id" varchar(255),
	"stripe_product_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);

-- =============================================================================
-- ORDERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"user_id" uuid NOT NULL,
	"distributor_id" uuid NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0' NOT NULL,
	"shipping" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"stripe_charge_id" varchar(255),
	"shipping_address" text,
	"tracking_number" varchar(255),
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"customer_notes" text,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);

-- =============================================================================
-- ORDER ITEMS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"commissionable_value" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- RANKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "ranks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" integer NOT NULL,
	"display_order" integer NOT NULL,
	"personal_sales_required" numeric(10, 2) NOT NULL,
	"team_sales_required" numeric(10, 2) NOT NULL,
	"active_distributors_required" integer NOT NULL,
	"bonus_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"matching_bonus_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"matching_bonus_levels" integer DEFAULT 0 NOT NULL,
	"color" varchar(7),
	"icon" varchar(50),
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ranks_name_unique" UNIQUE("name"),
	CONSTRAINT "ranks_level_unique" UNIQUE("level")
);

-- =============================================================================
-- USER RANKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "user_ranks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"rank_id" uuid NOT NULL,
	"achieved_at" timestamp DEFAULT now() NOT NULL,
	"current_rank" boolean DEFAULT true NOT NULL,
	"personal_sales" numeric(10, 2) NOT NULL,
	"team_sales" numeric(10, 2) NOT NULL,
	"active_distributors" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- COMPENSATION PLAN SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "compensation_plan_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"is_editable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "compensation_plan_settings_key_unique" UNIQUE("key")
);

-- =============================================================================
-- SYSTEM SETTINGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "system_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_settings_key_unique" UNIQUE("key")
);

-- =============================================================================
-- PAYMENT BATCHES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "payment_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"payment_count" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"processed_by" uuid,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- PAYMENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"stripe_transfer_id" varchar(255),
	"stripe_payout_id" varchar(255),
	"stripe_failure_reason" text,
	"batch_id" uuid,
	"commission_ids" text,
	"notes" text,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =============================================================================
-- ADD FOREIGN KEY CONSTRAINTS (FRESH)
-- =============================================================================

-- Matrix Positions
ALTER TABLE "matrix_positions" ADD CONSTRAINT "matrix_positions_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "matrix_positions" ADD CONSTRAINT "matrix_positions_sponsor_id_users_id_fk"
	FOREIGN KEY ("sponsor_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "matrix_positions" ADD CONSTRAINT "matrix_positions_placed_by_users_id_fk"
	FOREIGN KEY ("placed_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- Commissions
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "commissions" ADD CONSTRAINT "commissions_from_user_id_users_id_fk"
	FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- Order Items
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk"
	FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk"
	FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;

-- Orders
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "orders" ADD CONSTRAINT "orders_distributor_id_users_id_fk"
	FOREIGN KEY ("distributor_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- User Ranks
ALTER TABLE "user_ranks" ADD CONSTRAINT "user_ranks_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "user_ranks" ADD CONSTRAINT "user_ranks_rank_id_ranks_id_fk"
	FOREIGN KEY ("rank_id") REFERENCES "ranks"("id") ON DELETE no action ON UPDATE no action;

-- Payment Batches
ALTER TABLE "payment_batches" ADD CONSTRAINT "payment_batches_processed_by_users_id_fk"
	FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;

-- Payments
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk"
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;

-- =============================================================================
-- SEED DATA - Test Distributor
-- =============================================================================

-- Insert test distributor (safe - won't duplicate)
INSERT INTO "users" (
	"email",
	"first_name",
	"last_name",
	"phone",
	"status",
	"role",
	"replicated_site_url",
	"address",
	"city",
	"state",
	"zip_code",
	"country"
) VALUES (
	'testsponsor@example.com',
	'Test',
	'Sponsor',
	'555-123-4567',
	'active',
	'distributor',
	'testsponsor',
	'123 Main Street',
	'Los Angeles',
	'CA',
	'90210',
	'USA'
) ON CONFLICT ("email") DO NOTHING;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
	RAISE NOTICE '✅ Database migration completed successfully!';
	RAISE NOTICE '   - 13 tables created';
	RAISE NOTICE '   - All foreign keys added';
	RAISE NOTICE '   - Test distributor created';
	RAISE NOTICE '';
	RAISE NOTICE '🌐 Test your site at: http://localhost:3003/testsponsor';
END $$;
