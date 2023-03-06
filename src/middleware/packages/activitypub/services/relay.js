const urlJoin = require('url-join');
const fetch = require('node-fetch');
const { MIME_TYPES } = require('@semapps/mime-types');
const { defaultToArray } = require('../utils');
const { ACTIVITY_TYPES, ACTOR_TYPES, OBJECT_TYPES, PUBLIC_URI } = require('../constants');
const ActivitiesHandlerMixin = require("../mixins/activities-handler");

const RelayService = {
  name: 'activitypub.relay',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUri: null,
    acceptFollowers: true,
    actor: {
      username: 'relay',
      name: 'Relay actor for Mirror and Inference service'
    }
  },
  dependencies: [
    'triplestore',
    'jsonld',
    'webfinger',
    'activitypub',
    'activitypub.follow',
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],
  async started() {
    const containers = await this.broker.call('ldp.registry.list');

    let actorContainer;
    Object.values(containers).forEach(c => {
      // we take the first container that accepts the type 'Application'
      if (c.acceptedTypes && !actorContainer && defaultToArray(c.acceptedTypes).includes('Application'))
        actorContainer = c.path;
    });

    if (!actorContainer) {
      const errorMsg =
        "RelayService cannot start. You must configure at least one container that accepts the type 'Application'. see acceptedTypes in your containers.js config file";
      throw new Error(errorMsg);
    }

    const actorSettings = this.settings.actor;
    const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });
    this.logger.info('actorExist ' + actorExist);

    const containerUri = urlJoin(this.settings.baseUri, actorContainer);
    const uri = urlJoin(containerUri, actorSettings.username);
    this.relayActorUri = uri;

    // creating the local actor 'relay'
    if (!actorExist) {
      this.logger.info(`ActorService > Actor "${actorSettings.name}" does not exist yet, creating it...`);

      const account = await this.broker.call(
        'auth.account.create',
        {
          username: actorSettings.username,
          webId: uri
        },
        { meta: { isSystemCall: true } }
      );

      try {
        // Wait until relay container has been created (needed for integration tests)
        let containerExist;
        do {
          containerExist = await this.broker.call('ldp.container.exist', { containerUri });
        } while (!containerExist);

        await this.broker.call('ldp.container.post', {
          containerUri,
          slug: actorSettings.username,
          resource: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            type: ACTOR_TYPES.APPLICATION,
            preferredUsername: actorSettings.username,
            name: actorSettings.name
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      } catch(e) {
        // Delete account if resource creation failed, or it may cause problems when retrying
        await this.broker.call('auth.account.remove', { id: account['@id'] });
        throw e;
      }
    }

    // wait until the outbox and followers collection are created, and keep their uri, for later use
    const actor = await this.broker.call('activitypub.actor.awaitCreateComplete', {
      actorUri: uri
    });
    this.relayOutboxUri = actor.outbox;
    this.relayFollowersUri = actor.followers;
    this.cacheRelayWebfingers = {};

    // check if has followers (initialize value)
    if (this.settings.acceptFollowers) this.hasFollowers = await this.checkHasFollowers();
  },
  actions: {
    postToFollowers: {
      visibility: 'public',
      params: {
        activity: { type: 'object', optional: false }
      },
      async handler(ctx) {
        if (this.hasFollowers) {
          return await this.broker.call('activitypub.outbox.post', {
            collectionUri: this.relayOutboxUri,
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: this.relayActorUri,
            ...ctx.params.activity,
            to: await this.getFollowers()
          });
        }
      }
    },
    follow: {
      visibility: 'public',
      params: {
        remoteRelayActorUri: { type: 'string', optional: false }
      },
      async handler(ctx) {
        return await ctx.call('activitypub.outbox.post', {
          collectionUri: this.relayOutboxUri,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: this.relayActorUri,
          type: ACTIVITY_TYPES.FOLLOW,
          object: ctx.params.remoteRelayActorUri,
          to: [ctx.params.remoteRelayActorUri]
        });
      }
    },
    isFollowing: {
      visibility: 'public',
      params: {
        remoteRelayActorUri: { type: 'string', optional: false }
      },
      async handler(ctx) {
        return await ctx.call('activitypub.follow.isFollowing', {
          follower: this.relayActorUri,
          following: ctx.params.remoteRelayActorUri
        });
      }
    },
    offerInference: {
      visibility: 'public',
      params: {
        subject: { type: 'string', optional: false },
        predicate: { type: 'string', optional: false },
        object: { type: 'string', optional: false },
        add: { type: 'boolean', optional: false }
      },
      async handler(ctx) {
        const serverDomainName = new URL(ctx.params.subject).host;
        let remoteRelayActorUri;
        if (this.cacheRelayWebfingers[serverDomainName]) {
          remoteRelayActorUri = this.cacheRelayWebfingers[serverDomainName];
        } else {
          remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', { account: 'relay@' + serverDomainName });
        }
        if (remoteRelayActorUri) {
          this.cacheRelayWebfingers[serverDomainName] = remoteRelayActorUri;
          await ctx.call('activitypub.outbox.post', {
            collectionUri: this.relayOutboxUri,
            '@context': 'https://www.w3.org/ns/activitystreams',
            actor: this.relayActorUri,
            type: ACTIVITY_TYPES.OFFER,
            object: {
              type: ctx.params.add ? ACTIVITY_TYPES.ADD : ACTIVITY_TYPES.REMOVE,
              object: {
                type: OBJECT_TYPES.RELATIONSHIP,
                subject: ctx.params.subject,
                relationship: ctx.params.predicate,
                object: ctx.params.object
              }
            },
            to: [remoteRelayActorUri]
          });
        } else {
          // no relay actor on the other side, let's try a PUT instead
          try {
            const response = await fetch(ctx.params.subject, {
              method: 'GET',
              headers: {
                Accept: 'application/ld+json'
              }
            });
            if (response.ok) {
              let json = await response.json();

              if (ctx.params.add) {
                json[ctx.params.predicate] = { id: ctx.params.object };
              } else {
                let expanded_resource = await ctx.call('jsonld.expand', { input: json });
                delete expanded_resource[0]?.[ctx.params.predicate];
                json = await ctx.call('jsonld.compact', { input: expanded_resource, context: json['@context'] });
              }
              const res = await fetch(ctx.params.subject, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/ld+json'
                },
                body: JSON.stringify(json)
              });
            }
          } catch (e) {
            this.logger.warn(`Error while connecting to remove server for offering inverse relationship: ${e.message}`);
          }
        }
      }
    }
  },
  events: {
    'activitypub.follow.added'(ctx) {
      if (ctx.params.following === this.relayActorUri && this.settings.acceptFollowers) {
        this.hasFollowers = true;
      }
    },
    async 'activitypub.follow.removed'(ctx) {
      if (ctx.params.following === this.relayActorUri && this.settings.acceptFollowers) {
        this.hasFollowers = await this.checkHasFollowers();
      }
    }
  },
  methods: {
    async hasInferenceService() {
      const services = await this.broker.call('$node.services');
      return services.some(s => s.name === 'inference');
    },
    isRemoteUri(uri) {
      return !urlJoin(uri, '/').startsWith(this.settings.baseUri);
    },
    async checkHasFollowers() {
      const res = await this.broker.call('activitypub.collection.isEmpty', {
        collectionUri: this.relayFollowersUri
      });
      return !res;
    },
    async getFollowers() {
      return [this.relayFollowersUri, PUBLIC_URI];
    },
  },
  activities: {
    announceCreate: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.CREATE
        }
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await ctx.call('mirror.validRemoteRelay', { actor: activity.actor })) {
          await ctx.call('ldp.remote.store', {
            resourceUri: activity.object.object,
            mirrorGraph: true
          });
          if (activity.object.target) {
            await ctx.call(
              'ldp.container.attach',
              { containerUri: activity.object.target, resourceUri: activity.object.object }
            );
          }
        }
      }
    },
    announceUpdate: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.UPDATE
        }
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await ctx.call('mirror.validRemoteRelay', { actor: activity.actor })) {
          await ctx.call('ldp.remote.store', {
            resourceUri: activity.object.object,
            mirrorGraph: true
          });
        }
      }
    },
    announceDelete: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.DELETE
        }
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await ctx.call('mirror.validRemoteRelay', { actor: activity.actor })) {
          await ctx.call('ldp.remote.delete', { resourceUri: activity.object.object });
        }
      }
    },
    announceAddToContainer: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.ADD,
          object: {
            type: OBJECT_TYPES.RELATIONSHIP
          }
        }
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await ctx.call('mirror.validRemoteRelay', { actor: activity.actor })) {
          const predicate = await ctx.call('jsonld.expandPredicate', { predicate: activity.object.object.relationship, context: activity['@context'] });
          if (predicate === 'http://www.w3.org/ns/ldp#contains') {
            await ctx.call(
              'ldp.container.attach',
              { containerUri: activity.object.object.subject, resourceUri: activity.object.object.object }
            );
          }
        }
      }
    },
    announceRemoveFromContainer: {
      match: {
        type: ACTIVITY_TYPES.ANNOUNCE,
        object: {
          type: ACTIVITY_TYPES.REMOVE,
          object: {
            type: OBJECT_TYPES.RELATIONSHIP
          }
        }
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await ctx.call('mirror.validRemoteRelay', { actor: activity.actor })) {
          const predicate = await ctx.call('jsonld.expandPredicate', { predicate: activity.object.object.relationship, context: activity['@context'] });
          if (predicate === 'http://www.w3.org/ns/ldp#contains') {
            await ctx.call(
              'ldp.container.detach',
              {containerUri: activity.object.object.subject, resourceUri: activity.object.object.object}
            );
          }
        }
      }
    },
    offerInference: {
      async match(activity) {
        return (
          await this.matchActivity({
            type: ACTIVITY_TYPES.OFFER,
            object: {
              type: ACTIVITY_TYPES.ADD,
              object: {
                type: OBJECT_TYPES.RELATIONSHIP
              }
            }
          }, activity)
        ) || (
          await this.matchActivity({
            type: ACTIVITY_TYPES.OFFER,
            object: {
              type: ACTIVITY_TYPES.REMOVE,
              object: {
                type: OBJECT_TYPES.RELATIONSHIP
              }
            }
          }, activity)
        );
      },
      async onReceive(ctx, activity, recipients) {
        if (recipients.includes(this.relayActorUri) && await this.hasInferenceService()) {
          let relationship = activity.object.object;
          // Remove prefix from predicate if it exists
          relationship.relationship = await ctx.call('jsonld.expandPredicate', { predicate: relationship.relationship, context: activity['@context'] });
          if (this.isRemoteUri(relationship.subject)) {
            this.logger.warn('Attempt at offering an inverse relationship on a mirrored resource. Aborting...');
            return;
          }
          if (relationship.subject && relationship.relationship && relationship.object) {
            await ctx.call('inference.addFromRemote', {
              subject: relationship.subject,
              predicate: relationship.relationship,
              object: relationship.object,
              add: activity.object.type === ACTIVITY_TYPES.ADD
            });
          }
        } else {
          this.logger.warn('Received offer for inverse relationship but inference service is not running. Aborting...');
        }
      }
    }
  }
};

module.exports = RelayService;
