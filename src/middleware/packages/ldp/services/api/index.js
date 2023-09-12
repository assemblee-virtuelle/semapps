const urlJoin = require('url-join');
const deleteAction = require('./actions/delete');
const getAction = require('./actions/get');
const headAction = require('./actions/head');
const patchAction = require('./actions/patch');
const postAction = require('./actions/post');
const putAction = require('./actions/put');
const getCatchAllRoute = require('../../routes/getCatchAllRoute');

module.exports = {
  name: 'ldp.api',
  settings: {
    baseUrl: null,
    podProvider: false
  },
  dependencies: ['api'],
  actions: {
    delete: deleteAction,
    get: getAction,
    head: headAction,
    patch: patchAction,
    post: postAction,
    put: putAction
  },
  async started() {
    await this.broker.call('api.addRoute', { route: getCatchAllRoute(this.settings.podProvider) });
  },
  methods: {
    getUriFromSlugParts(slugParts) {
      if (!slugParts || slugParts.length === 0) slugParts = ['/']; // Root container
      return urlJoin(this.settings.baseUrl, ...slugParts);
    }
  }
};
