const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');
const Busboy = require('busboy');
const streams = require('memory-streams');

const parseHeader = async (req, res, next) => {
  req.$ctx.meta.headers = req.headers ? { ...req.headers } : {};
  // Also remember original headers (needed for HTTP signatures verification and files type negociation)
  req.$ctx.meta.originalHeaders = req.headers ? { ...req.headers } : {};
  next();
};

const negotiateContentType = (req, res, next) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the negotiateContentType middleware`);
  if (req.$ctx.meta.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.$ctx.meta.headers['content-type'] = negotiateTypeMime(req.$ctx.meta.headers['content-type']);
      next();
    } catch (e) {
      next();
    }
  } else if (req.$params.body) {
    next(
      new MoleculerError('Content-Type has to be specified for a non-empty body ', 400, 'CONTENT_TYPE_NOT_SPECIFIED')
    );
  } else {
    next();
  }
};

/** @type {(msg: string) => never} */
const throw403 = msg => {
  throw new MoleculerError('Forbidden', 403, 'ACCESS_DENIED', { status: 'Forbidden', text: msg });
};

const throw500 = msg => {
  throw new MoleculerError(msg, 500, 'INTERNAL_SERVER_ERROR', { status: 'Server Error', text: msg });
};

const negotiateAccept = (req, res, next) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the negotiateAccept middleware`);
  if (req.$ctx.meta.headers.accept === '*/*') {
    delete req.$ctx.meta.headers.accept;
  }
  if (req.$ctx.meta.headers.accept !== undefined) {
    try {
      req.$ctx.meta.headers.accept = negotiateTypeMime(req.$ctx.meta.headers.accept);
      next();
    } catch (e) {
      next(new MoleculerError(`Accept not supported : ${req.$ctx.meta.headers.accept}`, 400, 'ACCEPT_NOT_SUPPORTED'));
    }
  } else {
    next();
  }
};

const getRawBody = req => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data.length > 0 ? data : undefined);
    });
  });
};

const parseSparql = async (req, res, next) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseSparql middleware`);
  if (
    !req.$ctx.meta.parser &&
    (req.originalUrl.includes('/sparql') ||
      (req.$ctx.meta.headers['content-type'] && req.$ctx.meta.headers['content-type'].includes('sparql')))
  ) {
    req.$ctx.meta.parser = 'sparql';
    // TODO Store in req.$ctx.meta.rawBody
    req.$params.body = await getRawBody(req);
  }
  next();
};

const parseTurtle = async (req, res, next) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseTurtle middleware`);
  if (
    !req.$ctx.meta.parser &&
    req.$ctx.meta.headers['content-type'] &&
    req.$ctx.meta.headers['content-type'].includes('turtle')
  ) {
    req.$ctx.meta.parser = 'turtle';
    // TODO Store in req.$ctx.meta.rawBody
    req.$params.body = await getRawBody(req);
  }
  next();
};

const parseJson = async (req, res, next) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseJson middleware`);
  let mimeType = null;
  try {
    if (req.$ctx.meta.headers['content-type']) {
      mimeType = negotiateTypeMime(req.$ctx.meta.headers['content-type']);
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
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseFile middleware`);
  if (!req.$ctx.meta.parser && (req.method === 'POST' || req.method === 'PUT')) {
    if (
      req.$ctx.meta.headers['content-type'] &&
      req.$ctx.meta.headers['content-type'].includes('multipart/form-data')
    ) {
      const busboy = new Busboy({ headers: req.$ctx.meta.headers });
      const files = [];
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
          mimetype: req.$ctx.meta.headers['content-type']
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
  if (containerUri.includes('/:username([^/.][^/]+)')) {
    req.$params.containerUri = containerUri.replace(':username([^/.][^/]+)', req.$params.username).replace(/\/$/, '');
  } else {
    req.$params.containerUri = containerUri;
  }
  next();
};

const saveDatasetMeta = (req, res, next) => {
  req.$ctx.meta.dataset = req.$params.username;
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
  saveDatasetMeta,
  throw403,
  throw500
};
