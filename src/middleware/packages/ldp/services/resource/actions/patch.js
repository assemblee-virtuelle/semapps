const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

// Important note: PATCH erase old data if they are literals (data properties), but not if they are URIs (relations),
// as we assume that relations can be multiple, while data properties (eg. labels) should not be duplicated
// TODO make sure that this conforms with the LDP specifications
module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, ...resource } = ctx.params;

    // PATCH have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
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
      let { resource, contentType, webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const resourceUri = resource.id || resource['@id'];
      if (!resourceUri) throw new MoleculerError('No resource ID provided', 400, 'BAD_REQUEST');

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      const oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      });

      // Adds a default context, if it is missing
      if (contentType === MIME_TYPES.JSON) {
        const { jsonContext } = await ctx.call('ldp.container.getOptions', { uri: resourceUri });
        resource = {
          '@context': jsonContext,
          ...resource
        };
      }

      let oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
      let newTriples = await this.bodyToTriples(resource, contentType);

      const blankNodesVarsMap = this.mapBlankNodesOnVars([...oldTriples, ...newTriples]);

      oldTriples = this.convertBlankNodesToVars(oldTriples, blankNodesVarsMap);
      newTriples = this.convertBlankNodesToVars(newTriples, blankNodesVarsMap);

      // Triples to add are reversed, so that blank nodes are linked to resource before being assigned data properties
      // This is needed, otherwise we have permissions violations with the WebACL (orphan blank nodes cannot be edited, except as "system")
      const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples).reverse();

      // We want to remove in old triples only the triples for which we have provided a new literal value
      const literalNewTriples = newTriples.filter(t => t.object.termType === 'Literal');
      const triplesToRemove = oldTriples.filter(ot =>
        literalNewTriples.some(nt => nt.subject.value === ot.subject.value && nt.predicate.value === ot.predicate.value)
      );

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

      await ctx.call('triplestore.update', { query, webId });

      // Get the new data, with the same formatting as the old data
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
