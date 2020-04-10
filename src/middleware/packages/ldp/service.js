const url = require('url');
const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const getContainerRoutes = require('./routes/getContainerRoutes');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: ['resources'],
    defaultAccept: 'text/turtle'
  },
  async created() {
    const { baseUrl, ontologies, containers, defaultAccept } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers,
        defaultAccept
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies,
        defaultAccept
      }
    });
  },
  actions: {
    getApiRoutes() {
      let routes = [];
      // Associate all containers in settings with the LDP service
      for (let containerPath of this.settings.containers) {
        routes.push(...getContainerRoutes(url.resolve(this.settings.baseUrl, containerPath)));
      }
      return routes;
    }
  }
};
