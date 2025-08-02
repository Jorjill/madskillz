// DEPRECATED: Use apiClient instead of getAuthHeaders
// This function is kept for backward compatibility but should be replaced with apiClient
export const getAuthHeaders = () => {
  const idToken = localStorage.getItem("idToken");
  if (!idToken) {
    throw new Error("No token found. User might not be authenticated.");
  }
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

// Export the new apiClient for modern usage
export { apiClient } from './apiClient';
