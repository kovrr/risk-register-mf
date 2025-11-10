import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

const enableMocks =
  import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.DEV;

async function bootstrap() {
  if (enableMocks) {
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
}

void bootstrap();
