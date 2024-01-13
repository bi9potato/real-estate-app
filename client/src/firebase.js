// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-d4816.firebaseapp.com",
  projectId: "real-estate-d4816",
  storageBucket: "real-estate-d4816.appspot.com",
  messagingSenderId: "827048198147",
  appId: "1:827048198147:web:6351c3afc394bcdbe74e36"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);