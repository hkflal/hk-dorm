# Supabase Setup Guide for Dorm Hub

## Overview
This guide will help you configure Supabase for the Dorm Hub project, including PostgreSQL database, Storage for images, and the data migration process.

## Prerequisites
- Supabase account created at [supabase.com](https://supabase.com/)
- Supabase project created
- Admin access to your Supabase project

## Step 1: Create Supabase Project

### 1.1 Create New Project
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `dorm-hub` or your preferred name
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Hong Kong (e.g., Asia Pacific)
5. Click "Create new project"
6. Wait for project initialization (2-3 minutes)

### 1.2 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon/public key)

### 1.3 Set Environment Variables
Create or update `.env.local` file in project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Keep Firebase for hosting (if using Firebase hosting)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 2: Database Schema Setup

### 2.1 Run Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Click "New Query"
3. Copy and paste the entire contents of `/supabase/schema.sql`
4. Click "Run" to execute the schema
5. Verify tables were created in **Table Editor**

The schema creates:
- `properties` table with all required fields
- Custom PostgreSQL types (enums)
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

### 2.2 Verify Table Structure
Go to **Table Editor** → **properties** and verify columns:
- ✅ `id` (UUID, primary key)
- ✅ `property_id` (varchar, unique)
- ✅ `type` (enum: 勞工舍宿, 學生宿舍)
- ✅ `title`, `subtitle`, `description`
- ✅ `address`, `district`
- ✅ `price`, `currency`, `unit`
- ✅ `status`, `available_at`, `occupation`
- ✅ `images` (text array), `image_url`, `vr`
- ✅ `rating`, `review_count`
- ✅ `latitude`, `longitude`, `nearby_mtr` (text array)
- ✅ And all other property fields...

## Step 3: Storage Setup

### 3.1 Create Storage Bucket
1. Go to **Storage** in Supabase Dashboard
2. Click "Create a new bucket"
3. Enter bucket details:
   - **Name**: `property-images`
   - **Public bucket**: ✅ Check this (for public image access)
4. Click "Create bucket"

### 3.2 Set Storage Policies (Optional)
If you want more control over uploads:
1. Go to **Storage** → **Policies**
2. Create policies for the `property-images` bucket:

```sql
-- Allow public read access to images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

## Step 4: Authentication Setup (Optional)

### 4.1 Enable Authentication
1. Go to **Authentication** → **Settings**
2. Configure authentication providers if needed:
   - Email/Password (enabled by default)
   - Google, Facebook, etc. (optional)

### 4.2 Create Admin User (Optional)
If you want secure admin access:
1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter admin email and password
4. User will be able to access admin functions

## Step 5: Data Migration

### 5.1 Test Connection
```bash
# Test that environment variables are working
npm run dev
```

Visit `/admin` - you should see empty property list (no errors)

### 5.2 Run Migration Script
```bash
# Import CSV data to Supabase
npm run migrate-data
```

Expected output:
```
🚀 Starting data migration...
📊 Found X records in CSV
🔄 Converting CSV data to Property objects...
☁️ Uploading properties to Supabase...
✅ Data migration completed successfully!
📈 Migrated X properties to Supabase
```

### 5.3 Verify Migration
1. Go to **Table Editor** → **properties** in Supabase Dashboard
2. You should see all imported properties
3. Visit `/admin` to see properties in the admin panel
4. Test CRUD operations (create, edit, delete)

## Step 6: Testing

### 6.1 Test Admin Panel
1. Start development server: `npm run dev`
2. Visit `http://localhost:3000/admin`
3. Verify:
   - ✅ Properties load from Supabase
   - ✅ Statistics show correct numbers
   - ✅ Can create new properties
   - ✅ Can edit existing properties
   - ✅ Can delete properties
   - ✅ Real-time updates work

### 6.2 Test Property Form
1. Click "新增房源" (Add Property)
2. Fill out the form with all required fields:
   - Property ID (e.g., `test-001`)
   - Type, title, address, district, price
   - Status, occupation, room type
   - Amenities, MTR stations
3. Click "Add Property"
4. Verify property appears in the list

### 6.3 Test Image Upload (When Implemented)
1. Edit a property
2. Add image URLs or upload files
3. Verify images appear correctly

## Step 7: Row Level Security (RLS)

The schema automatically sets up RLS policies:

### Current Policies:
- **Public Read**: Anyone can read properties (for public listings)
- **Authenticated Write**: Only authenticated users can create/update/delete

### Customize Policies (Optional):
```sql
-- Only allow specific admin users
CREATE POLICY "Admin Only Write" ON properties
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@hkflal.com');

-- Or allow based on user role
CREATE POLICY "Role-based Access" ON properties
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## Step 8: Production Deployment

### 8.1 Environment Variables
Set the same environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Firebase hosting variables (if using Firebase hosting)

### 8.2 Security Checklist
- ✅ RLS policies are enabled and tested
- ✅ Storage bucket permissions are correct
- ✅ Environment variables are secure
- ✅ Database credentials are not exposed
- ✅ CORS settings allow your domain

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Check `.env.local` file exists and has correct values
   - Restart development server after adding variables
   - Verify variable names match exactly

2. **"Failed to fetch properties" error**
   - Check Supabase project is active and accessible
   - Verify RLS policies allow read access
   - Check network connectivity to Supabase

3. **"Permission denied" on insert/update/delete**
   - Check RLS policies for write operations
   - Verify user authentication if required
   - Test with temporarily disabled RLS (dev only)

4. **Migration script fails**
   - Verify CSV file exists and has correct format
   - Check Supabase connection and credentials
   - Ensure database schema is created

5. **Images not loading**
   - Check storage bucket is public
   - Verify storage policies allow public read
   - Test image URLs directly in browser

### Useful SQL Queries

```sql
-- Check if data was imported correctly
SELECT COUNT(*) FROM properties;

-- View properties by status
SELECT title, status, district, price FROM properties 
WHERE status = 'active';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'properties';

-- View storage objects
SELECT * FROM storage.objects WHERE bucket_id = 'property-images';
```

### Useful Supabase CLI Commands (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate types (auto-generate database.types.ts)
supabase gen types typescript --project-id your-project-ref > src/lib/database.types.ts
```

## Advanced Features

### Real-time Subscriptions
Add real-time updates to admin panel:

```typescript
// Listen to property changes
useEffect(() => {
  const subscription = supabase
    .channel('properties')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'properties' }, 
      (payload) => {
        console.log('Change received!', payload)
        // Refresh property list
        loadProperties()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}, [])
```

### Database Functions
Create custom functions for complex operations:

```sql
-- Function to get property stats
CREATE OR REPLACE FUNCTION get_property_stats()
RETURNS TABLE (
  total_properties INT,
  active_properties INT,
  pending_properties INT,
  average_price DECIMAL
)
LANGUAGE SQL
AS $$
  SELECT 
    COUNT(*)::INT as total_properties,
    COUNT(*) FILTER (WHERE status = 'active')::INT as active_properties,
    COUNT(*) FILTER (WHERE status = 'pending')::INT as pending_properties,
    AVG(price) as average_price
  FROM properties;
$$;
```

## Support

For additional help:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review Supabase Dashboard logs under **Logs**
3. Check browser console for client-side errors
4. Review server logs for API-related issues

---

**Next Steps:**
After completing this setup, your admin panel at `/admin` will be fully functional with Supabase integration, allowing you to manage property listings with real-time data persistence, PostgreSQL reliability, and cloud image storage.