import axiosClient from './axiosClient';

export const submitGrade = async (dataPayload) => {
  const response = await axiosClient.post('/grades', dataPayload);
  return response.data;
};

export const submitBulkGrades = async (gradesArray) => {
  const response = await axiosClient.post('/grades/bulk', { grades: gradesArray });
  return response.data;
};

export const updateGrade = async (id, dataPayload) => {
  const response = await axiosClient.put(`/grades/${id}`, dataPayload);
  return response.data;
};

export const getGradesByStudent = async (studentId) => {
  const response = await axiosClient.get(`/grades/student/${studentId}`);
  return response.data;
};

export const getGradesByAssignment = async (assignmentId) => {
  const response = await axiosClient.get(`/grades/assignment/${assignmentId}`);
  return response.data;
};

export const getGradeAnalytics = async (className) => {
  const response = await axiosClient.get(`/grades/analytics/${className}`);
  return response.data;
};
