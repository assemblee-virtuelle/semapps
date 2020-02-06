const DbService = require('moleculer-db');
const uuid = require('uuid/v1');
const jsonld = require('jsonld');

const JsonLdStorageService = {
  mixins: [DbService],
  settings: {
    idField: '@id' // Use @id as the main ID field (used by MongoDB)
  },
  hooks: {
    before: {
      create: [
        function addId(ctx) {
          if (!ctx.params['@id']) {
            // If no ID has been set, generate one based on the container URI
            ctx.params['@id'] = this.settings.containerUri + uuid().substring(0, 8);
          }
          return ctx;
        }
      ],
      get: [
        function useUriAsId(ctx) {
          if( !ctx.params['id'].startsWith('http') ) {
            ctx.params['id'] = this.settings.containerUri + ctx.params['id'];
          }
        }
      ]
    },
    after: {
      create: [
        (ctx, res) => ctx.service.compactJson(res)
      ],
      get: [
        (ctx, res) => ctx.service.compactJson(res)
      ]
    }
  },
  methods: {
    compactJson(res) {
      return jsonld.compact(res, {
        '@context': this.settings.context
      })
    }
  }
};

module.exports = JsonLdStorageService;
