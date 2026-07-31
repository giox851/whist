import { initializeApp } from "firebase/app";
2
import { getFirestore } from "firebase/firestore";
3
 
4
const firebaseConfig = {
5
apiKey: "AIzaSyDvI9sCayW6t-WIWZzMcr_Rwf4i0f8YgqA",
6
authDomain: "whist-5cf2a.firebaseapp.com",
7
projectId: "whist-5cf2a",
8
storageBucket: "whist-5cf2a.firebasestorage.app",
9
messagingSenderId: "253910325980",
10
appId: "1:253910325980:web:f67e421e5af34c228fb219"
11
};
12
 
13
const app = initializeApp(firebaseConfig);
14
 
15
export const db = getFirestore(app);