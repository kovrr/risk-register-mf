import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import moduleFederationConfig from "./module-federation.config";

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig, {})],
  server: {
    port: 3004,
  },
  source: {
    // Enable environment variable injection
    define: {
      // This allows you to use process.env variables in your code
      "import.meta.env.FRONTEGG_AUTH_URL": JSON.stringify(
        process.env.FRONTEGG_AUTH_URL
      ),
      "import.meta.env.FRONTEGG_APPLICATION_ID": JSON.stringify(
        process.env.FRONTEGG_APPLICATION_ID
      ),
      "import.meta.env.RUNNING_IN_CYPRESS": JSON.stringify(
        process.env.RUNNING_IN_CYPRESS
      ),
    },
  },
});
