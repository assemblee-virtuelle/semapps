const WebAclResourceService = require('./services/resource');
const WebAclGroupService = require('./services/group');
const WebAclCacheService = require('./services/cache');
const getRoutes = require('./routes/getRoutes');

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: '<http://semapps.org/webacl>',
    podProvider: false,
    superAdmins: []
  },
  dependencies: ['api', 'triplestore', 'fuseki-admin'],
  async created() {
    const { baseUrl, graphName, podProvider, superAdmins } = this.settings;

    await this.broker.createService(WebAclResourceService, {
      settings: {
        baseUrl,
        graphName,
        podProvider
      }
    });

    await this.broker.createService(WebAclGroupService, {
      settings: {
        baseUrl,
        graphName,
        podProvider,
        superAdmins
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      await this.broker.createService(WebAclCacheService);
    }
  },
  async started() {
    // testing if there is a secure graph. you should not start the webAcl service if you created an unsecure main dataset.
    await this.broker.waitForServices(['triplestore']);
    let hasWebAcl = false;
    try {
      await this.broker.call('triplestore.query', {
        query: `ASK WHERE { GRAPH ${this.settings.graphName} { ?s ?p ?o } }`,
        webId: 'anon'
      });
    } catch (e) {
      if (e.code == 403) hasWebAcl = true;
    }
    if (!hasWebAcl)
      throw new Error(
        'Error when starting the webAcl service: the main dataset is not secure. see fuseki-admin.createDataset'
      );

    for (let route of getRoutes()) {
      await this.broker.call('api.addRoute', { route });
    }
  }
};
