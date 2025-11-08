// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqMDX1ctMoZf3W_gWOHLEZOzz6HA_Afq0",
  authDomain: "healthsync-7abff.firebaseapp.com",
  projectId: "healthsync-7abff",
  storageBucket: "healthsync-7abff.firebasestorage.app",
  messagingSenderId: "36951184921",
  appId: "1:36951184921:web:a221d6ce4ce36ede44bc88",
  measurementId: "G-91C4W2D7HB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

