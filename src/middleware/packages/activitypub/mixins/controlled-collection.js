const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  settings: {
    path: null,
    attachToTypes: [],
    attachPredicate: null,
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
      attachToTypes: this.settings.attachToTypes,
      attachPredicate: this.settings.attachPredicate,
      ordered: this.settings.ordered,
      itemsPerPage: this.settings.itemsPerPage,
      dereferenceItems: this.settings.dereferenceItems,
      sort: this.settings.sort,
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
    }
  },
  methods: {
    async getCollectionUri(webId) {
      // TODO make this work
      return this.broker.call('activitypub.registry.getUri', { path: this.settings.path, webId });
    }
  }
};
