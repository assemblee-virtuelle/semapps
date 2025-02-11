const { MoleculerError } = require('moleculer').Errors;
const { ControlledContainerMixin, arrayOf } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { Errors: E } = require('moleculer-web');
const { getValueFromDataType } = require('../../../utils');

const CollectionService = {
  name: 'activitypub.collection',
  mixins: [ControlledContainerMixin],
  settings: {
    podProvider: false,
    // ControlledContainerMixin settings
    path: '/as/collection',
    acceptedTypes: [
      'https://www.w3.org/ns/activitystreams#Collection',
      'https://www.w3.org/ns/activitystreams#OrderedCollection'
    ],
    accept: MIME_TYPES.JSON,
    activateTombstones: false,
    permissions: {},
    // These default permissions can be overridden by providing
    // a `permissions` param when calling activitypub.collection.post
    newResourcesPermissions: webId => {
      switch (webId) {
        case 'anon':
        case 'system':
          return {
            anon: {
              read: true,
              write: true
            }
          };

        default:
          return {
            anon: {
              read: true
            },
            user: {
              uri: webId,
              read: true,
              write: true,
              control: true
            }
          };
      }
    },
    excludeFromMirror: true,
    typeIndex: 'private'
  },
  dependencies: ['triplestore', 'ldp.resource'],
  actions: {
    put() {
      throw new E.ForbiddenError();
    },
    async patch(ctx) {
      const { resourceUri: collectionUri, triplesToAdd, triplesToRemove } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      const collectionExist = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri, webId });
      if (!collectionExist) {
        throw new MoleculerError(
          `Cannot update content of non-existing collection ${collectionUri}`,
          400,
          'BAD_REQUEST'
        );
      }

      if (triplesToAdd) {
        for (const triple of triplesToAdd) {
          if (
            triple.subject.value === collectionUri &&
            triple.predicate.value === 'https://www.w3.org/ns/activitystreams#items'
          ) {
            const itemUri = triple.object.value;
            await ctx.call('activitypub.collection.add', { collectionUri, itemUri });
          }
        }
      }

      if (triplesToRemove) {
        for (const triple of triplesToRemove) {
          if (
            triple.subject.value === collectionUri &&
            triple.predicate.value === 'https://www.w3.org/ns/activitystreams#items'
          ) {
            const itemUri = triple.object.value;
            await ctx.call('activitypub.collection.remove', { collectionUri, itemUri });
          }
        }
      }
    },
    async post(ctx) {
      if (!ctx.params.containerUri) {
        ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }

      await this.actions.waitForContainerCreation({ containerUri: ctx.params.containerUri });

      const ordered = arrayOf(ctx.params.resource.type).includes('OrderedCollection');

      // TODO Use ShEx to check collection validity
      if (!ordered && (ctx.params.resource['semapps:sortPredicate'] || ctx.params.resource['semapps:sortOrder'])) {
        throw new Error(`Non-ordered collections cannot include semapps:sortPredicate or semapps:sortOrder predicates`);
      }

      // Set default values
      if (!ctx.params.resource['semapps:dereferenceItems']) ctx.params.resource['semapps:dereferenceItems'] = false;
      if (ordered) {
        if (!ctx.params.resource['semapps:sortPredicate'])
          ctx.params.resource['semapps:sortPredicate'] = 'as:published';
        if (!ctx.params.resource['semapps:sortOrder']) ctx.params.resource['semapps:sortOrder'] = 'semapps:DescOrder';
      }

      return await ctx.call('ldp.container.post', ctx.params);
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
          SELECT ( Count(?items) as ?count )
          WHERE {
            <${collectionUri}> as:items ?items .
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
    async add(ctx) {
      let { collectionUri, item, itemUri } = ctx.params;
      if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
      if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.add');

      // TODO also check external resources
      // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: itemUri });
      // if (!resourceExist) throw new Error('Cannot attach a non-existing resource !')

      // TODO check why thrown error is lost and process is stopped
      const collectionExist = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
      if (!collectionExist)
        throw new Error(`Cannot attach to a non-existing collection: ${collectionUri} (dataset: ${ctx.meta.dataset})`);

      await ctx.call('triplestore.insert', {
        resource: `<${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}>`,
        webId: 'system'
      });

      await ctx.emit('activitypub.collection.added', {
        collectionUri,
        itemUri
      });
    },
    /*
     * Detach an object from a collection
     * @param collectionUri The full URI of the collection
     * @param item The resource to remove from the collection
     */
    async remove(ctx) {
      let { collectionUri, item, itemUri } = ctx.params;
      if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
      if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.remove');

      const collectionExist = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
      if (!collectionExist) throw new Error(`Cannot detach from a non-existing collection: ${collectionUri}`);

      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE
          { <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}> }
        `,
        webId: 'system'
      });

      await ctx.emit('activitypub.collection.removed', {
        collectionUri,
        itemUri
      });
    },
    async get(ctx) {
      const { resourceUri: collectionUri, jsonContext } = ctx.params;
      const page = ctx.params.page || ctx.meta.queryString?.page;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';
      const localContext = await ctx.call('jsonld.context.get');

      const results = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          PREFIX semapps: <http://semapps.org/ns/core#>
          SELECT ?ordered ?summary ?dereferenceItems ?itemsPerPage ?sortPredicate ?sortOrder
          WHERE {
            <${collectionUri}> a <https://www.w3.org/ns/activitystreams#Collection> . # This will return [] if the user has no read permission
            BIND (EXISTS{<${collectionUri}> a <https://www.w3.org/ns/activitystreams#OrderedCollection>} AS ?ordered)
            OPTIONAL { <${collectionUri}> as:summary ?summary . }
            OPTIONAL { <${collectionUri}> semapps:dereferenceItems ?dereferenceItems . }
            OPTIONAL { <${collectionUri}> semapps:itemsPerPage ?itemsPerPage . }
            OPTIONAL { <${collectionUri}> semapps:sortPredicate ?sortPredicate . }
            OPTIONAL { <${collectionUri}> semapps:sortOrder ?sortOrder . }
          }
        `,
        accept: MIME_TYPES.JSON,
        webId
      });

      if (results.length === 0) {
        throw new MoleculerError('Not found', 404, 'NOT_FOUND');
      }

      const options = Object.fromEntries(
        Object.entries(results[0]).map(([key, result]) => [key, getValueFromDataType(result)])
      );

      const collectionOptions = {
        summary: options.summary,
        'semapps:dereferenceItems': options.dereferenceItems,
        'semapps:itemsPerPage': options.itemsPerPage,
        'semapps:sortPredicate': options.sortPredicate,
        'semapps:sortOrder': options.sortOrder
      };

      // Caution: we must do a select query, because construct queries cannot be sorted
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT DISTINCT ?itemUri
          WHERE {
            <${collectionUri}> a as:Collection .
            OPTIONAL { 
              <${collectionUri}> as:items ?itemUri . 
              ${options.ordered ? `OPTIONAL { ?itemUri <${options.sortPredicate}> ?order . }` : ''}
            }
          }
          ${
            options.ordered
              ? `ORDER BY ${options.sortOrder === 'http://semapps.org/ns/core#DescOrder' ? 'DESC' : 'ASC'}( ?order )`
              : ''
          }
        `,
        accept: MIME_TYPES.JSON,
        webId
      });

      const allItems = result.filter(node => node.itemUri).map(node => node.itemUri.value);
      const numPages = !options.itemsPerPage
        ? 1
        : allItems.length > 0
          ? Math.ceil(allItems.length / options.itemsPerPage)
          : 0;
      let returnData = null;

      if (page > 1 && page > numPages) {
        throw new MoleculerError('Collection Not found', 404, 'NOT_FOUND');
      } else if ((options.itemsPerPage && !page) || (page === 1 && allItems.length === 0)) {
        // Pagination is enabled but no page is selected, return the collection
        // OR the first page is selected but there is no item, return an empty page
        returnData = {
          '@context': localContext,
          id: collectionUri,
          type: options.ordered ? 'OrderedCollection' : 'Collection',
          ...collectionOptions,
          first: numPages > 0 ? `${collectionUri}?page=1` : undefined,
          last: numPages > 0 ? `${collectionUri}?page=${numPages}` : undefined,
          totalItems: allItems ? allItems.length : 0
        };
      } else {
        let selectedItemsUris = allItems;
        let selectedItems = [];
        const itemsProp = options.ordered ? 'orderedItems' : 'items';

        // If pagination is enabled, return a slice of the items
        if (options.itemsPerPage) {
          const start = (page - 1) * options.itemsPerPage;
          selectedItemsUris = allItems.slice(start, start + options.itemsPerPage);
        }

        if (options.dereferenceItems) {
          for (const itemUri of selectedItemsUris) {
            try {
              selectedItems.push(
                await ctx.call('ldp.resource.get', {
                  resourceUri: itemUri,
                  accept: MIME_TYPES.JSON,
                  jsonContext,
                  // If a registered app fetch the inbox or outbox, the webId will be "system"
                  // But we need to have the real user in case we need to fetch through the proxy
                  webId: webId === 'system' && ctx.meta.impersonatedUser ? ctx.meta.impersonatedUser : webId
                })
              );
            } catch (e) {
              if (e.code === 404 || e.code === 403) {
                // Ignore resource if it is not found
                this.logger.debug(`Item not found with URI: ${itemUri}`);
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

        if (options.itemsPerPage) {
          returnData = {
            '@context': localContext,
            id: `${collectionUri}?page=${page}`,
            type: options.ordered ? 'OrderedCollectionPage' : 'CollectionPage',
            partOf: collectionUri,
            prev: page > 1 ? `${collectionUri}?page=${parseInt(page) - 1}` : undefined,
            next: page < numPages ? `${collectionUri}?page=${parseInt(page) + 1}` : undefined,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
          };
        } else {
          // No pagination, return the collection
          returnData = {
            '@context': localContext,
            id: collectionUri,
            type: options.ordered ? 'OrderedCollection' : 'Collection',
            ...collectionOptions,
            [itemsProp]: selectedItems,
            totalItems: allItems ? allItems.length : 0
          };
        }
      }

      return await ctx.call('jsonld.parser.compact', {
        input: returnData,
        context: jsonContext || localContext
      });
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
     * Get the owner of collections attached to actors
     * @param collectionUri The full URI of the collection
     * @param collectionKey The key of the collection (eg. inbox)
     */
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
        // If we have a pod provider, guess the dataset from the collection URI
        if (this.settings.podProvider && ctx.params.collectionUri) {
          const collectionPath = new URL(ctx.params.collectionUri).pathname;
          const parts = collectionPath.split('/');
          if (parts.length > 1) {
            ctx.meta.dataset = parts[1];
          }
        }
      }
    }
  }
};

module.exports = CollectionService;
