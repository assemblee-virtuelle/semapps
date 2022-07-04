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
    req.$params.body = await getRawBody(req);
  }
  next();
};

const parseTurtle = async (req, res, next) => {
  if (!req.$ctx.meta.parser && req.headers['content-type'] && req.headers['content-type'].includes('turtle')) {
    req.$ctx.meta.parser = 'turtle';
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

  if (!req.$ctx.meta.parser && mimeType === MIME_TYPES.JSON) {
    const body = await getRawBody(req);
    if (body) {
      const json = JSON.parse(body);
      req.$params = { ...json, ...req.$params };
    }
    req.$ctx.meta.parser = 'json';
  }
  next();
};

const parseFile = (req, res, next) => {
  if (!req.$ctx.meta.parser && (req.method === 'POST' || req.method === 'PUT')) {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      const busboy = new Busboy({ headers: req.headers });
      let files = [];
      let fields = [];
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const readableStream = new streams.ReadableStream();
        file.on('data', data => {
          readableStream.push(data);
        });
        file.on('end', () => {
          console.log('File [' + fieldname + '] Finished');
        });
        files.push({
          fieldname,
          readableStream,
          filename,
          encoding,
          mimetype
        });
      });
      busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        fields.push({
          key: fieldname,
          value: inspect(val)
        });
      });
      busboy.on('finish', () => {
        console.log('Done parsing form!');
        req.$params.files = files;
        req.$params.multipartFields = fields;
        next();
      });
      req.$ctx.meta.parser = 'file';
      req.pipe(busboy);
    } else {
      const files = [
        {
          readableStream: req,
          mimetype: req.headers['content-type']
        }
      ];
      req.$params.files = files;
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
