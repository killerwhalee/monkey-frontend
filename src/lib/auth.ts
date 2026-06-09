import { jwtDecode } from 'jwt-decode'

const ACCESS_TOKEN_KEY = 'monkey_access_token'
const REFRESH_TOKEN_KEY = 'monkey_refresh_token'

interface AccessTokenPayload {
  exp: number
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(access: string, refresh?: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const EXPIRY_MARGIN_SECONDS = 60

export function isAccessTokenExpiringSoon(token: string): boolean {
  try {
    const { exp } = jwtDecode<AccessTokenPayload>(token)
    return exp * 1000 - Date.now() < EXPIRY_MARGIN_SECONDS * 1000
  } catch {
    return true
  }
}

export function isAccessTokenValid(token: string): boolean {
  try {
    const { exp } = jwtDecode<AccessTokenPayload>(token)
    return exp * 1000 > Date.now()
  } catch {
    return false
  }
}
