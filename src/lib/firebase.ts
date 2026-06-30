import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web config is intentionally public — security is enforced by Firestore Security Rules
const firebaseConfig = {
  apiKey: "AIzaSyBpE6oaN_cO_YPAvBZWIwgva48RqgUJxKc",
  authDomain: "tirth-food-studio-b6f8f.firebaseapp.com",
  projectId: "tirth-food-studio-b6f8f",
  storageBucket: "tirth-food-studio-b6f8f.firebasestorage.app",
  messagingSenderId: "938387646232",
  appId: "1:938387646232:web:55e1c01fa0946684d9206d"
};

// Initialize Firebase safely for Next.js SSR
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
