const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'ldp.route',
  settings: {
    baseUrl: null,
    defaultLdpAccept: 'text/turtle'
  },
  actions: {
    getApiRoutes(ctx) {
      const { containerUri, services } = ctx.params;

      const addContainerUriMiddleware = (req, res, next) => {
        req.$params.containerUri = containerUri;
        next();
      };

      const commonRouteConfig = {
        path: containerUri.replace(this.settings.baseUri, '/'),
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
          aliases: {
            'GET /': [addContainerUriMiddleware, services.list],
            'GET /:resourceId': [addContainerUriMiddleware, services.get]
          },
          ...commonRouteConfig
        },
        {
          authorization: true,
          authentication: false,
          aliases: {
            'POST /': [addContainerUriMiddleware, services.post],
            'PATCH /:resourceId': [addContainerUriMiddleware, services.patch],
            'DELETE /:resourceId': [addContainerUriMiddleware, services.delete]
          },
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
      if (req.headers['content-type'] !== undefined && req.method !== 'DELETE') {
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
