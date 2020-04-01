const getAction = require('./actions/get');
const getByTypeAction = require('./actions/getByType');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');
const deleteAction = require('./actions/delete');
const methods = require('./methods');

module.exports = {
  name: 'ldp.resource',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  dependencies: ['triplestore'],
  actions: {
    api_getByType: getByTypeAction.api,
    getByType: getByTypeAction.action,
    api_get: getAction.api,
    get: getAction.action,
    api_post: postAction.api,
    post: postAction.action,
    api_patch: patchAction.api,
    patch: patchAction.action,
    api_delete: deleteAction.api,
    delete: deleteAction.action
  },
  methods
};

