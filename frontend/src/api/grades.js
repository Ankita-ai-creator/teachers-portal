import axios from 'axios';

const api = axios.create({
  baseURL: '/api/grades',
});

export const submitGrade = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

export const submitBulkGrades = async (gradesArray) => {
  const response = await api.post('/bulk', { grades: gradesArray });
  return response.data;
};

export const updateGrade = async (id, data) => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

export const getGradesByStudent = async (studentId) => {
  const response = await api.get(`/student/${studentId}`);
  return response.data;
};

export const getGradesByAssignment = async (assignmentId) => {
  const response = await api.get(`/assignment/${assignmentId}`);
  return response.data;
};

export const getGradeAnalytics = async (className) => {
  const response = await api.get(`/analytics/${className}`);
  return response.data;
};
