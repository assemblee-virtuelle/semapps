const getAction = require('./actions/get');
const createAction = require('./actions/create');
const patchAction = require('./actions/patch');
const putAction = require('./actions/put');
const deleteAction = require('./actions/delete');
const existAction = require('./actions/exist');
const generateIdAction = require('./actions/generateId');
const uploadAction = require('./actions/upload');
const headAction = require('./actions/head');
const methods = require('./methods');

module.exports = {
  name: 'ldp.resource',
  settings: {
    baseUrl: null,
    ontologies: [],
    podProvider: false
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    exist: existAction,
    generateId: generateIdAction,
    create: createAction,
    upload: uploadAction,
    // Actions accessible through the API
    api_get: getAction.api,
    get: getAction.action,
    api_patch: patchAction.api,
    patch: patchAction.action,
    api_delete: deleteAction.api,
    delete: deleteAction.action,
    api_put: putAction.api,
    put: putAction.action,
    api_head: headAction.api
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider) {
          // If we have a pod provider, guess the dataset from the URI
          const uri =
            ctx.params.resourceUri ||
            ctx.params.containerUri ||
            (ctx.params.resource && (ctx.params.resource.id || ctx.params.resource['@id']));
          if (uri) {
            const containerPath = new URL(uri).pathname;
            const parts = containerPath.split('/');
            if (parts.length > 1) {
              ctx.meta.dataset = parts[1];
            }
          }
        }
      }
    }
  },
  methods
};
