const DbService = require('moleculer-db');
const uuid = require('uuid/v1');
const jsonld = require('jsonld');

const JsonLdStorageMixin = {
  mixins: [DbService],
  settings: {
    idField: '@id' // Use @id as the main ID field (used by MongoDB)
  },
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
    },
    after: {
      create: [(ctx, res) => ctx.service.compactJson(res)],
      find: [
        (ctx, res) => {
          if( Array.isArray(res) ) {
            return({
              '@context': {
                as: "https://www.w3.org/ns/activitystreams#",
                pair: "http://virtual-assembly.org/ontologies/pair#"
              },
              type: [
                "as:Collection",
                "as:OrderedCollection"
              ],
              orderedItems: res.map(json => {
                delete json['@context'];
                return json;
              }),
              totalItems: res.length
            })
          }
        }
      ]
      // get: [(ctx, res) => ctx.service.compactJson(res)]
    }
  },
  methods: {
    compactJson(res) {
      return jsonld.compact(res, {
        '@context': this.settings.context
      });
    }
  }
};

module.exports = JsonLdStorageMixin;
