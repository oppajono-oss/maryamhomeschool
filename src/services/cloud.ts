import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { RootState } from '../store';

let db: ReturnType<typeof getFirestore> | null = null;
let uid: string | null = null;
let pushSuspended = false;

export const initCloud = async () => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  const auth = getAuth(app);
  await signInAnonymously(auth).catch(() => {});
  await new Promise<void>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      uid = user?.uid || null;
      resolve();
    });
  });
};

export const pullState = async (): Promise<Partial<RootState['study']> | null> => {
  if (!db || !uid) return null;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as any) : null;
};

export const pushState = async (state: RootState['study']) => {
  if (!db || !uid || pushSuspended) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, state, { merge: true });
};

export const setPushSuspended = (value: boolean) => {
  pushSuspended = value;
};

export const subscribeToRemote = (onData: (data: Partial<RootState['study']>) => void) => {
  if (!db || !uid) return () => {};
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      onData(snap.data() as any);
    }
  });
};


