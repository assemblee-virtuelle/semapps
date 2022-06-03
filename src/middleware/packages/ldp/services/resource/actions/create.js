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
    let { resource, contentType } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const resourceUri = resource.id || resource['@id'];

    const { disassembly, jsonContext, controlledActions } = {
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

    let newTriples = await this.bodyToTriples(resource, contentType);
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);
    newTriples.sort((a,b)=>{
      if(b.subject.termType==='BlankNode'){
        return -1
      }else{
        return 1
      }
    })
    newTriples = this.convertBlankNodesToVars(newTriples);
    const newBlankNodes = newTriples.filter(
      triple => triple.object.termType === 'Variable'
    );
    newTriples = this.addDiscriminentToBlankNodes(newTriples)


    // Generate the query
    let query = '';
    query += `INSERT { ${this.triplesToString(newTriples)} } `;
    if (newBlankNodes.length > 0) query += `WHERE { ${this.bindNewBlankNodes(newBlankNodes)} }`;

    await ctx.call('triplestore.update', { query, webId });

    const newData = await ctx.call(
      controlledActions.get || 'ldp.resource.get',
      {
        resourceUri,
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId
      },
      { meta: { $cache: false } }
    );

    const returnValues = {
      resourceUri: resource['@id'],
      newData,
      webId
    };

    ctx.emit('ldp.resource.created', returnValues, { meta: { webId: null, dataset: null } });

    return returnValues;
  }
};
