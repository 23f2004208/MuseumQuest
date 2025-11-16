import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
    // Production (Render) - Parse JSON string
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        console.log('✅ Using Firebase credentials from environment variable');
    } catch (error) {
        console.error('❌ Failed to parse FIREBASE_CREDENTIALS:', error);
        throw new Error('Invalid FIREBASE_CREDENTIALS format');
    }
} else {
    // Local development - Import JSON file
    try {
        const module = await import('./serviceAccountKey.json', {
            assert: { type: 'json' }
        });
        serviceAccount = module.default;
        console.log('✅ Using Firebase credentials from local file');
    } catch (error) {
        console.error('❌ serviceAccountKey.json not found');
        throw new Error('No Firebase credentials available');
    }
}

// Initialize Firebase Admin with the service account
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'museum-quest-7e777'
    });
    console.log('✅ Firebase Admin initialized successfully');
}

export const db = admin.firestore();
export { admin };