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
import emailjs from '@emailjs/browser';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  function sendWelcomeEmail(user) {
    console.log('sendWelcomeEmail called with user:', user);
    if (!user || !user.email) {
      console.log('sendWelcomeEmail: no user or email, skipping');
      return Promise.resolve();
    }

    const name =
      user.displayName ||
      (user.email ? user.email.split('@')[0] : '') ||
      'there';

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = 'GNdiN4DMl_vTXQ7iE';

    console.log('sendWelcomeEmail config:', {
      serviceId,
      templateId,
      hasPublicKey: !!publicKey
    });

    if (!serviceId || !templateId || !publicKey) {
      console.log('sendWelcomeEmail: missing EmailJS config, not sending');
      return Promise.resolve();
    }

    const messageBody = `Hi ${name},

Welcome to LoveCraft – we’re so happy you’re here! 💖

Your account has been created successfully, which means you’re now ready to:
- Discover romantic gifts in our Valentine collections
- Save your favorite items to your wishlist
- Track your orders and delivery updates in one place

Whenever you’re ready to surprise someone special, just log in and we’ll help you pick
the perfect colors and gifts for your moment.

With warm colors and kind wishes,
LoveCraft Team`;

    const emailParams = {
      order_id: 'WELCOME',
      to_name: name,
      to_email: user.email,
      message: messageBody,
      reply_to: 'support@lovecraft.com'
    };

    console.log('sendWelcomeEmail params:', emailParams);

    return emailjs
      .send(serviceId, templateId, emailParams, publicKey)
      .then(result => {
        console.log('sendWelcomeEmail success:', result.status, result.text);
        return result;
      })
      .catch(error => {
        console.error('sendWelcomeEmail failed:', error);
        throw error;
      });
  }

  async function sendWelcomeAndMark(userRef, user) {
    try {
      await sendWelcomeEmail(user);
      await updateDoc(userRef, { welcomeSent: true });
    } catch (err) {
      console.error('Failed to send welcome email', err);
    }
  }

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
        welcomeSent: false,
        ...extra
      });
      await sendWelcomeAndMark(userRef, user);
    } else {
      const data = snap.data() || {};
      await updateDoc(userRef, {
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        lastLoginAt: serverTimestamp(),
        ...extra
      });
      if (!data.welcomeSent) {
        await sendWelcomeAndMark(userRef, user);
      }
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setIsAdmin(!!data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    getSignInMethods,
    sendWelcomeEmail,
    changeEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
