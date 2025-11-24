/**
 * Resolve API base URL with proper priority:
 * 1. Check environment variables in priority order
 * 2. Never fallback to window.location.origin for API endpoints
 * 3. Default to http://localhost:8000 if no env var exists
 */
export const getBaseApiUrl = (): string => {
  // Priority order: VITE_API_BASE_URL > NEXT_PUBLIC_API_BASE_URL > VITE_API_URL > NEXT_PUBLIC_API_URL
  const envBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL;

  // If env var exists and contains http:// or https://, use it
  if (envBaseUrl && (envBaseUrl.startsWith('http://') || envBaseUrl.startsWith('https://'))) {
    return envBaseUrl;
  }

  // If env var exists but doesn't have protocol, assume it's a base path and needs protocol
  if (envBaseUrl) {
    // Remove leading/trailing slashes and add http:// if no protocol
    const cleaned = envBaseUrl.replace(/^\/+|\/+$/g, '');
    return `http://${cleaned}`;
  }

  // Default fallback - never use window.location.origin for API calls
  return 'http://localhost:8000';
};

export const getMicrosoftAuthApiUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth-svc`;
  }
  return '/auth-svc';
};
