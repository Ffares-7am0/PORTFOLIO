// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBih9O3WtR8xXFFbdlQMVi_PL1fp_qQT9U",
    authDomain: "portofolio-3a906.firebaseapp.com",
    projectId: "portofolio-3a906",
    storageBucket: "portofolio-3a906.firebasestorage.app",
    messagingSenderId: "1012842887273",
    appId: "1:1012842887273:web:525b4ff3600db39a370af8",
    measurementId: "G-3V89H1JHM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
