const DbService = require('moleculer-db');
const getApiRoutes = require('../routes/getApiRoutes');

const JsonLdStorageMixin = {
  mixins: [DbService],
  // settings: {
  //   idField: '@id' // Use @id as the main ID field (used by MongoDB)
  // },
  actions: {
    async get(ctx) {
      // Bypass the default action, to avoid thrown errors
      try {
        return await this._get(ctx, { id: ctx.params.id });
      } catch (e) {
        return null;
      }
    },
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
