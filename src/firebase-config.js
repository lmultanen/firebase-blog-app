import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxvximg9i-4AN2GRtwOKeThT8pJVkTwsM",
  authDomain: "testblog-8ffb4.firebaseapp.com",
  projectId: "testblog-8ffb4",
  storageBucket: "testblog-8ffb4.appspot.com",
  messagingSenderId: "601943810600",
  appId: "1:601943810600:web:6e1324b32b820eebc38b1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();