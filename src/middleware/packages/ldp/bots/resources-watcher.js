const { getContainerFromUri } = require('../utils');

module.exports = {
  name: 'resources-watcher',
  settings: {
    containerUri: null,
  },
  methods: {
    created(resourceUri, newData) {
      // This method can be implemented
    },
    updated(resourceUri, newData, oldData) {
      // This method can be implemented
    },
    deleted(resourceUri, oldData) {
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
        this.created(resourceUri, newData);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.updated(resourceUri, newData, oldData);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.isMatching(resourceUri)) {
        this.updated(resourceUri, oldData);
      }
    }
  }
};
