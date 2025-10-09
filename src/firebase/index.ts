
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
    if (typeof window !== "undefined") {
        if (!getApps().length) {
            try {
                app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
            } catch (e) {
                console.error("Firebase initialization error", e);
            }
        } else {
            app = getApp();
            auth = getAuth(app);
            db = getFirestore(app);
        }
    }
}

initializeFirebase();

function getFirebase() {
    if (!app) {
        initializeFirebase();
    }
    return { app, auth, db };
}

// Export the getter function and the initialized instances.
// The instances are exported for legacy parts of the app that might still use them directly.
// The goal is to migrate everything to use getFirebase().
export { app, auth, db, getFirebase };
