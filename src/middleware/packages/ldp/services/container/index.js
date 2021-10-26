const urlJoin = require('url-join');
const defaultOptions = require('./defaultOptions');
const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const createManyAction = require('./actions/createMany');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const getAction = require('./actions/get');
const headAction = require('./actions/head');
const getAllAction = require('./actions/getAll');
const getOptionsAction = require('./actions/getOptions');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    defaultOptions,
    podProvider: false
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    createMany: createManyAction,
    detach: detachAction,
    exist: existAction,
    getOptions: getOptionsAction,
    getAll: getAllAction,
    // Actions accessible through the API
    api_get: getAction.api,
    api_head: headAction.api,
    get: getAction.action
  },
  hooks: {
    before: {
      '*'(ctx) {
        // If we have a pod provider, guess the dataset from the container URI
        if (this.settings.podProvider && !ctx.meta.dataset && ctx.params.containerUri) {
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
