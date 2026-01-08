import urlJoin from 'url-join';
import rdf from '@rdfjs/data-model';
import { Account } from '@semapps/auth';
import { arrayOf, getDatasetFromUri } from '@semapps/ldp';
import { ServiceSchema, Context } from 'moleculer';
import { AS_PREFIX } from '../../../constants.ts';
import { CollectionRegistration } from '../../../types.ts';

const CollectionsRegistryService = {
  name: 'activitypub.collections-registry' as const,
  dependencies: ['triplestore', 'ldp'],
  async started() {
    this.registeredCollections = [];
    this.collectionsInCreation = [];
  },
  actions: {
    register: {
      async handler(ctx) {
        let { path, name, ...options } = ctx.params;
        if (!name) name = path;

        // Ignore undefined options
        Object.keys(options).forEach(
          key => (options[key] === undefined || options[key] === null) && delete options[key]
        );

        // Persist the collection in memory
        this.registeredCollections.push({ path, name, ...options });

        return { path, name, ...options };
      }
    },

    list: {
      handler() {
        return this.registeredCollections;
      }
    },

    createAndAttachCollection: {
      async handler(ctx) {
        const { objectUri, collection } = ctx.params;
        const {
          path,
          attachPredicate,
          ordered,
          summary,
          dereferenceItems,
          itemsPerPage,
          sortPredicate,
          sortOrder,
          permissions
        } = collection as CollectionRegistration;

        const collectionTempId = objectUri + attachPredicate;
        let collectionUri = await this.actions.getCollectionUri({ objectUri, attachPredicate }, { parentCtx: ctx });

        if (!collectionUri && !this.collectionsInCreation.includes(collectionTempId)) {
          // Prevent race conditions by keeping the collections being created in memory
          this.collectionsInCreation.push(collectionTempId);

          // Create the collection
          collectionUri = await ctx.call(
            'activitypub.collection.post',
            {
              resource: {
                type: ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
                summary,
                'semapps:dereferenceItems': dereferenceItems,
                'semapps:itemsPerPage': itemsPerPage,
                'semapps:sortPredicate': sortPredicate,
                'semapps:sortOrder': sortOrder
              },
              slug: (await ctx.call('ldp.getSetting', { key: 'allowSlugs' })) ? path : undefined,
              webId: 'system',
              permissions // Handled by the WebAclMiddleware, if present
            },
            {
              meta: {
                skipObjectsWatcher: true // We don't want to trigger a Create activity
              }
            }
          );

          // Attach it to the object
          await ctx.call(
            'ldp.resource.patch',
            {
              resourceUri: objectUri,
              triplesToAdd: [
                rdf.quad(rdf.namedNode(objectUri), rdf.namedNode(attachPredicate), rdf.namedNode(collectionUri))
              ],
              webId: 'system'
            },
            {
              meta: {
                skipObjectsWatcher: true // We don't want to trigger an Update activity
              }
            }
          );

          // Now the collection has been created, we can remove it (this way we don't use too much memory)
          this.collectionsInCreation = this.collectionsInCreation.filter((c: any) => c !== collectionTempId);
        }

        return collectionUri;
      }
    },

    deleteCollection: {
      async handler(ctx) {
        const { objectUri, collection } = ctx.params;
        const resourceUri = urlJoin(objectUri, collection.path);

        const exists = await ctx.call('activitypub.collection.exist', { resourceUri, webId: 'system' });
        if (exists) {
          // Delete the collection
          await ctx.call('activitypub.collection.delete', { resourceUri, webId: 'system' });
        }
      }
    },

    getCollectionUri: {
      params: {
        objectUri: { type: 'string' },
        attachPredicate: { type: 'string' }
      },
      async handler(ctx) {
        const { objectUri, attachPredicate } = ctx.params;

        const results: any = await ctx.call('triplestore.query', {
          query: `
            SELECT ?collectionUri
            WHERE {
              GRAPH <${objectUri}> {
                <${objectUri}> <${attachPredicate}> ?collectionUri
              }
            }
          `,
          dataset: getDatasetFromUri(objectUri),
          webId: 'system'
        });

        return results[0]?.collectionUri?.value;
      }
    },

    getByUri: {
      params: {
        collectionUri: { type: 'string' }
      },
      async handler(ctx) {
        const { collectionUri } = ctx.params;

        const results: any = await ctx.call('triplestore.query', {
          query: `
            SELECT ?objectUri ?attachPredicate ?type
            WHERE {
              GRAPH ?objectUri {
                ?objectUri ?attachPredicate <${collectionUri}> .
                FILTER ( ?attachPredicate != <http://www.w3.org/ns/ldp#contains> )
              }
            }
          `,
          dataset: getDatasetFromUri(collectionUri),
          webId: 'system'
        });

        const attachPredicate = arrayOf(results)[0]?.attachPredicate.value;

        // Find the first registration that match the attach predicate and the object type(s)
        return this.registeredCollections.find(
          (reg: CollectionRegistration) => reg.attachPredicate === attachPredicate
        );
      }
    },

    createAndAttachMissingCollections: {
      async handler(ctx) {
        for (const collection of this.registeredCollections) {
          this.logger.info(`Looking for containers with types: ${JSON.stringify(collection.attachToTypes)}`);

          const accounts: Account[] = await ctx.call('auth.account.find');

          for (const { webId, username: dataset } of accounts) {
            ctx.meta.dataset = dataset;
            ctx.meta.webId = webId;

            // Find the container for resources of this type
            const containerUri: string = await ctx.call('ldp.registry.getUri', {
              type: arrayOf(collection.attachToTypes)[0],
              isContainer: true
            });

            this.logger.info(`Looking for resources in container ${containerUri}`);

            const resourcesUris: string[] = await ctx.call('ldp.container.getUris', { containerUri });
            for (const resourceUri of resourcesUris) {
              await this.actions.createAndAttachCollection(
                {
                  objectUri: resourceUri,
                  collection
                },
                { parentCtx: ctx }
              );
            }
          }
        }
      }
    },

    updateCollectionsOptions: {
      async handler(ctx) {
        let { collection, dataset: chosenDataset } = ctx.params;
        let { attachPredicate, ordered, summary, dereferenceItems, itemsPerPage, sortPredicate, sortOrder } =
          collection || {};

        attachPredicate = await ctx.call('jsonld.parser.expandPredicate', { predicate: attachPredicate });
        sortPredicate =
          sortPredicate && (await ctx.call('jsonld.parser.expandPredicate', { predicate: sortPredicate }));
        sortOrder = sortOrder && (await ctx.call('jsonld.parser.expandPredicate', { predicate: sortOrder }));

        const accounts: Account[] = await this.broker.call('auth.account.find', {
          query: chosenDataset ? { username: chosenDataset } : {}
        });

        for (const { webId, username: dataset } of accounts) {
          ctx.meta.dataset = dataset;
          ctx.meta.webId = webId;

          this.logger.info(
            `Getting all collections in dataset ${dataset} attached with predicate ${attachPredicate}...`
          );

          const results: any = await ctx.call('triplestore.query', {
            query: `
              SELECT ?collectionUri
              WHERE {
                GRAPH ?g {
                  ?objectUri <${attachPredicate}> ?collectionUri 
                }
              }
            `,
            webId: 'system'
          });

          for (const collectionUri of results.map((r: any) => r.collectionUri.value)) {
            if (!(await ctx.call('ldp.remote.isRemote', { resourceUri: collectionUri }))) {
              this.logger.info(`Updating options of ${collectionUri}...`);
              await ctx.call('triplestore.update', {
                query: `
                  PREFIX as: <https://www.w3.org/ns/activitystreams#>
                  PREFIX semapps: <http://semapps.org/ns/core#>
                  WITH <${collectionUri}>
                  DELETE {
                    <${collectionUri}> 
                      a ?type ;
                      as:summary ?summary ;
                      semapps:dereferenceItems ?dereferenceItems ;
                      semapps:itemsPerPage ?itemsPerPage ;
                      semapps:sortPredicate ?sortPredicate ;
                      semapps:sortOrder ?sortOrder .
                  }
                  INSERT {
                    <${collectionUri}> a ${ordered ? 'as:OrderedCollection, as:Collection' : 'as:Collection'} .
                    ${summary ? `<${collectionUri}> as:summary "${summary}" .` : ''}
                    <${collectionUri}> semapps:dereferenceItems ${dereferenceItems} .
                    ${itemsPerPage ? `<${collectionUri}> semapps:itemsPerPage ${itemsPerPage} .` : ''}
                    ${sortPredicate ? `<${collectionUri}> semapps:sortPredicate <${sortPredicate}> .` : ''}
                    ${sortOrder ? `<${collectionUri}> semapps:sortOrder <${sortOrder}> .` : ''}
                  }
                  WHERE {
                    <${collectionUri}> a ?type
                    OPTIONAL { <${collectionUri}> as:summary ?summary . }
                    OPTIONAL { <${collectionUri}> semapps:dereferenceItems ?dereferenceItems . }
                    OPTIONAL { <${collectionUri}> semapps:itemsPerPage ?itemsPerPage . }
                    OPTIONAL { <${collectionUri}> semapps:sortPredicate ?sortPredicate . }
                    OPTIONAL { <${collectionUri}> semapps:sortOrder ?sortOrder . }
                  }
                `,
                webId: 'system',
                dataset
              });
            }
          }
        }
      }
    }
  },
  methods: {
    // Get the collections attached to the given type
    getCollectionsByType(types) {
      types = arrayOf(types);
      return types.length > 0
        ? this.registeredCollections.filter((collection: any) =>
            types
              .map((type: any) => type.replace(AS_PREFIX, '')) // Remove AS prefix if it is set
              .some((type: any) =>
                Array.isArray(collection.attachToTypes)
                  ? collection.attachToTypes.includes(type)
                  : collection.attachToTypes === type
              )
          )
        : [];
    },
    hasTypeChanged(oldData, newData) {
      return JSON.stringify(newData.type || newData['@type']) !== JSON.stringify(oldData.type || oldData['@type']);
    }
  },
  events: {
    'ldp.resource.created': {
      async handler(ctx) {
        const { resourceUri, newData } = ctx.params;
        const collections = this.getCollectionsByType(newData.type || newData['@type']);
        for (const collection of collections) {
          await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection }, { parentCtx: ctx });
        }
      }
    },

    'ldp.resource.updated': {
      async handler(ctx) {
        const { resourceUri, newData, oldData } = ctx.params;
        // Check if we need to create collection only if the type has changed
        if (this.hasTypeChanged(oldData, newData)) {
          const collections = this.getCollectionsByType(newData.type || newData['@type']);
          for (const collection of collections) {
            await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection }, { parentCtx: ctx });
          }
        }
      }
    },

    'ldp.resource.patched': {
      async handler(ctx) {
        const { resourceUri, triplesAdded } = ctx.params;
        if (triplesAdded) {
          for (const triple of triplesAdded) {
            if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
              const collections = this.getCollectionsByType(triple.object.value);
              for (const collection of collections) {
                await this.actions.createAndAttachCollection(
                  { objectUri: resourceUri, collection },
                  { parentCtx: ctx }
                );
              }
            }
          }
        }
      }
    },

    'ldp.resource.deleted': {
      async handler(ctx: Context<any>) {
        const { oldData } = ctx.params;
        const collections = this.getCollectionsByType(oldData.type || oldData['@type']);
        for (const collection of collections) {
          await this.actions.deleteCollection(
            { objectUri: oldData.id || oldData['@id'], collection },
            { parentCtx: ctx }
          );
        }
      }
    }
  }
} satisfies ServiceSchema;

export default CollectionsRegistryService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [CollectionsRegistryService.name]: typeof CollectionsRegistryService;
    }
  }
}
