const DbService = require('moleculer-db');
const uuid = require('uuid/v1');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [DbService],
  adapter: null, // To be set by the user
  settings: {
    idField: '@id',
    baseUrl: 'http://localhost:3000/activities/'
  },
  collection: 'activities',
  actions: {
    get: {
      params: null,
      handler(ctx) {
        return this._get(ctx, { id: this.settings.baseUrl + ctx.params.activityId });
      }
    }
  },
  hooks: {
    before: {
      create: [
        function addId(ctx) {
          if (!ctx.params['@id']) {
            ctx.params['@id'] = this.settings.baseUrl + uuid().substring(0, 8);
          }
          return ctx;
        }
      ]
    }
  }
};

module.exports = ActivityService;
