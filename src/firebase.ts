import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';

// Embedded configuration from provisioned Firebase project
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  // Persist user record
  if (result.user) {
    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(userRef, {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      lastLogin: serverTimestamp(),
    }, { merge: true });
  }
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// User Mock Session Persistence
export async function saveInterviewSession(userId: string, sessionData: any) {
  try {
    const sessionId = sessionData.id || `session_${Date.now()}`;
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    await setDoc(sessionRef, {
      ...sessionData,
      id: sessionId,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return sessionId;
  } catch (err) {
    console.error('Failed to save session to Firestore:', err);
    throw err;
  }
}

export async function loadUserSessions(userId: string) {
  try {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Could not query Firestore sessions, returning empty list:', err);
    return [];
  }
}

// User Daily Schedule Progress Persistence
export async function saveUserProgress(userId: string, progressData: any) {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'schedule');
    await setDoc(progressRef, {
      ...progressData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

export async function loadUserProgress(userId: string) {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'schedule');
    const snap = await getDoc(progressRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Could not load user progress:', err);
    return null;
  }
}

// Custom Job Blueprints Persistence
export async function saveJobBlueprint(userId: string, blueprint: any) {
  try {
    const id = blueprint.id || `bp_${Date.now()}`;
    const ref = doc(db, 'users', userId, 'blueprints', id);
    await setDoc(ref, {
      ...blueprint,
      id,
      savedAt: serverTimestamp(),
    }, { merge: true });
    return id;
  } catch (err) {
    console.error('Failed to save blueprint:', err);
    throw err;
  }
}

export async function loadUserBlueprints(userId: string) {
  try {
    const ref = collection(db, 'users', userId, 'blueprints');
    const q = query(ref, orderBy('savedAt', 'desc'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Could not load user blueprints:', err);
    return [];
  }
}
