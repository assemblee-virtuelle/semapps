import urlJoin from 'url-join';
import { quad, namedNode } from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
import { getWebIdFromUri, arrayOf } from '@semapps/ldp';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';
import { ACTOR_TYPES, FULL_ACTOR_TYPES, AS_PREFIX } from '../../../constants.ts';

const CollectionsRegistryService = {
  name: 'activitypub.collections-registry' as const,
  settings: {
    baseUri: null,
    podProvider: false
  },
  dependencies: ['triplestore', 'ldp'],
  async started() {
    this.registeredCollections = [];
    this.collectionsInCreation = [];
  },
  actions: {
    register: defineAction({
      async handler(ctx) {
        let { path, name, attachToTypes, ...options } = ctx.params;
        if (!name) name = path;

        // Ignore undefined options
        Object.keys(options).forEach(
          key => (options[key] === undefined || options[key] === null) && delete options[key]
        );

        // Persist the collection in memory
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.registeredCollections.push({ path, name, attachToTypes, ...options });
      }
    }),

    list: defineAction({
      handler() {
        return this.registeredCollections;
      }
    }),

    createAndAttachCollection: defineAction({
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
        } = collection || {};
        const collectionUri = urlJoin(objectUri, path);

        const exists = await ctx.call('activitypub.collection.exist', { resourceUri: collectionUri });
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (!exists && !this.collectionsInCreation.includes(collectionUri)) {
          // Prevent race conditions by keeping the collections being created in memory
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.collectionsInCreation.push(collectionUri);

          // Create the collection
          await ctx.call('activitypub.collection.post', {
            resource: {
              type: ordered ? ['Collection', 'OrderedCollection'] : 'Collection',
              summary,
              'semapps:dereferenceItems': dereferenceItems,
              'semapps:itemsPerPage': itemsPerPage,
              'semapps:sortPredicate': sortPredicate,
              'semapps:sortOrder': sortOrder
            },
            contentType: MIME_TYPES.JSON,
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            webId: this.settings.podProvider ? getWebIdFromUri(objectUri) : 'system',
            permissions, // Handled by the WebAclMiddleware, if present
            forcedResourceUri: path ? collectionUri : undefined // Bypass the automatic URI generation
          });

          // Attach it to the object
          await ctx.call(
            'ldp.resource.patch',
            {
              resourceUri: objectUri,
              // @ts-expect-error TS(2345): Argument of type 'NamedNode<never>' is not assigna... Remove this comment to see the full error message
              triplesToAdd: [quad(namedNode(objectUri), namedNode(attachPredicate), namedNode(collectionUri))],
              webId: 'system'
            },
            {
              meta: {
                skipObjectsWatcher: true // We don't want to trigger an Update
              }
            }
          );

          // Now the collection has been created, we can remove it (this way we don't use too much memory)
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.collectionsInCreation = this.collectionsInCreation.filter((c: any) => c !== collectionUri);
        }

        return collectionUri;
      }
    }),

    deleteCollection: defineAction({
      async handler(ctx) {
        const { objectUri, collection } = ctx.params;
        // @ts-expect-error TS(2339): Property 'path' does not exist on type 'never'.
        const resourceUri = urlJoin(objectUri, collection.path);

        const exists = await ctx.call('activitypub.collection.exist', { resourceUri, webId: 'system' });
        if (exists) {
          // Delete the collection
          await ctx.call('activitypub.collection.delete', { resourceUri, webId: 'system' });
        }
      }
    }),

    createAndAttachMissingCollections: defineAction({
      async handler(ctx) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        for (const collection of this.registeredCollections) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(`Looking for containers with types: ${JSON.stringify(collection.attachToTypes)}`);

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const accounts = await this.broker.call('auth.account.find');
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const datasets = this.settings.podProvider ? accounts.map((a: any) => a.username) : [undefined];

          for (let dataset of datasets) {
            // Find all containers where we want to attach this collection
            const containers = await ctx.call('ldp.registry.getByType', { type: collection.attachToTypes, dataset });
            for (const container of Object.values(containers)) {
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              const containerUri = urlJoin(this.settings.baseUri, container.fullPath);
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.logger.info(`Looking for resources in container ${containerUri}`);
              const resources = await ctx.call('ldp.container.getUris', { containerUri });
              for (const resourceUri of resources) {
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                await this.actions.createAndAttachCollection(
                  {
                    objectUri: resourceUri,
                    collection,
                    webId: 'system'
                  },
                  { parentCtx: ctx }
                );
              }
            }
          }
        }
      }
    }),

    updateCollectionsOptions: defineAction({
      async handler(ctx) {
        let { collection, dataset } = ctx.params;
        let { attachPredicate, ordered, summary, dereferenceItems, itemsPerPage, sortPredicate, sortOrder } =
          collection || {};

        // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
        attachPredicate = await ctx.call('jsonld.parser.expandPredicate', { predicate: attachPredicate });
        sortPredicate =
          sortPredicate && (await ctx.call('jsonld.parser.expandPredicate', { predicate: sortPredicate }));
        sortOrder = sortOrder && (await ctx.call('jsonld.parser.expandPredicate', { predicate: sortOrder }));

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const accounts = await this.broker.call('auth.account.find');
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const datasets = dataset
          ? [dataset]
          : this.settings.podProvider
            ? accounts.map((a: any) => a.username)
            : [undefined];

        // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
        for (dataset of datasets) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(
            `Getting all collections in dataset ${dataset} attached with predicate ${attachPredicate}...`
          );

          const results = await ctx.call('triplestore.query', {
            query: `
              SELECT ?collectionUri
              WHERE {
                ?objectUri <${attachPredicate}> ?collectionUri 
              }
            `,
            accept: MIME_TYPES.JSON,
            webId: 'system',
            dataset
          });

          for (const collectionUri of results.map((r: any) => r.collectionUri.value)) {
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            if (this.isLocalObject(collectionUri, urlJoin(this.settings.baseUri, dataset))) {
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.logger.info(`Updating options of ${collectionUri}...`);
              await ctx.call('triplestore.update', {
                query: `
                  PREFIX as: <https://www.w3.org/ns/activitystreams#>
                  PREFIX semapps: <http://semapps.org/ns/core#>
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
    })
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
    isActor(types) {
      return arrayOf(types).some(type =>
        [...Object.values(ACTOR_TYPES), ...Object.values(FULL_ACTOR_TYPES)].includes(type)
      );
    },
    hasTypeChanged(oldData, newData) {
      return JSON.stringify(newData.type || newData['@type']) !== JSON.stringify(oldData.type || oldData['@type']);
    },
    isLocalObject(uri, actorUri) {
      if (this.settings.podProvider) {
        const { origin, pathname } = new URL(actorUri);
        const aclBase = `${origin}/_acl${pathname}`; // URL of type http://localhost:3000/_acl/alice
        const aclGroupBase = `${origin}/_groups${pathname}`; // URL of type http://localhost:3000/_groups/alice
        return (
          uri === actorUri ||
          uri.startsWith(`${actorUri}/`) ||
          uri === aclBase ||
          uri.startsWith(`${aclBase}/`) ||
          uri === aclGroupBase ||
          uri.startsWith(`${aclGroupBase}/`)
        );
      } else {
        return uri.startsWith(this.settings.baseUri);
      }
    }
  },
  events: {
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, newData, webId } = ctx.params;
        // @ts-expect-error TS(2339): Property 'getCollectionsByType' does not exist on ... Remove this comment to see the full error message
        const collections = this.getCollectionsByType(newData.type || newData['@type']);
        for (const collection of collections) {
          // @ts-expect-error TS(2339): Property 'isActor' does not exist on type 'Service... Remove this comment to see the full error message
          if (this.isActor(newData.type || newData['@type'])) {
            // If the resource is an actor, use the resource URI as the webId
            // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
            await this.actions.createAndAttachCollection(
              { objectUri: resourceUri, collection, webId: resourceUri },
              { parentCtx: ctx }
            );
          } else {
            // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
            await this.actions.createAndAttachCollection(
              { objectUri: resourceUri, collection, webId },
              { parentCtx: ctx }
            );
          }
        }
      }
    }),

    'ldp.resource.updated': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, newData, oldData, webId } = ctx.params;
        // Check if we need to create collection only if the type has changed
        // @ts-expect-error TS(2339): Property 'hasTypeChanged' does not exist on type '... Remove this comment to see the full error message
        if (this.hasTypeChanged(oldData, newData)) {
          // @ts-expect-error TS(2339): Property 'getCollectionsByType' does not exist on ... Remove this comment to see the full error message
          const collections = this.getCollectionsByType(newData.type || newData['@type']);
          for (const collection of collections) {
            // @ts-expect-error TS(2339): Property 'isActor' does not exist on type 'Service... Remove this comment to see the full error message
            if (this.isActor(newData.type || newData['@type'])) {
              // If the resource is an actor, use the resource URI as the webId
              // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
              await this.actions.createAndAttachCollection(
                { objectUri: resourceUri, collection, webId: resourceUri },
                { parentCtx: ctx }
              );
            } else {
              // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
              await this.actions.createAndAttachCollection(
                { objectUri: resourceUri, collection, webId },
                { parentCtx: ctx }
              );
            }
          }
        }
      }
    }),

    'ldp.resource.patched': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, triplesAdded, webId } = ctx.params;
        if (triplesAdded) {
          for (const triple of triplesAdded) {
            if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
              // @ts-expect-error TS(2339): Property 'getCollectionsByType' does not exist on ... Remove this comment to see the full error message
              const collections = this.getCollectionsByType(triple.object.value);
              for (const collection of collections) {
                // @ts-expect-error TS(2339): Property 'isActor' does not exist on type 'Service... Remove this comment to see the full error message
                if (this.isActor(triple.object.value)) {
                  // If the resource is an actor, use the resource URI as the webId
                  // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
                  await this.actions.createAndAttachCollection(
                    { objectUri: resourceUri, collection, webId: resourceUri },
                    { parentCtx: ctx }
                  );
                } else {
                  // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
                  await this.actions.createAndAttachCollection(
                    { objectUri: resourceUri, collection, webId },
                    { parentCtx: ctx }
                  );
                }
              }
            }
          }
        }
      }
    }),

    'ldp.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'oldData' does not exist on type 'Service... Remove this comment to see the full error message
        const { oldData } = ctx.params;
        // @ts-expect-error TS(2339): Property 'getCollectionsByType' does not exist on ... Remove this comment to see the full error message
        const collections = this.getCollectionsByType(oldData.type || oldData['@type']);
        for (const collection of collections) {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
          await this.actions.deleteCollection(
            { objectUri: oldData.id || oldData['@id'], collection },
            { parentCtx: ctx }
          );
        }
      }
    })
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
