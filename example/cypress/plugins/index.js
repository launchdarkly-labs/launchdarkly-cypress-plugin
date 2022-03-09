/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { launchDarklyCypressPlugin } = require('launchdarkly-cypress-plugin');

 /**
 * @type {Cypress.PluginConfig}
 */
module.exports = async (on, config) => {
   config = await launchDarklyCypressPlugin(config, {
     sdkKey: "YOUR-SDK-KEY",
     flagKey: "YOUR-FLAG-KEY",
     customAttributes: {
       exampleKey: 'exampleValue'
     }
   });
 
   // add other logic here ...
 
   return config;
 }