const truthyFlags = new Set(['true', '1', 'yes']);

const normalizeFlag = (value: unknown): boolean => {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'string') {
		return truthyFlags.has(value.toLowerCase());
	}
	return false;
};

const resolveEnvFlag = (
	key: string,
): string | boolean | undefined => {
	if (typeof process !== 'undefined' && process.env) {
		return process.env[key];
	}
	return undefined;
};

type GlobalWithMockFlag = typeof globalThis & {
	__USE_MOCKS__?: string | boolean;
};

const getGlobalFlag = (): string | boolean | undefined => {
	if (typeof globalThis === 'undefined') {
		return undefined;
	}
	return (globalThis as GlobalWithMockFlag).__USE_MOCKS__;
};

const setGlobalFlag = (value: boolean): void => {
	if (typeof globalThis === 'undefined') {
		return;
	}
	(globalThis as GlobalWithMockFlag).__USE_MOCKS__ = value;
};

// Initial check for mock mode from build-time env vars
const initialFlag = [
	import.meta.env?.USE_MOCKS,
	import.meta.env?.VITE_USE_MOCKS,
	resolveEnvFlag('USE_MOCKS'),
	resolveEnvFlag('VITE_USE_MOCKS'),
	getGlobalFlag(), // Check if already set by a previous bootstrap
].some((flag) => normalizeFlag(flag));

// Set global flag if initially detected
if (initialFlag) {
	setGlobalFlag(true);
}

export const enableMockMode = (): void => {
	setGlobalFlag(true);
};

export const isMockMode = (): boolean => {
	const globalFlag = getGlobalFlag();
	const metaUseMocks = import.meta.env?.USE_MOCKS;
	const metaViteUseMocks = import.meta.env?.VITE_USE_MOCKS;
	const processUseMocks = typeof process !== 'undefined' ? process.env?.USE_MOCKS : undefined;

	// Prefer global flag (set during bootstrap) for consistency across HMR
	if (typeof globalFlag !== 'undefined') {
		const result = normalizeFlag(globalFlag);
		return result;
	}

	// Fallback to initial flag check
	return initialFlag;
};
