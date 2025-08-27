# Firebase Setup Guide for Dorm Hub

## Overview
This guide will help you configure Firebase for the Dorm Hub project, including Firestore database, Storage for images, and the data migration process.

## Prerequisites
- Firebase project created (if not done yet)
- Firebase CLI installed (`npm install -g firebase-tools`)
- Admin access to your Firebase project

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or use existing project
3. Enable the following services:
   - **Firestore Database**
   - **Storage**
   - **Authentication** (if needed for admin access)

### 1.2 Get Firebase Configuration
1. Go to Project Settings → General → Your apps
2. Click "Web app" icon to create a new web app
3. Copy the configuration object

### 1.3 Set Environment Variables
Create a `.env.local` file in the project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 2: Firestore Database Setup

### 2.1 Create Collections
The app uses the following Firestore collection:
- `properties` - Main collection for property listings

### 2.2 Set Firestore Security Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection - public read, admin write
    match /properties/{propertyId} {
      allow read: if true;  // Public read access for listings
      allow write: if request.auth != null;  // Authenticated users can write (admin)
    }
    
    // Admin-only access for management
    match /admin/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2.3 Create Firestore Indexes (if needed)
The following composite indexes may be needed:
1. Collection: `properties`, Fields: `status` (Ascending), `updatedAt` (Descending)
2. Collection: `properties`, Fields: `district` (Ascending), `updatedAt` (Descending)

## Step 3: Storage Setup

### 3.1 Set Storage Security Rules
In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Properties images - public read, admin write
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if true;  // Public read access for property images
      allow write: if request.auth != null;  // Authenticated users can upload
    }
  }
}
```

### 3.2 Create Storage Structure
The storage will organize images as:
```
/properties/
  /dorm-001/
    - image_0_timestamp.jpg
    - image_1_timestamp.jpg
  /dorm-002/
    - image_0_timestamp.jpg
```

## Step 4: Data Migration

### 4.1 Prepare CSV Data
Ensure your `listing.csv` file is in the project root with the following columns:
- `type`, `title`, `address`, `district`, `price`, `unit`, `status`, `available_at`, `occupation`, `property_id`, `amenities`, `room type`, `description`, `subtitle`, `image_url`, `vr`

### 4.2 Run Migration Script
```bash
# Make sure Firebase credentials are set in .env.local
npm run migrate-data
```

This will:
1. Read the CSV file
2. Convert data to Property objects
3. Upload all properties to Firestore
4. Display migration progress and results

### 4.3 Verify Migration
1. Check Firebase Console → Firestore Database → properties collection
2. Verify all properties were imported correctly
3. Check data structure matches the Property interface

## Step 5: Authentication (Optional)

### 5.1 Enable Authentication
If you want to secure admin access:
1. Go to Firebase Console → Authentication
2. Enable sign-in methods (Email/Password recommended)
3. Create admin user account

### 5.2 Update Security Rules
Update Firestore rules to check for specific admin users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email in ['admin@hkflal.com'];
    }
  }
}
```

## Step 6: Testing

### 6.1 Test Firebase Connection
```bash
npm run dev
```

Visit `http://localhost:3000/admin` and verify:
1. Properties load from Firebase
2. Can create new properties
3. Can edit existing properties
4. Can delete properties
5. Statistics display correctly

### 6.2 Test Image Upload (if implemented)
1. Try uploading images through the property form
2. Verify images appear in Firebase Storage
3. Check image URLs work in property listings

## Step 7: Production Deployment

### 7.1 Set Production Environment Variables
In your hosting platform (Vercel, Netlify, etc.), set all the `NEXT_PUBLIC_FIREBASE_*` environment variables.

### 7.2 Update Security Rules for Production
Make sure security rules are properly configured for production use:
- Restrict write access to authenticated admin users only
- Consider rate limiting for public read access
- Enable audit logging if needed

## Troubleshooting

### Common Issues

1. **"Missing or insufficient permissions" error**
   - Check Firestore security rules
   - Verify authentication status
   - Ensure user has proper permissions

2. **"Firebase: Error (auth/api-key-not-valid)" error**
   - Check environment variables are correctly set
   - Verify API key matches Firebase project

3. **"Storage upload failed" error**
   - Check Storage security rules
   - Verify authentication
   - Check file size limits

4. **Migration script fails**
   - Verify CSV file path and format
   - Check Firebase credentials
   - Ensure Firestore is properly initialized

### Useful Commands

```bash
# Check Firebase project status
firebase projects:list

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules  
firebase deploy --only storage

# View Firestore data
firebase firestore:indexes

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Support

For additional help:
1. Check Firebase Console for error logs
2. Review browser console for client-side errors
3. Check server logs for API-related issues
4. Refer to [Firebase Documentation](https://firebase.google.com/docs)

---

**Next Steps:**
After completing this setup, your admin panel at `/admin` will be fully functional with Firebase integration, allowing you to manage property listings with real-time data persistence and image uploads.