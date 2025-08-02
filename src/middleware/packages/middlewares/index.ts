import { negotiateTypeMime, MIME_TYPES } from '@semapps/mime-types';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'busb... Remove this comment to see the full error message
import Busboy from 'busboy';
import streams from 'memory-streams';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const handledMimeTypes = [MIME_TYPES.JSON, MIME_TYPES.TURTLE, MIME_TYPES.TRIPLE, MIME_TYPES.SPARQL_UPDATE];

// Put requested URL and query string in meta so that services may use them independently
// Set here https://github.com/moleculerjs/moleculer-web/blob/c6ec80056a64ea15c57d6e2b946ce978d673ae92/src/index.js#L151-L161
const parseUrl = async (req: any, res: any, next: any) => {
  req.$ctx.meta.requestUrl = req.parsedUrl;
  req.$ctx.meta.queryString = req.query;
  next();
};

const parseHeader = async (req: any, res: any, next: any) => {
  req.$ctx.meta.headers = req.headers ? { ...req.headers } : {};
  // Also remember original headers (needed for HTTP signatures verification and files type negociation)
  req.$ctx.meta.originalHeaders = req.headers ? { ...req.headers } : {};
  next();
};

const negotiateContentType = (req: any, res: any, next: any) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the negotiateContentType middleware`);

  req.$ctx.meta.contentTypeNegotiated = true;

  if (req.$ctx.meta.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.$ctx.meta.headers['content-type'] = negotiateTypeMime(req.$ctx.meta.headers['content-type']);
      next();
    } catch (e) {
      next();
    }
  } else if (req.$ctx.meta.rawBody) {
    throw new MoleculerError(
      'Content-Type has to be specified for a non-empty body ',
      400,
      'CONTENT_TYPE_NOT_SPECIFIED'
    );
  } else {
    next();
  }
};

const negotiateAccept = (req: any, res: any, next: any) => {
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

const parseRawBody = (req: any, res: any, next: any) => {
  if (!req.$ctx.meta.contentTypeNegotiated)
    throw new Error(`The negotiateContentType middleware must be added before the parseRawBody middleware`);

  // We don't want to parse the raw body for files, otherwise the stream will not be available anymore
  if (handledMimeTypes.includes(req.$ctx.meta.headers['content-type'])) {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      if (data.length > 0) req.$ctx.meta.rawBody = data;
      req.$ctx.meta.rawBodyParsed = true; // Used to detect if the middleware was added
      next();
    });
  } else {
    req.$ctx.meta.rawBodyParsed = true; // Used to detect if the middleware was added
    next();
  }
};

const parseJson = async (req: any, res: any, next: any) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseJson middleware`);

  if (!req.$ctx.meta.rawBodyParsed)
    throw new Error(`The parseRawBody middleware must be added before the parseJson middleware`);

  if (req.$ctx.meta.headers['content-type'] === MIME_TYPES.JSON && req.$ctx.meta.rawBody) {
    try {
      const json = JSON.parse(req.$ctx.meta.rawBody);
      req.$params = { ...json, ...req.$params };
    } catch (e) {
      // If JSON parsing failed, ignore
    }
  }

  next();
};

const parseFile = (req: any, res: any, next: any) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseFile middleware`);

  const contentType = req.$ctx.meta.headers['content-type'];

  if (!handledMimeTypes.includes(contentType) && (req.method === 'POST' || req.method === 'PUT')) {
    if (contentType.includes('multipart/form-data')) {
      const busboy = new Busboy({ headers: req.$ctx.meta.headers });
      const files: any = [];
      busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const readableStream = new streams.ReadableStream();
        file.on('data', (data: any) => readableStream.push(data));
        files.push({
          fieldname,
          readableStream,
          filename,
          encoding,
          mimetype
        });
      });
      busboy.on('field', (fieldname: any, val: any) => {
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
          mimetype: contentType
        }
      ];
      req.$ctx.meta.parser = 'file';
      next();
    }
  } else {
    next();
  }
};

const saveDatasetMeta = (req: any, res: any, next: any) => {
  req.$ctx.meta.dataset = req.$params.username;
  next();
};

/** @type {(msg: string) => never} */
const throw400 = (msg: any) => {
  throw new MoleculerError(msg, 400, 'BAD_REQUEST', { status: 'Bad Request', text: msg });
};

/** @type {(msg: string) => never} */
const throw403 = (msg: any) => {
  throw new MoleculerError('Forbidden', 403, 'ACCESS_DENIED', { status: 'Forbidden', text: msg });
};

/** @type {(msg: string) => never} */
const throw404 = (msg: any) => {
  throw new MoleculerError('Forbidden', 404, 'NOT_FOUND', { status: 'Not found', text: msg });
};

const throw500 = (msg: any) => {
  throw new MoleculerError(msg, 500, 'INTERNAL_SERVER_ERROR', { status: 'Server Error', text: msg });
};

export {
  parseUrl,
  parseHeader,
  parseRawBody,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseFile,
  saveDatasetMeta,
  throw400,
  throw403,
  throw404,
  throw500
};
