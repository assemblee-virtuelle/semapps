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
  dependencies: ['ldp.container', 'api', 'auth.account'],
  actions: {
    getByType: getByTypeAction,
    getByUri: getByUriAction,
    getUri: getUriAction,
    list: listAction,
    register: registerAction
  },
  async started() {
    this.registeredContainers = [];
    if (this.settings.containers.length > 0) {
      for (let container of this.settings.containers) {
        this.actions.register(container);
      }
    }
  },
  methods: {
    async createAndAttachContainer(ctx, containerUri, containerPath, controlledActions) {
      const exists = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });
      if (!exists) {
        await ctx.call('ldp.container.create', { containerUri, webId: 'system' });

        // 2. Attach the container to its parent container
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
    },
    async createAndAttachResource(ctx, resourceUri, resourcePath, controlledActions) {
      const exists = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
      if (!exists) {
        await ctx.call(controlledActions.create, { resourceUri, webId: 'system' });

        // 2. Attach the resource to its parent container
        const containerUri = getContainerFromUri(resourceUri);
        const containerExist = await ctx.call('ldp.container.exist', {
          containerUri,
          webId: 'system'
        });
        if (containerExist) {
          await ctx.call('ldp.container.attach', {
            containerUri,
            resourceUri,
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
        // Go through each registered containers
        for (let container of Object.values(this.registeredContainers)) {
          const containerUri = urlJoin(accountData.podUri, container.path);
          await this.createAndAttachContainer(ctx, containerUri, container.path);
        }
      }
    }
  }
};
