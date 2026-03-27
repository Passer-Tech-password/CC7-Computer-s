"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as FirebaseAuthModule from "firebase/auth";
import * as FirebaseFirestoreModule from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase";
import { GoogleIcon, SpinnerIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { auth } = getFirebaseClient();
      await FirebaseAuthModule.signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to login. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { auth, db } = getFirebaseClient();
      const provider = new FirebaseAuthModule.GoogleAuthProvider();
      const result = await FirebaseAuthModule.signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create one
      const userRef = FirebaseFirestoreModule.doc(db, "users", result.user.uid);
      const userDoc = await FirebaseFirestoreModule.getDoc(userRef);
      
      if (!userDoc.exists()) {
        await FirebaseFirestoreModule.setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || "Customer",
          role: "customer",
          createdAtMs: Date.now()
        });
      }
      
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to login with Google.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-6 card border-t-4 border-t-primary-blue">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary-blue">Welcome Back</h1>
          <p className="mt-2 text-sm text-dark/75 dark:text-light/75">
            Log in to manage your orders, repairs, and profile.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-white bg-primary-red/90 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-blue focus:outline-none transition-colors"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-dark border-dark/20 dark:border-light/20 focus:ring-2 focus:ring-primary-blue focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : "Log In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark/10 dark:border-light/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark/50 text-dark/60 dark:text-light/60">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-dark/20 dark:border-light/20 rounded-md hover:bg-dark/5 dark:hover:bg-light/5 transition-colors font-medium text-dark dark:text-light"
        >
          <GoogleIcon className="w-5 h-5" />
          Google
        </button>

        <p className="text-center text-sm text-dark/75 dark:text-light/75">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-primary-yellow hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
