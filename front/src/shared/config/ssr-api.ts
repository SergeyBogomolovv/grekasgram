import { cookies } from 'next/headers';

import { API_URL } from '../constants';
import axios from 'axios';

const $ssrApi = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    Cookie: cookies().toString(),
  },
});

export default $ssrApi;
