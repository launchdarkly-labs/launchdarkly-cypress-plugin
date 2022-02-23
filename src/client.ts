import Launchdarkly, { LDClient, LDUser } from 'launchdarkly-node-server-sdk';
import { CypressLDConfig, TestDetail } from './types';
import { debugLog } from './utils';

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

export const shouldSkipTestFile = async (cfg: CypressLDConfig, td: TestDetail) => {
  const client = await getLDClient(cfg);
  const user: LDUser = {
    key: 'cypress-ld-plugin-user',
    custom: {
      suiteNames: td.suiteNames,
      testNames: td.testNames,
      filePath: td.filePath,
    },
  };

  const result = await client.variation(cfg.flagKey, user, false);

  debugLog(`Flag ${cfg.flagKey} evaluated to ${result} for the following tests: `, td);

  return result;
};
