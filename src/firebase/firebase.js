// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// --- 🌟 INI YANG HILANG 🌟 ---
// Tambahkan 'getFirestore' dari 'firebase/firestore'
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMmoV6RvT9BU8EFi7oGyOp2PZIJjnfnv8",
  authDomain: "adminsso-45cf6.firebaseapp.com",
  projectId: "adminsso-45cf6",
  storageBucket: "adminsso-45cf6.firebasestorage.app",
  messagingSenderId: "683813724149",
  appId: "1:683813724149:web:0f2f6472584ef686154abc",
  measurementId: "G-1TNXZ2G051"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- 🌟 SEKARANG BARIS INI AKAN BERFUNGSI 🌟 ---
// Karena 'getFirestore' sudah di-import
export const db = getFirestore(app);

// Baris ini tidak apa-apa, tapi ini yang diblokir Ad Blocker Anda
// (Tidak masalah, aplikasi tetap jalan)
const analytics = getAnalytics(app);