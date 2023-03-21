const { getContainerFromUri } = require('../utils');

module.exports = {
  name: 'resources-watcher',
  settings: {
    containerUri: null
  },
  methods: {
    resourceCreated(resourceUri, newData) {
      // This method can be implemented
    },
    resourceUpdated(resourceUri, newData, oldData) {
      // This method can be implemented
    },
    resourcePatched(resourceUri, triplesAdded, triplesRemoved) {
      // This method can be implemented
    },
    resourceDeleted(resourceUri, oldData) {
      // This method can be implemented
    },
    isMatching(resourceUri) {
      return getContainerFromUri(resourceUri) === this.settings.containerUri;
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.resourceCreated(resourceUri, newData);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.resourceUpdated(resourceUri, newData, oldData);
      }
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri, triplesAdded, triplesRemoved } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.resourcePatched(resourceUri, triplesAdded, triplesRemoved);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.resourceDeleted(resourceUri, oldData);
      }
    }
  }
};
