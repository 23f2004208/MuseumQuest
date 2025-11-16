import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Get user progress data from Firestore
 * @param {string} userId - User's UUID
 * @returns {Promise<Object|null>} User progress data or null if not found
 */
export async function getUserProgress(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user progress:', error);
        throw error;
    }
}

/**
 * Initialize or update user progress in Firestore
 * @param {string} userId - User's UUID
 * @param {Object} progressData - Progress data to save
 * @returns {Promise<void>}
 */
export async function updateUserProgress(userId, progressData) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // Update existing user
            await updateDoc(userRef, {
                ...progressData,
                lastUpdated: serverTimestamp()
            });
        } else {
            // Create new user document
            await setDoc(userRef, {
                ...progressData,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error updating user progress:', error);
        throw error;
    }
}

/**
 * Award a stamp and update user progress
 * @param {string} userId - User's UUID
 * @param {string} stampType - Type of stamp (VISITED, QUIZ_PASSED, etc.)
 * @param {number} museumId - Museum ID
 * @param {number} xpGained - XP to add
 * @returns {Promise<Object>} Updated user progress
 */
export async function awardStamp(userId, stampType, museumId, xpGained) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        let currentData = {
            totalXP: 0,
            currentLevel: 'Tourist',
            stamps: [],
            visitedMuseums: []
        };

        if (userSnap.exists()) {
            const data = userSnap.data();
            currentData = {
                totalXP: data.totalXP || 0,
                currentLevel: data.currentLevel || 'Tourist',
                stamps: data.stamps || [],
                visitedMuseums: data.visitedMuseums || []
            };
        }

        // Check if stamp already exists
        const alreadyHasStamp = currentData.stamps.some(
            s => s.type === stampType && s.museumId === museumId
        );

        if (alreadyHasStamp) {
            return {
                success: false,
                message: 'Stamp already earned',
                ...currentData
            };
        }

        // Add new stamp
        const newStamp = {
            type: stampType,
            museumId,
            timestamp: new Date().toISOString()
        };

        // Update data
        const newXP = currentData.totalXP + xpGained;
        const newStamps = [...currentData.stamps, newStamp];

        // Update visited museums if not already included
        const visitedMuseums = [...currentData.visitedMuseums];
        if (!visitedMuseums.includes(museumId)) {
            visitedMuseums.push(museumId);
        }

        // Calculate level
        let newLevel = 'Tourist';
        if (newXP >= 200) newLevel = 'Museum Legend';
        else if (newXP >= 100) newLevel = 'Curator';
        else if (newXP >= 50) newLevel = 'Explorer';

        // Save to Firestore
        const progressData = {
            totalXP: newXP,
            currentLevel: newLevel,
            stamps: newStamps,
            visitedMuseums: visitedMuseums
        };

        await updateUserProgress(userId, progressData);

        return {
            success: true,
            xpGained,
            newXP,
            level: newLevel,
            ...progressData
        };
    } catch (error) {
        console.error('Error awarding stamp:', error);
        throw error;
    }
}

/**
 * Update user profile information
 * @param {string} userId - User's UUID
 * @param {Object} profileData - Profile data to update (username, email, etc.)
 * @returns {Promise<void>}
 */
export async function updateUserProfile(userId, profileData) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...profileData,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

/**
 * Delete user profile from Firestore
 * @param {string} userId - User's UUID
 * @returns {Promise<void>}
 */
export async function deleteUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);
    } catch (error) {
        console.error('Error deleting user profile:', error);
        throw error;
    }
}
