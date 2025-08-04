module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string' }
    },
    async handler(ctx) {
      const { resourceUri } = ctx.params;
      const { read } = await ctx.call('webacl.resource.hasRights', {
        resourceUri,
        rights: { read: true },
        webId: 'anon'
      });
      return read;
    }
  }
};
