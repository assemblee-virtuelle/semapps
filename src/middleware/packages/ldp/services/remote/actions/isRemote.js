module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, webId } = ctx.params;

    return this.isRemoteUri(resourceUri, webId);
  }
};
