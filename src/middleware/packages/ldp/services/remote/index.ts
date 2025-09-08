import Schedule from 'moleculer-schedule';
import { ServiceSchema } from 'moleculer';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import getNetworkAction from './actions/getNetwork.ts';
import getStoredAction from './actions/getStored.ts';
import isRemoteAction from './actions/isRemote.ts';
import storeAction from './actions/store.ts';

const LdpRemoteSchema = {
  name: 'ldp.remote' as const,
  mixins: [Schedule],
  settings: {
    baseUrl: null,
    podProvider: false
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
      const services = await this.broker.call('$node.services');
      return services.some(s => s.name === 'signature.proxy');
    },
    async updateSingleMirroredResources() {
      if (!this.settings.podProvider) {
        const singles = await this.broker.call('triplestore.query', {
          query: `
            SELECT DISTINCT ?s 
            WHERE { 
              GRAPH ?g { 
                ?s <http://semapps.org/ns/core#singleMirroredResource> ?o 
              }
            }
          `
        });

        for (const resourceUri of singles.map(node => node.s.value)) {
          try {
            await this.actions.store({
              resourceUri,
              keepInSync: true
            });
          } catch (e) {
            if (e.code === 403 || e.code === 404 || e.code === 401) {
              await this.actions.delete({ resourceUri });
            } else {
              // Connection errors are not counted as errors that indicate the resource is gone.
              // Those error just indicate that the remote server is not responding. Can be temporary.
              this.logger.warn(`Failed to update single mirrored resource: ${resourceUri}`);
            }
          }
        }
      }
    }
  },
  jobs: [
    {
      rule: '0 * * * *',
      handler: 'updateSingleMirroredResources'
    }
  ]
} satisfies ServiceSchema;

export default LdpRemoteSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpRemoteSchema.name]: typeof LdpRemoteSchema;
    }
  }
}
