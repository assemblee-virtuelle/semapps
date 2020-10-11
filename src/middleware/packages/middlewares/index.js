const { MoleculerError } = require('moleculer').Errors;
const { negotiateTypeMime, MIME_TYPES } = require('@semapps/mime-types');
const Busboy = require('busboy');
const inspect = require('util').inspect;

const path = require('path');
const fs = require('fs');
const Stream = require('stream');
var streams = require('memory-streams');

const parseHeader = async (req, res, next) => {
  req.$ctx.meta.headers = req.headers || {};
  next();
};

const negotiateContentType = (req, res, next) => {

  if (!req.$ctx.meta.headers) req.$ctx.meta.headers = {};
  // console.log('negotiateContentType',req.headers['content-type']);
  if (req.headers['content-type'] !== undefined && req.method !== 'DELETE') {
    try {
      req.$ctx.meta.headers['content-type'] = negotiateTypeMime(req.headers['content-type']);
      // console.log('negotiateContentType OK',req.$ctx.meta.headers['content-type']);
      next();
    } catch (e) {
      // console.log('negotiateContentType KO');
      // req.$ctx.meta.headers['content-type-raw'] = req.headers['content-type'];
      // req.$ctx.meta.headers['content-type'] = undefined;
      next();
      // next(
      //   new MoleculerError(
      //     'Content-Type not supported : ' + req.headers['content-type'],
      //     400,
      //     'CONTENT_TYPE_NOT_SUPPORTED'
      //   )
      // );
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

const parseSparql = async (req, res, next) => {
  if (!req.$params.parser &&
      (
        req.originalUrl.includes('/sparql')||
        req.headers['content-type'] && req.headers['content-type'].includes('sparql')
      )
    ) {
    const bodyPromise = new Promise((resolve, reject) => {
      let data = '';
      req.on('data', function(chunk) {
        data += chunk;
      });
      req.on('end', function() {
        resolve(data.length > 0 ? data : undefined);
      });
    });
    req.$params.parser='sparql'
    req.$params.body = await bodyPromise;
  }
  next();
};

const parseJson = (req, res, next) => {

  if (!req.$params.parse && req.headers['content-type'] && req.headers['content-type'] === MIME_TYPES.JSON) {
    const { body, ...otherParams } = req.$params;
    if (body) {
      const json = JSON.parse(body);
      req.$params = { ...json, ...otherParams };
    }
    req.$params.parser='json'
  }
  next();
};

const parseFile = (req, res, next) => {
  if (!req.$params.parse){
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')){
      var busboy = new Busboy({ headers: req.headers });
      let files = [];
      let fields = []
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

        const readableStream = new streams.ReadableStream();
        file.on('data', (data)=>{
          console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
          console.log(data.toString());
          readableStream.push(data)

        });
        file.on('end', ()=>{
          console.log('File [' + fieldname + '] Finished');

        });
        files.push ({
          fieldname,
          readableStream,
          filename,
          encoding,
          mimetype
        })
      });
      busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        fields.push({
          key : fieldname,
          value : inspect(val)
        })
      });
      busboy.on('finish', function() {
        console.log('Done parsing form!');
        req.$params.files=files;
        req.$params.multipartFields = fields;
        next();
      });
      req.$params.parser='file';
      req.pipe(busboy);
    }else{
      const readableStream = new streams.ReadableStream();
      // req.pipe(readableStream);
      let files=[{
        readableStream:req,
        mimetype:req.headers['content-type']
      }]
      req.$params.files=files;
      req.$params.parser='file';
      next();
    }
  }
  // console.log(req.headers['content-type']);
};


const addContainerUriMiddleware = (containerUri,containerPath) => (req, res, next) => {
  req.$params.containerUri = containerUri;
  req.$params.containerPath =containerPath
  next();
};

module.exports = {
  parseHeader,
  parseSparql,
  negotiateContentType,
  negotiateAccept,
  parseJson,
  parseFile,
  addContainerUriMiddleware
};
