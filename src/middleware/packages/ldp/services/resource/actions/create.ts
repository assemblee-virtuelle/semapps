import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema, Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    resource: { type: 'object' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string',
      optional: true
    },
    registration: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { resource, resourceUri, contentType, registration } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (contentType && contentType !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.create action now only support JSON-LD. Provided: ${contentType}`);

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError('Remote resources cannot be created', 403, 'FORBIDDEN');

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

    const { controlledActions } = registration || (await ctx.call('ldp.registry.getByUri', { resourceUri }));
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
      dataset: ctx.meta.dataset,
      registration
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.created', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
