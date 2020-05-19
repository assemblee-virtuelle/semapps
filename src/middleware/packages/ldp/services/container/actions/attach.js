const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri });
    if (!resourceExists) throw new Error('Cannot detach non-existing resource !');

    const containerExists = await this.actions.exist({ containerUri });
    if (!containerExists) throw new Error('Cannot attach to a non-existing container !');

    return await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`
    });
  }
};
