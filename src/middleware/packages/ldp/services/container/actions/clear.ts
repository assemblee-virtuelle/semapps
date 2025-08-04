module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, webId } = ctx.params;

    const resourcesUris = await this.actions.getUris({ containerUri }, { parentCtx: ctx });

    this.logger.info(`Deleting ${resourcesUris.length} resources...`);

    for (let resourceUri of resourcesUris) {
      this.logger.info(`Deleting ${resourceUri}...`);
      await ctx.call('ldp.resource.delete', { resourceUri, webId });
    }
  }
};
