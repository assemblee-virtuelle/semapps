import { ServiceSchema } from 'moleculer';
import GetByTypesAction from './actions/getByTypes.ts';
import GetByUriAction from './actions/getByUri.ts';
import GetUriAction from './actions/getUri.ts';
import ListAction from './actions/list.ts';
import RegisterAction from './actions/register.ts';
import defaultOptions from './defaultOptions.ts';
import { Registration, LdpRegistryServiceSettings } from '../../types.ts';

const LdpRegistryService = {
  name: 'ldp.registry' as const,
  settings: {
    baseUrl: undefined,
    containers: [],
    defaultOptions,
    allowSlugs: true
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
    this.registrations = [] as Registration[];
    this.registerAll();
  },
  methods: {
    async registerAll() {
      for (const registration of this.settings.containers) {
        await this.actions.register(registration);
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
