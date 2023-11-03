import Launchdarkly, { LDClient, LDMultiKindContext } from 'launchdarkly-node-server-sdk';
import { TestContext } from './types';
import { CypressLDConfig } from './types';
import crypto from 'crypto';

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

export const shouldSkipSpec = async (cfg: CypressLDConfig, data: TestContext) => {
  const client = await getLDClient(cfg);

  const ldContext: LDMultiKindContext = {
    kind: 'multi',
    user: {
      key: getKey('user', data),
      suiteName: data.suiteName,
      testName: data.testName,
    },
    cypress: {
      key: getKey('cypress', data),
      suite: data.suiteName,
      test: data.testName,
    },
  };

  return await client.variation(cfg.flagKey, ldContext, false);
};

const getKey = (prefix: string, data: TestContext) => {
  return crypto.createHash('md5').update(`${prefix}-${data.suiteName}-${data.testName}`).digest('hex');
};
