import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

export function getFirebaseApp() {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  } as const;

  const hasAll = Object.values(cfg).every(Boolean);
  if (!hasAll) return null;
  return getApps().length ? getApps()[0] : initializeApp(cfg);
}

export function getDb() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export function getBucket() {
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
}

export async function ensureAuth() {
  const app = getFirebaseApp();
  if (!app) return false;
  const auth = getAuth(app);
  if (auth.currentUser) return true;
  try {
    await signInAnonymously(auth);
    return true;
  } catch {
    return false;
  }
}
