const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const ControlledContainerMixin = require('./controlled-container');
const { delay } = require('../utils');

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
    },
    async exist(ctx) {
      const resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      return !!resourceUri;
    },
    async waitForResourceCreation(ctx) {
      const { webId } = ctx.params;
      let resource;
      let attempts = 0;

      do {
        attempts += 1;
        if (attempts > 1) await delay(1000);
        const resourceUri = await this.actions.getResourceUri({ webId });

        // Now wait for resources to have been effectively created, because when we call the ldp.container.post action,
        // the ldp:contains predicate is added first (to ensure WAC permissions work) and then the resource is created
        if (resourceUri) {
          try {
            resource = await this.actions.get(
              { resourceUri, webId: 'system' },
              { parentCtx: ctx, meta: { $cache: false } }
            );
          } catch (e) {
            // Ignore
          }
        }
      } while (!resource || attempts > 30);

      if (!resource) throw new Error(`Resource still had not been created after 30s`);

      return resource.id || resource['@id'];
    }
  },
  hooks: {
    before: {
      async get(ctx) {
        if (!ctx.params.resourceUri) {
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
          if (!ctx.params.resourceUri) throw new MoleculerError('Resource not found', 404, 'NOT_FOUND');
        }
      },
      async patch(ctx) {
        if (!ctx.params.resourceUri) {
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
          if (!ctx.params.resourceUri) throw new MoleculerError('Resource not found', 404, 'NOT_FOUND');
        }
      },
      async put(ctx) {
        if (!ctx.params.resourceUri) {
          ctx.params.resourceUri = await this.actions.getResourceUri({ webId: ctx.params.webId }, { parentCtx: ctx });
          if (!ctx.params.resourceUri) throw new MoleculerError('Resource not found', 404, 'NOT_FOUND');
        }
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
