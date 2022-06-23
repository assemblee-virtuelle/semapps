const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { MIME_TYPES } = require('@semapps/mime-types');
const getCollectionRoute = require('../routes/getCollectionRoute');
const { defaultToArray, getSlugFromUri } = require('../utils');
const { ACTOR_TYPES } = require('../constants');

const RegistryService = {
  name: 'activitypub.registry',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
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
    this.registeredContainers = await this.broker.call('ldp.registry.list');
    this.collectionsInCreation = [];
  },
  actions: {
    async register(ctx) {
      let { path, name, attachToTypes, ...options } = ctx.params;
      if (!name) name = path;

      // Ignore undefined options
      Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

      // Save the collection locally
      this.registeredCollections.push({ path, name, attachToTypes, ...options });

      // Find all containers where we want to attach this collection
      const containers = this.getContainersByType(attachToTypes);

      if (containers) {
        // Go through each container
        for (let container of Object.values(containers)) {
          // Add a corresponding API route
          await this.actions.addApiRoute({ collection: ctx.params, container });

          // TODO go through all objects in the matching containers and ensure the collection is attached
        }
      }
    },
    async addApiRoute(ctx) {
      const { container, collection } = ctx.params;

      const collectionPath = pathJoin(container.fullPath, ':objectId', collection.path);
      const collectionUri = urlJoin(this.settings.baseUri, collectionPath);

      // TODO ensure it's not a problem if the same route is added twice
      await this.broker.call('api.addRoute', {
        route: getCollectionRoute(collectionUri, collection.controlledActions)
      });
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

      // Get last part of the URI (eg. /followers)
      let path = '/' + getSlugFromUri(collectionUri);

      return {
        ...this.settings.defaultCollectionOptions,
        ...this.registeredCollections.find(collection => collection.path === path)
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
        await ctx.call('activitypub.collection.create', { collectionUri, webId });

        // Now the collection has been created, we can remove it (this way we don't use too much memory)
        this.collectionsInCreation = this.collectionsInCreation.filter(c => c !== collectionUri);
      }

      // Attach it to the object (do that even if collection exist, in case it's not correctly attached)
      await ctx.call('ldp.resource.patch', {
        resource: {
          id: objectUri,
          [collection.attachPredicate]: { '@id': collectionUri }
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    async deleteCollection(ctx) {
      const { objectUri, collection } = ctx.params;
      const collectionUri = urlJoin(objectUri, collection.path);

      const exists = await ctx.call('activitypub.collection.exist', { collectionUri, webId: 'system' });
      if (exists) {
        // Delete the collection
        await ctx.call('activitypub.collection.remove', { collectionUri, webId: 'system' });
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
            types.some(type =>
              Array.isArray(collection.attachToTypes)
                ? collection.attachToTypes.includes(type)
                : collection.attachToTypes === type
            )
          )
        : [];
    },
    // Get the containers with resources of the given type
    // Same action as ldp.registry.getByType, but search through locally registered containers to avoid race conditions
    getContainersByType(types) {
      return Object.values(this.registeredContainers).filter(container =>
        defaultToArray(types).some(type =>
          Array.isArray(container.acceptedTypes)
            ? container.acceptedTypes.includes(type)
            : container.acceptedTypes === type
        )
      );
    },
    isActor(types) {
      return defaultToArray(types).some(type => Object.values(ACTOR_TYPES).includes(type));
    },
    hasTypeChanged(oldData, newData) {
      return JSON.stringify(newData.type || newData['@type']) !== JSON.stringify(oldData.type || oldData['@type']);
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId } = ctx.params;

      const collections = this.getCollectionsByType(newData.type || newData['@type']);
      for (let collection of collections) {
        if (this.isActor(newData.type || newData['@type'])) {
          // If the resource is an actor, use the resource URI as the webId
          await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection, webId: resourceUri });
        } else {
          await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection, webId });
        }
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData, webId } = ctx.params;

      // Check if we need to create collection only if the type has changed
      if (this.hasTypeChanged(oldData, newData)) {
        const collections = this.getCollectionsByType(newData.type || newData['@type']);
        for (let collection of collections) {
          if (this.isActor(newData.type || newData['@type'])) {
            // If the resource is an actor, use the resource URI as the webId
            await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection, webId: resourceUri });
          } else {
            await this.actions.createAndAttachCollection({ objectUri: resourceUri, collection, webId });
          }
        }
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { oldData } = ctx.params;
      const collections = this.getCollectionsByType(oldData.type || oldData['@type']);
      for (let collection of collections) {
        await this.actions.deleteCollection({ objectUri: oldData.id || oldData['@id'], collection });
      }
    },
    async 'ldp.registry.registered'(ctx) {
      const { container } = ctx.params;

      // Register the container locally
      // Avoid race conditions, if this event is called while the register action is still running
      this.registeredContainers[container.name] = container;

      // Find the collections that must be attached to the container's resources
      const collections = this.getCollectionsByType(container.acceptedTypes);

      // Go through each collection and add a corresponding API route
      for (let collection of collections) {
        await this.actions.addApiRoute({ collection, container });
      }
    }
  }
};

module.exports = RegistryService;
