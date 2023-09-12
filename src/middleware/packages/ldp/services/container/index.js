const urlJoin = require('url-join');
const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const isEmptyAction = require('./actions/isEmpty');
const getAction = require('./actions/get');
const getAllAction = require('./actions/getAll');
const getUrisAction = require('./actions/getUris');
const includesAction = require('./actions/includes');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');
const { getDatasetFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    podProvider: false,
    mirrorGraphName: null,
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    delete: deleteAction,
    detach: detachAction,
    exist: existAction,
    get: getAction,
    getAll: getAllAction,
    getUris: getUrisAction,
    includes: includesAction,
    isEmpty: isEmptyAction,
    post: postAction,
    patch: patchAction,
  },
  methods: {
    isRemoteUri(uri, dataset) {
      if (this.settings.podProvider && !dataset)
        throw new Error(`Unable to know if ${uri} is remote. In Pod provider config, the dataset must be provided`);
      return (
        !urlJoin(uri, '/').startsWith(this.settings.baseUrl) ||
        (this.settings.podProvider && !urlJoin(uri, '/').startsWith(`${urlJoin(this.settings.baseUrl, dataset)}/`))
      );
    },
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
      },
    },
  },
};
