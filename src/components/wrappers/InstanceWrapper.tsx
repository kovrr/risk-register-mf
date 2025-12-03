import { configureAxiosInstance } from '@/services/configureAxiosInstance';
import { getAccessToken } from '@/services/tokens';
import { HttpClientContext } from '@/state/HttpClientContext';
import { isMockMode } from '@/lib/env';
import { resolveApiBaseUrl } from '@/lib/apiConfig';
import type { AxiosInstance } from 'axios';
import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  instance?: AxiosInstance; // we allow the injection of an instance for testing purposes
};

export const InstanceWrapper = ({ children, instance }: Props) => {
  const mockMode = isMockMode();
  const shouldUseAuth = !mockMode;
  const frameworkBaseUrl = resolveApiBaseUrl();

  // In mock mode, set baseURL to empty string so requests go to /api/* (same origin)
  // In non-mock mode, use the full baseURL (e.g., http://localhost:1337/api)
  const axiosBaseUrl = mockMode ? '' : frameworkBaseUrl;

  if (mockMode) {
    console.log('[InstanceWrapper] Mock mode active - setting axios baseURL to empty string');
    console.log('[InstanceWrapper] Requests will go to:', axiosBaseUrl || '(empty - relative paths)');
  }

  // Function to get current token (reads from localStorage on each call)
  // This is called by the axios interceptor on every request, so it always gets fresh token
  const getToken = (): string => {
    return getAccessToken() || '';
  };

  // Create axios instance with token getter
  // Recreate if mock mode changes (though it shouldn't change after mount)
  const axiosRef = React.useRef<AxiosInstance | null>(null);

  if (!axiosRef.current || instance) {
    axiosRef.current = instance || configureAxiosInstance(getToken, axiosBaseUrl, shouldUseAuth);
    console.log('[InstanceWrapper] Created axios instance with baseURL:', axiosRef.current.defaults.baseURL || '(empty)');
  } else {
    // Update baseURL if mock mode changed (shouldn't happen, but just in case)
    if (axiosRef.current.defaults.baseURL !== axiosBaseUrl) {
      console.log('[InstanceWrapper] Updating axios baseURL from', axiosRef.current.defaults.baseURL, 'to', axiosBaseUrl || '(empty)');
      axiosRef.current.defaults.baseURL = axiosBaseUrl;
    }
  }

  // State to force re-render when token changes (for components that need to react)
  const [, setTokenUpdate] = useState(0);

  // Listen for token updates from localStorage changes
  useEffect(() => {
    const handleTokenUpdate = () => {
      // Force re-render to update any components that depend on token state
      setTokenUpdate((prev) => prev + 1);
      // Note: We don't need to recreate the axios instance because
      // the interceptor calls getToken() which reads fresh from localStorage on each request
    };

    // Listen for custom token update events
    window.addEventListener('auth_tokens_updated', handleTokenUpdate);

    // Also listen for storage events (in case token is updated in another tab/window)
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_tokens_v1') {
        handleTokenUpdate();
      }
    });

    return () => {
      window.removeEventListener('auth_tokens_updated', handleTokenUpdate);
      window.removeEventListener('storage', handleTokenUpdate);
    };
  }, []);

  return (
    <HttpClientContext.Provider
      value={{
        axiosInstance: axiosRef.current,
      }}
    >
      {children}
    </HttpClientContext.Provider>
  );
};
