/// <reference types="cypress" />

const { cypressLaunchDarklyPlugin } = require('../../lib');

module.exports = async (on, config) => {
  const ldConfig = {
    sdkKey: "",
    flagKey: "",
    // baseUri: "",
  }
  return await cypressLaunchDarklyPlugin(config, ldConfig);
}
