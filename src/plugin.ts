/// <reference types="cypress" />

import fg from 'fast-glob';
import { debugLog, parseTestDetails, sanitizeFilesToIgnore } from './utils';
import { shouldSkipSpec } from './client';
import { CypressLDConfig } from './types';

export const launchDarklyCypressPlugin = async (
  cyConfig: Cypress.PluginConfigOptions,
  ldConfig: CypressLDConfig,
): Promise<Cypress.PluginConfigOptions> => {
  // ensure we have env configuration for cypress
  if (!cyConfig || !cyConfig.env) {
    return cyConfig;
  }

  console.log('Using LaunchDarkly cypress plugin');

  const specFiles = fg.sync(cyConfig.testFiles, {
    cwd: cyConfig.integrationFolder,
    ignore: sanitizeFilesToIgnore(cyConfig.ignoreTestFiles),
    absolute: false,
  });

  debugLog(`Found ${specFiles.length} test files for filtering`);

  const testDetails = parseTestDetails(cyConfig.integrationFolder, specFiles);
  const testsToSkip: string[] = [];

  for (const td of testDetails) {
    const flattenedSpecs = [...td.testNames, ...td.suiteNames];

    for (const specName of flattenedSpecs) {
      const shouldSkip = await shouldSkipSpec(ldConfig, specName);
      
      debugLog('Checked: ', specName, ' shouldSkip', shouldSkip);

      if (shouldSkip) {
        testsToSkip.push(`-${specName}`);
      }
    }
  }

  if (testsToSkip.length) {
    const grep = testsToSkip.join(';');
    cyConfig.env['grep'] = grep;
    debugLog('Grep result: ', grep);
  }

  return cyConfig;
}
