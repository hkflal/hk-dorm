# Firebase Deployment Guide for Dorm-Hub

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase Account** with the project `hk-dormitory-hub` already created
3. **Firebase CLI** (installed as dev dependency)

## Setup Instructions

### 1. Environment Configuration

The `.env.local` file has been created with your Firebase configuration. Make sure these environment variables are set:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDMX4M9kEtJBHaAfeGhjxb_g6TwqJ9py4o
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hk-dormitory-hub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hk-dormitory-hub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hk-dormitory-hub.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=161220166213
NEXT_PUBLIC_FIREBASE_APP_ID=1:161220166213:web:0ae49ca09fe57e2120192c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J134CKF8Z3
```

### 2. Firebase Authentication

First, authenticate with Firebase:

```bash
npx firebase login
```

### 3. Initialize Firebase (if needed)

If you need to reinitialize Firebase configuration:

```bash
npm run firebase:init
```

Choose:
- **Hosting: Configure files for Firebase Hosting**
- **Use existing project**: `hk-dormitory-hub`
- **Public directory**: `out`
- **Single-page app**: `Yes`
- **Overwrite index.html**: `No`

### 4. Build and Deploy

To build and deploy in one command:

```bash
npm run firebase:deploy
```

Or step by step:

```bash
# Build the static export
npm run export

# Deploy to Firebase
npx firebase deploy
```

## Deployment URLs

After successful deployment, your app will be available at:
- **Live URL**: https://hk-dormitory-hub.web.app
- **Alternative URL**: https://hk-dormitory-hub.firebaseapp.com

## Firebase Services Configuration

The project is configured to use these Firebase services:

### Firebase Auth
- User authentication for login/register functionality
- Import: `import { auth } from '@/lib/firebase'`

### Firestore Database
- NoSQL database for storing property and user data
- Import: `import { db } from '@/lib/firebase'`

### Firebase Storage
- File storage for property images and user uploads
- Import: `import { storage } from '@/lib/firebase'`

### Firebase Analytics
- Web analytics and user behavior tracking
- Import: `import { analytics } from '@/lib/firebase'`

## Project Structure

```
src/
  lib/
    firebase.ts          # Firebase configuration and initialization
```

## Important Notes

1. **Static Export**: The project is configured for static export (`output: 'export'`) which is perfect for Firebase Hosting.

2. **Image Optimization**: Images are set to `unoptimized: true` since Firebase Hosting doesn't support Next.js image optimization.

3. **Trailing Slashes**: Configured with `trailingSlash: true` for better compatibility with Firebase Hosting.

4. **Environment Variables**: All Firebase config is loaded from environment variables for security.

5. **Analytics**: Firebase Analytics is only initialized on the client side to prevent SSR issues.

## Troubleshooting

### Build Issues
If you encounter build issues, try:
```bash
rm -rf .next out
npm run build
```

### Deployment Issues
If deployment fails:
```bash
npx firebase logout
npx firebase login
npm run firebase:deploy
```

### Environment Variables
Make sure your `.env.local` file is not committed to git and contains all required Firebase configuration variables.

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firebase Rules**: Configure proper Firestore security rules in Firebase Console
3. **Authentication**: Implement proper user authentication and authorization
4. **API Keys**: Firebase API keys in `NEXT_PUBLIC_*` variables are safe for client-side use

## Next Steps

After deployment, consider:
1. Setting up Firestore security rules
2. Configuring Firebase Authentication providers
3. Setting up Firebase Storage rules
4. Implementing proper error handling
5. Adding Firebase performance monitoring

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Firebase Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)