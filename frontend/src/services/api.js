import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const museumsAPI = {
    getAll: async () => {
        const response = await axios.get(`${API_BASE}/museums`);
        return response.data;
    },
    getOne: async (id) => {
        const response = await axios.get(`${API_BASE}/museums/${id}`);
        return response.data;
    }
};

export const aiAPI = {
    askQuestion: async (museumName, museumDescription, question) => {
        const response = await axios.post(`${API_BASE}/ai/ask`, {
            museumName,
            museumDescription,
            question
        });
        return response.data;
    }
};

export const wolframAPI = {
    getContext: async (year) => {
        const response = await axios.get(`${API_BASE}/wolfram/context/${year}`);
        return response.data;
    }
};

export const leaderboardAPI = {
    getLeaderboard: async () => {
        const response = await axios.get(`${API_BASE}/leaderboard`);
        return response.data.leaderboard || [];
    }
};
