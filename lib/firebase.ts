"use client";

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import * as FirebaseAppModule from "firebase/app";
import * as FirebaseAuthModule from "firebase/auth";
import * as FirebaseFirestoreModule from "firebase/firestore";
import * as FirebaseStorageModule from "firebase/storage";

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let cachedClient: FirebaseClient | null = null;

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""
  };
}

function assertFirebaseConfig(config: ReturnType<typeof getFirebaseConfig>) {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(
        ", "
      )}. Add them to .env.local (see placeholders in this repo).`
    );
  }
}

export function getFirebaseClient(): FirebaseClient {
  if (cachedClient) return cachedClient;

  const config = getFirebaseConfig();
  assertFirebaseConfig(config);

  const app = FirebaseAppModule.getApps().length > 0
    ? FirebaseAppModule.getApp()
    : FirebaseAppModule.initializeApp(config);

  cachedClient = {
    app,
    auth: FirebaseAuthModule.getAuth(app),
    db: FirebaseFirestoreModule.getFirestore(app),
    storage: FirebaseStorageModule.getStorage(app)
  };

  return cachedClient;
}
