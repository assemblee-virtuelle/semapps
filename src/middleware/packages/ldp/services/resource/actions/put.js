const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, containerPath, parser, id, ...resource } = ctx.params;

    //PUT have to stay in same container and @id can't be different
    resource['@id'] = `${containerUri}/${id}`;
    if (parser === 'file') {
      throw new MoleculerError(`non RDF Ressource PUT not supported`, 400, 'BAD_REQUEST');
    }

    try {
      await ctx.call('ldp.resource.put', {
        resource,
        contentType: ctx.meta.headers['content-type'],
        containerUri,
        slug: id
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
      const { resource, contentType, webId } = ctx.params;

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri: resource['@id'],
        accept: MIME_TYPES.JSON,
        queryDepth: 1
      });

      // First delete the resource
      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${resource['@id']}> ?p ?v }
        `,
        webId
      });

      // ... then insert back all the data
      await ctx.call('triplestore.insert', {
        resource,
        contentType,
        webId
      });

      // Get the new data, with the same formatting as the old data
      const newData = await ctx.call(
        'ldp.resource.get',
        {
          resourceUri: resource['@id'],
          accept: MIME_TYPES.JSON,
          queryDepth: 1
        },
        { meta: { $cache: false } }
      );

      ctx.emit('ldp.resource.updated', {
        resourceUri: resource['@id'],
        oldData,
        newData,
        webId
      });

      return resource['@id'];
    }
  }
};
