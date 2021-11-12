const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  settings: {
    path: null,
    ordered: false,
    itemsPerPage: null,
    dereferenceItems: false,
    sort: { predicate: 'as:published', order: 'DESC' },
    permissions: {},
    controlledActions: {}
  },
  dependencies: ['activitypub'],
  async started() {
    await this.broker.call('activitypub.registry.register', {
      path: this.settings.path,
      name: this.name,
      acceptedTypes: this.settings.acceptedTypes,
      accept: MIME_TYPES.JSON || this.settings.accept,
      jsonContext: this.settings.jsonContext,
      dereference: this.settings.dereference,
      permissions: this.settings.permissions,
      controlledActions: {
        get: this.name + '.get',
        post: this.name + '.post',
        ...this.settings.controlledActions
      }
    });
  },
  actions: {
    get(ctx) {
      return ctx.call('activitypub.collection.get', ctx.params);
    },
    post() {
      throw new E.ForbiddenError();
    },
  },
  methods: {
    async getCollectionUri(webId) {
      // TODO make this work
      return this.broker.call('activitypub.registry.getUri', { path: this.settings.path, webId });
    }
  }
};
