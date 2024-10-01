export const WS_URL = 'http://localhost:4000';
export const API_URL = 'http://localhost:4000';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const PUBLIC_ROUTES = ['/login', '/register', '/confirm-email'];
export const NOT_AUTHETICATED_REDIRECT_URL = '/login';
export const AUTHETICATED_REDIRECT_URL = '/';
