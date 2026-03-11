// Firebase Configuration
// Initialize Firebase with your project credentials

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjvHUD8Tq9jUwBBBU0pUMd4NW2Cqz6Kg8",
  authDomain: "smtei-cavite-24534.firebaseapp.com",
  projectId: "smtei-cavite-24534",
  storageBucket: "smtei-cavite-24534.firebasestorage.app",
  messagingSenderId: "17437925207",
  appId: "1:17437925207:web:cf73f96235736a4524e812",
  measurementId: "G-PN4E4NCN1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
// Set up auth state persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail, reauthenticateWithCredential, EmailAuthProvider, collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot, ref, uploadBytes, getDownloadURL, deleteObject };


