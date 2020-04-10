const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

const parseBody = (req, res, next) => {
  let data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    req.$ctx.meta.body = data.length > 0 ? data : undefined;
    next();
  });
};

const negotiateContentType = (req, res, next) => {
  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  if (req.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.$ctx.meta.headers['content-type'] = negotiateTypeMime(req.headers['content-type']);
    } catch (e) {
      throw new MoleculerError(
        'Content-Type not supported : ' + req.headers['content-type'],
        400,
        'CONTENT_TYPE_NOT_SUPPORTED'
      );
    }
  } else {
    if (req.$ctx.meta.body) {
      throw new MoleculerError(
        'Content-Type has to be specified for a non-empty body ',
        400,
        'CONTENT_TYPE_NOT_SPECIFIED'
      );
    }
  }
  next();
};

const negotiateAccept = (req, res, next) => {
  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  if (req.headers.accept !== undefined && req.headers.accept !== '*/*') {
    try {
      req.$ctx.meta.headers.accept = negotiateTypeMime(req.headers.accept);
    } catch (e) {
      throw new MoleculerError('Accept not supported : ' + req.headers.accept, 400, 'ACCEPT_NOT_SUPPORTED');
    }
  }
  next();
};

const parseJson = (req, res, next) => {
  if (req.$ctx.meta.headers['content-type'] === MIME_TYPES.JSON) {
    req.$ctx.meta.body = JSON.parse(req.$ctx.meta.body);
  }
  next();
};

const addContainerUriMiddleware = containerUri => (req, res, next) => {
  req.$params.containerUri = containerUri;
  next();
};

module.exports = {
  parseBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  addContainerUriMiddleware
};
