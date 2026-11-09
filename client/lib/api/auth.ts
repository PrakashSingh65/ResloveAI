import apiClient from "./axios"

export type GenderType = "male" | "female" | "other" | "prefer_not_to_say"

export interface UserRegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  date_of_birth?: string | null
  country?: string | null
  city?: string | null
  phone_no?: string | null
  gender?: GenderType | null
}

export interface UserLoginPayload {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  date_of_birth?: string | null
  country?: string | null
  city?: string | null
  phone_no?: string | null
  gender?: GenderType | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  message: string
  user: UserProfile
  access_token?: string
  refresh_token?: string
}

export interface MessageResponse {
  message: string
  detail?: string
}

export interface GoogleAuthUrlResponse {
  url: string
}

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("resolve-auth-change"))
  }
}

export const authApi = {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(payload: UserRegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", payload)
    if (response.data?.user && typeof window !== "undefined") {
      localStorage.setItem("resolve_user", JSON.stringify(response.data.user))
      notifyAuthChange()
    }
    return response.data
  },

  /**
   * Log in user with credentials
   * POST /auth/login
   */
  async login(payload: UserLoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload)
    if (response.data?.user && typeof window !== "undefined") {
      localStorage.setItem("resolve_user", JSON.stringify(response.data.user))
      notifyAuthChange()
    }
    return response.data
  },

  /**
   * Fetch current authenticated user's profile
   * GET /auth/me
   */
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>("/auth/me")
    if (response.data && typeof window !== "undefined") {
      localStorage.setItem("resolve_user", JSON.stringify(response.data))
    }
    return response.data
  },

  /**
   * Refresh session tokens
   * POST /auth/refresh
   */
  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh")
    return response.data
  },

  /**
   * Log out current user & clear cookies
   * POST /auth/logout
   */
  async logout(): Promise<MessageResponse> {
    try {
      const response = await apiClient.post<MessageResponse>("/auth/logout")
      return response.data
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("resolve_access_token")
        localStorage.removeItem("resolve_user")
        notifyAuthChange()
      }
    }
  },

  /**
   * Change user password
   * POST /auth/change-password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },

  /**
   * Get Google OAuth Initiate URL
   * GET /auth/google
   */
  async getGoogleAuthUrl(callbackUrl?: string): Promise<string> {
    const params = callbackUrl ? { callback_url: callbackUrl } : undefined
    const response = await apiClient.get<GoogleAuthUrlResponse>("/auth/google", { params })
    return response.data.url
  },

  /**
   * Synchronize Google session token with backend
   * POST /auth/google/sync
   */
  async syncGoogleSession(sessionToken?: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/google/sync", {
      session_token: sessionToken,
    })
    if (response.data?.user && typeof window !== "undefined") {
      localStorage.setItem("resolve_user", JSON.stringify(response.data.user))
      notifyAuthChange()
    }
    return response.data
  },
}

export default authApi
