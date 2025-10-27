export const getBaseApiUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '/';
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
