import { ServiceSchema } from 'moleculer';
import getByTypesAction from './actions/getByTypes.ts';
import getByUriAction from './actions/getByUri.ts';
import getUriAction from './actions/getUri.ts';
import listAction from './actions/list.ts';
import registerAction from './actions/register.ts';
import defaultOptions from './defaultOptions.ts';
import { ContainerOptions } from '../../types.ts';

const LdpRegistrySchema = {
  name: 'ldp.registry' as const,
  settings: {
    baseUrl: null,
    containers: [],
    defaultOptions,
    allowSlugs: true,
    podProvider: false
  },
  dependencies: ['ldp.container', 'api'],
  actions: {
    getByTypes: getByTypesAction,
    getByUri: getByUriAction,
    getUri: getUriAction,
    list: listAction,
    register: registerAction
  },
  async started() {
    this.registeredContainers = {} as { [name: string]: ContainerOptions };
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
        const { webId } = ctx.params;
        // We want to add user's containers only in Pod provider config

        if (this.settings.podProvider) {
          const storageUrl: string = await ctx.call('solid-storage.getUrl', { webId });

          // Go through each registered container.
          for (const options of Object.values(this.registeredContainers)) {
            try {
              this.logger.info(`Creating container ${options.name}...`);

              const containerUri = await ctx.call('triplestore.named-graph.create', {
                baseUrl: storageUrl,
                slug: this.settings.allowSlugs ? options.path : undefined
              });

              await ctx.call('ldp.container.createAndAttach', {
                containerUri,
                options,
                webId
              });
            } catch (error) {
              this.logger.warn(`Could not create container ${options.name}...`);
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
