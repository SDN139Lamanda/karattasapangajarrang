// firebase-config.js
// ⚡ Konfigurasi untuk Firebase Realtime Database

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase Project Anda
const firebaseConfig = {
  apiKey: "AIzaSyDpaHYyuR74rYAXjkpuzXyJcaVH9Ni_UYc",
  authDomain: "ujianberat-2a101.firebaseapp.com",
  databaseURL: "https://ujianberat-2a101-default-rtdb.asia-southeast1.firebasedatabase.app/", // ⚠️ Wajib ada untuk Realtime DB
  projectId: "ujianberat-2a101",
  storageBucket: "ujianberat-2a101.firebasestorage.app",
  messagingSenderId: "100632361604",
  appId: "1:100632361604:web:57f2e62a9c339887b6e0d1"
};

// Inisialisasi App
const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
const db = getDatabase(app);

export { app, db };
