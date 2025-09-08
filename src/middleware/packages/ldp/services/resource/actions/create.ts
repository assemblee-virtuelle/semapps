import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';

<<<<<<< HEAD
const { MoleculerError } = require('moleculer').Errors;
=======
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;
>>>>>>> 2.0

const Schema = {
  visibility: 'public',
  params: {
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    resource: { type: 'object' },
    resourceUri: { type: 'string' },
=======
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    resource: 'object',
>>>>>>> 2.0
    webId: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
<<<<<<< HEAD
    let { resource, resourceUri, contentType } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
=======
    let { resource, contentType } = ctx.params;
    // @ts-expect-error
>>>>>>> 2.0
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (contentType && contentType !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.create action now only support JSON-LD. Provided: ${contentType}`);

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError('Remote resources cannot be created', 403, 'FORBIDDEN');

    const { controlledActions } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
    if (resourceExist) {
      throw new MoleculerError(`A resource already exist with URI ${resourceUri}`, 400, 'BAD_REQUEST');
    }

    // Adds the default context, if it is missing
    if (!resource['@context']) {
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
    }

<<<<<<< HEAD
    await ctx.call('triplestore.insert', {
      resource,
      contentType,
      webId,
      graphName: resourceUri
=======
    let newTriples = await ctx.call('jsonld.parser.toQuads', { input: resource });
    // see PUT
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);
    // see PUT
    newTriples = this.convertBlankNodesToVars(newTriples);
    // see PUT
    newTriples = this.removeDuplicatedVariables(newTriples);

    const triplesToAdd = newTriples.reverse();

    const newBlankNodes = newTriples.filter((triple: any) => triple.object.termType === 'Variable');

    // Generate the query
    let query = '';
    if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
    query += 'WHERE { ';
    if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
    query += ` }`;

    await ctx.call('triplestore.update', {
      query,
      webId
>>>>>>> 2.0
    });

    // TODO See if using controlledAction is still necessary now blank nodes are automatically detected
    const newData = await ctx.call(
      (controlledActions && controlledActions.get) || 'ldp.resource.get',
      {
        resourceUri,
        webId: 'system' // Avoid errors if the resource creator has no read rights
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
} satisfies ActionSchema;

export default Schema;
