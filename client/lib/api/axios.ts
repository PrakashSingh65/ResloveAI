import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"

// Backend Server Root URL (FastAPI)
export const BACKEND_ROOT_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
).replace(/\/$/, "")

// Backend API v1 Base Route matching FastAPI prefix "/api/v1"
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || `${BACKEND_ROOT_URL}/api/v1`
).replace(/\/$/, "")

// Exact API Routes matching the FastAPI server routers
export const API_ROUTES = {
  HEALTH: `${BACKEND_ROOT_URL}/health`,
  ROOT: `${BACKEND_ROOT_URL}/`,
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    GOOGLE: `${API_BASE_URL}/auth/google`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/auth/google/callback`,
    GOOGLE_SYNC: `${API_BASE_URL}/auth/google/sync`,
  },
  TICKETS: {
    LIST: `${API_BASE_URL}/tickets`,
    METRICS: `${API_BASE_URL}/tickets/metrics`,
    DETAIL: (id: string) => `${API_BASE_URL}/tickets/${id}`,
    MESSAGES: (id: string) => `${API_BASE_URL}/tickets/${id}/messages`,
    RESOLVE: (id: string) => `${API_BASE_URL}/tickets/${id}/resolve`,
    FEEDBACK: (id: string) => `${API_BASE_URL}/tickets/${id}/feedback`,
    SEED: `${API_BASE_URL}/tickets/seed-sample`,
  },
  KNOWLEDGE: {
    DOCUMENTS: `${API_BASE_URL}/knowledge/documents`,
    DETAIL: (id: string) => `${API_BASE_URL}/knowledge/documents/${id}`,
    QUERY: `${API_BASE_URL}/knowledge/query`,
    SEED: `${API_BASE_URL}/knowledge/seed`,
  },
} as const

// Create standard Axios instance configured for FastAPI backend
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables cross-origin HttpOnly cookies (access_token & refresh_token)
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request Interceptor: Attach bearer token fallback if present in localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("resolve_access_token")
      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Manage token storage & auto-refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => {
    // If auth response returns access_token, sync to localStorage as client fallback
    if (response?.data?.access_token && typeof window !== "undefined") {
      localStorage.setItem("resolve_access_token", response.data.access_token)
    }
    return response
  },
  async (error: AxiosError<{ detail?: string | Array<{ msg: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Skip retry for auth endpoints to prevent infinite loops or misleading errors on auth failure
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/google")

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await apiClient.post("/auth/refresh")
        if (refreshResponse?.data?.access_token && typeof window !== "undefined") {
          localStorage.setItem("resolve_access_token", refreshResponse.data.access_token)
        }
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr)
        if (typeof window !== "undefined") {
          localStorage.removeItem("resolve_access_token")
          localStorage.removeItem("resolve_user")
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Helper to parse backend error details from FastAPI / Pydantic
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (!data) {
      if (error.message === "Network Error") {
        return "Unable to connect to the backend server. Please check your connection."
      }
      return error.message || "An unexpected error occurred."
    }

    // FastAPI returns detail as string or list of validation errors
    if (typeof data.detail === "string") {
      return data.detail
    }

    if (Array.isArray(data.detail) && data.detail.length > 0) {
      return data.detail
        .map((err: { msg?: string; [key: string]: unknown }) => err.msg || JSON.stringify(err))
        .join(", ")
    }

    if (data.message && typeof data.message === "string") {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}

export default apiClient
