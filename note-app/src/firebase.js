
import { initializeApp } from "firebase/app";
import {collection , getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA48Iuvfjf0bCLNM6Oj6ZcSuDpvJsisMds",
  authDomain: "react-note-808a3.firebaseapp.com",
  projectId: "react-note-808a3",
  storageBucket: "react-note-808a3.firebasestorage.app",
  messagingSenderId: "1029514253136",
  appId: "1:1029514253136:web:b399cd75c268eded2ed255"
};

const app = initializeApp(firebaseConfig);
export  const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
