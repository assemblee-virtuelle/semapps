const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const getApiRoutes = require('./routes/getApiRoutes');

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
        routes.push(
          ...getApiRoutes({
            containerUri: this.settings.baseUrl + containerPath,
            services: {
              list: 'ldp.container.api_get',
              get: 'ldp.resource.api_get',
              post: 'ldp.resource.api_post',
              patch: 'ldp.resource.api_patch',
              delete: 'ldp.resource.api_delete'
            }
          })
        );
      }

      return routes;
    }
  }
};
