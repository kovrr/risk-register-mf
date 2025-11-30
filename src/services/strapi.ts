import { isMockMode } from '@/lib/env';

const isTestRuntime = (): boolean => {
  if (typeof window !== 'undefined' && (window as any).Cypress) {
    return true;
  }

  if (
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    process.env.NODE_ENV === 'test'
  ) {
    return true;
  }

  return false;
};

const resolveStrapiBaseUrl = (): string => {
  // Use isMockMode() for consistent mock detection
  if (isMockMode()) {
    return '/api';
  }

  const envBaseUrl =
    import.meta.env.NEXT_PUBLIC_STRAPI_API_URL ||
    import.meta.env.VITE_STRAPI_API_URL;

  if (!envBaseUrl) {
    if (isTestRuntime()) {
      return '/api';
    }
    throw new Error(
      'NEXT_PUBLIC_STRAPI_API_URL (or VITE_STRAPI_API_URL) must be defined to call Strapi APIs.',
    );
  }

  const normalizedBase = envBaseUrl.replace(/\/+$/, '');
  return normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;
};

const normalizeBaseAndPath = (base: string, path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!base || base === '/') {
    return normalizedPath;
  }
  if (base.endsWith('/') && normalizedPath.startsWith('/')) {
    return `${base.slice(0, -1)}${normalizedPath}`;
  }
  return `${base}${normalizedPath}`;
};

// Don't evaluate at module load - check mock mode dynamically
const getStrapiApiBaseUrl = (): string => {
  return resolveStrapiBaseUrl();
};

const deriveCmsBaseUrl = (apiBaseUrl: string): string => {
  if (!apiBaseUrl) {
    return '';
  }
  if (apiBaseUrl === '/api') {
    return '/api';
  }
  if (apiBaseUrl.endsWith('/api')) {
    return apiBaseUrl.replace(/\/api$/, '');
  }
  return apiBaseUrl;
};

export const withStrapiApiPath = (path: string): string => {
  // Check mock mode dynamically on each call
  const baseUrl = getStrapiApiBaseUrl();

  // In mock mode, baseUrl is '/api', so we return '/api/path'
  // In non-mock mode, baseUrl is 'http://localhost:1337/api', but axios baseURL is also set to that,
  // so we should return just the path to avoid double '/api'
  if (isMockMode()) {
    // Mock mode: return full path including /api prefix
    return normalizeBaseAndPath(baseUrl, path);
  } else {
    // Non-mock mode: axios baseURL already includes /api, so return just the path
    // Remove /api from the path if it starts with it, since baseURL already has it
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (normalizedPath.startsWith('/api/')) {
      return normalizedPath.replace(/^\/api/, '');
    }
    return normalizedPath;
  }
};

export const withStrapiCmsPath = (path: string): string => {
  // Check mock mode dynamically on each call
  const baseUrl = getStrapiApiBaseUrl();
  
  if (isMockMode()) {
    // In mock mode, baseUrl is '/api'
    // If path already starts with '/api', return it as-is to avoid double /api
    if (path.startsWith('/api/')) {
      return path;
    }
    // Otherwise, prepend /api
    return normalizeBaseAndPath('/api', path);
  }
  
  // Non-mock mode: use CMS base URL logic
  const cmsBaseUrl = deriveCmsBaseUrl(baseUrl);
  const base = cmsBaseUrl || baseUrl;
  return normalizeBaseAndPath(base, path);
};

// Keep for backwards compatibility, but it will be evaluated at module load
// Prefer using withStrapiApiPath() which checks mock mode dynamically
export const STRAPI_API_BASE_URL = resolveStrapiBaseUrl();
export const STRAPI_CMS_BASE_URL = deriveCmsBaseUrl(STRAPI_API_BASE_URL);
