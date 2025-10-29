import { ServiceSchema, Errors } from 'moleculer';
import { arrayOf, delay, getDatasetFromUri, getType, isWebId } from '../utils.ts';

const { MoleculerError } = Errors;

const ControlledResourceMixin = {
  settings: {
    slug: null,
    initialValue: {},
    permissions: {},
    controlledActions: {},
    typeIndex: 'public'
  },
  dependencies: ['ldp'],
  async started() {
    const { initialValue, controlledActions, typeIndex } = this.settings;

    this.registration = {
      name: this.name,
      acceptedTypes: getType(initialValue),
      isContainer: false,
      controlledActions: {
        create: `${this.name}.create`,
        get: `${this.name}.get`,
        patch: `${this.name}.patch`,
        ...controlledActions
      },
      typeIndex
    };

    // Do not await to avoid a circular dependency (for the public/private type indexes)
    this.broker.call('ldp.registry.register', this.registration);
  },
  actions: {
    create: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;

        let resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });

        if (!resourceUri) {
          let resource = this.settings.initialValue;

          const baseUrl = await ctx.call('solid-storage.getBaseUrl', { webId });
          const allowSlugs = await ctx.call('ldp.getSetting', { key: 'allowSlugs' });
          resourceUri = await ctx.call('triplestore.named-graph.create', {
            baseUrl,
            slug: allowSlugs ? this.settings.slug : undefined
          });

          await ctx.call('ldp.resource.create', {
            resourceUri,
            resource: { '@id': resourceUri, ...resource },
            registration: this.registration,
            webId
          });
        }

        return resourceUri;
      }
    },

    getUri: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;

        const expandedTypes = await ctx.call('jsonld.parser.expandTypes', {
          types: arrayOf(getType(this.settings.initialValue))
        });

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
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        return !!resourceUri;
      }
    },

    get: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.get', { resourceUri, ...ctx.params });
      }
    },

    patch: {
      params: {
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const webId = ctx.params.webId || ctx.meta.webId;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
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
