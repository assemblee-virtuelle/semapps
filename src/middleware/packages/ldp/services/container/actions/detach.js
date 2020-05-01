module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;

    const containerExists = await this.actions.exist({ containerUri });
    if (!containerExists) throw new Error('Cannot detach from a non-existing container !');

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE
        { <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> }
      `
    });
  }
};
