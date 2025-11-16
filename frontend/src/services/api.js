import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const API_URL = import.meta.env.PROD
    ? 'https://museumquest-backend.onrender.com/api'
    : 'http://localhost:5000/api';

// Use API_URL for all requests instead of API_BASE
const baseURL = API_URL;

export const museumsAPI = {
    getAll: async () => {
        const response = await axios.get(`${baseURL}/museums`);
        return response.data;
    },
    getOne: async (id) => {
        const response = await axios.get(`${baseURL}/museums/${id}`);
        return response.data;
    }
};

export const quizAPI = {
    // Get quiz questions for a specific museum (without correct answers)
    getQuiz: async (museumId) => {
        const response = await axios.get(`${baseURL}/quiz/${museumId}`);
        return response.data;
    },
    // Submit quiz answers for checking
    checkAnswers: async (museumId, answers) => {
        const response = await axios.post(`${baseURL}/quiz/check`, {
            museumId,
            answers
        });
        return response.data;
    }
};

export const passportAPI = {
    // Get user's passport data
    getPassport: async (userId) => {
        const response = await axios.get(`${baseURL}/passport/${userId}`);
        return response.data;
    },
    // Award a stamp (VISITED, QUIZ_PASSED, etc.)
    awardStamp: async (userId, stampType, museumId, username = null) => {
        const response = await axios.post(`${baseURL}/passport/stamp`, {
            userId,
            stampType,
            museumId,
            username
        });
        return response.data;
    },
    // Award quiz completion stamp
    completeQuiz: async (userId, museumId, score) => {
        const response = await axios.post(`${baseURL}/passport/quiz`, {
            userId,
            museumId,
            score
        });
        return response.data;
    }
};

export const leaderboardAPI = {
    getLeaderboard: async () => {
        const response = await axios.get(`${baseURL}/leaderboard`);
        return response.data.leaderboard || [];
    }
};

export const aiAPI = {
    // Ask AI chatbot a question about a museum
    askQuestion: async (museumName, museumDescription, question) => {
        const response = await axios.post(`${baseURL}/ai/ask`, {
            museumName,
            museumDescription,
            question
        });
        return response.data;
    },
    // List available AI models
    listModels: async () => {
        const response = await axios.get(`${baseURL}/models/list`);
        return response.data;
    }
};

export const wolframAPI = {
    // Get historical context for a year
    getContext: async (year) => {
        const response = await axios.get(`${baseURL}/wolfram/context/${year}`);
        return response.data;
    }
};

export const healthAPI = {
    // Check API health status
    check: async () => {
        const response = await axios.get(`${baseURL}/health`);
        return response.data;
    }
};

// Legacy auth API (keeping for backward compatibility)
export const authAPI = {
    login: async (email, password) => {
        const response = await axios.post(`${baseURL}/auth/login`, { email, password });
        return response.data;
    },
    register: async (email, password) => {
        const response = await axios.post(`${baseURL}/auth/register`, { email, password });
        return response.data;
    }
};

// Legacy user API (keeping for backward compatibility)
export const userAPI = {
    getUser: async (userId) => {
        const response = await axios.get(`${baseURL}/user/${userId}`);
        return response.data;
    }
};

export default {
    museumsAPI,
    quizAPI,
    passportAPI,
    leaderboardAPI,
    aiAPI,
    wolframAPI,
    healthAPI,
    authAPI,
    userAPI
};
