const { getContainerFromUri } = require('../utils');

module.exports = {
  name: 'resources-watcher',
  settings: {
    containerUri: null
  },
  methods: {
    create(resourceUri, newData) {
      // This method can be implemented
    },
    update(resourceUri, newData, oldData) {
      // This method can be implemented
    },
    delete(resourceUri, oldData) {
      // This method can be implemented
    },
    isMatching(resourceUri) {
      return getContainerFromUri(resourceUri) === this.settings.containerUri;
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (ctx.meta.isMirror || !resourceUri) return;
      if (this.isMatching(resourceUri)) {
        this.create(resourceUri, newData);
      }
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData } = ctx.params;
      if (ctx.meta.isMirror || !resourceUri) return;
      if (this.isMatching(resourceUri)) {
        this.update(resourceUri, newData, oldData);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (ctx.meta.isMirror || !resourceUri) return;
      if (this.isMatching(resourceUri)) {
        this.delete(resourceUri, oldData);
      }
    }
  }
};
