const { MIME_TYPES } = require('@semapps/mime-types');
const { delay, getContainerFromUri } = require('../utils');

module.exports = {
  settings: {
    path: null,
    acceptedTypes: null,
    accept: MIME_TYPES.JSON,
    jsonContext: null,
    dereference: null,
    permissions: null,
    newResourcesPermissions: null,
    controlledActions: {},
    readOnly: false,
    excludeFromMirror: false
  },
  dependencies: ['ldp'],
  async started() {
    await this.broker.call('ldp.registry.register', {
      path: this.settings.path,
      name: this.name,
      acceptedTypes: this.settings.acceptedTypes,
      accept: this.settings.accept,
      jsonContext: this.settings.jsonContext,
      dereference: this.settings.dereference,
      permissions: this.settings.permissions,
      excludeFromMirror: this.settings.excludeFromMirror,
      newResourcesPermissions: this.settings.newResourcesPermissions,
      controlledActions: {
        post: this.name + '.post',
        list: this.name + '.list',
        get: this.name + '.get',
        create: this.name + '.create',
        put: this.name + '.put',
        delete: this.name + '.delete',
        ...this.settings.controlledActions
      },
      readOnly: this.settings.readOnly
    });
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
    get(ctx) {
      return ctx.call('ldp.resource.get', ctx.params);
    },
    create(ctx) {
      return ctx.call('ldp.resource.create', ctx.params);
    },
    put(ctx) {
      return ctx.call('ldp.resource.put', ctx.params);
    },
    delete(ctx) {
      return ctx.call('ldp.resource.delete', ctx.params);
    },
    getContainerUri(ctx) {
      return ctx.call('ldp.registry.getUri', { path: this.settings.path, webId: ctx.params.webId || ctx.meta.webId });
    }
  },
  methods: {
    async waitForContainerCreation(containerUri) {
      let containerExist, containerAttached;

      do {
        if (containerExist === false) await delay(1000);
        containerExist = await this.broker.call('ldp.container.exist', { containerUri, webId: 'system' });
      } while (!containerExist);

      const parentContainerUri = getContainerFromUri(containerUri);
      const parentContainerExist = await this.broker.call('ldp.container.exist', {
        containerUri: parentContainerUri,
        webId: 'system'
      });

      // If a parent container exist, check that the child container has been attached
      // Otherwise, it may fail
      if (parentContainerExist) {
        do {
          if (containerAttached === false) await delay(1000);
          containerAttached = await this.broker.call('ldp.container.includes', {
            containerUri: parentContainerUri,
            resourceUri: containerUri,
            webId: 'system'
          });
        } while (!containerAttached);
      }
    }
  }
};
