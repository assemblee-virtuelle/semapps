'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const triplestore = require('@semapps/triplestore');
const { ACTIVITY_TYPES, OBJECT_TYPES } = require('../constants');

const OutboxService = {
  name: 'activitypub.outbox',
  dependencies: ['webid', 'ldp', 'triplestore', 'activitypub.collection'],
  async started() {
    this.settings.usersContainer = await this.broker.call('webid.getUsersContainer');
    this.settings.ldpBaseUrl = await this.broker.call('ldp.getBaseUrl');
  },
  actions: {
    async post(ctx) {
      const { username, ...object } = ctx.params;
      let activity;

      const collectionExists = await ctx.call('activitypub.collection.exist', {
        collectionUri: this.getOutboxUri(username)
      });

      if (!collectionExists) {
        ctx.meta.$statusCode = 404;
        return;
      }

      if (Object.values(OBJECT_TYPES).includes(object.type)) {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: this.generateId('Create'),
          type: 'Create',
          to: object.to,
          actor: object.attributedTo,
          object: {
            id: this.generateId(object.type),
            ...object
          }
        };
      } else if (Object.values(ACTIVITY_TYPES).includes(object.type)) {
        activity = {
          id: this.generateId(object.type),
          ...object
        };
      } else {
        throw new Error('Unknown activity type: ' + object.type);
      }

      // Use the current time for the activity's publish date
      // This will be used to order the ordered collections
      activity.published = new Date().toISOString();

      ctx.call('triplestore.insert', {
        resource: activity,
        contentType: triplestore.SUPPORTED_CONTENT_MIME_TYPES.JSON,
        accept: triplestore.SUPPORTED_ACCEPT_MIME_TYPES.JSON
      });

      // Attach the newly-created activity to the outbox
      ctx.call('activitypub.collection.attach', {
        collectionUri: this.getOutboxUri(username),
        objectUri: activity.id
      });

      // Nicely format the JSON-LD
      activity = await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');

      ctx.emit('activitypub.outbox.posted', { activity });

      return activity;
    },
    async list(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      const collection = await ctx.call('activitypub.collection.queryOrderedCollection', {
        collectionUri: this.getOutboxUri(ctx.params.username),
        optionalTriplesToFetch: `
          ?item as:object ?object .
          ?object ?objectP ?objectO .
        `
      });

      if (collection) {
        return collection;
      } else {
        ctx.meta.$statusCode = 404;
      }
    }
  },
  methods: {
    generateId(objectType) {
      return this.settings.ldpBaseUrl + `as:${objectType}/` + uuid().substring(0, 8);
    },
    getOutboxUri(username) {
      return this.settings.usersContainer + username + '/outbox';
    }
  }
};

module.exports = OutboxService;
