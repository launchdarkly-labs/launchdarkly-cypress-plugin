/// <reference types="cypress" />

import fg from 'fast-glob';
import { debugLog, parseTestData, sanitizeFilesToIgnore, LD_PLUGIN_ENV_NAME, infoLog } from './utils';
import { shouldSkipSpec } from './client';
import { CypressLDConfig, TestData } from './types';

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
    cwd: 'cypress/e2e',
    ignore: sanitizeFilesToIgnore(cyCfg.excludeSpecPattern),
    absolute: false,
  });

  debugLog(`Found ${specFiles.length} test files for filtering`);

  const testData = parseTestData('cypress/e2e', specFiles);
  const testsToSkip: TestData[] = [];

  for (const td of testData) {
    const shouldSkip = await shouldSkipSpec(ldCfg, td);

    debugLog(`Evaluated suite: ${td.suiteName}, test: ${td.testName}, tags: ${td.tags}, skip: ${shouldSkip}`);

    if (shouldSkip) {
      testsToSkip.push(td);
    }
  }

  cyCfg.env[LD_PLUGIN_ENV_NAME] = testsToSkip;

  return cyCfg;
};
