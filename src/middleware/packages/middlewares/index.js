const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');
const Busboy = require('busboy');
const inspect = require('util').inspect;
const streams = require('memory-streams');

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
      next();
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

const throw403 = msg => {
  throw new MoleculerError('Forbidden', 403, 'ACCESS_DENIED', { status: 'Forbidden', text: msg });
};

const throw500 = msg => {
  throw new MoleculerError(msg, 500, 'INTERNAL_SERVER_ERROR', { status: 'Server Error', text: msg });
};

const negotiateAccept = (req, res, next) => {
  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  // we keep the full list for further use
  req.$ctx.meta.accepts = req.headers.accept;
  if (req.headers.accept === '*/*') {
    delete req.headers.accept;
  }
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

const getRawBody = req => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      resolve(data.length > 0 ? data : undefined);
    });
  });
};

const parseSparql = async (req, res, next) => {
  if (
    !req.$ctx.meta.parser &&
    (req.originalUrl.includes('/sparql') ||
      (req.headers['content-type'] && req.headers['content-type'].includes('sparql')))
  ) {
    req.$ctx.meta.parser = 'sparql';
    // TODO Store in req.$ctx.meta.rawBody
    req.$params.body = await getRawBody(req);
  }
  next();
};

const parseTurtle = async (req, res, next) => {
  if (!req.$ctx.meta.parser && req.headers['content-type'] && req.headers['content-type'].includes('turtle')) {
    req.$ctx.meta.parser = 'turtle';
    // TODO Store in req.$ctx.meta.rawBody
    req.$params.body = await getRawBody(req);
  }
  next();
};

const parseJson = async (req, res, next) => {
  let mimeType = null;
  try {
    if (req.headers['content-type']) {
      mimeType = negotiateTypeMime(req.headers['content-type']);
    }
  } catch (e) {
    // Do nothing if mime type is not found
  }

  try {
    if (!req.$ctx.meta.parser && mimeType === MIME_TYPES.JSON) {
      const body = await getRawBody(req);
      if (body) {
        const json = JSON.parse(body);
        req.$params = { ...json, ...req.$params };
        // Keep raw body in meta as we need it for digest header verification
        req.$ctx.meta.rawBody = body;
      }
      req.$ctx.meta.parser = 'json';
    }
    next();
  } catch (e) {
    next(e);
  }
};

const parseFile = (req, res, next) => {
  if (!req.$ctx.meta.parser && (req.method === 'POST' || req.method === 'PUT')) {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      const busboy = new Busboy({ headers: req.headers });
      let files = [];
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const readableStream = new streams.ReadableStream();
        file.on('data', data => readableStream.push(data));
        files.push({
          fieldname,
          readableStream,
          filename,
          encoding,
          mimetype
        });
      });
      busboy.on('field', (fieldname, val) => {
        req.$params[fieldname] = val;
      });
      busboy.on('finish', () => {
        req.$params.files = files.length > 0 ? files : undefined;
        next();
      });
      req.$ctx.meta.parser = 'file';
      req.pipe(busboy);
    } else {
      req.$params.files = [
        {
          readableStream: req,
          mimetype: req.headers['content-type']
        }
      ];
      req.$ctx.meta.parser = 'file';
      next();
    }
  } else {
    next();
  }
};

const addContainerUriMiddleware = containerUri => (req, res, next) => {
  if (containerUri.includes('/:username')) {
    req.$params.containerUri = containerUri.replace(':username', req.$params.username).replace(/\/$/, '');
    delete req.$params.username;
  } else {
    req.$params.containerUri = containerUri;
  }
  next();
};

module.exports = {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  addContainerUriMiddleware,
  throw403,
  throw500
};
