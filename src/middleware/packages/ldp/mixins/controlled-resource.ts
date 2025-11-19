import { ServiceSchema, Errors } from 'moleculer';
import { delay } from '../utils.ts';

const { MoleculerError } = Errors;

const ControlledResourceMixin = {
  settings: {
    path: null,
    types: null,
    permissions: {},
    controlledActions: {},
    typeIndex: 'public'
  },
  dependencies: ['ldp'],
  async started() {
    const { path, types, permissions, controlledActions, typeIndex } = this.settings;

    this.registration = await this.broker.call('ldp.registry.register', {
      name: this.name,
      path,
      types,
      isContainer: false,
      newResourcesPermissions: permissions,
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
        const res = await ctx.call('ldp.resource.create', ctx.params);
        ctx.emit(`${this.name}.created`, res);
        return res;
      }
    },

    getUri: {
      async handler(ctx) {
        const expandedTypes = await ctx.call('jsonld.parser.expandTypes', { types: this.settings.types });

        const results = await ctx.call('triplestore.query', {
          query: `
            SELECT ?resourceUri
            WHERE {
              GRAPH ?resourceUri {
                ?resourceUri a ${expandedTypes.map(t => `<${t}>`).join(', ')} .
              }
            }
          `
        });

        return results[0]?.resourceUri.value;
      }
    },

    exist: {
      params: {
        resourceUri: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({}, { parentCtx: ctx }));
        return !!resourceUri;
      }
    },

    get: {
      async handler(ctx) {
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({}, { parentCtx: ctx }));
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.get', { ...ctx.params, resourceUri });
      }
    },

    patch: {
      async handler(ctx) {
        const resourceUri = ctx.params.resourceUri || (await this.actions.getUri({}, { parentCtx: ctx }));
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.patch', { ...ctx.params, resourceUri });
      }
    },

    waitForCreation: {
      async handler(ctx) {
        let resourceUri;
        let attempts = 0;

        do {
          attempts += 1;
          if (attempts > 1) await delay(1000);
          resourceUri = await this.actions.getUri({}, { parentCtx: ctx });
        } while (!resourceUri || attempts > 30);

        if (!resourceUri) throw new Error(`Resource still had not been created after 30s`);

        return resourceUri;
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default ControlledResourceMixin;
