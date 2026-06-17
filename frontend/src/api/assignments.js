import axiosClient from './axiosClient';

export const getAssignments = async (params) => {
  const { data } = await axiosClient.get('/assignments', { params });
  return data;
};

export const getAssignmentById = async (id) => {
  const { data } = await axiosClient.get(`/assignments/${id}`);
  return data;
};

export const createAssignment = async (formData) => {
  const { data } = await axiosClient.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateAssignment = async (id, assignmentData) => {
  const { data } = await axiosClient.put(`/assignments/${id}`, assignmentData);
  return data;
};

export const deleteAssignment = async (id) => {
  const { data } = await axiosClient.delete(`/assignments/${id}`);
  return data;
};

export const markSubmission = async (id, studentId) => {
  const { data } = await axiosClient.post(`/assignments/${id}/submit`, { studentId });
  return data;
};

export const unmarkSubmission = async (id, studentId) => {
  const { data } = await axiosClient.delete(`/assignments/${id}/submit`, { data: { studentId } });
  return data;
};
