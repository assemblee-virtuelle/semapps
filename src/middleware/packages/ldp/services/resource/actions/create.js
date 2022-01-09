const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { isMirror } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resource: 'object',
    webId: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string'
    },
    disassembly: {
      type: 'array',
      optional: true
    }
  },
  async handler(ctx) {
    let { resource, contentType } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const resourceUri = resource.id || resource['@id'];

    if (isMirror(resourceUri,this.settings.baseUrl))
      throw new MoleculerError('Mirrored resources cannot be created with LDP', 403, 'FORBIDDEN');

    const { disassembly, jsonContext } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (resourceExist) {
      throw new MoleculerError(`A resource already exist with URI ${resourceUri}`, 400, 'BAD_REQUEST');
    }

    // Adds the default context, if it is missing
    if (contentType === MIME_TYPES.JSON && !resource['@context']) {
      resource = {
        '@context': jsonContext,
        ...resource
      };
    }

    if (disassembly && contentType === MIME_TYPES.JSON) {
      await this.createDisassembly(ctx, disassembly, resource);
    }

    await ctx.call('triplestore.insert', {
      resource,
      contentType,
      webId
    });

    const newData = await ctx.call(
      'ldp.resource.get',
      {
        resourceUri,
        accept: MIME_TYPES.JSON,
        queryDepth: 1,
        forceSemantic: true,
        webId
      },
      { meta: { $cache: false } }
    );

    ctx.emit(
      'ldp.resource.created',
      {
        resourceUri: resource['@id'],
        newData,
        webId
      },
      { meta: { webId: null, dataset: null } }
    );

    return newData;
  }
};
