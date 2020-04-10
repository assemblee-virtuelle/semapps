const DbService = require("moleculer-db");
const { TripleStoreAdapter } = require('@semapps/ldp');
const { objectCurrentToId, objectIdToCurrent } = require('../functions');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null, // To be set by the user
    expand: ['as:object'],
    context: 'https://www.w3.org/ns/activitystreams'
  },
  hooks: {
    before: {
      create: [
        function idToCurrent(ctx) {
          ctx.params = objectIdToCurrent(ctx.params);
          return ctx;
        }
      ]
    },
    after: {
      get: [
        function currentToId(ctx, activityJson) {
          return objectCurrentToId(activityJson);
        }
      ],
      create: [
        function currentToId(ctx, activityJson) {
          return objectCurrentToId(activityJson);
        }
      ],
      find: [
        function currentToId(ctx, containerJson) {
          return {
            ...containerJson,
            'ldp:contains': containerJson['ldp:contains'].map(activityJson => objectCurrentToId(activityJson))
          };
        }
      ]
    }
  },
  actions: {
    update() {
      throw new Error('Updating activities is not allowed');
    },
    remove() {
      throw new Error('Removing activities is not allowed');
    }
  }
};

module.exports = ActivityService;
