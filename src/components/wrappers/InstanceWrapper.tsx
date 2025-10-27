import { configureAxiosInstance } from '@/services/configureAxiosInstance';
import { HttpClientContext } from '@/state/HttpClientContext';
import type { AxiosInstance } from 'axios';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  instance?: AxiosInstance; // we allow the injection of an instance for testing purposes
};

export const InstanceWrapper = ({ children, instance }: Props) => {
  // Mock user for development with mocks
  const mockUser = {
    accessToken: 'mock-jwt-token-for-development',
  };

  const jwt: string = mockUser.accessToken;

  // This stores the current jwt in the same *mutable* variable
  const jwtRef = React.useRef(jwt);
  const axiosRef = React.useRef(
    instance || configureAxiosInstance(() => jwtRef.current, '/'),
  );

  useEffect(() => {
    jwtRef.current = jwt;
  }, [jwt]);

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
