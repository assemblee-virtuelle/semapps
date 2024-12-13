const urlJoin = require('url-join');
const getByTypeAction = require('./actions/getByType');
const getByUriAction = require('./actions/getByUri');
const getDescriptionByTypeAction = require('./actions/getDescriptionByType');
const getUriAction = require('./actions/getUri');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');
const defaultOptions = require('./defaultOptions');

module.exports = {
  name: 'ldp.registry',
  settings: {
    baseUrl: null,
    containers: [],
    defaultOptions,
    podProvider: false
  },
  dependencies: ['ldp.container', 'api'],
  actions: {
    getByType: getByTypeAction,
    getByUri: getByUriAction,
    getDescriptionByType: getDescriptionByTypeAction,
    getUri: getUriAction,
    list: listAction,
    register: registerAction
  },
  async started() {
    this.registeredContainers = {};
    if (this.settings.podProvider) {
      // The auth.account service is a dependency only in POD provider config
      await this.broker.waitForServices(['auth.account']);
    }
    for (let container of this.settings.containers) {
      // Ensure backward compatibility
      if (typeof container === 'string') container = { path: container };
      // We await each container registration so they happen in order (root container first)git
      await this.actions.register(container);
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId, accountData } = ctx.params;
      // We want to add user's containers only in Pod provider config
      if (this.settings.podProvider) {
        const podUrl = await ctx.call('solid-storage.getUrl', { webId });
        const registeredContainers = await this.actions.list({ dataset: accountData.username }, { parentCtx: ctx });
        // Go through each registered containers
        for (const container of Object.values(registeredContainers)) {
          await ctx.call('ldp.container.createAndAttach', {
            containerUri: urlJoin(podUrl, container.path),
            webId
          });
        }
      }
    }
  }
};
