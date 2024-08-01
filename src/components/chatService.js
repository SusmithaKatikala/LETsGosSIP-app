// chatService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchChatMessages = () => {
    return axios.get(`${API_URL}/chat-messages/`);
};

export const createChatMessage = (messageData) => {
    return axios.post(`${API_URL}/chat-messages/`, messageData);
};
