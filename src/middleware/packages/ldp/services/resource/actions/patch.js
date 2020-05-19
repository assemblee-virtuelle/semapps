const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    //PATCH have to stay in same container and @id can't be different
    resource['@id'] = `${containerUri}/${id}`;

    try {
      await ctx.call('ldp.resource.patch', {
        resource,
        contentType: ctx.meta.headers['content-type']
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
      resource: {
        type: 'object'
      },
      webId: {
        type: 'string',
        optional: true
      },
      contentType: {
        type: 'string'
      }
    },
    async handler(ctx) {
      const { resource, contentType, webId } = ctx.params;

      const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resource['@id']
      });

      if (triplesNb > 0) {
        const query = await this.buildDeleteQueryFromResource(resource);

        await ctx.call('triplestore.update', {
          query,
          webId
        });

        await ctx.call('triplestore.insert', {
          resource,
          contentType,
          webId
        });

        return resource['@id'];
      } else {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }
    }
  }
};
