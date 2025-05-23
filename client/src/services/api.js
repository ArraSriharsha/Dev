import axios from 'axios';

const API_URL = 'http://localhost:5009/';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // This is important for cookies
});

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response;
};

export const signin = async (userData) => {
  const response = await api.post('/signin', userData);
  return response;
};

export const getProblems = async (params = {}) => {
  const response = await api.get('/problems', { params });
  return response;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response;
};