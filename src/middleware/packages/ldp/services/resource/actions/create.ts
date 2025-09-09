import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
    resource: { type: 'object' },
    resourceUri: { type: 'string' },
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
    let { resource, resourceUri, contentType } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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

    await ctx.call('triplestore.insert', {
      resource,
      contentType,
      webId,
      graphName: resourceUri
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
