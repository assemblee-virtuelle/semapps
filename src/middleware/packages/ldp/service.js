const ResourceService = require('./services/resource');
const ContainerService = require('./services/container');
const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: [],
    containers: ['resources'],
    defaultLdpAccept: 'text/turtle'
  },
  async created() {
    const { baseUrl, ontologies, containers } = this.schema.settings;

    await this.broker.createService(ResourceService, {
      settings: {
        baseUrl,
        ontologies
      }
    });

    await this.broker.createService(ContainerService, {
      settings: {
        baseUrl,
        ontologies,
        containers
      }
    });
  },
  actions: {
    getApiRoutes(ctx) {
      let securedRoutes = {},
        unsecuredRoutes = {};

      const addContainerUriMiddleware = containerPath => (req, res, next) => {
        req.$params.containerUri = this.settings.baseUrl + containerPath;
        next();
      };

      this.settings.containers.forEach(containerPath => {
        unsecuredRoutes['GET ' + containerPath] = [addContainerUriMiddleware(containerPath), 'ldp.container.api_get'];

        unsecuredRoutes['GET ' + containerPath + '/:resourceId'] = [
          addContainerUriMiddleware(containerPath),
          'ldp.resource.api_get'
        ];

        securedRoutes['POST ' + containerPath] = [addContainerUriMiddleware(containerPath), 'ldp.resource.api_post'];

        securedRoutes['DELETE ' + containerPath + '/:resourceId'] = [
          addContainerUriMiddleware(containerPath),
          'ldp.resource.api_delete'
        ];

        securedRoutes['PATCH ' + containerPath + '/:resourceId'] = [
          addContainerUriMiddleware(containerPath),
          'ldp.resource.api_patch'
        ];
      });

      // TODO put legacy "automatic container" on another service
      unsecuredRoutes['GET ldp/:typeURL'] = 'ldp.resource.api_getByType';

      const commonRouteConfig = {
        path: ctx.params.path,
        // When using multiple routes we must set the body parser for each route.
        bodyParsers: {
          json: false,
          urlencoded: false
        },
        onBeforeCall: async (ctx, route, req, res) => {
          await this.saveHeaders(ctx, route, req, res);
        }
      };

      return [
        {
          authorization: false,
          authentication: true,
          aliases: unsecuredRoutes,
          ...commonRouteConfig
        },
        {
          authorization: true,
          authentication: false,
          aliases: securedRoutes,
          ...commonRouteConfig
        }
      ];
    }
  },
  methods: {
    async saveHeaders(ctx, route, req, res) {
      const bodyPromise = new Promise((resolve, reject) => {
        let data = '';
        req.on('data', function(chunk) {
          data += chunk;
        });
        req.on('end', function() {
          resolve(data.length > 0 ? data : undefined);
        });
      });
      ctx.meta.body = await bodyPromise;

      // Set request headers to context meta
      ctx.meta.headers = req.headers;
      if (req.headers['content-type'] !== undefined) {
        try {
          const contentSupportedMime = negotiateTypeMime(req.headers['content-type']);
          ctx.meta.headers['content-type'] = contentSupportedMime;
          if (contentSupportedMime === MIME_TYPES.JSON) {
            ctx.meta.body = JSON.parse(ctx.meta.body);
          }
        } catch (e) {
          throw new MoleculerError(
            'Content-Type not supported : ' + req.headers['content-type'],
            400,
            'CONTENT_NOT_SUPPORTED'
          );
        }
      } else {
        if (ctx.meta.body) {
          throw new MoleculerError(
            'Content-type have to be specified for non empty body ',
            400,
            'CONTENT_TYPE_NOT_SPECIFIED'
          );
        }
      }
      if (req.headers.accept === undefined || req.headers.accept === '*/*') {
        req.headers.accept = this.settings.defaultLdpAccept;
      } else {
        try {
          ctx.meta.headers['content-type'] = negotiateTypeMime(req.headers.accept);
        } catch (e) {
          throw new MoleculerError('Accept not supported : ' + req.headers.accept, 400, 'ACCEPT_NOT_SUPPORTED');
        }
      }
    }
  }
};
