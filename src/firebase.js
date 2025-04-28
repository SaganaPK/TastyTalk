import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIKo9P8sSfLRsLWapduRq8Q2fPoC5y5_o",
  authDomain: "tastytalks-3a97d.firebaseapp.com",
  projectId: "tastytalks-3a97d",
  storageBucket: "tastytalks-3a97d.firebasestorage.app",
  messagingSenderId: "964685021756",
  appId: "1:964685021756:web:70e4eab478d70e66067939"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 