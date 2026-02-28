import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;

              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, { params });
  }

  async post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post(url, data);
  }

  async put<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put(url, data);
  }

  async patch<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data);
  }

  async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete(url);
  }

  async upload<T = any>(url: string, formData: FormData): Promise<AxiosResponse<T>> {
    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const api = new ApiClient();

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    validate: '/auth/validate',
  },
  // Users
  users: {
    profile: '/users/profile',
    dashboard: '/users/dashboard',
    update: (id: string) => `/users/${id}`,
  },
  // Courses
  courses: {
    list: '/courses',
    popular: '/courses/popular',
    recommended: '/courses/recommended',
    detail: (id: string) => `/courses/${id}`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
    publish: (id: string) => `/courses/${id}/publish`,
    enroll: (id: string) => `/courses/${id}/enroll`,
    modules: (id: string) => `/courses/${id}/modules`,
    instructor: (id: string) => `/courses/instructor/${id}`,
  },
  // Modules
  modules: {
    lessons: (id: string) => `/modules/${id}/lessons`,
    create: (courseId: string) => `/courses/${courseId}/modules`,
  },
  // Lessons
  lessons: {
    detail: (id: string) => `/lessons/${id}`,
    create: (moduleId: string) => `/modules/${moduleId}/lessons`,
  },
  // Enrollments
  enrollments: {
    list: '/enrollments',
    progress: (id: string) => `/enrollments/${id}/progress`,
  },
  // Payments
  payments: {
    create: '/payments',
    list: '/payments',
    detail: (id: string) => `/payments/${id}`,
    stats: '/payments/stats',
    refund: (id: string) => `/payments/${id}/refund`,
    mpesa: {
      process: '/payments/mpesa/process',
    },
  },
  // Certificates
  certificates: {
    list: '/certificates',
    detail: (id: string) => `/certificates/${id}`,
    download: (id: string) => `/certificates/${id}/download`,
    course: (enrollmentId: string) => `/certificates/course/${enrollmentId}`,
    module: (moduleId: string) => `/certificates/module/${moduleId}`,
    revoke: (id: string) => `/certificates/${id}/revoke`,
    verify: (code: string) => `/verify/${code}`,
  },
  // Upload
  upload: '/upload',
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.details) {
    return error.response.data.details;
  }

  if (error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};

// Success handling utilities
export const handleApiSuccess = (response: any) => {
  return response.data?.data || response.data;
};
