import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2kTYKi-JwDxh7MH2Kdzp1blvWdvMb-4w",
  authDomain: "valentine-6ccc1.firebaseapp.com",
  projectId: "valentine-6ccc1",
  storageBucket: "valentine-6ccc1.appspot.com",
  messagingSenderId: "160547094369",
  appId: "1:160547094369:web:4171314829d38c8b5c4f20",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize other services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
