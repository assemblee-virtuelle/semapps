const jsonld = require('jsonld');
const { MIME_TYPES } = require('@semapps/mime-types');
const { buildBlankNodesQuery } = require('@semapps/ldp');

const CollectionService = {
  name: 'activitypub.collection',
  settings: {
    context: 'https://www.w3.org/ns/activitystreams'
  },
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
        accept: MIME_TYPES.JSON,
        contentType: MIME_TYPES.JSON
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
        accept: MIME_TYPES.JSON
      });
    },
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to add to the collection
     */
    async attach(ctx) {
      const { collectionUri, item } = ctx.params;
      const itemUri = typeof item === 'object' ? item.id || item['@id'] : item;

      const resourceExist = ctx.call('ldp.resource.exist', { resourceUri: itemUri });
      if (!resourceExist) throw new Error('Cannot attach a non-existing resource !');

      const collectionExist = ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist) throw new Error('Cannot attach to a non-existing collection !');

      return await ctx.call('triplestore.insert', {
        resource: `<${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}>`
      });
    },
    /*
     * Detach an object from a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to remove from the collection
     */
    async detach(ctx) {
      const { collectionUri, item } = ctx.params;

      const collectionExist = ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist) throw new Error('Cannot detach from a non-existing collection !');

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${item}> }
        `
      });
    },
    /*
     * Returns a JSON-LD formatted collection stored in the triple store
     * @param id The full URI of the collection
     * @param dereferenceItems Should we dereference the items in the collection ?
     * @param queryDepth Number of blank nodes we want to dereference
     */
    async get(ctx) {
      const { id, dereferenceItems = false, queryDepth } = ctx.params;
      let constructQuery = '',
        whereQuery = '';

      if (dereferenceItems) {
        const [constructBnQuery, whereBnQuery] = buildBlankNodesQuery(queryDepth);
        constructQuery = '?s1 ?p1 ?o1 .' + constructBnQuery;
        whereQuery = '?s1 ?p1 ?o1 .' + whereBnQuery;
      }

      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${id}> a ?collectionType ;
              as:items ?s1 .
            ${constructQuery}
          }
          WHERE {
            <${id}> a as:Collection, ?collectionType .
            OPTIONAL { 
              <${id}> as:items ?s1 .
              ${whereQuery}
            }
          }
        `,
        accept: MIME_TYPES.JSON
      });

      result = await jsonld.frame(result, {
        '@context': this.settings.context,
        '@id': id
      });

      if (result['@graph'].length === 0) {
        ctx.meta.$statusCode = 404;
      } else {
        let { items, ...collection } = result['@graph'][0];
        items = !items ? [] : Array.isArray(items) ? items : [items];

        const itemsProp = this.isOrderedCollection(collection) ? 'orderedItems' : 'items';

        collection = {
          '@context': result['@context'],
          ...collection,
          [itemsProp]: items,
          totalItems: items.length
        };

        return collection;
      }
    },
    /*
     * Empty the collection, deleting all items it contains.
     * @param collectionUri The full URI of the collection
     */
    async clear(ctx) {
      const collectionUri = ctx.params.collectionUri.replace(/\/+$/, '');
      return await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#> 
          DELETE {
            ?s1 ?p1 ?o1 .
          }
          WHERE { 
            FILTER(?container IN (<${collectionUri}>, <${collectionUri + '/'}>)) .
            ?container as:items ?s1 .
            ?s1 ?p1 ?o1 .
          } 
        `
      });
    },
    /*
     * Delete the container and remove all links to the items.
     * The items are not deleted, for this call the clear action.
     * @param collectionUri The full URI of the collection
     */
    async remove(ctx) {
      const collectionUri = ctx.params.collectionUri.replace(/\/+$/, '');
      return await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#> 
          DELETE {
            ?s1 ?p1 ?o1 .
          }
          WHERE { 
            FILTER(?s1 IN (<${collectionUri}>, <${collectionUri + '/'}>)) .
            ?s1 ?p1 ?o1 .
          }
        `
      });
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
