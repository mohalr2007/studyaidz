"use server";

import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export async function syncUser(user: FirebaseUser) {
  const userRef = doc(db, 'users', user.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // User is new, create a new document
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'student', // Default role
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      console.log("New user created in Firestore:", user.uid);
    } else {
      // User exists, update last login
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      console.log("User last login updated:", user.uid);
    }
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
    // Optionally re-throw or return an error object
    throw new Error("Failed to sync user data.");
  }
}
