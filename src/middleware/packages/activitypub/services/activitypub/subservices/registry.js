const urlJoin = require('url-join');
const { quad, namedNode } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { defaultToArray } = require('../../../utils');
const { ACTOR_TYPES, FULL_ACTOR_TYPES, AS_PREFIX } = require('../../../constants');

const RegistryService = {
  name: 'activitypub.registry',
  settings: {
    baseUri: null,
    podProvider: false,
    defaultCollectionOptions: {
      attachToTypes: [],
      attachPredicate: null,
      ordered: false,
      itemsPerPage: null,
      dereferenceItems: false,
      sort: { predicate: 'as:published', order: 'DESC' }
    }
  },
  dependencies: ['triplestore', 'ldp'],
  async started() {
    this.registeredCollections = [];
    this.registeredContainers = {};
    this.collectionsInCreation = [];

    this.registeredContainers['*'] = await this.broker.call('ldp.registry.list');

    if (this.settings.podProvider) {
      await this.broker.waitForServices(['pod']);
      for (let dataset of await this.broker.call('pod.list')) {
        this.registeredContainers[dataset] = await this.broker.call('ldp.registry.list', { dataset });
      }
    }
  },
  actions: {
    async register(ctx) {
      let { path, name, attachToTypes, ...options } = ctx.params;
      if (!name) name = path;

      // Ignore undefined options
      Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

      // Save the collection locally
      this.registeredCollections.push({ path, name, attachToTypes, ...options });
    },
    list() {
      return this.registeredCollections;
    },
    listLocalContainers() {
      return this.registeredContainers;
    },
    async getByUri(ctx) {
      const { collectionUri } = ctx.params;

      if (!collectionUri) {
        throw new Error('The param collectionUri must be provided to activitypub.registry.getByUri');
      }

      // TODO put in cache
      const result = await ctx.call('triplestore.query', {
        query: `
          SELECT ?predicate
          WHERE {
            ?resource ?predicate <${collectionUri}> .
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      return {
        ...this.settings.defaultCollectionOptions,
        ...this.registeredCollections.find(collection =>
          result.some(node => collection.attachPredicate === node.predicate.value)
        )
      };
    },
    async createAndAttachCollection(ctx) {
      const { objectUri, collection, webId } = ctx.params;
      const collectionUri = urlJoin(objectUri, collection.path);

      const exists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!exists && !this.collectionsInCreation.includes(collectionUri)) {
        // Prevent race conditions by keeping the collections being created in memory
        this.collectionsInCreation.push(collectionUri);

        // Create the collection
        await ctx.call('activitypub.collection.create', {
          collectionUri,
          config: { ordered: collection?.ordered, summary: collection?.summary },
          options: collection, // Used by WebACL middleware if it exists
          webId
        });

        // Attach it to the object
        await ctx.call(
          'ldp.resource.patch',
          {
            resourceUri: objectUri,
            triplesToAdd: [quad(namedNode(objectUri), namedNode(collection.attachPredicate), namedNode(collectionUri))],
            webId: 'system'
          },
          {
            meta: {
              skipObjectsWatcher: true // We don't want to trigger an Update
            }
          }
        );

        // Now the collection has been created, we can remove it (this way we don't use too much memory)
        this.collectionsInCreation = this.collectionsInCreation.filter(c => c !== collectionUri);
      }
    },
    async deleteCollection(ctx) {
      const { objectUri, collection } = ctx.params;
      const collectionUri = urlJoin(objectUri, collection.path);

      const exists = await ctx.call('activitypub.collection.exist', { collectionUri, webId: 'system' });
      if (exists) {
        // Delete the collection
        await ctx.call('activitypub.collection.remove', { collectionUri, webId: 'system' });
      }
    },
    async createAndAttachMissingCollections(ctx) {
      for (const collection of this.registeredCollections) {
        this.logger.info(`Looking for containers with types: ${JSON.stringify(collection.attachToTypes)}`);

        const datasets = this.settings.podProvider ? await this.broker.call('pod.list') : ['*'];
        for (let dataset of datasets) {
          // Find all containers where we want to attach this collection
          const containers = this.getContainersByType(collection.attachToTypes, dataset);
          if (containers) {
            // Go through each container
            for (const container of Object.values(containers)) {
              const containerUri = urlJoin(this.settings.baseUri, container.fullPath);
              this.logger.info(`Looking for resources in container ${containerUri}`);
              const resources = await ctx.call('ldp.container.getUris', { containerUri });
              for (const resourceUri of resources) {
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
    }
    // async getUri(ctx) {
    //   const { path, webId } = ctx.params;
    //
    //   if (this.settings.podProvider) {
    //     const account = await ctx.call('auth.account.findByWebId', { webId });
    //     return urlJoin(account.podUri, path);
    //   } else {
    //     return urlJoin(this.settings.baseUrl, path);
    //   }
    // }
  },
  methods: {
    // Get the collections attached to the given type
    getCollectionsByType(types) {
      types = defaultToArray(types);
      return types
        ? this.registeredCollections.filter(collection =>
            types
              .map(type => type.replace(AS_PREFIX, '')) // Remove AS prefix if it is set
              .some(type =>
                Array.isArray(collection.attachToTypes)
                  ? collection.attachToTypes.includes(type)
                  : collection.attachToTypes === type
              )
          )
        : [];
    },
    // Get the containers with resources of the given type
    // Same action as ldp.registry.getByType, but search through locally registered containers to avoid race conditions
    getContainersByType(types, dataset) {
      const containers =
        !dataset || dataset === '*'
          ? this.registeredContainers['*']
          : { ...this.registeredContainers['*'], ...this.registeredContainers[dataset] };

      return Object.values(containers).filter(container =>
        defaultToArray(types).some(type =>
          Array.isArray(container.acceptedTypes)
            ? container.acceptedTypes.includes(type)
            : container.acceptedTypes === type
        )
      );
    },
    isActor(types) {
      return defaultToArray(types).some(type =>
        [...Object.values(ACTOR_TYPES), ...Object.values(FULL_ACTOR_TYPES)].includes(type)
      );
    },
    hasTypeChanged(oldData, newData) {
      return JSON.stringify(newData.type || newData['@type']) !== JSON.stringify(oldData.type || oldData['@type']);
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId } = ctx.params;
      const collections = this.getCollectionsByType(newData.type || newData['@type']);
      for (const collection of collections) {
        if (this.isActor(newData.type || newData['@type'])) {
          // If the resource is an actor, use the resource URI as the webId
          await this.actions.createAndAttachCollection(
            { objectUri: resourceUri, collection, webId: resourceUri },
            { parentCtx: ctx }
          );
        } else {
          await this.actions.createAndAttachCollection(
            { objectUri: resourceUri, collection, webId },
            { parentCtx: ctx }
          );
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData, webId } = ctx.params;
      // Check if we need to create collection only if the type has changed
      if (this.hasTypeChanged(oldData, newData)) {
        const collections = this.getCollectionsByType(newData.type || newData['@type']);
        for (const collection of collections) {
          if (this.isActor(newData.type || newData['@type'])) {
            // If the resource is an actor, use the resource URI as the webId
            await this.actions.createAndAttachCollection(
              { objectUri: resourceUri, collection, webId: resourceUri },
              { parentCtx: ctx }
            );
          } else {
            await this.actions.createAndAttachCollection(
              { objectUri: resourceUri, collection, webId },
              { parentCtx: ctx }
            );
          }
        }
      }
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri, triplesAdded, webId } = ctx.params;
      for (const triple of triplesAdded) {
        if (triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
          const collections = this.getCollectionsByType(triple.object.value);
          for (const collection of collections) {
            if (this.isActor(triple.object.value)) {
              // If the resource is an actor, use the resource URI as the webId
              await this.actions.createAndAttachCollection(
                { objectUri: resourceUri, collection, webId: resourceUri },
                { parentCtx: ctx }
              );
            } else {
              await this.actions.createAndAttachCollection(
                { objectUri: resourceUri, collection, webId },
                { parentCtx: ctx }
              );
            }
          }
        }
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { oldData } = ctx.params;
      const collections = this.getCollectionsByType(oldData.type || oldData['@type']);
      for (const collection of collections) {
        await this.actions.deleteCollection(
          { objectUri: oldData.id || oldData['@id'], collection },
          { parentCtx: ctx }
        );
      }
    },
    async 'ldp.registry.registered'(ctx) {
      const { container, dataset } = ctx.params;

      // Register the container locally
      // Avoid race conditions, if this event is called while the register action is still running
      if (!this.registeredContainers[dataset || '*']) this.registeredContainers[dataset || '*'] = {};
      this.registeredContainers[dataset || '*'][container.name] = container;
    }
  }
};

module.exports = RegistryService;
