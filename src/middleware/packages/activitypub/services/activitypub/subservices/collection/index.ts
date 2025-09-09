import { ControlledContainerMixin, arrayOf, getDatasetFromUri } from '@semapps/ldp';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
// @ts-expect-error TS(2614): Module '"moleculer-web"' has no exported member 'E... Remove this comment to see the full error message
import { Errors as E } from 'moleculer-web';
import { ServiceSchema } from 'moleculer';
import getAction from './actions/get.ts';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const CollectionService = {
  name: 'activitypub.collection' as const,
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
    newResourcesPermissions: (webId: any) => {
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
    put: {
      handler() {
        throw new E.ForbiddenError();
      }
    },

    patch: {
      async handler(ctx) {
        const { resourceUri: collectionUri, triplesToAdd, triplesToRemove } = ctx.params;
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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
      }
    },

    post: {
      async handler(ctx) {
        if (!ctx.params.containerUri) {
          ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
        }

        await this.actions.waitForContainerCreation({ containerUri: ctx.params.containerUri });

        const ordered = arrayOf(ctx.params.resource.type).includes('OrderedCollection');

        // TODO Use ShEx to check collection validity
        if (!ordered && (ctx.params.resource['semapps:sortPredicate'] || ctx.params.resource['semapps:sortOrder'])) {
          throw new Error(
            `Non-ordered collections cannot include semapps:sortPredicate or semapps:sortOrder predicates`
          );
        }

        // Set default values
        if (!ctx.params.resource['semapps:dereferenceItems']) ctx.params.resource['semapps:dereferenceItems'] = false;
        if (ordered) {
          if (!ctx.params.resource['semapps:sortPredicate'])
            ctx.params.resource['semapps:sortPredicate'] = 'as:published';
          if (!ctx.params.resource['semapps:sortOrder']) ctx.params.resource['semapps:sortOrder'] = 'semapps:DescOrder';
        }

        return await ctx.call('ldp.container.post', ctx.params);
      }
    },

    isEmpty: {
      /*
       * Checks if the collection is empty
       * @param collectionUri The full URI of the collection
       * @return true if the collection is empty
       */

      async handler(ctx) {
        const { collectionUri } = ctx.params;
        const res = await ctx.call('triplestore.query', {
          query: sanitizeSparqlQuery`
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            SELECT ( Count(?items) as ?count )
            WHERE {
              GRAPH <${collectionUri}> {
                <${collectionUri}> as:items ?items .
              }
            }
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });
        return Number(res[0].count.value) === 0;
      }
    },

    includes: {
      /*
       * Checks if an item is in a collection
       * @param collectionUri The full URI of the collection
       * @param itemUri The full URI of the item
       * @return true if the collection exists
       */
      async handler(ctx) {
        const { collectionUri, itemUri } = ctx.params;
        if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.includes');
        return await ctx.call('triplestore.query', {
          query: sanitizeSparqlQuery`
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            ASK
            WHERE {
              GRAPH <${collectionUri}> {
                <${collectionUri}> a as:Collection .
                <${collectionUri}> as:items <${itemUri}> .
              }
            }
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });
      }
    },

    add: {
      /*
       * Attach an object to a collection
       * @param collectionUri The full URI of the collection
       * @param item The resource to add to the collection
       */
      async handler(ctx) {
        let { collectionUri, item, itemUri } = ctx.params;
        if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
        if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.add');

        // TODO also check external resources
        // const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: itemUri });
        // if (!resourceExist) throw new Error('Cannot attach a non-existing resource !')

        // TODO check why thrown error is lost and process is stopped
        const collectionExist = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
        if (!collectionExist)
          throw new Error(
            // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
            `Cannot attach to a non-existing collection: ${collectionUri} (dataset: ${ctx.meta.dataset})`
          );

        await ctx.call('triplestore.update', {
          query: sanitizeSparqlQuery`
            INSERT DATA { 
              GRAPH <${collectionUri}> {
                <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}>
              }
            }
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });

        await ctx.emit('activitypub.collection.added', {
          collectionUri,
          itemUri
        });
      }
    },

    remove: {
      /*
       * Detach an object from a collection
       * @param collectionUri The full URI of the collection
       * @param item The resource to remove from the collection
       */
      async handler(ctx) {
        let { collectionUri, item, itemUri } = ctx.params;
        if (!itemUri && item) itemUri = typeof item === 'object' ? item.id || item['@id'] : item;
        if (!itemUri) throw new Error('No valid item URI provided for activitypub.collection.remove');

        const collectionExist = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
        if (!collectionExist) throw new Error(`Cannot detach from a non-existing collection: ${collectionUri}`);

        await ctx.call('triplestore.update', {
          query: sanitizeSparqlQuery`
            DELETE
            WHERE { 
              GRAPH <${collectionUri}> {
                <${collectionUri}> <https://www.w3.org/ns/activitystreams#items> <${itemUri}> 
              }
            }
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });

        await ctx.emit('activitypub.collection.removed', {
          collectionUri,
          itemUri
        });
      }
    },

    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resourceUr... Remove this comment to see the full error message
    get: getAction,

    clear: {
      /*
       * Empty the collection, deleting all items it contains.
       * @param collectionUri The full URI of the collection
       */
      async handler(ctx) {
        const { collectionUri } = ctx.params;
        await ctx.call('triplestore.update', {
          query: sanitizeSparqlQuery`
            PREFIX as: <https://www.w3.org/ns/activitystreams#> 
            DELETE {
              GRAPH ?g1 {
                ?s1 ?p1 ?o1 .
              }
            }
            WHERE { 
              GRAPH <${collectionUri}> {
                <${collectionUri}> as:items ?s1 .
              }
              GRAPH ?g1 {
                ?s1 ?p1 ?o1 .
              }
            } 
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });
      }
    },

    getOwner: {
      /*
       * Get the owner of collections attached to actors
       * @param collectionUri The full URI of the collection
       * @param collectionKey The key of the collection (eg. inbox)
       */
      async handler(ctx) {
        const { collectionUri, collectionKey } = ctx.params;

        // Inboxes use the LDP ontology (LDN)
        const prefix = collectionKey === 'inbox' ? 'ldp' : 'as';

        const results = await ctx.call('triplestore.query', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#> 
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            SELECT ?actorUri
            WHERE { 
              GRAPH ?g {
                ?actorUri ${prefix}:${collectionKey} <${collectionUri}>
              }
            }
          `,
          dataset: this.getCollectionDataset(collectionUri),
          webId: 'system'
        });

        return results.length > 0 ? results[0].actorUri.value : null;
      }
    }
  },
  methods: {
    getCollectionDataset(collectionUri) {
      if (!this.settings.podProvider) return undefined;
      return getDatasetFromUri(collectionUri);
    }
  }
} satisfies ServiceSchema;

export default CollectionService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [CollectionService.name]: typeof CollectionService;
    }
  }
}
