const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

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
    let { resource, contentType, body } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const resourceUri = resource.id || resource['@id'];

    if (this.isRemoteUri(resourceUri, ctx.meta.dataset))
      throw new MoleculerError('Remote resources cannot be created', 403, 'FORBIDDEN');

    const { disassembly, jsonContext, controlledActions } = {
      ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
      ...ctx.params
    };

    const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (resourceExist) {
      throw new MoleculerError(`A resource already exist with URI ${resourceUri}`, 400, 'BAD_REQUEST');
    }

    // Adds the default context, if it is missing
    if (jsonContext && contentType === MIME_TYPES.JSON && !resource['@context']) {
      resource = {
        '@context': jsonContext,
        ...resource
      };
    }

    if (disassembly && contentType === MIME_TYPES.JSON) {
      await this.createDisassembly(ctx, disassembly, resource);
    }

    if (contentType !== MIME_TYPES.JSON && !resource.body)
      throw new MoleculerError('The resource must contain a body member (a string)', 400, 'BAD_REQUEST');

    let newTriples = await this.bodyToTriples(body || resource, contentType);
    // see PUT
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);
    // see PUT
    newTriples = this.convertBlankNodesToVars(newTriples);
    // see PUT
    newTriples = this.removeDuplicatedVariables(newTriples);

    const triplesToAdd = newTriples.reverse();

    const newBlankNodes = newTriples.filter(triple => triple.object.termType === 'Variable');

    // Generate the query
    let query = '';
    if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
    query += 'WHERE { ';
    if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
    query += ` }`;

    this.logger.info('POST query', query);

    await ctx.call('triplestore.update', {
      query,
      webId
    });

    const newData = await ctx.call(
      controlledActions?.get || 'ldp.resource.get',
      {
        resourceUri,
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId
      },
      { meta: { $cache: false } }
    );

    const returnValues = {
      resourceUri,
      newData,
      webId
    };

    ctx.emit('ldp.resource.created', returnValues, { meta: { webId: null } });

    return returnValues;
  }
};
