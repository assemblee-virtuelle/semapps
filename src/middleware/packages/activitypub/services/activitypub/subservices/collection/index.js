const { MoleculerError } = require('moleculer').Errors;
const { ControlledContainerMixin, arrayOf, getDatasetFromUri } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { sanitizeSparqlQuery } = require('@semapps/triplestore');
const { Errors: E } = require('moleculer-web');
const getAction = require('./actions/get');

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
    excludeFromMirror: true
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
        query: sanitizeSparqlQuery`
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT ( Count(?items) as ?count )
          WHERE {
            <${collectionUri}> as:items ?items .
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.getCollectionDataset(collectionUri),
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
        query: sanitizeSparqlQuery`
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          ASK
          WHERE {
            <${collectionUri}> a as:Collection .
            <${collectionUri}> as:items <${itemUri}> .
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.getCollectionDataset(collectionUri),
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

      await ctx.call('triplestore.update', {
        query: sanitizeSparqlQuery`
          INSERT DATA { 
            <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}>
          }
        `,
        dataset: this.getCollectionDataset(collectionUri),
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
        query: sanitizeSparqlQuery`
          DELETE
          WHERE
          { <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}> }
        `,
        dataset: this.getCollectionDataset(collectionUri),
        webId: 'system'
      });

      await ctx.emit('activitypub.collection.removed', {
        collectionUri,
        itemUri
      });
    },
    get: getAction,
    /*
     * Empty the collection, deleting all items it contains.
     * @param collectionUri The full URI of the collection
     */
    async clear(ctx) {
      const collectionUri = ctx.params.collectionUri.replace(/\/+$/, '');
      await ctx.call('triplestore.update', {
        query: sanitizeSparqlQuery`
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
        dataset: this.getCollectionDataset(collectionUri),
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
        dataset: this.getCollectionDataset(collectionUri),
        webId: 'system'
      });

      return results.length > 0 ? results[0].actorUri.value : null;
    }
  },
  methods: {
    getCollectionDataset(collectionUri) {
      if (!this.settings.podProvider) return undefined;
      return getDatasetFromUri(collectionUri);
    }
  }
};

module.exports = CollectionService;
