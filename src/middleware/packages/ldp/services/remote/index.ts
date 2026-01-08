import { Service, ServiceSchema } from 'moleculer';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import getNetworkAction from './actions/getNetwork.ts';
import getStoredAction from './actions/getStored.ts';
import isRemoteAction from './actions/isRemote.ts';
import storeAction from './actions/store.ts';

const LdpRemoteSchema = {
  name: 'ldp.remote' as const,
  settings: {
    baseUrl: null
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    delete: deleteAction,
    get: getAction,
    getNetwork: getNetworkAction,
    getStored: getStoredAction,
    isRemote: isRemoteAction,
    store: storeAction,
    runCron: {
      // Used by tests
      handler() {
        this.updateSingleMirroredResources();
      }
    }
  },
  methods: {
    async proxyAvailable() {
      const services: ServiceSchema[] = await this.broker.call('$node.services');
      return services.some(s => s.name === 'signature.proxy');
    }
  }
} satisfies ServiceSchema;

export default LdpRemoteSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpRemoteSchema.name]: typeof LdpRemoteSchema;
    }
  }
}
