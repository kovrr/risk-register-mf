import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { enableMockMode, isMockMode } from '@/lib/env';
import './i18n';

// Check for mock mode - handle various truthy values
const checkMockFlag = (value: unknown): boolean => {
	if (value === true || value === 'true' || value === '1') {
		return true;
	}
	if (typeof value === 'string' && value.length > 0 && value !== 'false' && value !== '0') {
		return true;
	}
	return false;
};

// Check globalThis first (set by Rsbuild define), then import.meta.env
const globalMockFlag = typeof globalThis !== 'undefined'
	? (globalThis as any).__USE_MOCKS_BUILD_TIME__
	: undefined;

const shouldEnableMocks =
	checkMockFlag(globalMockFlag) ||
	checkMockFlag(import.meta.env?.USE_MOCKS) ||
	checkMockFlag(import.meta.env?.VITE_USE_MOCKS) ||
	(typeof process !== 'undefined' && checkMockFlag(process.env?.USE_MOCKS));

console.log('[Bootstrap] Mock mode check:', {
	'globalThis.__USE_MOCKS_BUILD_TIME__': globalMockFlag,
	'import.meta.env.USE_MOCKS': import.meta.env?.USE_MOCKS,
	'import.meta.env.VITE_USE_MOCKS': import.meta.env?.VITE_USE_MOCKS,
	'process.env.USE_MOCKS': typeof process !== 'undefined' ? process.env?.USE_MOCKS : 'N/A',
	shouldEnableMocks,
});

if (shouldEnableMocks) {
	console.log('[Bootstrap] Enabling mock mode...');
	enableMockMode();
}

// Initialize MSW for development
const mockModeActive = isMockMode();
console.log('[Bootstrap] Mock mode active:', mockModeActive);
if (mockModeActive) {
	console.log('[Bootstrap] Importing MSW...');
	await import('./mocks');
}

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
