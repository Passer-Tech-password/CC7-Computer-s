"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { UserRole } from "@/types/user";
import { GoogleIcon, SpinnerIcon } from "@/components/icons";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { auth, db } = getFirebaseClient();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user profile with selected role
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        role,
        createdAtMs: Date.now()
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const { auth, db } = getFirebaseClient();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || "User",
          role, // use the currently selected role
          createdAtMs: Date.now()
        });
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 card border-t-4 border-t-primary-yellow">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary-yellow drop-shadow-sm">Create Account</h1>
          <p className="mt-2 text-sm text-dark/75 dark:text-light/75">
            Join CC7 Computers for faster checkouts and repair tracking.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-white bg-primary-red/90 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-yellow focus:outline-none transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-yellow focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-yellow focus:outline-none transition-colors"
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-1">
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-yellow focus:outline-none transition-colors text-dark dark:text-light"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-dark/50 dark:text-light/50 mt-1">
              * Role selection included for demo purposes.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark/10 dark:border-light/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark/50 text-dark/60 dark:text-light/60">
              Or sign up with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dark/20 dark:border-light/20 rounded-md hover:bg-dark/5 dark:hover:bg-light/5 transition-colors font-medium text-dark dark:text-light"
        >
          <GoogleIcon className="w-5 h-5" />
          Google
        </button>

        <p className="text-center text-sm text-dark/75 dark:text-light/75">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
