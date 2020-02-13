const jsonld = require('jsonld');

const TripleStoreCollectionService = {
  name: 'activitypub.collection',
  dependencies: ['triplestore'],
  actions: {
    /*
     * Create a persisted collection
     * @param collectionUri The full URI of the collection
     * @param summary An optional description of the collection
     */
    async create(ctx) {
      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
        type: ctx.params.ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
        summary: ctx.params.summary
      };

      return await ctx.call('triplestore.insert', {
        resource: collection,
        accept: 'json'
      });
    },
    /*
     * Checks if the collection exists
     * @param collectionUri The full URI of the collection
     * @return true if the collection exists
     */
    async exist(ctx) {
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          ASK
          WHERE {
            <${ctx.params.collectionUri}> a as:Collection .
          }
        `,
        accept: 'json'
      });
    },
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to add to the collection
     */
    async attach(ctx) {
      const collectionExist = ctx.call('activitypub.collection.exist', {
        collectionUri: ctx.params.collectionUri
      });
      if (!collectionExist) throw new Error('Cannot attach to a non-existing collection !');

      const collection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: ctx.params.collectionUri,
        items: typeof ctx.params.item === 'object' ? ctx.params.item['@id'] : ctx.params.item
      };

      return await ctx.call('triplestore.insert', {
        resource: collection,
        accept: 'json'
      });
    },
    /*
     * Returns a JSON-LD formatted collection stored in the triple store
     * @param id The full URI of the collection
     */
    async get(ctx) {
      let collection = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${ctx.params.id}> 
              a ?type ;
              as:items ?item .
          }
          WHERE {
            <${ctx.params.id}> a ?type .
            OPTIONAL { 
              <${ctx.params.id}> as:items ?item .
            }
          }
        `,
        accept: 'json'
      });

      collection = await jsonld.compact(collection, {
        '@context': 'https://www.w3.org/ns/activitystreams'
      });

      if (!collection.items) collection.items = [];
      // If there is only one item, we receive it as an object so put it in an array
      else if (!Array.isArray(collection.items)) collection.items = [collection.items];

      collection.totalItems = collection.items.length;

      if (this.isOrderedCollection(collection)) {
        collection.orderedItems = collection.items;
        delete collection.items;
      }

      return collection;
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

module.exports = TripleStoreCollectionService;
