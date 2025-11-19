import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Django sunucunuzun adresi

export const getClients = () => {
  return axios.get(`${API_URL}clients/`);
};

// FONKSİYON 1
export const addClient = (clientData) => {
  return axios.post(`${API_URL}clients/`, clientData);
};

// FONKSİYON 2
export const assignStaffToClient = (clientId, userId) => {
  return axios.post(`${API_URL}clients/${clientId}/assign_staff/`, { user_id: userId });
};