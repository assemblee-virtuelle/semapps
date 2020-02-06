const JsonLdStorageService = require('../mixins/jsonld-storage');
const MongoDBAdapter = require('moleculer-db-adapter-mongo');

const CollectionService = {
  name: 'activitypub.collection',
  mixins: [JsonLdStorageService],
  adapter: new MongoDBAdapter(
    'mongodb+srv://semapps:semapps@cluster0-4oc9v.mongodb.net/test?retryWrites=true&w=majority'
  ),
  collection: 'collections',
  settings: {
    context: 'https://www.w3.org/ns/activitystreams'
  },
  actions: {
    /*
     * Create a persisted collection
     * @param collectionUri The full URI of the collection
     * @param summary An optional description of the collection
     */
    async create(ctx) {
      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@id': ctx.params.collectionUri,
        type: ctx.params.ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
        summary: ctx.params.summary
      };

      if (ctx.params.ordered) {
        collection.orderedItems = [];
      } else {
        collection.items = [];
      }

      return await this._create(ctx, collection);
    },
    /*
     * Checks if the collection exists
     * @param collectionUri The full URI of the collection
     * @return true if the collection exists
     */
    async exist(ctx) {
      const result = await this.getById(ctx.params.collectionUri);
      return !!result;
    },
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param objectUri The full URI of the object to add to the collection
     */
    async attach(ctx) {
      const collection = await this.getById(ctx.params.collectionUri);

      if (this.isOrderedCollection(collection)) {
        collection.orderedItems = [ctx.params.resource, ...collection.orderedItems];
      } else {
        collection.items = [ctx.params.resource, ...collection.items];
      }

      return await this._update(ctx, collection);
    }
  },
  methods: {
    isOrderedCollection(collection) {
      return (
        collection.type === 'OrderedCollection' ||
        (Array.isArray(collection.type) && collection.type.includes('OrderedCollection'))
      );
    }
  }
};

module.exports = CollectionService;
