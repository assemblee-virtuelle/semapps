import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import getByTypeAction from './actions/getByType.ts';
import getByUriAction from './actions/getByUri.ts';
import getUriAction from './actions/getUri.ts';
import listAction from './actions/list.ts';
import registerAction from './actions/register.ts';
import defaultOptions from './defaultOptions.ts';

const LdpRegistrySchema = {
  name: 'ldp.registry' as const,
  settings: {
    baseUrl: null,
    containers: [],
    defaultOptions,
    podProvider: false
  },
  dependencies: ['ldp.container', 'api'],
  actions: {
    getByType: getByTypeAction,
    getByUri: getByUriAction,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ path: { type: "string"; }; we... Remove this comment to see the full error message
    getUri: getUriAction,
    list: listAction,
    register: registerAction
  },
  async started() {
    this.registeredContainers = {};
    if (this.settings.podProvider) {
      // The auth.account service is a dependency only in POD provider config
      await this.broker.waitForServices(['auth.account']);
    }
    for (let container of this.settings.containers) {
      // Ensure backward compatibility
      if (typeof container === 'string') container = { path: container };
      // We await each container registration so they happen in order (root container first)git
      await this.actions.register(container);
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'Optionali... Remove this comment to see the full error message
        const { webId, accountData } = ctx.params;
        // We want to add user's containers only in Pod provider config

        if (this.settings.podProvider) {
          const storageUrl: string = await ctx.call('solid-storage.getUrl', { webId });

          const registeredContainers = await this.actions.list({ dataset: accountData.username }, { parentCtx: ctx });

          // Go through each registered container.
          for (const options of Object.values(registeredContainers)) {
            try {
              this.logger.info('Trying to register container', options.path);
              await ctx.call('ldp.container.createAndAttach', {
                containerUri: urlJoin(storageUrl, options.path),
                options,
                webId
              });
              this.logger.info('SUCCESS FOR PATH', options.path);
            } catch (error) {
              // pass
            }
          }
        }
      }
    }
  }
} satisfies ServiceSchema;

export default LdpRegistrySchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpRegistrySchema.name]: typeof LdpRegistrySchema;
    }
  }
}
