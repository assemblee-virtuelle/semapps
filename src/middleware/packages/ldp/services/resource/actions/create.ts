import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
    resource: 'object',
    webId: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string'
    }
  },
  async handler(ctx) {
    let { resource, contentType, body } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
    const resourceUri = resource.id || resource['@id'];

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError('Remote resources cannot be created', 403, 'FORBIDDEN');

    const { controlledActions } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (resourceExist) {
      throw new MoleculerError(`A resource already exist with URI ${resourceUri}`, 400, 'BAD_REQUEST');
    }

    // Adds the default context, if it is missing
    if (contentType === MIME_TYPES.JSON && !resource['@context']) {
      // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        // @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
        ...resource
      };
    }

    // @ts-expect-error TS(2339): Property 'body' does not exist on type 'never'.
    if (contentType !== MIME_TYPES.JSON && !resource.body)
      throw new MoleculerError('The resource must contain a body member (a string)', 400, 'BAD_REQUEST');

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    let newTriples = await this.bodyToTriples(body || resource, contentType);
    // see PUT
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);
    // see PUT
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.convertBlankNodesToVars(newTriples);
    // see PUT
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.removeDuplicatedVariables(newTriples);

    const triplesToAdd = newTriples.reverse();

    const newBlankNodes = newTriples.filter((triple: any) => triple.object.termType === 'Variable');

    // Generate the query
    let query = '';
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
    query += 'WHERE { ';
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
    query += ` }`;

    await ctx.call('triplestore.update', {
      query,
      webId
    });

    // TODO See if using controlledAction is still necessary now blank nodes are automatically detected
    const newData = await ctx.call(
      (controlledActions && controlledActions.get) || 'ldp.resource.get',
      {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      },
      { meta: { $cache: false } }
    );

    const returnValues = {
      resourceUri,
      newData,
      webId,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset
    };

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.created', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
});

export default Schema;
