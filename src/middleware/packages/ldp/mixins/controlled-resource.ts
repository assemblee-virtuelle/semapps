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
        get: `${this.name}.get`,
        patch: `${this.name}.patch`,
        ...controlledActions
      },
      typeIndex
    };

    const podProvider = await this.broker.call('ldp.getSetting', { key: 'podProvider' });
    if (!podProvider) {
      // Do not await to avoid a circular dependency (for the public/private type indexes)
      this.actions.create({});
    }

    // Do not await to avoid a circular dependency (for the public/private type indexes)
    this.broker.call('ldp.registry.register', this.registration);
  },
  actions: {
    create: {
      async handler(ctx) {
        const { webId } = ctx.params;

        const resourceExist = await this.actions.exist({ webId }, { parentCtx: ctx });

        if (!resourceExist) {
          let resource = this.settings.initialValue;

          const baseUrl = await ctx.call('ldp.getSetting', { key: 'baseUrl' });
          const allowSlugs = await ctx.call('ldp.getSetting', { key: 'allowSlugs' });
          const resourceUri = await ctx.call('triplestore.named-graph.create', {
            baseUrl,
            slug: allowSlugs ? this.settings.slug : undefined
          });

          // We pass the registration as a parameter so that the TypeIndexService can get them back in the ldp.resource.created event
          await ctx.call('ldp.resource.create', {
            resourceUri,
            resource: { '@id': resourceUri, ...resource },
            options: this.registration,
            webId: 'system'
          });

          return resourceUri;
        }
      }
    },

    getUri: {
      async handler(ctx) {
        const { webId } = ctx.params;
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
          dataset: isWebId(webId) ? getDatasetFromUri(webId) : undefined
        });

        return results[0]?.resourceUri.value;
      }
    },

    exist: {
      async handler(ctx) {
        const { webId } = ctx.params;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        return !!resourceUri;
      }
    },

    get: {
      async handler(ctx) {
        const { webId } = ctx.params;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.get', { resourceUri, ...ctx.params });
      }
    },

    patch: {
      async handler(ctx) {
        const { webId } = ctx.params;
        const resourceUri = await this.actions.getUri({ webId }, { parentCtx: ctx });
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.patch', { resourceUri, ...ctx.params });
      }
    },

    waitForCreation: {
      async handler(ctx) {
        const { webId } = ctx.params;
        let resourceUri;
        let attempts = 0;

        do {
          attempts += 1;
          if (attempts > 1) await delay(1000);
          resourceUri = await this.actions.getUri({ webId });
        } while (!resourceUri || attempts > 30);

        if (!resourceUri) throw new Error(`Resource still had not been created after 30s`);

        return resourceUri;
      }
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        if (this.settings.podProvider) {
          const { webId } = ctx.params;
          await this.actions.create({ webId });
        }
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default ControlledResourceMixin;
