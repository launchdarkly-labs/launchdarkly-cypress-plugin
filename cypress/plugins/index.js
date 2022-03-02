/// <reference types="cypress" />

const { launchDarklyCypressPlugin } = require('../../lib');

module.exports = async (on, config) => {
  config = await launchDarklyCypressPlugin(config, {
    sdkKey: "YOUR-SDK-KEY",
    flagKey: "YOUR-FLAG-KEY",
  });

  // add other logic here ...

  return config;
}
