async function initMocks() {
  console.log('🚀 Initializing MSW mocks...');
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
    console.log('✅ MSW server started');
  } else {
    const { worker } = await import('./browser');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.start({
      onUnhandledRequest: 'bypass', // Allow unhandled requests to pass through
    });
    console.log('✅ MSW worker started');
  }
}

// Enable mocks in development mode by default
const shouldUseMocks =
  import.meta.env.VITE_USE_MOCKS === 'true' ||
  import.meta.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
  import.meta.env.DEV; // Enable in development mode

console.log('🔍 Mock initialization check:', {
  VITE_USE_MOCKS: import.meta.env.VITE_USE_MOCKS,
  NEXT_PUBLIC_USE_MOCKS: import.meta.env.NEXT_PUBLIC_USE_MOCKS,
  DEV: import.meta.env.DEV,
  shouldUseMocks
});

if (shouldUseMocks) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initMocks();
}

export { };
