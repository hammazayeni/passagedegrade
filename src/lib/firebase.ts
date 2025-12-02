import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const defaultConfig = {
  apiKey: "AIzaSyCTf1Lj_Rklig_3eKUCTXJQty2i16rjKGk",
  authDomain: "promotion--test.firebaseapp.com",
  projectId: "promotion--test",
  storageBucket: "promotion--test.firebasestorage.app",
  messagingSenderId: "904598948378",
  appId: "1:904598948378:web:661759bd8f8b858a24dfa3",
  measurementId: "G-29GYQVBD8Q",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
if (firebaseConfig && (firebaseConfig as any).apiKey && (firebaseConfig as any).projectId) {
  try {
    app = initializeApp(firebaseConfig as any);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch {}
}

let analytics: Analytics | undefined;
if (typeof window !== "undefined" && app) {
  isSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => {});
  if (auth) {
    signInAnonymously(auth).catch(() => {});
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTimeout(() => {
          signInAnonymously(auth as Auth).catch(() => {});
        }, 1500);
      }
    });
  }
}

export { app, auth, db, analytics };
