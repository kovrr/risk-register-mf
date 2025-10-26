import { createRsbuild } from "@rsbuild/core";
import { defineConfig } from "cypress";
import { devServer } from "cypress-rspack-dev-server";
import config from "./rsbuild.config";

async function rspackDevServer(devServerConfig) {
  const rsbuild = await createRsbuild({ rsbuildConfig: config });
  const rsbuildConfigs = await rsbuild.initConfigs();

  const rspackConfig = rsbuildConfigs[0];

  return devServer({
    ...devServerConfig,
    framework: "react",
    rspackConfig: rspackConfig,
  });
}

export default defineConfig({
  component: {
    supportFile: "./cypress/support/component.ts",
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    devServer(devServerConfig) {
      return rspackDevServer({
        ...devServerConfig,
      });
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3003",
  },
});
