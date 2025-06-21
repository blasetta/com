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
          const newUserProfile: Omit<UserProfile, 'id'> = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Anonymous User',
            photoURL: user.photoURL,
            role: 'admin', // default role
            newsletterSub: false,
            mailAdmin: false,
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserProfile);
        }
      } catch (error) {
        console.error("Error checking or creating user document:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkAndCreateUser();
  }, [user, isUserLoading, firestore, isProcessing]);
}
