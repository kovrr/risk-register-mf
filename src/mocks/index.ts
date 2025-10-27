async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    worker.start();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
initMocks();

export {};
