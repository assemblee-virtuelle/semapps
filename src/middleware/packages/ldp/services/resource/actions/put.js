const jsonld = require('jsonld');
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
      contentType: { type: 'string' }
    },
    async handler(ctx) {
      const { resource, contentType } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';
      const resourceUri = resource.id || resource['@id'];

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      });

      const oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
      const newTriples = await this.bodyToTriples(resource, contentType);

      const blankNodesVars = this.mapBlankNodesOnVars([...oldTriples, ...newTriples]);

      const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples);
      const triplesToRemove = this.getTriplesDifference(oldTriples, newTriples);

      // The exact same data have been posted, skip
      if (triplesToAdd.length === 0 && triplesToRemove.length === 0) {
        return resourceUri;
      }

      // Keep track of blank nodes to use in WHERE clause
      const triplesWithBlankNodes = newTriples.filter(triple => triple.object.termType === 'BlankNode');

      // Generate the query
      let query = '';
      if (triplesToRemove.length > 0) query += `DELETE { ${this.triplesToString(triplesToRemove, blankNodesVars)} } `;
      if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd, blankNodesVars)} } `;
      if (triplesWithBlankNodes.length > 0) {
        query += `WHERE { ${this.triplesToString(triplesWithBlankNodes, blankNodesVars)} }`;
      } else {
        query += `WHERE {}`;
      }

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
