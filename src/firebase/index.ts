
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// This structure ensures that Firebase is initialized only once.
let app: FirebaseApp;
if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
    } catch(e) {
        console.error("Firebase initialization error", e);
        // If initialization fails, we need to handle it.
        // For now, we will throw the error to make it visible.
        throw new Error("Failed to initialize Firebase. Please check your configuration.");
    }
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

// getFirebase is a function that returns the initialized instances.
// This is a safer pattern than exporting the instances directly,
// as it ensures they are always retrieved after initialization.
function getFirebase() {
    return { app, auth, db };
}

export { getFirebase };
