import { ServiceSchema } from 'moleculer';
import GetByTypesAction from './actions/getByTypes.ts';
import GetByUriAction from './actions/getByUri.ts';
import GetUriAction from './actions/getUri.ts';
import ListAction from './actions/list.ts';
import RegisterAction from './actions/register.ts';
import defaultOptions from './defaultOptions.ts';
import { arrayOf } from '../../utils.ts';
import { Registration, LdpRegistryServiceSettings } from '../../types.ts';

const LdpRegistryService = {
  name: 'ldp.registry' as const,
  settings: {
    baseUrl: undefined,
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
    this.registerAll();
  },
  methods: {
    async registerAll() {
      for (let container of this.settings.containers) {
        // We await each registration so they happen in order
        await this.actions.register(container);
      }
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        const { webId } = ctx.params;
        if (this.settings.podProvider) {
          for (const registration of Object.values(this.registrations as { [name: string]: Registration })) {
            // Controlled resources are created by the mixin
            if (registration.isContainer) {
              const containerUri = await ctx.call('ldp.container.create', {
                registration,
                webId
              });

              await ctx.call('type-index.register', {
                types: arrayOf(registration.acceptedTypes),
                uri: containerUri,
                webId,
                isContainer: true,
                isPrivate: registration.typeIndex === 'private'
              });
            }
          }
        }
      }
    }
  }
} satisfies ServiceSchema<LdpRegistryServiceSettings>;

export default LdpRegistryService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpRegistryService.name]: typeof LdpRegistryService;
    }
  }
}
