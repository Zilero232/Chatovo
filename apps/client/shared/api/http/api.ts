import axios from 'axios';

import { env } from '@/shared/config';
import { getAuthToken } from '../auth';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { error?: string } | undefined)?.error;

    if (message) {
      return Promise.reject(new Error(message));
    }
  }

  return Promise.reject(error);
});
