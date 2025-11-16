import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    // Local development - Read JSON file synchronously
    try {
        const filePath = join(__dirname, 'serviceAccountKey.json');
        const fileContent = readFileSync(filePath, 'utf8');
        serviceAccount = JSON.parse(fileContent);
        console.log('✅ Using Firebase credentials from local file');
    } catch (error) {
        console.error('❌ serviceAccountKey.json not found or invalid:', error.message);
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