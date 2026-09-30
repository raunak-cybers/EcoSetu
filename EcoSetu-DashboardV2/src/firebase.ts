import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const isFirebaseConfigured = Boolean(
  rawApiKey && rawApiKey !== "AIzaSyMockKeyForDevelopmentMode12345"
);

// Firebase configuration with fallback
const firebaseConfig = {
  apiKey: rawApiKey || "AIzaSyMockKeyForDevelopmentMode12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kabadiwala-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kabadiwala-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kabadiwala-connect.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
