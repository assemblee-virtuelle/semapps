const getAction = require('./actions/get');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');
const putAction = require('./actions/put');
const deleteAction = require('./actions/delete');
const existAction = require('./actions/exist');
const methods = require('./methods');

module.exports = {
  name: 'ldp.resource',
  settings: {
    baseUrl: null,
    ontologies: [],
    defaultAccept: null,
    defaultJsonContext: null
  },
  dependencies: ['triplestore'],
  actions: {
    exist: existAction,
    // Actions accessible through the API
    api_get: getAction.api,
    get: getAction.action,
    api_post: postAction.api,
    post: postAction.action,
    api_patch: patchAction.api,
    patch: patchAction.action,
    api_delete: deleteAction.api,
    delete: deleteAction.action,
    api_put: putAction.api,
    put: putAction.action
  },
  methods
};
