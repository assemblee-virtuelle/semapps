const DbService = require('moleculer-db');
const urlJoin = require('url-join');
const { TripleStoreAdapter } = require('@semapps/ldp');
const { OBJECT_TYPES } = require('../constants');

const ObjectService = {
  name: 'activitypub.object',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null, // To be set by the user
    queryDepth: 1,
    context: 'https://www.w3.org/ns/activitystreams'
  },
  actions: {
    async create(ctx) {
      // If there is already a tombstone in the desired URI,
      // remove it first to avoid automatic incrementation of the slug
      if (ctx.params.slug) {
        const desiredUri = urlJoin(this.settings.containerUri, ctx.params.slug);
        let object;
        try {
          object = await this.getById(desiredUri);
        } catch (e) {
          // Do nothing if object is not found
        }
        if (object && object.type === OBJECT_TYPES.TOMBSTONE) {
          await this._remove(ctx, { id: desiredUri });
        }
      }
      return await this._create(ctx, ctx.params);
    },
    async remove(ctx) {
      // TODO use PUT method when it will be available instead of DELETE+POST
      await this._remove(ctx, { id: ctx.params.id });

      const tombstone = {
        '@context': this.settings.context,
        type: OBJECT_TYPES.TOMBSTONE,
        slug: ctx.params.id.match(new RegExp(`.*/(.*)`))[1],
        deleted: new Date().toISOString()
      };
      return await this._create(ctx, tombstone);
    }
  }
};

module.exports = ObjectService;
