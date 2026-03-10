// Firebase Configuration
// Initialize Firebase with your project credentials

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbc737DcuEEz8D2y29uDjaTubq-zUXbmU",
  authDomain: "smtei-cavite.firebaseapp.com",
  projectId: "smtei-cavite",
  storageBucket: "smtei-cavite.firebasestorage.app",
  messagingSenderId: "171203704758",
  appId: "1:171203704758:web:91d8e88e23f7a2055bf317"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set up auth state persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateEmail, reauthenticateWithCredential, EmailAuthProvider, collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot, ref, uploadBytes, getDownloadURL, deleteObject };
