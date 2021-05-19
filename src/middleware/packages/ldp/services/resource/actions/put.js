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
      disassembly: { type: 'array', optional: true }
    },
    async handler(ctx) {
      let { resource, contentType } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const resourceUri = resource.id || resource['@id'];

      const { disassembly } = {
        ...(await ctx.call('ldp.container.getOptions', { uri: resourceUri })),
        ...ctx.params
      };

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      let oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      });

      if (disassembly && contentType === MIME_TYPES.JSON) {
        await this.updateDisassembly(ctx, disassembly, resource, oldData);
      }

      let oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
      let newTriples = await this.bodyToTriples(resource, contentType);

      const blankNodesVarsMap = this.mapBlankNodesOnVars([...oldTriples, ...newTriples]);

      oldTriples = this.convertBlankNodesToVars(oldTriples, blankNodesVarsMap);
      newTriples = this.convertBlankNodesToVars(newTriples, blankNodesVarsMap);

      // Triples to add are reversed, so that blank nodes are linked to resource before being assigned data properties
      // Triples to remove are not reversed, because we want to remove the data properties before unlinking it from the resource
      // This is needed, otherwise we have permissions violations with the WebACL (orphan blank nodes cannot be edited, except as "system")
      const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples).reverse();
      const triplesToRemove = this.getTriplesDifference(oldTriples, newTriples);

      // The exact same data have been posted, skip
      if (triplesToAdd.length === 0 && triplesToRemove.length === 0) {
        return resourceUri;
      }

      // Keep track of blank nodes to use in WHERE clause
      const newBlankNodes = this.getTriplesDifference(newTriples, oldTriples).filter(
        triple => triple.object.termType === 'Variable'
      );
      const existingBlankNodes = oldTriples.filter(triple => triple.object.termType === 'Variable');

      // Generate the query
      let query = '';
      if (triplesToRemove.length > 0) query += `DELETE { ${this.triplesToString(triplesToRemove)} } `;
      if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
      query += `WHERE { `;
      if (existingBlankNodes.length > 0) query += this.triplesToString(existingBlankNodes);
      if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
      query += ` }`;

      console.log('query', query);

      await ctx.call('triplestore.update', { query, webId });

      // Get the new data, with the same formatting as the old data
      // We skip the cache because it has not been invalidated yet
      const newData = await ctx.call(
        'ldp.resource.get',
        {
          resourceUri,
          accept: MIME_TYPES.JSON,
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
