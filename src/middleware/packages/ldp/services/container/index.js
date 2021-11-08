const urlJoin = require('url-join');
const defaultOptions = require('./defaultOptions');
const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const getAction = require('./actions/get');
const headAction = require('./actions/head');
const getAllAction = require('./actions/getAll');
const getOptionsAction = require('./actions/getOptions');
const registerAction = require('./actions/register');
const { getContainerFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: [],
    defaultOptions,
    podProvider: false
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    detach: detachAction,
    exist: existAction,
    getOptions: getOptionsAction,
    getAll: getAllAction,
    register: registerAction,
    // Actions accessible through the API
    api_get: getAction.api,
    api_head: headAction.api,
    get: getAction.action
  },
  async started() {
    this.registeredContainers = [];
    if (this.settings.containers.length > 0) {
      for (let container of this.settings.containers) {
        this.actions.register(container);
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

          const exists = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });
          if (!exists) {
            // Create the container
            await ctx.call('ldp.container.create', { containerUri, webId: 'system' });

            // Attach the container to its parent container
            const parentContainerUri = getContainerFromUri(containerUri);
            ctx.call('ldp.container.attach', {
              containerUri: parentContainerUri,
              resourceUri: containerUri,
              webId: 'system'
            });
          }
        }
      }
    }
  },
  hooks: {
    before: {
      '*'(ctx) {
        // If we have a pod provider, guess the dataset from the container URI
        if (this.settings.podProvider && ctx.params.containerUri) {
          const containerPath = new URL(ctx.params.containerUri).pathname;
          const parts = containerPath.split('/');
          if (parts.length > 1) {
            ctx.meta.dataset = parts[1];
          }
        }
      }
    }
  },
  methods: {
    getContainerUri(containerConfig) {
      const containerPath = typeof containerConfig === 'string' ? containerConfig : containerConfig.path;
      return urlJoin(this.settings.baseUrl, containerPath);
    }
  }
};
