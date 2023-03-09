const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { defaultToArray } = require('../utils');
const { ACTIVITY_TYPES, ACTOR_TYPES } = require('../constants');

const RelayService = {
  name: 'activitypub.relay',
  settings: {
    baseUri: null,
    actor: {
      username: 'relay',
      name: 'Relay actor for instance'
    }
  },
  dependencies: [
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

    const containerUri = urlJoin(this.settings.baseUri, actorContainer);
    const actorUri = urlJoin(containerUri, actorSettings.username);

    // creating the local actor 'relay'
    if (!actorExist) {
      this.logger.info(`ActorService > Actor "${actorSettings.name}" does not exist yet, creating it...`);

      const account = await this.broker.call(
        'auth.account.create',
        {
          username: actorSettings.username,
          webId: actorUri
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

    // Wait until the relay actor is fully created, and keep the data for later use
    this.relayActor = await this.broker.call('activitypub.actor.awaitCreateComplete', { actorUri });
  },
  actions: {
    getActor: {
      visibility: 'public',
      handler() {
        return this.relayActor;
      }
    },
    follow: {
      visibility: 'public',
      params: {
        remoteRelayActorUri: { type: 'string', optional: false }
      },
      async handler(ctx) {
        return await ctx.call('activitypub.outbox.post', {
          collectionUri: this.relayActor.outbox,
          '@context': 'https://www.w3.org/ns/activitystreams',
          actor: this.relayActor.id,
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
          follower: this.relayActor.id,
          following: ctx.params.remoteRelayActorUri
        });
      }
    }
  }
};

module.exports = RelayService;
