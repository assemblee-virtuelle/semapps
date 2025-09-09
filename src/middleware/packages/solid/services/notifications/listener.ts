import path from 'path';
import urlJoin from 'url-join';
import fetch from 'node-fetch';
import LinkHeader from 'http-link-header';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import DbService from 'moleculer-db';
import { parseHeader, parseRawBody, negotiateContentType, parseJson } from '@semapps/middlewares';
import { notify } from '@semapps/ontologies';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema } from 'moleculer';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const SolidNotificationsListenerSchema = {
  name: 'solid-notifications.listener' as const,
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'WebhookChannelListener', dataset: 'settings' }),
  settings: {
    baseUrl: undefined,
    // DbService settings
    idField: '@id'
  },
  dependencies: ['api', 'app', 'ontologies'],
  async started() {
    if (!this.settings.baseUrl) throw new Error(`The baseUrl setting is required`);

    await this.broker.call('ontologies.register', notify);

    // Retrieve all active listeners
    const results = await this.actions.list({});
    this.listeners = results.rows;

    const { pathname: basePath } = new URL(this.settings.baseUrl);

    await this.broker.call('api.addRoute', {
      route: {
        path: path.join(basePath, '/.webhooks/:uuid'),
        authorization: false,
        authentication: false,
        aliases: {
          'POST /': [
            parseHeader,
            negotiateContentType,
            parseRawBody,
            parseJson,
            'solid-notifications.listener.transfer'
          ]
        },
        bodyParsers: false
      }
    });
  },
  actions: {
    register: {
      async handler(ctx) {
        const { resourceUri, actionName } = ctx.params;

        const appActor = await ctx.call('app.get');

        // Check if a listener already exist
        const existingListener = this.listeners.find(
          (listener: any) => listener.resourceUri === resourceUri && listener.actionName === actionName
        );

        if (existingListener) {
          try {
            // Check if channel still exist. If not, it will throw an error.
            await ctx.call('ldp.remote.get', {
              resourceUri: existingListener.channelUri,
              webId: appActor.id,
              strategy: 'networkOnly'
            });

            // If the channel still exist, registration is not needed
            return existingListener;
          } catch (e) {
            // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
            if (e.code === 404) {
              this.logger.warn(
                `Channel ${existingListener.channelUri} doesn't exist anymore. Registering a new channel...`
              );
              this.actions.remove({ id: existingListener['@id'] }, { parentCtx: ctx });
              this.listeners = this.listeners.filter((l: any) => l['@id'] !== existingListener['@id']);
            } else {
              throw e;
            }
          }
        }

        // Discover webhook endpoint
        const storageDescription = await this.getSolidEndpoint(resourceUri);
        if (!storageDescription) throw new Error(`No storageDescription found for resourceUri ${resourceUri}`);

        // Fetch all subscriptions URLs
        const results = await Promise.all(
          storageDescription['notify:subscription'].map((channelSubscriptionUrl: any) =>
            fetch(channelSubscriptionUrl, {
              headers: {
                Accept: 'application/ld+json'
              }
            }).then(res => res.ok && res.json())
          )
        );

        // Find webhook channel
        const webhookSubscription = results.find(
          subscription => subscription && subscription['notify:channelType'] === 'notify:WebhookChannel2023'
        );

        if (!webhookSubscription) throw new Error(`No webhook subscription URL found for resourceUri ${resourceUri}`);

        // Ensure webhookSubscription['notify:feature'] are correct

        // Generate a webhook path
        const webhookUrl = urlJoin(this.settings.baseUrl, '.webhooks', uuidv4());

        // Persist listener on the settings dataset
        // We must do it before creating the webhook channel, in case the webhook is called immediately
        let listener = await this._create(ctx, {
          webhookUrl,
          resourceUri,
          actionName
        });

        this.listeners.push(listener);

        // Create a webhook channel (authenticate with HTTP signature)
        const { body } = await ctx.call('signature.proxy.query', {
          url: webhookSubscription.id || webhookSubscription['@id'],
          method: 'POST',
          headers: new fetch.Headers({ 'Content-Type': 'application/ld+json' }),
          body: JSON.stringify({
            '@context': {
              notify: 'http://www.w3.org/ns/solid/notifications#'
            },
            '@type': 'notify:WebhookChannel2023',
            'notify:topic': resourceUri,
            'notify:sendTo': webhookUrl
          }),
          actorUri: appActor.id
        });

        // Keep track of the channel URI, to be able to check if it still exists
        listener.channelUri = body.id;
        await this._update(ctx, listener);
        const listenerIndex = this.listeners.findIndex((l: any) => l['@id'] === listener['@id']);
        this.listeners[listenerIndex] = listener;

        return listener;
      }
    },

    transfer: {
      async handler(ctx) {
        const { uuid, ...data } = ctx.params;
        const webhookUrl = urlJoin(this.settings.baseUrl, '.webhooks', uuid);

        const listener = this.listeners.find((l: any) => l.webhookUrl === webhookUrl);

        if (listener) {
          try {
            // Do no wait for the action to finish, so that the result can be immediately returned
            ctx.call(listener.actionName, data);
          } catch (e) {
            // Ignore errors that the actions may generate (otherwise 404 errors will be considered as non-existing webhooks)
          }
          // @ts-expect-error TS(2339): Property '$statusCode' does not exist on type '{}'... Remove this comment to see the full error message
          ctx.meta.$statusCode = 200;
        } else {
          throw new MoleculerError(`No webhook found with URL ${webhookUrl}`, 404, 'NOT_FOUND');
        }
      }
    },

    getCache: {
      handler() {
        return this.listeners;
      }
    }
  },
  methods: {
    async getSolidEndpoint(resourceUri) {
      let solidEndpointUrl;

      try {
        const response = await fetch(resourceUri, { method: 'HEAD' });
        // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        const linkHeader = LinkHeader.parse(response.headers.get('Link'));
        const storageDescriptionLinkHeader = linkHeader.rel('http://www.w3.org/ns/solid/terms#storageDescription');
        solidEndpointUrl = storageDescriptionLinkHeader[0].uri;
      } catch (e) {
        // Ignore errors, we will display a warning below
      }

      if (!solidEndpointUrl) {
        this.logger.warn(`Could not get link header for ${resourceUri}`);
        // Assume same endpoint as ActivityPods or CSS
        solidEndpointUrl = urlJoin(new URL(resourceUri).origin, '.well-known', 'solid');
      }

      const response = await fetch(solidEndpointUrl, {
        headers: {
          Accept: 'application/ld+json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return false;
    }
  }
} satisfies ServiceSchema;

export default SolidNotificationsListenerSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidNotificationsListenerSchema.name]: typeof SolidNotificationsListenerSchema;
    }
  }
}
