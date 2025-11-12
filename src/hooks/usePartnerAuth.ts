// src/hooks/usePartnerAuth.ts
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// This is the shape of our new 'partners' document
export interface PartnerProfile {
  uid: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  firstName: string;
  // ... all other registration fields
}

// This hook will be the brain of our app
export function usePartnerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authSubscriber = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        // User is logged in, now check the 'partners' collection
        const partnerDocRef = doc(db, 'partners', authUser.uid);
        
        const firestoreSubscriber = onSnapshot(partnerDocRef, (docSnap) => {
          if (docSnap.exists()) {
            // A partner document EXISTS. Read their status.
            setPartnerProfile(docSnap.data() as PartnerProfile);
          } else {
            // A partner document does NOT exist. They need to register.
            setPartnerProfile(null);
          }
          setLoading(false);
        });
        return firestoreSubscriber;
      } else {
        // No user is logged in
        setUser(null);
        setPartnerProfile(null);
        setLoading(false);
      }
    });

    return authSubscriber; // Cleanup
  }, []);

  return { user, partnerProfile, loading };
}