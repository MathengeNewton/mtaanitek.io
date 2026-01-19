import axios from 'axios';

/**
 * API Configuration
 * Backend API base URL - can be overridden with NEXT_PUBLIC_API_URL environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const apiClient = {
  health: {
    check: () => api.get('/health'),
  },
};

export default apiClient;

