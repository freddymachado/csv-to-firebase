// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "process.env.YOUR_API_KEY",
  authDomain: "process.env.YOUR_AUTH_DOMAIN",
  projectId: "process.env.YOUR_PROJECT_ID",
  storageBucket: "process.env.YOUR_STORAGE_BUCKET",
  messagingSenderId: "process.env.YOUR_MESSAGING_SENDER_ID",
  appId: "process.env.YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};
