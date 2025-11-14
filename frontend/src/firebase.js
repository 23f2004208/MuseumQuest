// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-aj8K4CT5GRQaxBKIoeZTN6eRiCHfZgY",
    authDomain: "museum-quest-7e777.firebaseapp.com",
    projectId: "museum-quest-7e777",
    storageBucket: "museum-quest-7e777.firebasestorage.app",
    messagingSenderId: "47982225742",
    appId: "1:47982225742:web:f8215c02dd01fd79a1161f",
    measurementId: "G-CXMC6CTDW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);