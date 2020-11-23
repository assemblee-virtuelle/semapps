const { MIME_TYPES } = require('@semapps/mime-types');

const CollectionService = {
  name: 'activitypub.collection',
  settings: {
    context: 'https://www.w3.org/ns/activitystreams'
  },
  dependencies: ['triplestore', 'ldp'],
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

      // TODO also check external resources
      // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: itemUri });
      // if (!resourceExist) throw new Error('Cannot attach a non-existing resource !')

      const collectionExist = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist) throw new Error('Cannot attach to a non-existing collection: ' + collectionUri);

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

      const collectionExist = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist) throw new Error('Cannot detach from a non-existing collection: ' + collectionUri);

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
      const { id, dereferenceItems = false, queryDepth, page, numPerPage } = ctx.params;

      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${id}> a as:Collection, ?collectionType .
            <${id}> as:items ?itemUri .
          }
          WHERE {
            <${id}> a as:Collection, ?collectionType .
            OPTIONAL { <${id}> as:items ?itemUri . }
          }
        `,
        accept: MIME_TYPES.JSON
      });

      if (!result.items || result.items.length === 0) {
        return null;
      } else {
        const numPages = Math.ceil(result.items.length / numPerPage);

        if (!page) {
          return {
            '@context': 'https://www.w3.org/ns/activitystreams', // TODO improve context handling
            '@id': id,
            '@type': this.isOrderedCollection(result) ? 'OrderedCollection' : 'Collection',
            first: id + '?page=1',
            last: id + '?page=' + numPages,
            totalItems: result.items.length
          };
        } else {
          const start = (page - 1) * numPerPage;
          const selectedItemsUris = result.items.slice(start, start + numPerPage);

          let selectedItems = [];
          const itemsProp = this.isOrderedCollection(result) ? 'orderedItems' : 'items';

          if (dereferenceItems) {
            for (let itemUri of selectedItemsUris) {
              selectedItems.push(
                await ctx.call('ldp.resource.get', {
                  resourceUri: itemUri,
                  accept: MIME_TYPES.JSON,
                  queryDepth
                })
              );
            }
          } else {
            selectedItems = selectedItemsUris;
          }

          return {
            '@context': selectedItems[0]['@context'],
            id: id + '?page=' + page,
            type: this.isOrderedCollection(result) ? 'OrderedCollectionPage' : 'CollectionPage',
            partOf: id,
            prev: page > 1 ? id + '?page=' + (parseInt(page) - 1) : undefined,
            next: page < numPages ? id + '?page=' + (parseInt(page) + 1) : undefined,
            [itemsProp]: selectedItems.map(({ '@context': context, ...item }) => item),
            totalItems: result.items.length
          };
        }
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
        collection['@type'] === 'as:OrderedCollection' ||
        (Array.isArray(collection['@type']) && collection['@type'].includes('as:OrderedCollection'))
      );
    }
  }
};

module.exports = CollectionService;
