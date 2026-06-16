import axios from 'axios';

const api = axios.create({
  baseURL: '/api/assignments',
});

export const getAssignments = async (params) => {
  const { data } = await api.get('/', { params });
  return data;
};

export const getAssignmentById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createAssignment = async (formData) => {
  const { data } = await api.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateAssignment = async (id, formData) => {
  const { data } = await api.put(`/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteAssignment = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};

export const submitAssignment = async (id, studentId) => {
  const { data } = await api.post(`/${id}/submit`, { studentId });
  return data;
};

export const unmarkSubmission = async (id, studentId) => {
  // Keeping this for flexibility if we want to toggle back to pending
  const { data } = await api.delete(`/${id}/submit`, { data: { studentId } });
  return data;
};
