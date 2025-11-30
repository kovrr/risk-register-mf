import { isMockMode } from '@/lib/env';

const API_BASE_ENV_KEYS = [
	'VITE_API_BASE_URL',
	'REACT_APP_API_BASE_URL',
	'NEXT_PUBLIC_API_BASE_URL',
	'VITE_API_URL',
	'NEXT_PUBLIC_API_URL',
];

const DEFAULT_STRAPI_BASE = 'http://localhost:1337/api';

const readEnvValue = (key: string): string | undefined => {
	const metaEnv = (import.meta.env || {}) as Record<
		string,
		string | boolean | undefined
	>;
	const metaValue = metaEnv[key];
	if (typeof metaValue === 'string' && metaValue.length > 0) {
		return metaValue;
	}

	if (typeof process !== 'undefined' && process.env && process.env[key]) {
		return process.env[key];
	}

	if (typeof window !== 'undefined') {
		const windowValue = (window as Record<string, unknown>)[key];
		if (typeof windowValue === 'string') {
			return windowValue;
		}
	}

	return undefined;
};

const normalizeBase = (value: string): string => {
	const trimmed = value.replace(/\/+$/, '');
	return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const resolveApiBaseUrl = (): string => {
	const mockMode = isMockMode();

	// In mock mode, return /api so MSW can intercept (same-origin requests)
	if (mockMode) {
		return '/api';
	}

	// In non-mock mode, read from environment variables
	for (const key of API_BASE_ENV_KEYS) {
		const value = readEnvValue(key);
		if (value) {
			return normalizeBase(value);
		}
	}

	// Fallback to default
	return normalizeBase(DEFAULT_STRAPI_BASE);
};

export const getBaseApiUrl = (): string => {
	return resolveApiBaseUrl();
};

export const getBaseApiUrlFoqus = (): string => {
	if (import.meta.env.NODE_ENV === 'development') {
		return 'http://localhost:8000';
	}
	if (typeof window !== 'undefined') {
		return window.location.origin;
	}
	return '/';
};

const joinBaseAndEndpoint = (base: string, endpoint: string): string => {
	const normalizedBase = base.replace(/\/+$/, '');
	let normalizedEndpoint = endpoint.startsWith('/')
		? endpoint
		: `/${endpoint}`;

	// If base is '/api' and endpoint starts with '/api/', remove the '/api' from the endpoint
	if (normalizedBase === '/api' && normalizedEndpoint.startsWith('/api/')) {
		normalizedEndpoint = normalizedEndpoint.replace(/^\/api/, '');
	}

	if (!normalizedBase) {
		return normalizedEndpoint;
	}

	// Join base and endpoint, avoiding double slashes
	if (normalizedBase.endsWith('/') && normalizedEndpoint.startsWith('/')) {
		return `${normalizedBase}${normalizedEndpoint.slice(1)}`;
	}

	return `${normalizedBase}${normalizedEndpoint}`;
};

export const buildApiUrl = (endpoint: string): string => {
	const baseUrl = getBaseApiUrl();
	return joinBaseAndEndpoint(baseUrl, endpoint);
};
