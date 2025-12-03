async function initMocks() {
	if (typeof window === 'undefined') {
		// Server-side: you can add server setup here if needed
		console.log('[MSW] Server environment detected');
	} else {
		// Browser-side: start the worker
		try {
			const { worker } = await import('./browser');
			await worker.start({
				onUnhandledRequest: 'bypass', // Let unhandled requests pass through
			});
			console.log('[MSW] ✅ Mock service worker started successfully');
			console.log('[MSW] Worker will intercept requests to:', window.location.origin);
		} catch (error) {
			console.error('[MSW] ❌ Failed to start worker:', error);
		}
	}
}

// Initialize mocks when this file is imported
console.log('[MSW] Initializing mock service worker...');
initMocks();

export {};
