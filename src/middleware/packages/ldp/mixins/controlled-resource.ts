import { ServiceSchema, Errors } from 'moleculer';
import { arrayOf, delay } from '../utils.ts';

const { MoleculerError } = Errors;

const ControlledResourceMixin = {
  settings: {
    path: null,
    types: null,
    permissions: {},
    controlledActions: {},
    typeIndex: 'public',
    // If true, a SPARQL query will be used to find the resource URI
    // This is necessary for the type indexes, otherwise we have an infinite loop
    // However this shouldn't be used in other case as it may return wrong URIs
    sparqlQuery: false
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
        if (this.settings.sparqlQuery) {
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
        } else {
          return await ctx.call('ldp.registry.getUri', {
            type: arrayOf(this.settings.types)[0],
            isContainer: false,
            isPrivate: this.settings.typeIndex === 'private'
          });
        }
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

    put: {
      async handler(ctx) {
        const resourceUri = ctx.params.resource.id || (await this.actions.getUri({}, { parentCtx: ctx }));
        if (!resourceUri) throw new MoleculerError('Not found', 404, 'NOT_FOUND');
        return await ctx.call('ldp.resource.put', {
          ...ctx.params,
          resource: { ...ctx.params.resource, id: resourceUri }
        });
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
