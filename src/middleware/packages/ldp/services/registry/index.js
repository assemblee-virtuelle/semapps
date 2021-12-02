const urlJoin = require('url-join');
const getByTypeAction = require('./actions/getByType');
const getByUriAction = require('./actions/getByUri');
const getUriAction = require('./actions/getUri');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');
const defaultOptions = require('./defaultOptions');
const { getContainerFromUri } = require('../../utils');

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
    getUri: getUriAction,
    list: listAction,
    register: registerAction
  },
  async started() {
    this.registeredContainers = [];
    if (this.settings.podProvider) {
      // The auth.account service is a dependency only in POD provider config
      await this.broker.waitForServices(['auth.account']);
    }
    if (this.settings.containers.length > 0) {
      for (let container of this.settings.containers) {
        // Ensure backward compatibility
        if (typeof container === 'string') container = { path: container };
        // Do not await this action, as we need the service to be available for the WebACL middleware
        this.actions.register(container);
      }
    }
  },
  methods: {
    async createAndAttachContainer(ctx, containerUri, containerPath) {
      const exists = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });
      if (!exists) {
        // Then create the container
        await ctx.call('ldp.container.create', { containerUri, webId: 'system' });

        // First attach the container to its parent container
        // This will avoid WebACL error, in case the container is fetched before
        if (containerPath !== '/') {
          const parentContainerUri = getContainerFromUri(containerUri);
          const parentExists = await ctx.call('ldp.container.exist', {
            containerUri: parentContainerUri,
            webId: 'system'
          });
          if (parentExists) {
            await ctx.call('ldp.container.attach', {
              containerUri: parentContainerUri,
              resourceUri: containerUri,
              webId: 'system'
            });
          }
        }
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { accountData } = ctx.params;
      // We want to add user's containers only in POD provider config
      if (this.settings.podProvider) {
        // Go through each registered containers
        for (let container of Object.values(this.registeredContainers)) {
          const containerUri = urlJoin(accountData.podUri, container.path);
          await this.createAndAttachContainer(ctx, containerUri, container.path);
        }
      }
    }
  }
};
