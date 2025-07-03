const { acl, vcard, rdfs } = require('@semapps/ontologies');
const WebAclResourceService = require('./services/resource');
const WebAclCacheService = require('./services/cache');
const WebAclGroupService = require('./services/group');
const WebAclAuthorizerService = require('./services/authorizer');
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

    this.broker.createService({ mixins: [WebAclAuthorizerService] });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      this.broker.createService({ mixins: [WebAclCacheService] });
    }
  },
  async started() {
    const { pathname: basePath } = new URL(this.settings.baseUrl);

    for (const route of getRoutes(basePath, this.settings.podProvider)) {
      await this.broker.call('api.addRoute', { route });
    }

    await this.broker.call('ontologies.register', acl);
    await this.broker.call('ontologies.register', vcard);
    await this.broker.call('ontologies.register', rdfs);
  }
};
