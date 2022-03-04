import Launchdarkly, { LDClient, LDUser } from 'launchdarkly-node-server-sdk';
import { TestData } from './types';
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

export const shouldSkipSpec = async (cfg: CypressLDConfig, data: TestData) => {
  const client = await getLDClient(cfg);
  const user: LDUser = {
    key: cfg.userKey ?? 'cypress-ld-plugin-user',
    custom: {
      suiteName: data.suiteName,
      testName: data.testName,
      tags: data.tags,
    },
  };

  return await client.variation(cfg.flagKey, user, false);
};
