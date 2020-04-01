const attach = require('./actions/attach');
const create = require('./actions/create');
const exist = require('./actions/exist');
const get = require('./actions/get');
const getRoutes = require('./actions/getRoutes');

module.exports = {
  name: 'ldp.container',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: []
  },
  dependencies: ['triplestore'],
  actions: {
    attach,
    create,
    exist,
    get,
    getRoutes
  },
  async started(ctx) {
    for (let containerPath of this.settings.containers) {
      const containerUri = this.settings.baseUrl + containerPath;
      const exists = await this.actions.exist({ containerUri });
      if (!exists) {
        console.log(`Container ${containerUri} doesn't exist, creating it...`);
        await this.actions.create({ containerUri });
      }
    }
  }
};
