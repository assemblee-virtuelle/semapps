const urlJoin = require("url-join");
const Schedule = require('moleculer-schedule');
const { MIME_TYPES } = require("@semapps/mime-types");
const deleteAction = require('./actions/delete');
const getAction = require('./actions/get');
const getGraphAction = require('./actions/getGraph');
const getNetworkAction = require('./actions/getNetwork');
const getStoredAction = require('./actions/getStored');
const storeAction = require('./actions/store');

module.exports = {
  name: 'ldp.remote',
  mixins: [Schedule],
  settings: {
    baseUrl: null,
    ontologies: [],
    podProvider: false,
    mirrorGraphName: null,
  },
  dependencies: ['triplestore', 'jsonld'],
  actions: {
    delete: deleteAction,
    get: getAction,
    getGraph: getGraphAction,
    getNetwork: getNetworkAction,
    getStored: getStoredAction,
    store: storeAction,
    runCron() { this.updateSingleMirroredResources() } // Used by tests
  },
  methods: {
    isRemoteUri(uri, webId) {
      return !urlJoin(uri, '/').startsWith(this.settings.baseUrl)
        || (this.settings.podProvider && webId && !uri.startsWith(webId));
    },
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
              mirrorGraph: true,
            })
          } catch (e) {
            if (e.code === 403 || e.code === 404 || e.code === 401) {
              await this.actions.delete({ resourceUri });
            } else {
              // Connection errors are not counted as errors that indicate the resource is gone.
              // Those error just indicate that the remote server is not responding. Can be temporary.
              this.logger.warn('Failed to update single mirrored resource: ' + resourceUri);
            }
          }
        }
      }
    },
  },
  jobs: [
    {
      rule: '0 * * * *',
      handler: 'updateSingleMirroredResources'
    }
  ]
};
