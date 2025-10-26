import type { AxiosInstance } from 'axios';
import React, { useContext } from 'react';

export const HttpClientContext = React.createContext<{
	axiosInstance: AxiosInstance | null;
}>({ axiosInstance: null });

export const useAxiosInstance = (): AxiosInstance => {
	const context = useContext(HttpClientContext);
	if (!context.axiosInstance) {
		throw new Error('Axios instance is not available in HttpClientContext');
	}
	return context.axiosInstance;
};
