const urlJoin = require('url-join');
const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const getContainerRoutes = require('./routes/getContainerRoutes');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: ['/resources'],
    defaultAccept: 'text/turtle',
    defaultJsonContext: null
  },
  async created() {
    const { baseUrl, ontologies, containers, defaultAccept, defaultJsonContext } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        defaultAccept,
        defaultJsonContext
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        defaultAccept,
        defaultJsonContext
      }
    });
  },
  actions: {
    getApiRoutes() {
      let routes = [];
      // Associate all containers in settings with the LDP service
      for (let containerPath of this.settings.containers) {
        routes.push(...getContainerRoutes(urlJoin(this.settings.baseUrl, containerPath),undefined,containerPath));
      }
      return routes;
    }
  }
};
