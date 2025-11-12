// staffsetu_partner/app.config.js
require('dotenv').config({ path: './.env.local' }); // Reads your .env.local file

export default ({ config }) => ({
  ...config, // Inherits default Expo config
  
  // --- Partner App Specifics ---
  name: "staffsetu_partner",
  slug: "staffsetu_partner",
  
  // --- This is the critical part ---
  // We are copying the entire 'extra' block from your customer app
  // to ensure all keys are loaded.
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    phoneEmailClientId: process.env.PHONE_EMAIL_CLIENT_ID, // <-- This will fix the login
  },
  
  // --- Other native configs ---
  ios: {
    ...config.ios, // Inherit any existing ios config
    supportsTablet: true,
    bundleIdentifier: "com.staffsetu.partner",
    googleServicesFile: "./GoogleService-Info.plist" // For production builds
  },
  android: {
    ...config.android, // Inherit any existing android config
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.staffsetu.partner",
    googleServicesFile: "./google-services.json" // For production builds
  },
  web: {
    ...config.web, // Inherit any existing web config
    favicon: "./assets/favicon.png"
  },
});