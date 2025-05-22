import axios from 'axios';

const API_URL = 'http://localhost:5009/';

export const api = axios.create({
  baseURL: API_URL,
});

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response;
};

export const signin = async (userData) => {
  const response = await api.post('/signin', userData);
  return response;
};