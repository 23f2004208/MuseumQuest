import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Get credentials from environment or local file
const serviceAccount = process.env.FIREBASE_CREDENTIALS
    ? JSON.parse(process.env.FIREBASE_CREDENTIALS)
    : await import('./firebase-admin-sdk.json', { assert: { type: 'json' } }).then(m => m.default);

// Initialize Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'museum-quest-7e777'
    });
}

export const db = admin.firestore();
export { admin };