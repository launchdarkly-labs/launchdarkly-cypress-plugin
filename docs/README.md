# Developing LaunchDarkly Cypress Plugin

1. Navigate to `cypress.config.ts` and update the `PLUGIN_FLAG_KEY` and `PLUGIN_SDK_KEY` env properties.

2. Run `npm run dev` to run the example cypress tests in `cypress/e2e` against the local plugin.

# Publish

- Run `npm login`
- Update package.json version
- Run `npm run version` to generate and push tags
- Run `npm publish`
- Navigate to Github and release the latest tag.

## Debug logs

To see debug logs from this plugin, prefix your Cypress tests with `DEBUG=ld-plugin`. For example `DEBUG=ld-plugin npm run cypress`
