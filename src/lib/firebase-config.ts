import { getApp, getApps, initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp =
   getApps().length > 0
      ? getApp()
      : initializeApp({
         apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
         authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
         appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
         storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
         messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      });


export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
