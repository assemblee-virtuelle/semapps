const { MIME_TYPES } = require('@semapps/mime-types');
const { delay, getParentContainerUri } = require('../utils');

module.exports = {
  settings: {
    path: null,
    acceptedTypes: null,
    accept: MIME_TYPES.JSON,
    permissions: null,
    newResourcesPermissions: null,
    controlledActions: {},
    description: null,
    readOnly: false,
    excludeFromMirror: false,
    activateTombstones: true,
    podsContainer: false,
    podProvider: false
  },
  dependencies: ['ldp'],
  async started() {
    const { path, controlledActions, ...rest } = this.settings;

    const registration = await this.broker.call('ldp.registry.register', {
      path,
      name: this.name,
      controlledActions: {
        post: `${this.name}.post`,
        list: `${this.name}.list`,
        get: `${this.name}.get`,
        create: `${this.name}.create`,
        patch: `${this.name}.patch`,
        put: `${this.name}.put`,
        delete: `${this.name}.delete`,
        ...this.settings.controlledActions
      },
      ...rest
    });

    // If no path was defined in the settings, set the automatically generated path (so that it can be used below)
    if (!path) this.settings.path = registration.path;
  },
  actions: {
    async post(ctx) {
      if (!ctx.params.containerUri) {
        ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }
      return await ctx.call('ldp.container.post', ctx.params);
    },
    async list(ctx) {
      if (!ctx.params.containerUri) {
        ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }
      return ctx.call('ldp.container.get', ctx.params);
    },
    async attach(ctx) {
      if (!ctx.params.containerUri) {
        ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }
      return ctx.call('ldp.container.attach', ctx.params);
    },
    async detach(ctx) {
      if (!ctx.params.containerUri) {
        ctx.params.containerUri = await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx });
      }
      return ctx.call('ldp.container.detach', ctx.params);
    },
    get(ctx) {
      const containerParams = {};
      if (this.settings.accept) containerParams.accept = this.settings.accept;
      return ctx.call('ldp.resource.get', {
        ...containerParams,
        ...ctx.params
      });
    },
    create(ctx) {
      return ctx.call('ldp.resource.create', ctx.params);
    },
    patch(ctx) {
      return ctx.call('ldp.resource.patch', ctx.params);
    },
    put(ctx) {
      return ctx.call('ldp.resource.put', ctx.params);
    },
    delete(ctx) {
      return ctx.call('ldp.resource.delete', ctx.params);
    },
    exist(ctx) {
      return ctx.call('ldp.resource.exist', ctx.params);
    },
    getContainerUri(ctx) {
      return ctx.call('ldp.registry.getUri', { path: this.settings.path, webId: ctx.params?.webId || ctx.meta?.webId });
    },
    async waitForContainerCreation(ctx) {
      const { containerUri } = ctx.params;
      let containerExist;
      let containerAttached;

      do {
        if (containerExist === false) await delay(1000);
        containerExist = await ctx.call('ldp.container.exist', { containerUri, webId: 'system' });
      } while (!containerExist);

      const parentContainerUri = getParentContainerUri(containerUri);
      const parentContainerExist = await ctx.call('ldp.container.exist', {
        containerUri: parentContainerUri,
        webId: 'system'
      });

      // If a parent container exist, check that the child container has been attached
      // Otherwise, it may fail
      if (parentContainerExist) {
        do {
          if (containerAttached === false) await delay(1000);
          containerAttached = await ctx.call('ldp.container.includes', {
            containerUri: parentContainerUri,
            resourceUri: containerUri,
            webId: 'system'
          });
        } while (!containerAttached);
      }
    }
  }
};
