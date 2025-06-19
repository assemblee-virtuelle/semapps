import urlJoin from 'url-join';
import { E as Errors } from 'moleculer-web';
import { SpecialEndpointMixin, ControlledContainerMixin, getDatasetFromUri, arrayOf } from '@semapps/ldp';
import { ACTIVITY_TYPES } from '@semapps/activitypub';
import { MIME_TYPES } from '@semapps/mime-types';
import { namedNode } from '@rdfjs/data-model';
import { uuidV4 as v4 } from 'uuid';
import moment from 'moment';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';

/**
 * Solid Notification Channel mixin.
 * Use this mixin to implement solid notification channels.
 * The settings, actions, and methods to be implemented are marked in the code.
 *
 * By default, this service supports the following features:
 * - `notify:endAt`, `notify:startAt` channel properties to only trigger events within these time bounds.
 * - `notify:state` for resources (will return `dc:modified`
 * - `notify:rate` the channel's min duration between firing events.
 *
 * Note: modifying a channel resource using the ldp API will not take effect until a server restart.
 */
const Schema = {
  // name: 'solid-notifications.provider.<ChannelType>',
  mixins: [ControlledContainerMixin, SpecialEndpointMixin],
  settings: {
    // Channel properties (to be overridden)
    channelType: null, // E.g. 'WebhookChannel2023',
    typePredicate: null, // E.g. 'notify:WebhookChannel2023', defaults to `notify:${this.settings.channelType}`,
    acceptedTypes: [], // E.g. ['notify:WebhookChannel2023'],
    sendOrReceive: null, // Either 'send' or 'receive' (will set `sendTo` or `receiveFrom` URIs).

    baseUrl: null,
    // ControlledContainerMixin
    excludeFromMirror: true,
    activateTombstones: false,
    // Like the CSS, we allow anyone with the URI of the channel to read and delete it
    // https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/notifications/#unsubscribing-from-a-notification-channel
    newResourcesPermissions: {
      anon: {
        read: true,
        write: true
      }
    },

    // SpecialEndpointMixin (to be filled by channels services)
    settingsDataset: null,
    endpoint: {
      path: null,
      initialData: {}
    }
  },
  dependencies: ['api', 'solid-endpoint'],
  async created() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is required');
    if (this.settings.sendOrReceive !== 'receive' && this.settings.sendOrReceive !== 'send')
      throw new Error('The setting `sendOrReceive` must be set to `send` or `receive`, depending on channelType.');
    if (!this.settings.channelType) throw new Error('The setting channelType must be set (e.g. `WebhookChannel2023`).');
    if (!this.settings.typePredicate) this.settings.typePredicate = `notify:${this.settings.channelType}`;
    if (this.settings.acceptedTypes?.length <= 0) this.settings.acceptedTypes = [this.settings.typePredicate];
  },
  async started() {
    const { channelType } = this.settings;

    await this.broker.call('solid-endpoint.endpointAdd', {
      predicate: namedNode('http://www.w3.org/ns/solid/notifications#subscription'),
      object: namedNode(urlJoin(this.settings.baseUrl, '.notifications', channelType))
    });

    this.channels = [];

    // Do not await all channels to be loaded
    this.loadChannelsFromDb({ removeOldChannels: true });
  },
  actions: {
    endpointPost: defineAction({
      // Action called by the SpecialEndpointMixin when POSTing to the endpoint
      async handler(ctx) {
        // Expect format https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/notifications/#webhooks
        // Correct context: https://github.com/solid/vocab/blob/main/solid-notifications-context.jsonld
        const type = ctx.params.type || ctx.params['@type'];
        const topic = ctx.params.topic || ctx.params['notify:topic'];
        const sendToParam = ctx.params.sendTo || ctx.params['notify:sendTo'];
        const { webId } = ctx.meta;

        // TODO: Use ldo objects; This will only check for the json type and not parse json-ld variants...
        if (!this.settings.acceptedTypes.includes(type) && this.settings.channelType !== type)
          throw new Error(`Only one of ${this.settings.acceptedTypes} is accepted on this endpoint`);

        // Ensure topic exist (LDP resource, container or collection)
        const exists = await ctx.call('ldp.resource.exist', {
          resourceUri: topic,
          webId: 'system'
        });
        if (!exists) throw new E.BadRequestError('Cannot watch non-existing resource');

        // Ensure topic can be watched by the authenticated agent
        const rights = await ctx.call('webacl.resource.hasRights', {
          resourceUri: topic,
          rights: { read: true },
          webId
        });
        // TODO: Should a client without read rights know about the existence of that resource?
        if (!rights.read) throw new E.ForbiddenError('You need acl:Read rights on the resource');

        // Find container URI from topic (must be stored on same Pod)
        const topicWebId = urlJoin(this.settings.baseUrl, getDatasetFromUri(topic));
        const channelContainerUri = await this.actions.getContainerUri({ webId: topicWebId }, { parentCtx: ctx });

        // Create receiveFrom URI if needed (e.g. for web sockets).
        const receiveFrom =
          (this.settings.sendOrReceive === 'receive' && (await this.createReceiveFromUri(topic, webId))) || undefined;
        const sendTo = (this.settings.sendOrReceive === 'send' && sendToParam) || undefined;

        // Post channel on Pod
        const channelUri = await this.actions.post(
          {
            containerUri: channelContainerUri,
            resource: {
              type: this.settings.typePredicate,
              'notify:topic': topic,
              'notify:sendTo': sendTo,
              'notify:receiveFrom': receiveFrom
            },
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          },
          { parentCtx: ctx }
        );

        // Keep track of channel internally.
        const channel = {
          id: channelUri,
          topic,
          sendTo,
          receiveFrom,
          webId: topicWebId
        };
        this.channels.push(channel);
        this.onChannelCreated(channel);

        ctx.meta.$responseType = 'application/ld+json';
        return this.actions.get(
          {
            resourceUri: channelUri,
            accept: MIME_TYPES.JSON,
            webId: 'system'
          },
          { parentCtx: ctx }
        );
      }
    }),

    getCache: defineAction({
      handler() {
        return this.channels;
      }
    }),

    resetCache: defineAction({
      handler() {
        this.channels = [];
      }
    })
  },
  events: {
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri, newData } = ctx.params;
        this.onResourceEvent(resourceUri, ACTIVITY_TYPES.CREATE, newData['dc:modified']);
      }
    }),

    'ldp.resource.updated': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri, newData } = ctx.params;
        this.onResourceEvent(resourceUri, ACTIVITY_TYPES.UPDATE, newData['dc:modified']);
      }
    }),

    'ldp.resource.patched': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri } = ctx.params;
        this.onResourceEvent(resourceUri, ACTIVITY_TYPES.UPDATE, await this.getModified(resourceUri));
      }
    }),

    'ldp.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri } = ctx.params;
        this.onResourceEvent(resourceUri, ACTIVITY_TYPES.DELETE, new Date().toISOString());
      }
    }),

    'ldp.container.attached': defineServiceEvent({
      async handler(ctx) {
        const { containerUri, resourceUri } = ctx.params;
        this.onContainerOrCollectionEvent(containerUri, resourceUri, ACTIVITY_TYPES.ADD);
      }
    }),

    'ldp.container.detached': defineServiceEvent({
      async handler(ctx) {
        const { containerUri, resourceUri } = ctx.params;
        this.onContainerOrCollectionEvent(containerUri, resourceUri, ACTIVITY_TYPES.REMOVE);
      }
    }),

    'activitypub.collection.added': defineServiceEvent({
      async handler(ctx) {
        const { collectionUri, itemUri, item } = ctx.params;
        // Mastodon sometimes send unfetchable activities (like `Accept` activities)
        // In this case, we receive the activity as `item` and `itemUri` is undefined
        // We will send a notification to the listener with the whole activity
        this.onContainerOrCollectionEvent(collectionUri, itemUri || item, ACTIVITY_TYPES.ADD);
      }
    }),

    'activitypub.collection.removed': defineServiceEvent({
      async handler(ctx) {
        const { collectionUri, itemUri } = ctx.params;
        this.onContainerOrCollectionEvent(collectionUri, itemUri, ACTIVITY_TYPES.REMOVE);
      }
    })
  },
  methods: {
    async getModified(resourceUri) {
      return await this.broker.call('ldp.resource.get', { resourceUri, webId: 'system' })?.['dc:modified'];
    },
    getMatchingChannels(topic) {
      const now = new Date();
      const matchedChannels = this.channels
        .filter(c => c.topic === topic)
        .filter(c => (c.startAt ? new Date(c.startAt) <= now : true))
        .filter(c => (c.endAt ? new Date(c.endAt) > now : true))
        // Check if rate is exceeded.
        .filter(c => {
          if (!(c.lastTriggered && c.rate)) return true;
          return moment.duration(c.rate).asMilliseconds() < now - c.lastTriggered;
        });

      return matchedChannels;
    },
    onContainerOrCollectionEvent(containerOrCollectionUri, resourceUriOrResource, type) {
      const activity = {
        '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
        id: `urn:uuid:${uuidV4()}`,
        type,
        object: resourceUriOrResource,
        target: containerOrCollectionUri
      };
      this.triggerChannelsForTopic(containerOrCollectionUri, activity);
    },
    onResourceEvent(resourceUri, type, state) {
      const activity = {
        '@context': ['https://www.w3.org/ns/activitystreams', 'https://www.w3.org/ns/solid/notifications-context/v1'],
        id: `urn:uuid:${uuidV4()}`,
        type,
        object: resourceUri,
        state
      };
      this.triggerChannelsForTopic(resourceUri, activity);
    },
    async triggerChannelsForTopic(topicUri, activity) {
      const channelsToTrigger = this.getMatchingChannels(topicUri);

      // First set lastTriggered, so channels with rate are not triggered multiple times.
      const now = new Date();
      for (const channel of channelsToTrigger) {
        channel.lastTriggered = now;
      }

      // Trigger onEvent for each channel (handled by implementing service).
      await Promise.all(
        channelsToTrigger.map(async channel => {
          await this.onEvent(channel, activity);
        })
      );
    },
    async loadChannelsFromDb({ removeOldChannels }) {
      const accounts = await this.broker.call('auth.account.find');
      for (const { webId } of accounts) {
        this.logger.debug(`Loading notification channels of ${webId}...`);
        try {
          const container = await this.actions.list({ webId });
          for (const channel of arrayOf(container['ldp:contains'])) {
            // Remove channels where endAt is in the past.
            if (removeOldChannels && channel['notify:endAt'] < new Date()) {
              this.broker.call('ldp.resource.delete', {
                resourceUri: channel.id || channel['@id'],
                webId: 'system'
              });
              continue;
            }

            this.channels.push({
              id: channel.id || channel['@id'],
              topic: channel['notify:topic'],
              sendTo: channel['notify:sendTo'],
              receiveFrom: channel['notify:receiveFrom'],
              startAt: channel['notify:startAt'],
              endAt: channel['notify:endAt'],
              accept: channel['notify:accept'],
              rate: channel['notify:rate'],
              webId
            });
          }
        } catch (e) {
          this.logger.error(`Could not load notifications channels of ${webId}. Error: ${e.message}`);
        }
      }
    },
    // METHODS TO IMPLEMENT by implementing service.
    //
    async onEvent(channel, activity) {
      // This will be called for each channel when its topic changed.
      // The activity is to be sent to the subscriber by the implementing service.
      // Please add `published: new Date().toISOString()` to the activity when you send it.
      throw new Error('Not implemented. Please implement this method in your service.');
    },
    async createReceiveFromUri(topic, webId) {
      // Create a random URI to be registered for `receiveFrom` for a new channel under `this.channels`.
      throw new Error('Not implemented. Please implement this method in your service.');
    },
    onChannelCreated(channel) {
      // Do nothing by default. Can be overridden.
    },
    onChannelDeleted(channel) {
      // Do nothing by default. Can be overridden.
    }
  },

  hooks: {
    after: {
      delete(ctx, res) {
        const { resourceUri } = ctx.params;
        const channel = this.channels.find(c => c.id === resourceUri);
        this.channels = this.channels.filter(c => c.id !== resourceUri);
        this.onChannelDeleted(channel);
        return res;
      }
    }
  }
} satisfies ServiceSchema;

export default Schema;
