"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { getFirebaseClientAsync } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserData } from "@/types/user";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let unsub: (() => void) | undefined;
    (async () => {
      try {
        const { auth, db } = await getFirebaseClientAsync();
        const { onAuthStateChanged } = await import("firebase/auth");
        unsub = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              setUserData(userDoc.exists() ? (userDoc.data() as UserData) : null);
            } catch (error) {
              console.error("Error fetching user data:", error);
              setUserData(null);
            }
          } else {
            setUser(null);
            setUserData(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error initializing Firebase Auth:", error);
        setLoading(false);
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const logout = async () => {
    try {
      const { auth } = await getFirebaseClientAsync();
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
