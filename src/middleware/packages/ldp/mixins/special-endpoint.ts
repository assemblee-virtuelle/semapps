import urlJoin from 'url-join';
import rdf from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
import { parseUrl, parseHeader, negotiateAccept, parseJson, parseTurtle } from '@semapps/middlewares';
import { ServiceSchema, defineAction } from 'moleculer';

const Schema = {
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
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    aliases['GET /'] = [...middlewares, `${this.name}.endpointGet`];
    // @ts-expect-error TS(2774): This condition will always return true since this ... Remove this comment to see the full error message
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
    endpointAdd: defineAction({
      async handler(ctx) {
        const { predicate, object } = ctx.params;

        await ctx.call(
          'ldp.resource.patch',
          {
            resourceUri: this.endpointUrl,
            triplesToAdd: [rdf.triple(rdf.namedNode(this.endpointUrl), predicate, object)],
            webId: 'system'
          },
          { meta: { dataset: this.settings.settingsDataset, skipEmitEvent: true, skipObjectsWatcher: true } }
        );
      }
    }),

    endpointGet: defineAction({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property '$responseType' does not exist on type '{... Remove this comment to see the full error message
        ctx.meta.$responseType = ctx.meta.headers?.accept;

        return await ctx.call(
          'ldp.resource.get',
          {
            resourceUri: this.endpointUrl,
            // @ts-expect-error
            accept: ctx.meta.headers?.accept,
            webId: 'system'
          },
          { meta: { dataset: this.settings.settingsDataset } }
        );
      }
    })
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
