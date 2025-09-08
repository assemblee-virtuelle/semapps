import { ActionSchema } from 'moleculer';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

function checkTriplesSubjectIsResource(triples: any, resourceUri: any) {
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
    // @ts-expect-error TS(2322): Type '{ type: "array"; optional: true; }' is not a... Remove this comment to see the full error message
    triplesToAdd: {
      type: 'array',
      optional: true
    },
    // @ts-expect-error TS(2322): Type '{ type: "array"; optional: true; }' is not a... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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
      // @ts-expect-error TS(2345): Argument of type '{ updateType: string; delete: { ... Remove this comment to see the full error message
      sparqlUpdate.updates.push({
        updateType: 'delete',
        delete: [{ type: 'bgp', triples: triplesToRemove }]
      });
    }

    if (triplesToAdd) {
      checkTriplesSubjectIsResource(triplesToAdd, resourceUri);
      // @ts-expect-error TS(2345): Argument of type '{ updateType: string; insert: { ... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset
    };

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.patched', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
