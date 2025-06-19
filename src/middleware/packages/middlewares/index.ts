import { negotiateTypeMime, MIME_TYPES } from '@semapps/mime-types';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'busb... Remove this comment to see the full error message
import Busboy from 'busboy';
import streams from 'memory-streams';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

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

const getRawBody = (req: any) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data.length > 0 ? data : undefined);
    });
  });
};

const parseSparql = async (req: any, res: any, next: any) => {
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

const parseTurtle = async (req: any, res: any, next: any) => {
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

const parseJson = async (req: any, res: any, next: any) => {
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
        // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
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

const parseFile = (req: any, res: any, next: any) => {
  if (!req.$ctx.meta.headers)
    throw new Error(`The parseHeader middleware must be added before the parseFile middleware`);
  if (!req.$ctx.meta.parser && (req.method === 'POST' || req.method === 'PUT')) {
    if (
      req.$ctx.meta.headers['content-type'] &&
      req.$ctx.meta.headers['content-type'].includes('multipart/form-data')
    ) {
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

const saveDatasetMeta = (req: any, res: any, next: any) => {
  req.$ctx.meta.dataset = req.$params.username;
  next();
};

export {
  parseUrl,
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseTurtle,
  parseFile,
  saveDatasetMeta,
  throw400,
  throw403,
  throw404,
  throw500
};
