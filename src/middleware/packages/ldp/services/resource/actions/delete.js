const { MoleculerError } = require('moleculer').Errors;
const { getContainerFromUri } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    try {
      const { typeURL, id, containerUri } = ctx.params;
      const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${id}`;
      await ctx.call('ldp.resource.delete', {
        resourceUri
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
      resourceUri: 'string',
      webId: { type: 'string', optional: true }
    },
    async handler(ctx) {
      const { resourceUri, webId } = ctx.params;

      const triplesNb = await ctx.call('triplestore.countTriplesOfSubject', {
        uri: resourceUri
      });

      if (triplesNb > 0) {
        await ctx.call('ldp.container.detach', {
          containerUri: getContainerFromUri(resourceUri),
          resourceUri
        });

        await ctx.call('triplestore.update', {
          query: `
            DELETE
            WHERE
            { <${resourceUri}> ?p ?v }
          `,
          webId
        });
      } else {
        throw new MoleculerError(`Not found ${resourceUri}`, 404, 'NOT_FOUND');
      }
    }
  }
};
