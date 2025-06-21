'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../models';

export function useAuthHandler() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isUserLoading || !user || !firestore || isProcessing) {
      return;
    }

    const checkAndCreateOrUpdateUser = async () => {
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
            role: 'admin', // default role for testing
            newsletterSub: true,
            mailAdmin: true,
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserProfile);
        } else {
          // If user exists, check their role and update if not admin for testing
          const userProfile = docSnap.data() as UserProfile;
          if (userProfile.role !== 'admin') {
            await updateDoc(userDocRef, { role: 'admin' });
          }
        }
      } catch (error) {
        console.error("Error in user auth handler:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkAndCreateOrUpdateUser();
  }, [user, isUserLoading, firestore, isProcessing]);
}
