// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpaHYyuR74rYAXjkpuzXyJcaVH9Ni_UYc",
  authDomain: "ujianberat-2a101.firebaseapp.com",
  projectId: "ujianberat-2a101",
  storageBucket: "ujianberat-2a101.firebasestorage.app",
  messagingSenderId: "100632361604",
  appId: "1:100632361604:web:57f2e62a9c339887b6e0d1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
