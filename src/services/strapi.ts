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
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
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

export const STRAPI_API_BASE_URL = resolveStrapiBaseUrl();

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

export const STRAPI_CMS_BASE_URL = deriveCmsBaseUrl(STRAPI_API_BASE_URL);

export const withStrapiApiPath = (path: string): string => {
  return normalizeBaseAndPath(STRAPI_API_BASE_URL, path);
};

export const withStrapiCmsPath = (path: string): string => {
  const base = STRAPI_CMS_BASE_URL || STRAPI_API_BASE_URL;
  return normalizeBaseAndPath(base, path);
};

