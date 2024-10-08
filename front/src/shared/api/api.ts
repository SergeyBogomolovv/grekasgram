import { API_URL } from '@/shared/constants';
import axios from 'axios';

export const $api = axios.create({ baseURL: API_URL, withCredentials: true });
