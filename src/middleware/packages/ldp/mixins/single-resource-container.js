const { MIME_TYPES } = require('@semapps/mime-types');
const ControlledContainerMixin = require('./controlled-container');

module.exports = {
  mixins: [ControlledContainerMixin],
  settings: {
    initialValue: {},
    // Override default settings of ControlledContainerMixin
    readOnly: true,
    excludeFromMirror: true,
    activateTombstones: false
  },
  async started() {
    if (!this.settings.acceptedTypes)
      this.settings.acceptedTypes = this.settings.resource.type || this.settings.resource['@type'];

    if (!this.settings.podProvider) {
      await this.actions.initializeResource({ webId: 'system' });
    }
  },
  actions: {
    async initializeResource(ctx) {
      const { webId } = ctx.params;

      const containerUri = await this.actions.getContainerUri({ webId }, { parentCtx: ctx });
      await this.actions.waitForContainerCreation({ containerUri }, { parentCtx: ctx });

      let resource = this.settings.initialValue;
      if (!resource.type && !resource['@type']) resource.type = this.settings.acceptedTypes;

      return await this.actions.post(
        { containerUri, resource, contentType: MIME_TYPES.JSON, webId },
        { parentCtx: ctx }
      );
    },
    async getResourceUri(ctx) {
      const containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      const resourcesUris = await ctx.call('ldp.container.getUris', { containerUri });
      return resourcesUris[0];
    }
  },
  hooks: {
    before: {
      async get(ctx) {
        if (!ctx.params.resourceUri)
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      },
      async patch(ctx) {
        if (!ctx.params.resourceUri)
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      },
      async put(ctx) {
        if (!ctx.params.resourceUri)
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      if (this.settings.podProvider) {
        const { webId } = ctx.params;
        await this.actions.initializeResource({ webId });
      }
    }
  }
};
