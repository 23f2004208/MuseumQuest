import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
// Using the same project ID as the frontend
const projectId = 'museum-quest-7e777';

if (!admin.apps.length) {
    // For local development, you have two options:
    // Option 1: Set GOOGLE_APPLICATION_CREDENTIALS env var to path of service account JSON
    // Option 2: Use service account directly from env (for demo/testing only)
    
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccount) {
        // Service account provided as JSON string in env var
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
            projectId: projectId
        });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Service account JSON file path set in env
        admin.initializeApp({
            projectId: projectId
        });
    } else {
        // For demo mode without credentials - uses emulator or throws error
        console.warn('⚠️  No Firebase credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT env variable.');
        console.warn('⚠️  Initializing without credentials (this will only work with Firebase Emulator)');
        admin.initializeApp({
            projectId: projectId
        });
    }
}

const db = admin.firestore();

export { db, admin };
