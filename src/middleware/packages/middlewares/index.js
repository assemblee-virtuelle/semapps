const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');

const parseBody = async (req, res, next) => {
  const bodyPromise = new Promise((resolve, reject) => {
    let data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      resolve(data.length > 0 ? data : undefined);
    });
  });
  req.$params.body = await bodyPromise;
  next();
};

const parseHeader = async (req, res, next) => {
  req.$ctx.meta.headers = req.headers || {};
  next();
};

const negotiateContentType = (req, res, next) => {
  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  if (req.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.$ctx.meta.headers['content-type'] = negotiateTypeMime(req.headers['content-type']);
      next();
    } catch (e) {
      next(
        new MoleculerError(
          'Content-Type not supported : ' + req.headers['content-type'],
          400,
          'CONTENT_TYPE_NOT_SUPPORTED'
        )
      );
    }
  } else {
    if (req.$params.body) {
      next(
        new MoleculerError('Content-Type has to be specified for a non-empty body ', 400, 'CONTENT_TYPE_NOT_SPECIFIED')
      );
    } else {
      next();
    }
  }
};

const negotiateAccept = (req, res, next) => {
  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  if (req.headers.accept === '*/*') req.headers.accept = undefined;
  if (req.headers.accept !== undefined) {
    try {
      req.$ctx.meta.headers.accept = negotiateTypeMime(req.headers.accept);
      next();
    } catch (e) {
      next(new MoleculerError('Accept not supported : ' + req.headers.accept, 400, 'ACCEPT_NOT_SUPPORTED'));
    }
  } else {
    next();
  }
};

const parseJson = (req, res, next) => {
  if (req.$ctx.meta.headers['content-type'] === MIME_TYPES.JSON) {
    const { body, ...otherParams } = req.$params;
    const json = JSON.parse(body);
    req.$params = { ...json, ...otherParams };
  }
  next();
};

const addContainerUriMiddleware = containerUri => (req, res, next) => {
  req.$params.containerUri = containerUri;
  next();
};

module.exports = {
  parseHeader,
  parseBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  addContainerUriMiddleware
};
