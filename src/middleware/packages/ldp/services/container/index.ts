const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const createAndAttachAction = require('./actions/createAndAttach');
const deleteAction = require('./actions/delete');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const isEmptyAction = require('./actions/isEmpty');
const getAction = require('./actions/get');
const getAllAction = require('./actions/getAll');
const getPathAction = require('./actions/getPath');
const getUrisAction = require('./actions/getUris');
const includesAction = require('./actions/includes');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');
const { getDatasetFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    podProvider: false,
    mirrorGraphName: null
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    createAndAttach: createAndAttachAction,
    delete: deleteAction,
    detach: detachAction,
    exist: existAction,
    get: getAction,
    getAll: getAllAction,
    getPath: getPathAction,
    getUris: getUrisAction,
    includes: includesAction,
    isEmpty: isEmptyAction,
    post: postAction,
    patch: patchAction
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (
          this.settings.podProvider &&
          !ctx.meta.dataset &&
          ctx.params.containerUri &&
          ctx.params.containerUri.startsWith(this.settings.baseUrl)
        ) {
          // this.logger.warn(`No dataset found when calling ${ctx.action.name} with URI ${ctx.params.containerUri}`);
          ctx.meta.dataset = getDatasetFromUri(ctx.params.containerUri);
        }
      }
    }
  }
};
