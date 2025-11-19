import axios, { type AxiosInstance } from 'axios';

let instance: AxiosInstance | null = null;

/**
 * Configure Axios instance for API calls
 * @param getToken - Function to get auth token from localStorage
 * @param baseURL - API base URL
 * @param useAuth - Whether to include auth headers (default: true)
 */
export const configureAxiosInstance = (
	getToken: () => string,
	baseURL: string,
	useAuth: boolean = true,
) => {
	instance = axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});

	// Request interceptor: inject Authorization header
	instance.interceptors.request.use(
		(config) => {
			const newConfig = { ...config };

			// Always set Accept header
			newConfig.headers.Accept = 'application/json';

			// Add Authorization header if auth is enabled and token exists
			if (useAuth) {
				const token = getToken();
				if (token) {
					newConfig.headers.Authorization = `Bearer ${token}`;
				}
			}

			return newConfig;
		},
		(error) => {
			return Promise.reject(error);
		},
	);

	// Response interceptor: handle token refresh or errors
	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			// Handle 401 Unauthorized - token might be expired
			if (error.response?.status === 401) {
				console.warn('API request returned 401 Unauthorized. Token may be expired.');
				// Optionally clear tokens or trigger refresh here
			}
			return Promise.reject(error);
		},
	);

	return instance;
};
