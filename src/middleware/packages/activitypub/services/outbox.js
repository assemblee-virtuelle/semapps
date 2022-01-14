const { MoleculerError } = require('moleculer').Errors;
const ControlledCollectionMixin = require('../mixins/controlled-collection');
const { collectionPermissionsWithAnonRead, objectIdToCurrent} = require('../utils');
const { ACTOR_TYPES } = require('../constants');
const {MIME_TYPES} = require("@semapps/mime-types");

const OutboxService = {
  name: 'activitypub.outbox',
  mixins: [ControlledCollectionMixin],
  settings: {
    path: '/outbox',
    attachToTypes: Object.values(ACTOR_TYPES),
    attachPredicate: 'https://www.w3.org/ns/activitystreams#outbox',
    ordered: true,
    itemsPerPage: 10,
    dereferenceItems: true,
    sort: { predicate: 'as:published', order: 'DESC' },
    permissions: collectionPermissionsWithAnonRead
  },
  dependencies: ['activitypub.object', 'activitypub.collection'],
  actions: {
    async post(ctx) {
      let { collectionUri, ...activity } = ctx.params;

      const collectionExists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExists) {
        throw new MoleculerError('Collection not found:' + collectionUri, 404, 'NOT_FOUND');
      }

      // Ensure logged user is posting to his own outbox
      const actorUri = await ctx.call('activitypub.collection.getOwner', { collectionUri, collectionKey: 'outbox' });
      if (ctx.meta.webId && ctx.meta.webId !== 'system' && actorUri !== ctx.meta.webId) {
        throw new MoleculerError('You are not allowed to post to this outbox', 403, 'FORBIDDEN');
      }

      if (!activity['@context']) {
        activity['@context'] = this.settings.jsonContext;
      }

      // Process object create, update or delete
      // and return an activity with the object ID
      activity = await ctx.call('activitypub.object.process', { activity, actorUri });

      if (!activity.actor) {
        activity.actor = actorUri;
      }

      // Use the current time for the activity's publish date
      // TODO use it to order the ordered collections
      activity.published = new Date().toISOString();

      const activitiesContainerUri = await this.broker.call('activitypub.activity.getContainerUri', { webId: actorUri });

      const activityUri = await ctx.call('activitypub.activity.post', {
        containerUri: activitiesContainerUri,
        resource: activity,
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });

      activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri, webId: 'system' });

      // Attach the newly-created activity to the outbox
      await ctx.call('activitypub.collection.attach', {
        collectionUri,
        item: activity
      });

      ctx.emit('activitypub.outbox.posted', { activity }, { meta: { webId: null, dataset: null } });

      ctx.meta.$responseHeaders = {
        Location: activityUri,
        'Content-Length': 0
      };

      ctx.meta.$statusCode = 201;

      // TODO do not return activity when calling through HTTP
      return activity;
    }
  }
};

module.exports = OutboxService;
