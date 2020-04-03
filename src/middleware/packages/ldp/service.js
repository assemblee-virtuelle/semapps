const LdpContainerService = require('./services/container');
const LdpResourceService = require('./services/resource');
const LdpRouteService = require('./services/route');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: ['resources'],
    defaultLdpAccept: 'text/turtle'
  },
  async created() {
    const { baseUrl, ontologies, containers, defaultLdpAccept } = this.schema.settings;

    await this.broker.createService(LdpContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers
      }
    });

    await this.broker.createService(LdpResourceService, {
      settings: {
        baseUrl,
        ontologies
      }
    });

    await this.broker.createService(LdpRouteService, {
      settings: {
        baseUrl,
        defaultLdpAccept
      }
    });
  },
  actions: {
    async getApiRoutes(ctx) {
      let routes = [];

      for( let containerPath of this.settings.containers ) {
        routes.push(...await ctx.call('ldp.route.getApiRoutes', {
          containerPath,
          services: {
            list: 'ldp.container.api_get',
            get: 'ldp.resource.api_get',
            post: 'ldp.resource.api_post',
            patch: 'ldp.resource.api_patch',
            delete: 'ldp.resource.api_delete'
          }
        }));
      }

      return routes;
    }
  }
};
