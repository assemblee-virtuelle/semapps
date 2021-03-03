const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    // PUT have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
    resource['@id'] = `${containerUri}/${id}`;
    if (ctx.meta.parser === 'file') {
      throw new MoleculerError(`PUT method is not supported for non-RDF resources`, 400, 'BAD_REQUEST');
    }

    try {
      await ctx.call('ldp.resource.put', {
        resource,
        contentType: ctx.meta.headers['content-type'],
        containerUri,
        slug: id,
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      contentType: { type: 'string' }
    },
    async handler(ctx) {
      const { resource, contentType } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId;
      const resourceUri = resource.id || resource['@id'];

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      // If the new data are badly formatted, old data will be reinserted before throwing a 400 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        queryDepth: 1,
        webId
      });

      // First delete the whole resource
      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${resourceUri}> ?p ?v }
        `,
        webId
      });

      try {
        // ... then insert back all the data
        await ctx.call('triplestore.insert', {
          resource,
          contentType,
          webId
        });
      } catch (e) {
        // If the insertion of new data fails, inserts back old data
        await ctx.call('triplestore.insert', {
          resource: oldData,
          contentType: MIME_TYPES.JSON
        });

        // ... then rethrows an error
        throw new MoleculerError('Could not put resource: ' + e.message, 400, 'BAD_REQUEST');
      }

      // Get the new data, with the same formatting as the old data
      const newData = await ctx.call(
        'ldp.resource.get',
        {
          resourceUri,
          accept: MIME_TYPES.JSON,
          queryDepth: 1,
          webId
        },
        { meta: { $cache: false } }
      );

      ctx.emit('ldp.resource.updated', {
        resourceUri,
        oldData,
        newData,
        webId
      });

      return resourceUri;
    }
  }
};
