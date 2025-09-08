/*
  # Create KisanConnect Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, farmer or consumer)
      - `location` (text)
      - `phone` (text, optional)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `unit` (text)
      - `quantity` (integer)
      - `location` (text)
      - `image` (text)
      - `farmer_id` (uuid, references profiles)
      - `farmer_name` (text)
      - `rating` (numeric, default 4.5)
      - `description` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `farmer_id` (uuid, references profiles)
      - `items` (jsonb)
      - `total` (numeric)
      - `status` (text)
      - `delivery_address` (text)
      - `payment_method` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('farmer', 'consumer')),
  location text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  unit text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 0),
  location text NOT NULL,
  image text NOT NULL,
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_name text NOT NULL,
  rating numeric DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total numeric NOT NULL CHECK (total > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  delivery_address text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create market_trends table (keeping existing structure)
CREATE TABLE IF NOT EXISTS market_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  current_price numeric NOT NULL,
  predicted_price numeric NOT NULL,
  price_change numeric NOT NULL,
  demand_level text NOT NULL CHECK (demand_level IN ('low', 'medium', 'high')),
  supply_level text NOT NULL CHECK (supply_level IN ('low', 'medium', 'high')),
  recommendation text NOT NULL CHECK (recommendation IN ('sell', 'hold', 'wait')),
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  factors text[] NOT NULL,
  date text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Farmers can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = farmer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'farmer'
    )
  );

CREATE POLICY "Farmers can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = farmer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'farmer'
    )
  );

CREATE POLICY "Farmers can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = farmer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'farmer'
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = farmer_id);

CREATE POLICY "Consumers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'consumer'
    )
  );

CREATE POLICY "Farmers can update orders for their products"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = farmer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'farmer'
    )
  );

-- Market trends policies
CREATE POLICY "Anyone can read market trends"
  ON market_trends
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_market_trends_crop_name ON market_trends(crop_name);

-- Insert sample market trends data
INSERT INTO market_trends (crop_name, current_price, predicted_price, price_change, demand_level, supply_level, recommendation, confidence, factors, date) VALUES
('Tomato', 60, 75, 25, 'high', 'medium', 'sell', 85, ARRAY['Seasonal demand increase expected in next 2 weeks', 'Weather conditions favorable for higher prices', 'Low supply reported in nearby markets', 'Festival season approaching'], '2024-01-15'),
('Onion', 40, 35, -12.5, 'medium', 'high', 'hold', 72, ARRAY['Oversupply in major markets', 'Import restrictions lifted', 'Storage costs increasing', 'Better prices expected in 3-4 weeks'], '2024-01-15'),
('Potato', 25, 30, 20, 'high', 'low', 'wait', 78, ARRAY['Cold storage stocks depleting', 'Processing industry demand high', 'Export opportunities emerging', 'Price spike expected in 2 weeks'], '2024-01-15'),
('Rice', 45, 48, 6.7, 'medium', 'medium', 'sell', 68, ARRAY['Government procurement active', 'Export demand steady', 'Monsoon forecast positive', 'Stable market conditions'], '2024-01-15'),
('Wheat', 35, 38, 8.6, 'high', 'medium', 'sell', 82, ARRAY['Flour mill demand increasing', 'Export quotas available', 'Quality premium for good grades', 'Storage costs rising'], '2024-01-15'),
('Apple', 125, 140, 12, 'high', 'low', 'wait', 90, ARRAY['Premium variety demand high', 'Cold storage capacity limited', 'Export orders pending', 'Festival season premium expected'], '2024-01-15')
ON CONFLICT DO NOTHING;