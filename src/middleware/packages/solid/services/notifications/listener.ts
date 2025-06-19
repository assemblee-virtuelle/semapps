import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import LinkHeader from 'http-link-header';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { uuidv4 as v4 } from 'uuid';
import DbService from 'moleculer-db';
import { parseHeader, negotiateContentType, parseJson } from '@semapps/middlewares';
// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
import { notify } from '@semapps/ontologies';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema, defineAction } from 'moleculer';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

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
          'POST /': [parseHeader, negotiateContentType, parseJson, 'solid-notifications.listener.transfer']
        },
        bodyParsers: false
      }
    });
  },
  actions: {
    register: defineAction({
      async handler(ctx) {
        const { resourceUri, actionName } = ctx.params;

        const appActor = await ctx.call('app.get');

        // Check if a listener already exist
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.logger.warn(
                `Channel ${existingListener.channelUri} doesn't exist anymore. Registering a new channel...`
              );
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.actions.remove({ id: existingListener['@id'] }, { parentCtx: ctx });
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.listeners = this.listeners.filter((l: any) => l['@id'] !== existingListener['@id']);
            } else {
              throw e;
            }
          }
        }

        // Discover webhook endpoint
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const storageDescription = await this.getSolidEndpoint(resourceUri);
        if (!storageDescription) throw new Error(`No storageDescription found for resourceUri ${resourceUri}`);

        // Fetch all subscriptions URLs
        const results = await Promise.all(
          storageDescription['notify:subscription'].map((channelSubscriptionUrl: any) =>
            fetch(channelSubscriptionUrl, {
              headers: {
                Accept: 'application/ld+json'
              }
            }).then((res: any) => res.ok && res.json())
          )
        );

        // Find webhook channel
        const webhookSubscription = results.find(
          (subscription: any) => subscription && subscription['notify:channelType'] === 'notify:WebhookChannel2023'
        );

        if (!webhookSubscription) throw new Error(`No webhook subscription URL found for resourceUri ${resourceUri}`);

        // Ensure webhookSubscription['notify:feature'] are correct

        // Generate a webhook path
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const webhookUrl = urlJoin(this.settings.baseUrl, '.webhooks', uuidv4());

        // Persist listener on the settings dataset
        // We must do it before creating the webhook channel, in case the webhook is called immediately
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        let listener = await this._create(ctx, {
          webhookUrl,
          resourceUri,
          actionName
        });

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
        // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
        await this._update(ctx, listener);
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const listenerIndex = this.listeners.findIndex((l: any) => l['@id'] === listener['@id']);
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.listeners[listenerIndex] = listener;

        return listener;
      }
    }),

    transfer: defineAction({
      async handler(ctx) {
        const { uuid, ...data } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const webhookUrl = urlJoin(this.settings.baseUrl, '.webhooks', uuid);

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
    }),

    getCache: defineAction({
      handler() {
        return this.listeners;
      }
    })
  },
  methods: {
    async getSolidEndpoint(resourceUri) {
      let solidEndpointUrl;

      try {
        const response = await fetch(resourceUri, { method: 'HEAD' });
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
