import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL;

//axios automatically detects the error and throws it by status code(!2xx), so we don't need to handle it in the catch block

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
export const getSubmissionsByProblemByUser = async (problemTitle) => {
  const response = await api.get(`/submissions/problem/${problemTitle}`);
  return response;
};
export const getHomeProblems = async () => {
  const response = await api.get('/homeproblem');
  return response;
};
export const uploadProblem = async (data) => {
  const response = await api.post('/upload', data);
  return response;
};
export const updateProblem = async (id, data) => {
  const response = await api.put(`/problems/${id}`, data);
  return response;
};
export const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response;
};

export const runCode = async (data) => {
  const response = await api.post('/run', data);
  return response;
};
export const runCodeCompiler = async (data) => {
  const response = await api.post('/run/compiler', data);
  return response;
};
export const submitCode = async (data) => {
  const response = await api.post('/submit', data);
  return response;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response;
};

export const getProfile = async () => {
  try{
    const response = await api.get('/profile');
    return response;
  }catch(error){
    if(error.response.status == 401){
      return null; 
    }
    return error.response;
  }
};
export const getAiReview = async (data) => {
  const response = await api.post('/ai-review', data);
  return response;
};
export const getReviewCode = async (data) => {
  const response = await api.post('/review', data);
  return response;
};
export const updateProfile = async (data) => {
  const response = await api.put('/profile/update', data);
  return response;
};

export const deleteAccount = async () => {
  const response = await api.delete('/profile/delete');
  return response;
};

export const getSubmissions = async () => {
  const response = await api.get('/submissions');
  return response;
};
export const getAllSubmissions = async () => {
  
    const response = await api.get('/submissions/all');
    return response;
 
  
};
export const getUsers = async () => {
  const response = await api.get('/users');
  return response;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response;
};

export const sendMessage = async (data) => {
  const response = await api.post('/message', data);
  return response;
};

export const sendOTP = async (data) => {
  const response = await api.post('/password/forgot', data);
  console.log(response)
  return response;
};
export const resetPassword = async (data) => {
  const response = await api.post('/password/reset', data);
  return response;
};

export const getSubmissionStatus = async (submissionId) => {
  const response = await api.get(`/submissions/status/${submissionId}`);
  return response;
};