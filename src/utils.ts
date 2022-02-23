import fs from 'fs';
import { getTestNames } from 'find-test-names';
import path from 'path';
import { TestDetail } from './types';
import debug from 'debug';

const debugLogger = debug('ld-plugin')

export const debugLog = (statement: string, ...args: any[]) => {
  debugLogger(`[debug]: ${statement}`, ...args);
};

export const errorLog = (statement: string, ...args: any[]) => {
  console.error(`[cypress-ld-plugin][error]: ${statement}`, ...args);
};

export const warningLog = (statement: string, ...args: any[]) => {
  console.warn(`[cypress-ld-plugin][warn]: ${statement}`, ...args);
};

export const sanitizeFilesToIgnore = (files: string | string[]) => {
  if (Array.isArray(files) && files.length) return files;
  if (typeof files === 'string') return [files];
  return [];
};

export const parseTestDetails = (basePath: string, specFiles: string[]): TestDetail[] => {
  const details: TestDetail[] = [];

  for (const specFile of specFiles) {
    const content = fs.readFileSync(path.join(basePath, specFile), 'utf-8');
    const result = getTestNames(content);

    debugLog(`Tests and suite names found in ${specFile} for filtering: `, result.suiteNames, result.testNames);

    details.push({
      suiteNames: result.suiteNames,
      testNames: result.testNames,
      filePath: specFile,
    });
  }

  return details;
};
