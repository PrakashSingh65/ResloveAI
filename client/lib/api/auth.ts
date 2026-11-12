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

export interface GoogleSyncPayload {
  session_token?: string
  email?: string
  name?: string
}

export const NEON_AUTH_URL = (
  process.env.NEXT_PUBLIC_NEON_AUTH_URL || "https://auth.neon.tech"
).replace(/\/$/, "")

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("resolve-auth-change"))
  }
}

export const authApi = {
  /**
   * Register a new user
   * POST /auth/register
   * Cookies are automatically set by backend via Set-Cookie (HttpOnly)
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
   * Cookies are automatically set by backend via Set-Cookie (HttpOnly)
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
   * Rotates HttpOnly cookies transparently via browser
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
   * Get Google OAuth Initiate URL via Backend
   * GET /auth/google
   */
  async getGoogleAuthUrl(callbackUrl?: string): Promise<string> {
    const params = callbackUrl ? { callback_url: callbackUrl } : undefined
    const response = await apiClient.get<GoogleAuthUrlResponse>("/auth/google", { params })
    return response.data.url
  },

  /**
   * Initiate Google OAuth directly with Neon Managed Better Auth in the browser.
   * This ensures the browser receives and persists the '__Secure-neon-auth.session_challenge'
   * cookie on the Neon Auth domain, which is required to complete the OAuth handshake.
   */
  async initiateGoogleOAuth(callbackUrl?: string): Promise<string> {
    const targetCallback =
      callbackUrl ||
      (typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined)

    try {
      const response = await fetch(`${NEON_AUTH_URL}/sign-in/social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          callbackURL: targetCallback,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data?.url) {
          return data.url
        }
      }
    } catch (e) {
      console.warn("Direct Neon Auth call failed, falling back to backend route:", e)
    }

    // Fallback to backend route if direct client call encounters any issue
    return this.getGoogleAuthUrl(targetCallback)
  },

  /**
   * Resolve session from Neon Auth using session verifier and browser challenge cookies
   */
  async getNeonSession(sessionVerifier?: string): Promise<{
    user?: { id?: string; name?: string; email?: string; image?: string }
    session?: { token?: string }
  } | null> {
    try {
      const url = sessionVerifier
        ? `${NEON_AUTH_URL}/get-session?neon_auth_session_verifier=${encodeURIComponent(sessionVerifier)}`
        : `${NEON_AUTH_URL}/get-session`

      let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const text = await response.text()
        if (text && text !== "null") {
          return JSON.parse(text)
        }
      }

      // If verifier was already consumed, try plain /get-session with browser cookies
      if (sessionVerifier) {
        response = await fetch(`${NEON_AUTH_URL}/get-session`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const text = await response.text()
          if (text && text !== "null") {
            return JSON.parse(text)
          }
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve session from Neon Auth directly:", e)
    }
    return null
  },

  /**
   * Synchronize Google session token with ResolveAI backend
   * POST /auth/google/sync
   */
  async syncGoogleSession(payload?: string | GoogleSyncPayload): Promise<AuthResponse> {
    const body: GoogleSyncPayload =
      typeof payload === "string" ? { session_token: payload } : payload || {}

    const response = await apiClient.post<AuthResponse>("/auth/google/sync", body)
    if (response.data?.user && typeof window !== "undefined") {
      localStorage.setItem("resolve_user", JSON.stringify(response.data.user))
      notifyAuthChange()
    }
    return response.data
  },
}

export default authApi
