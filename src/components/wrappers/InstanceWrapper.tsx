import React, { useEffect } from 'react';
import { useAuthUser } from '@frontegg/react';
import { configureAxiosInstance } from '@/services/service';
import { HttpClientContext } from '@/state/HttpClientContext';
import { AxiosInstance } from 'axios';

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
    instance || configureAxiosInstance(() => jwtRef.current)
  );
  const nextAxiosRef = React.useRef(
    instance || configureAxiosInstance(() => jwtRef.current, '/')
  );

  useEffect(() => {
    jwtRef.current = jwt;
  }, [jwt]);

  return (
    <HttpClientContext.Provider
      value={{
        axiosInstance: axiosRef.current,
        nextAxiosInstance: nextAxiosRef.current,
      }}
    >
      {children}
    </HttpClientContext.Provider>
  );
};
