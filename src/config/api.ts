// API configuration with environment-based base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  CREATE_SUBSCRIPTION: `${API_BASE_URL}/api/create-subscription`,
  COMPLETE_SUBSCRIPTION: `${API_BASE_URL}/api/complete-subscription`,
  REFRESH_SUBSCRIPTION: `${API_BASE_URL}/api/refresh-subscription`,
  CREATE_SETUP_INTENT: `${API_BASE_URL}/api/create-setup-intent`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/api/cancel-subscription`,
  STRIPE_WEBHOOK: `${API_BASE_URL}/api/stripe-webhook`,
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(endpoint, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
