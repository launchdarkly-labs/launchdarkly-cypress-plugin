export type CypressLDConfig = {
  sdkKey: string;
  flagKey: string;
  baseUri?: string;
  eventsUri?: string;
  streamUri?: string;
};

export class TestContext {
  suiteName: string = '';
  testName: string = '';
}
