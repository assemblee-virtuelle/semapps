const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  settings: {
    path: null,
    acceptedTypes: null,
    accept: null,
    jsonContext: null,
    dereference: null,
    permissions: null,
    newResourcesPermissions: null,
    controlledActions: {},
  },
  dependencies: ['ldp'],
  async started() {
    await this.broker.call('ldp.registry.register', {
      path: this.settings.path,
      name: this.name,
      acceptedTypes: this.settings.acceptedTypes,
      accept: MIME_TYPES.JSON || this.settings.accept,
      jsonContext: this.settings.jsonContext,
      dereference: this.settings.dereference,
      permissions: this.settings.permissions,
      newResourcesPermissions: this.settings.newResourcesPermissions,
      controlledActions: {
        get: this.name + '.get',
        list: this.name + '.list',
        create: this.name + '.create',
        patch: this.name + '.patch',
        put: this.name + '.put',
        delete: this.name + '.delete',
        ...this.settings.controlledActions
      }
    });
  },
  actions: {
    get(ctx) {
      return ctx.call('ldp.resource.get', ctx.params);
    },
    list(ctx) {
      return ctx.call('ldp.container.get', ctx.params);
    },
    create(ctx) {
      return ctx.call('ldp.resource.post', ctx.params);
    },
    patch(ctx) {
      return ctx.call('ldp.resource.patch', ctx.params);
    },
    put(ctx) {
      return ctx.call('ldp.resource.put', ctx.params);
    },
    delete(ctx) {
      return ctx.call('ldp.resource.delete', ctx.params);
    }
  },
  methods: {
    async getContainerUri(webId) {
      return this.broker.call('ldp.registry.getUri', { path: this.settings.path, webId });
    }
  }
};
