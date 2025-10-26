import axios, { type AxiosInstance } from 'axios';

let instance: AxiosInstance | null = null;

export const configureAxiosInstance = (
	getToken: () => string,
	baseURL: string,
) => {
	instance = axios.create({
		baseURL,
	});
	instance.interceptors.request.use((config) => {
		const newConfig = { ...config };

		newConfig.headers.Accept = 'application/json';
		newConfig.headers.Authorization = `Bearer ${getToken()}`;

		return newConfig;
	});
	return instance;
};
