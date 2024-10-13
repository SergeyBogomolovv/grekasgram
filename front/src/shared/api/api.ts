import { API_URL } from '@/shared/constants';
import axios from 'axios';
import {
  deleteAccessToken,
  getAccessToken,
  setAccessToken,
} from '../lib/utils';

export const $api = axios.create({ baseURL: API_URL, withCredentials: true });

$api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await $api.get('/auth/refresh');

        if (data.accessToken) {
          await setAccessToken(data.accessToken);
        } else {
          await deleteAccessToken();
          return Promise.reject(error);
        }

        return $api.request(originalRequest);
      } catch (error) {
        await deleteAccessToken();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
