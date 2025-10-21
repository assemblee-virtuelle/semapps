import { ServiceSchema } from 'moleculer';
import GetByTypesAction from './actions/getByTypes.ts';
import GetByUriAction from './actions/getByUri.ts';
import GetUriAction from './actions/getUri.ts';
import ListAction from './actions/list.ts';
import RegisterAction from './actions/register.ts';
import defaultOptions from './defaultOptions.ts';
import { Registration } from '../../types.ts';

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
    getByTypes: GetByTypesAction,
    getByUri: GetByUriAction,
    getUri: GetUriAction,
    list: ListAction,
    register: RegisterAction
  },
  async started() {
    this.registrations = {} as { [name: string]: Registration };
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
  methods: {
    async createContainer(registration: Registration, webId) {
      try {
        this.logger.info(`Creating container ${registration.name}...`);

        const baseUrl = this.settings.podProvider
          ? await this.broker.call('solid-storage.getUrl', { webId })
          : this.settings.baseUrl;

        const containerUri = await this.broker.call('triplestore.named-graph.create', {
          baseUrl,
          slug: this.settings.allowSlugs ? registration.path : undefined
        });

        await this.broker.call('ldp.container.createAndAttach', {
          containerUri,
          options: registration,
          webId
        });

        return containerUri;
      } catch (error) {
        this.logger.warn(`Could not create container ${registration.name}...`);
      }
    }
    // async createResource(registration: Registration, webId) {
    //   try {
    //     this.logger.info(`Creating resource ${registration.name}...`);

    //     const baseUrl = this.settings.podProvider
    //       ? await this.broker.call('solid-storage.getUrl', { webId })
    //       : this.settings.baseUrl;

    //     const resourceUri = await this.broker.call('triplestore.named-graph.create', {
    //       baseUrl,
    //       slug: this.settings.allowSlugs ? registration.path : undefined
    //     });

    //     await this.broker.call('ldp.resource.create', {
    //       resourceUri,
    //       resource: { '@id': resourceUri, '@type': registration.acceptedTypes },
    //       permissions: registration.permissions,
    //       webId: 'system'
    //     });
    //   } catch (error) {
    //     this.logger.warn(`Could not create resource ${registration.name}...`);
    //   }
    // }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        const { webId } = ctx.params;
        if (this.settings.podProvider) {
          for (const registration of Object.values(this.registrations as { [name: string]: Registration })) {
            if (registration.isContainer) {
              await this.createContainer(registration, webId);
            } /*else {
              await this.createResource(registration, webId);
            }*/
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
