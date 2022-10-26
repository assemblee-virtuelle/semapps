const { MIME_TYPES } = require('@semapps/mime-types');
const { getContainerFromUri, isMirror } = require('../../../utils');
const fs = require('fs');

module.exports = {
  api: async function api(ctx) {
    const { typeURL, id, containerUri } = ctx.params;
    const resourceUri = `${containerUri || this.settings.baseUrl + typeURL}/${id}`;
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });

    try {
      await ctx.call(controlledActions.delete || 'ldp.resource.delete', {
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

       const mirror = isMirror(resourceUri, this.settings.baseUrl);

       const { disassembly } = {
         ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
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
      // TODO when fixed, remove the call to triplestore.deleteOrphanBlankNodes below
      // const blandNodeQuery = buildBlankNodesQuery(3);
      //


      let oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
      oldTriples = this.filterOtherNamedNodes(oldTriples, resourceUri);
      oldTriples = this.convertBlankNodesToVars(oldTriples);
      const triplesToRemove = this.getTriplesDifference(oldTriples, []);
      const existingBlankNodes = oldTriples.filter(
        triple => triple.object.termType === 'Variable' || triple.subject.termType === 'Variable'
      );
      // Generate the query
      let query = '';
      query += `DELETE {`;
      query += triplesToRemove.length > 0 ? this.triplesToString(triplesToRemove) : '';
      query += `}`;
      query += `WHERE { `;
      query += mirror ? 'GRAPH <' + this.settings.mirrorGraphName + '> {' : '';
      query += existingBlankNodes.length > 0 ? this.triplesToString(existingBlankNodes) : '';
      query += mirror ? '}' : '';
      query += ` }`;

      this.logger.info('DELETE query', query);

      await ctx.call('triplestore.update', {
        query,
        webId
      });


      // We must detach the resource from the container after deletion, otherwise the permissions will fail
      await ctx.call('ldp.container.detach', {
        containerUri: getContainerFromUri(resourceUri),
        resourceUri,
        webId
      });

      if (oldData['@type'] === 'semapps:File') {
        fs.unlinkSync(oldData['semapps:localPath']);
      }

      const returnValues = {
        resourceUri,
        oldData,
        webId
      };

      ctx.call('triplestore.deleteOrphanBlankNodes', { graphName: mirror ? this.settings.mirrorGraphName : undefined });

      if (!mirror) {
        ctx.emit('ldp.resource.deleted', returnValues, { meta: { webId: null, dataset: null, isMirror: mirror } });
      }

      return returnValues;
    }
  }
};
