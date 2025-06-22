'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { UserProfile } from '../models';

export function useAuthHandler() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isUserLoading || !user || !firestore || isProcessing) {
      return;
    }

    const checkAndCreateUser = async () => {
      setIsProcessing(true);
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          // Create a new user profile with a default 'user' role.
          const newUserProfile: Omit<UserProfile, 'id'> = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL,
            role: 'user', // Default role for new users
            newsletterSub: true,
            mailAdmin: true,
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserProfile);
        }
        // We no longer automatically update existing users' roles.
        // Role management should be handled by an admin in the UI.
      } catch (error) {
        console.error("Error in user auth handler:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkAndCreateUser();
  }, [user, isUserLoading, firestore, isProcessing]);
}
