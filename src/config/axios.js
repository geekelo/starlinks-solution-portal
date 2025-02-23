import axios from 'axios';

export const API_BASE_URL = process.env.API_BASE_URL;

// Create axios instance with default config
export const createAxiosInstance = () => {
  return axios.create({
    baseURL: 'https://starlinks-solution-api.onrender.com',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}; 