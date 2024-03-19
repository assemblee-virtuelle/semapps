const urlJoin = require('url-join');
const getByTypeAction = require('./actions/getByType');
const getByUriAction = require('./actions/getByUri');
const getUriAction = require('./actions/getUri');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');
const defaultOptions = require('./defaultOptions');
const { getParentContainerUri, getParentContainerPath } = require('../../utils');

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
    this.registeredContainers = {};
    if (this.settings.podProvider) {
      // The auth.account service is a dependency only in POD provider config
      await this.broker.waitForServices(['auth.account']);
    }
    for (let container of this.settings.containers) {
      // Ensure backward compatibility
      if (typeof container === 'string') container = { path: container };
      // We await each container registration so they happen in order (root container first)
      await this.actions.register(container);
    }
  },
  methods: {
    async createAndAttachContainer(ctx, containerUri, containerPath, options) {
      const exists = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });

      if (!exists) {
        let parentContainerUri;
        let parentContainerPath;

        // Create the parent container, if it doesn't exist yet
        if (containerPath !== '/') {
          parentContainerUri = getParentContainerUri(containerUri);
          parentContainerPath = getParentContainerPath(containerPath) || '/';

          // if it is the root container, add a trailing slash
          if (urlJoin(parentContainerUri, '/') === urlJoin(this.settings.baseUrl, '/')) {
            parentContainerUri = urlJoin(parentContainerUri, '/');
          }

          const parentExists = await ctx.call('ldp.container.exist', {
            containerUri: parentContainerUri,
            webId: 'system'
          });

          if (!parentExists) {
            // Recursively create the parent containers, without options
            await this.createAndAttachContainer(ctx, parentContainerUri, parentContainerPath, {});
          }
        }

        // Then create the container
        await ctx.call('ldp.container.create', {
          containerUri,
          options, // Used by WebACL middleware if it exists
          webId: 'system'
        });

        // Then attach the container to its parent container
        if (parentContainerUri) {
          await ctx.call('ldp.container.attach', {
            containerUri: parentContainerUri,
            resourceUri: containerUri,
            webId: 'system'
          });
        }
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { accountData } = ctx.params;
      // We want to add user's containers only in POD provider config
      if (this.settings.podProvider) {
        const registeredContainers = await this.actions.list({ dataset: accountData.username }, { parentCtx: ctx });
        // Go through each registered containers
        for (const container of Object.values(registeredContainers)) {
          const containerUri = urlJoin(accountData.podUri, container.path);
          await this.createAndAttachContainer(ctx, containerUri, container.path);
        }
      }
    }
  }
};
