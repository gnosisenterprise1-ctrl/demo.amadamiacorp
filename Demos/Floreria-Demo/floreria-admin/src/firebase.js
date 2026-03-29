import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnZBqhlfqQSt9yAwGGAKurbxLDlfRVTvg",
  authDomain: "floreria-demo.firebaseapp.com",
  projectId: "floreria-demo",
  storageBucket: "floreria-demo.firebasestorage.app",
  messagingSenderId: "957331745649",
  appId: "1:957331745649:web:ddcfc34762a58509e3a4d0",
  measurementId: "G-92BX1WJ81F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
