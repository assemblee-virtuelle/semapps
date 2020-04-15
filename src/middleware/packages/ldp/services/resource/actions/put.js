const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    //resource['@id'] is old value and can be different that new container
    resource['@id'] = resource['@id'] || `${containerUri}/${id}`;

    try {
      await ctx.call('ldp.resource.put', {
        resource,
        accept: ctx.meta.headers.accept,
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
      contentType: { type: 'string' },
      containerUri: { type: 'string' },
      slug: { type: 'string' }
    },
    async handler(ctx) {
      const { resource, accept, contentType, containerUri, slug, webId } = ctx.params;

      const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resource['@id']
      });
      if (triplesNb > 0) {
        await ctx.call('ldp.resource.delete', {
          resourceUri: resource['@id']
        });
        await ctx.call('ldp.resource.post', {
          resource,
          contentType,
          webId,
          containerUri,
          slug
        });

        return resource['@id'];
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
