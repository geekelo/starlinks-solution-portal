import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

// Create axios instance with default config
export const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL|| 'https://starlinks-solution-api-rwdl.onrender.com',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
}; 