-- Pink Post Installations Database Schema
-- Run this in your Supabase SQL Editor

-- Users (extends Supabase auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  license_number TEXT,
  billing_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Types (White, Black, Pink)
CREATE TABLE post_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  installation_fee DECIMAL(10,2),
  reinstall_fee DECIMAL(10,2),
  replacement_fee DECIMAL(10,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rider Types
CREATE TABLE rider_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  terms TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lockbox Types
CREATE TABLE lockbox_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rental_fee DECIMAL(10,2),
  deposit DECIMAL(10,2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Post Installations
CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  post_type_id UUID REFERENCES post_types(id),

  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'KY',
  zip TEXT,

  agent_ref TEXT,
  mls_number TEXT,

  sign_description TEXT,
  sign_size TEXT,
  qr_code TEXT,

  status TEXT DEFAULT 'scheduled',
  installation_date DATE,
  scheduled_removal_date DATE,
  actual_removal_date DATE,

  belongs_to TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Installation Riders (junction table)
CREATE TABLE installation_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  rider_type_id UUID REFERENCES rider_types(id),
  belongs_to TEXT,
  added_date DATE DEFAULT CURRENT_DATE,
  removed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Installation Lockboxes
CREATE TABLE installation_lockboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  lockbox_type_id UUID REFERENCES lockbox_types(id),
  lockbox_code TEXT,
  added_date DATE DEFAULT CURRENT_DATE,
  removed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (for scheduling)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),

  order_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',

  scheduled_date DATE,
  scheduled_time TEXT,
  calendly_event_id TEXT,

  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'KY',
  zip TEXT,

  notes TEXT,
  special_instructions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Line Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  item_type TEXT NOT NULL,
  item_id UUID,
  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),

  invoice_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending',

  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  fuel_surcharge DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2),

  due_date DATE,
  paid_date DATE,
  payment_method TEXT,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Line Items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

  parent_item_id UUID REFERENCES invoice_items(id),

  date DATE,
  description TEXT NOT NULL,
  item_type TEXT,
  belongs_to TEXT,

  amount DECIMAL(10,2),
  balance DECIMAL(10,2),

  display_order INT,
  is_child_item BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_lockboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own installations"
  ON installations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own installations"
  ON installations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installations"
  ON installations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Public read access for post_types, rider_types, lockbox_types
CREATE POLICY "Anyone can view post types"
  ON post_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view rider types"
  ON rider_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view lockbox types"
  ON lockbox_types FOR SELECT
  USING (is_active = true);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installations_updated_at
  BEFORE UPDATE ON installations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial post types
INSERT INTO post_types (name, slug, description, installation_fee, reinstall_fee, replacement_fee, display_order) VALUES
  ('White PVC Post', 'white', 'Our classic white PVC post offers timeless elegance that complements any property style. Durable, weather-resistant, and maintenance-free.', 55.00, 35.00, 75.00, 1),
  ('Black PVC Post', 'black', 'Modern sophistication with a sleek black finish. Perfect for upscale listings and agents who want a contemporary look.', 55.00, 35.00, 75.00, 2),
  ('Pink Signature Post', 'pink', 'Stand out from the crowd with our signature pink post. A bold statement that gets noticed and remembered by potential buyers.', 65.00, 40.00, 85.00, 3);

-- Seed initial rider types
INSERT INTO rider_types (name, slug, price, display_order) VALUES
  ('SOLD', 'sold', 5.00, 1),
  ('Open House', 'open-house', 5.00, 2),
  ('Coming Soon', 'coming-soon', 5.00, 3),
  ('Price Reduced', 'price-reduced', 5.00, 4),
  ('Under Contract', 'under-contract', 5.00, 5),
  ('Pending', 'pending', 5.00, 6),
  ('New Listing', 'new-listing', 5.00, 7),
  ('For Lease', 'for-lease', 5.00, 8);

-- Seed initial lockbox types
INSERT INTO lockbox_types (name, slug, description, rental_fee, deposit, display_order) VALUES
  ('Standard Lockbox', 'standard', 'Basic combination lockbox suitable for most properties.', 15.00, 50.00, 1),
  ('Supra eKey', 'supra-ekey', 'Electronic lockbox compatible with Supra eKey app. Enhanced security features.', 25.00, 100.00, 2),
  ('SentriLock', 'sentrilock', 'Bluetooth-enabled lockbox with SentriKey app integration. Real-time access tracking.', 25.00, 100.00, 3);
