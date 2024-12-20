const urlJoin = require('url-join');
const { namedNode, triple } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { parseUrl, parseHeader, negotiateAccept, parseJson, parseTurtle } = require('@semapps/middlewares');

module.exports = {
  settings: {
    baseUrl: null,
    settingsDataset: null,
    endpoint: {
      path: null, // Should start with a dot
      initialData: {}
    }
  },
  dependencies: ['api', 'ldp'],
  async started() {
    if (!this.settings.baseUrl) throw new Error(`The baseUrl must be specified for service ${this.name}`);
    if (!this.settings.settingsDataset)
      throw new Error(`The settingsDataset must be specified for service ${this.name}`);

    const middlewares = [parseUrl, parseHeader, negotiateAccept, parseJson, parseTurtle];

    let aliases = {};
    aliases['GET /'] = [...middlewares, `${this.name}.endpointGet`];
    if (this.actions.endpointPost) aliases['POST /'] = [...middlewares, `${this.name}.endpointPost`];

    await this.broker.call('api.addRoute', {
      route: {
        name: `endpoint-${this.name}`,
        path: this.settings.endpoint.path,
        bodyParsers: false,
        authorization: false,
        authentication: false,
        aliases
      }
    });

    this.endpointUrl = urlJoin(this.settings.baseUrl, this.settings.endpoint.path);

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
            ...this.settings.endpoint.initialData
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        },
        { meta: { dataset: this.settings.settingsDataset, skipEmitEvent: true, skipObjectsWatcher: true } }
      );
    }
  },
  actions: {
    async endpointAdd(ctx) {
      const { predicate, object } = ctx.params;

      await ctx.call(
        'ldp.resource.patch',
        {
          resourceUri: this.endpointUrl,
          triplesToAdd: [triple(namedNode(this.endpointUrl), predicate, object)],
          webId: 'system'
        },
        { meta: { dataset: this.settings.settingsDataset, skipEmitEvent: true, skipObjectsWatcher: true } }
      );
    },
    async endpointGet(ctx) {
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
    }
  }
};
