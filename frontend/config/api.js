// API Configuration
const API_CONFIG = {
  // Base URL for the backend API
  // Use machine IP address instead of localhost for React Native/Expo development
  BASE_URL: 'http://192.168.0.185:5000/api',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Donor endpoints
  DONORS: `${API_CONFIG.BASE_URL}/donors`,
  DONOR_BY_ID: (id) => `${API_CONFIG.BASE_URL}/donors/${id}`,
  
  // Location endpoints
  DIVISIONS: `${API_CONFIG.BASE_URL}/divisions`,
  ZILAS: (divisionId) => `${API_CONFIG.BASE_URL}/zilas/${divisionId}`,
  UPAZILAS: (zilaId) => `${API_CONFIG.BASE_URL}/upazilas/${zilaId}`,
  
  // Health check
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

// Enhanced fetch function with error handling and timeout
export const apiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection');
    }
    
    if (error.message.includes('Network request failed')) {
      throw new Error('Network error - please check if the server is running');
    }
    
    throw error;
  }
};

export default API_CONFIG;
