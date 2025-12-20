-- Pink Post Installations Production Database Schema
-- Version 2.0.0
-- Run this in your Supabase SQL Editor

-- ============================================
-- USERS & PROFILES
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  license_number TEXT,

  -- Stripe
  stripe_customer_id TEXT,
  default_payment_method_id TEXT,

  -- Role
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCT CATALOG (Admin-managed)
-- ============================================

CREATE TABLE post_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rider_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  rental_price DECIMAL(10,2) DEFAULT 5.00,
  install_price DECIMAL(10,2) DEFAULT 2.00,
  requires_input BOOLEAN DEFAULT false,
  input_label TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lockbox_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  install_price DECIMAL(10,2) DEFAULT 5.00,
  rental_price DECIMAL(10,2),
  is_rentable BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMER INVENTORY (Stored items)
-- ============================================

CREATE TABLE customer_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  size TEXT,
  quantity INT DEFAULT 1,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  rider_type TEXT NOT NULL,
  quantity INT DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_lockboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  lockbox_type TEXT NOT NULL,
  lockbox_code TEXT,
  quantity INT DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_brochure_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  quantity INT DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  order_number TEXT UNIQUE NOT NULL,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'scheduled', 'in_progress',
    'completed', 'cancelled'
  )),

  -- Property Info
  property_type TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_state TEXT DEFAULT 'KY',
  property_zip TEXT NOT NULL,

  -- Installation Details
  installation_location TEXT,
  installation_notes TEXT,

  -- Scheduling
  requested_date DATE,
  scheduled_date DATE,
  completed_date DATE,
  is_expedited BOOLEAN DEFAULT false,

  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  fuel_surcharge DECIMAL(10,2) DEFAULT 2.47,
  expedite_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Payment
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'processing', 'succeeded', 'failed', 'refunded'
  )),
  paid_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,

  item_type TEXT NOT NULL,
  item_category TEXT,

  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Reference to inventory item if using customer's own
  customer_sign_id UUID REFERENCES customer_signs(id),
  customer_rider_id UUID REFERENCES customer_riders(id),
  customer_lockbox_id UUID REFERENCES customer_lockboxes(id),
  customer_brochure_box_id UUID REFERENCES customer_brochure_boxes(id),

  -- For riders with input (e.g., "5 Acres")
  custom_value TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVE INSTALLATIONS
-- ============================================

CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),

  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'KY',
  zip TEXT NOT NULL,

  -- What's installed
  post_type TEXT NOT NULL,
  sign_description TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active', 'removal_scheduled', 'removed'
  )),

  -- Dates
  installation_date DATE NOT NULL,
  removal_scheduled_date DATE,
  removal_completed_date DATE,

  -- Reference
  mls_number TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  rider_type TEXT NOT NULL,
  custom_value TEXT,
  is_rental BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_lockboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
  lockbox_type TEXT NOT NULL,
  lockbox_code TEXT,
  is_rental BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STORED PAYMENT METHODS
-- ============================================

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,

  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INT,
  card_exp_year INT,

  is_default BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_lockboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_brochure_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_lockboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer Inventory (Signs, Riders, Lockboxes, Brochure Boxes)
CREATE POLICY "Users can view own signs" ON customer_signs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own signs" ON customer_signs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all signs" ON customer_signs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own riders" ON customer_riders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own riders" ON customer_riders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all riders" ON customer_riders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own lockboxes" ON customer_lockboxes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lockboxes" ON customer_lockboxes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all lockboxes" ON customer_lockboxes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view own brochure boxes" ON customer_brochure_boxes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own brochure boxes" ON customer_brochure_boxes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all brochure boxes" ON customer_brochure_boxes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order Items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all order items" ON order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Installations
CREATE POLICY "Users can view own installations" ON installations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create installations" ON installations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own installations" ON installations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all installations" ON installations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Installation Riders
CREATE POLICY "Users can view own installation riders" ON installation_riders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM installations WHERE installations.id = installation_riders.installation_id AND installations.user_id = auth.uid())
  );

CREATE POLICY "Users can manage own installation riders" ON installation_riders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM installations WHERE installations.id = installation_riders.installation_id AND installations.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all installation riders" ON installation_riders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Installation Lockboxes
CREATE POLICY "Users can view own installation lockboxes" ON installation_lockboxes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM installations WHERE installations.id = installation_lockboxes.installation_id AND installations.user_id = auth.uid())
  );

CREATE POLICY "Users can manage own installation lockboxes" ON installation_lockboxes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM installations WHERE installations.id = installation_lockboxes.installation_id AND installations.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all installation lockboxes" ON installation_lockboxes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payment Methods
CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for catalog tables
CREATE POLICY "Anyone can view post types" ON post_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view rider catalog" ON rider_catalog
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view lockbox types" ON lockbox_types
  FOR SELECT USING (is_active = true);

-- Admin can manage catalog
CREATE POLICY "Admins can manage post types" ON post_types
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage rider catalog" ON rider_catalog
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage lockbox types" ON lockbox_types
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installations_updated_at
  BEFORE UPDATE ON installations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_signs_updated_at
  BEFORE UPDATE ON customer_signs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_riders_updated_at
  BEFORE UPDATE ON customer_riders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_lockboxes_updated_at
  BEFORE UPDATE ON customer_lockboxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  sequence_num INT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 10) AS INT)
  ), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE order_number LIKE 'PPI-' || year_part || '-%';

  NEW.order_number := 'PPI-' || year_part || '-' || LPAD(sequence_num::TEXT, 5, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- SEED DATA
-- ============================================

-- Post Types
INSERT INTO post_types (name, slug, description, price, image_url, display_order) VALUES
  ('White Vinyl Post', 'white-vinyl', 'Classic white vinyl post. Professional, clean look that complements any property.', 55.00, '/images/posts/white-post.png', 1),
  ('Black Vinyl Post', 'black-vinyl', 'Modern black vinyl post. Sleek, contemporary style for upscale listings.', 55.00, '/images/posts/black-post.png', 2),
  ('Signature Pink Vinyl Post', 'pink-vinyl', 'Our signature pink post. Stand out from the crowd and get noticed!', 65.00, '/images/posts/pink-post.png', 3);

-- Rider Catalog
INSERT INTO rider_catalog (name, slug, display_order) VALUES
  ('3 Beds', '3-beds', 1),
  ('4 Beds', '4-beds', 2),
  ('5 Beds', '5-beds', 3),
  ('6 Beds', '6-beds', 4),
  ('Back on the Market', 'back-on-market', 5),
  ('Basement', 'basement', 6),
  ('Coming Soon', 'coming-soon', 7),
  ('By Appointment Only', 'by-appointment', 8),
  ('For Lease', 'for-lease', 9),
  ('For Rent', 'for-rent', 10),
  ('For Sale', 'for-sale', 11),
  ('For Sale or Lease', 'for-sale-lease', 12),
  ('Home Warranty', 'home-warranty', 13),
  ('Horse Property', 'horse-property', 14),
  ('I''m Gorgeous Inside', 'gorgeous-inside', 15),
  ('Lake Front', 'lake-front', 16),
  ('Large Lot', 'large-lot', 17),
  ('No HOA', 'no-hoa', 18),
  ('Owner/Agent', 'owner-agent', 19),
  ('Pool', 'pool', 20),
  ('Spa', 'spa', 21),
  ('RV Parking', 'rv-parking', 22),
  ('Sold', 'sold', 23),
  ('Pending', 'pending', 24),
  ('Se Habla Español', 'se-habla-espanol', 25),
  ('Acreage', 'acreage', 26);

-- Special rider with input
UPDATE rider_catalog SET requires_input = true, input_label = 'Number of Acres'
WHERE slug = 'acreage';

INSERT INTO rider_catalog (name, slug, requires_input, input_label, display_order) VALUES
  ('___ Acres', 'custom-acres', true, 'Number of Acres', 27);

-- Lockbox Types
INSERT INTO lockbox_types (name, slug, description, install_price, rental_price, is_rentable, display_order) VALUES
  ('SentriLock', 'sentrilock', 'Agent-owned SentriLock lockbox. We install your own lockbox.', 5.00, NULL, false, 1),
  ('Mechanical Lockbox', 'mechanical', 'Standard mechanical combination lockbox.', 5.00, 15.00, true, 2);
