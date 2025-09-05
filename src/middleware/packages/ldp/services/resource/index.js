const awaitCreateCompleteAction = require('./actions/awaitCreateComplete');
const getAction = require('./actions/get');
const createAction = require('./actions/create');
const patchAction = require('./actions/patch');
const putAction = require('./actions/put');
const deleteAction = require('./actions/delete');
const existAction = require('./actions/exist');
const generateIdAction = require('./actions/generateId');
const getContainersAction = require('./actions/getContainers');
const getTypesAction = require('./actions/getTypes');
const uploadAction = require('./actions/upload');
const methods = require('./methods');
const { getDatasetFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.resource',
  settings: {
    baseUrl: null,
    podProvider: false,
    preferredViewForResource: null,
    binary: {
      maxSize: '50Mb'
    }
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    awaitCreateComplete: awaitCreateCompleteAction,
    create: createAction,
    delete: deleteAction,
    exist: existAction,
    generateId: generateIdAction,
    get: getAction,
    getContainers: getContainersAction,
    getTypes: getTypesAction,
    patch: patchAction,
    put: putAction,
    upload: uploadAction
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider && !ctx.meta.dataset) {
          // If we have a pod provider, guess the dataset from the URI
          const uri =
            ctx.params.resourceUri || (ctx.params.resource && (ctx.params.resource.id || ctx.params.resource['@id']));
          if (uri && uri.startsWith(this.settings.baseUrl)) {
            ctx.meta.dataset = getDatasetFromUri(uri);
          }
        }
      }
    }
  },
  methods
};
