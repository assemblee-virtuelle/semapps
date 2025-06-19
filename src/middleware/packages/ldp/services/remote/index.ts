import Schedule from 'moleculer-schedule';
import { ServiceSchema, defineAction } from 'moleculer';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import getGraphAction from './actions/getGraph.ts';
import getNetworkAction from './actions/getNetwork.ts';
import getStoredAction from './actions/getStored.ts';
import isRemoteAction from './actions/isRemote.ts';
import storeAction from './actions/store.ts';

const LdpRemoteSchema = {
  name: 'ldp.remote' as const,
  mixins: [Schedule],
  settings: {
    baseUrl: null,
    podProvider: false,
    mirrorGraphName: null
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    delete: deleteAction,
    get: getAction,
    getGraph: getGraphAction,
    getNetwork: getNetworkAction,
    getStored: getStoredAction,
    isRemote: isRemoteAction,
    store: storeAction,

    runCron: defineAction({
      // Used by tests
      handler() {
        this.updateSingleMirroredResources();
      }
    })
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
              GRAPH <${this.settings.mirrorGraphName}> { 
                ?s <http://semapps.org/ns/core#singleMirroredResource> ?o 
              }
            }
          `
        });

        for (const resourceUri of singles.map(node => node.s.value)) {
          try {
            await this.actions.store({
              resourceUri,
              keepInSync: true,
              mirrorGraph: true
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
