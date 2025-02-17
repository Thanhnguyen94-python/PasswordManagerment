// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1wdjpAy8HQa9rvu2P3drwghla6bQlQaw",
  authDomain: "passwordmanagerment.firebaseapp.com",
  projectId: "passwordmanagerment",
  storageBucket: "passwordmanagerment.firebasestorage.app",
  messagingSenderId: "630778787238",
  appId: "1:630778787238:web:0d1b279f51af6cdb5f0b67",
  measurementId: "G-W9PZBYBSK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
