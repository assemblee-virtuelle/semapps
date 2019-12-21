'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');

const { ACTIVITY_TYPES } = require('../constants');

module.exports = {
  name: 'activitypub.outbox',
  settings: {
    homeUrl: null
  },
  dependencies: ['triplestore', 'activitypub.collection'],
  actions: {
    async post({ params, broker }) {
      let activity;

      if (!ACTIVITY_TYPES.includes(params.type)) {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: this.generateId('subject/'),
          type: 'Create',
          object: {
            id: this.generateId('subject/'),
            ...params
          }
        };
      } else {
        activity = {
          id: this.generateId('subject/'),
          ...params
        };
      }

      // Use the current time for the activity's publish date
      // This will be used to order the ordered collections
      activity.published = new Date().toISOString();

      await broker.call('triplestore.insert', {
        resource: activity,
        accept: 'json'
      });

      // Attach the newly-created activity to the outbox
      await broker.call('activitypub.collection.attach', {
        collectionUri: this.settings.homeUrl + 'outbox',
        activityUri: activity.id
      });

      return await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');
    },
    async list(ctx) {
      ctx.meta.$responseType = 'application/json';

      return await ctx.call('activitypub.collection.query', {
        collectionUri: this.settings.homeUrl + 'outbox'
      });
    }
  },
  methods: {
    generateId(path = '') {
      return this.settings.homeUrl + path + uuid().substring(0, 8);
    }
  }
};
