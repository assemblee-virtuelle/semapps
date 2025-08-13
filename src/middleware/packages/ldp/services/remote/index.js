const Schedule = require('moleculer-schedule');
const deleteAction = require('./actions/delete');
const getAction = require('./actions/get');
const getNetworkAction = require('./actions/getNetwork');
const getStoredAction = require('./actions/getStored');
const isRemoteAction = require('./actions/isRemote');
const storeAction = require('./actions/store');

module.exports = {
  name: 'ldp.remote',
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
    runCron() {
      this.updateSingleMirroredResources();
    } // Used by tests
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
};
