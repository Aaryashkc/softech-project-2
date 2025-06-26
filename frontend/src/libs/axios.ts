import axios from 'axios';
import type { AxiosInstance } from 'axios';

const baseURL: string =
  import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : 'https://softech-project-2.onrender.com/api';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
