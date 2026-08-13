import { spawnSync } from 'node:child_process'

const env = {
  ...process.env,
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
  NEXT_PUBLIC_FIREBASE_API_KEY: 'local-test-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'labour-dorm-local.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'labour-dorm-local',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'labour-dorm-local.appspot.com',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  NEXT_PUBLIC_FIREBASE_APP_ID: '1:000000000000:web:local',
  TS_NODE_COMPILER_OPTIONS: JSON.stringify({ module: 'CommonJS', moduleResolution: 'node' }),
}

const result = spawnSync('npx', [
  'firebase',
  'emulators:exec',
  '--project',
  'labour-dorm-local',
  '--only',
  'auth,firestore,storage',
  'node -r ts-node/register scripts/test-firestore-admin-emulator.cjs',
], { env, stdio: 'inherit' })

process.exit(result.status ?? 1)
