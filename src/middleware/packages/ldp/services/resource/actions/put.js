const { MoleculerError } = require('moleculer').Errors;

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
      const { resource, accept, contentType, webId } = ctx.params;
      const matches = resource['@id'].match(new RegExp(`(.*)/(.*)`));
      const effetivContainerUri = matches[1];
      const slug = matches[2];

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
          containerUri: effetivContainerUri,
          slug
        });

        return resource['@id'];
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
