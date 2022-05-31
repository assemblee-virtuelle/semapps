const { MIME_TYPES } = require('@semapps/mime-types');
const { getContainerFromUri } = require('../../../utils');
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
      webId: { type: 'string', optional: true },
      disassembly: {
        type: 'array',
        optional: true
      }
    },
    async handler(ctx) {
      const { resourceUri } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const { disassembly } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: resourceUri })),
        ...ctx.params
      };

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      let oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        queryDepth: 1,
        forceSemantic: true,
        webId
      });

      if (disassembly) {
        await this.deleteDisassembly(ctx, disassembly, oldData);
      }

      // TODO see why blank node deletion does not work (permission error)
      // const blandNodeQuery = buildBlankNodesQuery(3);
      //
      // // The resource must be deleted after the blank node, otherwise the permissions will fail
      // const query =  `
      //   DELETE {
      //     ${blandNodeQuery.construct}
      //     <${resourceUri}> ?p1 ?dataProp1 .
      //   }
      //   WHERE {
      //     {
      //       ${blandNodeQuery.where}
      //       <${resourceUri}> ?p1 ?o1 .
      //     }
      //     UNION
      //     {
      //       <${resourceUri}> ?p1 ?dataProp1 .
      //     }
      //   }
      // `;

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE {
            <${resourceUri}> ?p1 ?o1 .
          }
        `,
        webId
      });

      // We must detach the resource from the container after deletion, otherwise the permissions will fail
      await ctx.call(
        'ldp.container.detach',
        {
          containerUri: getContainerFromUri(resourceUri),
          resourceUri
        },
        { meta: { webId } }
      );

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
