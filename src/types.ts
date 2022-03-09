export type CypressLDConfig = {
  sdkKey: string;
  baseUri?: string;
  eventsUri?: string;
  streamUri?: string;
  flagKey: string;
  userKey?: string;
  customAttributes?: { [key: string]: string };
};

export class TestData {
  tags: string[] = [];
  suiteName: string = '';
  testName: string = '';
}
