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
    store: storeAction
  },
  methods: {
    isRemoteUri(resourceUri) {
      return !urlJoin(resourceUri, '/').startsWith(this.settings.baseUrl);
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
            const response = await fetch(resourceUri, { headers: { Accept: MIME_TYPES.JSON }});

            if (response.status === 403 || response.status === 404 || response.status === 401) {
              await this.actions.delete({ resourceUri });
            } else {
              await this.actions.store()
              // update the local cache
              let resource = await response.json();
              resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;

              await this.broker.call('ldp.resource.put', { resource, contentType: MIME_TYPES.JSON });
            }
          } catch (e) {
            // connection errors are not counted as errors that indicate the resource is gone.
            // those error just indicate that the remote server is not responding. can be temporary.
            this.logger.warn('Failed to update single mirrored resource: ' + resourceUri);
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
