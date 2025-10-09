import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, FIREBASE_CONFIG_VALID } from "./config";

// This structure ensures that Firebase is initialized only once and only if the configuration is valid.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (FIREBASE_CONFIG_VALID) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase initialization error", e);
    }
  } else {
    app = getApp();
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// getFirebase is a function that returns the initialized instances.
// This is a safer pattern than exporting the instances directly,
// as it ensures they are always retrieved after initialization.
// It will return null for services if the config was invalid.
function getFirebase() {
  return { app, auth, db };
}

export { getFirebase };
