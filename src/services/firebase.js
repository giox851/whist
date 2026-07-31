import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDvI9sCayW6t-WIWZzMcr_Rwf4i0f8YgqA",
  authDomain: "whist-5cf2a.firebaseapp.com",
  projectId: "whist-5cf2a",
  storageBucket: "whist-5cf2a.firebasestorage.app",
  messagingSenderId: "253910325980",
  appId: "1:253910325980:web:f67e421e5af34c228fb219",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);