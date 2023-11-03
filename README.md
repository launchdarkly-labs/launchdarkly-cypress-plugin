# LaunchDarkly Cypress Plugin

> Filter cypress tests using LaunchDarkly feature flags

**Required**: You need a LaunchDarkly account to use this plugin. Don't already have one? click [here](https://app.launchdarkly.com) to create one.

## Installation

```bash
$ npm install launchdarkly-cypress-plugin
```

if using yarn run

```bash
$ yarn add launchdarkly-cypress-plugin
```

### Setup

1. Create a [LaunchDarkly feature flag](https://docs.launchdarkly.com/guides/best-practices/creating-flags) with a boolean variation. You can call this flag anything you like. Optionally, you can check the `This is a permanent flag` checkbox.

**Optional** You can also create an environment for your Cypress tests.

2. Go to Account settings -> Projects, search for your environment and copy the SDK key for the environment you will be using.

3. Load and configure the plugin from your cypress [plugin file](https://on.cypress.io/writing-and-organizing-tests#Plugins-file).

**cypress.config.js**

![Plugin Configuration](./images/plugin-setup.png)

Note the `async` keyword on the `setupNodeEvents` function. Cypress will `await` the results of the Promise returned.

4. Register the support configuration in your cypress support file.

**cypress/support/index.js**

![Support Configuration](./images/support-setup.png)

## Skipping your tests

With your flag turned on and returning a default variation of `false`, you can target specific tests or suites using the `suite` or `test` attributes from the `cypress` context kind. Your test suites and test names will be automatically populated in the targeting rule dropdowns for you.

![Flag Configuration](./images/flag-config.png)

When the flag evaluates to true, the matched tests or suites will be skipped by Cypress. See the [Cypress docs](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Test-statuses) for more details about test statuses.
