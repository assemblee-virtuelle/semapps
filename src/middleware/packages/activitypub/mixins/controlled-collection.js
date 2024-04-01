const urlJoin = require('url-join');
const { quad, namedNode } = require('@rdfjs/data-model');
const { arrayOf } = require('@semapps/ldp');

module.exports = {
  settings: {
    automaticCreation: true, // If false, the action createAndAttachCollection will need to be called manually
    path: null, // If not defined, the collection will be created in the root directory
    attachToTypes: [],
    attachPredicate: null,
    ordered: false,
    itemsPerPage: null,
    dereferenceItems: false,
    sort: { predicate: 'as:published', order: 'DESC' },
    permissions: null
  },
  async started() {
    this.collectionsInCreation = [];
  },
  actions: {
    async createAndAttachCollection(ctx) {
      const { objectUri, webId } = ctx.params;
      const collectionUri = urlJoin(objectUri, this.settings.path);

      const exists = await ctx.call('activitypub.collection.exist', { collectionUri });
      if (!exists && !this.collectionsInCreation.includes(collectionUri)) {
        // Prevent race conditions by keeping the collections being created in memory
        this.collectionsInCreation.push(collectionUri);

        // Create the collection
        await ctx.call('activitypub.collection.create', {
          collectionUri,
          config: {
            ordered: this.settings.ordered,
            summary: this.settings.summary,
            itemsPerPage: this.settings.itemsPerPage,
            dereferenceItems: this.settings.dereferenceItems,
            sortPredicate: this.settings.sort.predicate,
            sortOrder: this.settings.sort.order
          },
          permissions: this.settings.permissions, // Used by WebACL middleware if it exists
          webId
        });

        // Attach it to the object
        await ctx.call(
          'ldp.resource.patch',
          {
            resourceUri: objectUri,
            triplesToAdd: [
              quad(namedNode(objectUri), namedNode(this.settings.attachPredicate), namedNode(collectionUri))
            ],
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
      const { objectUri } = ctx.params;
      const collectionUri = urlJoin(objectUri, this.settings.path);

      const exists = await ctx.call('activitypub.collection.exist', { collectionUri, webId: 'system' });
      if (exists) {
        // Delete the collection
        await ctx.call('activitypub.collection.remove', { collectionUri, webId: 'system' });
      }
    }
  },
  methods: {
    matchType(resource) {
      return arrayOf(resource.type || resource['@type']).some(type =>
        arrayOf(this.settings.attachToTypes).includes(type)
      );
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData, webId } = ctx.params;
      if (this.matchType(newData)) {
        await this.actions.createAndAttachCollection({ objectUri: resourceUri, webId }, { parentCtx: ctx });
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData, webId } = ctx.params;
      if (this.matchType(newData) && !this.matchType(oldData)) {
        await this.actions.createAndAttachCollection({ objectUri: resourceUri, webId }, { parentCtx: ctx });
      }
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri, triplesAdded, webId } = ctx.params;
      for (const triple of triplesAdded) {
        if (
          triple.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
          this.matchType({ type: triple.object.value })
        ) {
          await this.actions.createAndAttachCollection({ objectUri: resourceUri, webId }, { parentCtx: ctx });
        }
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.matchType(oldData)) {
        await this.actions.deleteCollection({ objectUri: resourceUri }, { parentCtx: ctx });
      }
    }
  }
};
