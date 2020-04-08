const { JsonLdStorageMixin, TripleStoreAdapter } = require('@semapps/ldp');

const ObjectService = {
  name: 'activitypub.object',
  mixins: [JsonLdStorageMixin],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null, // To be set by the user
    context: 'https://www.w3.org/ns/activitystreams'
  },
  actions: {
    async remove(ctx) {
      // TODO use PUT method when it will be available instead of DELETE+POST
      await this._remove(ctx, { id: ctx.params.id });

      const tombstone = {
        '@context': this.settings.context,
        '@id': ctx.params.id,
        type: 'Tombstone',
        deleted: new Date().toISOString()
      };

      return await this._create(ctx, tombstone);
    }
  }
};

module.exports = ObjectService;
