const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    let { containerUri, ...resource } = ctx.params;
    try {
      let resourceUri;
      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
      if (ctx.meta.parser !== 'file') {
        resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
          containerUri,
          slug: ctx.meta.headers.slug,
          resource,
          contentType: ctx.meta.headers['content-type']
        });
      } else {
        if (ctx.params.files.length > 1) {
          throw new MoleculerError(`Multiple file upload not supported`, 400, 'BAD_REQUEST');
        }
        resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
          containerUri,
          slug: ctx.meta.headers.slug || ctx.params.files[0].filename,
          file: ctx.params.files[0],
          contentType: MIME_TYPES.JSON
        });
      }
      ctx.meta.$responseHeaders = {
        Location: resourceUri,
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
      ctx.meta.$statusCode = 201;
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      containerUri: {
        type: 'string'
      },
      slug: {
        type: 'string',
        optional: true
      },
      resource: {
        type: 'object',
        optional: true
      },
      file: {
        type: 'object',
        optional: true
      },
      contentType: {
        type: 'string'
      },
      webId: {
        type: 'string',
        optional: true
      },
      disassembly: {
        type: 'array',
        optional: true
      }
    },
    async handler(ctx) {
      let { resource, containerUri, slug, contentType, file } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      const resourceUri = await ctx.call('ldp.resource.generateId', { containerUri, slug });

      const containerExist = await ctx.call('ldp.container.exist', { containerUri, webId });
      if (!containerExist) {
        throw new MoleculerError(
          `Cannot create resource in non-existing container ${containerUri}`,
          400,
          'BAD_REQUEST'
        );
      }

      await ctx.call('triplestore.insert', {
        resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
        webId
      });

      try {
        if (file) {
          resource = await ctx.call('ldp.resource.upload', { resourceUri, file });
        }

        const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });

        await ctx.call(controlledActions.create || 'ldp.resource.create', {
          resource: {
            '@id': resourceUri,
            ...resource
          },
          contentType,
          webId
        });
      } catch (e) {
        // If there was an error inserting the resource, detach it from the container
        await ctx.call('triplestore.update', {
          query: `DELETE WHERE { <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }`,
          webId
        });

        // Re-throw the error so that it's displayed by the API function
        throw e;
      }

      ctx.emit(
        'ldp.container.attached',
        {
          containerUri,
          resourceUri
        },
        { meta: { webId: null, dataset: null } }
      );

      // this is usefull to propagate the attachement to mirroring servers.
      // we prefer not to use the event ldp.container.attached for that purpose
      // (because it would trigger too many activities in case of a long PATCH)
      ctx.emit(
        'ldp.container.patched',
        {
          containerUri
        },
        { meta: { webId: null, dataset: null } }
      );

      return resourceUri;
    }
  }
};
