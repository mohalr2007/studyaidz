
"use server";

import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebase } from '@/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserProfileFormData } from '@/types';

/**
 * Checks if a user document exists in Firestore.
 * If it's a new user, it creates a document with basic info and `isProfileComplete: false`.
 * If the user exists, it just updates their last login time.
 * @param user The Firebase authenticated user object.
 * @returns An object containing the user's profile data and a flag indicating if the profile is complete.
 */
export async function syncUserAndCheckProfile(user: FirebaseUser) {
  const { db } = getFirebase();
  // If db is not available (e.g. during build), return a default profile.
  if (!db) {
    return { isProfileComplete: false };
  }

  const userRef = doc(db, 'users', user.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // User is new, create a new document with profile incomplete
      const newUserProfile = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'student', // Default role
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isProfileComplete: false, // New flag
      };
      await setDoc(userRef, newUserProfile);
      console.log("New user created in Firestore:", user.uid);
      return { ...newUserProfile, isProfileComplete: false };
    } else {
      // User exists, update last login and get their profile status
      await updateDoc(userRef, { lastLogin: serverTimestamp() });
      const userData = docSnap.data();
      console.log("User last login updated:", user.uid);
      return { ...userData, isProfileComplete: userData.isProfileComplete ?? false };
    }
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
    throw new Error("Failed to sync user data.");
  }
}

/**
 * Updates a user's profile in Firestore after they complete the registration form.
 * @param uid The user's unique ID.
 * @param data The data from the profile completion form.
 */
export async function completeUserProfile(uid: string, data: UserProfileFormData) {
  const { db } = getFirebase();
  if (!db) {
    throw new Error("Firestore is not available.");
  }

  const userRef = doc(db, 'users', uid);
  try {
    await updateDoc(userRef, {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth), // Ensure date is a Timestamp
      isProfileComplete: true,
      updatedAt: serverTimestamp(),
    });
    console.log("User profile completed for:", uid);
  } catch (error) {
    console.error("Error completing user profile:", error);
    throw new Error("Failed to update user profile.");
  }
}
