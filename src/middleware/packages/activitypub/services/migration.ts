module.exports = {
  name: 'activitypub.migration',
  actions: {
    async updateCollectionsOptions(ctx) {
      await ctx.call('activitypub.follow.updateCollectionsOptions');
      await ctx.call('activitypub.inbox.updateCollectionsOptions');
      await ctx.call('activitypub.outbox.updateCollectionsOptions');
      await ctx.call('activitypub.like.updateCollectionsOptions');
      await ctx.call('activitypub.reply.updateCollectionsOptions');
    },
    // This shouldn't be used in Pod provider config
    async addCollectionsToContainer(ctx) {
      const collectionsContainerUri = await ctx.call('activitypub.collection.getContainerUri');

      this.logger.info(`Attaching all collections to ${collectionsContainerUri}`);

      await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          INSERT {
            <${collectionsContainerUri}> ldp:contains ?collectionUri
          }
          WHERE {
            ?collectionUri a as:Collection
          }
        `,
        webId: 'system'
      });
    }
  }
};
