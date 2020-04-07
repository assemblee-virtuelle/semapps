const { JsonLdStorageMixin } = require('@semapps/ldp');

const ActivityService = {
  name: 'activitypub.activity',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  collection: 'activities',
  settings: {
    containerUri: null, // To be set by the user
    level: 1,
    context: 'https://www.w3.org/ns/activitystreams',
  },
  hooks: {
    before: {
      create: [
        function idToCurrent(ctx) {
          ctx.params = this.idToCurrent(ctx.params);
          return ctx;
        }
      ]
    },
    after: {
      get: [
        function currentToId(ctx, activityJson) {
          return this.currentToId(activityJson);
        }
      ],
      find: [
        function currentToId(ctx, containerJson) {
          return {
            ...containerJson,
            'ldp:contains': containerJson['ldp:contains'].map(activityJson => this.currentToId(activityJson))
          };
        }
      ]
    }
  },
  methods: {
    idToCurrent(activityJson) {
      if( activityJson.object ) {
        const { id, ...object } = activityJson.object;
        return {
          ...activityJson,
          object: {
            current: id,
            ...object
          }
        };
      } else {
        return activityJson;
      }
    },
    currentToId(activityJson) {
      if( activityJson.object ) {
        const { current, ...object } = activityJson.object;
        return {
          ...activityJson,
          object: {
            id: current,
            ...object
          }
        };
      } else {
        return activityJson;
      }
    }
  }
};

module.exports = ActivityService;
