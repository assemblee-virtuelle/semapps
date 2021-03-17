const urlJoin = require('url-join');
const defaultOptions = require('./defaultOptions');
const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const getAction = require('./actions/get');
const headAction = require('./actions/head');
const getOptionsAction = require('./actions/getOptions');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: [],
    aclEnabled: false,
    defaultOptions
  },
  dependencies: ['triplestore'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    detach: detachAction,
    exist: existAction,
    getOptions: getOptionsAction,
    // Actions accessible through the API
    api_get: getAction.api,
    api_head: headAction.api,
    get: getAction.action
  },
  async started() {
    // 1st loop: Create all containers defined in configurations
    for (let container of this.settings.containers) {
      const containerUri = this.getContainerUri(container);
      const exists = await this.actions.exist({ containerUri }, { meta: { webId: 'system' } });
      if (!exists) {
        console.log(`Container ${containerUri} doesn't exist, creating it...`);
        await this.actions.create({ containerUri }, { meta: { webId: 'system' } });
      }
    }

    // 2nd loop: Attach child containers to parent containers
    // Child containers must have been created first, or the attach action will fail
    for (let container of this.settings.containers) {
      const containerUri = this.getContainerUri(container);

      // Find all children containers for this container
      const childContainersUris = this.settings.containers
        .map(childContainer => this.getContainerUri(childContainer))
        .filter(childContainerUri => childContainerUri !== containerUri && childContainerUri.startsWith(containerUri));

      for (let childContainerUri of childContainersUris) {
        console.log(`Attaching ${childContainerUri} to ${containerUri}...`);
        await this.actions.attach({ containerUri, resourceUri: childContainerUri, webId: 'system' });
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
