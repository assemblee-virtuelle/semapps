const { MoleculerError } = require('moleculer').Errors;

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

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: {
      type: 'string'
    },
    triplesToAdd: {
      type: 'array',
      optional: true
    },
    triplesToRemove: {
      type: 'array',
      optional: true
    },
    skipInferenceCheck: {
      type: 'boolean',
      optional: true
    },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { resourceUri, triplesToAdd, triplesToRemove, skipInferenceCheck, webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError('Remote resources cannot be patched', 403, 'FORBIDDEN');

    // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
    // if (!resourceExist) throw new MoleculerError('Resource not found', 404, 'FORBIDDEN');

    if (!triplesToAdd && !triplesToRemove)
      throw new MoleculerError('No triples to add or to remove', 400, 'BAD_REQUEST');

    if (triplesToRemove) {
      await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Write', webId });
    } else {
      // If we only add new triples, we don't need the acl:Write permission
      await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Append', webId });
    }

    // Build the SPARQL update
    const sparqlUpdate = {
      type: 'update',
      updates: []
    };

    if (triplesToRemove) {
      checkTriplesSubjectIsResource(triplesToRemove, resourceUri);
      sparqlUpdate.updates.push({
        updateType: 'delete',
        delete: [{ type: 'bgp', triples: triplesToRemove }]
      });
    }

    if (triplesToAdd) {
      checkTriplesSubjectIsResource(triplesToAdd, resourceUri);
      sparqlUpdate.updates.push({
        updateType: 'insert',
        insert: [{ type: 'bgp', triples: triplesToAdd }]
      });
    }

    await ctx.call('triplestore.update', {
      query: sparqlUpdate,
      webId: 'system'
    });

    const returnValues = {
      resourceUri,
      triplesAdded: triplesToAdd,
      triplesRemoved: triplesToRemove,
      skipInferenceCheck,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.patched', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
};

export default Schema;
