export type CypressLDConfig = {
  sdkKey: string;
  baseUri?: string;
  eventsUri?: string;
  streamUri?: string;
  flagKey: string;
};

export type TestDetail = {
  suiteNames: string[];
  testNames: string[];
  filePath: string;
  fileName?: string;
};
