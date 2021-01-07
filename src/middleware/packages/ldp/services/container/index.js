const urlJoin = require('url-join');
const attachAction = require('./actions/attach');
const clearAction = require('./actions/clear');
const createAction = require('./actions/create');
const detachAction = require('./actions/detach');
const existAction = require('./actions/exist');
const getAction = require('./actions/get');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: []
  },
  dependencies: ['ldp', 'triplestore'],
  actions: {
    attach: attachAction,
    clear: clearAction,
    create: createAction,
    detach: detachAction,
    exist: existAction,
    // Actions accessible through the API
    api_get: getAction.api,
    get: getAction.action
  },
  async started() {
    for (let container of this.settings.containers) {
      const containerPath = typeof container === 'string' ? container : container.path;
      const containerUri = urlJoin(this.settings.baseUrl, containerPath);
      const exists = await this.actions.exist({ containerUri });
      if (!exists) {
        console.log(`Container ${containerUri} doesn't exist, creating it...`);
        await this.actions.create({ containerUri });
      }
    }
  }
};
