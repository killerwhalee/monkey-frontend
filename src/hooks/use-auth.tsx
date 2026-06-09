import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { ApiError, api } from '@/lib/api-client'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAccessTokenValid,
  setTokens,
} from '@/lib/auth'
import type { TokenObtainResponse } from '@/types/api'

const ADMIN_PROBE_KEY = ['auth', 'admin-probe']

interface AuthContextValue {
  isAuthenticated: boolean
  isAdmin: boolean
  isAdminChecked: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function probeIsAdmin(): Promise<boolean> {
  try {
    await api.get('/kis-access-tokens/')
    return true
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return false
    }
    throw error
  }
}

function hasUsableSession(): boolean {
  const access = getAccessToken()
  if (access && isAccessTokenValid(access)) return true
  return Boolean(getRefreshToken())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(hasUsableSession)

  // simplejwt's access-token payload doesn't carry `is_staff`, so admin status
  // is derived by probing an admin-only endpoint and caching the result here —
  // a deliberate, scoped simplification for this admin-only SPA.
  const adminProbe = useQuery({
    queryKey: ADMIN_PROBE_KEY,
    queryFn: probeIsAdmin,
    enabled: isAuthenticated,
    staleTime: Infinity,
    retry: false,
  })

  const isAdmin = isAuthenticated && adminProbe.data === true
  const isAdminChecked = !isAuthenticated || adminProbe.isFetched

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const data = await api.post<TokenObtainResponse>(
        '/auth/token/',
        { username, password },
        { skipAuth: true },
      )
      setTokens(data.access, data.refresh)
      setIsAuthenticated(true)

      const isAdminAccount = await queryClient.fetchQuery({
        queryKey: ADMIN_PROBE_KEY,
        queryFn: probeIsAdmin,
        staleTime: Infinity,
      })

      if (!isAdminAccount) {
        // This SPA only serves staff — reject non-admin accounts immediately
        // rather than leaving them in a half-authenticated state.
        clearTokens()
        setIsAuthenticated(false)
        queryClient.removeQueries({ queryKey: ADMIN_PROBE_KEY })
      }
      return isAdminAccount
    },
    [queryClient],
  )

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
    queryClient.removeQueries({ queryKey: ADMIN_PROBE_KEY })
  }, [queryClient])

  const value: AuthContextValue = {
    isAuthenticated,
    isAdmin,
    isAdminChecked,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Colocating the hook with its provider is intentional — the small file size
// doesn't warrant splitting, at the cost of triggering this Vite fast-refresh lint rule.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
