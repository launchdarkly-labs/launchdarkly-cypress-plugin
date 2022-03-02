import Launchdarkly, { LDClient, LDUser } from 'launchdarkly-node-server-sdk';
import { CypressLDConfig } from './types';

let ldClient: LDClient;

// use singleton pattern to ensure client is only initialized once
const getLDClient = async (cfg: CypressLDConfig) => {
  if (ldClient && ldClient.initialized()) {
    return ldClient;
  }

  ldClient = Launchdarkly.init(cfg.sdkKey, {
    baseUri: cfg.baseUri,
    eventsUri: cfg.eventsUri,
    streamUri: cfg.streamUri,
  });

  return await ldClient.waitForInitialization();
};

export const shouldSkipSpec = async (cfg: CypressLDConfig, testOrSuiteName: string, key: string = 'cypress-ld-plugin-user') => {
  const client = await getLDClient(cfg);
  const user: LDUser = {
    key,
    custom: {
      testOrSuiteName,
    },
  };

  return await client.variation(cfg.flagKey, user, false);
};