#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Firebase deployment readiness...\n');

// Check if required files exist
const requiredFiles = [
  'firebase.json',
  '.firebaserc', 
  'out/index.html',
  'src/lib/firebase.ts',
  '.env.local'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    allFilesExist = false;
  }
});

// Check environment variables
console.log('\n🔧 Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  ];

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} is configured`);
    } else {
      console.log(`❌ ${envVar} is missing`);
      allFilesExist = false;
    }
  });
}

// Check Firebase configuration
console.log('\n🔥 Verifying Firebase configuration...');
const firebaseConfigPath = path.join(__dirname, 'firebase.json');
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
  if (firebaseConfig.hosting && firebaseConfig.hosting.public === 'out') {
    console.log('✅ Firebase hosting configuration is correct');
  } else {
    console.log('❌ Firebase hosting configuration needs adjustment');
    allFilesExist = false;
  }
}

// Check build output
console.log('\n📦 Checking build output...');
const outDir = path.join(__dirname, 'out');
if (fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir);
  const hasIndex = files.includes('index.html');
  const hasAssets = files.includes('_next');
  const hasImages = files.includes('images');
  
  if (hasIndex) console.log('✅ index.html exists in out directory');
  if (hasAssets) console.log('✅ _next assets directory exists');
  if (hasImages) console.log('✅ images directory exists');
  
  if (!hasIndex || !hasAssets) {
    console.log('❌ Build output is incomplete');
    allFilesExist = false;
  }
}

// Summary
console.log('\n📋 Deployment Readiness Summary:');
if (allFilesExist) {
  console.log('🎉 All checks passed! Ready for Firebase deployment.');
  console.log('\n📝 Next steps:');
  console.log('1. Run: npx firebase login');
  console.log('2. Run: npm run firebase:deploy');
  console.log('3. Your app will be live at: https://hk-dormitory-hub.web.app');
} else {
  console.log('⚠️  Some issues found. Please fix them before deploying.');
}

console.log('\n🔗 Useful commands:');
console.log('• Build and export: npm run export');
console.log('• Deploy to Firebase: npm run firebase:deploy');
console.log('• Firebase login: npx firebase login');
console.log('• View Firebase project: npx firebase open hosting');