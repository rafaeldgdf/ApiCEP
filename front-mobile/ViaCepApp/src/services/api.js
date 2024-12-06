import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080', // Altere para a URL do seu backend
});

export default api;
