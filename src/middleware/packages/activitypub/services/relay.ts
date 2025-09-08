import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import { ACTOR_TYPES } from '../constants.ts';
import { delay } from '../utils.ts';

const RelayService = {
  name: 'activitypub.relay' as const,
  settings: {
    actor: {
      username: 'relay',
      name: 'Relay actor for instance'
    }
  },
  dependencies: ['activitypub', 'activitypub.follow', 'auth.account', 'ldp.container', 'ldp.registry'],
  async started() {
    let appsContainer;
    do {
      appsContainer = await this.broker.call('ldp.registry.getByType', { type: ACTOR_TYPES.APPLICATION });
      if (!appsContainer) {
        this.logger.warn("Waiting for a container that accepts the 'Application' type...");
        await delay(3000);
      }
    } while (!appsContainer);

    const actorSettings = this.settings.actor;
    const actorExist = await this.broker.call('auth.account.usernameExists', { username: actorSettings.username });

    const containerUri = await this.broker.call('ldp.registry.getUri', { path: appsContainer.path });
    const actorUri = urlJoin(containerUri, actorSettings.username);

    // Creating the local actor 'relay'
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
          webId: 'system'
        });
      } catch (e) {
        // Delete account if resource creation failed, or it may cause problems when retrying
        await this.broker.call('auth.account.remove', { id: account['@id'] });
        throw e;
      }
    }

    // Wait until the relay actor is fully created
    this.relayActor = await this.broker.call('activitypub.actor.awaitCreateComplete', { actorUri });
  },
  actions: {
    getActor: {
      visibility: 'public',
      handler() {
        return this.relayActor;
      }
    }
  }
} satisfies ServiceSchema;

export default RelayService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [RelayService.name]: typeof RelayService;
    }
  }
}
