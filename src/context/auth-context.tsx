
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/firebase';
import type { User as AppUser } from '@/types';

export interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, db } = getFirebase();


  useEffect(() => {
    if (!auth) {
      setLoading(false); // If Firebase isn't configured, we're not loading auth.
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (firebaseUser && db) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const DOB = userData.dateOfBirth ? userData.dateOfBirth.toDate() : undefined;

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.name || firebaseUser.displayName,
            photoURL: userData.photoURL || firebaseUser.photoURL,
            role: userData.role || 'student',
            verified: firebaseUser.emailVerified,
            isProfileComplete: userData.isProfileComplete,
            username: userData.username,
            gender: userData.gender,
            dateOfBirth: DOB,
            fieldOfStudy: userData.fieldOfStudy,
          });
        } else {
          // Temp user object for new sign-ups until profile is complete
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'student',
            verified: firebaseUser.emailVerified,
            isProfileComplete: false,
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user document:", error);
        setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'student',
            verified: firebaseUser.emailVerified,
            isProfileComplete: false,
        });
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    } else if (!firebaseUser) {
        // If there's no firebaseUser, ensure user state is also null
        setUser(null);
        setLoading(false);
    }
  }, [firebaseUser, db]);


  const value = { user, firebaseUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
