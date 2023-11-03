/// <reference types="cypress" />

import fg from 'fast-glob';
import { debugLog, parseTestData, sanitizeFilesToIgnore, LD_PLUGIN_ENV_NAME, infoLog } from './utils';
import { shouldSkipSpec } from './client';
import { CypressLDConfig, TestContext } from './types';

export const launchDarklyCypressPlugin = async (
  cyCfg: Cypress.PluginConfigOptions,
  ldCfg: CypressLDConfig,
): Promise<Cypress.PluginConfigOptions> => {
  // ensure we have env configuration for cypress
  if (!cyCfg || !cyCfg.env) {
    return cyCfg;
  }

  if (!ldCfg.flagKey || !ldCfg.sdkKey) {
    infoLog(`Invalid configuration. Missing SDK and/or flag key for LaunchDarkly cypress plugin`);
    return cyCfg;
  }
  infoLog('Using LaunchDarkly cypress plugin');

  const specFiles = fg.sync(cyCfg.specPattern, {
    ignore: sanitizeFilesToIgnore(cyCfg.excludeSpecPattern),
    absolute: false,
  });

  debugLog(`Found ${specFiles.length} test files for filtering`);

  const testData = parseTestData('', specFiles);
  const testsToSkip: TestContext[] = [];

  for (const td of testData) {
    const shouldSkip = await shouldSkipSpec(ldCfg, td);

    if (shouldSkip) {
      infoLog(`Skipped [Suite]: ${td.suiteName}, [Test name]: ${td.testName}`);

      testsToSkip.push(td);
    }
  }

  cyCfg.env[LD_PLUGIN_ENV_NAME] = testsToSkip;

  return cyCfg;
};
