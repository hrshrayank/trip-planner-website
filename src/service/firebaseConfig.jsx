// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
  authDomain: "mini-project-63b10.firebaseapp.com",
  projectId: "mini-project-63b10",
  storageBucket: "mini-project-63b10.appspot.com",
  messagingSenderId: "651692262511",
  appId: "1:651692262511:web:2b7f7b05410961df16799a",
  measurementId: "G-TPPNY3SDBV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// const analytics = getAnalytics(app);