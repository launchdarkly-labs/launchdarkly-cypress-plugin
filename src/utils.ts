import { getTestNames, Structure } from 'find-test-names';
import { TestContext } from './types';
import debug from 'debug';

export const LD_PLUGIN_ENV_NAME = 'ld_plugin_env_var';
const logPrefix = "LaunchDarkly Cypress Plugin"

const debugLogger = debug('ld-plugin');

export const debugLog = (statement: string, ...args: any[]) => {
  debugLogger(`[debug]: ${statement}`, ...args);
};

export const errorLog = (statement: string, ...args: any[]) => {
  console.error(`error: [${logPrefix}]: ${statement}`, ...args);
};

export const warningLog = (statement: string, ...args: any[]) => {
  console.warn(`warning: [${logPrefix}]: ${statement}`, ...args);
};

export const infoLog = (statement: string, ...args: any[]) => {
  console.info(`info: [${logPrefix}]: ${statement}`, ...args);
};

export const sanitizeFilesToIgnore = (files: string | string[]) => {
  if (Array.isArray(files) && files.length) return files;
  if (typeof files === 'string') return [files];
  return [];
};

export const parseTestData = (basePath: string, specFiles: string[]): TestContext[] => {
  const allResults: TestContext[] = [];

  for (const specFile of specFiles) {
    const filepath = pathWrapper().join(basePath, specFile);

    try {
      debugLog('Parsing: ', filepath);

      const content = fsWrapper().readFileSync(filepath, 'utf-8');
      const names = getTestNames(content, true);
      const results = recursivelyParseTestSuites(names.structure);

      debugLog(`Parsed tests for ${specFile}: `, results);

      allResults.push(...results);
    } catch (ex) {
      errorLog(`Error occurred while processing ${filepath}`, ex);
    }
  }

  return allResults;
};

const recursivelyParseTestSuites = (structure: Structure) => {
  const results: TestContext[] = [];

  for (const struct of structure) {
    // capture data for all tests in the suite
    if (struct.type === 'suite') {
      // get all tests for the suite
      results.push(...struct.tests.map((t) => ({ suiteName: struct.name, testName: t.name })));
    }

    // for parent of a nested suite... this allows us to target the `describe` scope without
    // targeting individual nested suites/tests
    if (struct.type === 'suite' && struct.tests && struct.suites.length > 0) {
      results.push({ suiteName: struct.name, testName: '' });
    }

    // follow nested suites
    const nestedSuites = (struct as any).suites as Structure;
    if (nestedSuites?.length > 0) {
      const nestedResults = recursivelyParseTestSuites(nestedSuites);
      results.push(...nestedResults);
    }
  }

  return results;
};

// these wrappers helps to bypass webpack's error when fs and path are
// required at the top level of the file. Webpack complains if its configured to
// bundle code for the browser. This is not the cleanest way to handle this but
// it works as temporary workaround.
export const fsWrapper = () => {
  return eval('require')('fs');
};

export const pathWrapper = () => {
  return eval('require')('path');
};
