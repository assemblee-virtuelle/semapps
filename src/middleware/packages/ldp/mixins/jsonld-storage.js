const DbService = require('moleculer-db');
const uuid = require('uuid/v1');
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
    clear(ctx) {
      this.adapter.clear(ctx);
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
  },
  hooks: {
    before: {
      create: [
        function addId(ctx) {
          if (!ctx.params.id && !ctx.params['@id']) {
            // If no ID has been set, generate one based on the container URI
            if (ctx.params.slug) {
              ctx.params['@id'] = ctx.service.schema.settings.containerUri + ctx.params.slug;
              delete ctx.params.slug;
            } else {
              ctx.params['@id'] = ctx.service.schema.settings.containerUri + uuid().substring(0, 8);
            }
          }
          return ctx;
        },
        function addContext(ctx) {
          if (!ctx.params['@context']) {
            ctx.params['@context'] = ctx.service.schema.settings.context;
          }
          return ctx;
        }
      ],
      update: [
        function addContext(ctx) {
          if (!ctx.params['@context']) {
            ctx.params['@context'] = ctx.service.schema.settings.context;
          }
          return ctx;
        },
        function useUriAsId(ctx) {
          const idField = ctx.params['@id'] ? '@id' : 'id';
          if (ctx.params[idField] && !ctx.params[idField].startsWith('http')) {
            ctx.params[idField] = ctx.service.schema.settings.containerUri + ctx.params[idField];
          }
        }
      ],
      get: [
        function useUriAsId(ctx) {
          if (!ctx.params['id'].startsWith('http')) {
            ctx.params['id'] = ctx.service.schema.settings.containerUri + ctx.params['id'];
          }
        }
      ]
    }
  }
};

module.exports = JsonLdStorageMixin;
