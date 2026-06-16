import axios from 'axios';

const api = axios.create({
  baseURL: '/api/students',
});

export const getStudents = async (params) => {
  const { data } = await api.get('/', { params });
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createStudent = async (studentData) => {
  const { data } = await api.post('/', studentData);
  return data;
};

export const updateStudent = async (id, studentData) => {
  const { data } = await api.put(`/${id}`, studentData);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};

export const saveAttendance = async (attendanceRecords) => {
  const { data } = await api.post(`/attendance`, { attendanceRecords });
  return data;
};
