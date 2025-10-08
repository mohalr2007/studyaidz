"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebase';
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
      }
      // The rest of the logic is handled in the snapshot listener
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData?.name || firebaseUser.displayName,
            photoURL: userData?.photoURL || firebaseUser.photoURL,
            role: userData?.role || 'student',
            verified: firebaseUser.emailVerified,
          });
        } else {
          // User might not be in Firestore yet, use auth details as fallback
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'student',
            verified: firebaseUser.emailVerified,
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user document:", error);
        // Fallback in case of error
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'student',
          verified: firebaseUser.emailVerified,
        });
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    }
  }, [firebaseUser]);


  const value = { user, firebaseUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
