const DbService = require('moleculer-db');
const getApiRoutes = require('../routes/getApiRoutes');

const JsonLdStorageMixin = {
  mixins: [DbService],
  actions: {
    getApiRoutes() {
      return getApiRoutes({
        containerUri: this.settings.containerUri,
        services: {
          get: this.name + '.get',
          list: this.name + '.find',
          post: this.name + '.create',
          patch: this.name + '.update',
          delete: this.name + '.remove'
        }
      });
    }
  }
};

module.exports = JsonLdStorageMixin;
