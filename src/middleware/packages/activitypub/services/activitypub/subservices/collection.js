const { MIME_TYPES } = require('@semapps/mime-types');

const CollectionService = {
  name: 'activitypub.collection',
  settings: {
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false
  },
  dependencies: ['triplestore', 'ldp.resource'],
  actions: {
    /*
     * Create a persisted collection
     * @param collectionUri The full URI of the collection
     * @param summary An optional description of the collection
     */
    async create(ctx) {
      const { collectionUri } = ctx.params;
      const { ordered, summary } = {
        ...(await ctx.call('activitypub.registry.getByUri', { collectionUri })),
        ...ctx.params
      };
      await ctx.call('triplestore.insert', {
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: collectionUri,
          type: ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
          summary
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    /*
     * Checks if the collection exists
     * @param collectionUri The full URI of the collection
     * @return true if the collection exists
     */
    async exist(ctx) {
      const { collectionUri } = ctx.params;
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          ASK
          WHERE {
            <${collectionUri}> a as:Collection .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    /*
     * Checks if the collection is empty
     * @param collectionUri The full URI of the collection
     * @return true if the collection is empty
     */

    async isEmpty(ctx) {
      const { collectionUri } = ctx.params;
      const res = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT ( Count(?follower) as ?count )
          WHERE {
            <${collectionUri}> as:items ?follower .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
      return Number(res[0].count.value) === 0;
    },
    /*
     * Checks if an item is in a collection
     * @param collectionUri The full URI of the collection
     * @param itemUri The full URI of the item
     * @return true if the collection exists
     */
    async includes(ctx) {
      const { collectionUri, itemUri } = ctx.params;
      if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.includes');
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          ASK
          WHERE {
            <${collectionUri}> a as:Collection .
            <${collectionUri}> as:items <${itemUri}> .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    /*
     * Attach an object to a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to add to the collection
     */
    async attach(ctx) {
      let { collectionUri, item, itemUri } = ctx.params;
      if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
      if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.attach');

      // TODO also check external resources
      // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: itemUri });
      // if (!resourceExist) throw new Error('Cannot attach a non-existing resource !')

      // TODO check why thrown error is lost and process is stopped
      const collectionExist = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist)
        throw new Error(`Cannot attach to a non-existing collection: ${collectionUri} (dataset: ${ctx.meta.dataset})`);

      await ctx.call('triplestore.insert', {
        resource: `<${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}>`,
        webId: 'system'
      });
    },
    /*
     * Detach an object from a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to remove from the collection
     */
    async detach(ctx) {
      let { collectionUri, item, itemUri } = ctx.params;
      if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
      if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.detach');

      const collectionExist = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!collectionExist) throw new Error(`Cannot detach from a non-existing collection: ${collectionUri}`);

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}> }
        `,
        webId: 'system'
      });
    },
    /*
     * Returns a JSON-LD formatted collection stored in the triple store
     * @param collectionUri The full URI of the collection
     * @param dereferenceItems Should we dereference the items in the collection ?
     * @param page Page number. If none are defined, display the collection.
     * @param itemsPerPage Number of items to show per page
     * @param sort Object with `predicate` and `order` properties to sort ordered collections
     */
    async get(ctx) {
      const { collectionUri, page } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      const { dereferenceItems, itemsPerPage, sort } = {
        ...(await ctx.call('activitypub.registry.getByUri', { collectionUri })),
        ...ctx.params
      };

      const collection = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${collectionUri}> a as:Collection, ?collectionType .
            <${collectionUri}> as:summary ?summary .
          }
          WHERE {
            <${collectionUri}> a as:Collection, ?collectionType .
            OPTIONAL { <${collectionUri}> as:summary ?summary . }
          }
        `,
        accept: MIME_TYPES.JSON,
        webId
      });

      // No persisted collection found
      if (!collection['@id']) {
        ctx.meta.$statusCode = 404;
        return null;
      }

      if (this.isOrderedCollection(collection) && !sort) {
        throw new Error('A sort parameter must be provided for ordered collections');
      }

      // Caution: we must do a select query, because construct queries cannot be sorted
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT DISTINCT ?itemUri
          WHERE {
            <${collectionUri}> a as:Collection .
            OPTIONAL { 
              <${collectionUri}> as:items ?itemUri . 
              ${sort ? `OPTIONAL { ?itemUri ${sort.predicate} ?order . }` : ''}
            }
          }
          ${sort ? `ORDER BY ${sort.order}( ?order )` : ''}
        `,
        accept: MIME_TYPES.JSON,
        webId
      });

      const allItems = result.filter(node => node.itemUri).map(node => node.itemUri.value);
      const numPages = !itemsPerPage ? 1 : allItems.length > 0 ? Math.ceil(allItems.length / itemsPerPage) : 0;
      let returnData = null;

      if (page > 1 && page > numPages) {
        // The collection page does not exist
        ctx.meta.$statusCode = 404;
        return;
      }
      if ((itemsPerPage && !page) || (page === 1 && allItems.length === 0)) {
        // Pagination is enabled but no page is selected, return the collection
        // OR the first page is selected but there is no item, return an empty page
        returnData = {
          '@context': this.settings.jsonContext,
          id: collectionUri,
          type: this.isOrderedCollection(collection) ? 'OrderedCollection' : 'Collection',
          summary: collection.summary,
          first: numPages > 0 ? `${collectionUri}?page=1` : undefined,
          last: numPages > 0 ? `${collectionUri}?page=${numPages}` : undefined,
          totalItems: allItems ? allItems.length : 0
        };
      } else {
        let selectedItemsUris = allItems;
        let selectedItems = [];
        const itemsProp = this.isOrderedCollection(collection) ? 'orderedItems' : 'items';

        // If pagination is enabled, return a slice of the items
        if (itemsPerPage) {
          const start = (page - 1) * itemsPerPage;
          selectedItemsUris = allItems.slice(start, start + itemsPerPage);
        }

        if (dereferenceItems) {
          for (const itemUri of selectedItemsUris) {
            try {
              selectedItems.push(
                await ctx.call('activitypub.object.get', {
                  objectUri: itemUri,
                  actorUri: webId,
                  jsonContext: this.settings.jsonContext
                })
              );
            } catch (e) {
              if (e.code === 404 || e.code === 403) {
                // Ignore resource if it is not found
                this.logger.warn(`Resource not found with URI: ${itemUri}`);
              } else {
                throw e;
              }
            }
          }

          // Remove the @context from all items
          selectedItems = selectedItems.map(({ '@context': context, ...item }) => item);
        } else {
          selectedItems = selectedItemsUris;
        }

        if (itemsPerPage) {
          returnData = {
            '@context': this.settings.jsonContext,
            id: `${collectionUri}?page=${page}`,
            type: this.isOrderedCollection(collection) ? 'OrderedCollectionPage' : 'CollectionPage',
            partOf: collectionUri,
            prev: page > 1 ? `${collectionUri}?page=${parseInt(page) - 1}` : undefined,
            next: page < numPages ? `${collectionUri}?page=${parseInt(page) + 1}` : undefined,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
          };
        } else {
          // No pagination, return the collection
          returnData = {
            '@context': this.settings.jsonContext,
            id: collectionUri,
            type: this.isOrderedCollection(collection) ? 'OrderedCollection' : 'Collection',
            summary: collection.summary,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
          };
        }
      }

      ctx.meta.$responseType = 'application/ld+json';
      return returnData;
    },
    /*
     * Empty the collection, deleting all items it contains.
     * @param collectionUri The full URI of the collection
     */
    async clear(ctx) {
      const collectionUri = ctx.params.collectionUri.replace(/\/+$/, '');
      await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#> 
          DELETE {
            ?s1 ?p1 ?o1 .
          }
          WHERE { 
            FILTER(?container IN (<${collectionUri}>, <${`${collectionUri}/`}>)) .
            ?container as:items ?s1 .
            ?s1 ?p1 ?o1 .
          } 
        `,
        webId: 'system'
      });
    },
    /*
     * Delete the container and remove all links to the items.
     * The items are not deleted, for this call the clear action.
     * @param collectionUri The full URI of the collection
     */
    async remove(ctx) {
      const collectionUri = ctx.params.collectionUri.replace(/\/+$/, '');
      await ctx.call('triplestore.update', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#> 
          DELETE {
            ?s1 ?p1 ?o1 .
          }
          WHERE { 
            FILTER(?s1 IN (<${collectionUri}>, <${`${collectionUri}/`}>)) .
            ?s1 ?p1 ?o1 .
          }
        `,
        webId: 'system'
      });
    },
    async getOwner(ctx) {
      const { collectionUri, collectionKey } = ctx.params;

      // Inboxes use the LDP ontology (LDN)
      const prefix = collectionKey === 'inbox' ? 'ldp' : 'as';

      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#> 
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?actorUri
          WHERE { 
            ?actorUri ${prefix}:${collectionKey} <${collectionUri}>
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      return results.length > 0 ? results[0].actorUri.value : null;
    }
  },
  hooks: {
    before: {
      '*'(ctx) {
        // If we have a pod provider, guess the dataset from the container URI
        if (this.settings.podProvider && ctx.params.collectionUri) {
          const collectionPath = new URL(ctx.params.collectionUri).pathname;
          const parts = collectionPath.split('/');
          if (parts.length > 1) {
            ctx.meta.dataset = parts[1];
          }
        }
      }
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
