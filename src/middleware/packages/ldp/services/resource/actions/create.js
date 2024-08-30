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
    }
  },
  async handler(ctx) {
    let { resource, contentType, body } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const resourceUri = resource.id || resource['@id'];

    if (this.isRemoteUri(resourceUri, ctx.meta.dataset))
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
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
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

    this.logger.debug('Fuseki Update Query:', query);

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
      webId
    };

    ctx.emit('ldp.resource.created', returnValues, { meta: { webId: null } });

    return returnValues;
  }
};
