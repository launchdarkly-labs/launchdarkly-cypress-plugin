/// <reference types="cypress" />

const { cypressLaunchDarklyPlugin } = require('../../lib');

module.exports = async (on, config) => {
  config = await cypressLaunchDarklyPlugin(config, {
    sdkKey: "YOUR-SDK-KEY",
    flagKey: "YOUR-FLA-KEY",
  });

  // add other logic here ...

  return config;
}
