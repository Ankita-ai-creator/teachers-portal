import axiosClient from './axiosClient';

export const getStudents = async (params) => {
  const { data } = await axiosClient.get('/students', { params });
  return data;
};

export const getStudentById = async (id) => {
  const { data } = await axiosClient.get(`/students/${id}`);
  return data;
};

export const createStudent = async (studentData) => {
  const { data } = await axiosClient.post('/students', studentData);
  return data;
};

export const updateStudent = async (id, studentData) => {
  const { data } = await axiosClient.put(`/students/${id}`, studentData);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await axiosClient.delete(`/students/${id}`);
  return data;
};

export const saveAttendance = async (attendanceRecords) => {
  const { data } = await axiosClient.post('/students/attendance', { attendanceRecords });
  return data;
};
