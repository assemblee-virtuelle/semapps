const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const createSlug = require('speakingurl');
const { MIME_TYPES } = require('@semapps/mime-types');
const { generateId } = require('../../../utils');
const path = require('path');
const fs = require('fs');


module.exports = {
  api: async function api(ctx) {
    let { containerUri,containerPath,parser, ...resource } = ctx.params;
    try {
      let resourceUri;
      console.log('params',ctx.params);
      console.log('meta',ctx.meta);
      if (parser!=='file') {
        resourceUri = await ctx.call('ldp.resource.post', {
          containerUri: containerUri,
          slug: ctx.meta.headers.slug,
          resource,
          contentType: ctx.meta.headers['content-type'],
          accept: MIME_TYPES.JSON
        });
      } else {
        // console.log('BINARY');
        if(ctx.params.files){
          let file;
          if(ctx.params.files.length>1){
            throw new MoleculerError(`Multiple file upload not supported`, 400, 'BAD_REQUEST');
          }else {
            file = ctx.params.files[0]
          }
          resourceUri = await ctx.call('ldp.resource.post', {
            containerUri: containerUri,
            slug: file.filename||ctx.meta.headers.slug,
            resource :{
              '@context':{
                semapps : 'https://semapps.org/ontology#'
              },
              '@type':'semapps:file',
              'semapps:filename':file.filename,
              'semapps:encoding':file.encoding,
              'semapps:mimetype':file.mimetype,
              'semapps:fieldname':file.fieldname
            },
            contentType:MIME_TYPES.JSON,
            accept: MIME_TYPES.JSON,
            fileStream : file.readableStream
          });
        }
        ctx.meta.$responseHeaders = {
          Location: resourceUri,
          Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
          'Content-Length': 0
        };
        ctx.meta.$statusCode = 201;
      }
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: 'object',
      webId: {
        type: 'string',
        optional: true
      },
      contentType: {
        type: 'string'
      },
      containerUri: {
        type: 'string'
      },
      slug: {
        type: 'string',
        optional: true
      },
      fileStream: {
        type: 'object',
        optional: true
      }
    },
    async handler(ctx) {

      const { resource, containerUri, slug, contentType, webId,fileStream } = ctx.params;
      console.log('SLUG',slug);
      // Generate ID and make sure it doesn't exist already
      resource['@id'] = urlJoin(containerUri, slug ? createSlug(slug, { lang: 'fr' }) : generateId());
      resource['@id'] = await this.findAvailableUri(ctx, resource['@id']);
      if(fileStream){
        const filename = resource['@id'].replace(containerUri+'/','');
        const regex = /.*\/\/[^\/]*(\/.*)/gm;
        const containerPath= regex.exec(containerUri)[1];
        const dir=path.join('./uploads'+containerPath);
        const saveTo = path.join(dir,'/', filename);
        if (!fs.existsSync(dir)){
          process.umask(0);
          fs.mkdirSync(dir,{ recursive: true ,mode:parseInt('0777', 8)});
        }
        resource['semapps:localpath'] = saveTo;
        resource['semapps:filename'] = filename;
      }

      const containerExist = await ctx.call('ldp.container.exist', { containerUri });
      if (!containerExist) {
        throw new MoleculerError(
          `Cannot create resource in non-existing container ${containerUri}`,
          400,
          'BAD_REQUEST'
        );
      }
      console.log('resource',resource);
      if (!resource['@context']) {
        throw new MoleculerError(`No @context is provided for the resource ${resource['@id']}`, 400, 'BAD_REQUEST');
      }

      await ctx.call('triplestore.insert', {
        resource,
        contentType,
        webId
      });

      await ctx.call('ldp.container.attach', {
        resourceUri: resource['@id'],
        containerUri,
        webId
      });

<<<<<<< HEAD
      if(fileStream){
        try {
          fileStream.pipe(fs.createWriteStream(resource['semapps:localpath']));
        } catch (e) {
          throw new MoleculerError(e, 500, 'Server Error');
        }
      }
=======
      // Get the standard-formatted data to send with event
      const newData = await ctx.call(
        'ldp.resource.get',
        {
          resourceUri: resource['@id'],
          accept: MIME_TYPES.JSON,
          queryDepth: 1
        },
        { meta: { $cache: false } }
      );

      ctx.emit('ldp.resource.created', {
        resourceUri: resource['@id'],
        newData,
        webId
      });
>>>>>>> master

      return resource['@id'];
    }
  }
};
