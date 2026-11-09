"use client"

import * as React from "react"
import { authApi, UserProfile } from "@/lib/api"

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: UserProfile | null) => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const syncUserFromStorage = React.useCallback(() => {
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("resolve_user")
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile
        setUser(parsed)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  const refreshUser = React.useCallback(async () => {
    try {
      const profile = await authApi.getMe()
      setUser(profile)
      if (typeof window !== "undefined") {
        localStorage.setItem("resolve_user", JSON.stringify(profile))
      }
    } catch {
      // If getMe fails (e.g. cookies expired), clear local cache
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("resolve_user")
        localStorage.removeItem("resolve_access_token")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // 1. Instant hydration from localStorage to prevent visual flicker
    syncUserFromStorage()

    // 2. Verify live session with backend /auth/me
    refreshUser()

    // 3. Listen for cross-component or cross-tab authentication changes
    const handleAuthEvent = () => {
      syncUserFromStorage()
    }

    window.addEventListener("resolve-auth-change", handleAuthEvent)
    window.addEventListener("storage", handleAuthEvent)

    return () => {
      window.removeEventListener("resolve-auth-change", handleAuthEvent)
      window.removeEventListener("storage", handleAuthEvent)
    }
  }, [syncUserFromStorage, refreshUser])

  const logout = React.useCallback(async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("resolve_user")
        localStorage.removeItem("resolve_access_token")
        window.dispatchEvent(new Event("resolve-auth-change"))
      }
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
