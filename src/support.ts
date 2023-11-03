// this test skipping logic was inspired by the cypress-grep project. All credits to the contributors
// of that project.
// see https://github.com/cypress-io/cypress-grep/blob/main/src/support.js

import { AsyncFunc, Func, Suite, Test, TestFunction } from 'mocha';
import { infoLog, LD_PLUGIN_ENV_NAME } from './utils';
import { TestContext } from './types';

const _it: TestFunction = it;
const _describe = describe;

function launchDarklyCypressSupport() {
  const testsToSkip: TestContext[] = Cypress.env(LD_PLUGIN_ENV_NAME) ?? [];

  // prevent multiple registrations
  if (it.name === 'itProxy') {
    infoLog('LaunchDarkly cypress support has already been registered');
    return;
  }

  let currentSuite = '';

  // use a proxy to mark tests to skip
  (it as any) = function itProxy(name: string, options: {}, callback: Func | AsyncFunc | undefined): Test {
    if (typeof options === 'function') {
      // the test has format it('...', cb)
      callback = options as any;
      options = {};
    }

    if (!callback) {
      // the pending test by itself
      return _it(name, options);
    }

    const shouldSkip = testsToSkip.some((t) => t.suiteName === currentSuite && t.testName === name);
    if (shouldSkip) {
      infoLog(`Skipping test: ${name} in suite: ${currentSuite}`);
      return _it.skip(name, options, callback);
    }

    return _it(name, options, callback);
  };

  // use a proxy to mark tests to skip
  (describe as any) = function describeProxy(name: string, options: any, callback: (this: Suite) => void): Suite | undefined {
    if (typeof options === 'function') {
      // the block has format describe('...', cb)
      callback = options;
      options = {};
    }

    currentSuite = name;

    if (!callback) {
      // the pending suite by itself
      return _describe(name, options);
    }

    // the suite was targeted to be skipped
    const shouldSkip = testsToSkip.some((t) => t.suiteName === name && t.testName === '');
    if (shouldSkip) {
      infoLog(`Skipping all tests in suite: ${name}`);
      _describe.skip(name, options, callback);
      return;
    }

    return _describe(name, options, callback);
  };

  // overwrite "context" which is an alias to "describe"
  context = describe;

  // overwrite "specify" which is an alias to "it"
  specify = it;

  // keep the ".skip", ".only" methods the same as before
  it.skip = _it.skip;
  it.only = _it.only;

  describe.skip = _describe.skip;
  describe.only = _describe.only;
}

export default launchDarklyCypressSupport();
