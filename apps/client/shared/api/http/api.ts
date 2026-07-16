import axios from 'axios';

import { env } from '@/shared/config';
import { getAuthToken } from '../auth';
import { toApiError } from './api-error';

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
    const apiError = toApiError(error.response?.data);

    if (apiError) {
      return Promise.reject(apiError);
    }
  }

  return Promise.reject(error);
});
