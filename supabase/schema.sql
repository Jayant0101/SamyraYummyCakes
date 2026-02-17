-- Samyra's Yummy Cakes - Orders Table & Storage
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_date TEXT NOT NULL,
  cake_flavor TEXT NOT NULL,
  cake_weight TEXT DEFAULT '1 kg',
  occasion TEXT NOT NULL,
  details TEXT DEFAULT '',
  reference_image_url TEXT,
  ai_concept JSONB,
  ai_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'baking', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  owner_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to INSERT orders (customers placing orders)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to SELECT orders (for tracking by ID/phone)
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Policy: Allow anyone to UPDATE orders (for admin status changes)
-- In production, restrict this to authenticated admin users
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true);

-- Policy: Allow anyone to DELETE orders (for admin)
CREATE POLICY "Anyone can delete orders"
  ON orders FOR DELETE
  USING (true);

-- Create index for faster phone lookups
CREATE INDEX idx_orders_phone ON orders (customer_phone);

-- Create index for status filtering
CREATE INDEX idx_orders_status ON orders (status);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════
-- PRODUCTS TABLE
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_range TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can create products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_active ON products (is_active);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
