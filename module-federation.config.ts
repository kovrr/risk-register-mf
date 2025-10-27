import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'risk_register_mf',
  exposes: {
    // './remoteRoutes': './src/exposes/remoteRoutes.tsx',
    './RemoteApp': './src/exposes/RemoteApp.tsx',
  },
  shared: {
    // Temporarily disabling all shared dependencies to fix factory errors
    // This will bundle React and React-DOM with the microfrontend
    // react: {
    //   singleton: true,
    //   requiredVersion: false,
    //   eager: true,
    // },
    // 'react-dom': {
    //   singleton: true,
    //   requiredVersion: false,
    //   eager: true,
    // },
  },
});
