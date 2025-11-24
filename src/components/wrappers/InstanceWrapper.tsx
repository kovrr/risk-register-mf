import { configureAxiosInstance } from '@/services/configureAxiosInstance';
import { getAccessToken } from '@/services/tokens';
import { HttpClientContext } from '@/state/HttpClientContext';
import type { AxiosInstance } from 'axios';
import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  instance?: AxiosInstance; // we allow the injection of an instance for testing purposes
};

export const InstanceWrapper = ({ children, instance }: Props) => {
  // Get API base URL from environment
  const apiBaseURL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.REACT_APP_API_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:1337/api';

  // Function to get current token (reads from localStorage on each call)
  // This is called by the axios interceptor on every request, so it always gets fresh token
  const getToken = (): string => {
    return getAccessToken() || '';
  };

  // Create axios instance with token getter
  // The interceptor will call getToken() on every request, so it always reads fresh from localStorage
  const axiosRef = React.useRef<AxiosInstance>(
    instance || configureAxiosInstance(getToken, apiBaseURL, true), // useAuth = true
  );

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
