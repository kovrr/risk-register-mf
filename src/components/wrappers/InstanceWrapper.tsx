import { configureAxiosInstance } from '@/services/configureAxiosInstance';
import { HttpClientContext } from '@/state/HttpClientContext';
import { useAuthUser } from '@frontegg/react';
import type { AxiosInstance } from 'axios';
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  instance?: AxiosInstance; // we allow the injection of an instance for testing purposes
};

export const InstanceWrapper = ({ children, instance }: Props) => {
  const user = useAuthUser();
  const jwt: string = user.accessToken;

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
