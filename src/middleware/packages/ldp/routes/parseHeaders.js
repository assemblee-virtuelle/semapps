const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

// We must parse the body ourselves because the ApiGateway only understands JSON body
const getBody = req =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      resolve(data.length > 0 ? data : undefined);
    });
  });

async function parseHeaders(ctx, route, req, res) {
  // Body
  ctx.meta.body = await getBody(req);

  // Content-Type
  if (req.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.headers['content-type'] = negotiateTypeMime(req.headers['content-type']);
      if (req.headers['content-type'] === MIME_TYPES.JSON) {
        ctx.meta.body = JSON.parse(ctx.meta.body);
      }
    } catch (e) {
      throw new MoleculerError(
        'Content-Type not supported : ' + req.headers['content-type'],
        400,
        'CONTENT_TYPE_NOT_SUPPORTED'
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

  // Accept
  if (req.headers.accept !== undefined && req.headers.accept !== '*/*') {
    try {
      req.headers['content-type'] = negotiateTypeMime(req.headers.accept);
    } catch (e) {
      throw new MoleculerError('Accept not supported : ' + req.headers.accept, 400, 'ACCEPT_NOT_SUPPORTED');
    }
  }

  // Assign request headers to Moleculer ctx
  ctx.meta.headers = req.headers;
}

module.exports = parseHeaders;
