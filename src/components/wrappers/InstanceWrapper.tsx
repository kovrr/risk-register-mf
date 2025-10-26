import { useAuthUser } from '@frontegg/react';
import type { AxiosInstance } from 'axios';
import React, { useEffect } from 'react';
import { configureAxiosInstance } from '@/services/configureAxiosInstance';
import { HttpClientContext } from '@/state/HttpClientContext';

type Props = {
	children: React.ReactNode;
	instance?: AxiosInstance; // we allow the injection of an instance for testing purposes
};

export const InstanceWrapper = ({ children, instance }: Props) => {
	const user = useAuthUser();

	// This stores the current jwt in the same *mutable* variable
	const jwtRef = React.useRef(user?.accessToken || '');
	const axiosRef = React.useRef(
		instance || configureAxiosInstance(() => jwtRef.current, '/'),
	);

	useEffect(() => {
		if (user?.accessToken) {
			jwtRef.current = user.accessToken;
		}
	}, [user?.accessToken]);

	// Wait for user to be loaded before proceeding
	if (!user) {
		return <div>Loading...</div>;
	}

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
