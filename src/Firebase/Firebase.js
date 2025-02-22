// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLXgKrqxUAOqYARaN24Gpy1fxyiUft4Zg",
  authDomain: "assignment-dacb9.firebaseapp.com",
  projectId: "assignment-dacb9",
  storageBucket: "assignment-dacb9.firebasestorage.app",
  messagingSenderId: "370659151621",
  appId: "1:370659151621:web:8c78388db8276de9ac716c",
  measurementId: "G-80C9SVRDDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);