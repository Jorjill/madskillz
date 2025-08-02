import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '../firebaseConfig';
import { isOfflineMode } from './offlineMode';

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    // Request interceptor to add auth headers
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh on 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              // Process all queued requests with new token
              this.processQueue(null, newToken);
              
              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            // If refresh fails, redirect to login or handle as needed
            console.error('Token refresh failed:', refreshError);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async getValidToken(): Promise<string | null> {
    if (isOfflineMode()) {
      return 'offline-token';
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    try {
      // Get token and check if it's still valid (not expired)
      const token = await currentUser.getIdToken(false); // Don't force refresh initially
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (isOfflineMode()) {
      return 'offline-token';
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Force token refresh
      const newToken = await currentUser.getIdToken(true);
      
      // Update localStorage
      localStorage.setItem('idToken', newToken);
      
      console.log('Token refreshed successfully');
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      localStorage.removeItem('idToken');
      throw error;
    }
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  private handleAuthFailure() {
    // Clear stored token
    localStorage.removeItem('idToken');
    
    // You can add additional logic here like:
    // - Redirect to login page
    // - Show authentication error message
    // - Dispatch logout action
    console.warn('Authentication failed. User may need to re-login.');
  }

  // Public methods for making API calls
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch(url, data, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
