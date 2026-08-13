// Firebase configuration and initialization
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // Placeholders keep static export from initialising Auth with undefined values.
  // Real values are supplied through .env.local or the Firebase Hosting build environment.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDUMMY_STATIC_EXPORT_KEY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'labour-dorm-local',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'labour-dorm-local.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:local',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const useAllEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'
const useAuthEmulator = useAllEmulators || process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true'
const useFirestoreEmulator = useAllEmulators || process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true'
const useStorageEmulator = useAllEmulators || process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === 'true'
const emulatorState = typeof window !== 'undefined'
  ? window as Window & { __labourDormEmulators?: { auth?: boolean; firestore?: boolean; storage?: boolean } }
  : undefined

if (emulatorState && !emulatorState.__labourDormEmulators) {
  emulatorState.__labourDormEmulators = {}
}

if (emulatorState && useAuthEmulator && !emulatorState.__labourDormEmulators?.auth) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  emulatorState.__labourDormEmulators!.auth = true
}

if (emulatorState && useFirestoreEmulator && !emulatorState.__labourDormEmulators?.firestore) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  emulatorState.__labourDormEmulators!.firestore = true
}

if (emulatorState && useStorageEmulator && !emulatorState.__labourDormEmulators?.storage) {
  connectStorageEmulator(storage, '127.0.0.1', 9199)
  emulatorState.__labourDormEmulators!.storage = true
}

// Initialize Analytics (only on client side)
let analytics: Analytics | undefined;
const usingAnyEmulator = useAuthEmulator || useFirestoreEmulator || useStorageEmulator
if (typeof window !== 'undefined' && firebaseConfig.measurementId && !usingAnyEmulator) {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
