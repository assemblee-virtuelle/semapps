import { ServiceSchema, Errors } from 'moleculer';
import { delay, getDatasetFromUri } from '../utils.ts';

const { MoleculerError } = Errors;

const ControlledResourceMixin = {
  settings: {
    path: null,
    acceptedTypes: null,
    permissions: {},
    controlledActions: {},
    typeIndex: 'public'
  },
  dependencies: ['ldp'],
  async started() {
    const { path, acceptedTypes, permissions, controlledActions, typeIndex } = this.settings;

    this.registration = await this.broker.call('ldp.registry.register', {
      name: this.name,
      path,
      acceptedTypes,
      isContainer: false,
      permissions,
      controlledActions: {
        create: `${this.name}.create`,
        get: `${this.name}.get`,
        patch: `${this.name}.patch`,
        ...controlledActions
      },
      typeIndex
    });
  },
  actions: {
    create: {
      async handler(ctx) {
        return await ctx.call('ldp.resource.create', ctx.params);
      }
    },

    getUri: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;

        const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types: this.settings.acceptedTypes });

        const results = await ctx.call('triplestore.query', {
          query: `
            SELECT ?resourceUri
            WHERE {
              GRAPH ?resourceUri {
                ?resourceUri a ${expandedTypes.map(t => `<${t}>`).join(', ')} .
              }
            }
          `,
          dataset: getDatasetFromUri(webId)
        });

        return results[0]?.resourceUri.value;
      }
    },

    exist: {
      params: {
        resourceUri: { type: 'string', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({ webId }, { parentCtx: ctx }));
        return !!resourceUri;
      }
    },

    get: {
      params: {
        resourceUri: { type: 'string', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({ webId }, { parentCtx: ctx }));
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.get', { resourceUri, ...ctx.params });
      }
    },

    patch: {
      params: {
        resourceUri: { type: 'string', optional: true },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({ webId }, { parentCtx: ctx }));
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.patch', { resourceUri, ...ctx.params });
      }
    },

    waitForCreation: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        let resourceUri;
        let attempts = 0;

        do {
          attempts += 1;
          if (attempts > 1) await delay(1000);
          resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        } while (!resourceUri || attempts > 30);

        if (!resourceUri) throw new Error(`Resource still had not been created after 30s`);

        return resourceUri;
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default ControlledResourceMixin;
