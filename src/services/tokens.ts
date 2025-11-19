/**
 * Token utilities - Shared with host application
 * Reads/writes tokens from localStorage key: auth_tokens_v1
 * This ensures both host and remote use the same token storage
 */

const TOKEN_STORAGE_KEY = 'auth_tokens_v1';

export interface TokenData {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  [key: string]: unknown;
}

/**
 * Get tokens from localStorage (same key as host)
 */
export const getTokens = (): TokenData | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as TokenData;
    return parsed;
  } catch (error) {
    console.warn('Failed to read tokens from localStorage:', error);
    return null;
  }
};

/**
 * Set tokens in localStorage (same key as host)
 */
export const setTokens = (tokens: TokenData): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    // Dispatch custom event so other parts of the app can react to token changes
    window.dispatchEvent(new CustomEvent('auth_tokens_updated', { detail: tokens }));
  } catch (error) {
    console.warn('Failed to write tokens to localStorage:', error);
  }
};

/**
 * Get the access token (for Authorization header)
 */
export const getAccessToken = (): string | null => {
  const tokens = getTokens();
  return tokens?.accessToken ?? null;
};

/**
 * Clear tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('auth_tokens_updated', { detail: null }));
  } catch (error) {
    console.warn('Failed to clear tokens from localStorage:', error);
  }
};

/**
 * Check if token is expired (if expiresAt is present)
 */
export const isTokenExpired = (): boolean => {
  const tokens = getTokens();
  if (!tokens?.expiresAt) {
    return false; // Can't determine expiration
  }

  return Date.now() >= tokens.expiresAt;
};
