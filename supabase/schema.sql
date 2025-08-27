-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE property_type AS ENUM ('勞工舍宿', '學生宿舍');
CREATE TYPE unit_type AS ENUM ('床位', '套房');
CREATE TYPE property_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE room_type AS ENUM ('shared room', 'private room');

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id VARCHAR(50) UNIQUE NOT NULL,
  type property_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  address TEXT NOT NULL,
  district VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'HKD',
  unit unit_type NOT NULL,
  status property_status DEFAULT 'pending',
  available_at VARCHAR(50) DEFAULT 'now',
  occupation VARCHAR(10) DEFAULT '0%',
  
  -- Images and media
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  vr TEXT,
  
  -- Rating and reviews
  rating DECIMAL(3,2) DEFAULT 4.0,
  review_count INTEGER DEFAULT 0,
  
  -- Location
  latitude DECIMAL(10, 8) DEFAULT 22.2783,
  longitude DECIMAL(11, 8) DEFAULT 114.1747,
  nearby_mtr TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Property details
  guests INTEGER DEFAULT 1,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  property_type VARCHAR(100),
  room_type room_type DEFAULT 'shared room',
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Host information
  host_id VARCHAR(100) DEFAULT 'admin-host',
  host_name VARCHAR(255) DEFAULT 'HKFLAL Admin',
  host_avatar TEXT,
  host_is_superhost BOOLEAN DEFAULT TRUE,
  host_response_time VARCHAR(50) DEFAULT '1 hour',
  
  -- Availability and policies
  available BOOLEAN DEFAULT TRUE,
  min_stay INTEGER DEFAULT 30,
  max_stay INTEGER DEFAULT 365,
  check_in VARCHAR(20) DEFAULT '2:00 PM',
  check_out VARCHAR(20) DEFAULT '12:00 PM',
  cancellation VARCHAR(50) DEFAULT 'Flexible',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_updated_at ON properties(updated_at);
CREATE INDEX IF NOT EXISTS idx_properties_property_id ON properties(property_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON properties
    FOR SELECT USING (true);

-- Create policy for authenticated insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON properties
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data (optional)
INSERT INTO properties (
    property_id, 
    type, 
    title, 
    address, 
    district, 
    price, 
    unit, 
    status, 
    occupation,
    room_type,
    amenities,
    latitude,
    longitude
) VALUES 
    (
        'dorm-001',
        '勞工舍宿',
        '西洋菜南街',
        '旺角西洋菜南街166號',
        '旺角',
        3500,
        '床位',
        'active',
        '90%',
        'shared room',
        ARRAY['wifi', 'kitchen', 'aircon', 'laundry', 'nearMTR'],
        22.3193,
        114.1694
    ),
    (
        'student-001',
        '學生宿舍',
        '永利大廈',
        '九龍尖沙咀金巴利道 永利大廈',
        '尖沙咀',
        7000,
        '套房',
        'active',
        '30%',
        'private room',
        ARRAY['wifi', 'kitchen', 'aircon', 'laundry', 'nearMTR'],
        22.2987,
        114.1719
    );

-- Create a view for easier property querying with all computed fields
CREATE OR REPLACE VIEW property_details AS
SELECT 
    p.*,
    -- Add computed fields if needed
    CASE 
        WHEN p.status = 'active' THEN true 
        ELSE false 
    END as is_available
FROM properties p;

-- Grant permissions to authenticated users
GRANT ALL ON properties TO authenticated;
GRANT SELECT ON property_details TO anon;
GRANT SELECT ON property_details TO authenticated;