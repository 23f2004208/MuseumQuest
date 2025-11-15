import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

// Redirect to login if not logged in
export function protectPage() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "login-page.html";
        }
    });
}

// Export Firebase services
export { app, auth, analytics, db };