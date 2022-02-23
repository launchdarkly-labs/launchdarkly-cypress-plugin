/// <reference types="cypress" />

import fg from 'fast-glob';
import { debugLog, parseTestDetails, sanitizeFilesToIgnore, warningLog } from './utils';
import { shouldSkipTestFile } from './client';
import { CypressLDConfig } from './types';

export const cypressLaunchDarklyPlugin = async (
  cyConfig: Cypress.PluginConfigOptions,
  ldConfig: CypressLDConfig,
): Promise<Cypress.PluginConfigOptions> => {
  // ensure we have env configuration for cypress
  if (!cyConfig || !cyConfig.env) {
    return cyConfig;
  }

  const specFiles = fg.sync(cyConfig.testFiles, {
    cwd: cyConfig.integrationFolder,
    ignore: sanitizeFilesToIgnore(cyConfig.ignoreTestFiles),
    absolute: false,
  });

  debugLog(`Found ${specFiles.length} test files for filtering`);

  const testDetails = parseTestDetails(cyConfig.integrationFolder, specFiles);
  const testFilesToRun: string[] = [];

  for (const td of testDetails) {
    const shouldSkipFile = await shouldSkipTestFile(ldConfig, td);
    if (!shouldSkipFile) {
      testFilesToRun.push(td.filePath);
    }
  }

  if (!testFilesToRun.length) {
    warningLog(`All tests have been filterd out. There are no tests for Cypress to load.`);
  }

  cyConfig.testFiles = testFilesToRun;

  return cyConfig;
};
