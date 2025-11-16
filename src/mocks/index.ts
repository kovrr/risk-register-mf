// @ts-nocheck
let mocksInitialized = false;

async function initMocks() {
  if (mocksInitialized) {
    return;
  }

  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.start({
      onUnhandledRequest: 'bypass', // Allow unhandled requests to pass through
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
  mocksInitialized = true;
}

// Enable mocks only when explicitly requested via env
const shouldUseMocks =
  import.meta.env.VITE_USE_MOCKS === 'true' ||
  import.meta.env.NEXT_PUBLIC_USE_MOCKS === 'true';

if (shouldUseMocks) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  initMocks();
}

export { };
