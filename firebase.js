// Firebase core imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (from Nakul)
const firebaseConfig = {
  apiKey: "AIzaSyABBlqXZtpYAhdsdCcB96pfQ0_77ASzCeg",
  authDomain: "roommate-sync-e8a32.firebaseapp.com",
  projectId: "roommate-sync-e8a32",
  storageBucket: "roommate-sync-e8a32.firebasestorage.app",
  messagingSenderId: "553409019094",
  appId: "1:553409019094:web:7062426a48cd5c47ad1d77"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
