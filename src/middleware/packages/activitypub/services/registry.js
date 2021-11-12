const urlJoin = require("url-join");
const { MIME_TYPES } = require('@semapps/mime-types');
const { getCollectionRoute } = require("../routes/getCollectionRoute");
const {defaultToArray} = require("../utils");

const CollectionRegistryService = {
  name: 'activitypub.registry',
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    podProvider: false
  },
  dependencies: ['triplestore', 'ldp.resource'],
  async started() {
    this.registeredContainers = {};
    this.registeredCollections = {};
  },
  actions: {
    async register(ctx) {
      let { path, name, attachToTypes, ...options } = ctx.params;
      if (!name) name = path;

      // Ignore undefined options
      Object.keys(options).forEach(key => (options[key] === undefined || options[key] === null) && delete options[key]);

      // Find all containers where we want to attach this collection
      const containers = await ctx.call('ldp.registry.getByType', { type: attachToTypes });

      // Go through each container and add a corresponding API route
      for( let container of containers ) {
        const collectionUri = this.settings.podProvider
          ? urlJoin(this.settings.baseUrl, ':username', container.path, ':objectId', path)
          : urlJoin(this.settings.baseUrl, container.path, ':objectId', path);

        await this.broker.call('api.addRoute', { route: getCollectionRoute(collectionUri, options.controlledActions) });
      }

      // Save the options
      this.registeredCollections[name] = { path, name, attachToTypes, ...options };
    },
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
            [collection.attachPredicate]: containerUri
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      }
    },
    // Get the collections attached to the given type
    getByType(types) {
      return this.registeredCollections.filter(collection => {
        defaultToArray(types).some(type =>
          Array.isArray(collection.attachToTypes)
            ? container.attachToTypes.includes(type)
            : container.attachToTypes === type
        )
      })
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { newData } = ctx.params;
      const collections = this.getByType(newData.type || newData['@types']);
      for( let collection of collections ) {
        await this.createAndAttachCollection(ctx, newData.id || newData['@id'], collection);
      }
    },
    async 'ldp.registry.registered'(ctx) {
      const { container } = ctx.params;

      // TODO: if not all collection have been registered, this list won't be complete
      const collections = this.getByType(container.acceptedTypes);

      for( let collection of collections ) {
        const collectionUri = this.settings.podProvider
          ? urlJoin(this.settings.baseUrl, ':username', container.path, ':objectId', collection.path)
          : urlJoin(this.settings.baseUrl, container.path, ':objectId', collection.path);

        // TODO ensure it's not a problem if the same route is added twice
        await this.broker.call('api.addRoute', { route: getCollectionRoute(collectionUri, collection.controlledActions) });
      }

      // Register the container locally
      // TODO see if we need this
      this.registeredContainers[container.name] = container;
    }
  }
};

module.exports = CollectionRegistryService;
