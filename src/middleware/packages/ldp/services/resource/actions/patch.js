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

      const oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
      const newTriples = await this.bodyToTriples(resource, contentType);

      const blankNodesVars = this.mapBlankNodesOnVars([...oldTriples, ...newTriples]);

      const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples);

      // We want to remove in old triples only the triples for which we have provided a new literal value
      const literalNewTriples = newTriples.filter(t => t.object.termType === 'Literal');
      const triplesToRemove = oldTriples.filter(ot => literalNewTriples.some(nt => {
        // If the subject is a blank node, we use the variable name in order to identify equals
        const oldSubjectValue = ot.subject.termType === 'BlankNode' ? blankNodesVars[nt.subject.value] : nt.subject.value;
        const newSubjectValue = nt.subject.termType === 'BlankNode' ? blankNodesVars[nt.subject.value] : nt.subject.value;

        return newSubjectValue === oldSubjectValue && nt.predicate.value === ot.predicate.value;
      }));

      // The exact same data have been posted, skip
      if( triplesToAdd.length === 0 && triplesToRemove.length === 0 ) {
        return resourceUri;
      }

      // Triples with blank nodes to use in WHERE clause, otherwise
      const triplesWithBlankNodes = newTriples.filter(triple => triple.object.termType === 'BlankNode');

      // Generate the query
      let query = '';
      if( triplesToRemove.length > 0 ) query += `DELETE { ${this.triplesToString(triplesToRemove, blankNodesVars)} } `;
      if( triplesToAdd.length > 0 ) query += `INSERT { ${this.triplesToString(triplesToAdd, blankNodesVars)} } `;
      if( triplesWithBlankNodes.length > 0 ) {
        query += `WHERE { ${this.triplesToString(triplesWithBlankNodes, blankNodesVars)} }`;
      } else {
        query += `WHERE {}`;
      }

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
