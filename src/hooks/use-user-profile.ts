'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import type { UserProfile } from '@/firebase/models';
import type { UseDocResult } from '@/firebase/firestore/use-doc';

export function useUserProfile(uid: string | undefined): UseDocResult<UserProfile> {
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !uid) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, uid]);

  return useDoc<UserProfile>(userDocRef);
}
