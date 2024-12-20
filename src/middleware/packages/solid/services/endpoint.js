const urlJoin = require('url-join');
const { namedNode, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { parseUrl, parseHeader, negotiateAccept, parseJson, parseTurtle } = require('@semapps/middlewares');

module.exports = {
  name: 'solid-endpoint',
  settings: {
    baseUrl: null,
    settingsDataset: 'settings'
  },
  dependencies: ['api', 'ldp'],
  async started() {
    await this.broker.call('ldp.link-header.register', { actionName: 'solid-notifications.provider.getLink' });

    await this.broker.call('api.addRoute', {
      route: {
        name: 'solid-endpoint',
        path: '/.well-known/solid',
        authorization: false,
        authentication: false,
        aliases: {
          'GET /': [parseUrl, parseHeader, negotiateAccept, parseJson, parseTurtle, 'solid-endpoint.get']
        }
      }
    });

    this.endpointUrl = urlJoin(this.settings.baseUrl, '.well-known', 'solid');

    const endpointExist = await this.broker.call(
      'ldp.resource.exist',
      { resourceUri: this.endpointUrl, webId: 'system' },
      { meta: { dataset: this.settings.settingsDataset } }
    );

    if (!endpointExist) {
      await this.broker.call(
        'ldp.resource.create',
        {
          resource: {
            id: this.endpointUrl,
            type: 'http://www.w3.org/ns/pim/space#Storage'
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        },
        { meta: { dataset: this.settings.settingsDataset, skipEmitEvent: true } }
      );
    }
  },
  actions: {
    async add(ctx) {
      const { predicate, object } = ctx.params;

      await ctx.call(
        'ldp.resource.patch',
        {
          resourceUri: this.endpointUrl,
          triplesToAdd: [triple(namedNode(this.endpointUrl), predicate, object)],
          webId: 'system'
        },
        { meta: { dataset: this.settings.settingsDataset, skipEmitEvent: true } }
      );
    },
    async get(ctx) {
      ctx.meta.$responseType = ctx.meta.headers?.accept;

      return await ctx.call(
        'ldp.resource.get',
        {
          resourceUri: this.endpointUrl,
          accept: ctx.meta.headers?.accept,
          webId: 'system'
        },
        { meta: { dataset: this.settings.settingsDataset } }
      );
    },
    getLink() {
      return {
        uri: this.endpointUrl,
        rel: 'http://www.w3.org/ns/solid/terms#storageDescription'
      };
    }
  }
};
