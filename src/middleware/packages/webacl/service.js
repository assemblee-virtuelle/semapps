const { acl, vcard, rdfs } = require('@semapps/ontologies');
const WebAclResourceService = require('./services/resource');
const WebAclGroupService = require('./services/group');
const WebAclActivityService = require('./services/activity');
const WebAclCacheService = require('./services/cache');
const getRoutes = require('./routes/getRoutes');

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: 'http://semapps.org/webacl',
    podProvider: false,
    superAdmins: []
  },
  dependencies: ['api', 'ontologies'],
  async created() {
    const { baseUrl, graphName, podProvider, superAdmins } = this.settings;

    this.broker.createService({
      mixins: [WebAclResourceService],
      settings: {
        baseUrl,
        graphName,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [WebAclGroupService],
      settings: {
        baseUrl,
        graphName,
        podProvider,
        superAdmins
      }
    });

    this.broker.createService({
      mixins: [WebAclActivityService],
      settings: {
        podProvider
      }
    });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      this.broker.createService({ mixins: [WebAclCacheService] });
    }
  },
  async started() {
    if (!this.settings.podProvider) {
      // Testing if there is a secure graph. you should not start the webAcl service if you created an unsecure main dataset.
      await this.broker.waitForServices(['triplestore']);

      let hasWebAcl = false;
      try {
        await this.broker.call('triplestore.query', {
          query: `ASK WHERE { GRAPH <${this.settings.graphName}> { ?s ?p ?o } }`,
          webId: 'anon'
        });
      } catch (e) {
        if (e.code === 403) hasWebAcl = true;
      }
      if (!hasWebAcl) {
        throw new Error(
          'Error when starting the webAcl service: the main dataset is not secure. You must use the triplestore.dataset.create action with the `secure: true` param'
        );
      }
    }

    const { pathname: basePath } = new URL(this.settings.baseUrl);

    for (const route of getRoutes(basePath, this.settings.podProvider)) {
      await this.broker.call('api.addRoute', { route });
    }

    await this.broker.call('ontologies.register', {
      ...acl,
      overwrite: true
    });
    await this.broker.call('ontologies.register', {
      ...vcard,
      overwrite: true
    });
    await this.broker.call('ontologies.register', {
      ...rdfs,
      overwrite: true
    });
  }
};
