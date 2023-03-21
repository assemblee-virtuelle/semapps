const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const isEmptyAction = require('./actions/isEmpty');
const getAction = require('./actions/get');
const getAllAction = require('./actions/getAll');
const getUrisAction = require('./actions/getUris');
const headAction = require('./actions/head');
const includesAction = require('./actions/includes');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    podProvider: false,
    mirrorGraphName: null
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    detach: detachAction,
    exist: existAction,
    get: getAction.action,
    getAll: getAllAction,
    getUris: getUrisAction,
    includes: includesAction,
    post: postAction.action,
    patch: patchAction.action,
    isEmpty: isEmptyAction,
    // Actions accessible through the API
    api_get: getAction.api,
    api_post: postAction.api,
    api_head: headAction.api,
    api_patch: patchAction.api
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider && ctx.params.containerUri && ctx.params.containerUri.startsWith(this.settings.baseUrl)) {
          // If we have a pod provider, guess the dataset from the container URI
          const containerPath = new URL(ctx.params.containerUri).pathname;
          const parts = containerPath.split('/');
          if (parts.length > 1) {
            ctx.meta.dataset = parts[1];
          }
        }
      }
    }
  }
};
