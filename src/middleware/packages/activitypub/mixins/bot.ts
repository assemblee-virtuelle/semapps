import urlJoin from 'url-join';
import { arrayOf } from '@semapps/ldp';
import { ACTOR_TYPES } from '../constants.ts';
import { getSlugFromUri, getContainerFromUri } from '../utils.ts';
import { ServiceSchema } from 'moleculer';

const BotMixin = {
  settings: {
    actor: {
      uri: null,
      username: null,
      name: null
    }
  },
  dependencies: [
    'activitypub',
    'activitypub.follow', // Ensure the /followers and /following collection are registered
    'auth.account',
    'ldp.container',
    'ldp.registry'
  ],
  async started() {
    // Ensure LDP sub-services have been started
    await this.broker.waitForServices(['ldp.container', 'ldp.resource']);

    const actorSettings = this.settings.actor;
    if (!actorSettings.uri || !actorSettings.name || !actorSettings.username) {
      return Promise.reject(new Error('Please set the actor settings in schema!'));
    }

    const actorExist = await this.broker.call('ldp.resource.exist', {
      resourceUri: actorSettings.uri
    });

    if (!actorExist) {
      this.logger.info(`BotService > Actor ${actorSettings.name} does not exist yet, creating it...`);

      const account = await this.broker.call(
        'auth.account.create',
        {
          username: actorSettings.username,
          webId: actorSettings.uri
        },
        { meta: { isSystemCall: true } }
      );

      try {
        await this.broker.call('ldp.container.post', {
          containerUri: getContainerFromUri(actorSettings.uri),
          slug: getSlugFromUri(actorSettings.uri),
          resource: {
            '@context': 'https://www.w3.org/ns/activitystreams',
            type: ACTOR_TYPES.APPLICATION,
            preferredUsername: actorSettings.username,
            name: actorSettings.name
          },
          webId: 'system'
        });
      } catch (e) {
        // Delete account if resource creation failed, or it may cause problems when retrying
        await this.broker.call('auth.account.remove', { id: account['@id'] });
        throw e;
      }

      if (this.actorCreated) {
        const actor = await this.broker.call('activitypub.actor.awaitCreateComplete', { actorUri: actorSettings.uri });
        this.actorCreated(actor);
      }
    }
  },
  actions: {
    getUri: {
      handler() {
        return this.settings.actor.uri;
      }
    }
  },
  events: {
    'activitypub.inbox.received': {
      handler(ctx) {
        if (this.inboxReceived) {
          if (ctx.params.recipients.includes(this.settings.actor.uri)) {
            this.inboxReceived(ctx.params.activity);
          }
        }
      }
    }
  },
  methods: {
    async getFollowers() {
      const result = await this.broker.call('activitypub.follow.listFollowers', {
        collectionUri: urlJoin(this.settings.actor.uri, 'followers')
      });
      return arrayOf(result?.items);
    }
  }
} satisfies Partial<ServiceSchema>;

export default BotMixin;
