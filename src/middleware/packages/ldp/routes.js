const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

const routeConfig = {
  path: '/ldp',
  // When using multiple routes we must set the body parser for each route.
  bodyParsers: {
    json: false,
    urlencoded: false
  },
  async onBeforeCall(ctx, route, req, res) {
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
};

module.exports = [
  // Unsecured routes
  {
    authorization: false,
    authentication: true,
    aliases: {
      'GET :typeURL': 'ldp.api_getByType',
      'GET :typeURL/:resourceId': 'ldp.api_get'
    },
    ...routeConfig
  },
  // Secured routes
  {
    authorization: true,
    authentication: false,
    aliases: {
      'POST :typeURL': 'ldp.api_post',
      'DELETE :typeURL/:resourceId': 'ldp.api_delete',
      'PATCH :typeURL/:resourceId': 'ldp.api_patch'
    },
    ...routeConfig
  }
];
