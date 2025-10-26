import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'risk_register_mf',
  exposes: {
    // './remoteRoutes': './src/exposes/remoteRoutes.tsx',
    './RemoteApp': './src/exposes/RemoteApp.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
      eager: true,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
      eager: true,
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: false,
      eager: true,
    },
  },
});
