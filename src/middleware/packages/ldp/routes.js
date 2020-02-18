const mimeNegotiation = require('@semapps/mime-negotiation');
const { MoleculerError } = require('moleculer').Errors;
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
    const data = await bodyPromise;
    ctx.meta.body = data;
    // Set request headers to context meta
    ctx.meta.headers = req.headers;
    if (req.headers['content-type'] !== undefined) {
      try {
        const contentSupportedMime = mimeNegotiation.negociateTypeMime(req.headers['content-type']);
        ctx.meta.headers['content-type'] = contentSupportedMime;
        if (contentSupportedMime === mimeNegotiation.SUPPORTED_MIME_TYPES.JSON) {
          ctx.meta.body = JSON.parse(ctx.meta.body);
        }
      } catch (e) {
        throw new MoleculerError(
          'content-type not supported : ' + req.headers['content-type'],
          400,
          'CONTENT_NOT_SUPPORTED'
        );
      }
    } else {
      if (ctx.meta.body) {
        throw new MoleculerError(
          'content-type have to be specified for non empty body ',
          400,
          'CONTENT_TYPE_NOT_SPECIFIED'
        );
      }
    }
    if (req.headers.accept === undefined || req.headers.accept === '*/*') {
      req.headers.accept = this.settings.defaultLdpAccept;
    } else {
      try {
        const acceptSupportedMime = mimeNegotiation.negociateTypeMime(req.headers.accept);
        ctx.meta.headers['content-type'] = acceptSupportedMime;
      } catch (e) {
        throw new MoleculerError('accept not supported : ' + req.headers.accept, 400, 'ACCEPT_NOT_SUPPORTED');
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
