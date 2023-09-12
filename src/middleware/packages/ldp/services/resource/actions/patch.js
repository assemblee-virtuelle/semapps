const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const SparqlParser = require('sparqljs').Parser;

const parser = new SparqlParser();
const ACCEPTED_OPERATIONS = ['insert', 'delete'];

function checkTriplesSubjectIsResource(triples, resourceUri) {
  for (const triple of triples) {
    switch (triple.subject.termType) {
      case 'NamedNode':
        // Ensure the subject is the same as the patched resource
        if (triple.subject.value !== resourceUri) {
          throw new MoleculerError('The SPARQL request must modify only the patched resource', 400, 'BAD_REQUEST');
        }
        break;
      case 'BlankNode':
        // Accept blank nodes, as they are necessarily linked to the patched resource
        break;
    }
  }
}

module.exports = {
  api: async function api(ctx) {
    let { containerUri, id, body } = ctx.params;
    const resourceUri = urlJoin(containerUri, id);
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri });
    try {
      if (ctx.meta.parser === 'sparql') {
        await ctx.call(controlledActions.patch || 'ldp.resource.patch', {
          resourceUri,
          sparqlUpdate: body
        });
      } else {
        throw new MoleculerError(`The content-type should be application/sparql-update`, 400, 'BAD_REQUEST');
      }
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
      resourceUri: {
        type: 'string'
      },
      sparqlUpdate: {
        type: 'string',
        optional: true
      },
      triplesToAdd: {
        type: 'array',
        optional: true
      },
      triplesToRemove: {
        type: 'array',
        optional: true
      },
      webId: {
        type: 'string',
        optional: true
      }
    },
    async handler(ctx) {
      let { resourceUri, sparqlUpdate, triplesToAdd, triplesToRemove, webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      if (this.isRemoteUri(resourceUri, ctx.meta.dataset))
        throw new MoleculerError('Remote resources cannot be patched', 403, 'FORBIDDEN');

      // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
      // if (!resourceExist) throw new MoleculerError('Resource not found', 404, 'FORBIDDEN');

      if (sparqlUpdate) {
        let parsedQuery;

        try {
          parsedQuery = parser.parse(sparqlUpdate);
        } catch (e) {
          throw new MoleculerError(`Invalid SPARQL Update: ${sparqlUpdate}`, 400, 'BAD_REQUEST');
        }

        if (parsedQuery.type !== 'update')
          throw new MoleculerError('Invalid SPARQL. Must be an Update', 400, 'BAD_REQUEST');

        const triplesByOperation = Object.fromEntries(
          parsedQuery.updates
            .filter(p => ACCEPTED_OPERATIONS.includes(p.updateType))
            .map(p => [p.updateType, p[p.updateType][0].triples])
        );

        if (Object.values(triplesByOperation).length === 0)
          throw new MoleculerError(
            'Invalid SPARQL operation. Must be INSERT DATA and/or DELETE DATA',
            400,
            'BAD_REQUEST'
          );

        triplesToAdd = triplesByOperation.insert;
        triplesToRemove = triplesByOperation.delete;
      }

      if (!triplesToAdd && !triplesToRemove)
        throw new MoleculerError('No triples to add or to remove', 400, 'BAD_REQUEST');

      // Rebuild the sparql update to reduce security risks
      sparqlUpdate = {
        type: 'update',
        updates: []
      };

      if (triplesToAdd) {
        checkTriplesSubjectIsResource(triplesToAdd, resourceUri);
        sparqlUpdate.updates.push({
          updateType: 'insert',
          insert: [{ type: 'bgp', triples: triplesToAdd }]
        });
      }

      if (triplesToRemove) {
        checkTriplesSubjectIsResource(triplesToRemove, resourceUri);
        sparqlUpdate.updates.push({
          updateType: 'delete',
          delete: [{ type: 'bgp', triples: triplesToRemove }]
        });
      }

      await ctx.call('triplestore.update', {
        query: sparqlUpdate,
        webId
      });

      const returnValues = {
        resourceUri,
        triplesAdded: triplesToAdd,
        triplesRemoved: triplesToRemove,
        webId
      };

      ctx.emit('ldp.resource.patched', returnValues, { meta: { webId: null } });

      return returnValues;
    }
  }
};
