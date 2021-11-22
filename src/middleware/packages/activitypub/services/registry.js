const urlJoin = require('url-join');
const pathJoin = require('path').join;
const { MIME_TYPES } = require('@semapps/mime-types');
const getCollectionRoute = require('../routes/getCollectionRoute');
const { defaultToArray, getSlugFromUri} = require('../utils');

const RegistryService = {
  name: 'activitypub.registry',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false
  },
  dependencies: ['triplestore', 'ldp'],
  async started() {
    this.registeredCollections = [];
    this.registeredContainers = await this.broker.call('ldp.registry.list');
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

      // Go through each container and add a corresponding API route
      if( containers ) {
        for (let container of Object.values(containers)) {
          await this.actions.addApiRoute({ collection: ctx.params, container });
        }
      }
    },
    async addApiRoute(ctx) {
      const { container, collection } = ctx.params;

      const collectionPath = pathJoin(container.path, ':objectId', collection.path);
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

      return this.registeredCollections.find(collection => collection.path === path);
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
    async createAndAttachCollection(ctx, objectUri, collection) {
      const collectionUri = urlJoin(objectUri, collection.path);
      const exists = await ctx.call('activitypub.collection.exist', { collectionUri, webId: 'system' });
      if (!exists) {
        // Create the collection
        await ctx.call('activitypub.collection.create', { collectionUri, webId: 'system' });

        // Attach it to the object
        await ctx.call('ldp.resource.patch', {
          resource: {
            id: objectUri,
            [collection.attachPredicate]: { '@id': collectionUri }
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      }
    },
    async deleteCollection(ctx, objectUri, collection) {
      const collectionUri = urlJoin(objectUri, collection.path);
      const exists = await ctx.call('activitypub.collection.exist', { collectionUri, webId: 'system' });
      if (exists) {
        // Delete the collection
        await ctx.call('activitypub.collection.remove', { collectionUri, webId: 'system' });
      }
    },
    // Get the collections attached to the given type
    getCollectionsByType(types) {
      types = defaultToArray(types);
      return types
        ? this.registeredCollections.filter(collection =>
          types.some(type => Array.isArray(collection.attachToTypes)
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
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { newData } = ctx.params;
      const collections = this.getCollectionsByType(newData.type || newData['@type']);
      for (let collection of collections) {
        await this.createAndAttachCollection(ctx, newData.id || newData['@id'], collection);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { newData } = ctx.params;
      const collections = this.getCollectionsByType(newData.type || newData['@type']);
      for (let collection of collections) {
        await this.createAndAttachCollection(ctx, newData.id || newData['@id'], collection);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { oldData } = ctx.params;
      const collections = this.getCollectionsByType(oldData.type || oldData['@type']);
      for (let collection of collections) {
        await this.deleteCollection(ctx, newData.id || newData['@id'], collection);
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
