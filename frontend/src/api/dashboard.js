import axios from 'axios';

const api = axios.create({
  baseURL: '/api/dashboard',
});

export const getDashboardStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};
