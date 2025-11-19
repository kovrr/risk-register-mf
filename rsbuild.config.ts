import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import moduleFederationConfig from "./module-federation.config";

const useMocks = process.env.VITE_USE_MOCKS === "true";

export default defineConfig({
	plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig, {})],
	dev: {
		lazyCompilation: false,
	},
	server: {
		...(useMocks
			? {
					port: 3004,
				}
			: {
					port: 3004,
					proxy: {
						"/api/v1": {
							target: "http://localhost:8000",
							changeOrigin: true,
						},
					},
				}),
	},
	source: {
		// Enable environment variable injection
		define: {
			// This allows you to use process.env variables in your code
			"import.meta.env.VITE_USE_MOCKS": JSON.stringify(
				process.env.VITE_USE_MOCKS,
			),
			"import.meta.env.NEXT_PUBLIC_USE_MOCKS": JSON.stringify(
				process.env.NEXT_PUBLIC_USE_MOCKS,
			),
			"import.meta.env.FRONTEGG_AUTH_URL": JSON.stringify(
				process.env.FRONTEGG_AUTH_URL,
			),
			"import.meta.env.FRONTEGG_APPLICATION_ID": JSON.stringify(
				process.env.FRONTEGG_APPLICATION_ID,
			),
			"import.meta.env.RUNNING_IN_CYPRESS": JSON.stringify(
				process.env.RUNNING_IN_CYPRESS,
			),
		},
	},
});
