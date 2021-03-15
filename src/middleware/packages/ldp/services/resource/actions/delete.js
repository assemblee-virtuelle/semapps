const { MIME_TYPES } = require('@semapps/mime-types');
const { getContainerFromUri } = require('../../../utils');
const { MoleculerError } = require('moleculer').Errors;
const fs = require('fs');

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
      const { resourceUri } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        queryDepth: 1,
        forceSemantic: true,
        webId
      });

      await ctx.call(
        'ldp.container.detach',
        {
          containerUri: getContainerFromUri(resourceUri),
          resourceUri
        },
        { meta: { webId } }
      );

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${resourceUri}> ?p ?v }
        `,
        webId
      });

      if (this.settings.enableWebAcl) {
        await ctx.call('webacl.resource.deleteAllRights', { resourceUri }, { meta: { webId: 'system' } });
      }

      if (oldData['@type'] === 'semapps:File') {
        fs.unlinkSync(oldData['semapps:localPath']);
      }

      ctx.emit('ldp.resource.deleted', {
        resourceUri,
        oldData,
        webId
      });
    }
  }
};
