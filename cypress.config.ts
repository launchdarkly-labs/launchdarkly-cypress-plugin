import { defineConfig } from 'cypress';
import setupNodeEvents from './cypress/plugins';

export default defineConfig({
  e2e: {
    env: {
      PLUGIN_FLAG_KEY: "flag-key",
      PLUGIN_SDK_KEY: "sdk-xxxxxxxxxxxx",
    },
    setupNodeEvents,
  },
});
