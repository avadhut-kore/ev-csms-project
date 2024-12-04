import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // Base URL for your API
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  const currentRefreshToken = localStorage.getItem('refreshToken');
  
  if (currentRefreshToken) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        refreshToken: currentRefreshToken,
      });

      const { token, refreshToken, expiresIn } = response.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      const expiryDate = new Date(Date.now() + expiresIn);
      localStorage.setItem('expiryDate', expiryDate.toISOString());

      return token;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      // Handle refresh token failure, e.g., prompt login
      return null;
    }
  }
  return null;
};

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    const expiryDate = localStorage.getItem('expiryDate');
    
    if (token && expiryDate) {
      const now = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();

      // Check if the token is expired or close to expiration
      if (now >= expiry) {
        // Token is expired, attempt to refresh
        token = await refreshAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Refresh token failed, you may want to handle this case
          return Promise.reject('Unable to refresh access token');
        }
      } else {
        // Token is still valid, include it in the headers
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
