const ResourceService = require('./services/resource');
const ContainerService = require('./services/container');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: []
  },
  async created() {
    const { baseUrl, ontologies, containers } = this.schema.settings;

    await this.broker.createService(ResourceService, {
      settings: {
        baseUrl,
        ontologies
      },
    });

    await this.broker.createService(ContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers
      },
    });
  },
  actions: {
    getApiRoutes(ctx) {
      let aliases = {};

      this.settings.containers.forEach(containerPath => {
        const containerUri = this.settings.baseUrl + containerPath;
        aliases['GET ' + containerPath] = [
          (req, res, next) => {
            req.$params.containerUri = containerUri;
            next();
          },
          'ldp.container.get'
        ];
      });

      return ({
        // When using multiple routes we must set the body parser for each route.
        bodyParsers: {
          json: false,
          urlencoded: false
        },
        authorization: false,
        authentication: true,
        aliases
      });
    }
  }
};
