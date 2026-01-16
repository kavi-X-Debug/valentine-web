import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function ensureUserDoc(user, extra = {}) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...extra
      });
    } else {
      await updateDoc(userRef, {
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        lastLoginAt: serverTimestamp(),
        ...extra
      });
    }
  }

  function signup(email, password, extra) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
      if (extra?.displayName) {
        try {
          await updateProfile(cred.user, { displayName: extra.displayName });
        } catch {}
      }
      await ensureUserDoc(cred.user, extra);
      return cred;
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(async (cred) => {
      await ensureUserDoc(cred.user);
      return cred;
    });
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider).then(async (cred) => {
      await ensureUserDoc(cred.user);
      return cred;
    });
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function getSignInMethods(email) {
    return fetchSignInMethodsForEmail(auth, email);
  }

  async function changeEmail(newEmail, currentPassword) {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No logged in email user');
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    await ensureUserDoc(user, { email: newEmail });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    getSignInMethods,
    changeEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
