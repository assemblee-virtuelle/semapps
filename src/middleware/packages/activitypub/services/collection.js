const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { defaultToArray } = require('../utils');

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
      await ctx.call('webacl.resource.addRights', {
        webId: 'system',
        resourceUri: ctx.params.collectionUri,
        newRights: {
          anon: {
            write: true
          }
        }
      });

      return await ctx.call('triplestore.insert', {
        resource: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: ctx.params.collectionUri,
          type: ctx.params.ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
          summary: ctx.params.summary
        },
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

      // TODO check why thrown error is lost and process is stopped
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
     * @param page Page number. If none are defined, display the collection.
     * @param itemsPerPage Number of items to show per page
     * @param sort Object with `predicate` and `order` properties to sort ordered collections
     */
    async get(ctx) {
      const { id, dereferenceItems = false, queryDepth, page, itemsPerPage, sort } = ctx.params;

      let collection = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${id}> a as:Collection, ?collectionType .
            <${id}> as:summary ?summary .
          }
          WHERE {
            <${id}> a as:Collection, ?collectionType .
            OPTIONAL { <${id}> as:summary ?summary . }
          }
        `,
        accept: MIME_TYPES.JSON
      });

      // No persisted collection found
      if (!collection['@id']) return null;

      if (this.isOrderedCollection(collection) && !sort) {
        throw new Error('A sort parameter must be provided for ordered collections');
      }

      // Caution: we must do a select query, because construct queries cannot be sorted
      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT DISTINCT ?itemUri 
          WHERE {
            <${id}> a as:Collection .
            OPTIONAL { 
              <${id}> as:items ?itemUri . 
              ${sort ? `OPTIONAL { ?itemUri ${sort.predicate} ?order . }` : ''}
            }
          }
          ${sort ? `ORDER BY ${sort.order}( ?order )` : ''}
        `,
        accept: MIME_TYPES.JSON
      });

      const allItems = result.filter(node => node.itemUri).map(node => node.itemUri.value);
      const numPages = !itemsPerPage ? 1 : allItems ? Math.ceil(allItems.length / itemsPerPage) : 0;

      if (page && page > numPages) {
        // The collection page does not exist
        return null;
      } else if (itemsPerPage && !page) {
        // Pagination is enabled but no page is selected, return the collection
        return {
          '@context': this.settings.context,
          id,
          type: this.isOrderedCollection(collection) ? 'OrderedCollection' : 'Collection',
          summary: collection.summary,
          first: numPages > 0 ? id + '?page=1' : undefined,
          last: numPages > 0 ? id + '?page=' + numPages : undefined,
          totalItems: allItems ? allItems.length : 0
        };
      } else {
        let selectedItemsUris = allItems,
          selectedItems = [];
        const itemsProp = this.isOrderedCollection(collection) ? 'orderedItems' : 'items';

        // If pagination is enabled, return a slice of the items
        if (itemsPerPage) {
          const start = (page - 1) * itemsPerPage;
          selectedItemsUris = allItems.slice(start, start + itemsPerPage);
        }

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

          // Remove the @context from all items
          selectedItems = selectedItems.map(({ '@context': context, ...item }) => item);
        } else {
          selectedItems = selectedItemsUris;
        }

        if (itemsPerPage) {
          return {
            '@context': this.settings.context,
            id: id + '?page=' + page,
            type: this.isOrderedCollection(collection) ? 'OrderedCollectionPage' : 'CollectionPage',
            partOf: id,
            prev: page > 1 ? id + '?page=' + (parseInt(page) - 1) : undefined,
            next: page < numPages ? id + '?page=' + (parseInt(page) + 1) : undefined,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
          };
        } else {
          // No pagination, return the collection
          return {
            '@context': this.settings.context,
            id: id,
            type: this.isOrderedCollection(collection) ? 'OrderedCollection' : 'Collection',
            summary: collection.summary,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
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
